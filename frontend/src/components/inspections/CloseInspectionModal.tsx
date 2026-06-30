import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LockIcon from '@mui/icons-material/Lock';
import { inspectionService } from '../../services/inspectionService';

function formatDuration(startDate: string): string {
  const diff = Math.round((Date.now() - new Date(startDate).getTime()) / 60000);
  if (diff < 60) return `${diff} min`;
  return `${Math.floor(diff / 60)}h ${diff % 60}min`;
}

export default function CloseInspectionModal({
  inspection,
  open,
  onClose,
  onClosed,
}: {
  inspection: any;
  open: boolean;
  onClose: () => void;
  onClosed: (updated: any) => void;
}) {
  const [commentaire, setCommentaire] = useState('');
  const [closing, setClosing]         = useState(false);
  const [error,   setError]           = useState('');

  const handleClose = async () => {
    setError('');
    setClosing(true);
    try {
      const updated = await inspectionService.close(inspection.id, { commentaire });
      onClosed(updated);
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(typeof msg === 'string' ? msg : 'Erreur lors de la clôture.');
    } finally {
      setClosing(false);
    }
  };

  if (!inspection) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <LockIcon color="warning" />
          Clôturer l'inspection
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Résumé */}
        <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 2, mb: 2 }}>
          <Typography variant="body2" fontWeight={600} gutterBottom>
            Résumé de l'inspection
          </Typography>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1}>
            <Typography variant="body2">
              <strong>Domaine :</strong> {(inspection.domaine || '').replace(/_/g, ' ')}
            </Typography>
            <Typography variant="body2">
              <strong>Site :</strong> {inspection.site}
            </Typography>
            <Typography variant="body2">
              <strong>Statut :</strong>{' '}
              <Chip label="En cours" size="small" color="info" />
            </Typography>
            <Box display="flex" alignItems="center" gap={0.5}>
              <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Durée : {formatDuration(inspection.timestamp)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Checklist */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight={600} gutterBottom>
            Avant de clôturer, confirmez :
          </Typography>
          {[
            'La checklist est entièrement remplie',
            'Toutes les anomalies détectées ont été enregistrées',
            'Les photos/preuves ont été ajoutées si nécessaire',
          ].map((item) => (
            <Box key={item} display="flex" alignItems="center" gap={1} mb={0.5}>
              <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography variant="body2" color="text.secondary">{item}</Typography>
            </Box>
          ))}
        </Box>

        <TextField
          label="Commentaire de clôture (optionnel)"
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          fullWidth
          multiline
          rows={2}
          placeholder="Observations, remarques générales..."
        />

        <Alert severity="warning" sx={{ mt: 2 }}>
          Cette action est <strong>irréversible</strong>. L'inspection passera
          au statut <strong>Réalisée</strong>.
        </Alert>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={closing}>
          Annuler
        </Button>
        <Button
          onClick={handleClose}
          variant="contained"
          color="success"
          startIcon={closing ? undefined : <LockIcon />}
          disabled={closing}
        >
          {closing
            ? <CircularProgress size={20} color="inherit" />
            : 'Clôturer l\'inspection'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
