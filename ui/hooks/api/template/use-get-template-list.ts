import { API } from "@/lib/endpoint";
import { Template } from "@/lib/types/template";
import { fetcher } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export function useGetTemplateList(enabled: boolean) {
  return useQuery({
    queryKey: ["template-list"],
    queryFn: async () => {
      return await fetcher<Template[]>(API.template.list);
    },
    enabled,
  });
}
