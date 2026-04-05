import { useEffect, useState } from "react";
import {
  createItem,
  getItems,
  claimItem,
} from "../../services/lostFoundService";

function LostFound() {
  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    type: "lost",
  });

  // Fetch items
  const fetchItems = async () => {
    try {
      const res = await getItems();
      setItems(res.data.items);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createItem(form);
      alert("Item created");
      fetchItems();
    } catch (err) {
      alert("Error creating item");
    }
  };

  const handleClaim = async (id) => {
    try {
      await claimItem(id);
      alert("Item claimed");
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lost & Found</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 p-4 border"
      >
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
          name="type"
          className="block mb-2 p-2 border w-full"
          onChange={handleChange}
        >
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>

        <button className="bg-blue-500 text-white px-4 py-2">
          Submit
        </button>
      </form>

      {/* LIST */}
      <div>
        {items.map((item) => (
          <div key={item._id} className="border p-3 mb-2">
            <h3 className="font-bold">{item.title}</h3>
            <p>{item.description}</p>
            <p className="text-sm text-gray-500">
              {item.location} | {item.type}
            </p>
            <p>Status: {item.status}</p>

            {item.status === "open" && (
              <button
                onClick={() => handleClaim(item._id)}
                className="mt-2 bg-green-500 text-white px-3 py-1"
              >
                Claim
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LostFound;