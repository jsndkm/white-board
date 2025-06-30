import { API } from "@/lib/endpoint";
import { fetcher } from "@/lib/utils";
import { ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types";
import { useSuspenseQuery } from "@tanstack/react-query";

export function useGetScene(id: number | undefined) {
  return useSuspenseQuery({
    queryKey: ["scene", id],
    queryFn: async () => {
      if (!id) return null;
      return await fetcher<ExcalidrawInitialDataState>(API.board.getScene(id));
    },
  });
}
