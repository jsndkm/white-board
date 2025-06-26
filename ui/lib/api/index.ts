import { toast } from "sonner";

export async function fetcher<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const { message, data } = await res.json();
  if (!res.ok) {
    toast.error(message ?? "未知错误，请稍后再试");
    throw new Error(message ?? "response error");
  }

  return data;
}
