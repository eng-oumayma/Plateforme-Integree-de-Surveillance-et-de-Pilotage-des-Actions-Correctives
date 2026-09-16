// src/pages/checklists/ChecklistResultsPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Collapse from "@mui/material/Collapse";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ScoreHistoryChart from "../../../components/checklists/ScoreHistoryChart";
import { checklistResponseService } from "../../../services/checklistResponseService";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getScoreColor(score: number): string {
  if (score >= 85) return "#4CAF50";
  if (score >= 75) return "#FFC107";
  return "#F44336";
}

function getScoreStatus(score: number): {
  label: string;
  color: "success" | "warning" | "error";
} {
  if (score >= 85) return { label: "VERT", color: "success" };
  if (score >= 75) return { label: "JAUNE", color: "warning" };
  return { label: "ROUGE", color: "error" };
}

function getCotationColor(val: string | null): {
  bg: string;
  color: string;
  icon: React.ReactNode;
} {
  if (!val)
    return {
      bg: "#F5F5F5",
      color: "#999",
      icon: <RemoveCircleIcon sx={{ fontSize: 16, color: "#ccc" }} />,
    };
  if (val === "NA")
    return {
      bg: "#F5F5F5",
      color: "#757575",
      icon: <RemoveCircleIcon sx={{ fontSize: 16, color: "#9E9E9E" }} />,
    };
  const n = Number(val);
  if (n === 0)
    return {
      bg: "#FFEBEE",
      color: "#C62828",
      icon: <CancelIcon sx={{ fontSize: 16, color: "#F44336" }} />,
    };
  if (n <= 1)
    return {
      bg: "#FFF3E0",
      color: "#E65100",
      icon: <WarningAmberIcon sx={{ fontSize: 16, color: "#FF9800" }} />,
    };
  return {
    bg: "#E8F5E9",
    color: "#2E7D32",
    icon: <CheckCircleIcon sx={{ fontSize: 16, color: "#4CAF50" }} />,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ChecklistResultsPage() {
  const { inspectionId, templateId } = useParams<{
    inspectionId: string;
    templateId: string;
  }>();
  const navigate = useNavigate();

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exportLoading, setExportLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [showHistory, setShowHistory] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!inspectionId || !templateId) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await checklistResponseService.getFullResult(
          inspectionId,
          templateId,
        );
        setResult(data);
        // Ouvrir la première section par défaut
        if (data.sections?.[0]) {
          setExpandedSections({ [data.sections[0].name]: true });
        }
      } catch {
        setError("Impossible de charger les résultats.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [inspectionId, templateId]);

  const handleExportPdf = async () => {
    setExportLoading(true);
    try {
      await checklistResponseService.downloadPdf(inspectionId!, templateId!);
    } catch {
      setError("Erreur lors de la génération du PDF.");
    } finally {
      setExportLoading(false);
    }
  };

  const toggleSection = (name: string) =>
    setExpandedSections((prev) => ({ ...prev, [name]: !prev[name] }));

  // ── Loading ──────────────────────────────────────────────────────────────
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

  if (error || !result)
    return (
      <Box p={3}>
        <Alert severity="error">{error || "Résultats introuvables."}</Alert>
      </Box>
    );

  const statusInfo = getScoreStatus(result.score);
  const scoreColor = getScoreColor(result.score);

  return (
    <Box maxWidth={860} mx="auto" pb={6}>
      {/* ── Header ── */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/inspections")}
            color="inherit"
          >
            Retour
          </Button>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Résultats — {result.template.domaine}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {result.template.titre} · v{result.template.version}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          startIcon={
            exportLoading ? (
              <CircularProgress size={16} />
            ) : (
              <PictureAsPdfIcon />
            )
          }
          onClick={handleExportPdf}
          disabled={exportLoading}
        >
          {exportLoading ? "Génération..." : "Exporter PDF"}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* ── Score principal ── */}
      <Card
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", mb: 3 }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            display="grid"
            gridTemplateColumns="auto 1fr"
            gap={3}
            alignItems="center"
          >
            {/* Score circulaire */}
            <Box textAlign="center" sx={{ minWidth: 120 }}>
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  border: `6px solid ${scoreColor}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight={700}
                  color={scoreColor}
                  lineHeight={1}
                >
                  {result.score}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  %
                </Typography>
              </Box>
              <Chip
                label={statusInfo.label}
                color={statusInfo.color}
                size="small"
                sx={{ mt: 1, fontWeight: 700 }}
              />
            </Box>

            {/* Stats */}
            <Box>
              <Box
                display="grid"
                gridTemplateColumns="1fr 1fr 1fr"
                gap={2}
                mb={2}
              >
                {[
                  {
                    label: "Items répondus",
                    value: `${result.answeredItems}/${result.totalItems}`,
                    color: "text.primary",
                  },
                  {
                    label: "Déviations",
                    value: result.deviations,
                    color:
                      result.deviations > 0 ? "error.main" : "success.main",
                  },
                  {
                    label: "Complétude",
                    value: `${result.completionRate}%`,
                    color: "text.primary",
                  },
                ].map(({ label, value, color }) => (
                  <Box
                    key={label}
                    sx={{
                      bgcolor: "grey.50",
                      borderRadius: 2,
                      p: 1.5,
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {label}
                    </Typography>
                    <Typography variant="h6" fontWeight={600} color={color}>
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Barre progression */}
              <Box>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    Progression
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {result.completionRate}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={result.completionRate}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: "grey.200",
                    "& .MuiLinearProgress-bar": { bgcolor: scoreColor },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* ── Résumé déviations ── */}
      {result.deviations > 0 && (
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "warning.light",
            mb: 3,
            bgcolor: "#FFFDE7",
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" gap={1} mb={1.5}>
              <WarningAmberIcon color="warning" fontSize="small" />
              <Typography
                variant="subtitle2"
                fontWeight={600}
                color="warning.dark"
              >
                {result.deviations} déviation(s) détectée(s)
              </Typography>
            </Box>
            {result.sections
              .flatMap((s: any) => s.items)
              .filter((i: any) => i.isDeviation)
              .map((item: any, idx: number) => (
                <Box
                  key={idx}
                  sx={{
                    borderLeft: "3px solid",
                    borderColor: "warning.main",
                    pl: 1.5,
                    py: 0.75,
                    mb: 1,
                    bgcolor: "white",
                    borderRadius: "0 4px 4px 0",
                  }}
                >
                  <Typography variant="body2" fontWeight={500}>
                    {item.libelle}
                  </Typography>
                  {item.observation && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Observation : {item.observation}
                    </Typography>
                  )}
                  {item.responsable && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Responsable : {item.responsable}
                      {item.delai &&
                        ` · Délai : ${new Date(item.delai).toLocaleDateString("fr-FR")}`}
                    </Typography>
                  )}
                </Box>
              ))}
          </CardContent>
        </Card>
      )}

      {/* ── Détail par section ── */}
      <Typography
        variant="subtitle2"
        fontWeight={600}
        color="text.secondary"
        mb={1.5}
      >
        DÉTAIL PAR SECTION
      </Typography>

      {result.sections.map((section: any) => {
        const isOpen = expandedSections[section.name] ?? false;
        const sectionColor = getScoreColor(section.sectionScore);

        return (
          <Paper
            key={section.name}
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
              py={1.5}
              sx={{
                bgcolor: "grey.50",
                cursor: "pointer",
                "&:hover": { bgcolor: "grey.100" },
              }}
              onClick={() => toggleSection(section.name)}
            >
              <Box display="flex" alignItems="center" gap={1.5}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: sectionColor,
                  }}
                />
                <Typography variant="body2" fontWeight={500}>
                  {section.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {section.sectionAnswered}/{section.sectionTotal} items
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  color={sectionColor}
                >
                  {section.sectionScore}%
                </Typography>
                <IconButton size="small">
                  {isOpen ? (
                    <ExpandLessIcon fontSize="small" />
                  ) : (
                    <ExpandMoreIcon fontSize="small" />
                  )}
                </IconButton>
              </Box>
            </Box>

            <Collapse in={isOpen}>
              <Divider />
              {/* Entête colonnes */}
              <Box
                display="grid"
                gridTemplateColumns="32px 1fr 80px 160px"
                gap={1}
                sx={{
                  px: 2,
                  py: 1,
                  bgcolor: "grey.50",
                  borderBottom: "0.5px solid",
                  borderColor: "divider",
                }}
              >
                {["", "Libellé", "Cotation", "Observation"].map((h) => (
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

              {/* Items */}
              {section.items.map((item: any, idx: number) => {
                const cotInfo = getCotationColor(item.cotation);
                return (
                  <Box
                    key={item.id}
                    display="grid"
                    gridTemplateColumns="32px 1fr 80px 160px"
                    gap={1}
                    alignItems="flex-start"
                    sx={{
                      px: 2,
                      py: 1.25,
                      borderBottom:
                        idx < section.items.length - 1 ? "0.5px solid" : "none",
                      borderColor: "divider",
                      bgcolor: item.isDeviation ? "#FFF8E1" : "white",
                      "&:hover": {
                        bgcolor: item.isDeviation ? "#FFF3CD" : "grey.50",
                      },
                    }}
                  >
                    {/* Icône statut */}
                    <Box pt={0.25}>{cotInfo.icon}</Box>

                    {/* Libellé */}
                    <Box>
                      <Typography variant="body2" fontSize={13}>
                        {item.libelle}
                      </Typography>
                      {item.target && (
                        <Typography variant="caption" color="text.disabled">
                          Cible : {item.target}
                        </Typography>
                      )}
                      {/* Photos miniatures */}
                      {item.photos?.length > 0 && (
                        <Box display="flex" gap={0.5} mt={0.5} flexWrap="wrap">
                          {item.photos.map((photo: any) => (
                            <Tooltip key={photo.id} title="Voir la photo">
                              <Box
                                onClick={() =>
                                  setLightboxPhoto(
                                    `http://localhost:3000${photo.url}`,
                                  )
                                }
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: 1,
                                  overflow: "hidden",
                                  cursor: "pointer",
                                  border: "1px solid",
                                  borderColor: "divider",
                                }}
                              >
                                <img
                                  src={`http://localhost:3000${photo.url}`}
                                  alt={photo.originalName}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              </Box>
                            </Tooltip>
                          ))}
                        </Box>
                      )}
                    </Box>

                    {/* Cotation badge */}
                    <Box>
                      {item.cotation ? (
                        <Chip
                          label={item.cotation}
                          size="small"
                          sx={{
                            bgcolor: cotInfo.bg,
                            color: cotInfo.color,
                            fontWeight: 700,
                            fontSize: 13,
                            height: 26,
                          }}
                        />
                      ) : (
                        <Typography variant="caption" color="text.disabled">
                          Non répondu
                        </Typography>
                      )}
                      {item.isDeviation && (
                        <Chip
                          label="Déviation"
                          size="small"
                          color="warning"
                          sx={{
                            mt: 0.5,
                            height: 18,
                            fontSize: 10,
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </Box>

                    {/* Observation */}
                    <Box>
                      {item.observation && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          {item.observation}
                        </Typography>
                      )}
                      {item.responsable && (
                        <Typography
                          variant="caption"
                          color="text.disabled"
                          display="block"
                        >
                          → {item.responsable}
                          {item.delai &&
                            ` · ${new Date(item.delai).toLocaleDateString("fr-FR")}`}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Collapse>
          </Paper>
        );
      })}

      {/* ── Historique scores ── */}
      <Divider sx={{ my: 3 }} />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        onClick={() => setShowHistory((p) => !p)}
        sx={{ cursor: "pointer" }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          Historique des scores — {result.template.domaine}
        </Typography>
        <IconButton size="small">
          {showHistory ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={showHistory}>
        <Card
          elevation={0}
          sx={{ border: "1px solid", borderColor: "divider", p: 2 }}
        >
          <ScoreHistoryChart />
        </Card>
      </Collapse>

      {/* ── Lightbox photo ── */}
      {lightboxPhoto && (
        <Box
          onClick={() => setLightboxPhoto(null)}
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            bgcolor: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <img
            src={lightboxPhoto}
            alt="photo"
            style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: 8 }}
          />
        </Box>
      )}
    </Box>
  );
}
