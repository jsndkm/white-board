"use client";

import { ProjectDetailSheet } from "@/components/common/project-detail-sheet";
import { ProjectDialog } from "@/components/common/project-dialog";
import ExcalidrawMenu from "@/components/scene/excalidraw-menu";
import { useSaveBoardMutation } from "@/hooks/api/board/use-save-board";
import { useGetProjectScene } from "@/hooks/api/project/use-get-project-scene";
import { useAutoSave } from "@/hooks/use-autosave";
import { useCustomWebSocket } from "@/hooks/use-custom-websocket";
import { WEBSOCKET_URL } from "@/lib/endpoint";
import {
  DisconnectData,
  RoomUserChangeData,
  ServerBroadcastData,
  ServerPointerBroadcast,
} from "@/lib/types/websocket";
import { useBoardStore } from "@/stores/board";
import {
  CaptureUpdateAction,
  Excalidraw,
  restoreElements,
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
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useRef } from "react";
import { ReadyState } from "react-use-websocket";

export default function ExcalidrawWrapper({
  projectId,
}: {
  projectId: number;
}) {
  const { data: session } = useSession();
  const username = session?.user.username;
  const excalidrawAPIRef = useRef<ExcalidrawImperativeAPI>(null);
  const pathname = usePathname();

  const { data: scene, isError, isPending } = useGetProjectScene(projectId);
  const saveBoard = useSaveBoardMutation();

  const skipChangeFrames = useRef(0);
  const isDirty = useBoardStore((state) => state.isDirty);

  // ==================== WebSocket Handlers ====================
  const onRoomUserChange = useCallback(
    (data: RoomUserChangeData) => {
      if (data.userName === username) {
        if (data.action === "join") {
          useBoardStore.getState().addUser(data.userName);
        } else {
          useBoardStore.getState().removeUser(data.userName);
        }
      }
    },
    [username],
  );
  const onServerBroadcast = useCallback((data: ServerBroadcastData) => {
    const remoteElements = data.elements ?? [];
    const remoteAppState = data.appState ?? {};
    const localElements =
      excalidrawAPIRef.current?.getSceneElementsIncludingDeleted() ?? [];
    const localAppState = excalidrawAPIRef.current?.getAppState();

    if (
      localAppState?.newElement !== null ||
      localAppState?.multiElement !== null ||
      localAppState?.resizingElement !== null ||
      localAppState?.selectionElement !== null ||
      localAppState?.startBoundElement !== null
    ) {
      return;
    }

    // index Map
    const localMap = new Map(localElements.map((el) => [el.id, el]));

    // merge
    const mergedElements = remoteElements.map((remoteEl) => {
      const localEl = localMap.get(remoteEl.id);

      if (!localEl) return remoteEl;
      if (remoteEl.version > localEl.version) return remoteEl;

      return localEl;
    });

    const shouldUpdate =
      !isEqual(localElements, remoteElements) ||
      !isEqual(localAppState, remoteAppState);

    if (shouldUpdate) {
      skipChangeFrames.current += 1;
      excalidrawAPIRef.current?.updateScene({
        elements: restoreElements(mergedElements, localElements, {
          refreshDimensions: false,
          repairBindings: true,
        }),
        captureUpdate: CaptureUpdateAction.NEVER,
      });
    }
  }, []);
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
      excalidrawAPIRef.current?.updateScene({ collaborators: newMap });
    },
    [username],
  );
  const onDisconnect = useCallback((data: DisconnectData) => {
    console.log("disconnected:", data.username);
  }, []);

  const { readyState, sendJsonMessage } = useCustomWebSocket(WEBSOCKET_URL, {
    onRoomUserChange: onRoomUserChange,
    onServerBroadcast: onServerBroadcast,
    onServerPointerBroadcast: onServerPointerBroadcast,
    onDisconnect: onDisconnect,
  });

  // ==================== Join && Leave ====================
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
    const handleLeave = (event?: BeforeUnloadEvent) => {
      if (event && isDirty) {
        event.preventDefault();
        event.returnValue = "尚未保存，确定离开吗？";
      }

      const api = excalidrawAPIRef.current;
      if (api && isDirty) {
        saveBoard.mutate(
          { api, projectId },
          {
            onSettled: () => useBoardStore.getState().setIsDirty(false),
          },
        );
      }
    };

    window.addEventListener("beforeunload", handleLeave);
    return () => {
      window.removeEventListener("beforeunload", handleLeave);
    };
  }, [isDirty, projectId, saveBoard]);
  useEffect(() => {
    if (readyState === ReadyState.OPEN && username) {
      sendJsonMessage({
        type: "disconnecting",
        data: {
          projectId,
          username,
        },
      });
    }
  }, [pathname, projectId, readyState, sendJsonMessage, username]);

  // ==================== Handler Change ====================
  const handleChange = (
    elements: readonly OrderedExcalidrawElement[],
    appState: AppState,
    files: BinaryFiles,
  ) => {
    if (
      appState?.newElement !== null ||
      appState?.multiElement !== null ||
      appState?.resizingElement !== null ||
      appState?.selectionElement !== null ||
      appState?.startBoundElement !== null
    )
      useBoardStore.getState().setIsDirty(true);

    if (skipChangeFrames.current > 0) {
      skipChangeFrames.current -= 1;
      return;
    }

    sendJsonMessage({
      type: "client-broadcast",
      data: {
        projectId,
        username,
        elements,
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
  const debounceHandleChange = debounce(handleChange, 0);
  const debounceHandlePointerUpdate = debounce(handlePointerUpdate, 0);

  useAutoSave(excalidrawAPIRef, projectId);

  if (isPending)
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
        <LoaderCircle className="animate-spin" />
        <span className="text-lg">首次加载需要较长时间...</span>
      </div>
    );

  return (
    <div className="custom-styles h-screen w-screen">
      <Excalidraw
        langCode="zh-CN"
        // excalidrawAPI={(api) => setExcalidrawAPI(api)}
        excalidrawAPI={(api) => (excalidrawAPIRef.current = api)}
        UIOptions={{
          tools: {
            image: false,
          },
        }}
        initialData={
          isError
            ? null
            : {
                elements: restoreElements(scene.elements, [], {
                  refreshDimensions: false,
                  repairBindings: true,
                }),
                // elements: scene.elements ?? [],
                scrollToContent: true,
              }
        }
        onChange={debounceHandleChange}
        onPointerUpdate={debounceHandlePointerUpdate}
        isCollaborating={true}
      >
        <ExcalidrawMenu api={excalidrawAPIRef.current} projectId={projectId} />
        <ProjectDialog />
        <ProjectDetailSheet showOpenProjectButton={false} />
      </Excalidraw>
    </div>
  );
}
