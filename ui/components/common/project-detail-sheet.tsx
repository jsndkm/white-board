import { EditableSheetHeader } from "@/components/common/editable-sheet-header";
import { MemberList } from "@/components/dashboard/member-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useDeleteProjectMutation } from "@/hooks/api/project/use-delete-project";
import { useGetProject } from "@/hooks/api/project/use-get-project";
import { useExitProjectMutation } from "@/hooks/api/project/use-project-exit";
import { useProjectInviteMutation } from "@/hooks/api/project/use-project-invite";
import { useGlobalConfirmDialogStore } from "@/stores/confirm-dialog";
import { useProjectDetailsStore } from "@/stores/project-detail";
import {
  DoorOpen,
  FolderOpen,
  LoaderCircle,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";

export function ProjectDetailSheet({
  showOpenProjectButton = true,
}: {
  showOpenProjectButton?: boolean;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const username = session?.user?.username || "";
  const params = useParams();

  const projectIdFromStore = useProjectDetailsStore((state) => state.projectId);
  const isOpen = useProjectDetailsStore((state) => state.isOpen);
  const setIsOpen = useProjectDetailsStore((state) => state.setIsOpen);

  const projectId = projectIdFromStore ?? Number(params.id);
  const { data: projectDetail } = useGetProject(projectId, isOpen);
  const members = projectDetail?.user || [];

  const [inviteUsername, setInviteUsername] = useState("");

  const invite = useProjectInviteMutation();
  const exitProject = useExitProjectMutation();
  const deleteProject = useDeleteProjectMutation();

  const isProjectOwner = projectDetail?.user.some(
    (el) => el.username === username && el.admin,
  );

  const handleInvite = () => {
    if (!projectId || !inviteUsername) return;
    invite.mutate({ projectId: projectId, username: inviteUsername });
    setInviteUsername("");
  };

  const handleOpenProject = () => {
    router.replace(`/project/${[projectId]}`);
    setIsOpen(false);
  };

  const handleDelete = () => {
    useGlobalConfirmDialogStore.getState().openDialog({
      type: "exitProject",
      title: "删除项目",
      description: "您确定要删除此项目吗？",
      onConfirm: () => {
        if (!projectId) return;
        deleteProject.mutate(
          { projectId: projectId },
          {
            onSuccess: () => {
              setIsOpen(false);
              router.replace("/");
            },
          },
        );
      },
    });
  };

  const handleExit = () => {
    useGlobalConfirmDialogStore.getState().openDialog({
      type: "exitProject",
      title: "退出项目",
      description: "您确定要退出此项目吗？",
      onConfirm: () =>
        exitProject.mutate(
          { projectId: projectId || 0 },
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
            id={projectId}
            name={projectDetail?.name ?? ""}
            description={projectDetail?.description ?? ""}
          />

          <Image
            src={`${projectDetail?.image}`}
            alt="Base64"
            width={200}
            height={200}
            unoptimized
            className="h-40 w-full rounded-4xl object-cover"
          />
          <MemberList
            members={members}
            currentUser={username}
            isProjectOwner={isProjectOwner ?? false}
            projectId={projectId}
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
                <UserPlus />
                邀请
              </Button>
            </div>
          </div>

          {/* Action on bottom */}
          <div className="mt-auto flex justify-end gap-2 pt-4">
            {showOpenProjectButton && (
              <Button className="cursor-pointer" onClick={handleOpenProject}>
                <FolderOpen />
                打开项目
              </Button>
            )}

            {isProjectOwner ? (
              <Button
                variant="destructive"
                className="cursor-pointer"
                onClick={handleDelete}
              >
                <Trash2 />
                删除
              </Button>
            ) : (
              <Button
                variant="destructive"
                className="cursor-pointer"
                onClick={handleExit}
              >
                <DoorOpen />
                退出项目
              </Button>
            )}
          </div>
        </SheetContent>
      </Suspense>
    </Sheet>
  );
}
