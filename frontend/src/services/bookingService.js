import API from "./api";

// CREATE
export const createBooking = (data) =>
  API.post("/bookings", data);

// GET
export const getBookings = () =>
  API.get("/bookings");