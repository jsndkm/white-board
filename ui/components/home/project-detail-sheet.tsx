import { EditableSheetHeader } from "@/components/home/editable-sheet-header";
import { MemberList } from "@/components/home/member-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteProjectMutation } from "@/hooks/api/project/use-delete-project";
import { useGetProject } from "@/hooks/api/project/use-get-project";
import { useExitProjectMutation } from "@/hooks/api/project/use-project-exit";
import { useProjectInviteMutation } from "@/hooks/api/project/use-project-invite";
import { useGlobalConfirmDialogStore } from "@/stores/confirm-dialog";
import { useProjectDetailsStore } from "@/stores/project-detail";
import { LoaderCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

export function ProjectDetailSheet() {
  const router = useRouter();
  const { data: session } = useSession();
  const username = session?.user?.username || "";

  const project = useProjectDetailsStore((state) => state.project);
  const isOpen = useProjectDetailsStore((state) => state.isOpen);
  const setIsOpen = useProjectDetailsStore((state) => state.setIsOpen);

  const { data: projectDetail } = useGetProject(project?.id);
  const members = projectDetail?.user || [];

  const [inviteUsername, setInviteUsername] = useState("");

  const invite = useProjectInviteMutation();
  const exitProject = useExitProjectMutation();
  const deleteProject = useDeleteProjectMutation();

  const handleInvite = () => {
    if (!project?.id || !inviteUsername) return;
    invite.mutate({ projectId: project.id, username: inviteUsername });
    setInviteUsername("");
  };

  const handleOpenProject = () => {
    router.replace(`/project/${project?.id}`);
    setIsOpen(false);
  };

  const handleDelete = () => {
    useGlobalConfirmDialogStore.getState().openDialog({
      type: "exitProject",
      title: "删除项目",
      description: "您确定要删除此项目吗？",
      onConfirm: () =>
        deleteProject.mutate(
          { projectId: project?.id || 0 },
          { onSuccess: () => setIsOpen(false) },
        ),
    });
  };

  const handleExit = () => {
    useGlobalConfirmDialogStore.getState().openDialog({
      type: "exitProject",
      title: "退出项目",
      description: "您确定要退出此项目吗？",
      onConfirm: () =>
        exitProject.mutate(
          { projectId: project?.id || 0 },
          { onSuccess: () => setIsOpen(false) },
        ),
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <Suspense fallback={<LoaderCircle />}>
        <SheetContent
          side="right"
          className="flex w-full max-w-lg flex-col space-y-6 overflow-y-auto px-6"
        >
          <EditableSheetHeader
            id={project?.id}
            name={project?.name ?? ""}
            description={project?.description ?? ""}
          />

          <Skeleton className="h-40 w-full rounded-md" />

          <MemberList
            members={members}
            currentUser={username}
            isProjectOwner={project?.admin || false}
            projectId={project?.id || 0}
          />

          {/* Invite Action */}
          <div className="space-y-2">
            <label htmlFor="invite" className="text-sm font-medium">
              输入用户名以邀请成员
            </label>
            <div className="flex gap-2">
              <Input
                id="invite"
                placeholder="请输入用户名"
                value={inviteUsername}
                onChange={(e) => setInviteUsername(e.target.value)}
                className="flex-1"
              />
              <Button
                className="cursor-pointer"
                onClick={handleInvite}
                disabled={invite.isPending}
              >
                邀请
              </Button>
            </div>
          </div>

          {/* Action on bottom */}
          <div className="mt-auto flex justify-end gap-2 pt-4">
            <Button className="cursor-pointer" onClick={handleOpenProject}>
              打开项目
            </Button>
            {project?.admin ? (
              <Button
                variant="destructive"
                className="cursor-pointer"
                onClick={handleDelete}
              >
                删除
              </Button>
            ) : (
              <Button
                variant="destructive"
                className="cursor-pointer"
                onClick={handleExit}
              >
                退出项目
              </Button>
            )}
          </div>
        </SheetContent>
      </Suspense>
    </Sheet>
  );
}
