"use client";

import { useDeleteProjectMutation } from "@/hooks/api/project/use-delete-project";
import { useGlobalConfirmDialogStore } from "@/stores/confirm-dialog";
import { useProjectDialogStore } from "@/stores/project-dialog";
import { MainMenu } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Folder, House, LogOut, Plus, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ExcalidrawMenu({ projectId }: { projectId: number }) {
  const router = useRouter();

  const handleNewProject = () => {
    useProjectDialogStore.getState().openDialog("newProject");
  };

  const handleOpenProject = () => {
    useProjectDialogStore.getState().openDialog("openProject");
  };

  const deleteProject = useDeleteProjectMutation();
  const handleDeleteProject = () => {
    useGlobalConfirmDialogStore.getState().openDialog({
      type: "deleteProject",
      title: "删除项目",
      description: "确定要删除当前项目吗？",
      onConfirm: () => {
        deleteProject.mutate(
          { projectId: projectId },
          {
            onSuccess: () => router.push("/home"),
          },
        );
      },
    });
  };

  return (
    <MainMenu>
      <MainMenu.Item onSelect={handleNewProject}>
        <Plus />
        新建项目
      </MainMenu.Item>

      <MainMenu.Item onSelect={handleOpenProject}>
        <Folder />
        打开项目
      </MainMenu.Item>

      <MainMenu.Item onSelect={handleDeleteProject}>
        <X />
        删除项目
      </MainMenu.Item>

      <MainMenu.Item onSelect={() => router.push("/home")}>
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
  );
}
