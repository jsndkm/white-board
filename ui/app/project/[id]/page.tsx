"use client";

import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { fetcher } from "@/lib/api";
import { GetProjectDetailEndpoint } from "@/lib/api/endpoint";
import { ProjectDetail } from "@/lib/api/project";
import { useHomeStore } from "@/stores/home";
import { useProjectStore } from "@/stores/project";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import useSWR from "swr";

const ExcalidrawWrapper = dynamic(
  () => import("@/components/excalidraw-wrapper"),
  {
    ssr: false,
  },
);
export default function Page() {
  useAuthRedirect();

  const { data } = useSWR(
    GetProjectDetailEndpoint(useHomeStore.getState().selectedProject?.id || 0),
    fetcher<ProjectDetail>,
  );

  useEffect(() => {
    if (!data) return;
    useProjectStore.getState().setProject(data);
  }, [data]);

  return <ExcalidrawWrapper />;
}
