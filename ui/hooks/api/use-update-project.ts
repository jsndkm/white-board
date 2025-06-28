import { API } from "@/lib/api/endpoint";
import { CreateProjectRespData } from "@/lib/types/project";
import { fetcher } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      description,
    }: {
      id: number;
      name: string;
      description: string;
    }) => {
      return await fetcher<CreateProjectRespData>(API.projects.update(id), {
        method: "PUT",
        body: JSON.stringify({ name, description }),
      });
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["project", variables.id],
      });
    },
  });
}
