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
import { useDeleteProjectMutation } from "@/hooks/use-delete-project";
import { useDeleteProjectDialogStore } from "@/stores/delete-project-alert";

export function DeleteProjectAlert() {
  const isOpen = useDeleteProjectDialogStore((state) => state.isOpen);
  const setIsOpen = useDeleteProjectDialogStore((state) => state.setIsOpen);
  const targetProjectId = useDeleteProjectDialogStore(
    (state) => state.targetProjectId,
  );
  const onSuccess = useDeleteProjectDialogStore((state) => state.onSuccess);

  const deleteProject = useDeleteProjectMutation();
  const handleDeleteProject = () => {
    if (!targetProjectId) return;
    deleteProject.mutate(
      { projectId: targetProjectId },
      {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          }
        },
      },
    );
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>删除项目</AlertDialogTitle>
          <AlertDialogDescription>
            这将会删除项目。您是否要继续?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteProject}
            className="cursor-pointer"
          >
            确定
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
