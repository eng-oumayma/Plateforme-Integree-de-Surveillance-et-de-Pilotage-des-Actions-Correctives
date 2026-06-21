import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocationOffIcon from '@mui/icons-material/LocationOff';
import { inspectionService } from '../../services/inspectionService';

const DOMAINES = [
  'Plant', 'Magasin', 'Sanitaires', 'Cantine', 'Chimique',
  'Locaux techniques', 'Déchets', 'Transport', 'Infirmerie', 'Recycleurs', 'Incendie',
];

const STATUS_COLORS = {
  EN_COURS: 'info',
  TERMINEE: 'warning',
  VALIDEE:  'success',
  ANNULEE:  'default',
};

const STATUS_LABELS = {
  EN_COURS: 'En cours',
  TERMINEE: 'Terminée',
  VALIDEE:  'Validée',
  ANNULEE:  'Annulée',
};

export default function InspectionsListPage() {
  const navigate = useNavigate();
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [search, setSearch]           = useState('');
  const [filterDomaine, setFilterDomaine] = useState('');
  const [filterStatut,  setFilterStatut]  = useState('');

  const fetchInspections = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await inspectionService.getAll({
        ...(filterDomaine && { domaine: filterDomaine }),
        ...(filterStatut  && { statut:  filterStatut }),
      });
      setInspections(data);
    } catch {
      setError('Impossible de charger les inspections.');
    } finally {
      setLoading(false);
    }
  }, [filterDomaine, filterStatut]);

  useEffect(() => { fetchInspections(); }, [fetchInspections]);

  const filtered = inspections.filter((i) =>
    !search || `${i.domaine} ${i.site} ${i.auditeur?.firstName} ${i.auditeur?.lastName}`
      .toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Inspections</Typography>
          <Typography variant="body2" color="text.secondary">
            {inspections.length} inspection(s) · Epic 2
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/inspections/new')}>
          Nouvelle inspection
        </Button>
      </Box>

      {/* Filtres */}
      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        <TextField
          placeholder="Rechercher domaine, site, auditeur…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ minWidth: 260 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
          }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Domaine</InputLabel>
          <Select value={filterDomaine} label="Domaine" onChange={(e) => setFilterDomaine(e.target.value)}>
            <MenuItem value="">Tous</MenuItem>
            {DOMAINES.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Statut</InputLabel>
          <Select value={filterStatut} label="Statut" onChange={(e) => setFilterStatut(e.target.value)}>
            <MenuItem value="">Tous</MenuItem>
            {Object.entries(STATUS_LABELS).map(([v, l]) => <MenuItem key={v} value={v}>{l}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : filtered.length === 0 ? (
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', p: 6, textAlign: 'center' }}>
          <Typography color="text.secondary">Aucune inspection trouvée.</Typography>
          <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate('/inspections/new')}>
            Créer la première inspection
          </Button>
        </Paper>
      ) : (
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
          {/* Table header */}
          <Box display="grid" gridTemplateColumns="2fr 1.5fr 1fr 1fr 1fr 80px" gap={2}
            sx={{ px: 2, py: 1.5, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
            {['Domaine', 'Site / Auditeur', 'Date prévue', 'Statut', 'GPS', ''].map((h) => (
              <Typography key={h} variant="caption" fontWeight={600} color="text.secondary" textTransform="uppercase">
                {h}
              </Typography>
            ))}
          </Box>

          {/* Rows */}
          {filtered.map((inspection) => (
            <Box
              key={inspection.id}
              display="grid"
              gridTemplateColumns="2fr 1.5fr 1fr 1fr 1fr 80px"
              gap={2}
              alignItems="center"
              sx={{
                px: 2, py: 1.5,
                borderBottom: '0.5px solid',
                borderColor: 'divider',
                '&:last-child': { borderBottom: 'none' },
                '&:hover': { bgcolor: 'grey.50' },
              }}
            >
              {/* Domaine */}
              <Box>
                <Typography variant="body2" fontWeight={500}>{inspection.domaine}</Typography>
                {inspection.checklist && (
                  <Typography variant="caption" color="text.secondary">{inspection.checklist.titre}</Typography>
                )}
              </Box>

              {/* Site / Auditeur */}
              <Box>
                <Typography variant="body2">{inspection.site}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {inspection.auditeur?.firstName} {inspection.auditeur?.lastName}
                </Typography>
              </Box>

              {/* Date */}
              <Typography variant="body2">
                {new Date(inspection.datePrevue).toLocaleDateString('fr-FR')}
              </Typography>

              {/* Statut */}
              <Chip
                label={STATUS_LABELS[inspection.statut] || inspection.statut}
                size="small"
                color={STATUS_COLORS[inspection.statut] || 'default'}
              />

              {/* GPS */}
              <Tooltip title={
                inspection.latitude
                  ? `${inspection.latitude.toFixed(4)}, ${inspection.longitude.toFixed(4)}`
                  : 'Pas de géolocalisation'
              }>
                <Box display="flex" alignItems="center">
                  {inspection.latitude
                    ? <LocationOnIcon sx={{ fontSize: 18, color: 'success.main' }} />
                    : <LocationOffIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                  }
                </Box>
              </Tooltip>

              {/* Action */}
              <Button size="small" onClick={() => navigate(`/inspections/${inspection.id}`)}>
                Ouvrir
              </Button>
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
}
