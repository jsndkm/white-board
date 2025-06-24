"use client";

import ExcalidrawClient from "@/components/excalidraw-client";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";

export default function Page() {
  useAuthRedirect();
  return <ExcalidrawClient />;
}
