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
import ProofUpload from "../../components/corrective-actions/ProofUpload";
import ActionComments from "../../components/corrective-actions/ActionComments";
import { correctiveActionService } from "../../services/correctiveActionService";
import { useAuth } from "../../contexts/AuthContext";

// ─── Config ───────────────────────────────────────────────────────────────────
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

// ─── Component ────────────────────────────────────────────────────────────────
export default function ActionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isPilote = user?.role === "PILOTE_ACTION";
  const isAdminOrAuditeur = ["ADMIN_HSEE", "AUDITEUR"].includes(
    user?.role ?? "",
  );

  // ── State principal ────────────────────────────────────────────
  const [action, setAction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [progression, setProgression] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // ── State dialogs ──────────────────────────────────────────────
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetStatut, setTargetStatut] = useState("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [motifRejet, setMotifRejet] = useState("");
  const [motifError, setMotifError] = useState("");
  const [validating, setValidating] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  // ── Charger action ─────────────────────────────────────────────
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

  // ── Charger historique ─────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    correctiveActionService
      .getHistory(id)
      .then(setHistory)
      .catch(() => {});
  }, [id, action?.statut]);

  // ── Progression automatique pilote (preuve ou commentaire) ─────
  // Appelé uniquement si l'utilisateur est le pilote de l'action
  const autoIncreaseProgression = async () => {
    if (!action) return;
    if (!["A_FAIRE", "EN_COURS"].includes(action.statut)) return;

    // A_FAIRE → EN_COURS avec 10%
    if (action.statut === "A_FAIRE") {
      try {
        const updated = await correctiveActionService.updateStatus(
          action.id,
          "EN_COURS",
          10,
        );
        setAction(updated);
        setProgression(10);
      } catch {}
      return;
    }

    // EN_COURS → +10% (max 90%)
    const newProg = Math.min((action.progression ?? 0) + 10, 90);
    if (newProg > (action.progression ?? 0)) {
      try {
        const updated = await correctiveActionService.updateStatus(
          action.id,
          "EN_COURS",
          newProg,
        );
        setAction(updated);
        setProgression(newProg);
      } catch {}
    }
  };

  // ── Handler statut pilote (Démarrer / Terminer) ────────────────
  const handleStatusClick = (statut: string) => {
    setTargetStatut(statut);
    setConfirmOpen(true);
  };

  const handleConfirmStatus = async () => {
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

  // ── Handler valider (Admin/Auditeur) ───────────────────────────
  const handleValidate = async () => {
    setValidating(true);
    setError("");
    try {
      const updated = await correctiveActionService.validate(id!);
      setAction(updated);
      setProgression(updated.progression ?? 100);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la validation.");
    } finally {
      setValidating(false);
    }
  };

  // ── Handler rejeter (Admin/Auditeur) ───────────────────────────
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
      setProgression(updated.progression ?? 0);
      setRejectModalOpen(false);
      setMotifRejet("");
      setMotifError("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors du rejet.");
    } finally {
      setRejecting(false);
    }
  };

  // ── Loading / Error ────────────────────────────────────────────
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
        <Alert severity="error">{error || "Action introuvable."}</Alert>
      </Box>
    );

  const crit = CRIT_CONFIG[action.criticite] ?? CRIT_CONFIG.MODERE;
  const status = STATUS_CONFIG[action.statut] ?? STATUS_CONFIG.A_FAIRE;

  // Le pilote peut modifier seulement sa propre action
  const isPiloteOwner = isPilote && action.piloteId === user?.id;

  // Action clôturée (plus aucune modification possible)
  const isActionClosed = ["VALIDEE", "REJETEE"].includes(action.statut);

  // Couleur barre progression
  const barColor =
    progression === 100 ? "#4CAF50" : progression >= 50 ? "#FFC107" : "#378ADD";

  return (
    <Box maxWidth={700} mx="auto" pb={6}>
      {/* ── Header ── */}
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
            Détail et suivi
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* ── Badges statut + criticité ── */}
      <Box display="flex" gap={1.5} mb={3} flexWrap="wrap">
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

      {/* ── Description + Anomalie + Critères ── */}
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

          {action.motifRejet && (
            <>
              <Divider sx={{ my: 1.5 }} />
              <Alert severity="warning">
                <strong>Motif du dernier rejet :</strong> {action.motifRejet}
              </Alert>
            </>
          )}
        </CardContent>
      </Card>

      {/* ── Deadline ── */}
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

      {/* ── PROGRESSION ── */}
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
            AVANCEMENT
          </Typography>

          {/* Barre de progression — visible pour TOUS (Admin, Auditeur, Pilote) */}
          <Box mb={2}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography variant="body2" fontWeight={500}>
                Progression
              </Typography>
              <Typography variant="h6" fontWeight={700} color={barColor}>
                {progression}%
              </Typography>
            </Box>

            {/* Barre visuelle — TOUS la voient */}
            <Box
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: "grey.200",
                overflow: "hidden",
                mb: 0.5,
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: `${progression}%`,
                  bgcolor: barColor,
                  borderRadius: 5,
                  transition: "width .4s ease",
                }}
              />
            </Box>
            <Box display="flex" justifyContent="space-between">
              {["0%", "25%", "50%", "75%", "100%"].map((v) => (
                <Typography
                  key={v}
                  variant="caption"
                  color="text.disabled"
                  fontSize={10}
                >
                  {v}
                </Typography>
              ))}
            </Box>

            {/* Slider — UNIQUEMENT pour le pilote propriétaire, action non clôturée */}
            {isPiloteOwner && !isActionClosed && (
              <Box mt={1.5}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mb={0.5}
                >
                  Faites glisser pour mettre à jour votre progression :
                </Typography>
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
              </Box>
            )}

            {/* Message lecture seule pour Admin/Auditeur */}
            {isAdminOrAuditeur && (
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                mt={1}
              >
                ℹ️ La progression est mise à jour par le pilote d'action.
              </Typography>
            )}
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* ── BOUTONS PILOTE : Démarrer + Terminer ── */}
          {isPiloteOwner && !isActionClosed && (
            <Box>
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.secondary"
                display="block"
                mb={1}
              >
                ACTIONS DISPONIBLES
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {/* Bouton Démarrer — visible seulement si A_FAIRE */}
                {action.statut === "A_FAIRE" && (
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    onClick={() => handleStatusClick("EN_COURS")}
                  >
                    ▶ Démarrer
                  </Button>
                )}

                {/* Bouton Terminer — visible si A_FAIRE ou EN_COURS */}
                {["A_FAIRE", "EN_COURS"].includes(action.statut) && (
                  <Button
                    variant="contained"
                    color="warning"
                    size="small"
                    onClick={() => handleStatusClick("TERMINEE")}
                  >
                    ✓ Marquer comme terminée
                  </Button>
                )}
              </Box>
            </Box>
          )}

          {/* ── BOUTONS ADMIN/AUDITEUR : Valider + Rejeter ── */}
          {/* Visibles UNIQUEMENT quand le pilote a marqué l'action TERMINEE */}
          {isAdminOrAuditeur && action.statut === "TERMINEE" && (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "#F1F8E9",
                border: "1px solid",
                borderColor: "success.light",
              }}
            >
              <Typography
                variant="caption"
                fontWeight={600}
                color="success.dark"
                display="block"
                mb={0.5}
              >
                ✅ VALIDATION HSEE REQUISE
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                mb={1.5}
              >
                Le pilote a marqué cette action comme terminée. Vérifiez les
                preuves et les commentaires avant de valider.
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleValidate}
                  disabled={validating}
                >
                  {validating ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    "✅ Valider l'action"
                  )}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setRejectModalOpen(true)}
                  disabled={rejecting}
                >
                  ✗ Rejeter
                </Button>
              </Box>
            </Box>
          )}

          {/* Message si action clôturée */}
          {isActionClosed && (
            <Alert severity={action.statut === "VALIDEE" ? "success" : "error"}>
              {action.statut === "VALIDEE"
                ? "✅ Action validée. L'anomalie associée a été clôturée."
                : "✗ Action rejetée. Le pilote doit reprendre le travail."}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* ── PREUVES ── */}
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
              Photos · PDF · Certificats
            </Typography>
          </Box>
          <ProofUpload
            actionId={action.id}
            // Admin/Auditeur voient les preuves en lecture seule
            // Pilote peut uploader sauf si action clôturée
            readonly={isAdminOrAuditeur || isActionClosed}
            // Quand le pilote upload une preuve → progression auto +10%
            onUpload={
              isPiloteOwner && !isActionClosed
                ? autoIncreaseProgression
                : undefined
            }
          />
        </CardContent>
      </Card>

      {/* ── COMMENTAIRES ── */}
      <Card
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", mb: 2 }}
      >
        <CardContent sx={{ p: 3 }}>
          <ActionComments
            actionId={action.id}
            piloteId={action.piloteId}
            createdById={action.createdById}
            // Quand le pilote commente → progression auto +10%
            onComment={
              isPiloteOwner && !isActionClosed
                ? autoIncreaseProgression
                : undefined
            }
          />
        </CardContent>
      </Card>

      {/* ── INTERVENANTS ── */}
      <Card
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", mb: 2 }}
      >
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

      {/* ── HISTORIQUE ── */}
      <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
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
            <Typography variant="caption">{showHistory ? "▲" : "▼"}</Typography>
          </Box>

          {showHistory && (
            <Box mt={1.5} display="flex" flexDirection="column" gap={1}>
              {history.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Aucun changement de statut enregistré.
                </Typography>
              ) : (
                history.map((h, idx) => {
                  const LABELS: Record<string, string> = {
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
                          idx < history.length - 1 ? "0.5px solid" : "none",
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
                            {LABELS[h.fromStatut] ?? h.fromStatut}
                          </strong>
                          {" → "}
                          <strong>{LABELS[h.toStatut] ?? h.toStatut}</strong>
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
                        <Typography variant="caption" color="text.secondary">
                          {h.changedBy?.firstName} {h.changedBy?.lastName} ·{" "}
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

      {/* ── Dialog confirmation PILOTE (Démarrer / Terminer) ── */}
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
            <Alert severity="info" sx={{ mt: 1 }}>
              La progression passera automatiquement à <strong>100%</strong>.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">
            Annuler
          </Button>
          <Button
            variant="contained"
            color={STATUS_CONFIG[targetStatut]?.color ?? "primary"}
            onClick={handleConfirmStatus}
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

      {/* ── Dialog confirmation VALIDATION (Admin/Auditeur) ── */}
      <Dialog open={validating} maxWidth="xs" fullWidth>
        <DialogContent>
          <Box display="flex" justifyContent="center" py={2}>
            <CircularProgress />
          </Box>
          <Typography textAlign="center" variant="body2">
            Validation en cours...
          </Typography>
        </DialogContent>
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
            Motif du rejet (obligatoire — min 5 caractères) :
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
            {motifRejet.length} / 500 caractères
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
    </Box>
  );
}
