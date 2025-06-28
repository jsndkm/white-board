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
import { useProjectInviteMutation } from "@/hooks/use-invite-project";
import { useDeleteProjectDialogStore } from "@/stores/delete-project-alert";
import { useHomeStore } from "@/stores/home";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export function ProjectDetailDrawer({
  projectId,
  name,
  description,
  isAdmin,
}: {
  projectId: number;
  name: string;
  description: string;
  isAdmin: boolean;
}) {
  const router = useRouter();

  const projectDetailsDialogOpen = useHomeStore(
    (state) => state.projectDetailsDrawerOpen,
  );
  const setProjectDetailDialogOpen = useHomeStore(
    (state) => state.setProjectDetailsDrawerOpen,
  );

  const [username, setUsername] = useState("");

  const invite = useProjectInviteMutation();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInvite = () => {
    if (!username) return;
    invite.mutate({ projectId, username });
    if (!inputRef.current?.value) return;
    inputRef.current.value = "";
  };

  return (
    <Drawer
      open={projectDetailsDialogOpen}
      onOpenChange={setProjectDetailDialogOpen}
    >
      <DrawerContent>
        <DrawerHeader className="sr-only">
          <DrawerTitle>项目详情</DrawerTitle>
          <DrawerDescription>项目详细信息</DrawerDescription>
        </DrawerHeader>
        <div className="mx-48 mt-5 mb-10 flex justify-center gap-15">
          <div className="flex flex-3 flex-col justify-between">
            <div className="flex flex-col gap-2">
              <h2 className="text-foreground text-2xl font-semibold">{name}</h2>
              <p className="text-muted-foreground">{description}</p>
            </div>

            <div className="flex w-full items-end-safe justify-center gap-4">
              <div className="flex w-full flex-col gap-2">
                <span className="text-sm">输入用户名以邀请用户加入项目</span>
                <Input
                  ref={inputRef}
                  id="username"
                  name="username"
                  className="bg-muted text-md md:text-sm"
                  type="text"
                  placeholder="请输入用户名"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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

          <div className="flex flex-2 flex-col items-center justify-center gap-5">
            <Skeleton className="h-50 w-50" />
            <div className="flex gap-2">
              <Button
                className="cursor-pointer"
                onClick={() => {
                  router.replace(`/project/${projectId}`);
                  useHomeStore.getState().setProjectDetailsDrawerOpen(false);
                }}
              >
                打开项目
              </Button>
              {isAdmin && (
                <Button
                  className="cursor-pointer"
                  onClick={() =>
                    useDeleteProjectDialogStore
                      .getState()
                      .openDialog(projectId, () =>
                        setProjectDetailDialogOpen(false),
                      )
                  }
                >
                  删除
                </Button>
              )}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
