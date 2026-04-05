import { useState } from "react";
import { registerUser } from "../../services/authService";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerUser(form);
      alert("Registered successfully");
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form className="p-6 bg-white shadow-md rounded w-80" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">Register</h2>

        <input
          name="name"
          placeholder="Name"
          className="w-full mb-3 p-2 border"
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border"
          onChange={handleChange}
        />

        <button className="w-full bg-green-500 text-white p-2">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;