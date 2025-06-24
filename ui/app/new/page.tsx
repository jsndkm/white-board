"use client";

import AppHeader from "@/components/app-header";
import { Template } from "@/components/template";

export default function Page() {
  return (
    <div className="flex flex-col min-w-0  h-screen w-screen">
      <AppHeader />
      <main className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-10">
        <Template name="空白模板" />
      </main>
    </div>
  );
}
