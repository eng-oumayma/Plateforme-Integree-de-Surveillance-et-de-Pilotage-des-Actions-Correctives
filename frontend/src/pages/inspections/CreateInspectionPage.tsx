// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import Alert from '@mui/material/Alert';
// import CircularProgress from '@mui/material/CircularProgress';
// import MenuItem from '@mui/material/MenuItem';
// import Select from '@mui/material/Select';
// import FormControl from '@mui/material/FormControl';
// import FormHelperText from '@mui/material/FormHelperText';
// import InputLabel from '@mui/material/InputLabel';
// import Divider from '@mui/material/Divider';
// import Chip from '@mui/material/Chip';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import AssignmentIcon from '@mui/icons-material/Assignment';
// import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// import GeoLocationCapture from '../../components/inspections/GeoLocationCapture';
// import { inspectionService } from '../../services/inspectionService';

// const DOMAINES = [
//   'PLANT', 
//   'MAGASIN',            
//   'SANITAIRES',        
//   'CANTINE',           
//   'CHIMIQUE',         
//   'LOCAUX_TECHNIQUES',  
//   'DECHETS',            
//   'TRANSPORT',          
//   'INFIRMERIE',         
//   'RECYCLEURS',
//   'INCENDIE',
// ];

// // Sites LEONI — à adapter selon votre configuration
// const SITES = [
//   'Sousse', 'Manzel hayett', 'mateur',
  
// ];

// // Checklist associée à chaque domaine (informatif pour l'utilisateur)
// const DOMAINE_CHECKLIST: Record<string, string> = {
//   'PLANT':             'Checklist Plant & Production',
//   'MAGASIN':           'Checklist Stockage & Magasin',
//   'SANITAIRES':        'Checklist Sanitaires & Hygiène',
//   'CANTINE':           'Checklist Restauration',
//   'CHIMIQUE':          'Checklist Produits Chimiques',
//   'LOCAUX_TECHNIQUES': 'Checklist Locaux Techniques',
//   'DECHETS':           'Checklist Gestion des Déchets',
//   'TRANSPORT':         'Checklist Transport & Logistique',
//   'INFIRMERIE':        'Checklist Infirmerie & Secours',
//   'RECYCLEURS':        'Checklist Recycleurs & Tri',
//   'INCENDIE':          'Checklist Sécurité Incendie',
// };

// const defaultForm = {
//   domaine:    '',
//   site:       '',
//   datePrevue: '',
//   latitude:   undefined,
//   longitude:  undefined,
// };

// const defaultErrors = { domaine: '', site: '', datePrevue: '' };

// // Today in YYYY-MM-DD for the date input min
// const todayStr = new Date().toISOString().split('T')[0];

// export default function CreateInspectionPage() {
//   const navigate    = useNavigate();
//   const [form, setForm]     = useState(defaultForm);
//   const [errors, setErrors] = useState(defaultErrors);
//   const [saving, setSaving] = useState(false);
//   const [apiError, setApiError] = useState('');
//   const [created, setCreated]   = useState(null);

//   const set = (field, value) => {
//     setForm((f) => ({ ...f, [field]: value }));
//     setErrors((e) => ({ ...e, [field]: '' }));
//   };

//   const handleGeo = ({ latitude, longitude }) => {
//     setForm((f) => ({ ...f, latitude, longitude }));
//   };

//   const validate = () => {
//     const e = { ...defaultErrors };
//     let ok = true;
//     if (!form.domaine)    { e.domaine    = 'Le domaine est requis.';       ok = false; }
//     if (!form.site)       { e.site       = 'Le site est requis.';          ok = false; }
//     if (!form.datePrevue) { e.datePrevue = 'La date prévue est requise.';  ok = false; }
//     setErrors(e);
//     return ok;
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setApiError('');
//   //   if (!validate()) return;
//   //   setSaving(true);
//   //   try {
//   //     const payload = {
//   //       domaine:    form.domaine,
//   //       site:       form.site,
//   //       datePrevue: new Date(form.datePrevue).toISOString(),
//   //       ...(form.latitude  !== undefined && { latitude:  form.latitude }),
//   //       ...(form.longitude !== undefined && { longitude: form.longitude }),
//   //     };
//   //     const result = await inspectionService.create(payload);
//   //     setCreated(result);
//   //   } catch (err) {
//   //     const msg = err?.response?.data?.message;
//   //     setApiError(typeof msg === 'string' ? msg : 'Une erreur est survenue. Veuillez réessayer.');
//   //   } finally {
//   //     setSaving(false);
//   //   }
//   // };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setApiError('');
//   if (!validate()) return;
//   setSaving(true);
//   try {
//     // 1. Nettoyer le site de ses espaces superflus aux extrémités
//     const siteNettoye = form.site.trim();

//     // 2. Convertir le domaine au format attendu par le backend (ex: "Locaux techniques" -> "LOCAUX_TECHNIQUES")
//     // Si ton enum backend utilise simplement les majuscules, cette ligne règle le problème :
//     const domaineNettoye = form.domaine.toUpperCase().replace(/ /g, '_');

//     const payload = {
//       domaine:    domaineNettoye, // 🔥 Envoyé au bon format Enum
//       site:       siteNettoye,    // 🔥 Sans l'espace de "Sousse "
//       datePrevue: new Date(form.datePrevue).toISOString(),
//       ...(form.latitude  !== undefined && { latitude:  form.latitude }),
//       ...(form.longitude !== undefined && { longitude: form.longitude }),
//     };

//     // --- LOG DE SÉCURITÉ POUR VÉRIFIER TON PAYLOAD ---
//     console.log("Payload envoyé au serveur :", payload);

//     const result = await inspectionService.create(payload);
//     setCreated(result);
//   } catch (err) {
//     const msg = err?.response?.data?.message;
//     // Si class-validator renvoie un tableau de messages, on les assemble proprement
//     if (Array.isArray(msg)) {
//       setApiError(msg.join(' | '));
//     } else {
//       setApiError(typeof msg === 'string' ? msg : 'Une erreur est survenue. Veuillez réessayer.');
//     }
//   } finally {
//     setSaving(false);
//   }
// };

//   // ── Succès ──────────────────────────────────────────────────────────────────
//   if (created) {
//     return (
//       <Box maxWidth={560} mx="auto" mt={4}>
//         <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
//           <CardContent sx={{ p: 4, textAlign: 'center' }}>
//             <Box sx={{
//               width: 64, height: 64, borderRadius: '50%',
//               bgcolor: 'success.light', display: 'flex',
//               alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2,
//             }}>
//               <AssignmentIcon sx={{ color: 'success.dark', fontSize: 32 }} />
//             </Box>
//             <Typography variant="h6" fontWeight={700} gutterBottom>
//               Inspection créée
//             </Typography>
//             <Box sx={{ textAlign: 'left', bgcolor: 'grey.50', borderRadius: 2, p: 2, mb: 2 }}>
//               <Typography variant="body2"><strong>Domaine :</strong> {created.domaine}</Typography>
//               <Typography variant="body2"><strong>Site :</strong> {created.site}</Typography>
//               <Typography variant="body2"><strong>Date prévue :</strong> {new Date(created.datePrevue).toLocaleDateString('fr-FR')}</Typography>
//               <Typography variant="body2"><strong>Horodatage :</strong> {new Date(created.timestamp).toLocaleString('fr-FR')}</Typography>
//               {created.latitude && (
//                 <Typography variant="body2"><strong>GPS :</strong> {created.latitude.toFixed(5)}, {created.longitude.toFixed(5)}</Typography>
//               )}
//               {created.checklist && (
//                 <Typography variant="body2"><strong>Checklist :</strong> {created.checklist.titre}</Typography>
//               )}
//             </Box>
//             <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
//               La checklist <strong>{created.checklist?.titre || DOMAINE_CHECKLIST[created.domaine]}</strong> a été automatiquement associée à cette inspection.
//             </Alert>
//             <Box display="flex" gap={2} justifyContent="center">
//               <Button variant="outlined" onClick={() => navigate('/inspections')}>
//                 Voir toutes les inspections
//               </Button>
//               <Button variant="contained" onClick={() => { setCreated(null); setForm(defaultForm); }}>
//                 Nouvelle inspection
//               </Button>
//             </Box>
//           </CardContent>
//         </Card>
//       </Box>
//     );
//   }

//   // ── Formulaire ──────────────────────────────────────────────────────────────
//   return (
//     <Box maxWidth={640} mx="auto">
//       <Box display="flex" alignItems="center" gap={1} mb={3}>
//         <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/inspections')} color="inherit">
//           Retour
//         </Button>
//         <Box>
//           <Typography variant="h5" fontWeight={700}>Nouvelle inspection</Typography>
//           <Typography variant="body2" color="text.secondary">
//             US4 · Création avec géolocalisation et horodatage automatiques
//           </Typography>
//         </Box>
//       </Box>

//       <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
//         <CardContent sx={{ p: 4 }}>
//           {apiError && <Alert severity="error" sx={{ mb: 3 }}>{apiError}</Alert>}

//           <Box component="form" onSubmit={handleSubmit} noValidate>

//             {/* Domaine */}
//             <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={1.5}>
//               DOMAINE DE SURVEILLANCE
//             </Typography>
//             <FormControl fullWidth required error={!!errors.domaine} sx={{ mb: 1 }}>
//               <InputLabel>Domaine</InputLabel>
//               <Select value={form.domaine} label="Domaine" onChange={(e) => set('domaine', e.target.value)}>
//                 {DOMAINES.map((d) => (
//                   <MenuItem key={d} value={d}>{d}</MenuItem>
//                 ))}
//               </Select>
//               {errors.domaine && <FormHelperText>{errors.domaine}</FormHelperText>}
//             </FormControl>

//             {/* Checklist preview */}
//             {form.domaine && (
//               <Alert severity="info" icon={<InfoOutlinedIcon fontSize="small" />} sx={{ mb: 2 }}>
//                 Checklist associée automatiquement : <strong>{DOMAINE_CHECKLIST[form.domaine]}</strong>
//               </Alert>
//             )}

//             <Divider sx={{ my: 2.5 }} />

//             {/* Site & Date */}
//             <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={1.5}>
//               LOCALISATION & PLANIFICATION
//             </Typography>
//             <FormControl fullWidth required error={!!errors.site} sx={{ mb: 2 }}>
//               <InputLabel>Site</InputLabel>
//               <Select value={form.site} label="Site" onChange={(e) => set('site', e.target.value)}>
//                 {SITES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
//               </Select>
//               {errors.site && <FormHelperText>{errors.site}</FormHelperText>}
//             </FormControl>

//             <TextField
//               label="Date prévue"
//               type="date"
//               value={form.datePrevue}
//               onChange={(e) => set('datePrevue', e.target.value)}
//               fullWidth
//               required
//               error={!!errors.datePrevue}
//               helperText={errors.datePrevue}
//               InputLabelProps={{ shrink: true }}
//               inputProps={{ min: todayStr }}
//               sx={{ mb: 3 }}
//             />

//             <Divider sx={{ my: 2.5 }} />

//             {/* Géolocalisation */}
//             <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={0.5}>
//               GÉOLOCALISATION
//             </Typography>
//             <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
//               Optionnelle — recommandée pour les inspections terrain sur mobile.
//             </Typography>
//             <GeoLocationCapture onCapture={handleGeo} />

//             {form.latitude && (
//               <Box display="flex" gap={1} mt={1.5}>
//                 <Chip label={`Lat : ${form.latitude.toFixed(5)}`} size="small" variant="outlined" />
//                 <Chip label={`Lng : ${form.longitude.toFixed(5)}`} size="small" variant="outlined" />
//               </Box>
//             )}

//             <Divider sx={{ my: 2.5 }} />

//             {/* Info horodatage */}
//             <Alert severity="info" sx={{ mb: 3 }}>
//               <Typography variant="body2">
//                 L'horodatage sera capturé automatiquement côté serveur à la création
//                 (non falsifiable).
//               </Typography>
//             </Alert>

//             {/* Actions */}
//             <Box display="flex" gap={2} justifyContent="flex-end">
//               <Button variant="outlined" color="inherit" onClick={() => navigate('/inspections')} disabled={saving}>
//                 Annuler
//               </Button>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 startIcon={saving ? undefined : <AssignmentIcon />}
//                 disabled={saving}
//                 sx={{ minWidth: 200 }}
//               >
//                 {saving ? <CircularProgress size={20} color="inherit" /> : 'Créer l\'inspection'}
//               </Button>
//             </Box>

//           </Box>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }
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
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AssignmentIcon from '@mui/icons-material/Assignment';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import GeoLocationCapture from '../../components/inspections/GeoLocationCapture';
import { inspectionService } from '../../services/inspectionService';
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
];
const SITES = ['Sousse', 'Manzel hayett', 'Mateur'];

const DOMAINE_CHECKLIST: Record<string, string> = {
  Plant:             'Checklist Plant & Production',
  Magasin:           'Checklist Stockage & Magasin',
  Sanitaires:        'Checklist Sanitaires & Hygiène',
  Cantine:           'Checklist Restauration',
  Chimique:          'Checklist Produits Chimiques',
  Locaux_techniques: 'Checklist Locaux Techniques',
  Déchets:           'Checklist Gestion des Déchets',
  Transport:         'Checklist Transport & Logistique',
  Infirmerie:        'Checklist Infirmerie & Secours',
  Recycleurs:        'Checklist Recycleurs & Tri',
  INCENDIE:          'Checklist Sécurité Incendie',
};

const defaultForm = {
  domaine:    '',
  site:       '',
  datePrevue: '',
  auditeurId: '',
  latitude:   undefined,
  longitude:  undefined,
};

const defaultErrors = { domaine: '', site: '', datePrevue: '', auditeurId: '' };

const todayStr = new Date().toISOString().split('T')[0];

export default function CreateInspectionPage() {
  const navigate = useNavigate();

  const [form, setForm]         = useState(defaultForm);
  const [errors, setErrors]     = useState(defaultErrors);
  const [saving, setSaving]     = useState(false);
  const [apiError, setApiError] = useState('');
  const [created, setCreated]   = useState(null);

  // ── Liste des auditeurs chargée depuis le backend ─────────────────────────
  const [auditeurs, setAuditeurs]         = useState<any[]>([]);
  const [loadingAuditeurs, setLoadingAuditeurs] = useState(true);
  const [auditeurError, setAuditeurError] = useState('');

  useEffect(() => {
    const fetchAuditeurs = async () => {
      setLoadingAuditeurs(true);
      setAuditeurError('');
      try {
        // GET /users?role=AUDITEUR — filtre côté backend
        const data = await userService.getAll({ role: 'AUDITEUR' });
        // Garde seulement les comptes ACTIVE
        setAuditeurs(data.filter((u: any) => u.status === 'ACTIVE'));
      } catch {
        setAuditeurError('Impossible de charger la liste des auditeurs.');
      } finally {
        setLoadingAuditeurs(false);
      }
    };
    fetchAuditeurs();
  }, []);

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
    if (!form.domaine)     { e.domaine     = 'Le domaine est requis.';      ok = false; }
    if (!form.site)        { e.site        = 'Le site est requis.';         ok = false; }
    if (!form.datePrevue)  { e.datePrevue  = 'La date prévue est requise.'; ok = false; }
    if (!form.auditeurId)  { e.auditeurId  = "L'auditeur est requis.";      ok = false; }
    setErrors(e);
    return ok;
  };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setApiError('');
//   if (!validate()) return;
//   setSaving(true);
//   try {
//     const payload = {
//       domaine:    form.domaine, // 👈 On envoie directement la valeur (ex: 'Déchets' ou 'Locaux techniques')
//       site:       form.site.trim(),
//       datePrevue: new Date(form.datePrevue).toISOString(),
//       ...(form.latitude  !== undefined && { latitude:  form.latitude }),
//       ...(form.longitude !== undefined && { longitude: form.longitude }),
//     };

//     // Petit log pour t'assurer du format dans la console
//     console.log("=== INSPECTION PAYLOAD ===", payload);

//     const result = await inspectionService.create(payload);
//     setCreated(result);
//   } catch (err) {
//     const msg = err?.response?.data?.message;
//     if (Array.isArray(msg)) {
//       setApiError(msg.join(' | '));
//     } else {
//       setApiError(typeof msg === 'string' ? msg : 'Une erreur est survenue. Veuillez réessayer.');
//     }
//   } finally {
//     setSaving(false);
//   }
// };

  // Remplacer le handleSubmit dans CreateInspectionPage.tsx par ceci :

const handleSubmit = async (e) => {
  e.preventDefault();
  setApiError('');
  if (!validate()) return;
  setSaving(true);
  try {
    const payload: any = {
      domaine:    form.domaine,          // ✅ déjà "PLANT", "MAGASIN"... — NE PAS transformer
      site:       form.site.trim(),
      datePrevue: new Date(form.datePrevue).toISOString(),
      auditeurId: form.auditeurId,       // ✅ UUID sélectionné depuis la liste
    };

    // Ajouter GPS seulement si capturé
    if (form.latitude  !== undefined) payload.latitude  = form.latitude;
    if (form.longitude !== undefined) payload.longitude = form.longitude;

    console.log('Payload envoyé :', payload);
    const result = await inspectionService.create(payload);
    setCreated(result);
  } catch (err: any) {
    const msg = err?.response?.data?.message;
    if (Array.isArray(msg)) setApiError(msg.join(' | '));
    else setApiError(typeof msg === 'string' ? msg : 'Une erreur est survenue.');
  } finally {
    setSaving(false);
  }
};

  // ── Auditeur sélectionné (pour affichage) ────────────────────────────────
  const selectedAuditeur = auditeurs.find((a) => a.id === form.auditeurId);

  // ── Écran succès ─────────────────────────────────────────────────────────
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
              <Typography variant="body2">
                <strong>Auditeur :</strong>{' '}
                {created.auditeur?.firstName} {created.auditeur?.lastName}
              </Typography>
              <Typography variant="body2">
                <strong>Date prévue :</strong>{' '}
                {new Date(created.datePrevue).toLocaleDateString('fr-FR')}
              </Typography>
              <Typography variant="body2">
                <strong>Horodatage :</strong>{' '}
                {new Date(created.timestamp).toLocaleString('fr-FR')}
              </Typography>
              {created.latitude && (
                <Typography variant="body2">
                  <strong>GPS :</strong> {created.latitude.toFixed(5)}, {created.longitude.toFixed(5)}
                </Typography>
              )}
            </Box>
            <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
              Checklist associée : <strong>{DOMAINE_CHECKLIST[created.domaine]}</strong>
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

  // ── Formulaire ────────────────────────────────────────────────────────────
  return (
    <Box maxWidth={640} mx="auto">
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/inspections')} color="inherit">
          Retour
        </Button>
        <Box>
          <Typography variant="h5" fontWeight={700}>Nouvelle inspection</Typography>
          <Typography variant="body2" color="text.secondary">
            Création avec géolocalisation et horodatage automatiques
          </Typography>
        </Box>
      </Box>

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: 4 }}>
          {apiError && <Alert severity="error" sx={{ mb: 3 }}>{apiError}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate>

            {/* ── Domaine ── */}
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={1.5}>
              DOMAINE DE SURVEILLANCE
            </Typography>

            <FormControl fullWidth required error={!!errors.domaine} sx={{ mb: 1 }}>
              <InputLabel>Domaine</InputLabel>
              <Select value={form.domaine} label="Domaine" onChange={(e) => set('domaine', e.target.value)}>
                {DOMAINES.map((d) => (
                  <MenuItem key={d} value={d}>{d.replace(/_/g, ' ')}</MenuItem>
                ))}
              </Select>
              {errors.domaine && <FormHelperText>{errors.domaine}</FormHelperText>}
            </FormControl>

            {form.domaine && (
              <Alert severity="info" icon={<InfoOutlinedIcon fontSize="small" />} sx={{ mb: 2 }}>
                Checklist associée : <strong>{DOMAINE_CHECKLIST[form.domaine]}</strong>
              </Alert>
            )}

            <Divider sx={{ my: 2.5 }} />

            {/* ── Site & Date ── */}
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
              sx={{ mb: 0 }}
            />

            <Divider sx={{ my: 2.5 }} />

            {/* ── Auditeur ── */}
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={1.5}>
              AUDITEUR ASSIGNÉ
            </Typography>

            {auditeurError && (
              <Alert severity="error" sx={{ mb: 2 }}>{auditeurError}</Alert>
            )}

            <FormControl fullWidth required error={!!errors.auditeurId} sx={{ mb: 1 }}>
              <InputLabel>
                {loadingAuditeurs ? 'Chargement des auditeurs…' : 'Sélectionner un auditeur'}
              </InputLabel>
              <Select
                value={form.auditeurId}
                label={loadingAuditeurs ? 'Chargement des auditeurs…' : 'Sélectionner un auditeur'}
                onChange={(e) => set('auditeurId', e.target.value)}
                disabled={loadingAuditeurs || auditeurs.length === 0}
                renderValue={(selected) => {
                  const a = auditeurs.find((u) => u.id === selected);
                  if (!a) return '';
                  return (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: 11, bgcolor: 'success.main' }}>
                        {a.firstName?.[0]}{a.lastName?.[0]}
                      </Avatar>
                      <Typography variant="body2">
                        {a.firstName} {a.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        — {a.department}
                      </Typography>
                    </Box>
                  );
                }}
              >
                {loadingAuditeurs ? (
                  <MenuItem disabled>
                    <CircularProgress size={16} sx={{ mr: 1 }} /> Chargement…
                  </MenuItem>
                ) : auditeurs.length === 0 ? (
                  <MenuItem disabled>Aucun auditeur actif disponible</MenuItem>
                ) : (
                  auditeurs.map((a) => (
                    <MenuItem key={a.id} value={a.id}>
                      <Box display="flex" alignItems="center" gap={1.5} width="100%">
                        <Avatar sx={{ width: 32, height: 32, fontSize: 12, bgcolor: 'success.main' }}>
                          {a.firstName?.[0]}{a.lastName?.[0]}
                        </Avatar>
                        <Box flex={1}>
                          <Typography variant="body2" fontWeight={500}>
                            {a.firstName} {a.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {a.email} · {a.department}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))
                )}
              </Select>
              {errors.auditeurId && <FormHelperText>{errors.auditeurId}</FormHelperText>}
              {!loadingAuditeurs && auditeurs.length === 0 && !auditeurError && (
                <FormHelperText>
                  Aucun auditeur actif trouvé. Créez d'abord un compte auditeur.
                </FormHelperText>
              )}
            </FormControl>

            {/* Aperçu auditeur sélectionné */}
            {selectedAuditeur && (
              <Box sx={{
                display: 'flex', alignItems: 'center', gap: 1.5,
                p: 1.5, mt: 1, mb: 1,
                border: '1px solid', borderColor: 'success.light',
                borderRadius: 2, bgcolor: 'rgba(29,158,117,0.05)',
              }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: 'success.main', fontSize: 13 }}>
                  {selectedAuditeur.firstName?.[0]}{selectedAuditeur.lastName?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {selectedAuditeur.firstName} {selectedAuditeur.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedAuditeur.email} · {selectedAuditeur.department}
                  </Typography>
                </Box>
                <Chip label="Auditeur" size="small" color="success" sx={{ ml: 'auto' }} />
              </Box>
            )}

            <Divider sx={{ my: 2.5 }} />

            {/* ── Géolocalisation ── */}
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={0.5}>
              GÉOLOCALISATION
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
              Optionnelle — recommandée pour les inspections terrain sur mobile.
            </Typography>
            <GeoLocationCapture onCapture={handleGeo} />

            {form.latitude && (
              <Box display="flex" gap={1} mt={1.5}>
                <Chip label={`Lat : ${(form.latitude as number).toFixed(5)}`} size="small" variant="outlined" />
                <Chip label={`Lng : ${(form.longitude as number).toFixed(5)}`} size="small" variant="outlined" />
              </Box>
            )}

            <Divider sx={{ my: 2.5 }} />

            {/* ── Info horodatage ── */}
            <Alert severity="info" sx={{ mb: 3 }}>
              L'horodatage sera capturé automatiquement côté serveur à la création (non falsifiable).
            </Alert>

            {/* ── Actions ── */}
            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button variant="outlined" color="inherit" onClick={() => navigate('/inspections')} disabled={saving}>
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={saving ? undefined : <AssignmentIcon />}
                disabled={saving || loadingAuditeurs}
                sx={{ minWidth: 200 }}
              >
                {saving
                  ? <CircularProgress size={20} color="inherit" />
                  : "Créer l'inspection"}
              </Button>
            </Box>

          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}