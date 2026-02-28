import axios from "axios";

// Using local FastAPI backend
const API_BASE_URL = "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Document management
export const documentAPI = {
  // Upload a document (image, pdf, docx, xlsx, txt)
  upload: async (file) => {
    const formData = new FormData();
    formData.append("file", file); // Backend expects 'file'

    const response = await api.post("/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Get all documents (summary list)
  getAll: async () => {
    const response = await api.get("/documents/");
    return response.data;
  },

  // Delete a document
  delete: async (documentId) => {
    const response = await api.delete(`/documents/${documentId}`);
    return response.data;
  },
};

// Chat functionality (RAG)
export const chatAPI = {
  // Send a query to the chat API
  query: async (query, sessionId) => {
    const response = await api.post("/chat/", { 
      query, 
      session_id: sessionId 
    });
    return response.data;
  },

  // Get chat history for a session
  getHistory: async (sessionId) => {
    const response = await api.get(`/chat/history/${sessionId}`);
    return response.data;
  },
  
  // Note: Clear history and Delete single entry are not yet implemented on the backend 
  // but could be added to match existing UI needs.
};

export default api;
