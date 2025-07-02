"use client";

import AppHeader from "@/components/home/app-header";
import { TabMyProject } from "@/components/home/tab-my-project";
import { TabNewProject } from "@/components/home/tab-new-project";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHomeTabsStore } from "@/stores/home-tabs";
import { AnimatePresence, motion } from "framer-motion";
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
      <main className="relative container mx-auto overflow-hidden p-10">
        <Tabs
          className="relative w-full overflow-hidden"
          value={selectedTab}
          onValueChange={setSelectedTab}
        >
          <TabsList className="bg-muted mx-auto h-12 w-fit gap-4 rounded-full p-1 shadow-sm">
            <TabsTrigger
              value="new-project"
              className="data-[state=active]:bg-primary cursor-pointer rounded-full px-4 py-1.5 transition-all data-[state=active]:text-white"
            >
              新建项目
            </TabsTrigger>
            <TabsTrigger
              value="my-project"
              className="data-[state=active]:bg-primary cursor-pointer rounded-full px-4 py-1.5 transition-all data-[state=active]:text-white"
            >
              我的项目
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {selectedTab === "new-project" && (
              <motion.div
                key="new-project"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TabNewProject />
              </motion.div>
            )}
            {selectedTab === "my-project" && (
              <motion.div
                key="my-project"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TabMyProject />
              </motion.div>
            )}
          </AnimatePresence>
        </Tabs>
      </main>
    </div>
  );
}
