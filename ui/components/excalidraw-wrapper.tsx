"use client";

import { ProjectDialog } from "@/components/project-dialog";
import { useGetScene } from "@/hooks/use-get-scene";
import { useDeleteProjectDialogStore } from "@/stores/delete-project-alert";
import { useProjectDialogStore } from "@/stores/project-dialog";
import { Excalidraw, MainMenu } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Folder, House, LoaderCircle, LogOut, Plus, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

export default function ExcalidrawWrapper({
  projectId,
}: {
  projectId: number;
}) {
  const [, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);

  const router = useRouter();
  const { data: initScene } = useGetScene(projectId);

  return (
    <div className="custom-styles h-screen w-screen">
      <Suspense
        fallback={
          <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
            <LoaderCircle className="animate-spin" />
            <span className="text-lg">首次加载需要较长时间...</span>
          </div>
        }
      >
        <Excalidraw
          langCode="zh-CN"
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
          initialData={initScene}
        >
          <MainMenu>
            <MainMenu.Item
              onSelect={() =>
                useProjectDialogStore.getState().openDialog("newProject")
              }
            >
              <Plus />
              新建项目
            </MainMenu.Item>

            <MainMenu.Item
              onSelect={() =>
                useProjectDialogStore.getState().openDialog("openProject")
              }
            >
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

          <ProjectDialog />
        </Excalidraw>
      </Suspense>
    </div>
  );
}
