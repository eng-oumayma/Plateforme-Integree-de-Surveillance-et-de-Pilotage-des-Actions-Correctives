import { useState, useEffect, useCallback, useRef } from 'react';
import { notificationService } from '../services/notificationService';

const POLL_INTERVAL = 60000; // 60 secondes

export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [loading,       setLoading]       = useState(false);
  const [open,          setOpen]          = useState(false);
  const lastPollRef = useRef<string>(new Date().toISOString());

  // ── Charger les notifications ────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await notificationService.getAll(1, 20);
      setNotifications(result.data);
      setUnreadCount(result.unreadCount);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  // ── Polling 60s ──────────────────────────────────────────────────────────
  useEffect(() => {
    load();
    const interval = setInterval(async () => {
      try {
        const newOnes = await notificationService.poll(lastPollRef.current);
        if (newOnes.length > 0) {
          setNotifications((prev) => [...newOnes, ...prev]);
          setUnreadCount((c) => c + newOnes.length);
          lastPollRef.current = new Date().toISOString();
        }
      } catch { /* ignore */ }
    }, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [load]);

  const markAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => n.id === id ? { ...n, lu: true } : n),
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const markAllAsRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, lu: true })));
    setUnreadCount(0);
  };

  const remove = async (id: string) => {
    await notificationService.remove(id);
    const notif = notifications.find((n) => n.id === id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (notif && !notif.lu) setUnreadCount((c) => Math.max(0, c - 1));
  };

  return {
    notifications, unreadCount, loading,
    open, setOpen,
    markAsRead, markAllAsRead, remove, reload: load,
  };
}