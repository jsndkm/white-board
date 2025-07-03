import { API } from "@/lib/endpoint";
import { Scene } from "@/lib/types/project";
import { fetcher } from "@/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";

export function useGetProjectScene(id: number) {
  return useSuspenseQuery({
    queryKey: ["scene", id],
    queryFn: async () => {
      return await fetcher<Scene>(API.board.getScene(id));
    },
  });
}
