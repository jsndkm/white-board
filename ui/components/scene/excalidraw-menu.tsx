"use client";

import { useSaveBoardMutation } from "@/hooks/api/board/use-save-board";
import { useProjectDetailsStore } from "@/stores/project-detail";
import { useProjectDialogStore } from "@/stores/project-dialog";
import { MainMenu } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Eye, Folder, House, LogOut, Plus, Save } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ExcalidrawMenu({
  api,
  projectId,
}: {
  api: ExcalidrawImperativeAPI | null;
  projectId: number;
}) {
  const router = useRouter();
  const saveBoard = useSaveBoardMutation();

  const handleNewProject = () => {
    useProjectDialogStore.getState().openDialog("newProject");
  };

  const handleOpenProject = () => {
    useProjectDialogStore.getState().openDialog("openProject");
  };

  const handleSaveProject = () => {
    if (!api) return;
    saveBoard.mutate(
      { api, projectId },
      {
        onSuccess: () => toast.success("项目保存成功"),
      },
    );
  };

  const handleViewProjectDetails = () => {
    useProjectDetailsStore.getState().openDialog();
  };

  const handleReturnToHome = () => {
    router.push("/");
  };

  return (
    <>
      <MainMenu>
        <MainMenu.Item onSelect={handleNewProject}>
          <Plus />
          新建项目
        </MainMenu.Item>

        <MainMenu.Item onSelect={handleOpenProject}>
          <Folder />
          打开项目
        </MainMenu.Item>

        <MainMenu.Item onSelect={handleSaveProject}>
          <Save />
          保存项目
        </MainMenu.Item>

        <MainMenu.Item onSelect={handleViewProjectDetails}>
          <Eye />
          查看项目详情
        </MainMenu.Item>

        <MainMenu.Item onSelect={handleReturnToHome}>
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
    </>
  );
}
