"use client";

import { useUserStore } from "@/stores/user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuthRedirect() {
  const router = useRouter();
  const token = useUserStore((state) => state.token);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
