import { API } from "@/lib/endpoint";
import { fetcher } from "@/lib/utils";
import { ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types";
import { useSuspenseQuery } from "@tanstack/react-query";

export function useGetProjectBoard(id: number) {
  return useSuspenseQuery({
    queryKey: ["project-board", id],
    queryFn: async () => {
      return await fetcher<ExcalidrawInitialDataState>(API.board.getScene(id));
    },
    staleTime: 0,
    gcTime: 0,
  });
}
