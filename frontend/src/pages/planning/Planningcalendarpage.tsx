import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import EditIcon from '@mui/icons-material/Edit';
import { planningService } from '../../services/Planningservice';

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

const STATUS_CONFIG = {
  PLANIFIE:  { label: 'P',  fullLabel: 'Planifié',   bg: '#1565C0', color: '#fff', chip: 'primary'  as const },
  REALISE:   { label: 'R',  fullLabel: 'Réalisé',    bg: '#2E7D32', color: '#fff', chip: 'success'  as const },
  EN_RETARD: { label: '!',  fullLabel: 'En retard',  bg: '#C62828', color: '#fff', chip: 'error'    as const },
  ANNULE:    { label: 'A',  fullLabel: 'Annulé',     bg: '#757575', color: '#fff', chip: 'default'  as const },
};

const STATUTS_UPDATE = ['PLANIFIE', 'REALISE', 'ANNULE'];

const currentYear = new Date().getFullYear();
const ANNEES = [currentYear - 1, currentYear, currentYear + 1];

// Groupes de domaines pour affichage par ligne
const DOMAINE_GROUPS = [
  ['Plant', 'Magasin', 'Sanitaires', 'Cantine'],
  ['Chimique', 'Locaux_techniques', 'Déchets'],
  ['Transport', 'Infirmerie', 'Recycleurs', 'Incendie'],
];

export default function PlanningCalendarPage() {
  const navigate = useNavigate();
  const [annee, setAnnee]           = useState(currentYear);
  const [plans, setPlans]           = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [exportLoading, setExportLoading] = useState(false);

  // Dialog mise à jour statut
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [newStatut, setNewStatut]   = useState('');
  const [updating, setUpdating]     = useState(false);

  // Import CSV
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importFile, setImportFile]             = useState<File | null>(null);
  const [importing, setImporting]               = useState(false);
  const [importResult, setImportResult]         = useState<any | null>(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await planningService.getAll({ annee });
      setPlans(data);
    } catch {
      setError('Impossible de charger le plan annuel.');
    } finally {
      setLoading(false);
    }
  }, [annee]);

  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  // Construire matrice [domaine][semaine] → plan
  const planMatrix: Record<string, Record<number, any>> = {};
  DOMAINES.forEach((d) => { planMatrix[d] = {}; });
  plans.forEach((p) => {
    if (planMatrix[p.domaine]) planMatrix[p.domaine][p.semaine] = p;
  });

  // Statistiques
  const stats = {
    total:     plans.length,
    planifie:  plans.filter((p) => p.statut === 'PLANIFIE').length,
    realise:   plans.filter((p) => p.statut === 'REALISE').length,
    enRetard:  plans.filter((p) => p.statut === 'EN_RETARD').length,
    annule:    plans.filter((p) => p.statut === 'ANNULE').length,
  };

  // Mise à jour statut
  const handleUpdateStatus = async () => {
    if (!editTarget || !newStatut) return;
    setUpdating(true);
    try {
      const updated = await planningService.update(editTarget.id, { statut: newStatut });
      setPlans((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setEditTarget(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Erreur lors de la mise à jour.');
    } finally {
      setUpdating(false);
    }
  };

  // Export CSV
  const handleExport = async () => {
    setExportLoading(true);
    try {
      const blob = await planningService.exportCsv(annee);
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `plan-surveillance-${annee}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Erreur lors de l'export CSV.");
    } finally {
      setExportLoading(false);
    }
  };

  // Import CSV
  const handleImport = async () => {
    if (!importFile) return;
    setImporting(true);
    setImportResult(null);
    try {
      const result = await planningService.importCsv(importFile, annee);
      setImportResult(result);
      fetchPlans();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Erreur lors de l'import.");
    } finally {
      setImporting(false);
    }
  };

  const semaines = Array.from({ length: 52 }, (_, i) => i + 1);
  const currentWeek = (() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    return Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
  })();

  return (
    <Box>
      {/* ── Header ── */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Plan de surveillance annuel</Typography>
          <Typography variant="body2" color="text.secondary">
            Vue 52 semaines · Année {annee}
          </Typography>
        </Box>
        <Box display="flex" gap={1} flexWrap="wrap">
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={() => setImportDialogOpen(true)}
          >
            Import CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={exportLoading ? <CircularProgress size={16} /> : <DownloadIcon />}
            onClick={handleExport}
            disabled={exportLoading || plans.length === 0}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/planning/new')}
          >
            Nouveau plan
          </Button>
        </Box>
      </Box>

      {/* ── Filtres ── */}
      <Box display="flex" gap={2} mb={2} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Année</InputLabel>
          <Select value={annee} label="Année" onChange={(e) => setAnnee(Number(e.target.value))}>
            {ANNEES.map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
          </Select>
        </FormControl>

        {/* Légende */}
        <Box display="flex" gap={1} ml="auto">
          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
            <Chip
              key={k}
              label={`${v.label} = ${v.fullLabel}`}
              size="small"
              sx={{ bgcolor: v.bg, color: v.color, fontWeight: 600 }}
            />
          ))}
        </Box>
      </Box>

      {/* ── KPI bar ── */}
      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={2} mb={3}>
        {[
          { label: 'Planifiés',  val: stats.planifie,  bg: '#E3F2FD', color: '#1565C0' },
          { label: 'Réalisés',   val: stats.realise,   bg: '#E8F5E9', color: '#2E7D32' },
          { label: 'En retard',  val: stats.enRetard,  bg: '#FFEBEE', color: '#C62828' },
          { label: 'Annulés',    val: stats.annule,    bg: '#F5F5F5', color: '#757575' },
        ].map((s) => (
          <Paper key={s.label} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', p: 2, textAlign: 'center', borderRadius: 2, bgcolor: s.bg }}>
            <Typography variant="h4" fontWeight={700} sx={{ color: s.color }}>{s.val}</Typography>
            <Typography variant="caption" color="text.secondary">{s.label}</Typography>
          </Paper>
        ))}
      </Box>

      {error  && <Alert severity="error"   sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>
      ) : (
        // ── Calendrier 52 semaines ──
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', overflow: 'auto', borderRadius: 2 }}>

          {/* En-tête semaines */}
          <Box
            display="grid"
            gridTemplateColumns={`140px repeat(52, 28px)`}
            sx={{ borderBottom: '2px solid', borderColor: 'divider', position: 'sticky', top: 0, bgcolor: 'grey.50', zIndex: 1 }}
          >
            <Box sx={{ p: 1, borderRight: '1px solid', borderColor: 'divider' }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary">DOMAINE</Typography>
            </Box>
            {semaines.map((s) => (
              <Box
                key={s}
                sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  py: 0.5,
                  borderRight: '0.5px solid', borderColor: 'divider',
                  bgcolor: s === currentWeek ? 'primary.light' : 'transparent',
                  minWidth: 28,
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight={s === currentWeek ? 700 : 400}
                  color={s === currentWeek ? 'primary.dark' : 'text.secondary'}
                  sx={{ fontSize: 9, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  S{s}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Lignes par domaine */}
          {DOMAINES.map((domaine, idx) => (
            <Box
              key={domaine}
              display="grid"
              gridTemplateColumns={`140px repeat(52, 28px)`}
              sx={{
                borderBottom: '0.5px solid',
                borderColor: 'divider',
                '&:last-child': { borderBottom: 'none' },
                bgcolor: idx % 2 === 0 ? 'transparent' : 'grey.50',
              }}
            >
              {/* Nom du domaine */}
              <Box sx={{
                p: 1, borderRight: '1px solid', borderColor: 'divider',
                display: 'flex', alignItems: 'center',
              }}>
                <Typography variant="caption" fontWeight={500} noWrap>
                  {domaine.replace(/_/g, ' ')}
                </Typography>
              </Box>

              {/* Cellules semaines */}
              {semaines.map((s) => {
                const plan = planMatrix[domaine]?.[s];
                const cfg  = plan ? STATUS_CONFIG[plan.statut] : null;
                const isCurrent = s === currentWeek;

                return (
                  <Tooltip
                    key={s}
                    title={plan
                      ? `S${s} · ${cfg?.fullLabel} · ${plan.site}${plan.responsable ? ` · ${plan.responsable.firstName} ${plan.responsable.lastName}` : ''}`
                      : `S${s} · Non planifié`
                    }
                    arrow
                  >
                    <Box
                      sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        minWidth: 28, height: 32,
                        borderRight: '0.5px solid', borderColor: 'divider',
                        bgcolor: isCurrent ? 'rgba(21,101,192,0.08)' : 'transparent',
                        cursor: plan ? 'pointer' : 'default',
                        '&:hover': plan ? { opacity: 0.8 } : {},
                      }}
                      onClick={() => {
                        if (plan) { setEditTarget(plan); setNewStatut(plan.statut); }
                      }}
                    >
                      {plan && cfg && (
                        <Box sx={{
                          width: 22, height: 22, borderRadius: '4px',
                          bgcolor: cfg.bg, color: cfg.color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 10, fontWeight: 700,
                        }}>
                          {cfg.label}
                        </Box>
                      )}
                    </Box>
                  </Tooltip>
                );
              })}
            </Box>
          ))}
        </Paper>
      )}

      {/* ── Dialog mise à jour statut ── */}
      <Dialog open={!!editTarget} onClose={() => setEditTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Mettre à jour le statut</DialogTitle>
        <DialogContent>
          {editTarget && (
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                <strong>Domaine :</strong> {editTarget.domaine?.replace(/_/g, ' ')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Semaine :</strong> S{editTarget.semaine} · {editTarget.site}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>
                <strong>Statut actuel :</strong>{' '}
                <Chip
                  label={STATUS_CONFIG[editTarget.statut]?.fullLabel}
                  size="small"
                  sx={{
                    bgcolor: STATUS_CONFIG[editTarget.statut]?.bg,
                    color:   STATUS_CONFIG[editTarget.statut]?.color,
                    fontWeight: 600, ml: 0.5,
                  }}
                />
              </Typography>
            </Box>
          )}
          <FormControl fullWidth>
            <InputLabel>Nouveau statut</InputLabel>
            <Select value={newStatut} label="Nouveau statut" onChange={(e) => setNewStatut(e.target.value)}>
              {STATUTS_UPDATE.map((s) => (
                <MenuItem key={s} value={s}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box sx={{
                      width: 16, height: 16, borderRadius: '3px',
                      bgcolor: STATUS_CONFIG[s]?.bg,
                    }} />
                    {STATUS_CONFIG[s]?.fullLabel}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditTarget(null)}>Annuler</Button>
          <Button onClick={handleUpdateStatus} variant="contained" disabled={!newStatut || updating}>
            {updating ? <CircularProgress size={20} color="inherit" /> : 'Mettre à jour'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Dialog Import CSV ── */}
      <Dialog open={importDialogOpen} onClose={() => { setImportDialogOpen(false); setImportResult(null); setImportFile(null); }} maxWidth="sm" fullWidth>
        <DialogTitle>Importer le plan depuis Excel / CSV</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Format CSV attendu (séparateur <strong>;</strong>) :<br />
            <code>domaine;site;semaine;annee;frequence;responsableId</code><br />
            Exemple : <code>PLANT;Sousse;1;2025;HEBDOMADAIRE;</code>
          </Alert>
          {importResult && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Import terminé : <strong>{importResult.imported}</strong> ligne(s) importée(s),{' '}
              <strong>{importResult.skipped}</strong> ignorée(s) (déjà existantes ou invalides).
            </Alert>
          )}
          <Button variant="outlined" component="label" fullWidth>
            {importFile ? importFile.name : 'Sélectionner un fichier CSV'}
            <input
              type="file"
              accept=".csv,.txt"
              hidden
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setImportDialogOpen(false); setImportResult(null); setImportFile(null); }}>
            Fermer
          </Button>
          <Button
            onClick={handleImport}
            variant="contained"
            disabled={!importFile || importing}
          >
            {importing ? <CircularProgress size={20} color="inherit" /> : 'Importer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}