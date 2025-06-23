"use client";

import { Button } from "@/components/ui/button";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { useUserStore } from "@/stores/user";
import { useRouter } from "next/navigation";

export default function Home() {
  useAuthRedirect();
  const router = useRouter();
  const username = useUserStore((state) => state.username);
  const logout = useUserStore((state) => state.logout);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <span className="text-xl">登录成功</span>
        <span className="text-sm">用户名：{username}</span>
        <Button
          className="cursor-pointer"
          onClick={async () => {
            await logout();
            router.replace("/login");
          }}
        >
          退出登录
        </Button>
      </main>
    </div>
  );
}
