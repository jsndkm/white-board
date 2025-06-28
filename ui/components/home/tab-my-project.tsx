import { ProjectDetailDrawer } from "@/components/home/project-detail-drawer";
import { ProjectCard } from "@/components/project-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetProjects } from "@/hooks/use-get-projects";
import { LoaderCircle } from "lucide-react";

export function TabMyProject() {
  const { data: projects, isPending } = useGetProjects(true);

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
          {projects?.map((item, idx) => (
            <ProjectCard key={idx} project={item} showDetailButton={true} />
          ))}
        </div>
      </ScrollArea>
      <ProjectDetailDrawer />
    </>
  );
}
