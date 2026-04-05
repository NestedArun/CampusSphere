import { useEffect, useState } from "react";
import {
  createAnnouncement,
  getAnnouncements,
  toggleAnnouncement,
} from "../../services/announcementService";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  // Decode user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    }
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await getAnnouncements();
      setAnnouncements(res.data.announcements);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await createAnnouncement(form);
      alert("Created");
      fetchAnnouncements();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleAnnouncement(id);
      fetchAnnouncements();
    } catch (err) {
      alert("Error");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Announcements
      </h1>

      {/* ADMIN FORM */}
      {user?.role === "admin" && (
        <form onSubmit={handleCreate} className="mb-6 border p-4">
          <input
            name="title"
            placeholder="Title"
            className="block mb-2 p-2 border w-full"
            onChange={handleChange}
          />

          <textarea
            name="content"
            placeholder="Content"
            className="block mb-2 p-2 border w-full"
            onChange={handleChange}
          />

          <button className="bg-blue-500 text-white px-4 py-2">
            Create
          </button>
        </form>
      )}

      {/* LIST */}
      {announcements.map((a) => (
        <div key={a._id} className="border p-3 mb-2">
          <h3 className="font-bold">{a.title}</h3>
          <p>{a.content}</p>

          {/* ADMIN TOGGLE */}
          {user?.role === "admin" && (
            <button
              onClick={() => handleToggle(a._id)}
              className="mt-2 bg-red-500 text-white px-3 py-1"
            >
              Toggle
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Announcements;