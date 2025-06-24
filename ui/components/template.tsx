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

export function Template({ name }: TemplateProps) {
  const router = useRouter();

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>发挥你的想象力！</CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="flex flex-col mx-auto gap-6 h-40 w-60" />
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
