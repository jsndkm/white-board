"use client";

import { useBoardStore } from "@/stores/board";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export function useBoardRouteGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const { isDirty } = useBoardStore();

  const previousPathRef = useRef(pathname);
  const lockRef = useRef(false); // 防止无限跳转

  useEffect(() => {
    // 只关注从画板页跳走的情况
    if (
      previousPathRef.current?.startsWith("/board/") &&
      !pathname.startsWith("/board/") &&
      isDirty
    ) {
      if (lockRef.current) return; // 防抖，避免死循环

      const confirmLeave = window.confirm("你有未保存的更改，确定离开吗？");
      if (!confirmLeave) {
        lockRef.current = true;
        router.push(previousPathRef.current); // 强制跳回画板页
        return;
      }
    }

    lockRef.current = false;
    previousPathRef.current = pathname;
  }, [pathname, isDirty, router]);
}
