// src/services/ragService.ts
import axios from "axios";

// ← URL ngrok de Colab directement (pas via NestJS)
const COLAB_URL = "https://handstand-attic-variably.ngrok-free.dev";

const ragApi = axios.create({
  baseURL: COLAB_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true", // ← obligatoire
  },
  timeout: 180000, // 3 minutes pour le LLM
});

export const ragService = {
  async health(): Promise<{ online: boolean }> {
    try {
      const { data } = await ragApi.get("/health");
      return { online: true, ...data };
    } catch {
      return { online: false };
    }
  },

  async chat(question: string): Promise<{
    answer: string;
    sources: any[];
    query_rewritten: string;
    n_docs_retrieved: number;
  }> {
    const { data } = await ragApi.post("/chat", {
      question,
      use_history: true,
    });
    return data;
  },

  async classify(description: string): Promise<{
    criticite: string;
    confidence: number;
    probabilities: Record<string, number>;
  }> {
    const { data } = await ragApi.post("/classify", { description });
    return data;
  },

  async reset(): Promise<void> {
    await ragApi.post("/chat/reset", {});
  },
};
