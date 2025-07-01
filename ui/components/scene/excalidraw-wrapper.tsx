"use client";

import { ProjectDialog } from "@/components/common/project-dialog";
import ExcalidrawMenu from "@/components/scene/excalidraw-menu";
import { useGetProjectScene } from "@/hooks/api/project/use-get-project-scene";
import {
  DisconnectData,
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
  projectId,
}: {
  projectId: number;
}) {
  const { data: session } = useSession();
  const username = session?.user.username;

  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  const { data: scene, isError } = useGetProjectScene(projectId);

  const [collaborators, setCollaborators] = useState(
    new Map<SocketId, Collaborator>(),
  );
  const handles = useMemo(
    () => ({
      "init-room": () => {},
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
      "dis-connect": (data: DisconnectData) => {
        console.log("[WebSocket] Disconnected:", data);
      },
    }),
    [collaborators, excalidrawAPI],
  );
  const client = useWebSocketClient(WEBSOCKET_URL, handles, {
    projectId,
    username: username ?? "",
  });

  useEffect(() => {
    excalidrawAPI?.updateScene({ collaborators });
  }, [collaborators, excalidrawAPI]);

  const handleChange = (
    elements: readonly OrderedExcalidrawElement[],
    appState: AppState,
    files: BinaryFiles,
  ) => {
    if (!projectId) return;
    client.broadcast({ projectId, elements, appState, files });
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
    if (!projectId) return;
    client.pointerBroadcast({
      projectId,
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
          initialData={isError ? null : scene}
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
