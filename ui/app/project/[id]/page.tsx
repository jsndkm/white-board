"use client";

import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import dynamic from "next/dynamic";

const ExcalidrawWrapper = dynamic(
  () => import("@/components/excalidraw-wrapper"),
  {
    ssr: false,
  },
);
export default function Page() {
  useAuthRedirect();
  return <ExcalidrawWrapper />;
}
