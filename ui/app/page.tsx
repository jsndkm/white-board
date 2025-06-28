"use client";

import AppHeader from "@/components/home/app-header";
import { TabMyProject } from "@/components/home/tab-my-project";
import { TabNewProject } from "@/components/home/tab-new-project";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHomeTabsStore } from "@/stores/home-tabs";
import { LoaderCircle } from "lucide-react";

export default function Page() {
  const selectedTab = useHomeTabsStore((state) => state.selectedTab);
  const setSelectedTab = useHomeTabsStore((state) => state.setSelectedTab);
  const isHydrated = useHomeTabsStore((state) => state.isHydrated);

  if (!isHydrated)
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderCircle className="text-muted-foreground h-6 w-6 animate-spin" />
      </div>
    );

  return (
    <div className="flex h-screen w-screen min-w-0 flex-col">
      <AppHeader />
      <main className="container mx-auto p-10">
        <Tabs
          className="w-full"
          value={selectedTab}
          onValueChange={setSelectedTab}
        >
          <TabsList className="mx-auto h-15 w-70">
            <TabsTrigger value="new-project" className="cursor-pointer">
              新建项目
            </TabsTrigger>
            <TabsTrigger value="my-project" className="cursor-pointer">
              我的项目
            </TabsTrigger>
          </TabsList>
          <TabsContent value="new-project">
            <TabNewProject />
          </TabsContent>
          <TabsContent value="my-project">
            <TabMyProject showDetailButton={true} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
