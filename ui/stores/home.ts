import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HomeState {
  selectedTab: string;
  setSelectedTab: (name: string) => void;
  selectedProjectId: number;
  setSelectedProjectId: (id: number) => void;
  newProjectDialogOpen: boolean;
  setNewProjectDialogOpen: (status: boolean) => void;
  projectDetailsDialogOpen: boolean;
  setProjectDetailsDialogOpen: (status: boolean) => void;
}

export const useHomeStore = create<HomeState>()(
  persist(
    (set) => ({
      selectedTab: "new-project",
      setSelectedTab: (name) => set({ selectedTab: name }),
      selectedProjectId: 0,
      setSelectedProjectId: (id: number) => set({ selectedProjectId: id }),
      newProjectDialogOpen: false,
      setNewProjectDialogOpen: (status: boolean) =>
        set({ newProjectDialogOpen: status }),
      projectDetailsDialogOpen: false,
      setProjectDetailsDialogOpen: (status: boolean) =>
        set({ projectDetailsDialogOpen: status }),
    }),
    {
      name: "home-store",
      partialize: (state) => ({
        selectedTab: state.selectedTab,
      }),
    },
  ),
);
