import api from "../api/api";
import type {
  LoginPayload,
  AuthTokens,
  User,
  ChangePasswordPayload,
} from "../types";

export const authService = {
  async login(
    payload: LoginPayload,
  ): Promise<{ tokens: AuthTokens; user: User }> {
    const { data } = await api.post("/auth/login", payload);
    return data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout").catch(() => {});
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post("/auth/forgot-password", { email });
  },

  async resetPassword(
    token: string,
    newPassword: string,
    confirm: string,
  ): Promise<void> {
    await api.post("/auth/reset-password", { token, newPassword, confirm });
  },

  async setPassword(
    token: string,
    password: string,
    confirm: string,
  ): Promise<void> {
    await api.post("/auth/set-password", { token, password, confirm });
    console.log("SEND:", { token, password });
  },

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    await api.post("/auth/change-password", payload);
  },

  async getMe(): Promise<User> {
    const { data } = await api.get("/auth/me");
    return data;
  },
};
