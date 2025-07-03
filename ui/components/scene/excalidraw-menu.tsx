"use client";

import { useProjectDialogStore } from "@/stores/project-dialog";
import { MainMenu } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Folder, House, LogOut, Plus } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ExcalidrawMenu() {
  const router = useRouter();

  const handleNewProject = () => {
    useProjectDialogStore.getState().openDialog("newProject");
  };

  const handleOpenProject = () => {
    useProjectDialogStore.getState().openDialog("openProject");
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
  );
}
