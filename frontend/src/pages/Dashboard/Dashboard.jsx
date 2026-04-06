import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);

  // Decode user from token
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

  const cards = [
    { name: "Lost & Found", path: "/lost-found" },
    { name: "Complaints", path: "/complaints" },
    { name: "Events", path: "/events" },
    { name: "Announcements", path: "/announcements" },
    { name: "Booking", path: "/booking" },
  ];

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        {/* PROFILE */}
        <div>
          <div
            onClick={() => setShowMenu(true)}
            className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center cursor-pointer hover:border-blue-500 transition"
          >
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showMenu && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                
                {/* BACKDROP */}
                <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowMenu(false)}
                />

                {/* MODAL BOX */}
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

                    {/* LOGOUT */}
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

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card, index) => (
            <Link
            key={index}
            to={card.path}
            className="p-6 border rounded shadow hover:bg-gray-100 transition"
            >
            <h2 className="text-xl font-semibold">
                {card.name}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
                Go to {card.name}
            </p>
            </Link>
        ))}
        </div>

    </div>
  );
}

export default Dashboard;