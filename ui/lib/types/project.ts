import { ExcalidrawElementSkeleton } from "@excalidraw/excalidraw/data/transform";
import { AppState, BinaryFiles } from "@excalidraw/excalidraw/types";

export type CreateProjectRespData = {
  id: number;
};

export type Project = {
  id: number;
  name: string;
  description: string;
  admin: boolean;
  image: string;
};

export type ProjectDetail = {
  id: number;
  name: string;
  description: string;
  image: string;
  user: [
    {
      username: string;
      admin: boolean;
    },
  ];
};

export type Scene = {
  elements: ExcalidrawElementSkeleton[];
  appState: AppState;
  files: BinaryFiles;
};
