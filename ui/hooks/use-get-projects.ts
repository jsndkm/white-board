import { API } from "@/lib/api/endpoint";
import { Project } from "@/lib/api/project";
import { fetcher } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export function useGetProjects(enabled: boolean) {
  return useQuery({
    queryKey: ["project-list"],
    queryFn: async () => {
      return await fetcher<Project[]>(API.projects.list);
    },
    enabled,
  });
}
