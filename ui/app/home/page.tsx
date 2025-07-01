"use client";

import AppHeader from "@/components/home/app-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push("/login");
  };

  return (
    <div className="flex h-screen w-screen min-w-0 flex-col">
      <AppHeader />
      <main className="container mx-auto p-10">
        <div className="flex h-full flex-col items-center justify-between gap-5">
          <Skeleton className="h-[50vh] w-full" />
          <span className="text-lg">欢迎使用 White Board 企业战略分析工具</span>
          <Button
            className="cursor-pointer"
            size="lg"
            onClick={handleButtonClick}
          >
            立即开始
          </Button>
        </div>
      </main>
      <footer />
    </div>
  );
}
