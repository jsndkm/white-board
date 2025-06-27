import { fetcher } from "@/lib/api";
import { DeleteProjectEndpoint } from "@/lib/api/endpoint";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteProjectMutation() {
  return useMutation({
    mutationFn: async ({ projectId }: { projectId: number }) => {
      return await fetcher<void>(DeleteProjectEndpoint(projectId), {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast.success("删除成功");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "未知错误");
    },
  });
}
