import { useState, useEffect, useCallback } from "react";
import { getNotifications, markRead, markAllRead, deleteNotification } from "../services/notificationService";

const POLL_INTERVAL = 15000; // poll every 15s

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [loading, setLoading]             = useState(false);

  const fetch = useCallback(async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch().finally(() => setLoading(false));
    const interval = setInterval(fetch, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetch]);

  const handleMarkRead = async (id) => {
    await markRead(id);
    setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const handleMarkAllRead = async () => {
    await markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const handleDelete = async (id) => {
    await deleteNotification(id);
    const deleted = notifications.find((n) => n._id === id);
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    if (deleted && !deleted.isRead) setUnreadCount((c) => Math.max(0, c - 1));
  };

  return { notifications, unreadCount, loading, handleMarkRead, handleMarkAllRead, handleDelete, refetch: fetch };
}
