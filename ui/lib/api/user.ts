import { LoginEndpoint, RegisterEndpoint } from "@/lib/api/endpoint";
import { fetcher } from "@/lib/api/index";
import { z } from "zod";

// ============================== Register ==============================
const registerFormSchema = z.object({
  username: z.string().regex(/^[a-zA-Z0-9]{6,16}$/),
  password: z.string().min(6).max(16),
  email: z.string().email(),
  phone: z.string().regex(/^1[0-9]{10}$/),
});

export const register = async (formData: FormData) => {
  try {
    const validatedData = registerFormSchema.parse({
      username: formData.get("username"),
      password: formData.get("password"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    });

    await fetcher<void>(RegisterEndpoint, {
      method: "POST",
      body: JSON.stringify({
        username: validatedData.username,
        password: validatedData.password,
        email: validatedData.email,
        phone: validatedData.phone,
      }),
    });
  } catch (error) {
    throw error;
  }
};

// ============================== Register ==============================
const loginFormSchema = z.object({
  username: z.string().regex(/^[a-zA-Z0-9]{6,16}$/),
  password: z.string().min(6).max(16),
});

export type LoginResp = {
  id: number;
  token: string;
  username: string;
};

export const login = async (formData: FormData) => {
  try {
    const validatedData = loginFormSchema.parse({
      username: formData.get("username"),
      password: formData.get("password"),
    });

    const resp = await fetcher<LoginResp>(LoginEndpoint, {
      method: "POST",
      body: JSON.stringify({
        username: validatedData.username,
        password: validatedData.password,
      }),
    });

    return resp.token;
  } catch (error) {
    throw error;
  }
};
