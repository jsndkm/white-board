"use client";

import { MyProject } from "@/components/my-project";
import { NewProject } from "@/components/new-project";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProjectStore } from "@/stores/project";
import { useUserStore } from "@/stores/user";
import { Excalidraw, MainMenu } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Folder, House, LogOut, Plus, RotateCcw, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ExcalidrawWrapper() {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  const router = useRouter();
  const logout = useUserStore((state) => state.logoutAction);

  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);
  const [openProjectDialogOpen, setOpenProjectDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resetSceneDialogOpen, setResetSceneDialogOpen] = useState(false);

  const project = useProjectStore((state) => state.project);
  const resetStatus = useProjectStore((state) => state.resetStatus);
  const deleteProject = useProjectStore((state) => state.deleteProjectAction);

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
          {/*<MainMenu.Item*/}
          {/*  onSelect={async () =>*/}
          {/*    uploadExcalidraw(excalidrawAPI?.getSceneElements())*/}
          {/*  }*/}
          {/*>*/}
          {/*  <Plus />*/}
          {/*  上传画板*/}
          {/*</MainMenu.Item>*/}

          <MainMenu.Item onSelect={() => setNewProjectDialogOpen(true)}>
            <Plus />
            新建项目
          </MainMenu.Item>

          <MainMenu.Item onSelect={() => setOpenProjectDialogOpen(true)}>
            <Folder />
            打开项目
          </MainMenu.Item>

          <MainMenu.Item onSelect={() => setDeleteDialogOpen(true)}>
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

        {/* ========== Open Project Dialog ========== */}
        <Dialog
          open={openProjectDialogOpen}
          onOpenChange={setOpenProjectDialogOpen}
        >
          <DialogContent className="!max-w-fit">
            <DialogHeader>
              <DialogTitle>打开项目</DialogTitle>
              <DialogDescription>打开已有项目</DialogDescription>
            </DialogHeader>
            <MyProject />
          </DialogContent>
        </Dialog>

        {/* ========== Delete Project Dialog ========== */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>删除项目</AlertDialogTitle>
              <AlertDialogDescription>
                这将会删除项目。您是否要继续?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                取消
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  if (!project) {
                    toast.error("找不到项目");
                    return;
                  }
                  await deleteProject(project.id);
                  toast.success("删除成功");
                  router.replace("/");
                }}
                className="cursor-pointer"
              >
                确定
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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
      </Excalidraw>
    </div>
  );
}
