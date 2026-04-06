import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Calendar,
  AlertCircle,
  Megaphone,
  Package,
  Building,
} from "lucide-react";

const items = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Lost & Found", path: "/lost-found", icon: Package },
  { name: "Complaints", path: "/complaints", icon: AlertCircle },
  { name: "Events", path: "/events", icon: Calendar },
  { name: "Announcements", path: "/announcements", icon: Megaphone },
  { name: "Booking", path: "/booking", icon: Building },
];

function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 h-screen bg-primary p-4 flex flex-col border-r border-soft/20">
      <h1 className="text-xl font-bold mb-6">CampusSphere</h1>

      <div className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 p-2 rounded-lg transition ${
                active
                  ? "bg-gray-100 font-medium"
                  : "hover:bg-gray-50"
              }`}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;