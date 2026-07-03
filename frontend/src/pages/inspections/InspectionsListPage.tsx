import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  InputAdornment,
  Paper,
} from "@mui/material";

// Icons
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocationOffIcon from "@mui/icons-material/LocationOff";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { inspectionService } from "../../services/inspectionService";
import { checklistService } from "../../services/checklistService";
import Tooltip from "@mui/material/Tooltip";
// --- Configuration des Domaines (Doit correspondre au backend) ---
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

const STATUS_COLORS: Record<
  string,
  "info" | "warning" | "success" | "default"
> = {
  EN_COURS: "info",
  TERMINEE: "warning",
  VALIDEE: "success",
  ANNULEE: "default",
};

const STATUS_LABELS: Record<string, string> = {
  EN_COURS: "En cours",
  TERMINEE: "Terminée",
  VALIDEE: "Validée",
  ANNULEE: "Annulée",
};

export default function InspectionsListPage() {
  const navigate = useNavigate();
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [globalError, setGlobalError] = useState("");

  // Targets pour les Dialogues (comme dans UsersPage)
  const [statusTarget, setStatusTarget] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [templateIds, setTemplateIds] = useState<Record<string, string>>({});
  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchInspections = useCallback(async () => {
    setLoading(true);
    setGlobalError("");
    try {
      const data = await inspectionService.getAll({
        ...(domainFilter && { domaine: domainFilter }),
        ...(statusFilter && { statut: statusFilter }),
      });
      setInspections(data);
    } catch {
      setGlobalError("Impossible de charger les inspections.");
    } finally {
      setLoading(false);
    }
  }, [domainFilter, statusFilter]);

  useEffect(() => {
    fetchInspections();
  }, [fetchInspections]);
  useEffect(() => {
    checklistService
      .getAll()
      .then((templates) => {
        const map: Record<string, string> = {};
        templates
          .filter((t: any) => t.actif)
          .forEach((t: any) => {
            map[t.domaine] = t.id;
          });
        setTemplateIds(map);
      })
      .catch(() => {});
  }, []);

  // ── Filtrage local par recherche textuelle ────────────────────────────────
  const filteredInspections = inspections.filter((i) => {
    const matchesSearch =
      !search ||
      `${i.domaine} ${i.site} ${i.auditeur?.firstName} ${i.auditeur?.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase());
    return matchesSearch;
  });

  // ── Action : Mise à jour du Statut ────────────────────────────────────────
  const handleUpdateStatus = async (newStatus: string) => {
    if (!statusTarget) return;
    setUpdating(true);
    try {
      await inspectionService.updateStatut(statusTarget.id, newStatus);
      setStatusTarget(null);
      fetchInspections();
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          "Erreur lors de la mise à jour du statut.",
      );
    } finally {
      setUpdating(false);
    }
  };

  // ── Action : Suppression ──────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await inspectionService.remove(deleteTarget.id);
      setDeleteTarget(null);
      setInspections((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Erreur lors de la suppression.");
    } finally {
      setDeleting(false);
    }
  };

  // ── Action : Export CSV Filtré ────────────────────────────────────────────
  const handleExportCSV = () => {
    if (filteredInspections.length === 0) return;

    const headers = [
      "ID",
      "Domaine",
      "Site",
      "Auditeur",
      "Date Prevue",
      "Statut",
      "Latitude",
      "Longitude",
    ];

    const rows = filteredInspections.map((i) => [
      i.id,
      `"${i.domaine}"`,
      `"${i.site}"`,
      `"${i.auditeur ? `${i.auditeur.firstName} ${i.auditeur.lastName}` : "N/A"}"`,
      new Date(i.datePrevue).toLocaleDateString("fr-FR"),
      STATUS_LABELS[i.statut] || i.statut,
      i.latitude || "",
      i.longitude || "",
    ]);

    // Inclusion du BOM (\uFEFF) pour préserver les accents sous Excel (ex: Déchets)
    const csvContent =
      "\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `inspections-hsee-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Inspections
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredInspections.length} affichée(s) · {inspections.length} au
            total
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportCSV}
            disabled={filteredInspections.length === 0}
          >
            Exporter CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/inspections/new")}
          >
            Nouvelle inspection
          </Button>
        </Box>
      </Box>

      {/* Barre des Filtres */}
      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        <TextField
          placeholder="Rechercher domaine, site, auditeur…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ minWidth: 280 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Domaine</InputLabel>
          <Select
            value={domainFilter}
            label="Domaine"
            onChange={(e) => setDomainFilter(e.target.value)}
          >
            <MenuItem value="">Tous les domaines</MenuItem>
            {DOMAINES.map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Statut</InputLabel>
          <Select
            value={statusFilter}
            label="Statut"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">Tous les statuts</MenuItem>
            {Object.entries(STATUS_LABELS).map(([v, l]) => (
              <MenuItem key={v} value={v}>
                {l}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {globalError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {globalError}
        </Alert>
      )}

      {/* Liste des Inspections */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : filteredInspections.length === 0 ? (
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
            Aucune inspection trouvée.
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
          {/* Entête du tableau fait maison en CSS Grid */}
          <Box
            display="grid"
            gridTemplateColumns="2fr 1.5fr 1fr 1fr 60px 140px"
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
              "Domaine",
              "Site / Auditeur",
              "Date prévue",
              "Statut",
              "GPS",
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

          {/* Lignes de données */}
          {filteredInspections.map((inspection) => (
            <Box
              key={inspection.id}
              display="grid"
              gridTemplateColumns="2fr 1.5fr 1fr 1fr 60px 140px"
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
              {/* Domaine */}
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {inspection.domaine}
                </Typography>
                {inspection.checklist && (
                  <Typography variant="caption" color="text.secondary">
                    {inspection.checklist.titre}
                  </Typography>
                )}
              </Box>

              {/* Site & Auditeur */}
              <Box>
                <Typography variant="body2">{inspection.site}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {inspection.auditeur
                    ? `${inspection.auditeur.firstName} ${inspection.auditeur.lastName}`
                    : "Aucun auditeur"}
                </Typography>
              </Box>

              {/* Date prévue */}
              <Typography variant="body2">
                {new Date(inspection.datePrevue).toLocaleDateString("fr-FR")}
              </Typography>

              {/* Statut (Chip) */}
              <Box>
                <Chip
                  label={STATUS_LABELS[inspection.statut] || inspection.statut}
                  size="small"
                  color={STATUS_COLORS[inspection.statut] || "default"}
                />
              </Box>

              {/* GPS (Utilisation du titre HTML natif sans Popper) */}
              <Box
                display="flex"
                alignItems="center"
                title={
                  inspection.latitude
                    ? `${inspection.latitude.toFixed(4)}, ${inspection.longitude.toFixed(4)}`
                    : "Pas de géolocalisation"
                }
              >
                {inspection.latitude ? (
                  <LocationOnIcon
                    sx={{ fontSize: 20, color: "success.main" }}
                  />
                ) : (
                  <LocationOffIcon
                    sx={{ fontSize: 20, color: "text.disabled" }}
                  />
                )}
              </Box>

              <Box display="flex" gap={0.5}>
                {/* Remplir — seulement si inspection EN_COURS */}
                {templateIds[inspection.domaine] &&
                  inspection.statut === "EN_COURS" && (
                    <Tooltip title="Remplir la checklist">
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() =>
                          navigate(
                            `/checklists/fill/${inspection.id}/${templateIds[inspection.domaine]}`,
                          )
                        }
                      >
                        Remplir
                      </Button>
                    </Tooltip>
                  )}

                {/* Résultats — toujours visible si template existe */}
                {templateIds[inspection.domaine] && (
                  <Tooltip title="Voir les résultats">
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      onClick={() =>
                        navigate(
                          `/checklists/results/${inspection.id}/${templateIds[inspection.domaine]}`,
                        )
                      }
                    >
                      Résultats
                    </Button>
                  </Tooltip>
                )}
              </Box>
            </Box>
          ))}
        </Paper>
      )}

      {/* ── Dialogue : Modification rapide du Statut ── */}
      <Dialog
        open={!!statusTarget}
        onClose={() => setStatusTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Changer le statut de l'inspection</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" mb={2} color="text.secondary">
            Sélectionnez le nouveau statut pour l'inspection du domaine{" "}
            <strong>{statusTarget?.domaine}</strong> ({statusTarget?.site}) :
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Nouveau statut</InputLabel>
            <Select
              defaultValue={statusTarget?.statut || ""}
              label="Nouveau statut"
              onChange={(e) => handleUpdateStatus(e.target.value)}
              disabled={updating}
            >
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <MenuItem
                  key={value}
                  value={value}
                  disabled={statusTarget?.statut === value}
                >
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusTarget(null)} disabled={updating}>
            Annuler
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Dialogue : Confirmation de Suppression ── */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ color: "error.main" }}>
          Supprimer l'inspection
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            Cette opération est définitive.
          </Alert>
          <Typography variant="body2">
            Supprimer définitivement l'inspection{" "}
            <strong>{deleteTarget?.domaine}</strong> sur le site de{" "}
            <strong>{deleteTarget?.site}</strong> ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Annuler</Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={deleting}
          >
            {deleting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Supprimer"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
