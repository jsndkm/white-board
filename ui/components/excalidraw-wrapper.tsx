"use client";

import { OpenProjectDialog } from "@/components/open-project-dialog";
import { DeleteProjectDialog } from "@/components/scene/delete-project-dialog";
import { NewProjectDialog } from "@/components/scene/new-project-dialog";
import { ResetSceneDialog } from "@/components/scene/reset-scene-dialog";
import { useProjectStore } from "@/stores/project";
import { useSceneStore } from "@/stores/scene";
import { useUserStore } from "@/stores/user";
import { Excalidraw, MainMenu } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Folder, House, LogOut, Plus, RotateCcw, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ExcalidrawWrapper() {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  const router = useRouter();
  const logout = useUserStore((state) => state.logoutAction);

  const setNewProjectDialogOpen = useSceneStore(
    (state) => state.setNewProjectDialogOpen,
  );
  const setOpenProjectDialogOpen = useSceneStore(
    (state) => state.setOpenProjectDialogOpen,
  );
  const setDeleteProjectDialogOpen = useSceneStore(
    (state) => state.setDeleteProjectDialogOpen,
  );
  const setResetSceneDialogOpen = useSceneStore(
    (state) => state.setResetSceneDialogOpen,
  );

  const resetStatus = useProjectStore((state) => state.resetStatus);

  useEffect(() => {
    resetStatus();
  }, [resetStatus]);

  return (
    <div className="custom-styles h-screen w-screen">
      <Excalidraw
        langCode="zh-CN"
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        initialData={() => null}
      >
        <MainMenu>
          <MainMenu.Item onSelect={() => setNewProjectDialogOpen(true)}>
            <Plus />
            新建项目
          </MainMenu.Item>

          <MainMenu.Item onSelect={() => setOpenProjectDialogOpen(true)}>
            <Folder />
            打开项目
          </MainMenu.Item>

          <MainMenu.Item onSelect={() => setDeleteProjectDialogOpen(true)}>
            <X />
            删除项目
          </MainMenu.Item>

          <MainMenu.Item onSelect={() => setResetSceneDialogOpen(true)}>
            <RotateCcw />
            重置画布
          </MainMenu.Item>

          <MainMenu.Item onSelect={() => router.push("/")}>
            <House />
            回到主页
          </MainMenu.Item>

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

        {/* ========== New Project Dialog ========== */}
        <NewProjectDialog />

        {/* ========== Open Project Dialog ========== */}
        <OpenProjectDialog />

        {/* ========== Delete Project Dialog ========== */}
        <DeleteProjectDialog />

        {/* ========== Reset Scene Dialog ========== */}
        <ResetSceneDialog resetAction={() => excalidrawAPI?.resetScene()} />
      </Excalidraw>
    </div>
  );
}
