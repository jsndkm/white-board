import { API } from "@/lib/api/endpoint";
import { fetcher } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId }: { projectId: number }) => {
      return await fetcher<void>(API.projects.delete(projectId), {
        method: "DELETE",
      });
    },
    onSuccess: async () => {
      toast.success("删除成功");
      await queryClient.invalidateQueries({ queryKey: ["project-list"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "未知错误");
    },
  });
}
