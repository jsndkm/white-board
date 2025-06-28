import { API } from "@/lib/api/endpoint";
import { fetcher } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      username,
    }: {
      projectId: number;
      username: string;
    }) => {
      return await fetcher<void>(
        API.projects.deleteMember(projectId, username),
        {
          method: "DELETE",
        },
      );
    },
    onSuccess: async (_, variables) => {
      toast.success("移出成员成功");
      await queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "未知错误");
    },
  });
}
