import { API } from "@/lib/endpoint";
import { ProjectDetail } from "@/lib/types/project";
import { fetcher } from "@/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";

export function useGetProject(projectId: number | undefined) {
  return useSuspenseQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      if (!projectId) return null;
      return await fetcher<ProjectDetail>(API.projects.detail(projectId));
    },
  });
}
