import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSceneStore } from "@/stores/scene";

export function ResetSceneDialog({ resetAction }: { resetAction: () => void }) {
  const resetSceneDialogOpen = useSceneStore(
    (state) => state.resetSceneDialogOpen,
  );
  const setResetSceneDialogOpen = useSceneStore(
    (state) => state.setResetSceneDialogOpen,
  );

  return (
    <AlertDialog
      open={resetSceneDialogOpen}
      onOpenChange={setResetSceneDialogOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>清除画布</AlertDialogTitle>
          <AlertDialogDescription>
            这将会清除整个画布。您是否要继续?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">取消</AlertDialogCancel>
          <AlertDialogAction onClick={resetAction} className="cursor-pointer">
            确定
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
