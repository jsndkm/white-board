"use client";

import { Project } from "@/components/my-project";
import { NewProject, Template } from "@/components/new-project";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUserStore } from "@/stores/user";
import { Excalidraw, MainMenu, Sidebar } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Folder, House, LogOut, Plus, RotateCcw, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ExcalidrawWrapper() {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  const router = useRouter();
  const logout = useUserStore((state) => state.logout);

  const [resetSceneDialogOpen, setResetSceneDialogOpen] = useState(false);
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);

  return (
    <div className="custom-styles h-screen w-screen">
      <Excalidraw
        langCode="zh-CN"
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
      >
        <MainMenu>
          <MainMenu.Item
            onSelect={
              () => setNewProjectDialogOpen(true)
              // excalidrawAPI?.toggleSidebar({ name: "new-project" })
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

          <MainMenu.Item onSelect={() => setResetSceneDialogOpen(true)}>
            <RotateCcw />
            重置画布
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

        {/* ========== Reset Scene Dialog ========== */}
        <AlertDialog
          open={resetSceneDialogOpen}
          onOpenChange={setResetSceneDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>清除画布</AlertDialogTitle>
              <AlertDialogDescription>
                这将会清除整个画布。您是否要继续?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                取消
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => excalidrawAPI?.resetScene()}
                className="cursor-pointer"
              >
                确定
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* ========== New Project Dialog ========== */}
        <Dialog
          open={newProjectDialogOpen}
          onOpenChange={setNewProjectDialogOpen}
        >
          <DialogContent className="!max-w-fit">
            <DialogHeader>
              <DialogTitle>新建项目</DialogTitle>
              <DialogDescription>选择模板</DialogDescription>
            </DialogHeader>
            <NewProject />
          </DialogContent>
        </Dialog>
      </Excalidraw>
    </div>
  );
}
