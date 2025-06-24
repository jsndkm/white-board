"use client";

import "@excalidraw/excalidraw/index.css";
import dynamic from "next/dynamic";

const Excalidraw = dynamic(
  () => import("@excalidraw/excalidraw").then((mod) => mod.Excalidraw),
  { ssr: false },
);

export default function ExcalidrawClient() {
  return (
    <div style={{ height: "100vh" }}>
      <Excalidraw langCode="zh-CN" />
    </div>
  );
}
