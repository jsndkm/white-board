import { MyProjectContainer } from "@/components/my-project-container";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSceneStore } from "@/stores/scene";

export function OpenProjectDialog() {
  const openProjectDialogOpen = useSceneStore(
    (state) => state.openProjectDialogOpen,
  );
  const setOpenProjectDialogOpen = useSceneStore(
    (state) => state.setOpenProjectDialogOpen,
  );

  return (
    <Dialog
      open={openProjectDialogOpen}
      onOpenChange={setOpenProjectDialogOpen}
    >
      <DialogContent className="!max-w-fit">
        <DialogHeader>
          <DialogTitle>打开项目</DialogTitle>
          <DialogDescription>打开已有项目</DialogDescription>
        </DialogHeader>
        <MyProjectContainer showDetailButton={false} />
      </DialogContent>
    </Dialog>
  );
}
