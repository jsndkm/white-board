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
import { Skeleton } from "@/components/ui/skeleton";
import { fetcher } from "@/lib/api";
import { GetMyProjectListEndpoint } from "@/lib/api/endpoint";
import { MyProjectListItem } from "@/lib/api/project";
import { useHomeStore } from "@/stores/home";
import { useProjectDialogStore } from "@/stores/project-dialog";
import { useSceneStore } from "@/stores/scene";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import useSWR from "swr";

export function MyProjectContainer({
  showDetailButton = true,
}: {
  showDetailButton?: boolean;
}) {
  const { data: myProjectList } = useSWR<MyProjectListItem[]>(
    GetMyProjectListEndpoint,
    fetcher<MyProjectListItem[]>,
    { suspense: true },
  );

  const selected = useHomeStore((state) => state.selectedProject);

  return (
    <div className="container mx-auto flex max-h-fit flex-wrap justify-start gap-4 overflow-auto p-4">
      <Suspense fallback={<LoaderCircle />}>
        {myProjectList?.map((item, idx) => (
          <ProjectCard
            key={idx}
            project={item}
            showDetailButton={showDetailButton}
          />
        ))}
      </Suspense>
      <ProjectDetailDrawer
        projectId={selected?.id ?? 0}
        name={selected?.name ?? ""}
        description={selected?.description ?? ""}
        isAdmin={selected?.admin ?? false}
      />
    </div>
  );
}

export function ProjectCard({
  project,
  showDetailButton,
}: {
  project: MyProjectListItem;
  showDetailButton?: boolean;
}) {
  const router = useRouter();

  const setProjectDetailsDialogOpen = useHomeStore(
    (state) => state.setProjectDetailsDrawerOpen,
  );

  return (
    <Card className="relative h-[260px] w-[240px] shrink-0 sm:h-[300px] md:h-[340px]">
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
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="size-full">
        <Skeleton className="mx-auto flex h-full w-full flex-col" />
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
