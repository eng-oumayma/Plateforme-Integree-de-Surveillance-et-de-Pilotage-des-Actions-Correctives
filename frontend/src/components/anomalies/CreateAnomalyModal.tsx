// src/components/anomalies/CreateAnomalyModal.tsx
import { useState, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { anomalyService } from "../../services/anomalyService";
import type { Criticality } from "../../services/anomalyService";

// ─── Config criticité ───────────────────────────────────────────────────────
const CRITICALITY_OPTIONS: {
  value: Criticality;
  label: string;
  color: string;
  bg: string;
}[] = [
  { value: "FAIBLE", label: "Faible", color: "#2E7D32", bg: "#E8F5E9" },
  { value: "MODERE", label: "Modéré", color: "#F57F17", bg: "#FFF8E1" },
  { value: "CRITIQUE", label: "Critique", color: "#E65100", bg: "#FFF3E0" },
  { value: "BLOQUANT", label: "Bloquant", color: "#C62828", bg: "#FFEBEE" },
];

type LocalPhoto = { file: File; preview: string };

type Props = {
  open: boolean;
  onClose: () => void;
  inspectionId: string;
  checklistItemId?: string; // optionnel — lien avec un item checklist
  domaine?: string;
  site?: string;
  itemLibelle?: string; // affiché en contexte si fourni
  onCreated?: (anomaly: any) => void;
};

export default function CreateAnomalyModal({
  open,
  onClose,
  inspectionId,
  checklistItemId,
  domaine,
  site,
  itemLibelle,
  onCreated,
}: Props) {
  const [description, setDescription] = useState("");
  const [criticite, setCriticite] = useState<Criticality | "">("");
  const [photos, setPhotos] = useState<LocalPhoto[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setDescription("");
    setCriticite("");
    setPhotos((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.preview));
      return [];
    });
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // ── Ajouter une photo locale (preview avant upload) ──────────────
  const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image trop lourde (max 5 Mo)");
      return;
    }

    const preview = URL.createObjectURL(file);
    setPhotos((prev) => [...prev, { file, preview }]);
    e.target.value = "";
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  // ── Soumission ─────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!description.trim() || description.trim().length < 5) {
      setError("La description doit faire au moins 5 caractères.");
      return;
    }
    if (!criticite) {
      setError("Sélectionnez une criticité.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      // 1. Créer l'anomalie
      const anomaly = await anomalyService.create({
        inspectionId,
        checklistItemId,
        description: description.trim(),
        criticite,
        domaine,
        site,
      });

      // 2. Uploader les photos une par une
      for (const photo of photos) {
        await anomalyService.uploadPhoto(anomaly.id, photo.file);
      }

      onCreated?.(anomaly);
      handleClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la création.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      {/* ── Header ── */}
      <DialogTitle
        sx={{ display: "flex", alignItems: "center", gap: 1, pb: 1 }}
      >
        <WarningAmberIcon color="warning" />
        <Box flex={1}>
          <Typography variant="h6" fontWeight={700} fontSize={17}>
            Signaler une anomalie
          </Typography>
          {itemLibelle && (
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              display="block"
            >
              {itemLibelle}
            </Typography>
          )}
        </Box>
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* ── Criticité ── */}
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mb={0.75}
        >
          Criticité *
        </Typography>
        <Box display="flex" gap={1} mb={2} flexWrap="wrap">
          {CRITICALITY_OPTIONS.map((opt) => {
            const selected = criticite === opt.value;
            return (
              <Chip
                key={opt.value}
                label={opt.label}
                onClick={() => setCriticite(opt.value)}
                sx={{
                  fontWeight: 700,
                  bgcolor: selected ? opt.color : opt.bg,
                  color: selected ? "#fff" : opt.color,
                  border: selected ? "none" : `1px solid ${opt.color}33`,
                  cursor: "pointer",
                  px: 0.5,
                }}
              />
            );
          })}
        </Box>

        {/* ── Description ── */}
        <TextField
          label="Description de l'anomalie *"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
          fullWidth
          placeholder="Décrivez précisément l'anomalie observée..."
          sx={{ mb: 2 }}
        />

        {/* ── Photos ── */}
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mb={0.75}
        >
          Photos ({photos.length})
        </Typography>

        {/* Miniatures */}
        {photos.length > 0 && (
          <Box display="flex" gap={1} flexWrap="wrap" mb={1.5}>
            {photos.map((photo, idx) => (
              <Box
                key={idx}
                position="relative"
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 1.5,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <img
                  src={photo.preview}
                  alt={`photo-${idx}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemovePhoto(idx)}
                  sx={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    bgcolor: "rgba(0,0,0,0.5)",
                    color: "#fff",
                    p: 0.25,
                    "&:hover": { bgcolor: "rgba(255,0,0,0.7)" },
                  }}
                >
                  <DeleteIcon sx={{ fontSize: 12 }} />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        {/* Boutons capture/galerie */}
        <Box display="flex" gap={1}>
          {/* Caméra mobile */}
          <input
            ref={cameraInputRef}
            type="file"
            hidden
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            onChange={handleAddPhoto}
          />
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            fullWidth
            startIcon={<CameraAltIcon />}
            onClick={() => cameraInputRef.current?.click()}
          >
            Caméra
          </Button>

          {/* Galerie */}
          <input
            ref={galleryInputRef}
            type="file"
            hidden
            accept="image/jpeg,image/png,image/webp"
            onChange={handleAddPhoto}
          />
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            fullWidth
            startIcon={<PhotoLibraryIcon />}
            onClick={() => galleryInputRef.current?.click()}
          >
            Galerie
          </Button>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit" disabled={submitting}>
          Annuler
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={handleSubmit}
          disabled={submitting}
          startIcon={
            submitting ? <CircularProgress size={16} color="inherit" /> : null
          }
        >
          {submitting ? "Création..." : "Signaler"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
