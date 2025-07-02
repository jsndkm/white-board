import { API } from "@/lib/endpoint";
import { fetcher } from "@/lib/utils";
import { ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types";
import { useSuspenseQuery } from "@tanstack/react-query";

export function useGetProjectScene(id: number) {
  return useSuspenseQuery({
    queryKey: ["scene", id],
    queryFn: async () => {
      return await fetcher<ExcalidrawInitialDataState>(API.board.getScene(id));
    },
  });
}
