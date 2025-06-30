import { TemplateCard } from "@/components/common/template-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetTemplateList } from "@/hooks/api/template/use-get-template-list";
import { LoaderCircle } from "lucide-react";

export function TabNewProject() {
  const { data: templateNameList, isPending } = useGetTemplateList(true);

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
          {templateNameList?.map((item, idx) => (
            <TemplateCard key={idx} templateName={item} />
          ))}
        </div>
      </ScrollArea>
    </>
  );
}
