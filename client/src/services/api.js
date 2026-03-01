import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://mini-chatbot-jf52.onrender.com/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Chatbot Management
export const chatbotAPI = {
  create: async (name, description) => {
    const response = await api.post("/chatbots/", { name, description });
    return response.data;
  },
  getAll: async () => {
    const response = await api.get("/chatbots/");
    return response.data;
  },
  getOne: async (id) => {
    const response = await api.get(`/chatbots/${id}`);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/chatbots/${id}`);
    return response.data;
  }
};

// Document management
export const documentAPI = {
  upload: async (file, chatbotId) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("chatbot_id", chatbotId);

    const response = await api.post("/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getAll: async (chatbotId) => {
    const response = await api.get(`/documents/?chatbot_id=${chatbotId}`);
    return response.data;
  },

  delete: async (documentId) => {
    const response = await api.delete(`/documents/${documentId}`);
    return response.data;
  },
};

// Chat functionality
export const chatAPI = {
  query: async (query, sessionId, chatbotId) => {
    const response = await api.post("/chat/", { 
      query, 
      session_id: sessionId,
      chatbot_id: chatbotId
    });
    return response.data;
  },

  getHistory: async (sessionId, chatbotId) => {
    const response = await api.get(`/chat/history/${sessionId}?chatbot_id=${chatbotId}`);
    return response.data;
  },

  getAllHistory: async (chatbotId, limit = 100, skip = 0) => {
    const response = await api.get(`/chat/all-history?chatbot_id=${chatbotId}&limit=${limit}&skip=${skip}`);
    return response.data;
  },

  // Get unique sessions for a chatbot
  getSessions: async (chatbotId) => {
    const response = await api.get(`/chat/sessions?chatbot_id=${chatbotId}`);
    return response.data;
  },
};

export default api;
