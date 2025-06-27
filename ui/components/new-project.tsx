import { NewProjectForm } from "@/components/scene/new-project-form";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useHomeStore } from "@/stores/home";
import { useProjectStore } from "@/stores/project";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type ProjectProps = {
  name: string;
};

export function NewProject() {
  const router = useRouter();

  const newProjectInfoDialogOpen = useHomeStore(
    (state) => state.newProjectDialogOpen,
  );
  const setNewProjectInfoDialogOpen = useHomeStore(
    (state) => state.setNewProjectDialogOpen,
  );

  const status = useProjectStore((state) => state.newProjectStatus);
  const createProject = useProjectStore((state) => state.createProjectAction);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const project = useProjectStore((state) => state.project);

  useEffect(() => {
    if (status === "failed") {
      toast.error("未知错误");
    } else if (status === "invalid_data") {
      toast.error("输入长度过短或过长");
    } else if (status === "success") {
      setIsSuccessful(true);
      setNewProjectInfoDialogOpen(false);
      router.push(`/project/${project?.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleSubmit = async (formData: FormData) => {
    await createProject(formData);
  };

  return (
    <div className="container mx-auto flex flex-wrap justify-start gap-4 p-4">
      <Template name="空白模板" />
      <Dialog
        open={newProjectInfoDialogOpen}
        onOpenChange={setNewProjectInfoDialogOpen}
      >
        <DialogContent className="!max-w-fit">
          <DialogHeader>
            <DialogTitle>项目信息</DialogTitle>
            <DialogDescription>输入项目信息</DialogDescription>
          </DialogHeader>
          <NewProjectForm action={handleSubmit}>
            <SubmitButton isSuccessful={isSuccessful}>创建</SubmitButton>
          </NewProjectForm>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function Template({ name }: ProjectProps) {
  const setNewProjectInfoDialogOpen = useHomeStore(
    (state) => state.setNewProjectDialogOpen,
  );

  return (
    <Card className="h-[260px] w-[240px] shrink-0 sm:h-[300px] md:h-[340px]">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>发挥你的想象力！</CardDescription>
      </CardHeader>
      <CardContent className="size-full">
        <Skeleton className="mx-auto flex h-full w-full flex-col" />
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          className="w-full cursor-pointer"
          onClick={async () => setNewProjectInfoDialogOpen(true)}
        >
          使用此模板
        </Button>
      </CardFooter>
    </Card>
  );
}
