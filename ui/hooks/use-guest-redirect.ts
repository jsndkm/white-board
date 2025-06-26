"use client";

import { useUserStore } from "@/stores/user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useGuestRedirect() {
  const router = useRouter();
  const token = useUserStore((state) => state.token);

  useEffect(() => {
    console.log(token);
    if (token) {
      router.replace("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
}
