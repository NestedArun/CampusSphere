import { useState } from "react";
import { Search, Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../hooks/useNotifications";
import NotificationPanel from "../notifications/NotificationPanel";

const ROLE_COLORS = { admin: "text-red-400", teacher: "text-yellow-400", student: "text-accent" };

export default function Navbar() {
  const { user } = useAuth();
  const [showPanel, setShowPanel] = useState(false);
  const { notifications, unreadCount, handleMarkRead, handleMarkAllRead, handleDelete } = useNotifications();

  return (
    <div className="h-14 border-b border-white/8 flex items-center justify-between px-5 bg-primary shrink-0">
      <div className="flex items-center gap-2 bg-background/60 border border-white/10 rounded-xl px-3 py-2 w-64 focus-within:border-accent/50 transition">
        <Search size={13} className="text-soft" />
        <input placeholder="Search..." className="bg-transparent outline-none w-full text-sm text-white placeholder-soft/40" />
      </div>

      <div className="flex items-center gap-3">
        {/* Bell with dot indicator */}
        <div className="relative">
          <button onClick={() => setShowPanel(v => !v)}
            className="relative p-2 rounded-xl hover:bg-white/5 transition text-soft hover:text-white">
            <Bell size={16} />
            {unreadCount > 0 && (
              <>
                {/* Red dot */}
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-primary" />
                {/* Count badge */}
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              </>
            )}
          </button>
          {showPanel && (
            <NotificationPanel
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkRead={handleMarkRead}
              onMarkAllRead={handleMarkAllRead}
              onDelete={handleDelete}
              onClose={() => setShowPanel(false)}
            />
          )}
        </div>

        <div className="h-5 w-px bg-white/10" />
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-soft flex items-center justify-center text-xs font-bold text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-white text-xs font-semibold leading-none">{user?.name}</p>
            <p className={`text-[10px] leading-none mt-0.5 capitalize font-medium ${ROLE_COLORS[user?.role] || "text-soft"}`}>{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
