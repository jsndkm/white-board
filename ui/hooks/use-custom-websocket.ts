import {
  DisconnectData,
  RoomUserChangeData,
  ServerBroadcastData,
  ServerPointerBroadcast,
} from "@/types/websocket";
import { useEffect } from "react";
import useWebSocket from "react-use-websocket";

export function useCustomWebSocket(
  url: string,
  options: {
    onInitRoom?: () => void;
    onRoomUserChange?: (data: RoomUserChangeData) => void;
    onServerBroadcast?: (data: ServerBroadcastData) => void;
    onServerPointerBroadcast?: (data: ServerPointerBroadcast) => void;
    onDisconnect?: (data: DisconnectData) => void;
  },
) {
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(url, {
    share: true,
    shouldReconnect: () => true,
    onOpen: () => console.log("[WS] connected"),
    onClose: () => console.log("[WS] closed"),
    onError: (e) => console.error("[WS] error", e),
  });

  useEffect(() => {
    if (lastJsonMessage) {
      const { type, data } = lastJsonMessage as {
        type: string;
        data:
          | RoomUserChangeData
          | ServerBroadcastData
          | ServerPointerBroadcast
          | DisconnectData;
      };
      switch (type) {
        case "init-room":
          options.onInitRoom?.();
          break;
        case "room-user-change":
          options.onRoomUserChange?.(data as RoomUserChangeData);
          break;
        case "server-broadcast":
          options.onServerBroadcast?.(data as ServerBroadcastData);
          break;
        case "server-pointer-broadcast":
          options.onServerPointerBroadcast?.(data as ServerPointerBroadcast);
          break;
        case "disconnect":
          options.onDisconnect?.(data as DisconnectData);
          break;
        default:
          console.warn("[WS] Unknown type:", type);
      }
    }
  }, [
    lastJsonMessage,
    options.onInitRoom,
    options.onRoomUserChange,
    options.onServerBroadcast,
    options.onServerPointerBroadcast,
    options.onDisconnect,
    options,
  ]);

  return {
    readyState,
    sendJsonMessage,
  };
}
