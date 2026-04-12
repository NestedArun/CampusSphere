import { useRef, useEffect } from "react";
import { Bell, X, CheckCheck, Trash2, Megaphone, Calendar, AlertCircle, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TYPE_ICON = {
  complaint:    { icon: AlertCircle, color: "text-red-400" },
  event:        { icon: Calendar,    color: "text-yellow-400" },
  announcement: { icon: Megaphone,   color: "text-accent" },
  system:       { icon: Info,        color: "text-soft" },
};

function timeAgo(date) {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationPanel({ notifications, unreadCount, onMarkRead, onMarkAllRead, onDelete, onClose }) {
  const navigate  = useNavigate();
  const panelRef  = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const handleClick = (n) => {
    if (!n.isRead) onMarkRead(n._id);
    if (n.link) { navigate(n.link); onClose(); }
  };

  return (
    <div ref={panelRef}
      className="absolute right-0 top-12 w-80 bg-primary border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">

      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={15} className="text-accent" />
          <span className="text-sm font-semibold text-white">Notifications</span>
          {unreadCount > 0 && (
            <span className="bg-accent text-white text-xs px-1.5 py-0.5 rounded-full font-medium">{unreadCount}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button onClick={onMarkAllRead} title="Mark all read"
              className="text-soft hover:text-accent transition">
              <CheckCheck size={15} />
            </button>
          )}
          <button onClick={onClose} className="text-soft hover:text-white transition"><X size={15} /></button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto divide-y divide-white/5">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-soft text-sm">No notifications yet</div>
        ) : notifications.map((n) => {
          const meta = TYPE_ICON[n.type] || TYPE_ICON.system;
          const Icon = meta.icon;
          return (
            <div key={n._id}
              onClick={() => handleClick(n)}
              className={`px-4 py-3 cursor-pointer hover:bg-white/5 transition flex gap-3 ${n.isRead ? "opacity-60" : ""}`}>
              <div className={`mt-0.5 shrink-0 ${meta.color}`}><Icon size={15} /></div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold truncate ${n.isRead ? "text-soft" : "text-white"}`}>{n.title}</p>
                <p className="text-xs text-soft mt-0.5 line-clamp-2">{n.message}</p>
                <p className="text-xs text-soft/60 mt-1">{timeAgo(n.createdAt)}</p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                {!n.isRead && <span className="w-2 h-2 rounded-full bg-accent mt-1" />}
                <button onClick={(e) => { e.stopPropagation(); onDelete(n._id); }}
                  className="text-soft/40 hover:text-red-400 transition">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
