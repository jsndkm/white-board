"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/stores/user";
import { useRouter } from "next/navigation";

export default function AppHeader() {
  const router = useRouter();
  const username = useUserStore((state) => state.username);
  const logout = useUserStore((state) => state.logout);

  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="hidden md:flex py-1.5 px-2 h-fit md:h-[34px] order-4 md:ml-auto gap-5 items-center">
        <span>{username}</span>
        <Button
          className="cursor-pointer"
          onClick={async () => {
            await logout();
            router.replace("/login");
          }}
        >
          退出登录
        </Button>
        <ModeToggle />
      </div>
    </header>
  );
}
