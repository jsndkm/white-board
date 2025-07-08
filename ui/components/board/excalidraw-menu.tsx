"use client";

import { useSaveBoardMutation } from "@/hooks/api/board/use-save-board";
import { useProjectDetailsStore } from "@/stores/project-detail";
import { useProjectDialogStore } from "@/stores/project-dialog";
import { MainMenu } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { SiGithub } from "@icons-pack/react-simple-icons";
import {
  Eye,
  Folder,
  House,
  LogOut,
  Moon,
  Plus,
  Save,
  Sun,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
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
  const { theme, setTheme } = useTheme();

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
    useProjectDetailsStore.getState().openDialog(projectId);
  };

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
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

        {/* 新增主题切换菜单项 */}
        <MainMenu.Item onSelect={toggleTheme}>
          {theme === "dark" ? <Sun /> : <Moon />}
          {theme === "dark" ? "浅色模式" : "深色模式"}
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
