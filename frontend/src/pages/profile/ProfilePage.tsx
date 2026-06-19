import { useState, useRef } from 'react';
import {
  Box, Typography, Card, CardContent, TextField, Button, Alert,
  Avatar, Chip, Divider, CircularProgress, InputAdornment, IconButton,
  LinearProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/userService';
import { authService } from '../../services/authService';

const ROLE_LABELS = { ADMIN_HSEE: 'Admin HSEE', AUDITEUR: 'Auditeur', PILOTE: "Pilote d'Action" };
const ROLE_COLORS = { ADMIN_HSEE: 'primary', AUDITEUR: 'success', PILOTE: 'warning' } as const;

const PASSWORD_RULES = [
  { label: '8 caractères minimum', test: (p: string) => p.length >= 8 },
  { label: '1 lettre majuscule', test: (p: string) => /[A-Z]/.test(p) },
  { label: '1 chiffre', test: (p: string) => /\d/.test(p) },
  { label: '1 caractère spécial', test: (p: string) => /[^a-zA-Z0-9]/.test(p) },
];

const STRENGTH_COLORS = ['error', 'error', 'warning', 'info', 'success'] as const;

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  // Profile edit
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Avatar
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Password change
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [savingPwd, setSavingPwd] = useState(false);

  if (!user) return null;

  const strength = PASSWORD_RULES.filter((r) => r.test(newPwd)).length;
  const allRulesOk = strength === PASSWORD_RULES.length;
  const pwdsMatch = newPwd === confirmPwd;

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setProfileError('');
    setProfileSuccess('');
    try {
      await userService.update(user.id, { firstName, lastName });
      await refreshUser();
      setEditing(false);
      setProfileSuccess('Profil mis à jour.');
    } catch {
      setProfileError('Échec de la mise à jour. Veuillez réessayer.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEditing(false);
    setProfileError('');
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setProfileError('La photo doit faire moins de 2 Mo.');
      return;
    }
    setUploadingAvatar(true);
    try {
      await userService.updateAvatar(user.id, file);
      await refreshUser();
    } catch {
      setProfileError("Échec de l'upload. Veuillez réessayer.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');
    setSavingPwd(true);
    try {
      await authService.changePassword({ currentPassword: currentPwd, newPassword: newPwd });
      setPwdSuccess('Mot de passe modifié avec succès. Toutes vos autres sessions ont été déconnectées.');
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
    } catch (err: unknown) {
      const status = (err as { response?: { status: number } })?.response?.status;
      if (status === 401) {
        setPwdError('Mot de passe actuel incorrect.');
      } else {
        setPwdError('Échec de la modification. Veuillez réessayer.');
      }
    } finally {
      setSavingPwd(false);
    }
  };

  return (
    <Box maxWidth={720} mx="auto">
      <Typography variant="h5" fontWeight={600} mb={3}>Mon profil</Typography>

      {/* Profile info card */}
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="flex-start" gap={3} mb={3}>
            {/* Avatar */}
            <Box position="relative">
              <Avatar
                src={user.avatarUrl}
                sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: 28 }}
              >
                {user.firstName[0]}{user.lastName[0]}
              </Avatar>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png" hidden onChange={handleAvatarChange} />
              <IconButton
                size="small"
                sx={{
                  position: 'absolute', bottom: 0, right: 0,
                  bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
                  '&:hover': { bgcolor: 'grey.100' },
                }}
                onClick={() => fileRef.current?.click()}
                disabled={uploadingAvatar}
              >
                {uploadingAvatar ? <CircularProgress size={14} /> : <CameraAltIcon sx={{ fontSize: 14 }} />}
              </IconButton>
            </Box>

            {/* Identity */}
            <Box flex={1}>
              <Typography variant="h6" fontWeight={600}>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user.email}
              </Typography>
              <Box display="flex" gap={1} alignItems="center" mt={0.5}>
                <Chip label={ROLE_LABELS[user.role]} size="small" color={ROLE_COLORS[user.role]} />
                <Chip label={user.department} size="small" variant="outlined" />
              </Box>
              <Typography variant="caption" color="text.disabled" mt={1} display="block">
                Membre depuis le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
              </Typography>
            </Box>

            {!editing && (
              <Button startIcon={<EditIcon />} onClick={() => { setEditing(true); setProfileSuccess(''); }} size="small">
                Modifier
              </Button>
            )}
          </Box>

          {profileError && <Alert severity="error" sx={{ mb: 2 }}>{profileError}</Alert>}
          {profileSuccess && <Alert severity="success" sx={{ mb: 2 }}>{profileSuccess}</Alert>}

          {editing && (
            <Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Modifier mes informations
              </Typography>
              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={2}>
                <TextField label="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                <TextField label="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </Box>
              <TextField
                label="Email"
                value={user.email}
                disabled
                fullWidth
                helperText="L'email ne peut pas être modifié"
                sx={{ mb: 2 }}
              />
              <Box display="flex" gap={1} justifyContent="flex-end">
                <Button startIcon={<CancelIcon />} onClick={handleCancelEdit}>Annuler</Button>
                <Button
                  variant="contained"
                  startIcon={savingProfile ? undefined : <SaveIcon />}
                  onClick={handleSaveProfile}
                  disabled={savingProfile || !firstName || !lastName}
                >
                  {savingProfile ? <CircularProgress size={20} /> : 'Enregistrer'}
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Change password card */}
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Modifier mon mot de passe
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Une confirmation par email sera envoyée après modification.
          </Typography>

          {pwdError && <Alert severity="error" sx={{ mb: 2 }}>{pwdError}</Alert>}
          {pwdSuccess && <Alert severity="success" sx={{ mb: 2 }}>{pwdSuccess}</Alert>}

          <Box component="form" onSubmit={handleChangePassword} noValidate>
            <TextField
              label="Mot de passe actuel"
              type={showPwd ? 'text' : 'password'}
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPwd(!showPwd)} edge="end">
                      {showPwd ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Nouveau mot de passe"
              type={showPwd ? 'text' : 'password'}
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              fullWidth
              required
              sx={{ mb: 1 }}
            />
            {newPwd && (
              <Box mb={2}>
                <LinearProgress
                  variant="determinate"
                  value={(strength / PASSWORD_RULES.length) * 100}
                  color={STRENGTH_COLORS[strength]}
                  sx={{ height: 4, borderRadius: 2, mb: 0.5 }}
                />
                {PASSWORD_RULES.map((rule) => (
                  <Typography key={rule.label} variant="caption" display="block"
                    color={rule.test(newPwd) ? 'success.main' : 'text.secondary'}>
                    {rule.test(newPwd) ? '✓' : '○'} {rule.label}
                  </Typography>
                ))}
              </Box>
            )}
            <TextField
              label="Confirmer le nouveau mot de passe"
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              fullWidth
              required
              sx={{ mb: 3 }}
              error={confirmPwd.length > 0 && !pwdsMatch}
              helperText={confirmPwd.length > 0 && !pwdsMatch ? 'Les mots de passe ne correspondent pas.' : ''}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={savingPwd || !currentPwd || !allRulesOk || !pwdsMatch}
            >
              {savingPwd ? <CircularProgress size={20} /> : 'Modifier le mot de passe'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}