// src/components/checklists/PhotoCapture.tsx
import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import { checklistResponseService } from "../../services/checklistResponseService";

type Photo = { id: string; url: string; originalName?: string };

type Props = {
  inspectionId: string;
  itemId: string;
  photos: Photo[];
  onPhotosChange: (photos: Photo[]) => void;
  disabled?: boolean;
};

export default function PhotoCapture({
  inspectionId,
  itemId,
  photos,
  onPhotosChange,
  disabled,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image trop lourde (max 5 Mo)");
      return;
    }

    setUploading(true);
    setError("");
    try {
      const photo = await checklistResponseService.uploadPhoto(
        inspectionId,
        itemId,
        file,
      );
      onPhotosChange([...photos, photo]);
    } catch {
      setError("Échec de l'upload");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDelete = async (photoId: string) => {
    try {
      await checklistResponseService.deletePhoto(photoId);
      onPhotosChange(photos.filter((p) => p.id !== photoId));
    } catch {
      setError("Échec de la suppression");
    }
  };

  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        mb={0.5}
      >
        Photos ({photos.length})
      </Typography>

      {/* Miniatures */}
      {photos.length > 0 && (
        <Box display="flex" gap={1} flexWrap="wrap" mb={1}>
          {photos.map((photo) => (
            <Box
              key={photo.id}
              position="relative"
              sx={{
                width: 72,
                height: 72,
                borderRadius: 1,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <img
                src={`http://localhost:3000${photo.url}`}
                alt={photo.originalName}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {!disabled && (
                <IconButton
                  size="small"
                  onClick={() => handleDelete(photo.id)}
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
                  <DeleteIcon sx={{ fontSize: 14 }} />
                </IconButton>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Bouton upload */}
      {!disabled && (
        <>
          <input
            ref={inputRef}
            type="file"
            hidden
            accept="image/jpeg,image/png,image/webp"
            capture="environment" // ← ouvre la caméra arrière sur mobile
            onChange={handleFile}
          />
          <Button
            variant="outlined"
            size="small"
            startIcon={
              uploading ? <CircularProgress size={14} /> : <CameraAltIcon />
            }
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            color="inherit"
            sx={{ fontSize: 12 }}
          >
            {uploading ? "Upload..." : "Ajouter photo"}
          </Button>
        </>
      )}

      {error && (
        <Typography variant="caption" color="error" display="block" mt={0.5}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
