"use server";

import { signIn } from "./auth";
import { API } from "@/lib/api/endpoint";
import { z } from "zod";

const registerFormSchema = z.object({
  username: z.string().regex(/^[a-zA-Z0-9]{6,16}$/),
  password: z.string().min(6).max(16),
  email: z.string().email(),
  phone: z.string().regex(/^1[0-9]{10}$/),
});

const loginFormSchema = z.object({
  username: z.string().regex(/^[a-zA-Z0-9]{6,16}$/),
  password: z.string().min(6).max(16),
});

export interface LoginActionState {
  status: "idle" | "in_progress" | "success" | "failed" | "invalid_data";
}

export const login = async (
  _: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> => {
  try {
    const validatedData = loginFormSchema.parse({
      username: formData.get("username"),
      password: formData.get("password"),
    });

    await signIn("credentials", {
      username: validatedData.username,
      password: validatedData.password,
      redirect: false,
    });

    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }

    return { status: "failed" };
  }
};

export interface RegisterActionState {
  status:
    | "idle"
    | "in_progress"
    | "success"
    | "failed"
    | "user_exists"
    | "invalid_data";
}

export const register = async (
  _: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> => {
  try {
    const validatedData = registerFormSchema.parse({
      username: formData.get("username"),
      password: formData.get("password"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    });

    const resp = await fetch(API.auth.login, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: validatedData.username,
        password: validatedData.password,
        email: validatedData.email,
        phone: validatedData.phone,
      }),
    });
    if (!resp.ok) return { status: "failed" };

    await signIn("credentials", {
      username: validatedData.username,
      password: validatedData.password,
      redirect: false,
    });

    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }

    return { status: "failed" };
  }
};
