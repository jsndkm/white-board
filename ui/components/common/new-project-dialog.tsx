import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCreateProjectMutation } from "@/hooks/api/project/use-create-project";
import { useNewProjectDialogStore } from "@/stores/new-project-dialog";
import { useProjectDialogStore } from "@/stores/project-dialog";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function NewProjectDialog() {
  const router = useRouter();

  const { isOpen, templateName, templateDesc, setIsOpen } =
    useNewProjectDialogStore();

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");

  const create = useCreateProjectMutation();
  const handleCreate = async (
    projectName: string,
    projectDesc: string,
    templateName: string,
  ) => {
    const data = await create.mutateAsync(
      {
        name: projectName,
        description: projectDesc,
        template: templateName,
      },
      {
        onSuccess: () => {
          setProjectName("");
          setDescription("");
          setIsOpen(false);
          useProjectDialogStore.getState().setIsOpen(false);
        },
      },
    );
    router.push(`/project/${data.id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="!max-w-md">
        <DialogHeader>
          <DialogTitle>创建新项目</DialogTitle>
          <DialogDescription>基于以下模板创建你的项目</DialogDescription>
        </DialogHeader>

        {/*  封面 Skeleton */}
        <div className="mb-2 h-[160px] w-full">
          <Skeleton className="h-full w-full rounded-md" />
        </div>

        {/*  模板信息 */}
        <div className="mb-4 space-y-1">
          <h3 className="text-lg font-semibold">{templateName}</h3>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {templateDesc}
          </p>
        </div>

        {/*  用户输入区域 */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">项目名称</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Input
                  id="name"
                  name="name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="bg-muted text-md md:text-sm"
                  required
                />
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                字数限制：2~12 个字
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">项目描述</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Input
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-muted text-md md:text-sm"
                  required
                />
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                字数限制：5~30 个字
              </TooltipContent>
            </Tooltip>
          </div>
          <Button
            className="cursor-pointer"
            onClick={() => handleCreate(projectName, description, templateName)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            创建
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
