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

type TemplateProps = {
  name: string;
};

export function MyProject() {
  return (
    <div className="container mx-auto grid grid-cols-1 gap-5 p-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <Project name="头脑风暴" />
      <Project name="我叫项目" />
    </div>
  );
}

export function Project({ name }: TemplateProps) {
  const router = useRouter();

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>发挥你的想象力！</CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="mx-auto flex h-50 w-50 flex-col gap-6" />
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
