import { API } from "@/lib/endpoint";
import { fetcher } from "@/lib/utils";
import { ProjectDetail } from "@/types/project";
import { useQuery } from "@tanstack/react-query";

export function useGetProject(
  projectId: number | undefined,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      if (!projectId) return null;
      return await fetcher<ProjectDetail>(API.projects.detail(projectId));
    },
    enabled: enabled,
  });
}
