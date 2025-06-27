"use client";

import "./globals.css";
import { DeleteProjectDialog } from "@/components/scene/delete-project-dialog";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
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
            {children}
            <Toaster position="top-center" richColors />
            <DeleteProjectDialog />
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
