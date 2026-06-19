import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useAuth } from '../../contexts/AuthContext';

export default function InactivityDialog() {
  const { showInactivityWarning, extendSession, logout } = useAuth();

  return (
    <Dialog open={showInactivityWarning} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccessTimeIcon color="warning" />
        Session sur le point d'expirer
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          Votre session expirera dans <strong>2 minutes</strong> en raison d'inactivité.
          Souhaitez-vous rester connecté ?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => logout()} color="inherit">
          Se déconnecter
        </Button>
        <Button onClick={extendSession} variant="contained">
          Rester connecté
        </Button>
      </DialogActions>
    </Dialog>
  );
}