"use client";

import { GetProjectDetailEndpoint } from "@/lib/api/endpoint";
import { ProjectDetail } from "@/lib/api/project";
import { fetcher } from "@/lib/utils";
import { useHomeStore } from "@/stores/home";
import { useProjectStore } from "@/stores/project";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

const ExcalidrawWrapper = dynamic(
  () => import("@/components/excalidraw-wrapper"),
  {
    ssr: false,
  },
);
export default function Page({}) {
  const params = useParams();
  const projectId = Number(params.id);

  const { data } = useSWR(
    GetProjectDetailEndpoint(useHomeStore.getState().selectedProject?.id || 0),
    fetcher<ProjectDetail>,
  );

  useEffect(() => {
    if (!data) return;
    useProjectStore.getState().setProject(data);
  }, [data]);

  return <ExcalidrawWrapper projectId={projectId} />;
}
