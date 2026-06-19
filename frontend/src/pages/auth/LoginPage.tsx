import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Alert, InputAdornment, IconButton, CircularProgress,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [failCount, setFailCount] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      const status = err?.response?.status;
      setFailCount((c) => c + 1);
      if (status === 401) {
        setError('Email ou mot de passe incorrect.');
      } else if (status === 423) {
        setError('Compte temporairement bloqué. Réessayez dans 15 minutes.');
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
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
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h5" fontWeight={700} color="primary" gutterBottom>
            HSEE Platform
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hygiène · Sécurité · Santé · Environnement · Énergie
          </Typography>
        </Box>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Connexion
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Accédez à votre espace de surveillance HSEE.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
                {failCount >= 3 && failCount < 5 && (
                  <Typography variant="caption" display="block" mt={0.5}>
                    Attention : compte bloqué après {5 - failCount} tentative(s) supplémentaire(s).
                  </Typography>
                )}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                label="Adresse email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                autoComplete="email"
                autoFocus
                sx={{ mb: 2 }}
              />
              <TextField
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                autoComplete="current-password"
                sx={{ mb: 1 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box textAlign="right" mb={3}>
                <Typography
                  variant="body2"
                  component="span"
                  color="primary"
                  sx={{ cursor: 'pointer', fontSize: 13 }}
                  onClick={() => navigate('/forgot-password')}
                >
                  Mot de passe oublié ?
                </Typography>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading || !email || !password}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Se connecter'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Typography variant="caption" color="text.disabled" textAlign="center" display="block" mt={3}>
          © {new Date().getFullYear()} HSEE Platform · Tous droits réservés
        </Typography>
      </Box>
    </Box>
  );
}