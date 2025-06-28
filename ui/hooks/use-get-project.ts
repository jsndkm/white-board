import { API } from "@/lib/api/endpoint";
import { ProjectDetail } from "@/lib/types/project";
import { fetcher } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export function useGetProject(projectId: number | undefined) {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      if (!projectId) return null;
      return await fetcher<ProjectDetail>(API.projects.detail(projectId));
    },
  });
}
