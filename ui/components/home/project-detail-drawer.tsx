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
import { useInviteToJoinProjectMutation } from "@/hooks/use-invite-project";
import { useDeleteProjectDialogStore } from "@/stores/delete-project-dialog";
import { useHomeStore } from "@/stores/home";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Suspense, useRef } from "react";
import { toast } from "sonner";

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

  const { data: session } = useSession();
  const username = session?.user.username;

  const invite = useInviteToJoinProjectMutation();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInvite = () => {
    if (!username) return;
    invite.mutate(
      { projectId, username },
      {
        onSuccess: () => {
          if (!inputRef.current?.value) return;
          inputRef.current.value = "";
          toast.success("邀请成功");
        },
      },
    );
  };

  return (
    <Drawer
      open={projectDetailsDialogOpen}
      onOpenChange={setProjectDetailDialogOpen}
    >
      <Suspense fallback={<Loader />}>
        <DrawerContent>
          <DrawerHeader className="sr-only">
            <DrawerTitle>邀请用户加入项目</DrawerTitle>
            <DrawerDescription>输入用户名发送邀请</DrawerDescription>
          </DrawerHeader>
          <div className="mx-48 mt-5 mb-10 flex justify-center gap-15">
            <div className="flex flex-3 flex-col justify-between">
              <div className="flex flex-col gap-2">
                <h2 className="text-foreground text-2xl font-semibold">
                  {name}
                </h2>
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
                    autoFocus
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
      </Suspense>
    </Drawer>
  );
}
