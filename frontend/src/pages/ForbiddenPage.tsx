import { Box, Typography, Button } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';

export default function ForbiddenPage() {
  const navigate = useNavigate();
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" bgcolor="grey.50" p={3}>
      <LockIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
      <Typography variant="h5" fontWeight={600} gutterBottom>Accès refusé</Typography>
      <Typography variant="body2" color="text.secondary" mb={3} textAlign="center">
        Vous n'avez pas les permissions nécessaires pour accéder à cette page.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/dashboard')}>
        Retour au tableau de bord
      </Button>
    </Box>
  );
}