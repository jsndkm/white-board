"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useGuestRedirect() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.replace("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
