import { Box, Typography, Card, CardContent } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Bonjour, {user?.firstName} 👋
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Tableau de bord HSEE — Epic 6 à venir.
      </Typography>
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', maxWidth: 480 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Les KPIs, graphiques et indicateurs seront disponibles lors de l'implémentation de l'Epic 6.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}