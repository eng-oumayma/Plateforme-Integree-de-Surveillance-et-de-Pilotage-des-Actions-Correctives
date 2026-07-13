// src/pages/corrective-actions/ActionDetailPage.tsx
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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeadlineIndicator from "../../components/corrective-actions/DeadlineIndicator";
import { correctiveActionService } from "../../services/correctiveActionService";
import { useAuth } from "../../contexts/AuthContext";
import ProofUpload from "../../components/corrective-actions/ProofUpload";
import ActionComments from "../../components/corrective-actions/ActionComments";

const STATUS_CONFIG: Record<string, { label: string; color: any }> = {
  A_FAIRE: { label: "À faire", color: "default" },
  EN_COURS: { label: "En cours", color: "info" },
  TERMINEE: { label: "Terminée", color: "warning" },
  VALIDEE: { label: "Validée", color: "success" },
  REJETEE: { label: "Rejetée", color: "error" },
};

const CRIT_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  FAIBLE: { label: "Faible", color: "#2E7D32", bg: "#E8F5E9" },
  MODERE: { label: "Modéré", color: "#F57F17", bg: "#FFF8E1" },
  CRITIQUE: { label: "Critique", color: "#E65100", bg: "#FFF3E0" },
  BLOQUANT: { label: "Bloquant", color: "#C62828", bg: "#FFEBEE" },
};

const ALLOWED: Record<string, string[]> = {
  PILOTE_ACTION: ["EN_COURS", "TERMINEE"],
  AUDITEUR: ["EN_COURS", "TERMINEE", "VALIDEE", "REJETEE"],
  ADMIN_HSEE: ["EN_COURS", "TERMINEE", "VALIDEE", "REJETEE"],
};

export default function ActionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isPilote = user?.role === "PILOTE_ACTION";

  const [action, setAction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [progression, setProgression] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetStatut, setTargetStatut] = useState("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [motifRejet, setMotifRejet] = useState("");
  const [motifError, setMotifError] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [validating, setValidating] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  useEffect(() => {
    if (!id) return;
    correctiveActionService
      .getById(id)
      .then((a) => {
        setAction(a);
        setProgression(a.progression ?? 0);
      })
      .catch(() => setError("Action introuvable."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusClick = (statut: string) => {
    setTargetStatut(statut);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setSaving(true);
    setError("");
    try {
      const updated = await correctiveActionService.updateStatus(
        id!,
        targetStatut,
        progression,
      );
      setAction(updated);
      setProgression(updated.progression);
      setConfirmOpen(false);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Erreur lors de la mise à jour.",
      );
    } finally {
      setSaving(false);
    }
  };
  useEffect(() => {
    if (!id) return;
    correctiveActionService
      .getHistory(id)
      .then(setHistory)
      .catch(() => {});
  }, [id, action?.statut]); // recharger quand statut change

  // ── Handler Valider ────────────────────────────────────────────
  const handleValidate = async () => {
    setValidating(true);
    setError("");
    try {
      const updated = await correctiveActionService.validate(id!);
      setAction(updated);
      setConfirmOpen(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la validation.");
    } finally {
      setValidating(false);
    }
  };

  // ── Handler Rejeter ────────────────────────────────────────────
  const handleReject = async () => {
    if (!motifRejet.trim() || motifRejet.trim().length < 5) {
      setMotifError("Le motif est obligatoire (min 5 caractères).");
      return;
    }
    setRejecting(true);
    setError("");
    try {
      const updated = await correctiveActionService.reject(
        id!,
        motifRejet.trim(),
      );
      setAction(updated);
      setRejectModalOpen(false);
      setMotifRejet("");
      setMotifError("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors du rejet.");
    } finally {
      setRejecting(false);
    }
  };

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
  if (!action)
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  const crit = CRIT_CONFIG[action.criticite] ?? CRIT_CONFIG.MODERE;
  const status = STATUS_CONFIG[action.statut] ?? STATUS_CONFIG.A_FAIRE;
  const allowed = ALLOWED[user?.role ?? ""] ?? [];
  const canUpdate = !isPilote || action.piloteId === user?.id;

  // Boutons disponibles selon statut actuel
  const statusButtons = [
    {
      statut: "EN_COURS",
      label: "▶ Démarrer",
      color: "info" as const,
      show: allowed.includes("EN_COURS") && action.statut === "A_FAIRE",
    },
    {
      statut: "TERMINEE",
      label: "✓ Marquer terminée",
      color: "warning" as const,
      show: allowed.includes("TERMINEE") && action.statut === "EN_COURS",
    },
    {
      statut: "VALIDEE",
      label: "✅ Valider",
      color: "success" as const,
      show: allowed.includes("VALIDEE") && action.statut === "TERMINEE",
    },
    {
      statut: "REJETEE",
      label: "✗ Rejeter",
      color: "error" as const,
      show: allowed.includes("REJETEE") && action.statut === "TERMINEE",
    },
  ].filter((b) => b.show);

  // Couleur barre progression
  const barColor =
    progression === 100 ? "#4CAF50" : progression >= 50 ? "#FFC107" : "#378ADD";

  return (
    <Box maxWidth={700} mx="auto" pb={6}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/actions")}
          color="inherit"
        >
          Retour
        </Button>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Action corrective
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Détail et mise à jour
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Badges */}
      <Box display="flex" gap={1.5} mb={3}>
        <Chip
          label={crit.label}
          sx={{ bgcolor: crit.bg, color: crit.color, fontWeight: 700 }}
        />
        <Chip
          label={status.label}
          color={status.color}
          sx={{ fontWeight: 600 }}
        />
        {action.domaine && <Chip label={action.domaine} variant="outlined" />}
      </Box>

      {/* Description */}
      <Card
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", mb: 2 }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            color="text.secondary"
            mb={1}
          >
            ACTION À RÉALISER
          </Typography>
          <Typography variant="body1" mb={2}>
            {action.description}
          </Typography>

          {action.criteresValidation && (
            <>
              <Divider sx={{ mb: 1.5 }} />
              <Typography
                variant="subtitle2"
                fontWeight={600}
                color="text.secondary"
                mb={0.5}
              >
                CRITÈRES DE VALIDATION
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {action.criteresValidation}
              </Typography>
            </>
          )}

          {action.anomaly && (
            <>
              <Divider sx={{ my: 1.5 }} />
              <Typography
                variant="subtitle2"
                fontWeight={600}
                color="text.secondary"
                mb={0.5}
              >
                ANOMALIE À L'ORIGINE
              </Typography>
              <Typography variant="body2">
                {action.anomaly.description}
              </Typography>
            </>
          )}
        </CardContent>
      </Card>

      {/* Deadline */}
      <Card
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", mb: 2 }}
      >
        <CardContent sx={{ p: 2 }}>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            color="text.secondary"
            mb={1}
          >
            DEADLINE
          </Typography>
          <DeadlineIndicator
            deadline={action.deadline}
            statut={action.statut}
          />
        </CardContent>
      </Card>

      {/* Progression + Statut */}
      {canUpdate && !["VALIDEE", "REJETEE"].includes(action.statut) && (
        <Card
          elevation={0}
          sx={{ border: "1px solid", borderColor: "divider", mb: 2 }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              color="text.secondary"
              mb={2}
            >
              MISE À JOUR DE L'AVANCEMENT
            </Typography>

            {/* ← Range input natif — pas de Slider MUI */}
            <Box mb={3}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography variant="body2">Progression</Typography>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  color="primary.main"
                >
                  {progression}%
                </Typography>
              </Box>

              {/* Barre visuelle */}
              <Box
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: "grey.200",
                  overflow: "hidden",
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    width: `${progression}%`,
                    bgcolor: barColor,
                    borderRadius: 4,
                    transition: "width .2s",
                  }}
                />
              </Box>

              {/* Range input natif */}
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={progression}
                onChange={(e) => setProgression(Number(e.target.value))}
                style={{
                  width: "100%",
                  cursor: "pointer",
                  accentColor: barColor,
                }}
              />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary">
                  0%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  25%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  50%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  75%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  100%
                </Typography>
              </Box>
            </Box>

            {/* Boutons statut */}
            {/* ── Boutons Valider / Rejeter (Admin/Auditeur seulement, si TERMINEE) ── */}
            {!isPilote && action.statut === "TERMINEE" && (
              <Card
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "success.light",
                  mb: 2,
                  bgcolor: "#F1F8E9",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="success.dark"
                    mb={1}
                  >
                    ✅ VALIDATION HSEE
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Le pilote a marqué cette action comme terminée. Vérifiez les
                    preuves et validez ou rejetez.
                  </Typography>

                  {action.motifRejet && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      <strong>Précédent motif de rejet :</strong>{" "}
                      {action.motifRejet}
                    </Alert>
                  )}

                  <Box display="flex" gap={1.5}>
                    <Button
                      variant="contained"
                      color="success"
                      size="large"
                      onClick={() => setConfirmOpen(true)}
                      disabled={validating}
                      sx={{ flex: 1 }}
                    >
                      {validating ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        "✅ Valider l'action"
                      )}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="large"
                      onClick={() => setRejectModalOpen(true)}
                      disabled={rejecting}
                      sx={{ flex: 1 }}
                    >
                      ✗ Rejeter
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* ── Historique des statuts ── */}
            <Card
              elevation={0}
              sx={{ border: "1px solid", borderColor: "divider", mb: 2 }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ cursor: "pointer" }}
                  onClick={() => setShowHistory((p) => !p)}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="text.secondary"
                  >
                    HISTORIQUE DES STATUTS ({history.length})
                  </Typography>
                  <Typography variant="caption">
                    {showHistory ? "▲" : "▼"}
                  </Typography>
                </Box>

                {showHistory && (
                  <Box mt={1.5} display="flex" flexDirection="column" gap={1}>
                    {history.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        Aucun historique.
                      </Typography>
                    ) : (
                      history.map((h, idx) => {
                        const STATUS_LABELS: Record<string, string> = {
                          A_FAIRE: "À faire",
                          EN_COURS: "En cours",
                          TERMINEE: "Terminée",
                          VALIDEE: "Validée",
                          REJETEE: "Rejetée",
                        };
                        return (
                          <Box
                            key={h.id}
                            display="flex"
                            alignItems="flex-start"
                            gap={1.5}
                            sx={{
                              pb: 1,
                              borderBottom:
                                idx < history.length - 1
                                  ? "0.5px solid"
                                  : "none",
                              borderColor: "divider",
                            }}
                          >
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                bgcolor: "primary.main",
                                mt: 0.75,
                                flexShrink: 0,
                              }}
                            />
                            <Box flex={1}>
                              <Typography variant="body2">
                                <strong>
                                  {STATUS_LABELS[h.fromStatut] ?? h.fromStatut}
                                </strong>
                                {" → "}
                                <strong>
                                  {STATUS_LABELS[h.toStatut] ?? h.toStatut}
                                </strong>
                              </Typography>
                              {h.motif && (
                                <Typography
                                  variant="caption"
                                  color="error.main"
                                  display="block"
                                >
                                  Motif : {h.motif}
                                </Typography>
                              )}
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {h.changedBy?.firstName} {h.changedBy?.lastName}{" "}
                                ·{" "}
                                {new Date(h.createdAt).toLocaleString("fr-FR", {
                                  day: "2-digit",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* ── Dialog confirmation VALIDATION ── */}
            <Dialog
              open={confirmOpen}
              onClose={() => setConfirmOpen(false)}
              maxWidth="xs"
              fullWidth
            >
              <DialogTitle>Confirmer la validation</DialogTitle>
              <DialogContent>
                <Alert severity="success" sx={{ mb: 2 }}>
                  L'anomalie associée sera automatiquement{" "}
                  <strong>clôturée</strong>.
                </Alert>
                <Typography variant="body2">
                  Confirmez-vous que l'action{" "}
                  <strong>"{action?.description}"</strong> a été réalisée
                  efficacement et peut être validée ?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setConfirmOpen(false)} color="inherit">
                  Annuler
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleValidate}
                  disabled={validating}
                >
                  {validating ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    "✅ Confirmer la validation"
                  )}
                </Button>
              </DialogActions>
            </Dialog>

            {/* ── Modal REJET avec motif obligatoire ── */}
            <Dialog
              open={rejectModalOpen}
              onClose={() => {
                setRejectModalOpen(false);
                setMotifRejet("");
                setMotifError("");
              }}
              maxWidth="xs"
              fullWidth
            >
              <DialogTitle>
                <Typography variant="h6" fontWeight={700} color="error.main">
                  ✗ Rejeter l'action corrective
                </Typography>
              </DialogTitle>
              <DialogContent>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Le pilote sera notifié par email. L'action repassera au statut{" "}
                  <strong>En cours</strong>.
                </Alert>
                <Typography variant="body2" color="text.secondary" mb={1.5}>
                  Indiquez le motif du rejet pour que le pilote sache quoi
                  corriger :
                </Typography>
                <textarea
                  value={motifRejet}
                  onChange={(e) => {
                    setMotifRejet(e.target.value);
                    setMotifError("");
                  }}
                  placeholder="Ex: Les preuves fournies sont insuffisantes. Joindre le rapport de test de la ventilation."
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: motifError ? "1px solid #F44336" : "1px solid #ddd",
                    borderRadius: 8,
                    fontFamily: "inherit",
                    fontSize: 14,
                    resize: "vertical",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                {motifError && (
                  <Typography
                    variant="caption"
                    color="error.main"
                    display="block"
                    mt={0.5}
                  >
                    {motifError}
                  </Typography>
                )}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mt={0.5}
                >
                  {motifRejet.length}/500 caractères
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setRejectModalOpen(false);
                    setMotifRejet("");
                    setMotifError("");
                  }}
                  color="inherit"
                >
                  Annuler
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleReject}
                  disabled={rejecting || motifRejet.trim().length < 5}
                >
                  {rejecting ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    "Confirmer le rejet"
                  )}
                </Button>
              </DialogActions>
            </Dialog>
          </CardContent>
        </Card>
      )}
      <Card
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", mb: 2 }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography
              variant="subtitle2"
              fontWeight={600}
              color="text.secondary"
            >
              PREUVES DE RÉALISATION
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Photos, PDF, certificats
            </Typography>
          </Box>

          <ProofUpload
            actionId={action.id}
            readonly={["VALIDEE", "REJETEE"].includes(action.statut)}
          />
        </CardContent>
      </Card>
      <Card
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", mb: 2 }}
      >
        <CardContent sx={{ p: 3 }}>
          <ActionComments
            actionId={action.id}
            piloteId={action.piloteId}
            createdById={action.createdById}
          />
        </CardContent>
      </Card>

      {/* Intervenants */}
      <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            color="text.secondary"
            mb={1.5}
          >
            INTERVENANTS
          </Typography>
          <Box display="flex" flexDirection="column" gap={1.5}>
            {action.pilote && (
              <Box display="flex" alignItems="center" gap={1.5}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "warning.main",
                    fontSize: 13,
                  }}
                >
                  {action.pilote.firstName[0]}
                  {action.pilote.lastName[0]}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {action.pilote.firstName} {action.pilote.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Pilote d'action
                  </Typography>
                </Box>
              </Box>
            )}
            {action.createdBy && (
              <Box display="flex" alignItems="center" gap={1.5}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "primary.main",
                    fontSize: 13,
                  }}
                >
                  {action.createdBy.firstName[0]}
                  {action.createdBy.lastName[0]}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {action.createdBy.firstName} {action.createdBy.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Créée le{" "}
                    {new Date(action.createdAt).toLocaleDateString("fr-FR")}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Dialog confirmation */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmer la mise à jour</DialogTitle>
        <DialogContent>
          <Typography variant="body2" mb={2}>
            Passer le statut à{" "}
            <strong>{STATUS_CONFIG[targetStatut]?.label}</strong> avec une
            progression de <strong>{progression}%</strong> ?
          </Typography>
          {targetStatut === "TERMINEE" && (
            <Alert severity="info">
              La progression passera automatiquement à 100%.
            </Alert>
          )}
          {targetStatut === "VALIDEE" && (
            <Alert severity="success">
              L'anomalie sera automatiquement clôturée.
            </Alert>
          )}
          {targetStatut === "REJETEE" && (
            <Alert severity="warning">Le pilote sera notifié du rejet.</Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">
            Annuler
          </Button>
          <Button
            variant="contained"
            color={STATUS_CONFIG[targetStatut]?.color ?? "primary"}
            onClick={handleConfirm}
            disabled={saving}
          >
            {saving ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Confirmer"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
