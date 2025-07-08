import { API } from "@/lib/endpoint";
import { fetcher } from "@/lib/utils";
import { Template } from "@/types/template";
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
