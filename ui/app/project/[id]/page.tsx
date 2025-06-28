"use client";

import { LoaderCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const ExcalidrawWrapper = dynamic(
  () => import("@/components/excalidraw-wrapper"),
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
  const params = useParams();
  const projectId = Number(params.id);

  return <ExcalidrawWrapper projectId={projectId} />;
}
