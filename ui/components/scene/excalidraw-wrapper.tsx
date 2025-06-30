"use client";

import { ProjectDialog } from "@/components/common/project-dialog";
import ExcalidrawMenu from "@/components/scene/excalidraw-menu";
import { useGetScene } from "@/hooks/api/use-get-scene";
import { Excalidraw, LiveCollaborationTrigger } from "@excalidraw/excalidraw";
import type { OrderedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import "@excalidraw/excalidraw/index.css";
import {
  AppState,
  BinaryFiles,
  ExcalidrawImperativeAPI,
  Gesture,
} from "@excalidraw/excalidraw/types";
import { LoaderCircle } from "lucide-react";
import { Suspense, useState } from "react";

export default function ExcalidrawWrapper({
  projectId,
}: {
  projectId: number;
}) {
  const [, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);

  const { data: initScene } = useGetScene(projectId);

  const handleChange = (
    elements: readonly OrderedExcalidrawElement[],
    appState: AppState,
    files: BinaryFiles,
  ) => {
    console.log("elements changed:", elements);
    console.log("appState changed:", appState);
    console.log("files changed:", files);
  };

  const handlePointerUpdate = (payload: {
    pointer: {
      x: number;
      y: number;
      tool: "pointer" | "laser";
    };
    button: "down" | "up";
    pointersMap: Gesture["pointers"];
  }) => {
    console.log("handlePointerUpdate", payload);
  };

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
          initialData={initScene}
          onChange={handleChange}
          onPointerUpdate={handlePointerUpdate}
          isCollaborating={true}
          renderTopRightUI={() => (
            <LiveCollaborationTrigger
              isCollaborating={true}
              onSelect={() => {
                window.alert("You clicked on collab button");
                // setIsCollaborating(true);
              }}
            />
          )}
        >
          <ExcalidrawMenu projectId={projectId} />
          <ProjectDialog />
        </Excalidraw>
      </Suspense>
    </div>
  );
}
