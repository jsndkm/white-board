import { ENDPOINT } from "@/lib/constants";
import { Resp } from "@/lib/types/types";
import { LoginResp, RegisterResp } from "@/lib/types/user";
import { fetcher } from "@/lib/utils";
import { z } from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const authFormSchema = z.object({
  username: z.string().regex(/^[a-zA-Z0-9]{6,16}$/),
  password: z.string().min(6).max(16),
});

type loginStatusType =
  | "idle"
  | "in_progress"
  | "success"
  | "failed"
  | "invalid_data";
type registerStatusType =
  | "idle"
  | "in_progress"
  | "success"
  | "failed"
  | "user_exists"
  | "invalid_data";

interface UserState {
  loginStatus: loginStatusType;
  registerStatus: registerStatusType;
  username: string;
  resetStatus: () => void;
  register: (formData: FormData) => Promise<void>;
  login: (formData: FormData) => Promise<void>;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      loginStatus: "idle",
      registerStatus: "idle",
      username: "",
      resetStatus: () => set({ loginStatus: "idle", registerStatus: "idle" }),
      register: async (formData) => {
        try {
          const validatedData = authFormSchema.parse({
            username: formData.get("username"),
            password: formData.get("password"),
          });
          set({ username: validatedData.username as string });

          const resp = await fetcher<Resp<RegisterResp>>(ENDPOINT.Register, {
            method: "POST",
            body: JSON.stringify({
              username: validatedData.username,
              password: validatedData.password,
            }),
          });

          localStorage.setItem("token", resp.data.token);
          set({ registerStatus: "success" });
        } catch (error) {
          if (error instanceof z.ZodError) {
            set({ registerStatus: "invalid_data" });
          } else {
            set({ registerStatus: "failed" });
          }
        }
      },
      login: async (formData) => {
        try {
          const validatedData = authFormSchema.parse({
            username: formData.get("username"),
            password: formData.get("password"),
          });
          set({ username: validatedData.username as string });

          const resp = await fetcher<Resp<LoginResp>>(ENDPOINT.Login, {
            method: "POST",
            body: JSON.stringify({
              username: validatedData.username,
              password: validatedData.password,
            }),
          });

          localStorage.setItem("token", resp.data.token);
          set({ loginStatus: "success" });
        } catch (error) {
          if (error instanceof z.ZodError) {
            set({ loginStatus: "invalid_data" });
          } else {
            set({ loginStatus: "failed" });
          }
        }
      },
      logout: async () => {
        try {
          await fetcher<Resp<null>>(ENDPOINT.Logout, {
            method: "POST",
          });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {}
        localStorage.removeItem("token");
        set({ username: "", loginStatus: "idle", registerStatus: "idle" });
      },
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        username: state.username,
      }),
    },
  ),
);
