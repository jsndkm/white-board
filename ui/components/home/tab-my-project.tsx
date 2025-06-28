import { ProjectDetailDrawer } from "@/components/home/project-detail-drawer";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProjects } from "@/hooks/use-get-projects";
import { Project } from "@/lib/api/project";
import { useHomeStore } from "@/stores/home";
import { useProjectDialogStore } from "@/stores/project-dialog";
import { useSceneStore } from "@/stores/scene";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

export function TabMyProject({
  showDetailButton = true,
}: {
  showDetailButton?: boolean;
}) {
  const { data: projects } = useGetProjects(true);

  const selected = useHomeStore((state) => state.selectedProject);

  return (
    <>
      <ScrollArea className="h-[80vh] w-full px-8 py-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <Suspense fallback={<LoaderCircle className="animate-spin" />}>
            {projects?.map((item, idx) => (
              <ProjectCard
                key={idx}
                project={item}
                showDetailButton={showDetailButton}
              />
            ))}
          </Suspense>
        </div>
      </ScrollArea>
      <ProjectDetailDrawer
        projectId={selected?.id ?? 0}
        name={selected?.name ?? ""}
        description={selected?.description ?? ""}
        isAdmin={selected?.admin ?? false}
      />
    </>
  );
}

export function ProjectCard({
  project,
  showDetailButton,
}: {
  project: Project;
  showDetailButton?: boolean;
}) {
  const router = useRouter();

  const setProjectDetailsDialogOpen = useHomeStore(
    (state) => state.setProjectDetailsDrawerOpen,
  );

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
            useHomeStore.getState().setSelectedProject(project);
            useSceneStore.getState().setOpenProjectDialogOpen(false);
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
            onClick={() => {
              useHomeStore.getState().setSelectedProject(project);
              setProjectDetailsDialogOpen(true);
            }}
          >
            查看详情
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
