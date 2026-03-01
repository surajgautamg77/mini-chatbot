import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_FLOW_API_URL || "https://mini-chatbot-jf52.onrender.com/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flow management
export const flowAPI = {
  // Execute a flow
  execute: async (userInput, flowData, sessionId, currentStep = 0) => {
    const response = await api.post("/flows/execute", {
      userInput,
      flowData,
      sessionId,
      currentStep,
    });
    return response.data;
  },

  // Get list of saved flows
  getFlows: async () => {
    const response = await api.get("/flows/list");
    return response.data;
  },

  // Save a flow
  saveFlow: async (name, nodes, edges) => {
    const response = await api.post("/flows/save", {
      name,
      nodes,
      edges,
    });
    return response.data;
  },

  // Load a flow by ID
  getFlow: async (flowId) => {
    const response = await api.get(`/flows/${flowId}`);
    return response.data;
  },

  // Delete a flow
  deleteFlow: async (flowId) => {
    const response = await api.delete(`/flows/${flowId}`);
    return response.data;
  },
};

export default flowAPI;
