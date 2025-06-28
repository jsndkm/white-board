import { fetcher } from "@/lib/api";
import { GetMyProjectListEndpoint } from "@/lib/api/endpoint";
import { MyProjectListItem } from "@/lib/api/project";
import { useQuery } from "@tanstack/react-query";

export function useGetProjectList(enabled: boolean) {
  return useQuery({
    queryKey: ["project-list"],
    queryFn: async () => {
      return await fetcher<MyProjectListItem[]>(GetMyProjectListEndpoint);
    },
    enabled,
  });
}
