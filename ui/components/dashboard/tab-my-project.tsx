import { ProjectCard } from "@/components/common/project-card";
import { ProjectDetailSheet } from "@/components/common/project-detail-sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetProjectList } from "@/hooks/api/project/use-get-project-list";
import { LoaderCircle } from "lucide-react";
import React from "react";

export function TabMyProject() {
  const { data: projects, isPending } = useGetProjectList(true);

  if (isPending)
    return (
      <div className="flex h-[640px] flex-col items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );

  return (
    <>
      <ScrollArea className="h-[80vh] w-full px-8 py-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {projects?.length === 0 && (
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-muted-foreground">暂无项目</p>
            </div>
          )}
          {projects?.map((item, idx) => (
            <ProjectCard
              key={idx}
              project={item}
              showDetailButton={true}
              base64String={item.image}
            />
          ))}
        </div>
      </ScrollArea>
      <ProjectDetailSheet />
    </>
  );
}
