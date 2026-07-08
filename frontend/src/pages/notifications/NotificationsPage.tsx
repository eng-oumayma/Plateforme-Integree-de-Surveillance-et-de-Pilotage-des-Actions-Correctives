import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import BuildIcon from '@mui/icons-material/Build';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoIcon from '@mui/icons-material/Info';
import { notificationService } from '../../services/notificationService';
import { useNavigate } from 'react-router-dom';

function NotifIcon({ type }: { type: string }) {
  const s = { fontSize: 20 };
  if (type.includes('INSPECTION')) return <AssignmentIcon sx={{ ...s, color: '#1565C0' }} />;
  if (type.includes('PLAN'))       return <CalendarTodayIcon sx={{ ...s, color: '#7B1FA2' }} />;
  if (type.includes('ACTION'))     return <BuildIcon sx={{ ...s, color: '#E65100' }} />;
  if (type.includes('ANOMALIE'))   return <WarningAmberIcon sx={{ ...s, color: '#C62828' }} />;
  if (type.includes('EVENEMENT'))  return <CalendarTodayIcon sx={{ ...s, color: '#2E7D32' }} />;
  return <InfoIcon sx={{ ...s, color: '#546E7A' }} />;
}

function timeAgo(dateStr: string): string {
  const diff = Math.round((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60)     return 'À l\'instant';
  if (diff < 3600)   return `Il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400)  return `Il y a ${Math.floor(diff / 3600)} h`;
  if (diff < 604800) return `Il y a ${Math.floor(diff / 86400)} j`;
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [total,         setTotal]         = useState(0);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState('');
  const [page,          setPage]          = useState(1);
  const [filterLu,      setFilterLu]      = useState('');
  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await notificationService.getAll(page, limit);
      setNotifications(result.data);
      setTotal(result.total);
      setUnreadCount(result.unreadCount);
    } catch {
      setError('Impossible de charger les notifications.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const filtered = notifications.filter((n) => {
    if (filterLu === 'unread') return !n.lu;
    if (filterLu === 'read')   return n.lu;
    return true;
  });

  const handleMarkAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, lu: true } : n));
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, lu: true })));
    setUnreadCount(0);
  };

  const handleRemove = async (id: string) => {
    const notif = notifications.find((n) => n.id === id);
    await notificationService.remove(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (notif && !notif.lu) setUnreadCount((c) => Math.max(0, c - 1));
  };

  const handleClearRead = async () => {
    await notificationService.clearRead();
    setNotifications((prev) => prev.filter((n) => !n.lu));
  };

  const handleClick = async (notif: any) => {
    if (!notif.lu) await handleMarkAsRead(notif.id);
    if (notif.lien) navigate(notif.lien);
  };

  return (
    <Box maxWidth={760} mx="auto">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Notifications</Typography>
          <Typography variant="body2" color="text.secondary">
            {unreadCount > 0
              ? `${unreadCount} non lue(s) · ${total} au total`
              : `${total} notification(s)`}
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          {unreadCount > 0 && (
            <Button size="small" variant="outlined" startIcon={<DoneAllIcon />} onClick={handleMarkAllAsRead}>
              Tout lire
            </Button>
          )}
          <Button
            size="small"
            variant="outlined"
            color="inherit"
            startIcon={<DeleteSweepIcon />}
            onClick={handleClearRead}
          >
            Supprimer les lues
          </Button>
        </Box>
      </Box>

      {/* Filtre */}
      <Box display="flex" gap={2} mb={2}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Afficher</InputLabel>
          <Select value={filterLu} label="Afficher" onChange={(e) => setFilterLu(e.target.value)}>
            <MenuItem value="">Toutes</MenuItem>
            <MenuItem value="unread">Non lues</MenuItem>
            <MenuItem value="read">Lues</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>
      ) : filtered.length === 0 ? (
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', p: 6, textAlign: 'center', borderRadius: 2 }}>
          <NotificationsNoneIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography color="text.secondary">Aucune notification</Typography>
        </Paper>
      ) : (
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
          {filtered.map((notif, idx) => (
            <Box key={notif.id}>
              <Box
                onClick={() => handleClick(notif)}
                sx={{
                  display: 'flex', gap: 2, px: 2.5, py: 2,
                  cursor: notif.lien ? 'pointer' : 'default',
                  bgcolor: notif.lu ? 'transparent' : 'rgba(21,101,192,0.04)',
                  borderLeft: notif.lu ? '3px solid transparent' : '3px solid #1565C0',
                  '&:hover': { bgcolor: 'grey.50' },
                  alignItems: 'flex-start',
                }}
              >
                <Box sx={{
                  width: 42, height: 42, borderRadius: '50%',
                  bgcolor: notif.lu ? 'grey.100' : 'primary.light',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <NotifIcon type={notif.type} />
                </Box>

                <Box flex={1} minWidth={0}>
                  <Box display="flex" alignItems="center" gap={1} mb={0.25}>
                    <Typography variant="body2" fontWeight={notif.lu ? 400 : 700}>
                      {notif.titre}
                    </Typography>
                    {!notif.lu && (
                      <Chip label="Nouveau" size="small" color="primary" sx={{ height: 16, fontSize: 9 }} />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {notif.message}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    {timeAgo(notif.createdAt)}
                  </Typography>
                </Box>

                <Box display="flex" gap={0.5} flexShrink={0} alignItems="center">
                  {!notif.lu && (
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notif.id); }}
                      title="Marquer comme lue"
                    >
                      <CheckIcon fontSize="small" color="primary" />
                    </IconButton>
                  )}
                  <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); handleRemove(notif.id); }}
                    title="Supprimer"
                  >
                    <DeleteIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                  </IconButton>
                </Box>
              </Box>
              {idx < filtered.length - 1 && <Divider />}
            </Box>
          ))}
        </Paper>
      )}

      {/* Pagination */}
      {total > limit && (
        <Box display="flex" justifyContent="center" gap={2} mt={3}>
          <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)} variant="outlined" size="small">
            Précédent
          </Button>
          <Typography variant="body2" color="text.secondary" alignSelf="center">
            Page {page} / {Math.ceil(total / limit)}
          </Typography>
          <Button disabled={page >= Math.ceil(total / limit)} onClick={() => setPage((p) => p + 1)} variant="outlined" size="small">
            Suivant
          </Button>
        </Box>
      )}
    </Box>
  );
}