// src/services/ragService.ts
import axios from "axios";

// URL ngrok de Colab — mettre à jour chaque session
const COLAB_URL =
  localStorage.getItem("COLAB_RAG_URL") ||
  "https://handstand-attic-variably.ngrok-free.dev";

const ragApi = axios.create({ baseURL: COLAB_URL, timeout: 60000 });

export const ragService = {
  setColabUrl: (url: string) => {
    localStorage.setItem("COLAB_RAG_URL", url);
    ragApi.defaults.baseURL = url;
  },
  async chat(question: string, useHistory = true) {
    const { data } = await ragApi.post("/chat", {
      question,
      use_history: useHistory,
    });
    return data;
  },
  async classify(description: string) {
    const { data } = await ragApi.post("/classify", { description });
    return data;
  },
  async search(query: string, method = "hybrid") {
    const { data } = await ragApi.post("/search", { query, top_k: 5, method });
    return data;
  },
  async resetHistory() {
    await ragApi.post("/chat/reset");
  },
  async health() {
    const { data } = await ragApi.get("/health");
    return data;
  },
};
