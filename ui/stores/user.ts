import { login, register } from "@/lib/api/user";
import { z } from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type loginStatusType = "idle" | "success" | "failed" | "invalid_data";
type registerStatusType =
  | "idle"
  | "success"
  | "failed"
  | "user_exists"
  | "invalid_data";

interface UserState {
  loginStatus: loginStatusType;
  registerStatus: registerStatusType;
  username?: string;
  token?: string;
  resetStatus: () => void;
  registerAction: (formData: FormData) => Promise<void>;
  loginAction: (formData: FormData) => Promise<void>;
  logoutAction: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      loginStatus: "idle",
      registerStatus: "idle",
      username: undefined,
      resetStatus: () => set({ loginStatus: "idle", registerStatus: "idle" }),
      registerAction: async (formData) => {
        try {
          await register(formData);
          set({ registerStatus: "success" });
        } catch (error) {
          if (error instanceof z.ZodError) {
            set({ registerStatus: "invalid_data" });
          } else {
            set({ registerStatus: "failed" });
          }
        }
      },
      loginAction: async (formData) => {
        try {
          const token = await login(formData);
          set({ loginStatus: "success", token: token });
        } catch (error) {
          if (error instanceof z.ZodError) {
            set({ loginStatus: "invalid_data" });
          } else {
            set({ loginStatus: "failed" });
          }
        }
      },
      logoutAction: async () => {
        set({
          username: undefined,
          token: undefined,
          loginStatus: "idle",
          registerStatus: "idle",
        });
      },
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        username: state.username,
        token: state.token,
      }),
    },
  ),
);
