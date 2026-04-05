import API from "./api";

// CREATE ITEM
export const createItem = (data) =>
  API.post("/lost-found", data);

// GET ALL ITEMS
export const getItems = () =>
  API.get("/lost-found");

// CLAIM ITEM
export const claimItem = (id) =>
  API.put(`/lost-found/claim/${id}`);