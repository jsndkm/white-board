import { getSession } from "next-auth/react";
import { toast } from "sonner";

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
