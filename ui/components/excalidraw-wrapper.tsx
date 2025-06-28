"use client";

import { ProjectDialog } from "@/components/project-dialog";
import { OpenProjectDialog } from "@/components/scene/open-project-dialog";
import { ResetSceneDialog } from "@/components/scene/reset-scene-dialog";
import { getScene } from "@/lib/api/scene";
import { useDeleteProjectDialogStore } from "@/stores/delete-project-alert";
import { useProjectStore } from "@/stores/project";
import { useProjectDialogStore } from "@/stores/project-dialog";
import { useSceneStore } from "@/stores/scene";
import { Excalidraw, MainMenu } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Folder, House, LogOut, Plus, RotateCcw, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ExcalidrawWrapper({
  projectId,
}: {
  projectId: number;
}) {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  const router = useRouter();

  const setNewProjectDialogOpen = useSceneStore(
    (state) => state.setNewProjectDialogOpen,
  );
  // const setOpenProjectDialogOpen = useSceneStore(
  //   (state) => state.setOpenProjectDialogOpen,
  // );
  const setResetSceneDialogOpen = useSceneStore(
    (state) => state.setResetSceneDialogOpen,
  );

  const openDialog = useProjectDialogStore((state) => state.openDialog);

  const resetStatus = useProjectStore((state) => state.resetStatus);

  useEffect(() => {
    resetStatus();
  }, [resetStatus]);

  return (
    <div className="custom-styles h-screen w-screen">
      <Excalidraw
        langCode="zh-CN"
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        initialData={() => getScene(1)}
      >
        <MainMenu>
          <MainMenu.Item onSelect={() => setNewProjectDialogOpen(true)}>
            <Plus />
            新建项目
          </MainMenu.Item>

          <MainMenu.Item onSelect={() => openDialog("openProject")}>
            <Folder />
            打开项目
          </MainMenu.Item>

          <MainMenu.Item
            onSelect={() =>
              useDeleteProjectDialogStore
                .getState()
                .openDialog(projectId, () => router.push("/"))
            }
          >
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
            onSelect={async () =>
              signOut({
                redirectTo: "/",
              })
            }
          >
            <LogOut />
            退出登录
          </MainMenu.Item>
        </MainMenu>

        {/* ========== New Project Dialog ========== */}
        {/*<NewProjectDialog />*/}
        {/*<ProjectDialog o></ProjectDialog>*/}

        <ProjectDialog />
        {/* ========== Open Project Dialog ========== */}
        <OpenProjectDialog />

        {/* ========== Reset Scene Dialog ========== */}
        <ResetSceneDialog resetAction={() => excalidrawAPI?.resetScene()} />
      </Excalidraw>
    </div>
  );
}
