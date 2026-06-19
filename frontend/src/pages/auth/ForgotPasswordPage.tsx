import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Alert, CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { authService } from '../../services/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch {
      // Don't reveal if email exists — always show success for security
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'grey.50',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 420 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h5" fontWeight={700} color="primary" gutterBottom>
            HSEE Platform
          </Typography>
        </Box>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: 4 }}>
            {sent ? (
              <Box textAlign="center">
                <MarkEmailReadIcon sx={{ fontSize: 56, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Email envoyé
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Si un compte existe pour <strong>{email}</strong>, vous recevrez un lien de réinitialisation
                  valide pendant <strong>1 heure</strong>.
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" mb={3}>
                  Vérifiez également votre dossier spam.
                </Typography>
                <Button component={Link} to="/login" variant="outlined" fullWidth>
                  Retour à la connexion
                </Button>
              </Box>
            ) : (
              <>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Mot de passe oublié
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Saisissez votre adresse email. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <TextField
                    label="Adresse email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                    autoFocus
                    sx={{ mb: 3 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading || !email}
                    sx={{ mb: 2 }}
                  >
                    {loading ? <CircularProgress size={22} color="inherit" /> : 'Envoyer le lien'}
                  </Button>
                  <Button
                    component={Link}
                    to="/login"
                    variant="text"
                    fullWidth
                    startIcon={<ArrowBackIcon />}
                  >
                    Retour à la connexion
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