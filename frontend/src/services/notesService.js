import API from "./api";

export const getNotes = (params) => API.get("/notes", { params });

export const uploadNote = (formData) =>
  API.post("/notes", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const downloadNote = async (id, originalName) => {
  const res = await API.get(`/notes/${id}/download`, { responseType: "blob" });
  const url = URL.createObjectURL(new Blob([res.data]));
  const a   = document.createElement("a");
  a.href     = url;
  a.download = originalName;
  a.click();
  URL.revokeObjectURL(url);
};

export const deleteNote = (id) => API.delete(`/notes/${id}`);