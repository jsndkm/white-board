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
import { useNewProjectDialogStore } from "@/stores/new-project-dialog";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function TemplateCard({
  templateName,
  templateDesc,
}: {
  templateName: string;
  templateDesc: string;
}) {
  return (
    <motion.div whileHover={{ scale: 1.02 }}>
      <Card className="relative flex aspect-[4/3] flex-col">
        <CardHeader className="min-h-[72px] items-center justify-center text-center">
          <CardTitle className="text-lg font-semibold tracking-wide">
            {templateName}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {templateDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-full">
          <Skeleton className="h-full w-full rounded-md" />
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
