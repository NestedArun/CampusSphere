import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";

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
          <AppLayout><Dashboard /></AppLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/lost-found"
      element={
        <ProtectedRoute>
          <AppLayout><LostFound /></AppLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/complaints"
      element={
        <ProtectedRoute>
          <AppLayout><Complaints /></AppLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/events"
      element={
        <ProtectedRoute>
          <AppLayout><Events /></AppLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/announcements"
      element={
        <ProtectedRoute>
          <AppLayout><Announcements /></AppLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/booking"
      element={
        <ProtectedRoute>
          <AppLayout><Booking /></AppLayout>
        </ProtectedRoute>
      }
    />
  </Routes>
</BrowserRouter>
  );
}

export default App;