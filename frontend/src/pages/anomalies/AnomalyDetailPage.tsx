// src/pages/anomalies/AnomalyDetailPage.tsx
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
import Avatar from "@mui/material/Avatar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BuildIcon from "@mui/icons-material/Build";
import { anomalyService } from "../../services/anomalyService";

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

export default function AnomalyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [anomaly, setAnomaly] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    anomalyService
      .getById(id)
      .then(setAnomaly)
      .catch(() => setError("Anomalie introuvable."))
      .finally(() => setLoading(false));
  }, [id]);

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

  if (error || !anomaly)
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  const crit = CRITICALITY_CONFIG[anomaly.criticite];
  const status = STATUS_CONFIG[anomaly.statut];

  return (
    <Box maxWidth={700} mx="auto" pb={6}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/anomalies")}
          color="inherit"
        >
          Retour
        </Button>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Détail de l'anomalie
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Créée le{" "}
            {new Date(anomaly.createdAt).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </Typography>
        </Box>
      </Box>

      {/* Badges */}
      <Box display="flex" gap={1.5} mb={3}>
        <Chip
          label={crit.label}
          sx={{ bgcolor: crit.bg, color: crit.color, fontWeight: 700, px: 1 }}
        />
        <Chip
          label={status.label}
          color={status.color}
          sx={{ fontWeight: 600 }}
        />
        {anomaly.domaine && <Chip label={anomaly.domaine} variant="outlined" />}
      </Box>

      {/* Description */}
      <Card
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", mb: 3 }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            color="text.secondary"
            mb={1}
          >
            DESCRIPTION
          </Typography>
          <Typography variant="body1">{anomaly.description}</Typography>

          {anomaly.checklistItem && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography
                variant="subtitle2"
                fontWeight={600}
                color="text.secondary"
                mb={0.5}
              >
                ITEM CHECKLIST LIÉ
              </Typography>
              <Typography variant="body2">
                {anomaly.checklistItem.libelle}
              </Typography>
              {anomaly.checklistItem.section && (
                <Typography variant="caption" color="text.secondary">
                  Section : {anomaly.checklistItem.section}
                </Typography>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Photos */}
      {anomaly.photos?.length > 0 && (
        <Card
          elevation={0}
          sx={{ border: "1px solid", borderColor: "divider", mb: 3 }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              color="text.secondary"
              mb={1.5}
            >
              PHOTOS ({anomaly.photos.length})
            </Typography>
            <Box display="flex" gap={1.5} flexWrap="wrap">
              {anomaly.photos.map((photo: any) => (
                <Box
                  key={photo.id}
                  onClick={() =>
                    setLightboxPhoto(`http://localhost:3000${photo.url}`)
                  }
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: 1.5,
                    overflow: "hidden",
                    cursor: "pointer",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <img
                    src={`http://localhost:3000${photo.url}`}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Action corrective liée — placeholder Epic 5 */}
      <Card
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", mb: 3 }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            color="text.secondary"
            mb={1.5}
          >
            ACTION CORRECTIVE
          </Typography>
          {anomaly.correctiveAction ? (
            <Box display="flex" alignItems="center" gap={1.5}>
              <BuildIcon color="warning" />
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {anomaly.correctiveAction.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Pilote : {anomaly.correctiveAction.pilote?.firstName}{" "}
                  {anomaly.correctiveAction.pilote?.lastName}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Alert severity="info" sx={{ alignItems: "center" }}>
              Aucune action corrective créée pour cette anomalie.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Créé par */}
      <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            color="text.secondary"
            mb={1.5}
          >
            HISTORIQUE
          </Typography>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: "primary.main",
                fontSize: 13,
              }}
            >
              {anomaly.createdBy?.firstName?.[0]}
              {anomaly.createdBy?.lastName?.[0]}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={500}>
                Créée par {anomaly.createdBy?.firstName}{" "}
                {anomaly.createdBy?.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(anomaly.createdAt).toLocaleString("fr-FR")}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Lightbox */}
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
            alt=""
            style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: 8 }}
          />
        </Box>
      )}
    </Box>
  );
}
