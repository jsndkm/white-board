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
import { useProjectStore } from "@/stores/project";
import { useSceneStore } from "@/stores/scene";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function DeleteProjectDialog() {
  const router = useRouter();

  const deleteProjectDialogOpen = useSceneStore(
    (state) => state.deleteProjectDialogOpen,
  );
  const setDeleteProjectDialogOpen = useSceneStore(
    (state) => state.setDeleteProjectDialogOpen,
  );

  const project = useProjectStore((state) => state.projectDetail);

  const deleteProject = useProjectStore((state) => state.deleteProjectAction);

  return (
    <AlertDialog
      open={deleteProjectDialogOpen}
      onOpenChange={setDeleteProjectDialogOpen}
    >
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
            onClick={async () => {
              if (!project) {
                toast.error("找不到项目");
                return;
              }
              await deleteProject(project.id);
              toast.success("删除成功");
              router.replace("/");
            }}
            className="cursor-pointer"
          >
            确定
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
