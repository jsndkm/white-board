import { ProjectDetailDrawer } from "@/components/home/project-detail-drawer";
import { ProjectCard } from "@/components/project-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetProjects } from "@/hooks/use-get-projects";
import { LoaderCircle } from "lucide-react";
import { Suspense } from "react";

export function TabMyProject() {
  const { data: projects } = useGetProjects(true);

  return (
    <>
      <ScrollArea className="h-[80vh] w-full px-8 py-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <Suspense fallback={<LoaderCircle className="animate-spin" />}>
            {projects?.map((item, idx) => (
              <ProjectCard key={idx} project={item} showDetailButton={true} />
            ))}
          </Suspense>
        </div>
      </ScrollArea>
      <ProjectDetailDrawer />
    </>
  );
}
