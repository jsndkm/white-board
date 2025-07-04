import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNewProjectDialogStore } from "@/stores/new-project-dialog";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Image from "next/image";

export function TemplateCard({
  templateName,
  templateDesc,
  base64String,
}: {
  templateName: string;
  templateDesc: string;
  base64String: string;
}) {
  return (
    <motion.div whileHover={{ scale: 1.02 }}>
      <Card className="relative flex aspect-[4/3] flex-col">
        <CardHeader className="min-h-[72px] items-center justify-center text-center">
          <CardTitle className="line-clamp-1 text-lg font-semibold tracking-wide">
            {templateName}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {templateDesc}
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
            onClick={() =>
              useNewProjectDialogStore
                .getState()
                .openDialog(templateName, templateDesc)
            }
          >
            <Sparkles className="mr-2 h-4 w-4" />
            使用此模板
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
