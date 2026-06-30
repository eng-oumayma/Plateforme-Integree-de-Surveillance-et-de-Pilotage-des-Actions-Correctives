
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  InputAdornment,
  Paper,
  Tooltip,
} from '@mui/material';

// Icônes unifiées
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocationOffIcon from '@mui/icons-material/LocationOff';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';

// Composants et Services
import CloseInspectionModal from '../../components/inspections/CloseInspectionModal';
import { inspectionService } from '../../services/inspectionService';
import { checklistService } from '../../services/checklistService';
import { useAuth } from '../../contexts/AuthContext';


// Configuration des Domaines
const DOMAINES = [
  'Plant', 'Magasin', 'Sanitaires', 'Cantine', 'Chimique',
  'Locaux_techniques', 'Déchets', 'Transport', 'Infirmerie', 'Recycleurs', 'Incendie',
];

const STATUS_CONFIG: Record<string, { label: string; color: any }> = {
  PLANIFIE:  { label: 'Planifié',  color: 'default' },
  EN_COURS:  { label: 'En cours',  color: 'info'    },
  REALISE:   { label: 'Réalisé',   color: 'success' },
  EN_RETARD: { label: 'En retard', color: 'error'   },
  ANNULEE:   { label: 'Annulée',   color: 'default' },
};

export default function InspectionsListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'ADMIN_HSEE';

  // États filtres et chargement
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterDomaine, setFilterDomaine] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [exportLoading, setExportLoading] = useState(false);

  // États actions
  const [closeTarget, setCloseTarget] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [templateIds, setTemplateIds] = useState<Record<string, string>>({});

  // Récupération des inspections (Filtres)
  const fetchInspections = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await inspectionService.getAll({
        ...(filterDomaine && { domaine: filterDomaine }),
        ...(filterStatut && { statut: filterStatut }),
        ...(filterDateFrom && { dateFrom: filterDateFrom }),
        ...(filterDateTo && { dateTo: filterDateTo }),
      });
      setInspections(data);
    } catch {
      setError('Impossible de charger les inspections.');
    } finally {
      setLoading(false);
    }
  }, [filterDomaine, filterStatut, filterDateFrom, filterDateTo]);

  useEffect(() => {
    fetchInspections();
  }, [fetchInspections]);

  // Récupération des modèles de checklists actifs (Travail de votre binôme)
  useEffect(() => {
    checklistService
      .getAll()
      .then((templates) => {
        const map: Record<string, string> = {};
        templates
          .filter((t: any) => t.actif)
          .forEach((t: any) => {
            map[t.domaine] = t.id;
          });
        setTemplateIds(map);
      })
      .catch(() => {});
  }, []);

  // Filtrage local côté client (Recherche textuelle globale)
  const filtered = inspections.filter((i) =>
    !search ||
    `${i.domaine} ${i.site} ${i.auditeur?.firstName} ${i.auditeur?.lastName}`
      .toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await inspectionService.remove(deleteTarget.id);
      setDeleteTarget(null);
      setInspections((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Erreur lors de la suppression.');
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const blob = await inspectionService.exportCsv({
        ...(filterDomaine && { domaine: filterDomaine }),
        ...(filterStatut && { statut: filterStatut }),
        ...(filterDateFrom && { dateFrom: filterDateFrom }),
        ...(filterDateTo && { dateTo: filterDateTo }),
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inspections-hsee-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Erreur lors de l'export CSV.");
    } finally {
      setExportLoading(false);
    }
  };

  const handleClosed = (updated: any) => {
    setInspections((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Inspections</Typography>
          <Typography variant="body2" color="text.secondary">
            {filtered.length} inspection(s) · {inspections.length} total
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={exportLoading ? <CircularProgress size={16} /> : <DownloadIcon />}
            onClick={handleExport}
            disabled={exportLoading || inspections.length === 0}
          >
            Export CSV
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/inspections/new')}>
            Nouvelle inspection
          </Button>
        </Box>
      </Box>

      {/* Filtres */}
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', p: 2, mb: 2, borderRadius: 2 }}>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <TextField
            placeholder="Domaine, site, auditeur…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ minWidth: 220 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
            }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Domaine</InputLabel>
            <Select value={filterDomaine} label="Domaine" onChange={(e) => setFilterDomaine(e.target.value)}>
              <MenuItem value="">Tous</MenuItem>
              {DOMAINES.map((d) => <MenuItem key={d} value={d}>{d.replace(/_/g, ' ')}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Statut</InputLabel>
            <Select value={filterStatut} label="Statut" onChange={(e) => setFilterStatut(e.target.value)}>
              <MenuItem value="">Tous</MenuItem>
              {Object.entries(STATUS_CONFIG).map(([v, c]) => (
                <MenuItem key={v} value={v}>{c.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField label="Du" type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)}
            size="small" InputLabelProps={{ shrink: true }} sx={{ minWidth: 140 }} />
          <TextField label="Au" type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)}
            size="small" InputLabelProps={{ shrink: true }} sx={{ minWidth: 140 }} />
          {(search || filterDomaine || filterStatut || filterDateFrom || filterDateTo) && (
            <Button size="small" color="inherit" onClick={() => { setSearch(''); setFilterDomaine(''); setFilterStatut(''); setFilterDateFrom(''); setFilterDateTo(''); }}>
              Réinitialiser
            </Button>
          )}
        </Box>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
      ) : filtered.length === 0 ? (
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', p: 6, textAlign: 'center', borderRadius: 2 }}>
          <Typography color="text.secondary" mb={2}>Aucune inspection trouvée.</Typography>
          <Button variant="contained" onClick={() => navigate('/inspections/new')}>
            Créer une inspection
          </Button>
        </Paper>
      ) : (
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
          {/* Header de la Table */}
          <Box display="grid" gridTemplateColumns="2fr 1.2fr 1.2fr 1fr 1fr 60px 240px" gap={1}
            sx={{ px: 2, py: 1.5, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
            {['Domaine', 'Auditeur', 'Site', 'Date prévue', 'Statut', 'GPS', 'Actions'].map((h) => (
              <Typography key={h} variant="caption" fontWeight={600} color="text.secondary" textTransform="uppercase">
                {h}
              </Typography>
            ))}
          </Box>

          {/* Lignes d'inspections */}
          {filtered.map((inspection) => {
            const cfg = STATUS_CONFIG[inspection.statut] || STATUS_CONFIG.EN_COURS;
            const canClose = inspection.statut === 'EN_COURS' && (inspection.auditeurId === user?.id || isAdmin);

            return (
              <Box key={inspection.id} display="grid"
                gridTemplateColumns="2fr 1.2fr 1.2fr 1fr 1fr 60px 240px"
                gap={1} alignItems="center"
                sx={{ px: 2, py: 1.5, borderBottom: '0.5px solid', borderColor: 'divider',
                  '&:last-child': { borderBottom: 'none' }, '&:hover': { bgcolor: 'grey.50' } }}>

                {/* Domaine & Date de création */}
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {(inspection.domaine || '').replace(/_/g, ' ')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(inspection.timestamp).toLocaleString('fr-FR')}
                  </Typography>
                </Box>

                {/* Auditeur */}
                <Typography variant="body2">
                  {inspection.auditeur?.firstName} {inspection.auditeur?.lastName}
                </Typography>

                {/* Site */}
                <Typography variant="body2">{inspection.site}</Typography>

                {/* Date Prévue */}
                <Typography variant="body2">
                  {new Date(inspection.datePrevue).toLocaleDateString('fr-FR')}
                </Typography>

                {/* Statut & Durée */}
                <Box>
                  <Chip label={cfg.label} size="small" color={cfg.color} />
                  {inspection.durationMinutes && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      {inspection.durationMinutes} min
                    </Typography>
                  )}
                </Box>

                {/* Coordonnées GPS (Votre Code) */}
                <Tooltip title={inspection.latitude
                  ? `${Number(inspection.latitude).toFixed(4)}, ${Number(inspection.longitude).toFixed(4)}`
                  : 'Sans GPS'}>
                  <Box display="flex" justifyContent="flex-start">
                    {inspection.latitude
                      ? <LocationOnIcon sx={{ fontSize: 18, color: 'success.main' }} />
                      : <LocationOffIcon sx={{ fontSize: 18, color: 'text.disabled' }} />}
                  </Box>
                </Tooltip>

                {/* Actions unifiées (Votre travail + votre binôme) */}
                <Box display="flex" gap={1} alignItems="center">
                  
                  {/* BOUTON REMPLIR : seulement si inspection EN_COURS et que la checklist existe */}
                  {templateIds[inspection.domaine] && inspection.statut === "EN_COURS" && (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => navigate(`/checklists/fill/${inspection.id}/${templateIds[inspection.domaine]}`)}
                    >
                      Remplir
                    </Button>
                  )}

                  {/* BOUTON RÉSULTATS : Toujours visible si le template existe */}
                  {templateIds[inspection.domaine] && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      onClick={() => navigate(`/checklists/results/${inspection.id}/${templateIds[inspection.domaine]}`)}
                    >
                      Résultats
                    </Button>
                  )}

                  {/* Clôturer l'inspection (Votre Code) */}
                  {canClose && (
                    <Tooltip title="Clôturer l'inspection">
                      <IconButton size="small" color="success" onClick={() => setCloseTarget(inspection)}>
                        <LockIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}

                  {/* Modifier l'inspection */}
                  {inspection.statut === 'EN_COURS' && (
                    <Tooltip title="Modifier">
                      <IconButton size="small" onClick={() => navigate(`/inspections/${inspection.id}/edit`)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}

                  {/* Supprimer l'inspection (Admin seulement - Votre Code) */}
                  {isAdmin && (
                    <Tooltip title="Supprimer">
                      <IconButton size="small" color="error" onClick={() => setDeleteTarget(inspection)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Box>
            );
          })}
        </Paper>
      )}

      {/* Modal clôture */}
      {closeTarget && (
        <CloseInspectionModal
          inspection={closeTarget}
          open={!!closeTarget}
          onClose={() => setCloseTarget(null)}
          onClosed={handleClosed}
        />
      )}

      {/* Dialog suppression */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: 'error.main' }}>Supprimer l'inspection</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>Action irréversible.</Alert>
          <Typography variant="body2">
            Supprimer l'inspection{' '}
            <strong>{(deleteTarget?.domaine || '').replace(/_/g, ' ')} — {deleteTarget?.site}</strong> ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Annuler</Button>
          <Button onClick={handleDelete} variant="contained" color="error" disabled={deleting}>
            {deleting ? <CircularProgress size={20} color="inherit" /> : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}