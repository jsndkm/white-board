import { useEffect, useRef } from "react";

export type OnUserFollowedPayload = {
  userToFollow: {
    socketId: string;
    username: string;
  };
  action: "FOLLOW" | "UNFOLLOW";
};

type WebSocketHandlers = {
  "init-room"?: () => void;
  "first-in-room"?: () => void;
  "new-user"?: (socketId: string) => void;
  "room-user-change"?: (socketIds: string[]) => void;
  "client-broadcast"?: (encryptedData: string, iv: string) => void;
  "user-follow-room-change"?: (followers: string[]) => void;
  "broadcast-unfollow"?: () => void;
};

export const useWebSocket = (url: string, handlers: WebSocketHandlers) => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const { type, data } = message;

        switch (type) {
          case "init-room":
            handlers["init-room"]?.();
            break;
          case "first-in-room":
            handlers["first-in-room"]?.();
            break;
          case "new-user":
            handlers["new-user"]?.(data);
            break;
          case "room-user-change":
            handlers["room-user-change"]?.(data);
            break;
          case "client-broadcast":
            if (Array.isArray(data) && data.length === 2) {
              handlers["client-broadcast"]?.(data[0], data[1]);
            }
            break;
          case "user-follow-room-change":
            handlers["user-follow-room-change"]?.(data);
            break;
          case "broadcast-unfollow":
            handlers["broadcast-unfollow"]?.();
            break;
          default:
            console.warn("Unhandled message type:", type);
        }
      } catch (err) {
        console.error("Failed to parse WebSocket message:", event.data, err);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
    };

    socket.onerror = (err) => {
      console.error("WebSocket error", err);
    };

    return () => {
      socket.close();
    };
  }, [url]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const send = (type: string, data?: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({ type, ...(data !== undefined ? { data } : {}) }),
      );
    } else {
      console.warn("WebSocket is not open. Cannot send message:", type);
    }
  };

  return { send };
};
