import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HomeState {
  selectedTab: string;
  setSelectedTab: (name: string) => void;
}

export const useHomeStore = create<HomeState>()(
  persist(
    (set) => ({
      selectedTab: "new-project",
      setSelectedTab: (name) => set({ selectedTab: name }),
    }),
    {
      name: "home-store",
      partialize: (state) => ({
        selectedTab: state.selectedTab,
      }),
    },
  ),
);
