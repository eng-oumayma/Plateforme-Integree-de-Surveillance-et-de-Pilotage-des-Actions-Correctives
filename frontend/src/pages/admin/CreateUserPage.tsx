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
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { userService } from '../../services/userService';
import type { UserRole } from '../../types';

const ROLES = [
  { value: 'ADMIN_HSEE',    label: 'Admin HSEE',       desc: 'Gestion complète de la plateforme' },
  { value: 'AUDITEUR', label: 'Auditeur',          desc: 'Réalise les inspections et checklists' },
  { value: 'PILOTE_ACTION',   label: "Pilote d'Action",   desc: 'Suit et met à jour les actions correctives' },
];

const DEPARTMENTS = [
  'HSE', 'Production', 'Maintenance', 'Qualité', 'Logistique', 'RH', 'Direction',
];

const ROLE_COLORS = { ADMIN_HSEE: 'primary', AUDITEUR: 'success', PILOTE_ACTION: 'warning' };

const defaultForm = { firstName: '', lastName: '', email: '', role: '', department: '' };
const defaultErrors = { firstName: '', lastName: '', email: '', role: '', department: '' };

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function CreateUserPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState(defaultErrors);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');
  const [createdEmail, setCreatedEmail] = useState('');

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e = { ...defaultErrors };
    let valid = true;
    if (!form.firstName.trim()) { e.firstName = 'Le prénom est requis.'; valid = false; }
    if (!form.lastName.trim())  { e.lastName  = 'Le nom est requis.';    valid = false; }
    if (!form.email.trim())     { e.email     = "L'email est requis.";   valid = false; }
    else if (!validateEmail(form.email)) { e.email = 'Format email invalide.'; valid = false; }
    if (!form.role)             { e.role       = 'Le rôle est requis.';   valid = false; }
    if (!form.department)       { e.department = 'Le département est requis.'; valid = false; }
    setErrors(e);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    setSubmitting(true);
    // 🔥 AJOUTE CE LOG ICI :
  console.log("=== PAYLOAD ENVOYÉ AU BACKEND ===", {
    firstName: form.firstName.trim(),
    lastName:  form.lastName.trim(),
    email:     form.email.trim().toLowerCase(),
    role:      form.role, // 👈 Regarde ce qui s'affiche ici dans ta console !
    department: form.department,
  });


    try {
      await userService.create({
        firstName: form.firstName.trim(),
        lastName:  form.lastName.trim(),
        email:     form.email.trim().toLowerCase(),
        role:      form.role as UserRole,
        department: form.department,
      });
      setCreatedEmail(form.email.trim().toLowerCase());
      setSuccess(true);
    } catch (err) {
      const status = err?.response?.status;
      const msg    = err?.response?.data?.message;
      if (status === 409) setApiError('Un compte avec cet email existe déjà.');
      else setApiError(msg || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(defaultForm);
    setErrors(defaultErrors);
    setSuccess(false);
    setApiError('');
    setCreatedEmail('');
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <Box maxWidth={560} mx="auto" mt={4}>
        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Box
              sx={{
                width: 64, height: 64, borderRadius: '50%',
                bgcolor: 'success.light', display: 'flex',
                alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2,
              }}
            >
              <PersonAddIcon sx={{ color: 'success.dark', fontSize: 32 }} />
            </Box>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Compte créé avec succès
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Un email de bienvenue a été envoyé à
            </Typography>
            <Typography variant="body1" fontWeight={600} color="primary" mb={1}>
              {createdEmail}
            </Typography>
            <Alert severity="info" sx={{ textAlign: 'left', mb: 3 }}>
              <Typography variant="body2">
                Le lien de définition du mot de passe est valable <strong>24 heures</strong>.
                Le compte restera <strong>inactif</strong> jusqu'à la première connexion de l'utilisateur.
              </Typography>
            </Alert>
            <Box display="flex" gap={2} justifyContent="center">
              <Button variant="outlined" onClick={() => navigate('/admin/users')}>
                Retour à la liste
              </Button>
              <Button variant="contained" onClick={handleReset}>
                Créer un autre compte
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────
  return (
    <Box maxWidth={640} mx="auto">
      {/* Header */}
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/users')}
          color="inherit"
          sx={{ mr: 1 }}
        >
          Retour
        </Button>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Nouvel utilisateur
          </Typography>
          <Typography variant="body2" color="text.secondary">
            US-1.1 · Création d'un compte avec rôle et email de bienvenue
          </Typography>
        </Box>
      </Box>

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: 4 }}>

          {apiError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {apiError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>

            {/* Identité */}
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={1.5}>
              IDENTITÉ
            </Typography>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={2}>
              <TextField
                label="Prénom"
                value={form.firstName}
                onChange={(e) => set('firstName', e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName}
                required
                autoFocus
              />
              <TextField
                label="Nom"
                value={form.lastName}
                onChange={(e) => set('lastName', e.target.value)}
                error={!!errors.lastName}
                helperText={errors.lastName}
                required
              />
            </Box>

            <TextField
              label="Adresse email professionnelle"
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email || "Le lien de définition du mot de passe sera envoyé à cette adresse."}
              fullWidth
              required
              sx={{ mb: 3 }}
            />

            <Divider sx={{ mb: 3 }} />

            {/* Rôle */}
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={1.5}>
              RÔLE & DÉPARTEMENT
            </Typography>

            <FormControl fullWidth required error={!!errors.role} sx={{ mb: 2 }}>
              <InputLabel>Rôle</InputLabel>
              <Select
                value={form.role}
                label="Rôle"
                onChange={(e) => set('role', e.target.value)}
                renderValue={(selected) => ROLES.find(r => r.value === selected)?.label || ''}
              >
                {ROLES.map((r) => (
                  <MenuItem key={r.value} value={r.value}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                      <Box>
                        <Typography variant="body2" fontWeight={500}>{r.label}</Typography>
                        <Typography variant="caption" color="text.secondary">{r.desc}</Typography>
                      </Box>
                      {form.role === r.value && (
                        <Chip
                          label={r.label}
                          size="small"
                          color={ROLE_COLORS[r.value] || 'default'}
                          sx={{ ml: 2 }}
                        />
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
            </FormControl>

            {/* Role preview */}
            {form.role && (
              <Alert
                severity="info"
                icon={<InfoOutlinedIcon fontSize="small" />}
                sx={{ mb: 2 }}
              >
                <Typography variant="body2">
                  <strong>{ROLES.find(r => r.value === form.role)?.label}</strong> :{' '}
                  {ROLES.find(r => r.value === form.role)?.desc}.
                </Typography>
              </Alert>
            )}

            <FormControl fullWidth required error={!!errors.department} sx={{ mb: 3 }}>
              <InputLabel>Département</InputLabel>
              <Select
                value={form.department}
                label="Département"
                onChange={(e) => set('department', e.target.value)}
              >
                {DEPARTMENTS.map((d) => (
                  <MenuItem key={d} value={d}>{d}</MenuItem>
                ))}
              </Select>
              {errors.department && <FormHelperText>{errors.department}</FormHelperText>}
            </FormControl>

            <Divider sx={{ mb: 3 }} />

            {/* Info box */}
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body2" fontWeight={500} gutterBottom>
                Ce qui va se passer après la création :
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2 }}>
                <li><Typography variant="body2">Un email de bienvenue est envoyé automatiquement.</Typography></li>
                <li><Typography variant="body2">Le lien de définition du mot de passe expire dans <strong>24h</strong>.</Typography></li>
                <li><Typography variant="body2">Le compte reste <strong>inactif</strong> jusqu'à la première connexion.</Typography></li>
              </Box>
            </Alert>

            {/* Actions */}
            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate('/admin/users')}
                disabled={submitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={submitting ? undefined : <PersonAddIcon />}
                disabled={submitting}
                sx={{ minWidth: 180 }}
              >
                {submitting
                  ? <CircularProgress size={20} color="inherit" />
                  : 'Créer le compte'}
              </Button>
            </Box>

          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
