import { inviteToJoinProject } from "@/lib/api/project";
import { useMutation } from "@tanstack/react-query";

export function useInviteToJoinProjectMutation() {
  return useMutation({
    mutationFn: ({
      projectId,
      username,
    }: {
      projectId: number;
      username: string;
    }) => inviteToJoinProject(projectId, username),
  });
}
