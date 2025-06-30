"use client";

import "./globals.css";
import { GlobalConfirmDialog } from "@/components/common/confirm-dialog";
import { ThemeProvider } from "@/components/common/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
            <GlobalConfirmDialog />
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
