"use client";

import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { redirect } from "next/navigation";

export default function Home() {
  useAuthRedirect();

  redirect("/new");
}
