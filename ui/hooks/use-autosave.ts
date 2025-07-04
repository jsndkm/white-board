import { exportToBlob } from "@excalidraw/excalidraw";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import React, { useEffect, useRef } from "react";

export function useAutoSave(
  excalidrawAPIRef: React.RefObject<ExcalidrawImperativeAPI | null>,
  projectId: number,
) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      const api = excalidrawAPIRef.current;
      if (!api) return;

      const elements = api.getSceneElements();
      const appState = api.getAppState();
      const files = api.getFiles();
      const blob = exportToBlob({ elements, mimeType: "image/png" });

      const payload = {
        elements,
        appState,
        files,
        image: blobToBase64(blob),
      };

      fetch(`/api/project-board/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).then((res) => {
        if (!res.ok) console.warn("自动保存失败");
      });
    }, 30 * 1000); // 每30秒保存一次

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [excalidrawAPIRef, projectId]);
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64data = reader.result;
      if (typeof base64data === "string") {
        resolve(base64data);
      } else {
        reject(new Error("Base64 encoding failed"));
      }
    };

    reader.onerror = reject;

    reader.readAsDataURL(blob);
  });
}
