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
import { Skeleton } from "@/components/ui/skeleton";
import { Project } from "@/lib/types/project";
import { useProjectDetailsStore } from "@/stores/project-detail";
import { useProjectDialogStore } from "@/stores/project-dialog";
import { useRouter } from "next/navigation";

export function ProjectCard({
  project,
  showDetailButton,
}: {
  project: Project;
  showDetailButton?: boolean;
}) {
  const router = useRouter();

  return (
    <Card className="relative flex aspect-[4/3] flex-col">
      {project.admin ? (
        <Badge
          variant="secondary"
          className="absolute top-4 right-4 bg-blue-500 text-white dark:bg-blue-600"
        >
          所有
        </Badge>
      ) : (
        <Badge variant="destructive" className="absolute top-4 right-4">
          参与
        </Badge>
      )}
      <CardHeader className="min-h-[96px]">
        <CardTitle>{project.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-full">
        <Skeleton className="h-full w-full rounded-md" />
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          className="w-full cursor-pointer"
          onClick={() => {
            useProjectDialogStore.getState().setIsOpen(false);
            router.push(`/project/${project.id}`);
          }}
        >
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
            查看详情
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
