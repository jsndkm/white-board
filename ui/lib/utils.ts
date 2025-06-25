import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetcher<T = never>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Request failed");
  }

  return res.json();
}

export async function dataFetcher<T = never>(
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

  const json = await res.json();

  if (!res.ok || json.code !== 0) {
    toast.error(json.message || "请求出错");
  }

  return convertKeysToCamel(json.data) as T;
}

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];

interface JsonObject {
  [key: string]: JsonValue;
}

function snakeToCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function convertKeysToCamel<T extends JsonValue>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamel) as T;
  } else if (obj !== null && typeof obj === "object") {
    const result: JsonObject = {};
    for (const [key, value] of Object.entries(obj as JsonObject)) {
      result[snakeToCamel(key)] = convertKeysToCamel(value);
    }
    return result as T;
  }
  return obj;
}
