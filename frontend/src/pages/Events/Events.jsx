import { useEffect, useState } from "react";
import {
  createEvent,
  getEvents,
  registerEvent,
} from "../../services/eventService";

function Events() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
  });

  // Decode token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    }
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await getEvents();
      setEvents(res.data.events);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await createEvent(form);
      alert("Event created");
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const handleRegister = async (id) => {
    try {
      await registerEvent(id);
      alert("Registered");
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Events</h1>

      {/* ADMIN FORM */}
      {user?.role === "admin" && (
        <form onSubmit={handleCreate} className="mb-6 border p-4">
          <input
            name="title"
            placeholder="Title"
            className="block mb-2 p-2 border w-full"
            onChange={handleChange}
          />

          <input
            name="description"
            placeholder="Description"
            className="block mb-2 p-2 border w-full"
            onChange={handleChange}
          />

          <input
            name="location"
            placeholder="Location"
            className="block mb-2 p-2 border w-full"
            onChange={handleChange}
          />

          <input
            type="date"
            name="date"
            className="block mb-2 p-2 border w-full"
            onChange={handleChange}
          />

          <button className="bg-accent hover:bg-highlight text-black px-4 py-2 rounded-lg transition">
            Create Event
          </button>
        </form>
      )}

      {/* EVENTS LIST */}
      {events.map((e) => (
        <div key={e._id} className="border p-3 mb-3">
          <h3 className="font-bold text-lg">{e.title}</h3>
          <p>{e.description}</p>
          <p className="text-sm text-gray-500">
            {e.location} | {new Date(e.date).toDateString()}
          </p>

          <p className="text-sm">
            Attendees: {e.attendees.length}
          </p>

          <button
            onClick={() => handleRegister(e._id)}
            className="mt-2 bg-green-500 text-white px-3 py-1"
          >
            Register
          </button>
        </div>
      ))}
    </div>
  );
}

export default Events;