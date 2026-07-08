import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import BuildIcon from '@mui/icons-material/Build';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoIcon from '@mui/icons-material/Info';
import { useNotifications } from '../../hooks/useNotifications';

// ── Icône selon le type de notification ────────────────────────────────────
function NotifIcon({ type }: { type: string }) {
  const style = { fontSize: 18 };
  if (type.includes('INSPECTION')) return <AssignmentIcon sx={{ ...style, color: '#1565C0' }} />;
  if (type.includes('PLAN'))       return <CalendarTodayIcon sx={{ ...style, color: '#7B1FA2' }} />;
  if (type.includes('ACTION'))     return <BuildIcon sx={{ ...style, color: '#E65100' }} />;
  if (type.includes('ANOMALIE'))   return <WarningAmberIcon sx={{ ...style, color: '#C62828' }} />;
  if (type.includes('EVENEMENT'))  return <CalendarTodayIcon sx={{ ...style, color: '#2E7D32' }} />;
  return <InfoIcon sx={{ ...style, color: '#546E7A' }} />;
}

// ── Formater la date relative ───────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = Math.round((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60)          return 'À l\'instant';
  if (diff < 3600)        return `Il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400)       return `Il y a ${Math.floor(diff / 3600)} h`;
  if (diff < 604800)      return `Il y a ${Math.floor(diff / 86400)} j`;
  return new Date(dateStr).toLocaleDateString('fr-FR');
}

export default function NotificationBell() {
  const navigate = useNavigate();
  const {
    notifications, unreadCount, loading,
    open, setOpen,
    markAsRead, markAllAsRead, remove,
  } = useNotifications();

  const handleClick = (notif: any) => {
    if (!notif.lu) markAsRead(notif.id);
    if (notif.lien) {
      setOpen(false);
      navigate(notif.lien);
    }
  };

  return (
    <>
      {/* ── Icône cloche avec badge ── */}
      <IconButton onClick={() => setOpen(true)} size="small">
        <Badge
          badgeContent={unreadCount > 0 ? unreadCount : null}
          color="error"
          max={99}
        >
          {unreadCount > 0
            ? <NotificationsIcon sx={{ fontSize: 22, color: 'text.primary' }} />
            : <NotificationsNoneIcon sx={{ fontSize: 22, color: 'text.secondary' }} />}
        </Badge>
      </IconButton>

      {/* ── Panel notifications (Dialog — sans Popper) ── */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { maxHeight: '80vh', display: 'flex', flexDirection: 'column' },
        }}
      >
        {/* Header */}
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h6" fontWeight={700}>Notifications</Typography>
              {unreadCount > 0 && (
                <Chip
                  label={`${unreadCount} non lue${unreadCount > 1 ? 's' : ''}`}
                  size="small"
                  color="error"
                  sx={{ height: 20, fontSize: 11 }}
                />
              )}
            </Box>
            {unreadCount > 0 && (
              <Button
                size="small"
                startIcon={<DoneAllIcon />}
                onClick={markAllAsRead}
                color="primary"
              >
                Tout lire
              </Button>
            )}
          </Box>
        </DialogTitle>

        <Divider />

        {/* Liste */}
        <DialogContent sx={{ p: 0, overflowY: 'auto' }}>
          {loading && (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress size={24} />
            </Box>
          )}

          {!loading && notifications.length === 0 && (
            <Box py={6} textAlign="center">
              <NotificationsNoneIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Aucune notification
              </Typography>
            </Box>
          )}

          {!loading && notifications.map((notif, idx) => (
            <Box key={notif.id}>
              <Box
                onClick={() => handleClick(notif)}
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  px: 2,
                  py: 1.5,
                  cursor: notif.lien ? 'pointer' : 'default',
                  bgcolor: notif.lu ? 'transparent' : 'rgba(21,101,192,0.04)',
                  borderLeft: notif.lu ? '3px solid transparent' : '3px solid #1565C0',
                  '&:hover': { bgcolor: 'grey.50' },
                  alignItems: 'flex-start',
                }}
              >
                {/* Icône type */}
                <Box
                  sx={{
                    width: 36, height: 36, borderRadius: '50%',
                    bgcolor: 'grey.100', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, mt: 0.25,
                  }}
                >
                  <NotifIcon type={notif.type} />
                </Box>

                {/* Contenu */}
                <Box flex={1} minWidth={0}>
                  <Typography
                    variant="body2"
                    fontWeight={notif.lu ? 400 : 600}
                    noWrap
                  >
                    {notif.titre}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {notif.message}
                  </Typography>
                  <Typography variant="caption" color="text.disabled" display="block" mt={0.25}>
                    {timeAgo(notif.createdAt)}
                  </Typography>
                </Box>

                {/* Actions */}
                <Box display="flex" gap={0.25} flexShrink={0}>
                  {!notif.lu && (
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); markAsRead(notif.id); }}
                      title="Marquer comme lue"
                    >
                      <CheckIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  )}
                  <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); remove(notif.id); }}
                    title="Supprimer"
                  >
                    <DeleteIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                  </IconButton>
                </Box>
              </Box>
              {idx < notifications.length - 1 && <Divider />}
            </Box>
          ))}
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 2, py: 1 }}>
          <Button size="small" color="inherit" onClick={() => setOpen(false)}>
            Fermer
          </Button>
          <Button
            size="small"
            onClick={() => { setOpen(false); navigate('/notifications'); }}
          >
            Voir toutes les notifications
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}