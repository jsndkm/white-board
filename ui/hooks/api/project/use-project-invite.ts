import { API } from "@/lib/endpoint";
import { fetcher } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useProjectInviteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      username,
    }: {
      projectId: number;
      username: string;
    }) => {
      return await fetcher<void>(API.projects.invite(projectId, username), {
        method: "POST",
      });
    },
    onSuccess: async (_, variables) => {
      toast.success("邀请成功");
      await queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });
    },
  });
}
