"use client";

import AppHeader from "@/components/app-header";
import { MyProject } from "@/components/my-project";
import { NewProject } from "@/components/new-project";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";

export default function Page() {
  useAuthRedirect();

  return (
    <div className="flex h-screen w-screen min-w-0 flex-col">
      <AppHeader />
      <main className="container mx-auto p-10">
        <Tabs defaultValue="new-project" className="w-full">
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
            <MyProject />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
