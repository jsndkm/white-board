import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Project } from "@/lib/types/project";
import { useProjectDetailsStore } from "@/stores/project-detail";
import { useProjectDialogStore } from "@/stores/project-dialog";
import { motion } from "framer-motion";
import { Eye, FolderOpen } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function ProjectCard({
  project,
  showDetailButton,
  base64String,
}: {
  project: Project;
  showDetailButton?: boolean;
  base64String: string;
}) {
  const router = useRouter();

  return (
    <motion.div whileHover={{ scale: 1.02 }}>
      <Card className="relative flex aspect-[4/3] flex-col">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute top-4 right-4"
        >
          <Badge
            variant={project.admin ? "secondary" : "destructive"}
            className={`${
              project.admin
                ? "bg-blue-500 text-white dark:bg-blue-600"
                : "bg-red-500 text-white"
            }`}
          >
            {project.admin ? "所有" : "参与"}
          </Badge>
        </motion.div>

        <CardHeader className="min-h-[72px] space-y-1">
          <CardTitle className="line-clamp-1 text-lg font-bold">
            {project.name}
          </CardTitle>
          <CardDescription className="text-muted-foreground line-clamp-2 text-sm">
            {project.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-full">
          {/*<Skeleton className="h-full w-full rounded-md" />*/}
          <Image
            src={`data:image/png;base64,${base64String}`}
            alt="Base64"
            width={200}
            height={200}
            unoptimized
            className="h-full w-full rounded-md object-cover"
          />
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            className="w-full cursor-pointer"
            onClick={() => {
              useProjectDialogStore.getState().setIsOpen(false);
              useProjectDetailsStore.getState().setProject(project);
              router.push(`/project/${project.id}`);
            }}
          >
            <FolderOpen />
            打开项目
          </Button>

          {showDetailButton && (
            <Button
              variant="secondary"
              className="w-full cursor-pointer"
              onClick={() =>
                useProjectDetailsStore.getState().openDialog(project)
              }
            >
              <Eye />
              查看详情
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
