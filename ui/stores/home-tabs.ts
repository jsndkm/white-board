import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HomeTabsState {
  isHydrated: boolean;
  setIsHydrated: (isHydrated: boolean) => void;
  selectedTab: string;
  setSelectedTab: (name: string) => void;
}

export const useHomeTabsStore = create<HomeTabsState>()(
  persist(
    (set) => ({
      isHydrated: false,
      setIsHydrated: (isHydrated: boolean) => set({ isHydrated: isHydrated }),
      selectedTab: "new-project",
      setSelectedTab: (name) => set({ selectedTab: name }),
      selectedProject: null,
    }),
    {
      name: "home-tab-store",
      partialize: (state) => ({
        selectedTab: state.selectedTab,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setIsHydrated(true);
      },
    },
  ),
);
