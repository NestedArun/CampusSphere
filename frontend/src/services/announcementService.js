import API from "./api";

// CREATE (admin)
export const createAnnouncement = (data) =>
  API.post("/announcements", data);

// GET
export const getAnnouncements = () =>
  API.get("/announcements");

// TOGGLE (admin)
export const toggleAnnouncement = (id) =>
  API.put(`/announcements/${id}`);     