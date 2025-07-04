import { ProjectCard } from "@/components/common/project-card";
import { TemplateCard } from "@/components/common/template-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetProjectList } from "@/hooks/api/project/use-get-project-list";
import { useGetTemplateList } from "@/hooks/api/template/use-get-template-list";
import { useProjectDialogStore } from "@/stores/project-dialog";
import { LoaderCircle } from "lucide-react";

export function ProjectDialog() {
  const isOpen = useProjectDialogStore((state) => state.isOpen);
  const setIsOpen = useProjectDialogStore((state) => state.setIsOpen);
  const dialogType = useProjectDialogStore((state) => state.dialogType);

  const queryProjectList = useGetProjectList(
    isOpen && dialogType === "openProject",
  );
  const queryTemplateNameList = useGetTemplateList(
    isOpen && dialogType === "newProject",
  );

  const getTitle = () => {
    switch (dialogType) {
      case "newProject":
        return "新建项目";
      case "openProject":
        return "打开项目";
      case "projectDetails":
        return "项目详情";
      default:
        return "";
    }
  };

  const getDescription = () => {
    switch (dialogType) {
      case "newProject":
        return "从模板新建项目";
      case "openProject":
        return "打开已有项目";
      case "projectDetails":
        return "项目详细信息";
      default:
        return "";
    }
  };

  const getContent = () => {
    switch (dialogType) {
      case "newProject":
        return (
          <>
            {queryTemplateNameList.isLoading && <LoaderCircle />}
            {queryTemplateNameList.data?.map((item, idx) => (
              <TemplateCard
                key={idx}
                templateName={item.name}
                templateDesc={item.description}
                base64String={item.image}
              />
            ))}
          </>
        );

      case "openProject":
        return (
          <>
            {queryProjectList.isLoading && <LoaderCircle />}
            {queryProjectList.data?.map((item, idx) => (
              <ProjectCard
                key={idx}
                project={item}
                showDetailButton={false}
                base64String={item.image}
              />
            ))}
          </>
        );

      case "projectDetails":
        return <p>项目详情</p>;

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="flex h-[80vh] w-[80vw] !max-w-none flex-col p-6">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="min-h-0 flex-1 pr-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {getContent()}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
