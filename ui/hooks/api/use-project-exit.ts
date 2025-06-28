import { API } from "@/lib/api/endpoint";
import { CreateProjectRespData } from "@/lib/types/project";
import { fetcher } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useExitProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId }: { projectId: number }) => {
      return await fetcher<CreateProjectRespData>(
        API.projects.exit(projectId),
        {
          method: "POST",
        },
      );
    },
    onSuccess: async () => {
      toast.success("退出成功");
      await queryClient.invalidateQueries({ queryKey: ["project-list"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "未知错误");
    },
  });
}
