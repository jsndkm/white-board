import { GetSceneEndpoint, UpdateSceneEndpoint } from "@/lib/api/endpoint";
import { fetcher } from "@/lib/utils";
import { NonDeletedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types";

export type ExcalidrawScene = {
  elements: NonDeletedExcalidrawElement[];
  appState: ExcalidrawInitialDataState["appState"];
  files: ExcalidrawInitialDataState["files"];
};

export const getScene = async (projectId: number) => {
  return await fetcher<ExcalidrawScene>(GetSceneEndpoint(projectId));
};

export const updateScene = async (projectId: number) => {
  await fetcher<null>(UpdateSceneEndpoint(projectId), {
    method: "POST",
  });
};
