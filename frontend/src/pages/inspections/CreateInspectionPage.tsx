// import { useState, useEffect } from 'react';
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
// import Avatar from '@mui/material/Avatar';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import AssignmentIcon from '@mui/icons-material/Assignment';
// import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// import GeoLocationCapture from '../../components/inspections/GeoLocationCapture';
// import { inspectionService } from '../../services/inspectionService';
// import { userService } from '../../services/userService';


// const DOMAINES = [
//   'Plant', 
//   'Magasin', 
//   'Sanitaires', 
//   'Cantine', 
//   'Chimique',
//   'Locaux_techniques', 
//   'Déchets', 
//   'Transport', 
//   'Infirmerie',
//   'Recycleurs', 
//   'Incendie',
// ];
// const SITES = ['Sousse', 'Manzel hayett', 'Mateur'];

// const DOMAINE_CHECKLIST: Record<string, string> = {
//   Plant:             'Checklist Plant & Production',
//   Magasin:           'Checklist Stockage & Magasin',
//   Sanitaires:        'Checklist Sanitaires & Hygiène',
//   Cantine:           'Checklist Restauration',
//   Chimique:          'Checklist Produits Chimiques',
//   Locaux_techniques: 'Checklist Locaux Techniques',
//   Déchets:           'Checklist Gestion des Déchets',
//   Transport:         'Checklist Transport & Logistique',
//   Infirmerie:        'Checklist Infirmerie & Secours',
//   Recycleurs:        'Checklist Recycleurs & Tri',
//   INCENDIE:          'Checklist Sécurité Incendie',
// };

// const defaultForm = {
//   domaine:    '',
//   site:       '',
//   datePrevue: '',
//   auditeurId: '',
//   latitude:   undefined,
//   longitude:  undefined,
// };

// const defaultErrors = { domaine: '', site: '', datePrevue: '', auditeurId: '' };

// const todayStr = new Date().toISOString().split('T')[0];

// export default function CreateInspectionPage() {
//   const navigate = useNavigate();

//   const [form, setForm]         = useState(defaultForm);
//   const [errors, setErrors]     = useState(defaultErrors);
//   const [saving, setSaving]     = useState(false);
//   const [apiError, setApiError] = useState('');
//   const [created, setCreated]   = useState(null);

//   // ── Liste des auditeurs chargée depuis le backend ─────────────────────────
//   const [auditeurs, setAuditeurs]         = useState<any[]>([]);
//   const [loadingAuditeurs, setLoadingAuditeurs] = useState(true);
//   const [auditeurError, setAuditeurError] = useState('');

//   useEffect(() => {
//     const fetchAuditeurs = async () => {
//       setLoadingAuditeurs(true);
//       setAuditeurError('');
//       try {
//         // GET /users?role=AUDITEUR — filtre côté backend
//         const data = await userService.getAll({ role: 'AUDITEUR' });
//         // Garde seulement les comptes ACTIVE
//         setAuditeurs(data.filter((u: any) => u.status === 'ACTIVE'));
//       } catch {
//         setAuditeurError('Impossible de charger la liste des auditeurs.');
//       } finally {
//         setLoadingAuditeurs(false);
//       }
//     };
//     fetchAuditeurs();
//   }, []);

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
//     if (!form.domaine)     { e.domaine     = 'Le domaine est requis.';      ok = false; }
//     if (!form.site)        { e.site        = 'Le site est requis.';         ok = false; }
//     if (!form.datePrevue)  { e.datePrevue  = 'La date prévue est requise.'; ok = false; }
//     if (!form.auditeurId)  { e.auditeurId  = "L'auditeur est requis.";      ok = false; }
//     setErrors(e);
//     return ok;
//   };

// //   const handleSubmit = async (e) => {
// //   e.preventDefault();
// //   setApiError('');
// //   if (!validate()) return;
// //   setSaving(true);
// //   try {
// //     const payload = {
// //       domaine:    form.domaine, // 👈 On envoie directement la valeur (ex: 'Déchets' ou 'Locaux techniques')
// //       site:       form.site.trim(),
// //       datePrevue: new Date(form.datePrevue).toISOString(),
// //       ...(form.latitude  !== undefined && { latitude:  form.latitude }),
// //       ...(form.longitude !== undefined && { longitude: form.longitude }),
// //     };

// //     // Petit log pour t'assurer du format dans la console
// //     console.log("=== INSPECTION PAYLOAD ===", payload);

// //     const result = await inspectionService.create(payload);
// //     setCreated(result);
// //   } catch (err) {
// //     const msg = err?.response?.data?.message;
// //     if (Array.isArray(msg)) {
// //       setApiError(msg.join(' | '));
// //     } else {
// //       setApiError(typeof msg === 'string' ? msg : 'Une erreur est survenue. Veuillez réessayer.');
// //     }
// //   } finally {
// //     setSaving(false);
// //   }
// // };

//   // Remplacer le handleSubmit dans CreateInspectionPage.tsx par ceci :

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setApiError('');
//   if (!validate()) return;
//   setSaving(true);
//   try {
//     const payload: any = {
//       domaine:    form.domaine,          // ✅ déjà "PLANT", "MAGASIN"... — NE PAS transformer
//       site:       form.site.trim(),
//       datePrevue: new Date(form.datePrevue).toISOString(),
//       auditeurId: form.auditeurId,       // ✅ UUID sélectionné depuis la liste
//     };

//     // Ajouter GPS seulement si capturé
//     if (form.latitude  !== undefined) payload.latitude  = form.latitude;
//     if (form.longitude !== undefined) payload.longitude = form.longitude;

//     console.log('Payload envoyé :', payload);
//     const result = await inspectionService.create(payload);
//     setCreated(result);
//   } catch (err: any) {
//     const msg = err?.response?.data?.message;
//     if (Array.isArray(msg)) setApiError(msg.join(' | '));
//     else setApiError(typeof msg === 'string' ? msg : 'Une erreur est survenue.');
//   } finally {
//     setSaving(false);
//   }
// };

//   // ── Auditeur sélectionné (pour affichage) ────────────────────────────────
//   const selectedAuditeur = auditeurs.find((a) => a.id === form.auditeurId);

//   // ── Écran succès ─────────────────────────────────────────────────────────
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
//               <Typography variant="body2">
//                 <strong>Auditeur :</strong>{' '}
//                 {created.auditeur?.firstName} {created.auditeur?.lastName}
//               </Typography>
//               <Typography variant="body2">
//                 <strong>Date prévue :</strong>{' '}
//                 {new Date(created.datePrevue).toLocaleDateString('fr-FR')}
//               </Typography>
//               <Typography variant="body2">
//                 <strong>Horodatage :</strong>{' '}
//                 {new Date(created.timestamp).toLocaleString('fr-FR')}
//               </Typography>
//               {created.latitude && (
//                 <Typography variant="body2">
//                   <strong>GPS :</strong> {created.latitude.toFixed(5)}, {created.longitude.toFixed(5)}
//                 </Typography>
//               )}
//             </Box>
//             <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
//               Checklist associée : <strong>{DOMAINE_CHECKLIST[created.domaine]}</strong>
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

//   // ── Formulaire ────────────────────────────────────────────────────────────
//   return (
//     <Box maxWidth={640} mx="auto">
//       <Box display="flex" alignItems="center" gap={1} mb={3}>
//         <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/inspections')} color="inherit">
//           Retour
//         </Button>
//         <Box>
//           <Typography variant="h5" fontWeight={700}>Nouvelle inspection</Typography>
//           <Typography variant="body2" color="text.secondary">
//             Création avec géolocalisation et horodatage automatiques
//           </Typography>
//         </Box>
//       </Box>

//       <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
//         <CardContent sx={{ p: 4 }}>
//           {apiError && <Alert severity="error" sx={{ mb: 3 }}>{apiError}</Alert>}

//           <Box component="form" onSubmit={handleSubmit} noValidate>

//             {/* ── Domaine ── */}
//             <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={1.5}>
//               DOMAINE DE SURVEILLANCE
//             </Typography>

//             <FormControl fullWidth required error={!!errors.domaine} sx={{ mb: 1 }}>
//               <InputLabel>Domaine</InputLabel>
//               <Select value={form.domaine} label="Domaine" onChange={(e) => set('domaine', e.target.value)}>
//                 {DOMAINES.map((d) => (
//                   <MenuItem key={d} value={d}>{d.replace(/_/g, ' ')}</MenuItem>
//                 ))}
//               </Select>
//               {errors.domaine && <FormHelperText>{errors.domaine}</FormHelperText>}
//             </FormControl>

//             {form.domaine && (
//               <Alert severity="info" icon={<InfoOutlinedIcon fontSize="small" />} sx={{ mb: 2 }}>
//                 Checklist associée : <strong>{DOMAINE_CHECKLIST[form.domaine]}</strong>
//               </Alert>
//             )}

//             <Divider sx={{ my: 2.5 }} />

//             {/* ── Site & Date ── */}
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
//               sx={{ mb: 0 }}
//             />

//             <Divider sx={{ my: 2.5 }} />

//             {/* ── Auditeur ── */}
//             <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={1.5}>
//               AUDITEUR ASSIGNÉ
//             </Typography>

//             {auditeurError && (
//               <Alert severity="error" sx={{ mb: 2 }}>{auditeurError}</Alert>
//             )}

//             <FormControl fullWidth required error={!!errors.auditeurId} sx={{ mb: 1 }}>
//               <InputLabel>
//                 {loadingAuditeurs ? 'Chargement des auditeurs…' : 'Sélectionner un auditeur'}
//               </InputLabel>
//               <Select
//                 value={form.auditeurId}
//                 label={loadingAuditeurs ? 'Chargement des auditeurs…' : 'Sélectionner un auditeur'}
//                 onChange={(e) => set('auditeurId', e.target.value)}
//                 disabled={loadingAuditeurs || auditeurs.length === 0}
//                 renderValue={(selected) => {
//                   const a = auditeurs.find((u) => u.id === selected);
//                   if (!a) return '';
//                   return (
//                     <Box display="flex" alignItems="center" gap={1}>
//                       <Avatar sx={{ width: 24, height: 24, fontSize: 11, bgcolor: 'success.main' }}>
//                         {a.firstName?.[0]}{a.lastName?.[0]}
//                       </Avatar>
//                       <Typography variant="body2">
//                         {a.firstName} {a.lastName}
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         — {a.department}
//                       </Typography>
//                     </Box>
//                   );
//                 }}
//               >
//                 {loadingAuditeurs ? (
//                   <MenuItem disabled>
//                     <CircularProgress size={16} sx={{ mr: 1 }} /> Chargement…
//                   </MenuItem>
//                 ) : auditeurs.length === 0 ? (
//                   <MenuItem disabled>Aucun auditeur actif disponible</MenuItem>
//                 ) : (
//                   auditeurs.map((a) => (
//                     <MenuItem key={a.id} value={a.id}>
//                       <Box display="flex" alignItems="center" gap={1.5} width="100%">
//                         <Avatar sx={{ width: 32, height: 32, fontSize: 12, bgcolor: 'success.main' }}>
//                           {a.firstName?.[0]}{a.lastName?.[0]}
//                         </Avatar>
//                         <Box flex={1}>
//                           <Typography variant="body2" fontWeight={500}>
//                             {a.firstName} {a.lastName}
//                           </Typography>
//                           <Typography variant="caption" color="text.secondary">
//                             {a.email} · {a.department}
//                           </Typography>
//                         </Box>
//                       </Box>
//                     </MenuItem>
//                   ))
//                 )}
//               </Select>
//               {errors.auditeurId && <FormHelperText>{errors.auditeurId}</FormHelperText>}
//               {!loadingAuditeurs && auditeurs.length === 0 && !auditeurError && (
//                 <FormHelperText>
//                   Aucun auditeur actif trouvé. Créez d'abord un compte auditeur.
//                 </FormHelperText>
//               )}
//             </FormControl>

//             {/* Aperçu auditeur sélectionné */}
//             {selectedAuditeur && (
//               <Box sx={{
//                 display: 'flex', alignItems: 'center', gap: 1.5,
//                 p: 1.5, mt: 1, mb: 1,
//                 border: '1px solid', borderColor: 'success.light',
//                 borderRadius: 2, bgcolor: 'rgba(29,158,117,0.05)',
//               }}>
//                 <Avatar sx={{ width: 36, height: 36, bgcolor: 'success.main', fontSize: 13 }}>
//                   {selectedAuditeur.firstName?.[0]}{selectedAuditeur.lastName?.[0]}
//                 </Avatar>
//                 <Box>
//                   <Typography variant="body2" fontWeight={600}>
//                     {selectedAuditeur.firstName} {selectedAuditeur.lastName}
//                   </Typography>
//                   <Typography variant="caption" color="text.secondary">
//                     {selectedAuditeur.email} · {selectedAuditeur.department}
//                   </Typography>
//                 </Box>
//                 <Chip label="Auditeur" size="small" color="success" sx={{ ml: 'auto' }} />
//               </Box>
//             )}

//             <Divider sx={{ my: 2.5 }} />

//             {/* ── Géolocalisation ── */}
//             <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={0.5}>
//               GÉOLOCALISATION
//             </Typography>
//             <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
//               Optionnelle — recommandée pour les inspections terrain sur mobile.
//             </Typography>
//             <GeoLocationCapture onCapture={handleGeo} />

//             {form.latitude && (
//               <Box display="flex" gap={1} mt={1.5}>
//                 <Chip label={`Lat : ${(form.latitude as number).toFixed(5)}`} size="small" variant="outlined" />
//                 <Chip label={`Lng : ${(form.longitude as number).toFixed(5)}`} size="small" variant="outlined" />
//               </Box>
//             )}

//             <Divider sx={{ my: 2.5 }} />

//             {/* ── Info horodatage ── */}
//             <Alert severity="info" sx={{ mb: 3 }}>
//               L'horodatage sera capturé automatiquement côté serveur à la création (non falsifiable).
//             </Alert>

//             {/* ── Actions ── */}
//             <Box display="flex" gap={2} justifyContent="flex-end">
//               <Button variant="outlined" color="inherit" onClick={() => navigate('/inspections')} disabled={saving}>
//                 Annuler
//               </Button>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 startIcon={saving ? undefined : <AssignmentIcon />}
//                 disabled={saving || loadingAuditeurs}
//                 sx={{ minWidth: 200 }}
//               >
//                 {saving
//                   ? <CircularProgress size={20} color="inherit" />
//                   : "Créer l'inspection"}
//               </Button>
//             </Box>

//           </Box>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import LinkIcon from '@mui/icons-material/Link';
import GeoLocationCapture from '../../components/inspections/GeoLocationCapture';
import { inspectionService } from '../../services/inspectionService';

const DOMAINES = [
  'Plant', 'Magasin', 'Sanitaires', 'Cantine', 'Chimique',
  'Locaux_techniques', 'Déchets', 'Transport', 'Infirmerie',
  'Recycleurs', 'Incendie',
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
  Incendie:          'Checklist Sécurité Incendie',
};

const todayStr = new Date().toISOString().split('T')[0];

export default function CreateInspectionPage() {
  const navigate  = useNavigate();
  const location  = useLocation();

  // ── Prefill depuis MesTachesPage via navigate('/inspections/new', { state: { prefill } }) ──
  // Si "Réaliser" → prefill = { domaine, site, planId, semaine, annee }
  // Si "Inspection libre" → prefill = null
  const prefill     = (location.state as any)?.prefill ?? null;
  const planId      = prefill?.planId   ?? null;   // UUID du plan à marquer REALISE
  const isFromPlan  = !!planId;

  const [form, setForm] = useState({
    domaine:    prefill?.domaine ?? '',
    site:       prefill?.site   ?? '',
    datePrevue: '',
  });
  const [errors,   setErrors]   = useState({ domaine: '', site: '', datePrevue: '' });
  const [saving,   setSaving]   = useState(false);
  const [apiError, setApiError] = useState('');
  const [created,  setCreated]  = useState<any>(null);
  const [geo,      setGeo]      = useState<{ latitude?: number; longitude?: number }>({});

  const set = (field: string, value: any) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e = { domaine: '', site: '', datePrevue: '' };
    let ok = true;
    if (!form.domaine)    { e.domaine    = 'Le domaine est requis.';      ok = false; }
    if (!form.site)       { e.site       = 'Le site est requis.';         ok = false; }
    if (!form.datePrevue) { e.datePrevue = 'La date prévue est requise.'; ok = false; }
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
        domaine:    form.domaine,
        site:       form.site.trim(),
        datePrevue: new Date(form.datePrevue).toISOString(),
        // ✅ auditeurId NON envoyé → backend prend req.user.sub depuis le JWT
        // ✅ planId envoyé uniquement si ouvert depuis "Réaliser" (MesTaches)
      };

      if (planId)            payload.planId    = planId;
      if (geo.latitude)      payload.latitude  = geo.latitude;
      if (geo.longitude)     payload.longitude = geo.longitude;

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

  const handleBack = () => navigate(isFromPlan ? '/mes-taches' : '/inspections');

  // ── Écran succès ──────────────────────────────────────────────────────────
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
              Inspection créée avec succès
            </Typography>

            <Box sx={{ textAlign: 'left', bgcolor: 'grey.50', borderRadius: 2, p: 2, mb: 2 }}>
              <Typography variant="body2">
                <strong>Domaine :</strong> {(created.domaine || '').replace(/_/g, ' ')}
              </Typography>
              <Typography variant="body2">
                <strong>Site :</strong> {created.site}
              </Typography>
              <Typography variant="body2">
                <strong>Date prévue :</strong>{' '}
                {new Date(created.datePrevue).toLocaleDateString('fr-FR')}
              </Typography>
              <Typography variant="body2">
                <strong>Horodatage :</strong>{' '}
                {new Date(created.timestamp).toLocaleString('fr-FR')}
              </Typography>
              {created.auditeur && (
                <Typography variant="body2">
                  <strong>Auditeur :</strong>{' '}
                  {created.auditeur.firstName} {created.auditeur.lastName}
                </Typography>
              )}
              {created.latitude && (
                <Typography variant="body2">
                  <strong>GPS :</strong>{' '}
                  {Number(created.latitude).toFixed(5)}, {Number(created.longitude).toFixed(5)}
                </Typography>
              )}
            </Box>

            {isFromPlan && (
              <Alert severity="success" sx={{ mb: 2, textAlign: 'left' }}>
                Le plan S{prefill?.semaine}/{prefill?.annee} a été automatiquement
                marqué comme <strong>Réalisé</strong>.
              </Alert>
            )}

            <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
              Checklist associée :{' '}
              <strong>
                {DOMAINE_CHECKLIST[created.domaine] || created.domaine}
              </strong>
            </Alert>

            <Box display="flex" gap={2} justifyContent="center">
              {isFromPlan ? (
                <Button variant="contained" onClick={() => navigate('/mes-taches')}>
                  Retour à mes tâches
                </Button>
              ) : (
                <>
                  <Button variant="outlined" onClick={() => navigate('/inspections')}>
                    Voir les inspections
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setCreated(null);
                      setForm({ domaine: '', site: '', datePrevue: '' });
                      setGeo({});
                    }}
                  >
                    Nouvelle inspection
                  </Button>
                </>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // ── Formulaire ────────────────────────────────────────────────────────────
  return (
    <Box maxWidth={640} mx="auto">

      {/* Header */}
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} color="inherit">
          {isFromPlan ? 'Mes tâches' : 'Retour'}
        </Button>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {isFromPlan ? "Réaliser l'inspection planifiée" : 'Nouvelle inspection'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isFromPlan
              ? `Plan S${prefill?.semaine}/${prefill?.annee} · ${(prefill?.domaine || '').replace(/_/g, ' ')} · ${prefill?.site}`
              : 'Inspection libre — horodatage et GPS automatiques'}
          </Typography>
        </Box>
      </Box>

      {/* Bandeau plan lié */}
      {isFromPlan && (
        <Alert severity="info" icon={<LinkIcon />} sx={{ mb: 2 }}>
          Cette inspection sera liée au plan{' '}
          <strong>S{prefill?.semaine}/{prefill?.annee}</strong> qui passera à{' '}
          <strong>Réalisé</strong> automatiquement.
        </Alert>
      )}

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
              <Select
                value={form.domaine}
                label="Domaine"
                onChange={(e) => set('domaine', e.target.value)}
                disabled={isFromPlan}  // verrouillé si venu d'un plan
              >
                {DOMAINES.map((d) => (
                  <MenuItem key={d} value={d}>{d.replace(/_/g, ' ')}</MenuItem>
                ))}
              </Select>
              {errors.domaine && <FormHelperText>{errors.domaine}</FormHelperText>}
            </FormControl>

            {form.domaine && (
              <Alert severity="info" icon={<InfoOutlinedIcon fontSize="small" />} sx={{ mb: 2 }}>
                Checklist associée :{' '}
                <strong>{DOMAINE_CHECKLIST[form.domaine] || form.domaine}</strong>
              </Alert>
            )}

            <Divider sx={{ my: 2.5 }} />

            {/* Site & Date */}
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={1.5}>
              LOCALISATION & PLANIFICATION
            </Typography>

            <FormControl fullWidth required error={!!errors.site} sx={{ mb: 2 }}>
              <InputLabel>Site</InputLabel>
              <Select
                value={form.site}
                label="Site"
                onChange={(e) => set('site', e.target.value)}
                disabled={isFromPlan}  // verrouillé si venu d'un plan
              >
                {SITES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
              {errors.site && <FormHelperText>{errors.site}</FormHelperText>}
            </FormControl>

            <TextField
              label={isFromPlan ? 'Date de réalisation' : 'Date prévue'}
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

            {/* Géolocalisation */}
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={0.5}>
              GÉOLOCALISATION
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
              Optionnelle — recommandée pour les inspections terrain sur mobile.
            </Typography>
            <GeoLocationCapture onCapture={({ latitude, longitude }) => setGeo({ latitude, longitude })} />

            {geo.latitude && (
              <Box display="flex" gap={1} mt={1.5}>
                <Chip label={`Lat : ${Number(geo.latitude).toFixed(5)}`} size="small" variant="outlined" />
                <Chip label={`Lng : ${Number(geo.longitude).toFixed(5)}`} size="small" variant="outlined" />
              </Box>
            )}

            <Divider sx={{ my: 2.5 }} />

            <Alert severity="info" sx={{ mb: 3 }}>
              L'horodatage sera capturé automatiquement côté serveur (non falsifiable).
            </Alert>

            {/* Actions */}
            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button variant="outlined" color="inherit" onClick={handleBack} disabled={saving}>
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={saving ? undefined : <AssignmentIcon />}
                disabled={saving}
                sx={{ minWidth: 200 }}
              >
                {saving
                  ? <CircularProgress size={20} color="inherit" />
                  : isFromPlan ? "Valider l'inspection" : "Créer l'inspection"}
              </Button>
            </Box>

          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}


