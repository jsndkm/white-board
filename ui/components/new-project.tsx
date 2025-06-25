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
import { useRouter } from "next/navigation";

type ProjectProps = {
  name: string;
};

export function NewProject() {
  return (
    <div className="container mx-auto flex flex-wrap justify-start gap-4 p-4">
      <Template name="空白模板" />
    </div>
  );
}

export function Template({ name }: ProjectProps) {
  const router = useRouter();

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
          onClick={async () => {
            router.push("/project/1");
          }}
        >
          使用此模板
        </Button>
      </CardFooter>
    </Card>
  );
}
