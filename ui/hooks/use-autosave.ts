// hooks/use-auto-save.ts
import { useSaveBoardMutation } from "@/hooks/api/board/use-save-board";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import React, { useEffect, useRef } from "react";

export function useAutoSave(
  excalidrawAPIRef: React.RefObject<ExcalidrawImperativeAPI | null>,
  projectId: number,
) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const saveMutation = useSaveBoardMutation();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      const api = excalidrawAPIRef.current;
      if (!api) return;
      saveMutation.mutate({ api, projectId });
    }, 10 * 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [excalidrawAPIRef, projectId, saveMutation]);
}
