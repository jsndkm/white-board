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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateProjectMutation } from "@/hooks/api/use-create-project";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function TabNewProject() {
  return (
    <div className="container mx-auto flex flex-wrap justify-start gap-4 p-4">
      <Template templateName="空白模板" />
    </div>
  );
}

export function Template({ templateName }: { templateName: string }) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const create = useCreateProjectMutation();
  const handleCreate = async (name: string, description: string) => {
    const data = await create.mutateAsync(
      {
        name: name,
        description: description,
      },
      {
        onSuccess: () => setIsOpen(false),
      },
    );
    router.push(`/project/${data.id}`);
  };
  return (
    <>
      <Card className="h-[260px] w-[240px] shrink-0 sm:h-[300px] md:h-[340px]">
        <CardHeader>
          <CardTitle>{templateName}</CardTitle>
          <CardDescription>发挥你的想象力！</CardDescription>
        </CardHeader>
        <CardContent className="size-full">
          <Skeleton className="mx-auto flex h-full w-full flex-col" />
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            className="w-full cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            使用此模板
          </Button>
        </CardFooter>
      </Card>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="!max-w-fit">
          <DialogHeader>
            <DialogTitle>项目信息</DialogTitle>
            <DialogDescription>输入项目信息</DialogDescription>
          </DialogHeader>
          <div className="flex h-[240px] w-[320px] flex-col justify-around gap-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">名称</Label>
              <Input
                id="name"
                name="name"
                className="bg-muted text-md md:text-sm"
                type="text"
                required
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description">描述</Label>
              <Input
                id="description"
                name="description"
                className="bg-muted text-md md:text-sm"
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <Button
              className="cursor-pointer"
              onClick={() => handleCreate(name, description)}
            >
              创建
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
