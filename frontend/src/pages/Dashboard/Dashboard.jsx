import { useEffect, useState } from "react";
import StatCard from "../../components/ui/StatCard";
import ListCard from "../../components/ui/ListCard";
import Badge from "../../components/ui/Badge";

import { Package, AlertCircle, Calendar } from "lucide-react";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  // Decode user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          Welcome, {user?.name || "User"}
        </h1>

        <div className="flex items-center gap-3">

          {/* LOGOUT BUTTON */}
          <button
            onClick={logout}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100 transition"
          >
            Logout
          </button>

          {/* PROFILE AVATAR */}
          <div
            onClick={() => setShowMenu(true)}
            className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center cursor-pointer hover:border-blue-500 transition"
          >
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>
      </div>

      {/* PROFILE MODAL */}
      {showMenu && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowMenu(false)}
          />

          {/* MODAL */}
          <div className="relative bg-gray-900 text-white p-6 rounded-xl shadow-2xl w-80 z-10">

            {/* CLOSE */}
            <button
              onClick={() => setShowMenu(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-white text-lg"
            >
              ✕
            </button>

            {/* USER INFO */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full border-2 border-gray-500 flex items-center justify-center text-xl bg-gray-800">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>

              <p className="font-semibold text-lg">
                {user?.name || "User"}
              </p>

              <p className="text-sm text-gray-400">
                {user?.email || "email"}
              </p>

              <button
                onClick={logout}
                className="mt-5 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Lost Items" value="12" icon={Package} />
        <StatCard title="Open Complaints" value="5" icon={AlertCircle} />
        <StatCard title="Upcoming Events" value="3" icon={Calendar} />
      </div>

      {/* DATA SECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* ANNOUNCEMENTS */}
        <ListCard title="Announcements">
          <div className="flex justify-between">
            <p>Holiday tomorrow</p>
            <Badge text="urgent" color="red" />
          </div>

          <div className="flex justify-between">
            <p>Exam schedule released</p>
            <Badge text="info" color="gray" />
          </div>
        </ListCard>

        {/* EVENTS */}
        <ListCard title="Upcoming Events">
          <div className="flex justify-between">
            <p>Tech Fest</p>
            <span className="text-sm text-gray-500">Apr 20</span>
          </div>

          <div className="flex justify-between">
            <p>Workshop</p>
            <span className="text-sm text-gray-500">Apr 25</span>
          </div>
        </ListCard>

        {/* BOOKINGS */}
        <ListCard title="Recent Bookings">
          <div>
            <p>Room 101</p>
            <p className="text-sm text-gray-500">10:00 - 11:00</p>
          </div>

          <div>
            <p>Lab A</p>
            <p className="text-sm text-gray-500">12:00 - 01:00</p>
          </div>
        </ListCard>

        {/* COMPLAINTS */}
        <ListCard title="Recent Complaints">
          <div className="flex justify-between">
            <p>Broken Light</p>
            <Badge text="pending" color="yellow" />
          </div>

          <div className="flex justify-between">
            <p>Water leakage</p>
            <Badge text="resolved" color="green" />
          </div>
        </ListCard>

      </div>
    </div>
  );
}

export default Dashboard;