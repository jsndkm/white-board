"use client";

import "./globals.css";
import { GlobalConfirmDialog } from "@/components/confirm-dialog";
import { DeleteProjectAlert } from "@/components/delete-project-alert";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import React, { useState } from "react";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SessionProvider>{children}</SessionProvider>
            <Toaster position="top-center" richColors />
            <DeleteProjectAlert />
            <GlobalConfirmDialog />
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
