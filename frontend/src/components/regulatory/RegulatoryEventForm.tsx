// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Box from "@mui/material/Box";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import Typography from "@mui/material/Typography";
// import TextField from "@mui/material/TextField";
// import MenuItem from "@mui/material/MenuItem";
// import Button from "@mui/material/Button";
// import FormControl from "@mui/material/FormControl";
// import InputLabel from "@mui/material/InputLabel";
// import Select from "@mui/material/Select";
// import Avatar from "@mui/material/Avatar";
// import Grid from "@mui/material/Grid";
// import Alert from "@mui/material/Alert";
// import SaveIcon from "@mui/icons-material/Save";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import api from "../../api/api";

// const EVENT_TYPES = [
//   "CSST",
//   "Analyses eau",
//   "Audit énergie",
//   "Contrôle technique installations",
//   "Vérification extincteurs",
//   "Gestion des déchets",
//   "Mesures bruit environnemental",
//   "Émissions atmosphériques",
//   "Suivi consommation électricité",
//   "Exercice évacuation",
//   "Registre de sécurité",
// ];

// export default function RegulatoryEventForm() {
//   const navigate = useNavigate();
//   const [error, setError] = useState<string | null>(null);
//   const [submitting, setSubmitting] = useState(false);

//   // ── États pour la sélection du responsable ──
//   const [auditeurs, setAuditeurs] = useState<any[]>([]);
//   const [loadingAuditeurs, setLoadingAuditeurs] = useState(true);

//   // ── État du Formulaire ──
//   const [form, setForm] = useState({
//     libelle: "",
//     type: "",
//     datePrevue: "",
//     responsableId: "",
//     commentaire: "",
//   });

//   const set = (field: string, value: any) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   // ── Chargement des utilisateurs/auditeurs ──
//   useEffect(() => {
//     api.get("/users")
//       .then((res) => {
//         setAuditeurs(res.data);
//         setLoadingAuditeurs(false);
//       })
//       .catch((err) => {
//         console.error("Erreur lors de la récupération des utilisateurs", err);
//         setLoadingAuditeurs(false);
//       });
//   }, []);

//   // ── Soumission du Formulaire ──
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!form.libelle || !form.type || !form.datePrevue) {
//       setError("Veuillez remplir tous les champs obligatoires (*)");
//       return;
//     }

//     try {
//       setError(null);
//       setSubmitting(true);

//       // Préparation du payload envoyé au backend NestJS
//       const payload = {
//         libelle: form.libelle,
//         type: form.type,
//         datePrevue: form.datePrevue, // Transmet le format YYYY-MM-DD
//         commentaire: form.commentaire || undefined,
//         responsableId: form.responsableId || undefined, // Envoie null/undefined si aucun sélectionné
//       };

//       await api.post("/regulatory-events", payload);
//       navigate("/planning/unified");
//     } catch (err: any) {
//       console.error(err);
//       setError(
//         err.response?.data?.message || "Erreur lors de la création de l'événement réglementaire."
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <Box sx={{ maxWidth: 800, mx: "auto", mt: 2 }}>
//       {/* En-tête */}
//       <Box display="flex" alignItems="center" gap={1} mb={3}>
//         <Button
//           startIcon={<ArrowBackIcon />}
//           onClick={() => navigate("/planning/unified")}
//           size="small"
//         >
//           Retour au calendrier
//         </Button>
//       </Box>

//       <Typography variant="h5" fontWeight={700} gutterBottom mb={3}>
//         Créer une nouvelle obligation réglementaire
//       </Typography>

//       {error && (
//         <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
//           {error}
//         </Alert>
//       )}

//       <form onSubmit={handleSubmit}>
//         <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
//           <CardContent sx={{ p: 4 }}>
//             <Grid container spacing={3}>
//               {/* Libellé */}
//               <Grid xs={12}>
//                 <TextField
//                   label="Libellé de l'obligation *"
//                   fullWidth
//                   value={form.libelle}
//                   onChange={(e) => set("libelle", e.target.value)}
//                   placeholder="Ex: Analyse de la potabilité de l'eau - Trimestrielle"
//                 />
//               </Grid>

//               {/* Type d'événement */}
//               <Grid xs={12} sm={6}>
//                 <TextField
//                   select
//                   label="Type réglementaire *"
//                   fullWidth
//                   value={form.type}
//                   onChange={(e) => set("type", e.target.value)}
//                 >
//                   {EVENT_TYPES.map((type) => (
//                     <MenuItem key={type} value={type}>
//                       {type}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>

//               {/* Date prévue */}
//               <Grid xs={12} sm={6}>
//                 <TextField
//                   label="Date d'échéance prévue *"
//                   type="date"
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                   value={form.datePrevue}
//                   onChange={(e) => set("datePrevue", e.target.value)}
//                 />
//               </Grid>

//               {/* ── Responsable sélectionné (Adaptation exacte) ── */}
//               <Grid xs={12}>
//                 <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={1.5}>
//                   RESPONSABLE (optionnel)
//                 </Typography>
//                 <FormControl fullWidth>
//                   <InputLabel id="responsable-select-label">
//                     {loadingAuditeurs ? "Chargement…" : "Assigner un auditeur responsable"}
//                   </InputLabel>
//                   <Select
//                     labelId="responsable-select-label"
//                     value={form.responsableId}
//                     label={loadingAuditeurs ? "Chargement…" : "Assigner un auditeur responsable"}
//                     onChange={(e) => set("responsableId", e.target.value)}
//                     disabled={loadingAuditeurs}
//                     renderValue={(selected) => {
//                       if (!selected) return "";
//                       const a = auditeurs.find((u) => u.id === selected);
//                       if (!a) return selected;
//                       return (
//                         <Box display="flex" alignItems="center" gap={1}>
//                           <Avatar sx={{ width: 22, height: 22, fontSize: 10, bgcolor: "success.main" }}>
//                             {`${a.firstName?.[0] ?? ""}${a.lastName?.[0] ?? ""}`.toUpperCase()}
//                           </Avatar>
//                           <Typography variant="body2">
//                             {a.firstName} {a.lastName}
//                           </Typography>
//                         </Box>
//                       );
//                     }}
//                   >
//                     <MenuItem value="">
//                       <em>Aucun responsable (Non assigné)</em>
//                     </MenuItem>
//                     {auditeurs.map((a) => (
//                       <MenuItem key={a.id} value={a.id}>
//                         <Box display="flex" alignItems="center" gap={1.5}>
//                           <Avatar sx={{ width: 24, height: 24, fontSize: 11, bgcolor: "action.selected", color: "text.primary" }}>
//                             {`${a.firstName?.[0] ?? ""}${a.lastName?.[0] ?? ""}`.toUpperCase()}
//                           </Avatar>
//                           <Typography variant="body2">
//                             {a.firstName} {a.lastName}
//                           </Typography>
//                         </Box>
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>

//               {/* Commentaire / Description */}
//               <Grid xs={12}>
//                 <TextField
//                   label="Commentaire ou détails additionnels"
//                   fullWidth
//                   multiline
//                   rows={3}
//                   value={form.commentaire}
//                   onChange={(e) => set("commentaire", e.target.value)}
//                   placeholder="Ajoutez des précisions sur l'arrêté réglementaire, les prestataires externes..."
//                 />
//               </Grid>
//             </Grid>

//             {/* Actions de validation */}
//             <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
//               <Button
//                 variant="outlined"
//                 color="inherit"
//                 onClick={() => navigate("/planning/unified")}
//                 disabled={submitting}
//               >
//                 Annuler
//               </Button>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 color="primary"
//                 startIcon={<SaveIcon />}
//                 disabled={submitting}
//               >
//                 {submitting ? "Création..." : "Enregistrer l'obligation"}
//               </Button>
//             </Box>
//           </CardContent>
//         </Card>
//       </form>
//     </Box>
//   );
// }


// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Box from "@mui/material/Box";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import Typography from "@mui/material/Typography";
// import TextField from "@mui/material/TextField";
// import MenuItem from "@mui/material/MenuItem";
// import Button from "@mui/material/Button";
// import FormControl from "@mui/material/FormControl";
// import InputLabel from "@mui/material/InputLabel";
// import Select from "@mui/material/Select";
// import Avatar from "@mui/material/Avatar";
// import Grid from "@mui/material/Grid";
// import Alert from "@mui/material/Alert";
// import SaveIcon from "@mui/icons-material/Save";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import api from "../../api/api";

// const EVENT_TYPES = [
//   "CSST",
//   "Analyses eau",
//   "Audit énergie",
//   "Contrôle technique installations",
//   "Vérification extincteurs",
//   "Gestion des déchets",
//   "Mesures bruit environnemental",
//   "Émissions atmosphériques",
//   "Suivi consommation électricité",
//   "Exercice évacuation",
//   "Registre de sécurité",
// ];

// interface RegulatoryEventFormProps {
//   open?: boolean;
//   onClose?: () => void;
//   onSuccess?: () => void;
//   selectedDate?: string;
// }

// export default function RegulatoryEventForm({ open, onClose, onSuccess, selectedDate }: RegulatoryEventFormProps) {
//   const navigate = useNavigate();
//   const [error, setError] = useState<string | null>(null);
//   const [submitting, setSubmitting] = useState(false);

//   const [auditeurs, setAuditeurs] = useState<any[]>([]);
//   const [loadingAuditeurs, setLoadingAuditeurs] = useState(true);

//   const [form, setForm] = useState({
//     libelle: "",
//     type: "",
//     datePrevue: "",
//     responsableId: "",
//     commentaire: "",
//   });

//   // Met à jour la date si elle est passée depuis le calendrier
//   useEffect(() => {
//     if (selectedDate) {
//       setForm((prev) => ({ ...prev, datePrevue: selectedDate }));
//     }
//   }, [selectedDate]);

//   const set = (field: string, value: any) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   useEffect(() => {
//     api.get("/users")
//       .then((res) => {
//         setAuditeurs(res.data);
//         setLoadingAuditeurs(false);
//       })
//       .catch((err) => {
//         console.error("Erreur lors de la récupération des utilisateurs", err);
//         setLoadingAuditeurs(false);
//       });
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!form.libelle || !form.type || !form.datePrevue) {
//       setError("Veuillez remplir tous les champs obligatoires (*)");
//       return;
//     }

//     try {
//       setError(null);
//       setSubmitting(true);

//       const payload = {
//         libelle: form.libelle,
//         type: form.type,
//         datePrevue: form.datePrevue,
//         commentaire: form.commentaire || undefined,
//         responsableId: form.responsableId || undefined,
//       };

//       await api.post("/regulatory-events", payload);
      
//       if (onSuccess) onSuccess();
//       if (onClose) onClose();
      
//       navigate("/planning/unified");
//     } catch (err: any) {
//       console.error(err);
//       setError(
//         err.response?.data?.message || "Erreur lors de la création de l'événement réglementaire."
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleCancel = () => {
//     if (onClose) {
//       onClose();
//     } else {
//       navigate("/planning/unified");
//     }
//   };

//   return (
//     <Box sx={{ maxWidth: 1100, mx: "auto", mt: 2, width: "100%" }}>
//       <Box display="flex" alignItems="center" gap={1} mb={3}>
//         <Button
//           startIcon={<ArrowBackIcon />}
//           onClick={handleCancel}
//           size="small"
//         >
//           Retour au calendrier
//         </Button>
//       </Box>

//       <Typography variant="h5" fontWeight={700} gutterBottom mb={3}>
//         Créer une nouvelle obligation réglementaire
//       </Typography>

//       {error && (
//         <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
//           {error}
//         </Alert>
//       )}

//       <form onSubmit={handleSubmit}>
//         <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", width: "100%" }}>
//           <CardContent sx={{ p: 4 }}>
//             <Grid container spacing={3}>
              
//               {/* Libellé */}
//               <Grid item xs={12}>
//                 <TextField
//                   label="Libellé de l'obligation *"
//                   fullWidth
//                   value={form.libelle}
//                   onChange={(e) => set("libelle", e.target.value)}
//                   placeholder="Ex: Analyse de la potabilité de l'eau - Trimestrielle"
//                 />
//               </Grid>

//               {/* Type d'événement */}
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   select
//                   label="Type réglementaire *"
//                   fullWidth
//                   value={form.type}
//                   onChange={(e) => set("type", e.target.value)}
//                 >
//                   {EVENT_TYPES.map((type) => (
//                     <MenuItem key={type} value={type}>
//                       {type}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>

//               {/* Date prévue */}
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Date d'échéance prévue *"
//                   type="date"
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                   value={form.datePrevue}
//                   onChange={(e) => set("datePrevue", e.target.value)}
//                 />
//               </Grid>

//               {/* Responsable sélectionné */}
//               <Grid item xs={12}>
//                 <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={1.5}>
//                   RESPONSABLE (optionnel)
//                 </Typography>
//                 <FormControl fullWidth>
//                   <InputLabel id="responsable-select-label">
//                     {loadingAuditeurs ? "Chargement…" : "Assigner un auditeur responsable"}
//                   </InputLabel>
//                   <Select
//                     labelId="responsable-select-label"
//                     value={form.responsableId}
//                     label={loadingAuditeurs ? "Chargement…" : "Assigner un auditeur responsable"}
//                     onChange={(e) => set("responsableId", e.target.value)}
//                     disabled={loadingAuditeurs}
//                     renderValue={(selected) => {
//                       if (!selected) return "";
//                       const a = auditeurs.find((u) => u.id === selected);
//                       if (!a) return selected;
//                       return (
//                         <Box display="flex" alignItems="center" gap={1}>
//                           <Avatar sx={{ width: 22, height: 22, fontSize: 10, bgcolor: "success.main" }}>
//                             {`${a.firstName?.[0] ?? ""}${a.lastName?.[0] ?? ""}`.toUpperCase()}
//                           </Avatar>
//                           <Typography variant="body2">
//                             {a.firstName} {a.lastName}
//                           </Typography>
//                         </Box>
//                       );
//                     }}
//                   >
//                     <MenuItem value="">
//                       <em>Aucun responsable (Non assigné)</em>
//                     </MenuItem>
//                     {auditeurs.map((a) => (
//                       <MenuItem key={a.id} value={a.id}>
//                         <Box display="flex" alignItems="center" gap={1.5}>
//                           <Avatar sx={{ width: 24, height: 24, fontSize: 11, bgcolor: "action.selected", color: "text.primary" }}>
//                             {`${a.firstName?.[0] ?? ""}${a.lastName?.[0] ?? ""}`.toUpperCase()}
//                           </Avatar>
//                           <Typography variant="body2">
//                             {a.firstName} {a.lastName}
//                           </Typography>
//                         </Box>
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>

//               {/* Commentaire / Description */}
//               <Grid item xs={12}>
//                 <TextField
//                   label="Commentaire ou détails additionnels"
//                   fullWidth
//                   multiline
//                   rows={3}
//                   value={form.commentaire}
//                   onChange={(e) => set("commentaire", e.target.value)}
//                   placeholder="Ajoutez des précisions sur l'arrêté réglementaire, les prestataires externes..."
//                 />
//               </Grid>
//             </Grid>

//             {/* Actions de validation */}
//             <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
//               <Button
//                 variant="outlined"
//                 color="inherit"
//                 onClick={handleCancel}
//                 disabled={submitting}
//               >
//                 Annuler
//               </Button>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 color="primary"
//                 startIcon={<SaveIcon />}
//                 disabled={submitting}
//               >
//                 {submitting ? "Création..." : "Enregistrer l'obligation"}
//               </Button>
//             </Box>
//           </CardContent>
//         </Card>
//       </form>
//     </Box>
//   );
// }

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import api from "../../api/api";

const EVENT_TYPES = [
  { value: "CONTROLE_REGLEMENTAIRE", label: "Contrôle réglementaire" },
  { value: "AUDIT_CERTIFICATION", label: "Audit & Certification" },
  { value: "FORMATION", label: "Formation" },
  { value: "CSST", label: "CSST" },
  { value: "ANALYSES_EAU", label: "Analyses d'eau" },
  { value: "AUDIT_ENERGIE", label: "Audit énergie" },
  { value: "MEDECINE_TRAVAIL", label: "Médecine du travail" },
  { value: "REVUE_DIRECTION", label: "Revue de direction" },
  { value: "CONTROLE_INCENDIE", label: "Contrôle incendie" },
  { value: "EXERCICE_EVACUATION", label: "Exercice d'évacuation" },
  { value: "MESURES_EMISSIONS", label: "Mesures d'émissions atmosphériques" },
];

// 🎯 Définition stricte des propriétés acceptées par le formulaire
interface RegulatoryEventFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedDate: string;
}

export default function RegulatoryEventForm({ open, onClose, onSuccess, selectedDate }: RegulatoryEventFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [auditeurs, setAuditeurs] = useState<any[]>([]);
  const [loadingAuditeurs, setLoadingAuditeurs] = useState(true);

 const [form, setForm] = useState({
    titre: "",
    type: "",
    datePrevue: "",
    responsableId: "",
    commentaire: "",
  });
  // Injecte la date cliquée sur le calendrier dans le formulaire
  useEffect(() => {
    if (selectedDate) {
      setForm((prev) => ({ ...prev, datePrevue: selectedDate }));
    } else {
      setForm((prev) => ({ ...prev, datePrevue: "" }));
    }
  }, [selectedDate, open]);

  const set = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Chargement des utilisateurs
  useEffect(() => {
    if (open) {
      setLoadingAuditeurs(true);
      api.get("/users")
        .then((res) => {
          setAuditeurs(res.data);
          setLoadingAuditeurs(false);
        })
        .catch((err) => {
          console.error("Erreur lors de la récupération des utilisateurs", err);
          setLoadingAuditeurs(false);
        });
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titre || !form.type || !form.datePrevue) {
      setError("Veuillez remplir tous les champs obligatoires (*)");
      return;
    }

    try {
      setError(null);
      setSubmitting(true);

      const payload = {
       titre: form.titre,
        type: form.type,
        datePrevue: form.datePrevue,
        commentaire: form.commentaire || undefined,
        responsableId: form.responsableId || undefined,
      };

      await api.post("/regulatory-events", payload);
      
      // Réinitialiser le formulaire après succès
      setForm({ titre: "", type: "", datePrevue: "", responsableId: "", commentaire: "" });
      
      onSuccess(); // Recharge le calendrier
      onClose();   // Ferme la modal
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur lors de la création de l'événement.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight={700}>
            Nouvelle obligation réglementaire
          </Typography>
          <Button startIcon={<CloseIcon />} onClick={onClose} color="inherit" size="small">
            Fermer
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Card elevation={0}>
            <CardContent sx={{ px: 0, py: 1 }}>
              <Grid container spacing={3}>
                
                {/* Libellé */}
                <Grid item xs={12}>
                  <TextField
                    label="Titre de l'obligation *"
                    fullWidth
                    value={form.titre}
                    onChange={(e) => set("titre", e.target.value)}
                    placeholder="Ex: Analyse de la potabilité de l'eau"
                  />
                </Grid>

                {/* Type réglementaire */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Type réglementaire *"
                    fullWidth
                    value={form.type}
                    onChange={(e) => set("type", e.target.value)}
                  >
                    {EVENT_TYPES.map((t) => (
                      <MenuItem key={t.value} value={t.value}>
                        {t.label} {/* Affiche un texte propre, mais sélectionne la clé technique */}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Date prévue */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Date d'échéance prévue *"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={form.datePrevue}
                    onChange={(e) => set("datePrevue", e.target.value)}
                  />
                </Grid>

                {/* Responsable */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={1.5}>
                    RESPONSABLE (optionnel)
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel id="modal-responsable-label">
                      {loadingAuditeurs ? "Chargement…" : "Assigner un responsable"}
                    </InputLabel>
                    <Select
                      labelId="modal-responsable-label"
                      value={form.responsableId}
                      label={loadingAuditeurs ? "Chargement…" : "Assigner un responsable"}
                      onChange={(e) => set("responsableId", e.target.value)}
                      disabled={loadingAuditeurs}
                      renderValue={(selected) => {
                        if (!selected) return "";
                        const a = auditeurs.find((u) => u.id === selected);
                        if (!a) return selected;
                        return (
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar sx={{ width: 22, height: 22, fontSize: 10, bgcolor: "success.main" }}>
                              {`${a.firstName?.[0] ?? ""}${a.lastName?.[0] ?? ""}`.toUpperCase()}
                            </Avatar>
                            <Typography variant="body2">{a.firstName} {a.lastName}</Typography>
                          </Box>
                        );
                      }}
                    >
                      <MenuItem value=""><em>Aucun (Non assigné)</em></MenuItem>
                      {auditeurs.map((a) => (
                        <MenuItem key={a.id} value={a.id}>
                          <Box display="flex" alignItems="center" gap={1.5}>
                            <Avatar sx={{ width: 24, height: 24, fontSize: 11, bgcolor: "action.selected" }}>
                              {`${a.firstName?.[0] ?? ""}${a.lastName?.[0] ?? ""}`.toUpperCase()}
                            </Avatar>
                            <Typography variant="body2">{a.firstName} {a.lastName}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Commentaire */}
                <Grid item xs={12}>
                  <TextField
                    label="Commentaire ou détails additionnels"
                    fullWidth
                    multiline
                    rows={3}
                    value={form.commentaire}
                    onChange={(e) => set("commentaire", e.target.value)}
                  />
                </Grid>
              </Grid>

              <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
                <Button variant="outlined" color="inherit" onClick={onClose} disabled={submitting}>
                  Annuler
                </Button>
                <Button type="submit" variant="contained" color="primary" startIcon={<SaveIcon />} disabled={submitting}>
                  {submitting ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </form>
      </DialogContent>
    </Dialog>
  );
}