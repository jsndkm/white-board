import { API } from "@/lib/endpoint";
import { Project } from "@/lib/types/project";
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
