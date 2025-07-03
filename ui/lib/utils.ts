import { type ClassValue, clsx } from "clsx";
import { getSession } from "next-auth/react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetcher<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const session = await getSession();
  const token = session?.accessToken;

  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const { msg, data } = await resp.json();
  if (!resp.ok) {
    toast.error(msg ?? "未知错误，请稍后再试");
    // throw new Error(message ?? "response error");
  }

  return data;
}
