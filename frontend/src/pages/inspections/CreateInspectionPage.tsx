import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AssignmentIcon from '@mui/icons-material/Assignment';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import GeoLocationCapture from '../../components/inspections/GeoLocationCapture';
import { inspectionService } from '../../services/inspectionService';

const DOMAINES = [
  'Plant', 'Magasin', 'Sanitaires', 'Cantine', 'Chimique',
  'Locaux techniques', 'Déchets', 'Transport', 'Infirmerie',
  'Recycleurs', 'Incendie',
];

// Sites LEONI — à adapter selon votre configuration
const SITES = [
  'Mégrine', 'Montplaisir', 'Ben Arous', 'Bir El Bey',
  'Grombalia', 'Sousse', 'Sfax',
];

// Checklist associée à chaque domaine (informatif pour l'utilisateur)
const DOMAINE_CHECKLIST: Record<string, string> = {
  'Plant':             'Checklist Plant & Production',
  'Magasin':           'Checklist Stockage & Magasin',
  'Sanitaires':        'Checklist Sanitaires & Hygiène',
  'Cantine':           'Checklist Restauration',
  'Chimique':          'Checklist Produits Chimiques',
  'Locaux techniques': 'Checklist Locaux Techniques',
  'Déchets':           'Checklist Gestion des Déchets',
  'Transport':         'Checklist Transport & Logistique',
  'Infirmerie':        'Checklist Infirmerie & Secours',
  'Recycleurs':        'Checklist Recycleurs & Tri',
  'Incendie':          'Checklist Sécurité Incendie',
};

const defaultForm = {
  domaine:    '',
  site:       '',
  datePrevue: '',
  latitude:   undefined,
  longitude:  undefined,
};

const defaultErrors = { domaine: '', site: '', datePrevue: '' };

// Today in YYYY-MM-DD for the date input min
const todayStr = new Date().toISOString().split('T')[0];

export default function CreateInspectionPage() {
  const navigate    = useNavigate();
  const [form, setForm]     = useState(defaultForm);
  const [errors, setErrors] = useState(defaultErrors);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');
  const [created, setCreated]   = useState(null);

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  };

  const handleGeo = ({ latitude, longitude }) => {
    setForm((f) => ({ ...f, latitude, longitude }));
  };

  const validate = () => {
    const e = { ...defaultErrors };
    let ok = true;
    if (!form.domaine)    { e.domaine    = 'Le domaine est requis.';       ok = false; }
    if (!form.site)       { e.site       = 'Le site est requis.';          ok = false; }
    if (!form.datePrevue) { e.datePrevue = 'La date prévue est requise.';  ok = false; }
    setErrors(e);
    return ok;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        domaine:    form.domaine,
        site:       form.site,
        datePrevue: new Date(form.datePrevue).toISOString(),
        ...(form.latitude  !== undefined && { latitude:  form.latitude }),
        ...(form.longitude !== undefined && { longitude: form.longitude }),
      };
      const result = await inspectionService.create(payload);
      setCreated(result);
    } catch (err) {
      const msg = err?.response?.data?.message;
      setApiError(typeof msg === 'string' ? msg : 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setSaving(false);
    }
  };

  // ── Succès ──────────────────────────────────────────────────────────────────
  if (created) {
    return (
      <Box maxWidth={560} mx="auto" mt={4}>
        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Box sx={{
              width: 64, height: 64, borderRadius: '50%',
              bgcolor: 'success.light', display: 'flex',
              alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2,
            }}>
              <AssignmentIcon sx={{ color: 'success.dark', fontSize: 32 }} />
            </Box>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Inspection créée
            </Typography>
            <Box sx={{ textAlign: 'left', bgcolor: 'grey.50', borderRadius: 2, p: 2, mb: 2 }}>
              <Typography variant="body2"><strong>Domaine :</strong> {created.domaine}</Typography>
              <Typography variant="body2"><strong>Site :</strong> {created.site}</Typography>
              <Typography variant="body2"><strong>Date prévue :</strong> {new Date(created.datePrevue).toLocaleDateString('fr-FR')}</Typography>
              <Typography variant="body2"><strong>Horodatage :</strong> {new Date(created.timestamp).toLocaleString('fr-FR')}</Typography>
              {created.latitude && (
                <Typography variant="body2"><strong>GPS :</strong> {created.latitude.toFixed(5)}, {created.longitude.toFixed(5)}</Typography>
              )}
              {created.checklist && (
                <Typography variant="body2"><strong>Checklist :</strong> {created.checklist.titre}</Typography>
              )}
            </Box>
            <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
              La checklist <strong>{created.checklist?.titre || DOMAINE_CHECKLIST[created.domaine]}</strong> a été automatiquement associée à cette inspection.
            </Alert>
            <Box display="flex" gap={2} justifyContent="center">
              <Button variant="outlined" onClick={() => navigate('/inspections')}>
                Voir toutes les inspections
              </Button>
              <Button variant="contained" onClick={() => { setCreated(null); setForm(defaultForm); }}>
                Nouvelle inspection
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // ── Formulaire ──────────────────────────────────────────────────────────────
  return (
    <Box maxWidth={640} mx="auto">
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/inspections')} color="inherit">
          Retour
        </Button>
        <Box>
          <Typography variant="h5" fontWeight={700}>Nouvelle inspection</Typography>
          <Typography variant="body2" color="text.secondary">
            US4 · Création avec géolocalisation et horodatage automatiques
          </Typography>
        </Box>
      </Box>

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: 4 }}>
          {apiError && <Alert severity="error" sx={{ mb: 3 }}>{apiError}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate>

            {/* Domaine */}
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={1.5}>
              DOMAINE DE SURVEILLANCE
            </Typography>
            <FormControl fullWidth required error={!!errors.domaine} sx={{ mb: 1 }}>
              <InputLabel>Domaine</InputLabel>
              <Select value={form.domaine} label="Domaine" onChange={(e) => set('domaine', e.target.value)}>
                {DOMAINES.map((d) => (
                  <MenuItem key={d} value={d}>{d}</MenuItem>
                ))}
              </Select>
              {errors.domaine && <FormHelperText>{errors.domaine}</FormHelperText>}
            </FormControl>

            {/* Checklist preview */}
            {form.domaine && (
              <Alert severity="info" icon={<InfoOutlinedIcon fontSize="small" />} sx={{ mb: 2 }}>
                Checklist associée automatiquement : <strong>{DOMAINE_CHECKLIST[form.domaine]}</strong>
              </Alert>
            )}

            <Divider sx={{ my: 2.5 }} />

            {/* Site & Date */}
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={1.5}>
              LOCALISATION & PLANIFICATION
            </Typography>
            <FormControl fullWidth required error={!!errors.site} sx={{ mb: 2 }}>
              <InputLabel>Site</InputLabel>
              <Select value={form.site} label="Site" onChange={(e) => set('site', e.target.value)}>
                {SITES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
              {errors.site && <FormHelperText>{errors.site}</FormHelperText>}
            </FormControl>

            <TextField
              label="Date prévue"
              type="date"
              value={form.datePrevue}
              onChange={(e) => set('datePrevue', e.target.value)}
              fullWidth
              required
              error={!!errors.datePrevue}
              helperText={errors.datePrevue}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: todayStr }}
              sx={{ mb: 3 }}
            />

            <Divider sx={{ my: 2.5 }} />

            {/* Géolocalisation */}
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={0.5}>
              GÉOLOCALISATION
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
              Optionnelle — recommandée pour les inspections terrain sur mobile.
            </Typography>
            <GeoLocationCapture onCapture={handleGeo} />

            {form.latitude && (
              <Box display="flex" gap={1} mt={1.5}>
                <Chip label={`Lat : ${form.latitude.toFixed(5)}`} size="small" variant="outlined" />
                <Chip label={`Lng : ${form.longitude.toFixed(5)}`} size="small" variant="outlined" />
              </Box>
            )}

            <Divider sx={{ my: 2.5 }} />

            {/* Info horodatage */}
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                L'horodatage sera capturé automatiquement côté serveur à la création
                (non falsifiable).
              </Typography>
            </Alert>

            {/* Actions */}
            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button variant="outlined" color="inherit" onClick={() => navigate('/inspections')} disabled={saving}>
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={saving ? undefined : <AssignmentIcon />}
                disabled={saving}
                sx={{ minWidth: 200 }}
              >
                {saving ? <CircularProgress size={20} color="inherit" /> : 'Créer l\'inspection'}
              </Button>
            </Box>

          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
