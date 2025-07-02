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
import { useCreateProjectMutation } from "@/hooks/api/project/use-create-project";
import { motion } from "framer-motion";
import { PlusCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function TemplateCard({
  templateName,
  templateDesc,
}: {
  templateName: string;
  templateDesc: string;
}) {
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
        template: templateName,
      },
      {
        onSuccess: () => setIsOpen(false),
      },
    );
    router.push(`/project/${data.id}`);
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }}>
      <Card className="relative flex aspect-[4/3] flex-col">
        <CardHeader className="min-h-[72px] items-center justify-center text-center">
          <CardTitle className="text-lg font-semibold tracking-wide">
            {templateName}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {templateDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-full">
          <Skeleton className="h-full w-full rounded-md" />
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            className="w-full cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Sparkles className="mr-2 h-4 w-4" />
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
              <PlusCircle className="mr-2 h-4 w-4" />
              创建
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
