import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LockResetIcon from "@mui/icons-material/LockReset";
import { authService } from "../../services/authService";

const RULES = [
  { id: "len", label: "8 caractères minimum", test: (p) => p.length >= 8 },
  {
    id: "upper",
    label: "1 lettre majuscule (A-Z)",
    test: (p) => /[A-Z]/.test(p),
  },
  { id: "digit", label: "1 chiffre (0-9)", test: (p) => /\d/.test(p) },
  {
    id: "special",
    label: "1 caractère spécial (!@#$…)",
    test: (p) => /[^a-zA-Z0-9]/.test(p),
  },
];

const STRENGTH_COLOR = ["error", "error", "warning", "info", "success"];
const STRENGTH_LABEL = ["", "Très faible", "Faible", "Moyen", "Fort"];

export default function SetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const passed = RULES.filter((r) => r.test(password));
  const strength = passed.length;
  const allOk = strength === RULES.length;
  const matches = password === confirm && confirm.length > 0;
  const canSubmit = allOk && matches && !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError("");
    setLoading(true);
    try {
      await authService.setPassword(token, password, confirm);
      setDone(true);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 400 || status === 410) {
        setError(
          "Ce lien a expiré ou est invalide. Contactez votre administrateur HSEE pour en obtenir un nouveau.",
        );
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Token manquant ──────────────────────────────────────────────────────────
  if (!token) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor="grey.50"
        p={2}
      >
        <Box maxWidth={420} width="100%">
          <Alert severity="error">
            Lien invalide. Veuillez contacter votre administrateur HSEE pour
            recevoir un nouveau lien d'activation.
          </Alert>
        </Box>
      </Box>
    );
  }

  // ── Succès ──────────────────────────────────────────────────────────────────
  if (done) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor="grey.50"
        p={2}
      >
        <Box maxWidth={440} width="100%">
          <Box textAlign="center" mb={4}>
            <Typography variant="h5" fontWeight={700} color="primary">
              HSEE Platform
            </Typography>
          </Box>
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
                <CheckCircleIcon sx={{ color: "success.dark", fontSize: 40 }} />
              </Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Mot de passe défini !
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Votre compte HSEE est maintenant <strong>actif</strong>.
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Vous pouvez vous connecter dès maintenant.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => navigate("/login")}
              >
                Accéder à la plateforme
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    );
  }

  // ── Formulaire ──────────────────────────────────────────────────────────────
  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="grey.50"
      p={2}
    >
      <Box maxWidth={480} width="100%">
        {/* Logo */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h5" fontWeight={700} color="primary">
            HSEE Platform
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hygiène · Sécurité · Santé · Environnement · Énergie
          </Typography>
        </Box>

        <Card
          elevation={0}
          sx={{ border: "1px solid", borderColor: "divider" }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Title */}
            <Box display="flex" alignItems="center" gap={1.5} mb={1}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "primary.light",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <LockResetIcon sx={{ color: "primary.dark", fontSize: 22 }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Définir votre mot de passe
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Bienvenue sur la plateforme HSEE
                </Typography>
              </Box>
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
              Choisissez un mot de passe sécurisé pour activer votre compte. Ce
              lien est valable <strong>24 heures</strong>.
            </Alert>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              {/* Mot de passe */}
              <TextField
                label="Nouveau mot de passe"
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                autoFocus
                sx={{ mb: 1 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPwd(!showPwd)}
                        edge="end"
                        size="small"
                      >
                        {showPwd ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Strength bar */}
              {password.length > 0 && (
                <Box mb={2}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={0.5}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Robustesse
                    </Typography>
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      color={`${STRENGTH_COLOR[strength]}.main`}
                    >
                      {STRENGTH_LABEL[strength]}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(strength / RULES.length) * 100}
                    color={STRENGTH_COLOR[strength]}
                    sx={{ height: 6, borderRadius: 3 }}
                  />

                  {/* Rules checklist */}
                  <Box
                    display="grid"
                    gridTemplateColumns="1fr 1fr"
                    gap={0.5}
                    mt={1.5}
                  >
                    {RULES.map((rule) => {
                      const ok = rule.test(password);
                      return (
                        <Box
                          key={rule.id}
                          display="flex"
                          alignItems="center"
                          gap={0.5}
                        >
                          {ok ? (
                            <CheckCircleIcon
                              sx={{ fontSize: 14, color: "success.main" }}
                            />
                          ) : (
                            <CancelIcon
                              sx={{ fontSize: 14, color: "grey.400" }}
                            />
                          )}
                          <Typography
                            variant="caption"
                            color={ok ? "success.main" : "text.secondary"}
                          >
                            {rule.label}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              )}

              {/* Confirmation */}
              <TextField
                label="Confirmer le mot de passe"
                type={showConf ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                fullWidth
                required
                error={confirm.length > 0 && !matches}
                helperText={
                  confirm.length > 0 && !matches
                    ? "Les mots de passe ne correspondent pas."
                    : confirm.length > 0 && matches
                      ? "✓ Les mots de passe correspondent."
                      : ""
                }
                FormHelperTextProps={{
                  sx: {
                    color:
                      confirm.length > 0 && matches
                        ? "success.main"
                        : undefined,
                  },
                }}
                sx={{ mb: 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConf(!showConf)}
                        edge="end"
                        size="small"
                      >
                        {showConf ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={!canSubmit}
              >
                {loading ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  "Activer mon compte"
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Typography
          variant="caption"
          color="text.disabled"
          textAlign="center"
          display="block"
          mt={3}
        >
          © {new Date().getFullYear()} HSEE Platform · Tous droits réservés
        </Typography>
      </Box>
    </Box>
  );
}
