import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ENDPOINT } from "@/lib/constants";
import { ProjectInfo } from "@/lib/types/project";
import { dataFetcher } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import useSWR from "swr";
import { Badge } from "@/components/ui/badge";

type ProjectProps = ProjectInfo;

export function MyProject() {
  const { data } = useSWR<ProjectInfo[]>(
    ENDPOINT.GetProjectList,
    dataFetcher<ProjectInfo[]>,
    { suspense: true },
  );

  return (
    <div className="container mx-auto flex flex-wrap justify-start gap-4 p-4">
      <Suspense fallback={<LoaderCircle />}>
        {data?.map((proj, idx) => (
          <Project
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

export function Project({ id, name, description, isAdmin }: ProjectProps) {
  const router = useRouter();

  console.log(isAdmin);

  return (
    <Card className="h-[260px] w-[240px] shrink-0 sm:h-[300px] md:h-[340px] relative">
      {isAdmin ? (
        <Badge
          variant="secondary"
          className="absolute top-4 right-4 bg-blue-500 text-white dark:bg-blue-600"
        >
          所有
        </Badge>
      ):(
        <Badge
          variant="destructive"
          className="absolute top-4 right-4"
        >
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
          onClick={async () => {
            router.push(`project/${id}`);
          }}
        >
          打开项目
        </Button>
      </CardFooter>
    </Card>
  );
}
