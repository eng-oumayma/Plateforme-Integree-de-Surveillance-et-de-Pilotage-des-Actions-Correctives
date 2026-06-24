import { useState, useEffect } from 'react';
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
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { planningService } from '../../services/Planningservice';
import { userService } from '../../services/userService';

const DOMAINES = [
    'Plant', 
  'Magasin', 
  'Sanitaires', 
  'Cantine', 
  'Chimique',
  'Locaux_techniques', 
  'Déchets', 
  'Transport', 
  'Infirmerie',
  'Recycleurs', 
  'Incendie',
]
const SITES = ['Sousse', 'Manzel hayett', 'Mateur'];

const FREQUENCES = [
  { value: 'HEBDOMADAIRE', label: 'Hebdomadaire',  desc: 'Chaque semaine (52 inspections/an)',  step: 1  },
  { value: 'MENSUEL',      label: 'Mensuel',        desc: 'Toutes les 4 semaines (13/an)',        step: 4  },
  { value: 'TRIMESTRIEL',  label: 'Trimestriel',    desc: 'Toutes les 13 semaines (4/an)',        step: 13 },
  { value: 'ANNUEL',       label: 'Annuel',         desc: 'Une fois par an (semaine choisie)',    step: 52 },
];

const SEMAINES = Array.from({ length: 52 }, (_, i) => i + 1);

const currentYear = new Date().getFullYear();
const ANNEES = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2];

const defaultForm = {
  domaine:      '',
  site:         '',
  frequence:    '',
  annee:        currentYear,
  semaineDebut: 1,
  responsableId: '',
  commentaire:  '',
};

const defaultErrors = {
  domaine: '', site: '', frequence: '', annee: '', semaineDebut: '',
};

export default function PlanningConfigPage() {
  const navigate = useNavigate();

  const [form, setForm]         = useState(defaultForm);
  const [errors, setErrors]     = useState(defaultErrors);
  const [saving, setSaving]     = useState(false);
  const [apiError, setApiError] = useState('');
  const [result, setResult]     = useState<any[] | null>(null);

  const [auditeurs, setAuditeurs]               = useState<any[]>([]);
  const [loadingAuditeurs, setLoadingAuditeurs] = useState(true);

  useEffect(() => {
    userService.getAll({ role: 'AUDITEUR' })
      .then((data) => setAuditeurs(data.filter((u: any) => u.status === 'ACTIVE')))
      .catch(() => {})
      .finally(() => setLoadingAuditeurs(false));
  }, []);

  const set = (field: string, value: any) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  };

  // Calcul du nombre d'occurrences prévisionnelles
  const getPreview = () => {
    if (!form.frequence || !form.semaineDebut) return null;
    const freq = FREQUENCES.find((f) => f.value === form.frequence);
    if (!freq) return null;
    const count = Math.ceil((52 - form.semaineDebut + 1) / freq.step);
    return Math.max(1, count);
  };

  const validate = () => {
    const e = { ...defaultErrors };
    let ok = true;
    if (!form.domaine)   { e.domaine   = 'Le domaine est requis.';   ok = false; }
    if (!form.site)      { e.site      = 'Le site est requis.';      ok = false; }
    if (!form.frequence) { e.frequence = 'La fréquence est requise.'; ok = false; }
    if (!form.annee)     { e.annee     = "L'année est requise.";     ok = false; }
    setErrors(e);
    return ok;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    setSaving(true);
    try {
      const payload: any = {
        domaine:      form.domaine,
        site:         form.site,
        frequence:    form.frequence,
        annee:        Number(form.annee),
        semaineDebut: Number(form.semaineDebut),
      };
      if (form.responsableId) payload.responsableId = form.responsableId;
      if (form.commentaire)   payload.commentaire   = form.commentaire;

      const created = await planningService.create(payload);
      setResult(created);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      if (Array.isArray(msg)) setApiError(msg.join(' | '));
      else setApiError(typeof msg === 'string' ? msg : 'Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  };

  const preview = getPreview();
  const selectedFreq = FREQUENCES.find((f) => f.value === form.frequence);

  // ── Écran succès ──────────────────────────────────────────────────────────
  if (result) {
    return (
      <Box maxWidth={560} mx="auto" mt={4}>
        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Box sx={{
              width: 64, height: 64, borderRadius: '50%',
              bgcolor: 'success.light', display: 'flex',
              alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2,
            }}>
              <EventRepeatIcon sx={{ color: 'success.dark', fontSize: 32 }} />
            </Box>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Plan créé avec succès
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              <strong>{result.length}</strong> inspection(s) planifiée(s) générée(s)
              pour <strong>{form.domaine.replace(/_/g, ' ')}</strong> — {form.site}
            </Typography>
            <Alert severity="info" sx={{ textAlign: 'left', mb: 3 }}>
              Fréquence : <strong>{selectedFreq?.label}</strong> · Année : <strong>{form.annee}</strong> ·
              Semaines concernées : <strong>S{result[0]?.semaine} → S{result[result.length - 1]?.semaine}</strong>
            </Alert>
            <Box display="flex" gap={2} justifyContent="center">
              <Button variant="outlined" onClick={() => navigate('/planning')}>
                Voir le calendrier
              </Button>
              <Button variant="contained" onClick={() => { setResult(null); setForm(defaultForm); }}>
                Nouveau plan
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // ── Formulaire ────────────────────────────────────────────────────────────
  return (
    <Box maxWidth={680} mx="auto">
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/planning')} color="inherit">
          Retour
        </Button>
        <Box>
          <Typography variant="h5" fontWeight={700}>Configurer un plan de surveillance</Typography>
          <Typography variant="body2" color="text.secondary">
            US6 · Planification 52 semaines avec récurrences automatiques
          </Typography>
        </Box>
      </Box>

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: 4 }}>
          {apiError && <Alert severity="error" sx={{ mb: 3 }}>{apiError}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate>

            {/* ── Domaine & Site ── */}
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={1.5}>
              DOMAINE & SITE
            </Typography>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={0}>
              <FormControl required error={!!errors.domaine}>
                <InputLabel>Domaine</InputLabel>
                <Select value={form.domaine} label="Domaine" onChange={(e) => set('domaine', e.target.value)}>
                  {DOMAINES.map((d) => (
                    <MenuItem key={d} value={d}>{d.replace(/_/g, ' ')}</MenuItem>
                  ))}
                </Select>
                {errors.domaine && <FormHelperText>{errors.domaine}</FormHelperText>}
              </FormControl>
              <FormControl required error={!!errors.site}>
                <InputLabel>Site</InputLabel>
                <Select value={form.site} label="Site" onChange={(e) => set('site', e.target.value)}>
                  {SITES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
                {errors.site && <FormHelperText>{errors.site}</FormHelperText>}
              </FormControl>
            </Box>

            <Divider sx={{ my: 2.5 }} />

            {/* ── Fréquence & Période ── */}
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={1.5}>
              FRÉQUENCE & PÉRIODE
            </Typography>
            <FormControl fullWidth required error={!!errors.frequence} sx={{ mb: 2 }}>
              <InputLabel>Fréquence</InputLabel>
              <Select value={form.frequence} label="Fréquence" onChange={(e) => set('frequence', e.target.value)}>
                {FREQUENCES.map((f) => (
                  <MenuItem key={f.value} value={f.value}>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>{f.label}</Typography>
                      <Typography variant="caption" color="text.secondary">{f.desc}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {errors.frequence && <FormHelperText>{errors.frequence}</FormHelperText>}
            </FormControl>

            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={1}>
              <FormControl required error={!!errors.annee}>
                <InputLabel>Année</InputLabel>
                <Select value={form.annee} label="Année" onChange={(e) => set('annee', Number(e.target.value))}>
                  {ANNEES.map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                </Select>
                {errors.annee && <FormHelperText>{errors.annee}</FormHelperText>}
              </FormControl>
              <FormControl required error={!!errors.semaineDebut}>
                <InputLabel>Semaine de début</InputLabel>
                <Select
                  value={form.semaineDebut}
                  label="Semaine de début"
                  onChange={(e) => set('semaineDebut', Number(e.target.value))}
                >
                  {SEMAINES.map((s) => (
                    <MenuItem key={s} value={s}>Semaine {s}</MenuItem>
                  ))}
                </Select>
                {errors.semaineDebut && <FormHelperText>{errors.semaineDebut}</FormHelperText>}
              </FormControl>
            </Box>

            {/* Aperçu des occurrences */}
            {preview && form.frequence && (
              <Alert severity="info" icon={<InfoOutlinedIcon fontSize="small" />} sx={{ mb: 0 }}>
                <strong>{preview} inspection(s)</strong> seront planifiées automatiquement
                à partir de la semaine <strong>S{form.semaineDebut}</strong> —
                fréquence <strong>{selectedFreq?.label}</strong>.
              </Alert>
            )}

            <Divider sx={{ my: 2.5 }} />

            {/* ── Responsable ── */}
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={1.5}>
              RESPONSABLE (optionnel)
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>
                {loadingAuditeurs ? 'Chargement…' : 'Assigner un auditeur responsable'}
              </InputLabel>
              <Select
                value={form.responsableId}
                label={loadingAuditeurs ? 'Chargement…' : 'Assigner un auditeur responsable'}
                onChange={(e) => set('responsableId', e.target.value)}
                disabled={loadingAuditeurs}
                renderValue={(selected) => {
                  if (!selected) return '';
                  const a = auditeurs.find((u) => u.id === selected);
                  if (!a) return selected;
                  return (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ width: 22, height: 22, fontSize: 10, bgcolor: 'success.main' }}>
                        {a.firstName?.[0]}{a.lastName?.[0]}
                      </Avatar>
                      <Typography variant="body2">{a.firstName} {a.lastName}</Typography>
                    </Box>
                  );
                }}
              >
                <MenuItem value=""><em>Aucun</em></MenuItem>
                {auditeurs.map((a) => (
                  <MenuItem key={a.id} value={a.id}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar sx={{ width: 30, height: 30, fontSize: 11, bgcolor: 'success.main' }}>
                        {a.firstName?.[0]}{a.lastName?.[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>{a.firstName} {a.lastName}</Typography>
                        <Typography variant="caption" color="text.secondary">{a.department}</Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Commentaire (optionnel)"
              value={form.commentaire}
              onChange={(e) => set('commentaire', e.target.value)}
              fullWidth multiline rows={2}
              sx={{ mb: 0 }}
            />

            <Divider sx={{ my: 2.5 }} />

            {/* ── Actions ── */}
            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button variant="outlined" color="inherit" onClick={() => navigate('/planning')} disabled={saving}>
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={saving ? undefined : <EventRepeatIcon />}
                disabled={saving}
                sx={{ minWidth: 220 }}
              >
                {saving
                  ? <CircularProgress size={20} color="inherit" />
                  : `Générer ${preview ? `${preview} inspection(s)` : 'le plan'}`}
              </Button>
            </Box>

          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}