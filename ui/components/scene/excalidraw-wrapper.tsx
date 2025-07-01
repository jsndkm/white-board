"use client";

import { ProjectDialog } from "@/components/common/project-dialog";
import ExcalidrawMenu from "@/components/scene/excalidraw-menu";
import { useGetProjectScene } from "@/hooks/api/project/use-get-project-scene";
import { useCustomWebSocket } from "@/hooks/use-custom-websocket";
import { WEBSOCKET_URL } from "@/lib/endpoint";
import { RoomUserChangeData } from "@/lib/types/websocket";
import { useRoomState } from "@/stores/room";
import { Excalidraw } from "@excalidraw/excalidraw";
import type { OrderedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import "@excalidraw/excalidraw/index.css";
import {
  AppState,
  BinaryFiles,
  ExcalidrawImperativeAPI,
  Gesture,
} from "@excalidraw/excalidraw/types";
import { LoaderCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { Suspense, useEffect, useState } from "react";
import { ReadyState } from "react-use-websocket";

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
  const { collaborators } = useRoomState();

  const { readyState, sendJsonMessage } = useCustomWebSocket(WEBSOCKET_URL, {
    onRoomUserChange: (data: RoomUserChangeData) => {
      if (data.userName === username) {
        if (data.action === "join") {
          useRoomState.getState().addUser(data.userName);
        } else {
          useRoomState.getState().removeUser(data.userName);
        }
      }
    },
    onServerBroadcast: (data) => {
      const { elements, appState } = data;
      excalidrawAPI?.updateScene({
        elements: elements as readonly OrderedExcalidrawElement[],
        appState,
      });
    },
    onServerPointerBroadcast: (data) =>
      useRoomState.getState().updatePointers(data.users),
  });

  useEffect(() => {
    if (readyState === ReadyState.OPEN && username) {
      sendJsonMessage({
        type: "join-room",
        data: {
          projectId,
          username,
        },
      });
    }
  }, [projectId, readyState, sendJsonMessage, username]);

  const handleChange = (
    elements: readonly OrderedExcalidrawElement[],
    appState: AppState,
    files: BinaryFiles,
  ) => {
    sendJsonMessage({
      type: "client-broadcast",
      data: {
        projectId,
        elements,
        appState,
        files,
      },
    });
  };

  const handlePointerUpdate = (payload: {
    pointer: { x: number; y: number; tool: "pointer" | "laser" };
    button: "down" | "up";
    pointersMap: Gesture["pointers"];
  }) => {
    sendJsonMessage({
      type: "client-pointer-broadcast",
      data: {
        projectId: projectId,
        x: payload.pointer.x,
        y: payload.pointer.y,
        username,
      },
    });
  };

  useEffect(() => {
    excalidrawAPI?.updateScene({ collaborators });
  }, [collaborators, excalidrawAPI]);

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
