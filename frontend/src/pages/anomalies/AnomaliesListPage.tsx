// src/pages/anomalies/AnomaliesListPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";
import FilterListIcon from "@mui/icons-material/FilterList";
import TuneIcon from "@mui/icons-material/Tune";
import { anomalyService } from "../../services/anomalyService";
import AnomaliesByDomainChart from "../../components/anomalies/AnomaliesByDomainChart";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useAuth } from "../../contexts/AuthContext";

// ─── Config ───────────────────────────────────────────────────────────────────
const CRITICALITY_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  FAIBLE: { label: "Faible", color: "#2E7D32", bg: "#E8F5E9" },
  MODERE: { label: "Modéré", color: "#F57F17", bg: "#FFF8E1" },
  CRITIQUE: { label: "Critique", color: "#E65100", bg: "#FFF3E0" },
  BLOQUANT: { label: "Bloquant", color: "#C62828", bg: "#FFEBEE" },
};

const STATUS_CONFIG: Record<string, { label: string; color: any }> = {
  OUVERTE: { label: "Ouverte", color: "error" },
  ACTION_CREEE: { label: "Action créée", color: "warning" },
  EN_TRAITEMENT: { label: "En traitement", color: "info" },
  CLOTUREE: { label: "Clôturée", color: "success" },
};

const DOMAINES = [
  "Plant",
  "Magasin",
  "Sanitaires",
  "Cantine",
  "Chimique",
  "Locaux techniques",
  "Déchets",
  "Transport",
  "Infirmerie",
  "Recycleurs",
  "Incendie",
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function AnomaliesListPage() {
  const navigate = useNavigate();

  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showChart, setShowChart] = useState(true);

  // Filtres
  const [filterCriticite, setFilterCriticite] = useState("");
  const [filterStatut, setFilterStatut] = useState("");
  const [filterDomaine, setFilterDomaine] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);

  const activeFilters = {
    ...(filterCriticite && { criticite: filterCriticite }),
    ...(filterStatut && { statut: filterStatut }),
    ...(filterDomaine && { domaine: filterDomaine }),
    ...(filterDateFrom && { dateFrom: filterDateFrom }),
    ...(filterDateTo && { dateTo: filterDateTo }),
  };
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN_HSEE";

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [anomaliesData, statsData] = await Promise.all([
        anomalyService.getAll(activeFilters),
        anomalyService.getStats(activeFilters),
      ]);
      setAnomalies(anomaliesData);
      setStats(statsData);
    } catch {
      setError("Impossible de charger les anomalies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [
    filterCriticite,
    filterStatut,
    filterDomaine,
    filterDateFrom,
    filterDateTo,
  ]);

  const resetFilters = () => {
    setFilterCriticite("");
    setFilterStatut("");
    setFilterDomaine("");
    setFilterDateFrom("");
    setFilterDateTo("");
  };

  const handleExportCsv = () => anomalyService.exportCsv(anomalies);

  const hasActiveFilters = Object.keys(activeFilters).length > 0;
  const handleExportPdf = async () => {
    setPdfLoading(true);
    try {
      await anomalyService.downloadPdf(activeFilters);
    } catch {
      setError("Erreur lors de la génération du PDF.");
    } finally {
      setPdfLoading(false);
    }
  };
  return (
    <Box>
      {/* ── Header ── */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {isAdmin ? "Toutes les anomalies" : "Mes anomalies"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isAdmin
              ? `${anomalies.length} anomalie(s) au total ${hasActiveFilters ? "(filtrées)" : ""}`
              : `${anomalies.length} anomalie(s) créée(s) par vous`}
          </Typography>
        </Box>

        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<TuneIcon />}
            onClick={() => setShowFilters((p) => !p)}
          >
            Filtres
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportCsv}
            disabled={anomalies.length === 0}
          >
            CSV
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={
              pdfLoading ? <CircularProgress size={16} /> : <PictureAsPdfIcon />
            }
            onClick={handleExportPdf}
            disabled={anomalies.length === 0 || pdfLoading}
          >
            {pdfLoading ? "Génération..." : "PDF"}
          </Button>
        </Box>
      </Box>

      {/* ── Stats rapides ── */}
      {stats && (
        <Box display="flex" gap={1.5} mb={3} flexWrap="wrap">
          <Paper
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              p: 1.5,
              flex: 1,
              minWidth: 100,
              textAlign: "center",
            }}
          >
            <Typography variant="h5" fontWeight={700}>
              {stats.total}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total
            </Typography>
          </Paper>
          {Object.entries(CRITICALITY_CONFIG).map(([key, cfg]) => (
            <Paper
              key={key}
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                p: 1.5,
                flex: 1,
                minWidth: 100,
                textAlign: "center",
                bgcolor: cfg.bg,
              }}
            >
              <Typography variant="h5" fontWeight={700} color={cfg.color}>
                {stats.byCriticite[key] ?? 0}
              </Typography>
              <Typography variant="caption" sx={{ color: cfg.color }}>
                {cfg.label}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}

      {/* ── Filtres dépliables ── */}
      <Collapse in={showFilters}>
        <Paper
          elevation={0}
          sx={{ border: "1px solid", borderColor: "divider", p: 2, mb: 2 }}
        >
          <Box display="grid" gridTemplateColumns="repeat(5, 1fr)" gap={2}>
            <FormControl size="small">
              <InputLabel>Criticité</InputLabel>
              <Select
                value={filterCriticite}
                label="Criticité"
                onChange={(e) => setFilterCriticite(e.target.value)}
              >
                <MenuItem value="">Toutes</MenuItem>
                {Object.entries(CRITICALITY_CONFIG).map(([val, cfg]) => (
                  <MenuItem key={val} value={val}>
                    {cfg.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small">
              <InputLabel>Statut</InputLabel>
              <Select
                value={filterStatut}
                label="Statut"
                onChange={(e) => setFilterStatut(e.target.value)}
              >
                <MenuItem value="">Tous</MenuItem>
                {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                  <MenuItem key={val} value={val}>
                    {cfg.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small">
              <InputLabel>Domaine</InputLabel>
              <Select
                value={filterDomaine}
                label="Domaine"
                onChange={(e) => setFilterDomaine(e.target.value)}
              >
                <MenuItem value="">Tous</MenuItem>
                {DOMAINES.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Du"
              type="date"
              size="small"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Au"
              type="date"
              size="small"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          {hasActiveFilters && (
            <Button size="small" onClick={resetFilters} sx={{ mt: 1.5 }}>
              Réinitialiser les filtres
            </Button>
          )}
        </Paper>
      </Collapse>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* ── Graphique ── */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          p: 2,
          mb: 3,
          cursor: "pointer",
        }}
        onClick={() => setShowChart((p) => !p)}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={showChart ? 1 : 0}
        >
          <Typography variant="body2" fontWeight={600} color="text.secondary">
            {showChart ? "▾" : "▸"} Vue graphique
          </Typography>
        </Box>
        <Collapse in={showChart}>
          <AnomaliesByDomainChart filters={activeFilters} />
        </Collapse>
      </Paper>

      {/* ── Tableau ── */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : anomalies.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            p: 6,
            textAlign: "center",
          }}
        >
          <Typography color="text.secondary">
            Aucune anomalie trouvée.
          </Typography>
        </Paper>
      ) : (
        <Paper
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
          }}
        >
          {/* Header tableau */}
          <Box
            display="grid"
            gridTemplateColumns="1.5fr 110px 110px 110px 120px"
            gap={2}
            sx={{
              px: 2,
              py: 1.5,
              bgcolor: "grey.50",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            {[
              "Date",
              "Description",
              "Domaine",
              "Criticité",
              "Statut",
              "Actions",
            ].map((h) => (
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

          {anomalies.map((a) => {
            const crit = CRITICALITY_CONFIG[a.criticite];
            const status = STATUS_CONFIG[a.statut];
            return (
              <Box
                key={a.id}
                display="grid"
                gridTemplateColumns="1.5fr 110px 110px 110px 120px"
                gap={2}
                alignItems="center"
                sx={{
                  px: 2,
                  py: 1.5,
                  borderBottom: "0.5px solid",
                  borderColor: "divider",
                  "&:last-child": { borderBottom: "none" },
                  "&:hover": { bgcolor: "grey.50" },
                }}
              >
                {/* Description + date en caption */}
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {a.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(a.createdAt).toLocaleDateString("fr-FR")}
                    {a.checklistItem && ` · ${a.checklistItem.libelle}`}
                  </Typography>
                </Box>

                {/* Domaine */}
                <Typography variant="body2">{a.domaine || "—"}</Typography>

                {/* Criticité */}
                <Chip
                  label={crit.label}
                  size="small"
                  sx={{ bgcolor: crit.bg, color: crit.color, fontWeight: 700 }}
                />

                {/* Statut */}
                <Chip
                  label={status.label}
                  size="small"
                  color={status.color}
                  variant="outlined"
                />

                {/* Actions */}
                <Box display="flex" gap={0.5}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => navigate(`/anomalies/${a.id}`)}
                  >
                    Détails
                  </Button>
                </Box>
              </Box>
            );
          })}
        </Paper>
      )}
    </Box>
  );
}
