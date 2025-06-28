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
  const token = session?.user.token;

  const resp = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const { message, data } = await resp.json();
  if (!resp.ok) {
    toast.error(message ?? "未知错误，请稍后再试");
    throw new Error(message ?? "response error");
  }

  return data;
}
