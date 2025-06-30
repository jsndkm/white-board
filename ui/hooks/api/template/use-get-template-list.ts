import { API } from "@/lib/endpoint";
import { fetcher } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export function useGetTemplateList(enabled: boolean) {
  return useQuery({
    queryKey: ["template-list"],
    queryFn: async () => {
      return await fetcher<string[]>(API.template.list);
    },
    enabled,
  });
}
