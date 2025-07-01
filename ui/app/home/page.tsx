"use client";

import AppHeader from "@/components/home/app-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React from "react";

export default function HomePage() {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen w-screen flex-col overflow-x-hidden">
      <AppHeader />

      {/* Hero Section */}
      <section className="bg-background flex h-screen flex-col items-center justify-center gap-6 px-4 text-center">
        <Skeleton className="h-[50vh] w-full" />
        <h1 className="text-2xl font-bold md:text-4xl">
          欢迎使用 White Board 企业战略分析工具
        </h1>
        <Button
          size="lg"
          className="cursor-pointer"
          onClick={handleButtonClick}
        >
          立即开始
        </Button>
      </section>

      {/* Feature Sections */}
      <Section title="简易的操作">
        <Skeleton className="h-64 w-full rounded-xl" />
      </Section>

      <Section title="丰富的模板">
        <Skeleton className="h-64 w-full rounded-xl" />
      </Section>

      <Section title="多人协作">
        <Skeleton className="h-64 w-full rounded-xl" />
      </Section>

      <Section title="AI辅助策略">
        <Skeleton className="h-64 w-full rounded-xl" />
      </Section>

      <footer className="text-muted-foreground mt-10 flex h-20 items-center justify-center border-t text-sm">
        © 2025 White Board. All rights reserved.
      </footer>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      className="container mx-auto my-16 px-4 text-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h2 className="mb-6 text-2xl font-semibold md:text-3xl">{title}</h2>
      <div className="flex items-center justify-center">{children}</div>
    </motion.section>
  );
}
