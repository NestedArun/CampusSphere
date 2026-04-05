import { useEffect, useState } from "react";
import {
  createComplaint,
  getComplaints,
  updateStatus,
} from "../../services/complaintService";

function Complaints() {
  const [complaints, setComplaints] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    category: "other",
  });

  const [user, setUser] = useState(null);

  // Get user from token (basic decode)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    }
  }, []);

  // Fetch complaints
  const fetchComplaints = async () => {
    try {
      const res = await getComplaints();
      setComplaints(res.data.complaints);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createComplaint(form);
      alert("Complaint submitted");
      fetchComplaints();
    } catch {
      alert("Error");
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await updateStatus(id, { status });
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Complaints</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="mb-6 border p-4">
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

        <select
          name="category"
          className="block mb-2 p-2 border w-full"
          onChange={handleChange}
        >
          <option value="maintenance">Maintenance</option>
          <option value="cleanliness">Cleanliness</option>
          <option value="security">Security</option>
          <option value="other">Other</option>
        </select>

        <button className="bg-blue-500 text-white px-4 py-2">
          Submit
        </button>
      </form>

      {/* LIST */}
      {complaints.map((c) => (
        <div key={c._id} className="border p-3 mb-2">
          <h3 className="font-bold">{c.title}</h3>
          <p>{c.description}</p>
          <p className="text-sm text-gray-500">
            {c.location} | {c.category}
          </p>
          <p>Status: {c.status}</p>

          {/* ADMIN CONTROLS */}
          {user?.role === "admin" && (
            <div className="mt-2 space-x-2">
              <button
                onClick={() =>
                  handleStatus(c._id, "in-progress")
                }
                className="bg-yellow-500 text-white px-2 py-1"
              >
                In Progress
              </button>

              <button
                onClick={() =>
                  handleStatus(c._id, "resolved")
                }
                className="bg-green-600 text-white px-2 py-1"
              >
                Resolve
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Complaints;