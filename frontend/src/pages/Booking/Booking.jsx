import { useEffect, useState } from "react";
import {
  createBooking,
  getBookings,
} from "../../services/bookingService";

function Booking() {
  const [bookings, setBookings] = useState([]);

  const [form, setForm] = useState({
    facility: "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
  });

  const fetchBookings = async () => {
    try {
      const res = await getBookings();
      setBookings(res.data.bookings);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createBooking(form);
      alert("Booking successful");
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <h1 className="text-2xl font-bold mb-4">
        Facility Booking
      </h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="mb-6 border p-4">
        <input
          name="facility"
          placeholder="Facility (Room 101)"
          className="block mb-2 p-2 border w-full"
          onChange={handleChange}
        />

        <input
          type="date"
          name="date"
          className="block mb-2 p-2 border w-full"
          onChange={handleChange}
        />

        <input
          type="time"
          name="startTime"
          className="block mb-2 p-2 border w-full"
          onChange={handleChange}
        />

        <input
          type="time"
          name="endTime"
          className="block mb-2 p-2 border w-full"
          onChange={handleChange}
        />

        <input
          name="purpose"
          placeholder="Purpose"
          className="block mb-2 p-2 border w-full"
          onChange={handleChange}
        />

        <button className="bg-accent hover:bg-highlight text-black p-2 rounded-lg transition">
          Book
        </button>
      </form>

      {/* BOOKINGS LIST */}
      {bookings.map((b) => (
        <div key={b._id} className="border p-3 mb-2">
          <h3 className="font-bold">{b.facility}</h3>
          <p>
            {new Date(b.date).toDateString()}
          </p>
          <p>
            {b.startTime} - {b.endTime}
          </p>
          <p className="text-sm text-gray-500">
            {b.purpose}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Booking;