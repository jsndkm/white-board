import type { OrderedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { AppState, BinaryFiles } from "@excalidraw/excalidraw/types";
// useStableWebSocket.ts
import { useCallback, useEffect, useRef, useState } from "react";

export type MessageType =
  | "init-room"
  | "join-room"
  | "room-user-change"
  | "server-broadcast"
  | "client-broadcast"
  | "server-pointer-broadcast"
  | "client-pointer-broadcast"
  | "dis-connecting"
  | "dis-connect";

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
  elements: readonly OrderedExcalidrawElement[];
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

type HandlerMap = Partial<{
  "init-room": () => void;
  "room-user-change": (data: RoomUserChangeData) => void;
  "server-broadcast": (data: ServerBroadcastData) => void;
  "server-pointer-broadcast": (data: ServerPointerBroadcast) => void;
  disconnect: (data: DisconnectData) => void;
}>;

export function useWebSocketClient(
  url: string,
  handlers: HandlerMap,
  joinRoomPayload?: JoinRoomData,
) {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("[WebSocket] connected");
      if (joinRoomPayload) {
        console.log("[WebSocket] Joining room with payload:", joinRoomPayload);
        socket.send(
          JSON.stringify({
            type: "join-room",
            data: joinRoomPayload,
            timestamp: Date.now(),
          }),
        );
      }
    };

    socket.onmessage = (event) => {
      try {
        const { type, data } = JSON.parse(event.data);
        if (!type) return;

        switch (type as MessageType) {
          case "init-room":
            handlers["init-room"]?.();
            break;
          case "room-user-change":
            handlers["room-user-change"]?.(data);
            break;
          case "server-broadcast":
            handlers["server-broadcast"]?.(data);
            break;
          case "server-pointer-broadcast":
            handlers["server-pointer-broadcast"]?.(data);
            break;
          case "dis-connect":
            handlers["disconnect"]?.(data);
            break;
          default:
            console.warn("[WebSocket] Unknown message type:", type);
        }
      } catch (err) {
        console.error("[WebSocket] Invalid message:", event.data, err);
      }
    };

    socket.onclose = () => {
      console.log("[WebSocket] connection closed");
    };

    socket.onerror = (e) => {
      console.error("[WebSocket] error", e);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [handlers, joinRoomPayload, url]);

  const send = (type: MessageType, data?: unknown) => {
    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type, data, timestamp: Date.now() }));
    } else {
      console.warn("[WebSocket] Not open. Can't send:", type);
    }
  };

  return {
    send,
    broadcast: (payload: ClientBroadcastData) => {
      if (socketRef.current?.readyState !== WebSocket.OPEN) return;
      send("client-broadcast", { ...payload });
    },
    pointerBroadcast: (payload: ClientPointerBroadcastData) => {
      if (socketRef.current?.readyState !== WebSocket.OPEN) return;
      send("client-pointer-broadcast", { ...payload });
    },
  };
}

export function useStableWebSocket(url: string) {
  const socketRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  const send = useCallback((type: string, data?: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({ type, data, timestamp: Date.now() }),
      );
    } else {
      console.warn("[WebSocket] Not open. Can't send:", type);
    }
  }, []);

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("[WebSocket] connected");
      setConnected(true);
    };
    socket.onclose = () => {
      console.log("[WebSocket] disconnected");
      setConnected(false);
    };
    socket.onerror = (e) => {
      console.error("[WebSocket] error", e);
    };

    return () => {
      socket.close();
    };
  }, [url]);

  return { socket: socketRef, connected, send };
}
