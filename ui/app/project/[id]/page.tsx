"use client";

import { OnUserFollowedPayload, useWebSocket } from "@/hooks/use-websocket";
import { LoaderCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useParams, useSearchParams } from "next/navigation";

const ExcalidrawWrapper = dynamic(
  () => import("@/components/scene/excalidraw-wrapper"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
        <LoaderCircle className="animate-spin" />
        <span className="text-lg">首次加载需要较长时间...</span>
      </div>
    ),
  },
);
export default function Page() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");

  const { send } = useWebSocket("ws://localhost:3002", {
    "init-room": () => {
      console.log("[WS] init-room received");
    },
    "first-in-room": () => {
      console.log("[WS] I'm the first in room");
    },
    "new-user": (socketId) => {
      console.log("[WS] new user joined:", socketId);
    },
    "room-user-change": (socketIds) => {
      console.log("[WS] room members:", socketIds);
    },
    "client-broadcast": (data, iv) => {
      // 接收协作数据并解密处理（略）
      console.log("[WS] received broadcast", data, iv);
    },
    "user-follow-room-change": (followers) => {
      console.log("[WS] I'm followed by:", followers);
    },
    "broadcast-unfollow": () => {
      console.log("[WS] all followers left");
    },
  });

  // 示例发送函数，可在 UI 或 Excalidraw onChange 中触发
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const sendRoomJoin = () => {
    if (!roomId) return;
    send("join-room", roomId);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const sendDrawData = (data: string, iv: string) => {
    send("server-broadcast", [data, iv]);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const sendFollow = (payload: OnUserFollowedPayload) => {
    send("user-follow", payload);
  };

  const params = useParams();
  const projectId = Number(params.id);

  return <ExcalidrawWrapper projectId={projectId} />;
}
