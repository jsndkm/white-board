"use client";

import { ProjectDialog } from "@/components/common/project-dialog";
import ExcalidrawMenu from "@/components/scene/excalidraw-menu";
import { useGetProjectScene } from "@/hooks/api/project/use-get-project-scene";
import {
  MessageType,
  PointerData,
  useStableWebSocket,
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
import { Suspense, useEffect, useState } from "react";

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

  const [, setCollaborators] = useState(new Map<SocketId, Collaborator>());
  const { socket, connected, send } = useStableWebSocket(WEBSOCKET_URL);

  // ✅ 初始化 + 监听消息
  useEffect(() => {
    if (!connected || !socket.current) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const { type, data } = JSON.parse(event.data);

        switch (type as MessageType) {
          case "init-room":
            break;
          case "room-user-change":
            setCollaborators((prev) => {
              const newMap = new Map(prev);
              if (data.action === "join")
                newMap.set(data.userName, {} as Collaborator);
              else newMap.delete(data.userName);
              return newMap;
            });
            break;
          case "server-broadcast":
            excalidrawAPI?.updateScene({
              elements: data.elements,
              appState: data.appState,
            });
            break;
          case "server-pointer-broadcast":
            const newCollaborators = new Map<SocketId, Collaborator>();
            data.users.forEach((user: PointerData) => {
              newCollaborators.set(user.username as SocketId, {
                id: user.username,
                pointer: { x: user.x, y: user.y } as CollaboratorPointer,
                username: user.username,
              });
            });
            setCollaborators(newCollaborators);
            break;
          case "dis-connect":
            console.log("[WebSocket] disconnect", data);
            break;
        }
      } catch (e) {
        console.warn("[WebSocket] Invalid message", e);
      }
    };

    socket.current.addEventListener("message", handleMessage);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      socket.current?.removeEventListener("message", handleMessage);
    };
  }, [connected, socket, excalidrawAPI]);

  useEffect(() => {
    if (connected && username) {
      send("join-room", { projectId, username });
    }
  }, [connected, username, projectId, send]);

  const handleChange = (
    elements: readonly OrderedExcalidrawElement[],
    appState: AppState,
    files: BinaryFiles,
  ) => {
    send("client-broadcast", { projectId, elements, appState, files });
  };

  const handlePointerUpdate = (payload: {
    pointer: { x: number; y: number; tool: "pointer" | "laser" };
    button: "down" | "up";
    pointersMap: Gesture["pointers"];
  }) => {
    send("client-pointer-broadcast", {
      projectId,
      x: payload.pointer.x,
      y: payload.pointer.y,
      username,
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
