import API from "./api";

// CREATE
export const createComplaint = (data) =>
  API.post("/complaints", data);

// GET ALL
export const getComplaints = () =>
  API.get("/complaints");

// UPDATE STATUS (admin)
export const updateStatus = (id, data) =>
  API.put(`/complaints/${id}`, data);