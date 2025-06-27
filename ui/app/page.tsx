"use client";

import AppHeader from "@/components/app-header";
import { ProjectDetailDrawer } from "@/components/home/project-detail-drawer";
import { MyProjectContainer } from "@/components/my-project-container";
import { NewProject } from "@/components/new-project";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { useHomeStore } from "@/stores/home";
import { Loader } from "lucide-react";

export default function Page() {
  useAuthRedirect();

  const selectedTab = useHomeStore((state) => state.selectedTab);
  const setSelectedTab = useHomeStore((state) => state.setSelectedTab);
  const isHydrated = useHomeStore((state) => state.isHydrated);

  if (!isHydrated)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="text-muted-foreground h-6 w-6 animate-spin" />
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
            <NewProject />
          </TabsContent>
          <TabsContent value="my-project">
            <MyProjectContainer showDetailButton={true} />
          </TabsContent>
        </Tabs>
        <ProjectDetailDrawer />
      </main>
    </div>
  );
}
