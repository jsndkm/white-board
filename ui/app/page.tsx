"use client";

import AppHeader from "@/components/app-header";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";

export default function Home() {
  useAuthRedirect();

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <AppHeader />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start"></main>
    </div>
  );
}
