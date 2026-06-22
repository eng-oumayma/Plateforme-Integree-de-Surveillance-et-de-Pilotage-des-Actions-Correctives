import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocationOffIcon from '@mui/icons-material/LocationOff';

type Status = 'idle' | 'loading' | 'success' | 'denied' | 'unsupported';

export default function GeoLocationCapture({ onCapture }) {
  const [status, setStatus] = useState<Status>('idle');
  const [coords, setCoords] = useState<{ latitude: number; longitude: number; accuracy: number } | null>(null);
  const [error,  setError]  = useState('');

  const capture = () => {
    if (!navigator.geolocation) {
      setStatus('unsupported');
      return;
    }
    setStatus('loading');
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setCoords({ latitude, longitude, accuracy });
        setStatus('success');
        onCapture({ latitude, longitude });
      },
      (err) => {
        setStatus('denied');
        if (err.code === 1)      setError('Accès à la localisation refusé. Vérifiez les permissions du navigateur.');
        else if (err.code === 2) setError('Position introuvable. Réessayez.');
        else                     setError('Délai dépassé. Réessayez.');
        onCapture({ latitude: undefined, longitude: undefined });
      },
      { timeout: 10000, maximumAge: 60000, enableHighAccuracy: true }
    );
  };

  const reset = () => {
    setStatus('idle');
    setCoords(null);
    setError('');
    onCapture({ latitude: undefined, longitude: undefined });
  };

  if (status === 'unsupported') {
    return (
      <Alert severity="warning" icon={<LocationOffIcon />}>
        La géolocalisation n'est pas disponible sur cet appareil.
      </Alert>
    );
  }

  if (status === 'success' && coords) {
    return (
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        p: 1.5, border: '1px solid', borderColor: 'success.light',
        borderRadius: 2, bgcolor: 'rgba(29,158,117,0.06)',
      }}>
        <Box display="flex" alignItems="center" gap={1}>
          <LocationOnIcon sx={{ color: 'success.main', fontSize: 20 }} />
          <Box>
            <Typography variant="body2" fontWeight={500} color="success.dark">
              Position capturée
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
              {coords.accuracy ? ` · ±${Math.round(coords.accuracy)}m` : ''}
            </Typography>
          </Box>
        </Box>
        <Button size="small" color="inherit" onClick={reset}>Effacer</Button>
      </Box>
    );
  }

  if (status === 'denied') {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>
        <Button size="small" startIcon={<MyLocationIcon />} onClick={capture} variant="outlined">
          Réessayer
        </Button>
      </Box>
    );
  }

  return (
    <Button
      variant="outlined"
      color="inherit"
      startIcon={status === 'loading' ? <CircularProgress size={16} /> : <MyLocationIcon />}
      onClick={capture}
      disabled={status === 'loading'}
      fullWidth
      sx={{ justifyContent: 'flex-start', px: 2, py: 1.2 }}
    >
      {status === 'loading' ? 'Localisation en cours…' : 'Capturer ma position GPS'}
    </Button>
  );
}