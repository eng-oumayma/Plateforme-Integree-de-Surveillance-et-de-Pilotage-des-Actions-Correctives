import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { planningService } from '../../services/planningService';
import { useAuth } from '../../contexts/AuthContext';

// ── Helpers semaine ISO ────────────────────────────────────────────────────
function getCurrentWeek(): number {
  const now   = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = Math.ceil((now.getTime() - start.getTime()) / 86400000);
  return Math.ceil(dayOfYear / 7);
}

function getCurrentYear(): number {
  return new Date().getFullYear();
}

function getMondayOfWeek(annee: number, semaine: number): Date {
  const jan4      = new Date(annee, 0, 4);
  const dayOfWeek = jan4.getDay() || 7;
  const monday    = new Date(jan4);
  monday.setDate(jan4.getDate() - (dayOfWeek - 1) + (semaine - 1) * 7);
  return monday;
}

function formatWeekRange(annee: number, semaine: number): string {
  const monday = getMondayOfWeek(annee, semaine);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return `${monday.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} → ${sunday.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}`;
}

// ── Config statuts ─────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; color: any; icon: any }> = {
  PLANIFIE:  { label: 'À faire',    color: 'info',    icon: ScheduleIcon },
  EN_RETARD: { label: 'En retard',  color: 'error',   icon: WarningAmberIcon },
  REALISE:   { label: 'Réalisé',    color: 'success', icon: CheckCircleIcon },
  ANNULE:    { label: 'Annulé',     color: 'default', icon: null },
};

const DOMAINE_ICONS: Record<string, string> = {
  PLANT: '🏭', MAGASIN: '📦', SANITAIRES: '🚿', CANTINE: '🍽️',
  CHIMIQUE: '⚗️', LOCAUX_TECHNIQUES: '🔧', DECHETS: '♻️',
  TRANSPORT: '🚛', INFIRMERIE: '🏥', RECYCLEURS: '🔄', INCENDIE: '🔥',
};

export default function MesTachesPage() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const currentWeek = getCurrentWeek();
  const currentYear = getCurrentYear();

  const [taches, setTaches]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const fetchTaches = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await planningService.getMesTaches();
      setTaches(data);
    } catch {
      setError('Impossible de charger vos tâches. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTaches(); }, [fetchTaches]);

  // ── Grouper par section ────────────────────────────────────────────────
  const enRetard    = taches.filter((t) => t.statut === 'EN_RETARD');
  const cetteSemaine = taches.filter((t) => t.statut === 'PLANIFIE' && t.semaine === currentWeek && t.annee === currentYear);
  const aVenir      = taches.filter((t) => t.statut === 'PLANIFIE' && (t.semaine > currentWeek || t.annee > currentYear));
  const realises    = taches.filter((t) => t.statut === 'REALISE').slice(0, 5); // 5 derniers

  // ── Naviguer vers CreateInspectionPage pré-rempli ─────────────────────
  const handleRealiser = (tache: any) => {
    navigate('/inspections/new', {
      state: {
        prefill: {
          domaine:    tache.domaine,
          site:       tache.site,
          planId:     tache.id,
          semaine:    tache.semaine,
          annee:      tache.annee,
        },
      },
    });
  };

  // ── Composant carte tâche ─────────────────────────────────────────────
  const TacheCard = ({ tache, showAction = true }: { tache: any; showAction?: boolean }) => {
    const cfg      = STATUS_CONFIG[tache.statut] || STATUS_CONFIG.PLANIFIE;
    const StatusIcon = cfg.icon;
    const isLate   = tache.statut === 'EN_RETARD';
    const isDone   = tache.statut === 'REALISE';

    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '40px 1fr auto',
          gap: 2,
          alignItems: 'center',
          p: 2,
          borderBottom: '0.5px solid',
          borderColor: 'divider',
          '&:last-child': { borderBottom: 'none' },
          bgcolor: isLate ? 'rgba(198,40,40,0.03)' : 'transparent',
          '&:hover': { bgcolor: isLate ? 'rgba(198,40,40,0.06)' : 'grey.50' },
        }}
      >
        {/* Icône domaine */}
        <Box
          sx={{
            width: 40, height: 40, borderRadius: 2,
            bgcolor: isLate ? 'error.light' : isDone ? 'success.light' : 'primary.light',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20,
          }}
        >
          {DOMAINE_ICONS[tache.domaine] || '📋'}
        </Box>

        {/* Infos */}
        <Box>
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <Typography variant="body2" fontWeight={600}>
              {tache.domaine?.replace(/_/g, ' ')}
            </Typography>
            <Chip
              label={cfg.label}
              size="small"
              color={cfg.color}
              icon={StatusIcon ? <StatusIcon style={{ fontSize: 12 }} /> : undefined}
            />
          </Box>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Box display="flex" alignItems="center" gap={0.5}>
              <LocationOnIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">{tache.site}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              <CalendarTodayIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                S{tache.semaine} · {formatWeekRange(tache.annee, tache.semaine)}
              </Typography>
            </Box>
            {tache.frequence && (
              <Typography variant="caption" color="text.disabled">
                {tache.frequence.toLowerCase()}
              </Typography>
            )}
          </Box>
          {tache.commentaire && (
            <Typography variant="caption" color="text.secondary" fontStyle="italic" mt={0.5} display="block">
              💬 {tache.commentaire}
            </Typography>
          )}
        </Box>

        {/* Action */}
        {showAction && !isDone && (
          <Tooltip title={isLate ? 'Réaliser cette inspection en retard' : 'Commencer cette inspection'}>
            <Button
              variant={isLate ? 'contained' : 'outlined'}
              color={isLate ? 'error' : 'primary'}
              size="small"
              startIcon={<PlayArrowIcon />}
              onClick={() => handleRealiser(tache)}
              sx={{ whiteSpace: 'nowrap', minWidth: 110 }}
            >
              Réaliser
            </Button>
          </Tooltip>
        )}

        {isDone && (
          <Chip
            label="Fait ✓"
            size="small"
            color="success"
            variant="outlined"
          />
        )}
      </Box>
    );
  };

  // ── Section avec titre ─────────────────────────────────────────────────
  const Section = ({ title, items, color = 'text.primary', showAction = true, emptyMsg = '' }: any) => (
    <Box mb={3}>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Typography variant="subtitle1" fontWeight={700} color={color}>
          {title}
        </Typography>
        {items.length > 0 && (
          <Chip label={items.length} size="small" sx={{ height: 20, fontSize: 11 }} />
        )}
      </Box>
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
        {items.length === 0 ? (
          <Box p={2.5} textAlign="center">
            <Typography variant="body2" color="text.secondary">{emptyMsg}</Typography>
          </Box>
        ) : (
          items.map((t: any) => (
            <TacheCard key={t.id} tache={t} showAction={showAction} />
          ))
        )}
      </Paper>
    </Box>
  );

  return (
    <Box maxWidth={760} mx="auto">

      {/* ── Header ── */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Mes inspections à réaliser
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Bonjour {user?.firstName} · Semaine {currentWeek} · {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AssignmentIcon />}
          onClick={() => navigate('/inspections/new')}
        >
          Inspection libre
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* ── KPI rapide ── */}
          <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2} mb={3}>
            {[
              { label: 'En retard',    val: enRetard.length,     bg: '#FFEBEE', color: '#C62828' },
              { label: 'Cette semaine', val: cetteSemaine.length, bg: '#E3F2FD', color: '#1565C0' },
              { label: 'À venir',      val: aVenir.length,       bg: '#F3E5F5', color: '#6A1B9A' },
            ].map((s) => (
              <Paper key={s.label} elevation={0} sx={{
                border: '1px solid', borderColor: 'divider', p: 2,
                textAlign: 'center', borderRadius: 2, bgcolor: s.bg,
              }}>
                <Typography variant="h4" fontWeight={700} sx={{ color: s.color }}>{s.val}</Typography>
                <Typography variant="caption" color="text.secondary">{s.label}</Typography>
              </Paper>
            ))}
          </Box>

          {/* ── En retard (priorité absolue) ── */}
          {enRetard.length > 0 && (
            <>
              <Alert severity="error" sx={{ mb: 2 }}>
                <strong>{enRetard.length} inspection(s) en retard</strong> — à réaliser dès que possible.
              </Alert>
              <Section
                title="🔴 En retard"
                items={enRetard}
                color="error.main"
                emptyMsg=""
              />
              <Divider sx={{ mb: 3 }} />
            </>
          )}

          {/* ── Cette semaine ── */}
          <Section
            title={`📅 Cette semaine (S${currentWeek})`}
            items={cetteSemaine}
            color="primary.main"
            emptyMsg="Aucune inspection planifiée pour cette semaine."
          />

          {/* ── À venir ── */}
          <Section
            title="⏳ À venir"
            items={aVenir.slice(0, 8)}
            color="text.secondary"
            emptyMsg="Aucune inspection à venir."
          />

          {/* ── Récemment réalisés ── */}
          {realises.length > 0 && (
            <>
              <Divider sx={{ mb: 3 }} />
              <Section
                title="✅ Récemment réalisés"
                items={realises}
                color="success.main"
                showAction={false}
                emptyMsg=""
              />
            </>
          )}

          {/* ── Aucune tâche du tout ── */}
          {taches.length === 0 && (
            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', p: 6, textAlign: 'center', borderRadius: 2 }}>
              <AssignmentIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Aucune tâche assignée
              </Typography>
              <Typography variant="body2" color="text.disabled" mb={3}>
                L'administrateur HSEE ne vous a pas encore assigné d'inspections planifiées.
              </Typography>
              <Button variant="outlined" onClick={() => navigate('/inspections/new')}>
                Créer une inspection libre
              </Button>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
}
