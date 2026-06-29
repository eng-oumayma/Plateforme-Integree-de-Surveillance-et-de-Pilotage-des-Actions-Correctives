// src/pages/checklists/FillChecklistPage.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScoreBar from "../../../components/checklists/ScoreBar";
import ChecklistItemCard from "../../../components/checklists/ChecklistItemCard";
import { checklistService } from "../../../services/checklistService";
import { checklistResponseService } from "../../../services/checklistResponseService";
import type { ChecklistTemplate } from "../../../types/checklist.types";

// ─── Score calculation côté frontend ─────────────────────────────────────────
function calcScore(
  cotationType: string,
  items: any[],
  states: Record<string, any>,
): { score: number; answered: number; deviations: number } {
  const answered = items.filter((i) => states[i.id]?.cotation != null);
  const deviations = answered.filter((i) => states[i.id]?.isDeviation).length;

  if (answered.length === 0) return { score: 0, answered: 0, deviations };

  const valid = answered.filter((i) => states[i.id]?.cotation !== "NA");
  if (valid.length === 0)
    return { score: 0, answered: answered.length, deviations };

  let total = 0,
    maxTotal = 0;

  const maxMap: Record<string, number> = {
    "0_1": 1,
    "0_1_2": 2,
    "0_1_2_NA": 2,
    "0_1_2_3": 3,
    "0_4_6_8_10": 10,
  };

  for (const item of valid) {
    const val = Number(states[item.id]?.cotation);
    total += val;
    if (cotationType === "TARGET") {
      maxTotal += Number(item.target) || 3;
    } else {
      maxTotal += maxMap[cotationType] ?? 2;
    }
  }

  const score = maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0;
  return { score, answered: answered.length, deviations };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function FillChecklistPage() {
  const { inspectionId, templateId } = useParams<{
    inspectionId: string;
    templateId: string;
  }>();
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────────────────────────
  const [template, setTemplate] = useState<ChecklistTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [itemStates, setItemStates] = useState<Record<string, any>>({});
  const [sections, setSections] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const autoSaveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Load template + existing responses ────────────────────────────────────
  useEffect(() => {
    if (!inspectionId || !templateId) return;

    const init = async () => {
      setLoading(true);
      try {
        // Charger le template
        const t = await checklistService.getById(templateId);
        setTemplate(t);

        // Extraire les sections uniques
        const sects = Array.from(
          new Set(t.items.map((i: any) => i.section || "Général")),
        );
        setSections(sects);
        setActiveSection(sects[0] ?? "");

        // Charger les réponses existantes (reprise du draft)
        const responses =
          await checklistResponseService.getByInspection(inspectionId);
        const initial: Record<string, any> = {};
        for (const r of responses) {
          if (r.item?.id) {
            initial[r.item.id] = {
              cotation: r.cotation ?? null,
              observation: r.observation ?? "",
              analyseCauses: r.analyseCauses ?? "",
              responsable: r.responsable ?? "",
              delai: r.delai ? r.delai.slice(0, 10) : "",
              isDeviation: r.isDeviation ?? false,
              photos: r.photos ?? [],
            };
          }
        }
        setItemStates(initial);
      } catch {
        setError("Impossible de charger la checklist.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [inspectionId, templateId]);

  // ── Autosave toutes les 30s ────────────────────────────────────────────────
  useEffect(() => {
    autoSaveRef.current = setInterval(() => {
      setLastSaved(new Date());
    }, 30000);
    return () => {
      if (autoSaveRef.current) clearInterval(autoSaveRef.current);
    };
  }, []);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleStateChange = useCallback((itemId: string, state: any) => {
    setItemStates((prev) => ({ ...prev, [itemId]: state }));
  }, []);

  // Score calculé en temps réel
  const { score, answered, deviations } = template
    ? calcScore(template.cotationType, template.items, itemStates)
    : { score: 0, answered: 0, deviations: 0 };

  const total = template?.items?.length ?? 0;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await checklistResponseService.checkComplete(
        inspectionId!,
        templateId!,
      );
      if (!result.complete) {
        setSubmitOpen(false);
        setError(
          `Checklist incomplète — ${result.missing} item(s) sans réponse.`,
        );
        return;
      }
      // ✅ Naviguer vers les résultats
      navigate(`/checklists/results/${inspectionId}/${templateId}`);
    } catch {
      setError("Erreur lors de la soumission.");
    } finally {
      setSubmitting(false);
      setSubmitOpen(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );

  if (error && !template)
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  // ── Sections ───────────────────────────────────────────────────────────────
  const currentItems =
    template?.items?.filter(
      (i: any) => (i.section || "Général") === activeSection,
    ) ?? [];

  const sectionProgress = (section: string) => {
    const its =
      template?.items?.filter(
        (i: any) => (i.section || "Général") === section,
      ) ?? [];
    const done = its.filter((i) => itemStates[i.id]?.cotation != null).length;
    return its.length > 0 ? Math.round((done / its.length) * 100) : 0;
  };

  return (
    <Box sx={{ maxWidth: 680, mx: "auto", pb: 8 }}>
      {/* ── Sticky score bar ── */}
      <ScoreBar
        score={score}
        answered={answered}
        total={total}
        deviations={deviations}
      />

      {/* ── Header ── */}
      <Box px={2} pt={2} pb={1}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/inspections")}
          color="inherit"
          size="small"
        >
          Retour
        </Button>
        <Box mt={1}>
          <Typography variant="h6" fontWeight={700}>
            {template?.titre}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {template?.domaine} · {total} items
          </Typography>
          {lastSaved && (
            <Typography variant="caption" color="success.main">
              ✓ Sauvegardé à{" "}
              {lastSaved.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          )}
        </Box>
      </Box>

      {error && (
        <Box px={2} mb={1}>
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        </Box>
      )}

      {/* ── Navigation sections (swipe entre sections) ── */}
      <Box
        display="flex"
        gap={1}
        px={2}
        pb={1.5}
        sx={{ overflowX: "auto", "&::-webkit-scrollbar": { display: "none" } }}
      >
        {sections.map((section) => {
          const prog = sectionProgress(section);
          const active = section === activeSection;
          return (
            <Box
              key={section}
              onClick={() => setActiveSection(section)}
              sx={{
                flexShrink: 0,
                px: 1.5,
                py: 0.75,
                borderRadius: 2,
                border: "1px solid",
                borderColor: active ? "primary.main" : "divider",
                bgcolor: active ? "primary.main" : "background.paper",
                cursor: "pointer",
                minWidth: 80,
                textAlign: "center",
              }}
            >
              <Typography
                variant="caption"
                fontWeight={active ? 600 : 400}
                color={active ? "white" : "text.secondary"}
                display="block"
                noWrap
              >
                {section.length > 15 ? section.slice(0, 15) + "…" : section}
              </Typography>
              <Typography
                variant="caption"
                color={active ? "rgba(255,255,255,0.8)" : "text.disabled"}
              >
                {prog}%
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Divider />

      {/* ── Items de la section active ── */}
      <Box px={2} pt={2}>
        <Typography
          variant="subtitle2"
          fontWeight={600}
          color="text.secondary"
          mb={1.5}
        >
          {activeSection} — {currentItems.length} item(s)
        </Typography>

        {currentItems.map((item: any, idx: number) => (
          <ChecklistItemCard
            key={item.id}
            index={idx}
            item={item}
            cotationType={template!.cotationType}
            inspectionId={inspectionId!}
            initialState={itemStates[item.id]}
            onStateChange={handleStateChange}
          />
        ))}
      </Box>

      {/* ── Navigation prev/next section ── */}
      <Box display="flex" justifyContent="space-between" px={2} pt={2} pb={4}>
        <Button
          variant="outlined"
          color="inherit"
          disabled={sections.indexOf(activeSection) === 0}
          onClick={() => {
            const idx = sections.indexOf(activeSection);
            if (idx > 0) setActiveSection(sections[idx - 1]);
          }}
        >
          ← Section précédente
        </Button>

        {sections.indexOf(activeSection) < sections.length - 1 ? (
          <Button
            variant="contained"
            onClick={() => {
              const idx = sections.indexOf(activeSection);
              setActiveSection(sections[idx + 1]);
            }}
          >
            Section suivante →
          </Button>
        ) : (
          <Button
            variant="contained"
            color="success"
            startIcon={<SendIcon />}
            onClick={() => setSubmitOpen(true)}
          >
            Soumettre
          </Button>
        )}
      </Box>

      {/* ── FAB sauvegarde manuelle ── */}
      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 100,
        }}
      >
        <Button
          variant="contained"
          color="inherit"
          size="small"
          startIcon={<SaveIcon />}
          onClick={() => setLastSaved(new Date())}
          sx={{ bgcolor: "white", boxShadow: 3, borderRadius: 9999 }}
        >
          Sauvegarder
        </Button>
      </Box>

      {/* ── Dialog soumission ── */}
      <Dialog
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Soumettre la checklist</DialogTitle>
        <DialogContent>
          <Box textAlign="center" py={1}>
            <Typography
              variant="h3"
              fontWeight={700}
              color={
                score >= 85
                  ? "success.main"
                  : score >= 75
                    ? "warning.main"
                    : "error.main"
              }
            >
              {score}%
            </Typography>
            <Chip
              label={score >= 85 ? "VERT" : score >= 75 ? "JAUNE" : "ROUGE"}
              color={
                score >= 85 ? "success" : score >= 75 ? "warning" : "error"
              }
              sx={{ mt: 1, fontWeight: 700 }}
            />
            <Typography variant="body2" color="text.secondary" mt={2}>
              {answered}/{total} items répondus · {deviations} déviation(s)
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmitOpen(false)} color="inherit">
            Annuler
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            disabled={submitting}
            startIcon={
              submitting ? <CircularProgress size={18} /> : <SendIcon />
            }
          >
            {submitting ? "Envoi..." : "Confirmer"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
