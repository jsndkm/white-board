"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const ExcalidrawWrapper = dynamic(
  () => import("@/components/scene/excalidraw-wrapper"),
  {
    ssr: false,
    loading: () => <></>,
  },
);

export default function Page() {
  const params = useParams();
  const projectId = Number(params.id);

  return <ExcalidrawWrapper projectId={projectId} />;
}
