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
import { LoaderCircle } from "lucide-react";
import { Suspense } from "react";
import useSWR from "swr";

type ProjectProps = MyProjectListItem;

export function MyProject() {
  const { data: myProjectList } = useSWR<MyProjectListItem[]>(
    GetMyProjectListEndpoint,
    fetcher<MyProjectListItem[]>,
    { suspense: true },
  );

  return (
    <div className="container mx-auto flex flex-wrap justify-start gap-4 p-4">
      <Suspense fallback={<LoaderCircle />}>
        {myProjectList?.map((proj, idx) => (
          <ProjectCard
            key={idx}
            id={proj.id}
            name={proj.name}
            description={proj.description}
            isAdmin={proj.isAdmin}
          />
        ))}
      </Suspense>
    </div>
  );
}

export function ProjectCard({ id, name, description, isAdmin }: ProjectProps) {
  const setProjectDetailsDialogOpen = useHomeStore(
    (state) => state.setProjectDetailsDialogOpen,
  );

  return (
    <Card className="relative h-[260px] w-[240px] shrink-0 sm:h-[300px] md:h-[340px]">
      {isAdmin ? (
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
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="size-full">
        <Skeleton className="mx-auto flex h-full w-full flex-col" />
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          className="w-full cursor-pointer"
          onClick={() => {
            useHomeStore.getState().setSelectedProjectId(id);
            setProjectDetailsDialogOpen(true);
          }}
        >
          查看详情
        </Button>
      </CardFooter>
    </Card>
  );
}
