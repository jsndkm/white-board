import { API } from "@/lib/endpoint";
import { Project } from "@/lib/types/project";
import { fetcher } from "@/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";

export function useGetProjectSimple(projectId: number | undefined) {
  return useSuspenseQuery({
    queryKey: ["project-simple", projectId],
    queryFn: async () => {
      if (!projectId) return null;
      return await fetcher<Project>(API.projects.simple(projectId));
    },
  });
}
