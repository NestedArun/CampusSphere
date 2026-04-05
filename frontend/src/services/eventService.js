import API from "./api";

// CREATE EVENT (admin)
export const createEvent = (data) =>
  API.post("/events", data);

// GET EVENTS
export const getEvents = () =>
  API.get("/events");

// REGISTER
export const registerEvent = (id) =>
  API.post(`/events/register/${id}`);
