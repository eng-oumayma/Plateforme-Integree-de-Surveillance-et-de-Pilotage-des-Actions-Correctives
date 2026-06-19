import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Alert, CircularProgress, InputAdornment, IconButton, LinearProgress,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { authService } from '../../services/authService';

const PASSWORD_RULES = [
  { label: '8 caractères minimum', test: (p: string) => p.length >= 8 },
  { label: '1 lettre majuscule', test: (p: string) => /[A-Z]/.test(p) },
  { label: '1 chiffre', test: (p: string) => /\d/.test(p) },
  { label: '1 caractère spécial (!@#$%...)', test: (p: string) => /[^a-zA-Z0-9]/.test(p) },
];

function getStrength(password: string): number {
  return PASSWORD_RULES.filter((r) => r.test(password)).length;
}

const STRENGTH_COLORS = ['error', 'error', 'warning', 'info', 'success'] as const;
const STRENGTH_LABELS = ['', 'Faible', 'Faible', 'Moyen', 'Fort'];

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const strength = getStrength(password);
  const allRulesOk = strength === PASSWORD_RULES.length;
  const passwordsMatch = password === confirm;
  const canSubmit = allRulesOk && passwordsMatch && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      setDone(true);
    } catch (err: unknown) {
      const status = (err as { response?: { status: number } })?.response?.status;
      if (status === 400) {
        setError('Ce lien de réinitialisation a expiré ou est invalide. Veuillez en demander un nouveau.');
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="grey.50" p={2}>
        <Alert severity="error">Lien invalide. Veuillez redemander une réinitialisation.</Alert>
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="grey.50" p={2}>
      <Box width="100%" maxWidth={440}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h5" fontWeight={700} color="primary">HSEE Platform</Typography>
        </Box>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: 4 }}>
            {done ? (
              <Box textAlign="center">
                <CheckCircleIcon sx={{ fontSize: 56, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Mot de passe modifié
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.
                </Typography>
                <Button component={Link} to="/login" variant="contained" fullWidth>
                  Se connecter
                </Button>
              </Box>
            ) : (
              <>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Nouveau mot de passe
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Choisissez un mot de passe sécurisé pour votre compte.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <TextField
                    label="Nouveau mot de passe"
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    required
                    sx={{ mb: 1 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPwd(!showPwd)} edge="end">
                            {showPwd ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Strength bar */}
                  {password && (
                    <Box mb={2}>
                      <LinearProgress
                        variant="determinate"
                        value={(strength / PASSWORD_RULES.length) * 100}
                        color={STRENGTH_COLORS[strength]}
                        sx={{ height: 4, borderRadius: 2, mb: 0.5 }}
                      />
                      <Typography variant="caption" color={`${STRENGTH_COLORS[strength]}.main`}>
                        {STRENGTH_LABELS[strength]}
                      </Typography>
                      <Box mt={1}>
                        {PASSWORD_RULES.map((rule) => (
                          <Typography
                            key={rule.label}
                            variant="caption"
                            display="block"
                            color={rule.test(password) ? 'success.main' : 'text.secondary'}
                          >
                            {rule.test(password) ? '✓' : '○'} {rule.label}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  )}

                  <TextField
                    label="Confirmer le mot de passe"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    fullWidth
                    required
                    sx={{ mb: 3 }}
                    error={confirm.length > 0 && !passwordsMatch}
                    helperText={confirm.length > 0 && !passwordsMatch ? 'Les mots de passe ne correspondent pas.' : ''}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={!canSubmit}
                  >
                    {loading ? <CircularProgress size={22} color="inherit" /> : 'Enregistrer le nouveau mot de passe'}
                  </Button>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}