import { API } from "@/lib/api/endpoint";
import { fetcher } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useProjectInviteMutation() {
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
    onSuccess: () => toast.success("邀请成功"),
  });
}
