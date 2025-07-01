import { API } from "@/lib/endpoint";
import { fetcher } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export function useGetTemplate(templateName: string) {
  return useQuery({
    queryKey: ["template", templateName],
    queryFn: async () => {
      return await fetcher<string[]>(API.template.list);
    },
  });
}
