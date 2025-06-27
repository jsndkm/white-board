import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteProject, inviteToProject } from "@/lib/api/project";
import { useHomeStore } from "@/stores/home";
import { Loader } from "lucide-react";
import Form from "next/form";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export function ProjectDetailDrawer() {
  const router = useRouter();

  const projectDetailsDialogOpen = useHomeStore(
    (state) => state.projectDetailsDialogOpen,
  );
  const project = useHomeStore((state) => state.selectedProject);

  const [isSuccessful, setIsSuccessful] = useState(false);
  const handleSubmit = async (formData: FormData) => {
    try {
      const validated = z
        .object({ username: z.string().min(1, "用户名不能为空") })
        .parse({
          username: formData.get("username"),
        });
      const username = validated.username;
      if (!username || !project) {
        return;
      }
      await inviteToProject(project.id, username);
      setIsSuccessful(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("请检查用户名");
      } else {
        toast.error("邀请失败");
      }
      setIsSuccessful(false);
    }
  };

  return (
    <Drawer
      open={projectDetailsDialogOpen}
      onOpenChange={useHomeStore.getState().setProjectDetailsDialogOpen}
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
                  {project?.name}
                </h2>
                <p className="text-muted-foreground">{project?.description}</p>
              </div>

              <Form
                action={handleSubmit}
                className="flex w-full items-end-safe justify-center gap-4"
              >
                <div className="flex w-full flex-col gap-2">
                  <Label
                    htmlFor="username"
                    className="font-normal text-zinc-600 dark:text-zinc-400"
                  >
                    输入用户名以邀请用户加入项目
                  </Label>

                  <Input
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
                <SubmitButton isSuccessful={isSuccessful}>邀请</SubmitButton>
              </Form>
            </div>

            <div className="flex flex-2 flex-col items-center justify-center gap-5">
              <Skeleton className="h-50 w-50" />
              <div className="flex gap-2">
                <Button
                  className="cursor-pointer"
                  onClick={() => {
                    router.replace(`/project/${project?.id}`);
                    useHomeStore.getState().setProjectDetailsDialogOpen(false);
                  }}
                >
                  打开项目
                </Button>
                {project?.admin && (
                  <ConfirmDeleteButton
                    onConfirmAction={async () => {
                      if (!project?.id) return;
                      await deleteProject(project.id);
                      useHomeStore
                        .getState()
                        .setProjectDetailsDialogOpen(false);
                      router.replace("/");
                    }}
                    className="cursor-pointer"
                  />
                )}
              </div>
            </div>
          </div>
        </DrawerContent>
      </Suspense>
    </Drawer>
  );
}
