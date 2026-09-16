// src/pages/checklists/ChecklistTemplatesPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Chip,
  Paper,
  Alert,
  CircularProgress,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { checklistService } from "../../../services/checklistService";

import { useAuth } from "../../../contexts/AuthContext";
import type {
  ChecklistTemplate,
  Domaine,
  CotationType,
} from "../../../types/checklist.types";

// ─── Constants ────────────────────────────────────────────────────────────────
const DOMAINES: Domaine[] = [
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

const COTATION_LABELS: Record<CotationType, string> = {
  "0_1": "0 / 1  →  Locaux techniques, Chimique, Incendie",
  "0_1_2": "0 / 1 / 2  →  Cantine, Infirmerie, Transport",
  "0_1_2_NA": "0 / 1 / 2 / NA",
  "0_1_2_3": "0 / 1 / 2 / 3",
  "0_4_6_8_10": "0 / 4 / 6 / 8 / 10  →  Sanitaires",
  TARGET: "Variable par item  →  Plant, Déchets",
};

const COTATION_IMPORT_OPTIONS = [
  { value: "0_1", label: "0 / 1  →  Locaux techniques, Chimique, Incendie" },
  { value: "0_1_2", label: "0 / 1 / 2  →  Cantine, Infirmerie, Transport" },
  { value: "0_1_2_NA", label: "0 / 1 / 2 / NA" },
  { value: "0_1_2_3", label: "0 / 1 / 2 / 3" },
  { value: "0_4_6_8_10", label: "0 / 4 / 6 / 8 / 10  →  Sanitaires" },
  { value: "TARGET", label: "Variable par item  →  Plant, Déchets" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function ChecklistTemplatesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN_HSEE";

  // ── State ──────────────────────────────────────────────────────────────────
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterDomaine, setFilterDomaine] = useState<string>("");

  // Dialog import Excel
  const [importOpen, setImportOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importDomaine, setImportDomaine] = useState<Domaine | "">("");
  const [importTitre, setImportTitre] = useState("");
  const [importCotation, setImportCotation] = useState<CotationType | "">("");
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");

  // Dialog désactivation
  const [deleteTarget, setDeleteTarget] = useState<ChecklistTemplate | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

  // ── Data ───────────────────────────────────────────────────────────────────
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await checklistService.getAll();
      setTemplates(data);
    } catch {
      setError(
        "Impossible de charger les templates. Vérifiez votre connexion.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Charger les templates
  useEffect(() => {
    load();
  }, []);

  const filtered = filterDomaine
    ? templates.filter((t) => t.domaine === filterDomaine)
    : templates;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await checklistService.remove(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch {
      setError("Erreur lors de la désactivation.");
    } finally {
      setDeleting(false);
    }
  };

  const handleImport = async () => {
    if (!importFile || !importDomaine || !importTitre || !importCotation)
      return;
    setImporting(true);
    setImportError("");
    try {
      await checklistService.importFromExcel(
        importFile,
        importDomaine,
        importTitre,
        importCotation,
      );
      setImportOpen(false);
      setImportFile(null);
      setImportDomaine("");
      setImportTitre("");
      setImportCotation("");
      load();
    } catch (err: any) {
      setImportError(
        err?.response?.data?.message || "Erreur lors de l'import.",
      );
    } finally {
      setImporting(false);
    }
  };

  const handleCloseImport = () => {
    setImportOpen(false);
    setImportError("");
    setImportFile(null);
    setImportDomaine("");
    setImportTitre("");
    setImportCotation("");
  };

  // ── Render ─────────────────────────────────────────────────────────────────
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
            Checklists Templates
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {templates.filter((t) => t.actif).length} actif(s) ·{" "}
            {templates.length} total
          </Typography>
        </Box>

        {isAdmin && (
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={<UploadFileIcon />}
              onClick={() => setImportOpen(true)}
            >
              Importer Excel
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/checklists/builder")}
            >
              Nouveau template
            </Button>
          </Box>
        )}
      </Box>

      {/* ── Filtre domaine ── */}
      <Box mb={2}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filtrer par domaine</InputLabel>
          <Select
            value={filterDomaine}
            label="Filtrer par domaine"
            onChange={(e) => setFilterDomaine(e.target.value)}
          >
            <MenuItem value="">Tous les domaines</MenuItem>
            {DOMAINES.map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* ── Contenu ── */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : filtered.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            p: 6,
            textAlign: "center",
          }}
        >
          <Typography color="text.secondary" mb={2}>
            {filterDomaine
              ? `Aucun template trouvé pour le domaine "${filterDomaine}".`
              : "Aucun template créé pour l'instant."}
          </Typography>
          {isAdmin && (
            <Button
              variant="contained"
              onClick={() => navigate("/checklists/builder")}
            >
              Créer le premier template
            </Button>
          )}
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
          {/* Entête tableau */}
          <Box
            display="grid"
            gridTemplateColumns="2fr 1.5fr 1fr 1fr 1fr 160px"
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
              "Domaine / Titre",
              "Type de cotation",
              "Version",
              "Items",
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

          {/* Lignes */}
          {filtered.map((t) => (
            <Box
              key={t.id}
              display="grid"
              gridTemplateColumns="2fr 1.5fr 1fr 1fr 1fr 160px"
              gap={2}
              alignItems="center"
              sx={{
                px: 2,
                py: 1.5,
                borderBottom: "0.5px solid",
                borderColor: "divider",
                "&:last-child": { borderBottom: "none" },
                "&:hover": { bgcolor: "grey.50" },
                opacity: t.actif ? 1 : 0.5,
              }}
            >
              {/* Domaine + Titre */}
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {t.domaine}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t.titre}
                </Typography>
              </Box>

              {/* Type cotation */}
              <Typography variant="body2" color="text.secondary" fontSize={11}>
                {COTATION_LABELS[t.cotationType] ?? t.cotationType}
              </Typography>

              {/* Version */}
              <Chip label={`v${t.version}`} size="small" variant="outlined" />

              {/* Nb items */}
              <Typography variant="body2">
                {t.items?.length ?? 0} items
              </Typography>

              {/* Statut */}
              <Chip
                label={t.actif ? "Actif" : "Inactif"}
                size="small"
                color={t.actif ? "success" : "default"}
                variant={t.actif ? "filled" : "outlined"}
              />

              {/* ── Actions ── */}
              <Box display="flex" gap={0.5} alignItems="center">
                {/* Aperçu — visible pour tout le monde */}
                <Tooltip title="Voir les items">
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/checklists/${t.id}`)}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                {/* Modifier + Désactiver — Admin seulement */}
                {isAdmin && (
                  <>
                    <Tooltip title="Modifier le template">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/checklists/builder/${t.id}`)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title={t.actif ? "Désactiver" : "Déjà inactif"}>
                      <span>
                        <IconButton
                          size="small"
                          color="error"
                          disabled={!t.actif}
                          onClick={() => setDeleteTarget(t)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </>
                )}
              </Box>
              {/* ── Fin Actions ── */}
            </Box>
          ))}
          {/* ── Fin lignes ── */}
        </Paper>
      )}

      {/* ── Dialog Import Excel ── */}
      <Dialog
        open={importOpen}
        onClose={handleCloseImport}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Importer depuis Excel</DialogTitle>
        <DialogContent>
          {importError && (
            <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
              {importError}
            </Alert>
          )}

          <FormControl fullWidth sx={{ mt: 1, mb: 2 }}>
            <InputLabel>Domaine</InputLabel>
            <Select
              value={importDomaine}
              label="Domaine"
              onChange={(e) => setImportDomaine(e.target.value as Domaine)}
            >
              {DOMAINES.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Titre du template"
            value={importTitre}
            onChange={(e) => setImportTitre(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            placeholder="ex: Checklist Surveillance Cantine"
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Type de cotation</InputLabel>
            <Select
              value={importCotation}
              label="Type de cotation"
              onChange={(e) =>
                setImportCotation(e.target.value as CotationType)
              }
            >
              {COTATION_IMPORT_OPTIONS.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              Choisir selon le domaine sélectionné
            </FormHelperText>
          </FormControl>

          <Button
            variant="outlined"
            component="label"
            fullWidth
            startIcon={<UploadFileIcon />}
            color={importFile ? "success" : "inherit"}
          >
            {importFile
              ? `✓ ${importFile.name}`
              : "Sélectionner le fichier Excel (.xlsx)"}
            <input
              type="file"
              hidden
              accept=".xlsx,.xls"
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImport} color="inherit">
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={handleImport}
            disabled={
              importing ||
              !importFile ||
              !importDomaine ||
              !importTitre ||
              !importCotation
            }
          >
            {importing ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Importer"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Dialog Désactivation ── */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Désactiver le template</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Le template sera désactivé mais l'historique sera conservé.
          </Alert>
          <Typography variant="body2">
            Désactiver <strong>{deleteTarget?.titre}</strong> (
            {deleteTarget?.domaine}) ? Il ne sera plus utilisable pour les
            nouvelles inspections.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} color="inherit">
            Annuler
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={deleting}
          >
            {deleting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Désactiver"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
