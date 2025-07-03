"use client";

import { ProjectDialog } from "@/components/common/project-dialog";
import ExcalidrawMenu from "@/components/scene/excalidraw-menu";
import { useGetProjectScene } from "@/hooks/api/project/use-get-project-scene";
import { useCustomWebSocket } from "@/hooks/use-custom-websocket";
import { WEBSOCKET_URL } from "@/lib/endpoint";
import {
  RoomUserChangeData,
  ServerBroadcastData,
  ServerPointerBroadcast,
} from "@/lib/types/websocket";
import { useRoomState } from "@/stores/room";
import {
  CaptureUpdateAction,
  convertToExcalidrawElements,
  Excalidraw,
} from "@excalidraw/excalidraw";
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
import { debounce, isEqual } from "lodash";
import { LoaderCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
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

  const skipChangeFrames = useRef(false);

  const onRoomUserChange = useCallback(
    (data: RoomUserChangeData) => {
      if (data.userName === username) {
        if (data.action === "join") {
          useRoomState.getState().addUser(data.userName);
        } else {
          useRoomState.getState().removeUser(data.userName);
        }
      }
    },
    [username],
  );

  const onServerBroadcast = useCallback(
    (data: ServerBroadcastData) => {
      const elements = data.elements ?? [];
      const appState = data.appState ?? {};
      const currentElements =
        excalidrawAPI?.getSceneElementsIncludingDeleted() ?? [];
      const currentAppState = excalidrawAPI?.getAppState() ?? {};

      const shouldUpdate =
        !isEqual(currentElements, elements) ||
        !isEqual(currentAppState, appState);

      if (shouldUpdate) {
        skipChangeFrames.current = true;

        excalidrawAPI?.updateScene({
          elements: convertToExcalidrawElements(elements),
          appState,
          captureUpdate: CaptureUpdateAction.NEVER,
        });
      }
    },
    [excalidrawAPI],
  );

  const onServerPointerBroadcast = useCallback(
    (data: ServerPointerBroadcast) => {
      const users = data.users;
      const newMap = new Map<SocketId, Collaborator>();
      users
        .filter((user) => user.username !== username)
        .forEach((user) => {
          newMap.set(user.username as SocketId, {
            pointer: {
              x: user.x,
              y: user.y,
            } as CollaboratorPointer,
            username: user.username,
          });
        });
      excalidrawAPI?.updateScene({ collaborators: newMap });
    },
    [excalidrawAPI, username],
  );

  const { readyState, sendJsonMessage } = useCustomWebSocket(WEBSOCKET_URL, {
    onRoomUserChange: onRoomUserChange,
    onServerBroadcast: onServerBroadcast,
    onServerPointerBroadcast: onServerPointerBroadcast,
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

  useEffect(() => {
    const handleLeave = () => {
      if (readyState === ReadyState.OPEN && username) {
        sendJsonMessage({
          type: "disconnecting",
          data: {
            projectId,
            username,
          },
        });
      }
    };

    // 浏览器关闭、刷新等
    window.addEventListener("beforeunload", handleLeave);

    // Next.js 切换路由（返回主页等）
    const handleRouteChange = () => handleLeave();
    window.addEventListener("pagehide", handleRouteChange); // 更兼容的方式

    return () => {
      handleLeave();
      window.removeEventListener("beforeunload", handleLeave);
      window.removeEventListener("pagehide", handleRouteChange);
    };
  }, [projectId, readyState, sendJsonMessage, username]);

  const handleChange = (
    elements: readonly OrderedExcalidrawElement[],
    appState: AppState,
    files: BinaryFiles,
  ) => {
    if (skipChangeFrames.current) {
      skipChangeFrames.current = false;
      return; // 防止重复更新
    }

    sendJsonMessage({
      type: "client-broadcast",
      data: {
        projectId,
        username,
        elements,
        appState,
        files,
      },
      timestamp: Date.now(),
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
        projectId,
        username,
        x: payload.pointer.x,
        y: payload.pointer.y,
      },
      timestamp: Date.now(),
    });
  };

  const debounceHandleChange = debounce(handleChange, 200);
  const debounceHandlePointerUpdate = debounce(handlePointerUpdate, 200);

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
          initialData={
            isError
              ? null
              : {
                  elements: scene?.elements ?? [],
                  appState: scene?.appState ?? {},
                  scrollToContent: true,
                }
          }
          onChange={debounceHandleChange}
          onPointerUpdate={debounceHandlePointerUpdate}
          isCollaborating={true}
        >
          <ExcalidrawMenu projectId={projectId} />
          <ProjectDialog />
        </Excalidraw>
      </Suspense>
    </div>
  );
}
