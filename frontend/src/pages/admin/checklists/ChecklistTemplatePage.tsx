// src/pages/checklists/ChecklistTemplatePage.tsx
// Page d'aperçu read-only d'un template : liste des items groupés par section
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Chip,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  Collapse,
  IconButton,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { checklistService } from "../../../services/checklistService";
import { inspectionService } from "../../../services/inspectionService";
import type { ChecklistTemplate } from "../../../types/checklist.types";

// ─── Cotation labels ───────────────────────────────────────────────────────
const COTATION_LABELS: Record<string, string> = {
  "0_1": "0 / 1  (Non existant / Suffisant)",
  "0_1_2": "0 / 1 / 2  (Inexistant / Insuffisant / Acceptable)",
  "0_1_2_NA": "0 / 1 / 2 / NA",
  "0_1_2_3": "0 / 1 / 2 / 3",
  "0_4_6_8_10": "0 / 4 / 6 / 8 / 10",
  TARGET: "Variable par item (target = max)",
};

// Couleur de badge pour chaque valeur de cotation
const COTATION_CHIPS: Record<string, { values: string[]; colors: string[] }> = {
  "0_1": { values: ["0", "1"], colors: ["#FFEBEE", "#E8F5E9"] },
  "0_1_2": {
    values: ["0", "1", "2"],
    colors: ["#FFEBEE", "#FFF8E1", "#E8F5E9"],
  },
  "0_1_2_NA": {
    values: ["0", "1", "2", "NA"],
    colors: ["#FFEBEE", "#FFF8E1", "#E8F5E9", "#F5F5F5"],
  },
  "0_1_2_3": {
    values: ["0", "1", "2", "3"],
    colors: ["#FFEBEE", "#FFF8E1", "#E8F5E9", "#E3F2FD"],
  },
  "0_4_6_8_10": {
    values: ["0", "4", "6", "8", "10"],
    colors: ["#FFEBEE", "#FFF3E0", "#FFF8E1", "#F1F8E9", "#E8F5E9"],
  },
  TARGET: {
    values: ["0", "1", "2", "3"],
    colors: ["#FFEBEE", "#FFF8E1", "#E8F5E9", "#E3F2FD"],
  },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function ChecklistTemplatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [template, setTemplate] = useState<ChecklistTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inspectionId, setInspectionId] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  // ── Load template ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const t = await checklistService.getById(id);
        setTemplate(t);
        // Ouvrir toutes les sections par défaut
        const sections = Array.from(
          new Set((t.items ?? []).map((i: any) => i.section || "Général")),
        ) as string[];
        const openAll: Record<string, boolean> = {};
        sections.forEach((s) => {
          openAll[s] = true;
        });
        setOpenSections(openAll);
      } catch {
        setError("Template introuvable.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // ── Chercher une inspection EN_COURS pour ce domaine ──────────────────────
  useEffect(() => {
    if (!template) return;
    inspectionService
      .getAll({ statut: "EN_COURS" })
      .then((inspections: any[]) => {
        const match = inspections.find((i) => i.domaine === template.domaine);
        if (match) setInspectionId(match.id);
      })
      .catch(() => {});
  }, [template]);

  const toggleSection = (name: string) =>
    setOpenSections((prev) => ({ ...prev, [name]: !prev[name] }));

  // ── Grouper items par section ──────────────────────────────────────────────
  const sections = template
    ? Array.from(
        new Set((template.items ?? []).map((i: any) => i.section || "Général")),
      )
    : [];

  const getItemsBySection = (section: string) =>
    (template?.items ?? [])
      .filter((i: any) => (i.section || "Général") === section)
      .sort((a: any, b: any) => a.ordre - b.ordre);

  // ── Loading / Error ────────────────────────────────────────────────────────
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

  if (error || !template)
    return (
      <Box p={3}>
        <Alert severity="error">{error || "Template introuvable."}</Alert>
        <Button
          sx={{ mt: 2 }}
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/checklists")}
        >
          Retour
        </Button>
      </Box>
    );

  const cotationConfig =
    COTATION_CHIPS[template.cotationType] ?? COTATION_CHIPS["0_1_2"];

  return (
    <Box maxWidth={800} mx="auto" pb={6}>
      {/* ── Header ── */}
      <Box
        display="flex"
        alignItems="flex-start"
        justifyContent="space-between"
        mb={3}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/checklists")}
            color="inherit"
          >
            Retour
          </Button>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {template.titre}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Aperçu du template · {template.domaine}
            </Typography>
          </Box>
        </Box>

        {/* Bouton Remplir si inspection EN_COURS */}
        {inspectionId && template.actif && (
          <Tooltip title="Remplir cette checklist pour l'inspection en cours">
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={() =>
                navigate(`/checklists/fill/${inspectionId}/${template.id}`)
              }
            >
              Remplir
            </Button>
          </Tooltip>
        )}
      </Box>

      {/* ── Infos générales ── */}
      <Paper
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", mb: 3, p: 2 }}
      >
        <Box display="grid" gridTemplateColumns="1fr 1fr 1fr 1fr" gap={2}>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Domaine
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {template.domaine}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Version
            </Typography>
            <Chip
              label={`v${template.version}`}
              size="small"
              variant="outlined"
            />
          </Box>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Statut
            </Typography>
            <Chip
              label={template.actif ? "Actif" : "Inactif"}
              size="small"
              color={template.actif ? "success" : "default"}
            />
          </Box>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Nb items
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {template.items?.length ?? 0} items
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* Type de cotation */}
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            mb={0.75}
          >
            Type de cotation —{" "}
            {COTATION_LABELS[template.cotationType] ?? template.cotationType}
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {cotationConfig.values.map((val, idx) => (
              <Chip
                key={val}
                label={val}
                size="small"
                sx={{
                  bgcolor: cotationConfig.colors[idx],
                  fontWeight: 700,
                  fontSize: 13,
                  height: 26,
                }}
              />
            ))}
          </Box>
        </Box>
      </Paper>

      {/* ── Sections ── */}
      <Typography
        variant="subtitle2"
        fontWeight={600}
        color="text.secondary"
        mb={1.5}
      >
        ITEMS ({template.items?.length ?? 0}) · {sections.length} section(s)
      </Typography>

      {sections.map((section, sIdx) => {
        const items = getItemsBySection(section);
        const isOpen = openSections[section] ?? true;

        return (
          <Paper
            key={section}
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              mb: 1.5,
              overflow: "hidden",
            }}
          >
            {/* Header section */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              px={2}
              py={1.25}
              onClick={() => toggleSection(section)}
              sx={{
                bgcolor: "grey.50",
                cursor: "pointer",
                "&:hover": { bgcolor: "grey.100" },
              }}
            >
              <Box display="flex" alignItems="center" gap={1.5}>
                <Box
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    color="white"
                    fontSize={11}
                  >
                    {sIdx + 1}
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight={500}>
                  {section}
                </Typography>
                <Chip
                  label={`${items.length} item${items.length > 1 ? "s" : ""}`}
                  size="small"
                  variant="outlined"
                  sx={{ height: 20, fontSize: 11 }}
                />
              </Box>
              <IconButton size="small">
                {isOpen ? (
                  <ExpandLessIcon fontSize="small" />
                ) : (
                  <ExpandMoreIcon fontSize="small" />
                )}
              </IconButton>
            </Box>

            <Collapse in={isOpen}>
              <Divider />

              {/* Entête colonnes */}
              <Box
                display="grid"
                gridTemplateColumns="32px 1fr 120px"
                gap={1}
                sx={{
                  px: 2,
                  py: 1,
                  bgcolor: "grey.50",
                  borderBottom: "0.5px solid",
                  borderColor: "divider",
                }}
              >
                {["#", "Libellé", "Cible / Target"].map((h) => (
                  <Typography
                    key={h}
                    variant="caption"
                    fontWeight={600}
                    color="text.secondary"
                    textTransform="uppercase"
                  >
                    {h}
                  </Typography>
                ))}
              </Box>

              {/* Lignes items */}
              {items.map((item: any, idx: number) => (
                <Box
                  key={item.id}
                  display="grid"
                  gridTemplateColumns="32px 1fr 120px"
                  gap={1}
                  alignItems="center"
                  sx={{
                    px: 2,
                    py: 1.25,
                    borderBottom:
                      idx < items.length - 1 ? "0.5px solid" : "none",
                    borderColor: "divider",
                    "&:hover": { bgcolor: "grey.50" },
                  }}
                >
                  {/* Numéro */}
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <CheckCircleOutlineIcon
                      sx={{ fontSize: 16, color: "text.disabled" }}
                    />
                  </Box>

                  {/* Libellé */}
                  <Typography variant="body2" fontSize={13} lineHeight={1.4}>
                    {item.libelle}
                  </Typography>

                  {/* Target */}
                  <Typography variant="caption" color="text.secondary">
                    {item.target || "—"}
                  </Typography>
                </Box>
              ))}
            </Collapse>
          </Paper>
        );
      })}

      {/* ── Bouton Remplir en bas ── */}
      {inspectionId && template.actif && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrowIcon />}
            onClick={() =>
              navigate(`/checklists/fill/${inspectionId}/${template.id}`)
            }
            sx={{ minWidth: 220 }}
          >
            Remplir cette checklist
          </Button>
        </Box>
      )}

      {/* Message si pas d'inspection en cours */}
      {!inspectionId && template.actif && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Aucune inspection en cours pour le domaine{" "}
          <strong>{template.domaine}</strong>. Créez une inspection depuis la
          page Inspections pour pouvoir remplir cette checklist.
        </Alert>
      )}
    </Box>
  );
}
