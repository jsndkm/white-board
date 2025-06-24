"use client";

import { Project } from "@/components/my-project";
import { Template } from "@/components/new-project";
import { useUserStore } from "@/stores/user";
import { Excalidraw, MainMenu, Sidebar } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Folder, LogOut, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ExcalidrawWrapper() {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  const router = useRouter();
  const logout = useUserStore((state) => state.logout);

  return (
    <div className="custom-styles h-screen">
      <Excalidraw
        langCode="zh-CN"
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
      >
        <MainMenu>
          <MainMenu.Item
            onSelect={() =>
              excalidrawAPI?.toggleSidebar({ name: "new-project" })
            }
          >
            <Plus />
            新建项目
          </MainMenu.Item>

          <MainMenu.Item
            onSelect={() =>
              excalidrawAPI?.toggleSidebar({ name: "open-project" })
            }
          >
            <Folder />
            打开项目
          </MainMenu.Item>

          <MainMenu.Item onSelect={() => toast.error("功能未实现")}>
            <X />
            删除项目
          </MainMenu.Item>

          <MainMenu.DefaultItems.ClearCanvas />

          <MainMenu.Separator />

          <MainMenu.DefaultItems.ToggleTheme />
          <MainMenu.DefaultItems.ChangeCanvasBackground />

          <MainMenu.ItemLink href="https://github.com/jsndkm/white-board">
            <SiGithub />
            GitHub
          </MainMenu.ItemLink>

          <MainMenu.Item
            onSelect={async () => {
              await logout();
              router.replace("/login");
            }}
          >
            <LogOut />
            退出登录
          </MainMenu.Item>
        </MainMenu>

        {/* ========== New Project ========== */}
        <Sidebar name="new-project">
          <Sidebar.Header>
            <span>新建项目</span>
          </Sidebar.Header>
          <Template name="空白模板" />
        </Sidebar>

        {/* ========== Open Project ========== */}
        <Sidebar name="open-project" className="px-2">
          <Sidebar.Header>
            <span>打开项目</span>
          </Sidebar.Header>
          <Project name="头脑风暴" />
        </Sidebar>
      </Excalidraw>
    </div>
  );
}
