import { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { correctiveActionService } from "../../services/correctiveActionService";

type Proof = {
  id: string;
  type: "PHOTO" | "DOCUMENT";
  filename: string;
  originalName: string;
  url: string;
  mimetype: string;
  size: number;
  uploadedAt: string;
};

type Props = {
  actionId: string;
  readonly?: boolean;
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / 1048576).toFixed(1)} Mo`;
}

function isImage(proof: Proof): boolean {
  return proof.type === "PHOTO" || proof.mimetype?.startsWith("image/");
}

export default function ProofUpload({ actionId, readonly = false }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const [proofs, setProofs] = useState<Proof[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  // Charger les preuves existantes
  useEffect(() => {
    correctiveActionService
      .getProofs(actionId)
      .then(setProofs)
      .catch(() => {});
  }, [actionId]);

  // Upload un fichier
  const handleUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError("Fichier trop lourd (max 10 Mo)");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const proof = await correctiveActionService.uploadProof(actionId, file);
      setProofs((prev) => [...prev, proof]);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de l'upload.");
    } finally {
      setUploading(false);
    }
  };

  // Sélection fichier depuis input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = "";
  };

  // Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  // Supprimer une preuve
  const handleDelete = async (proof: Proof) => {
    setLoadingIds((prev) => [...prev, proof.id]);
    try {
      await correctiveActionService.deleteProof(proof.id);
      setProofs((prev) => prev.filter((p) => p.id !== proof.id));
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Erreur lors de la suppression.",
      );
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== proof.id));
    }
  };

  const photos = proofs.filter((p) => isImage(p));
  const documents = proofs.filter((p) => !isImage(p));

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* ── Zone Drag & Drop ── */}
      {!readonly && (
        <Box
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setDragging(false)}
          sx={{
            border: "2px dashed",
            borderColor: dragging ? "primary.main" : "divider",
            borderRadius: 2,
            p: 3,
            textAlign: "center",
            bgcolor: dragging ? "primary.lighter" : "grey.50",
            cursor: "pointer",
            transition: "all .15s",
            mb: 2,
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={1}
            >
              <CircularProgress size={28} />
              <Typography variant="body2" color="text.secondary">
                Upload en cours...
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="body1" fontWeight={500} mb={0.5}>
                📎 Glisser-déposer un fichier ici
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Photos (JPG, PNG, WEBP) · Documents (PDF) · Max 10 Mo
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Inputs cachés */}
      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept="image/jpeg,image/png,image/webp,application/pdf"
        onChange={handleFileChange}
      />
      <input
        ref={cameraRef}
        type="file"
        hidden
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        onChange={handleFileChange}
      />

      {/* ── Boutons upload mobile ── */}
      {!readonly && (
        <Box display="flex" gap={1} mb={2}>
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            fullWidth
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            📄 Fichier / PDF
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            fullWidth
            onClick={() => cameraRef.current?.click()}
            disabled={uploading}
          >
            📷 Caméra
          </Button>
        </Box>
      )}

      {/* ── Galerie photos ── */}
      {photos.length > 0 && (
        <Box mb={2}>
          <Typography
            variant="caption"
            fontWeight={600}
            color="text.secondary"
            display="block"
            mb={1}
          >
            PHOTOS ({photos.length})
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {photos.map((proof) => (
              <Box
                key={proof.id}
                position="relative"
                sx={{
                  width: 90,
                  height: 90,
                  borderRadius: 1.5,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <img
                  src={`http://localhost:3000${proof.url}`}
                  alt={proof.originalName}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onClick={() =>
                    setLightbox(`http://localhost:3000${proof.url}`)
                  }
                />

                {/* Overlay bouton supprimer */}
                {!readonly && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bgcolor: "rgba(0,0,0,0.45)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "0 0 0 6px",
                    }}
                  >
                    {loadingIds.includes(proof.id) ? (
                      <CircularProgress
                        size={16}
                        sx={{ color: "white", m: 0.5 }}
                      />
                    ) : (
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(proof)}
                        sx={{ color: "white", p: 0.25 }}
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    )}
                  </Box>
                )}

                {/* Nom du fichier */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: "rgba(0,0,0,0.5)",
                    px: 0.5,
                    py: 0.25,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="white"
                    sx={{
                      fontSize: 9,
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {proof.originalName}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* ── Liste documents PDF ── */}
      {documents.length > 0 && (
        <Box>
          <Typography
            variant="caption"
            fontWeight={600}
            color="text.secondary"
            display="block"
            mb={1}
          >
            DOCUMENTS ({documents.length})
          </Typography>
          <Box display="flex" flexDirection="column" gap={0.75}>
            {documents.map((proof) => (
              <Box
                key={proof.id}
                display="flex"
                alignItems="center"
                gap={1.5}
                sx={{
                  p: 1.25,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1.5,
                  bgcolor: "#FAFAFA",
                }}
              >
                {/* Icône PDF */}
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1,
                    bgcolor: "#FFEBEE",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    color="#C62828"
                    fontSize={10}
                  >
                    PDF
                  </Typography>
                </Box>

                {/* Infos fichier */}
                <Box flex={1} minWidth={0}>
                  <Typography variant="body2" fontWeight={500} noWrap>
                    {proof.originalName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatSize(proof.size)} ·{" "}
                    {new Date(proof.uploadedAt).toLocaleDateString("fr-FR")}
                  </Typography>
                </Box>

                {/* Actions */}
                <Box display="flex" gap={0.5}>
                  <IconButton
                    size="small"
                    component="a"
                    href={`http://localhost:3000${proof.url}`}
                    target="_blank"
                    download={proof.originalName}
                  >
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                  {!readonly &&
                    (loadingIds.includes(proof.id) ? (
                      <CircularProgress size={20} sx={{ m: 0.5 }} />
                    ) : (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(proof)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* ── Message si aucune preuve ── */}
      {proofs.length === 0 && readonly && (
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          py={2}
        >
          Aucune preuve jointe.
        </Typography>
      )}

      {/* ── Compteur total ── */}
      {proofs.length > 0 && (
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mt={1.5}
        >
          {proofs.length} preuve(s) · {photos.length} photo(s) ·{" "}
          {documents.length} document(s)
        </Typography>
      )}

      {/* ── Lightbox photo ── */}
      {lightbox && (
        <Box
          onClick={() => setLightbox(null)}
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            bgcolor: "rgba(0,0,0,0.88)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <img
            src={lightbox}
            alt="preuve"
            style={{ maxWidth: "92vw", maxHeight: "92vh", borderRadius: 8 }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "white",
              fontSize: 28,
              cursor: "pointer",
              bgcolor: "rgba(0,0,0,0.4)",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </Box>
        </Box>
      )}
    </Box>
  );
}
