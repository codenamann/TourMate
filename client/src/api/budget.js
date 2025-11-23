import api from "./apiClient.js";

export const planBudget = (data) => {
  return api.post("/api/budget/plan", data);
};

export const getAIExplanation = (data) => {
  return api.post("/api/budget/ai-explain", data);
};

