import { API } from "@/lib/endpoint";
import { exportToBlob } from "@excalidraw/excalidraw";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useSaveBoardMutation() {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useMutation({
    mutationFn: async ({
      api,
      projectId,
    }: {
      api: ExcalidrawImperativeAPI;
      projectId: number;
    }) => {
      const elements = api.getSceneElements();
      const appState = api.getAppState();
      const files = api.getFiles();

      const blob = await exportToBlob({
        elements,
        appState,
        files,
        mimeType: "image/png",
      });

      const image = await blobToBase64(blob);

      const payload = {
        elements,
        appState,
        files,
        image,
      };

      const res = await fetch(API.board.store(projectId), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("保存失败");
      return res;
    },
  });
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      if (typeof base64 === "string") resolve(base64);
      else reject(new Error("Base64 encoding failed"));
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
