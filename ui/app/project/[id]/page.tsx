"use client";

import { useGetProject } from "@/hooks/use-get-project";
import { useProjectStore } from "@/stores/project";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const ExcalidrawWrapper = dynamic(
  () => import("@/components/excalidraw-wrapper"),
  {
    ssr: false,
  },
);
export default function Page() {
  const params = useParams();
  const projectId = Number(params.id);

  const { data: projectDetail } = useGetProject(projectId);
  
  useEffect(() => {
    if (!projectDetail) return;
    useProjectStore.getState().setProject(projectDetail);
  }, [projectDetail]);

  return <ExcalidrawWrapper projectId={projectId} />;
}
