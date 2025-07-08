"use client";

import AppHeader from "@/components/dashboard/app-header";
import { FeatureSection } from "@/components/home/feature-section";
import { InfoSection } from "@/components/home/info-section";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export default function HomePage() {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push("/login");
  };

  return (
    <div className="h-screen w-screen snap-y snap-mandatory overflow-y-scroll">
      <AppHeader />

      {/* Hero Section */}
      <section className="bg-background flex h-screen snap-start flex-col items-center justify-center gap-6 px-4 text-center">
        <Image
          src="/images/cover.png"
          alt="Cover Image"
          width={1000}
          height={800}
          className="rounded-lg shadow-lg"
        />
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

      <FeatureSection
        title="简易的操作"
        description={["拖拽即可使用", "无需复杂配置", "上手快"]}
        image={
          <Image
            src="/images/operation.gif"
            alt="操作演示"
            width={1000}
            height={800}
            className="rounded-xl shadow-xl"
          />
        }
      />

      <FeatureSection
        title="丰富的模板"
        description={["内置战略分析模板", "一键生成", "自动布局"]}
        image={
          <Image
            src="/images/operation.gif"
            alt="操作演示"
            width={1000}
            height={800}
            className="rounded-xl shadow-xl"
          />
        }
        reverse
      />

      <FeatureSection
        title="多人协作"
        description={["支持实时共享", "多人同步编辑", "权限管理"]}
        image={
          <Image
            src="/images/operation.gif"
            alt="操作演示"
            width={1000}
            height={800}
            className="rounded-xl shadow-xl"
          />
        }
      />

      <FeatureSection
        title="AI辅助策略"
        description={["分析逻辑链条", "提出策略建议", "提升决策质量"]}
        image={
          <Image
            src="/images/operation.gif"
            alt="操作演示"
            width={1000}
            height={800}
            className="rounded-xl shadow-xl"
          />
        }
        reverse
      />

      <InfoSection />
    </div>
  );
}
