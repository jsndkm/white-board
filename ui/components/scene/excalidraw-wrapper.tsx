"use client";

import { ProjectDialog } from "@/components/common/project-dialog";
import ExcalidrawMenu from "@/components/scene/excalidraw-menu";
import {
  DisconnectData,
  InitRoomData,
  RoomUserChangeData,
  ServerBroadcastData,
  ServerPointerBroadcast,
  useWebSocketClient,
} from "@/hooks/use-websocket";
import { WEBSOCKET_URL } from "@/lib/endpoint";
import { Excalidraw } from "@excalidraw/excalidraw";
import type { OrderedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import "@excalidraw/excalidraw/index.css";
import {
  AppState,
  BinaryFiles,
  Collaborator,
  CollaboratorPointer,
  ExcalidrawImperativeAPI,
  Gesture,
  SocketId,
} from "@excalidraw/excalidraw/types";
import { LoaderCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { Suspense, useEffect, useMemo, useState } from "react";

export default function ExcalidrawWrapper({
  mode,
  projectId,
}: {
  mode: "create" | "open";
  projectId: number;
}) {
  const { data: session } = useSession();
  const username = session?.user.username;

  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  const [roomId, setRoomId] = useState<string | null>(null);
  const [collaborators, setCollaborators] = useState(
    new Map<SocketId, Collaborator>(),
  );

  const handles = useMemo(
    () => ({
      "init-room": (data: InitRoomData) => {
        setRoomId(data.roomId);
      },
      "room-user-change": (data: RoomUserChangeData) => {
        const newCollaborators = new Map(collaborators);
        if (data.action === "join")
          newCollaborators.set(data.userName as SocketId, {} as Collaborator);
        else newCollaborators.delete(data.userName as SocketId);
        setCollaborators(newCollaborators);
      },
      "server-broadcast": (data: ServerBroadcastData) => {
        const { elements, appState } = data;
        excalidrawAPI?.updateScene({
          elements: elements as readonly OrderedExcalidrawElement[],
          appState,
        });
      },
      "server-pointer-broadcast": (data: ServerPointerBroadcast) => {
        const { users } = data;
        const newCollaborators = new Map<SocketId, Collaborator>();
        users.forEach((user) => {
          newCollaborators.set(user.username as SocketId, {
            id: user.username as SocketId,
            pointer: {
              x: user.x,
              y: user.y,
            } as CollaboratorPointer,
            username: user.username,
          });
        });
        setCollaborators(newCollaborators);
      },
      disconnect: (data: DisconnectData) => {
        console.log("[WebSocket] Disconnected:", data);
      },
    }),
    [collaborators, excalidrawAPI],
  );

  const client = useWebSocketClient(WEBSOCKET_URL, handles);

  useEffect(() => {
    if (!roomId) return;
    client.joinRoom(roomId);
  }, [client, roomId]);

  useEffect(() => {
    excalidrawAPI?.updateScene({ collaborators });
  }, [collaborators, excalidrawAPI]);

  const handleChange = (
    elements: readonly OrderedExcalidrawElement[],
    appState: AppState,
    files: BinaryFiles,
  ) => {
    if (!roomId) return;
    client.broadcast({ roomId, elements, appState, files });
  };

  const handlePointerUpdate = (payload: {
    pointer: {
      x: number;
      y: number;
      tool: "pointer" | "laser";
    };
    button: "down" | "up";
    pointersMap: Gesture["pointers"];
  }) => {
    if (!roomId) return;
    client.pointerBroadcast({
      roomId,
      x: payload.pointer.x,
      y: payload.pointer.y,
      username: username ?? "",
    });
  };

  return (
    <div className="custom-styles h-screen w-screen">
      <Suspense
        fallback={
          <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
            <LoaderCircle className="animate-spin" />
            <span className="text-lg">首次加载需要较长时间...</span>
          </div>
        }
      >
        <Excalidraw
          langCode="zh-CN"
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
          initialData={() => {
            if (mode == "create") return null;
            return null;
          }}
          onChange={handleChange}
          onPointerUpdate={handlePointerUpdate}
          isCollaborating={true}
        >
          <ExcalidrawMenu projectId={projectId} />
          <ProjectDialog />
        </Excalidraw>
      </Suspense>
    </div>
  );
}
