import { ExcalidrawElementSkeleton } from "@excalidraw/excalidraw/data/transform";
import type { OrderedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { AppState, BinaryFiles } from "@excalidraw/excalidraw/types";

export type JoinRoomData = {
  projectId: number;
  username: string;
};

export type RoomUserChangeData = {
  projectId: string;
  userName: string;
  action: "join" | "leave";
};

export type ServerBroadcastData = {
  // elements: readonly OrderedExcalidrawElement[];
  elements: ExcalidrawElementSkeleton[];
  appState: AppState;
  files: BinaryFiles;
};

export type ClientBroadcastData = {
  projectId: number;
  elements: readonly OrderedExcalidrawElement[];
  appState: AppState;
  files: BinaryFiles;
};

export type ClientPointerBroadcastData = {
  projectId: number;
  username: string;
  x: number;
  y: number;
};

export type PointerData = {
  username: string;
  x: number;
  y: number;
};

export type ServerPointerBroadcast = {
  projectId: number;
  users: [
    {
      username: string;
      x: number;
      y: number;
    },
  ];
};

export type DisconnectData = {
  username: string;
};
