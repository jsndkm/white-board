import { MemberList } from "@/components/member-list";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteProjectMutation } from "@/hooks/use-delete-project";
import { useExitProjectMutation } from "@/hooks/use-exit-project";
import { useGetProject } from "@/hooks/use-get-project";
import { useProjectInviteMutation } from "@/hooks/use-invite-project";
import { useGlobalConfirmDialogStore } from "@/stores/confirm-dialog";
import { useProjectDetailsStore } from "@/stores/project-detail-drawer";
import { LoaderCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Suspense, useRef, useState } from "react";

export function ProjectDetailDrawer() {
  const router = useRouter();
  const { data: session } = useSession();
  const username = session?.user?.username || "";

  const project = useProjectDetailsStore((state) => state.project);

  const { data: projectDetail } = useGetProject(project?.id);

  const isOpen = useProjectDetailsStore((state) => state.isOpen);
  const setIsOpen = useProjectDetailsStore((state) => state.setIsOpen);

  const members = projectDetail?.user || [];

  const [inviteUsername, setInviteUsername] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const invite = useProjectInviteMutation();
  const handleInvite = () => {
    if (!project?.id || !inviteUsername) return;
    invite.mutate({ projectId: project.id, username: inviteUsername });
    setInviteUsername("");
  };

  const exitProject = useExitProjectMutation();
  const deleteProject = useDeleteProjectMutation();

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <Suspense fallback={<LoaderCircle />}>
        <DrawerContent>
          <DrawerHeader className="sr-only">
            <DrawerTitle>项目详情</DrawerTitle>
            <DrawerDescription>项目详细信息</DrawerDescription>
          </DrawerHeader>
          <div className="mx-48 mt-5 mb-10 flex justify-center gap-15">
            <div className="flex flex-3 flex-col justify-between">
              <div className="flex flex-col gap-2">
                <span className="text-foreground line-clamp-1 text-2xl font-semibold">
                  {project?.name}
                </span>
                <p className="text-muted-foreground line-clamp-3">
                  {project?.description}
                </p>
              </div>

              <div className="flex w-full items-end-safe justify-center gap-4">
                <div className="flex w-full flex-col gap-2">
                  <span className="line-clamp-1 text-sm">
                    输入用户名以邀请用户加入项目
                  </span>
                  <Input
                    ref={inputRef}
                    id="username"
                    name="username"
                    className="bg-muted text-md md:text-sm"
                    type="text"
                    placeholder="请输入用户名"
                    autoComplete="username"
                    required
                    value={inviteUsername}
                    onChange={(e) => setInviteUsername(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleInvite}
                  disabled={invite.isPending}
                  className="cursor-pointer"
                >
                  邀请
                </Button>
              </div>
            </div>

            <MemberList
              members={members}
              currentUser={username}
              isProjectOwner={project?.admin || false}
              projectId={project?.id || 0}
            />

            <div className="flex flex-2 flex-col items-center justify-center gap-5">
              <Skeleton className="h-50 w-50" />
              <div className="flex gap-2">
                <Button
                  className="cursor-pointer"
                  onClick={() => {
                    router.replace(`/project/${project?.id}`);
                    setIsOpen(false);
                  }}
                >
                  打开项目
                </Button>
                {project?.admin ? (
                  <Button
                    className="cursor-pointer"
                    onClick={() =>
                      useGlobalConfirmDialogStore.getState().openDialog({
                        type: "exitProject",
                        title: "删除项目",
                        description: "您确定要删除此项目吗？",
                        onConfirm: () =>
                          deleteProject.mutate(
                            { projectId: project?.id || 0 },
                            { onSuccess: () => setIsOpen(false) },
                          ),
                      })
                    }
                  >
                    删除
                  </Button>
                ) : (
                  <Button
                    className="cursor-pointer"
                    onClick={() =>
                      useGlobalConfirmDialogStore.getState().openDialog({
                        type: "exitProject",
                        title: "退出项目",
                        description: "您确定要退出此项目吗？",
                        onConfirm: () =>
                          exitProject.mutate(
                            { projectId: project?.id || 0 },
                            { onSuccess: () => setIsOpen(false) },
                          ),
                      })
                    }
                  >
                    退出项目
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DrawerContent>
      </Suspense>
    </Drawer>
  );
}
