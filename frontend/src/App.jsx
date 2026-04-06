import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import LostFound from "./pages/LostFound/LostFound";
import Complaints from "./pages/Complaints/Complaints";
import Events from "./pages/Events/Events";
import Announcements from "./pages/Announcements/Announcements";
import Booking from "./pages/Booking/Booking";
import PublicRoute from "./routes/PublicRoute";

function App() {
  return (
    <BrowserRouter>
  <Routes>
    {/* PUBLIC (BLOCK IF LOGGED IN) */}
    <Route
      path="/"
      element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      }
    />

    <Route
      path="/register"
      element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      }
    />

    {/* PROTECTED */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/lost-found"
      element={
        <ProtectedRoute>
          <LostFound />
        </ProtectedRoute>
      }
    />

    <Route
      path="/complaints"
      element={
        <ProtectedRoute>
          <Complaints />
        </ProtectedRoute>
      }
    />

    <Route
      path="/events"
      element={
        <ProtectedRoute>
          <Events />
        </ProtectedRoute>
      }
    />

    <Route
      path="/announcements"
      element={
        <ProtectedRoute>
          <Announcements />
        </ProtectedRoute>
      }
    />

    <Route
      path="/booking"
      element={
        <ProtectedRoute>
          <Booking />
        </ProtectedRoute>
      }
    />
  </Routes>
</BrowserRouter>
  );
}

export default App;