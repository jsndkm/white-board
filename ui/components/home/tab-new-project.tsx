import { TemplateCard } from "@/components/common/template-card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function TabNewProject() {
  return (
    <>
      <ScrollArea className="h-[80vh] w-full px-8 py-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <TemplateCard templateName="空白模板" />
        </div>
      </ScrollArea>
    </>
  );
}
