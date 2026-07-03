// src/pages/corrective-actions/CreateCorrectiveActionPage.tsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BuildIcon from "@mui/icons-material/Build";
import PersonIcon from "@mui/icons-material/Person";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { correctiveActionService } from "../../services/correctiveActionService";
import { anomalyService } from "../../services/anomalyService";
import type { Criticality } from "../../types/corrective-action.types";

// ─── Config ───────────────────────────────────────────────────────────────────
const CRITICALITY_CONFIG: Record<
  Criticality,
  { label: string; color: string; bg: string }
> = {
  FAIBLE: { label: "Faible", color: "#2E7D32", bg: "#E8F5E9" },
  MODERE: { label: "Modéré", color: "#F57F17", bg: "#FFF8E1" },
  CRITIQUE: { label: "Critique", color: "#E65100", bg: "#FFF3E0" },
  BLOQUANT: { label: "Bloquant", color: "#C62828", bg: "#FFEBEE" },
};

// Date minimum = aujourd'hui
const todayStr = new Date().toISOString().split("T")[0];

// ─── Component ────────────────────────────────────────────────────────────────
export default function CreateCorrectiveActionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const anomalyIdFromUrl = searchParams.get("anomalyId") ?? "";

  // ── State formulaire ───────────────────────────────────────────
  const [anomalyId, setAnomalyId] = useState(anomalyIdFromUrl);
  const [description, setDescription] = useState("");
  const [criticite, setCriticite] = useState<Criticality | "">("");
  const [piloteId, setPiloteId] = useState("");
  const [deadline, setDeadline] = useState("");
  const [criteresValidation, setCriteresValidation] = useState("");

  // ── State données ──────────────────────────────────────────────
  const [anomaly, setAnomaly] = useState<any>(null);
  const [pilotes, setPilotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // ── Erreurs par champ ──────────────────────────────────────────
  const [errors, setErrors] = useState({
    description: "",
    criticite: "",
    piloteId: "",
    deadline: "",
  });

  // ── Charger l'anomalie si anomalyId dans l'URL ─────────────────
  useEffect(() => {
    if (!anomalyIdFromUrl) return;
    setLoading(true);
    anomalyService
      .getById(anomalyIdFromUrl)
      .then((a) => {
        setAnomaly(a);
        // Pré-remplir la criticité depuis l'anomalie
        if (a.criticite) setCriticite(a.criticite);
      })
      .catch(() => setError("Anomalie introuvable."))
      .finally(() => setLoading(false));
  }, [anomalyIdFromUrl]);

  // ── Charger les pilotes disponibles ───────────────────────────
  useEffect(() => {
    correctiveActionService
      .getPilotes()
      .then(setPilotes)
      .catch(() => {});
  }, []);

  // ── Validation ─────────────────────────────────────────────────
  const validate = (): boolean => {
    const e = { description: "", criticite: "", piloteId: "", deadline: "" };
    let valid = true;

    if (!description.trim() || description.trim().length < 5) {
      e.description = "La description doit faire au moins 5 caractères.";
      valid = false;
    }
    if (!criticite) {
      e.criticite = "Sélectionnez une criticité.";
      valid = false;
    }
    if (!piloteId) {
      e.piloteId = "Sélectionnez un pilote.";
      valid = false;
    }
    if (!deadline) {
      e.deadline = "La deadline est requise.";
      valid = false;
    }

    setErrors(e);
    return valid;
  };

  // ── Soumission ─────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setError("");
    try {
      const action = await correctiveActionService.create({
        anomalyId: anomalyId,
        description: description.trim(),
        criticite: criticite as Criticality,
        piloteId,
        deadline,
        criteresValidation: criteresValidation.trim() || undefined,
      });
      setSuccess(true);
      setTimeout(() => navigate(`/actions/${action.id}`), 1500);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(typeof msg === "string" ? msg : "Erreur lors de la création.");
    } finally {
      setSaving(false);
    }
  };

  const selectedPilote = pilotes.find((p) => p.id === piloteId);

  // ── Success ────────────────────────────────────────────────────
  if (success)
    return (
      <Box maxWidth={560} mx="auto" mt={4}>
        <Card
          elevation={0}
          sx={{ border: "1px solid", borderColor: "divider" }}
        >
          <CardContent sx={{ p: 4, textAlign: "center" }}>
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                bgcolor: "success.light",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <BuildIcon sx={{ color: "success.dark", fontSize: 36 }} />
            </Box>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Action corrective créée !
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Un email a été envoyé à{" "}
              <strong>
                {selectedPilote?.firstName} {selectedPilote?.lastName}
              </strong>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Redirection en cours...
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );

  // ── Formulaire ─────────────────────────────────────────────────
  return (
    <Box maxWidth={700} mx="auto">
      {/* Header */}
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() =>
            navigate(
              anomalyIdFromUrl ? `/anomalies/${anomalyIdFromUrl}` : "/actions",
            )
          }
          color="inherit"
        >
          Retour
        </Button>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Nouvelle action corrective
          </Typography>
          <Typography variant="body2" color="text.secondary">
            US14 · Workflow PDCA
          </Typography>
        </Box>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      )}

      {!loading && (
        <Card
          elevation={0}
          sx={{ border: "1px solid", borderColor: "divider" }}
        >
          <CardContent sx={{ p: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              {/* ── Anomalie liée ── */}
              {anomaly ? (
                <Box mb={3}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="text.secondary"
                    mb={1}
                  >
                    ANOMALIE À CORRIGER
                  </Typography>
                  <Alert
                    severity="warning"
                    icon={<InfoOutlinedIcon fontSize="small" />}
                    sx={{ alignItems: "flex-start" }}
                  >
                    <Typography variant="body2" fontWeight={500} mb={0.5}>
                      {anomaly.description}
                    </Typography>
                    <Box display="flex" gap={1} mt={0.5}>
                      <Chip
                        label={
                          CRITICALITY_CONFIG[anomaly.criticite as Criticality]
                            ?.label
                        }
                        size="small"
                        sx={{
                          bgcolor:
                            CRITICALITY_CONFIG[anomaly.criticite as Criticality]
                              ?.bg,
                          color:
                            CRITICALITY_CONFIG[anomaly.criticite as Criticality]
                              ?.color,
                          fontWeight: 700,
                          height: 20,
                          fontSize: 10,
                        }}
                      />
                      {anomaly.domaine && (
                        <Chip
                          label={anomaly.domaine}
                          size="small"
                          variant="outlined"
                          sx={{ height: 20, fontSize: 10 }}
                        />
                      )}
                    </Box>
                  </Alert>
                </Box>
              ) : (
                <Box mb={3}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="text.secondary"
                    mb={1}
                  >
                    ANOMALIE LIÉE
                  </Typography>
                  <TextField
                    label="UUID de l'anomalie *"
                    value={anomalyId}
                    onChange={(e) => setAnomalyId(e.target.value)}
                    fullWidth
                    size="small"
                    placeholder="ex: 123e4567-e89b-12d3-a456-426614174000"
                    helperText="Coller l'ID de l'anomalie depuis la page Anomalies"
                  />
                </Box>
              )}

              <Divider sx={{ mb: 3 }} />

              {/* ── Description ── */}
              <Typography
                variant="subtitle2"
                fontWeight={600}
                color="text.secondary"
                mb={1.5}
              >
                DESCRIPTION DE L'ACTION
              </Typography>

              <TextField
                label="Description *"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setErrors((prev) => ({ ...prev, description: "" }));
                }}
                multiline
                rows={3}
                fullWidth
                required
                error={!!errors.description}
                helperText={
                  errors.description ||
                  "Décrivez précisément les mesures à prendre"
                }
                sx={{ mb: 2 }}
                placeholder="ex: Réparer le système de ventilation de la cantine, remplacer le filtre et tester le débit d'air"
              />

              <TextField
                label="Critères de validation"
                value={criteresValidation}
                onChange={(e) => setCriteresValidation(e.target.value)}
                multiline
                rows={2}
                fullWidth
                sx={{ mb: 3 }}
                placeholder="ex: Ventilation fonctionnelle confirmée par mesure de débit > 500 m³/h"
                helperText="Comment vérifier que l'action est efficacement réalisée ?"
              />

              <Divider sx={{ mb: 3 }} />

              {/* ── Criticité + Deadline ── */}
              <Typography
                variant="subtitle2"
                fontWeight={600}
                color="text.secondary"
                mb={1.5}
              >
                PRIORITÉ & DÉLAI
              </Typography>

              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={3}>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    mb={0.75}
                  >
                    Criticité *
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {(Object.keys(CRITICALITY_CONFIG) as Criticality[]).map(
                      (key) => {
                        const cfg = CRITICALITY_CONFIG[key];
                        const sel = criticite === key;
                        return (
                          <Chip
                            key={key}
                            label={cfg.label}
                            onClick={() => {
                              setCriticite(key);
                              setErrors((prev) => ({ ...prev, criticite: "" }));
                            }}
                            sx={{
                              fontWeight: 700,
                              cursor: "pointer",
                              bgcolor: sel ? cfg.color : cfg.bg,
                              color: sel ? "#fff" : cfg.color,
                              border: sel ? "none" : `1px solid ${cfg.color}44`,
                            }}
                          />
                        );
                      },
                    )}
                  </Box>
                  {errors.criticite && (
                    <Typography
                      variant="caption"
                      color="error"
                      display="block"
                      mt={0.5}
                    >
                      {errors.criticite}
                    </Typography>
                  )}
                </Box>

                <TextField
                  label="Deadline *"
                  type="date"
                  value={deadline}
                  onChange={(e) => {
                    setDeadline(e.target.value);
                    setErrors((prev) => ({ ...prev, deadline: "" }));
                  }}
                  fullWidth
                  required
                  error={!!errors.deadline}
                  helperText={errors.deadline || "Date limite de réalisation"}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: todayStr }}
                />
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* ── Pilote ── */}
              <Typography
                variant="subtitle2"
                fontWeight={600}
                color="text.secondary"
                mb={1.5}
              >
                PILOTE D'ACTION
              </Typography>

              <FormControl
                fullWidth
                required
                error={!!errors.piloteId}
                sx={{ mb: 1 }}
              >
                <InputLabel>Pilote d'Action *</InputLabel>
                <Select
                  value={piloteId}
                  label="Pilote d'Action *"
                  onChange={(e) => {
                    setPiloteId(e.target.value);
                    setErrors((prev) => ({ ...prev, piloteId: "" }));
                  }}
                  renderValue={(selected) => {
                    const p = pilotes.find((p) => p.id === selected);
                    return p ? `${p.firstName} ${p.lastName}` : "";
                  }}
                >
                  {pilotes.length === 0 ? (
                    <MenuItem disabled>Aucun pilote disponible</MenuItem>
                  ) : (
                    pilotes.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1.5}
                          width="100%"
                        >
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: "warning.main",
                              fontSize: 12,
                            }}
                          >
                            {p.firstName[0]}
                            {p.lastName[0]}
                          </Avatar>
                          <Box flex={1}>
                            <Typography variant="body2" fontWeight={500}>
                              {p.firstName} {p.lastName}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {p.department ?? "Département non renseigné"}
                            </Typography>
                          </Box>
                          <PersonIcon
                            fontSize="small"
                            sx={{ color: "text.disabled" }}
                          />
                        </Box>
                      </MenuItem>
                    ))
                  )}
                </Select>
                {errors.piloteId && (
                  <FormHelperText>{errors.piloteId}</FormHelperText>
                )}
              </FormControl>

              {/* Preview pilote sélectionné */}
              {selectedPilote && (
                <Alert
                  severity="info"
                  icon={<PersonIcon fontSize="small" />}
                  sx={{ mb: 3 }}
                >
                  <Typography variant="body2">
                    <strong>
                      {selectedPilote.firstName} {selectedPilote.lastName}
                    </strong>{" "}
                    recevra un email de notification avec les détails de cette
                    action.
                  </Typography>
                </Alert>
              )}

              {/* ── Info email ── */}
              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight={500} gutterBottom>
                  Ce qui va se passer après la création :
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2 }}>
                  <li>
                    <Typography variant="body2">
                      Le pilote reçoit un email immédiat avec les détails.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      L'anomalie passe au statut "Action créée".
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      Le pilote peut suivre et mettre à jour depuis son espace.
                    </Typography>
                  </li>
                </Box>
              </Alert>

              {/* ── Actions ── */}
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => navigate(-1)}
                  disabled={saving}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={saving ? undefined : <BuildIcon />}
                  disabled={saving}
                  sx={{ minWidth: 200 }}
                >
                  {saving ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Créer l'action corrective"
                  )}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
