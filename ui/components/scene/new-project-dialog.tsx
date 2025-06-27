import { NewProject } from "@/components/new-project";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSceneStore } from "@/stores/scene";

export function NewProjectDialog() {
  const newProjectDialogOpen = useSceneStore(
    (state) => state.newProjectDialogOpen,
  );
  const setNewProjectDialogOpen = useSceneStore(
    (state) => state.setNewProjectDialogOpen,
  );

  return (
    <Dialog open={newProjectDialogOpen} onOpenChange={setNewProjectDialogOpen}>
      <DialogContent className="!max-w-fit">
        <DialogHeader>
          <DialogTitle>新建项目</DialogTitle>
          <DialogDescription>选择模板</DialogDescription>
        </DialogHeader>
        <NewProject />
      </DialogContent>
    </Dialog>
  );
}
