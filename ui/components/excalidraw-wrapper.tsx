"use client";

import { useUserStore } from "@/stores/user";
import { Excalidraw, MainMenu, Sidebar } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ExcalidrawWrapper() {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  const router = useRouter();
  const logout = useUserStore((state) => state.logout);

  const refreshScene = () => {
    excalidrawAPI?.refresh();
    console.log(excalidrawAPI);
    toast.success("刷新成功");
  };

  return (
    <div className="custom-styles h-screen">
      <Excalidraw
        langCode="zh-CN"
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
      >
        <MainMenu>
          <MainMenu.DefaultItems.LoadScene />
          <MainMenu.DefaultItems.SaveAsImage />
          <MainMenu.Separator />
          <MainMenu.Item onSelect={refreshScene}>刷新</MainMenu.Item>
          <MainMenu.ItemLink href="https://github.com/jsndkm/white-board">
            GitHub
          </MainMenu.ItemLink>
          <MainMenu.Item
            onSelect={async () => {
              await logout();
              router.replace("/login");
            }}
          >
            退出登录
          </MainMenu.Item>
        </MainMenu>

        <Sidebar name="custom" docked={false} onDock={() => {}}>
          <Sidebar.Header />
          <Sidebar.Tabs>
            <Sidebar.Tab tab="one">Tab One!</Sidebar.Tab>
            <Sidebar.Tab tab="two">Tab Two!</Sidebar.Tab>
            <Sidebar.TabTriggers>
              <Sidebar.TabTrigger tab="one">One</Sidebar.TabTrigger>
              <Sidebar.TabTrigger tab="two">Two</Sidebar.TabTrigger>
            </Sidebar.TabTriggers>
          </Sidebar.Tabs>
        </Sidebar>
        {/* 自定义触发按钮 */}
        <Sidebar.Trigger
          name="custom"
          tab="one"
          title="Toggle My Sidebar"
          icon={<span>📁</span>}
          style={{ marginLeft: 8 }}
        >
          My Sidebar
        </Sidebar.Trigger>
      </Excalidraw>
    </div>
  );
}
