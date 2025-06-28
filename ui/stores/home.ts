import { Project } from "@/lib/api/project";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HomeState {
  isHydrated: boolean;
  setIsHydrated: (isHydrated: boolean) => void;
  selectedTab: string;
  setSelectedTab: (name: string) => void;
  selectedProject: Project | null;
  setSelectedProject: (item: Project) => void;
  newProjectDialogOpen: boolean;
  setNewProjectDialogOpen: (status: boolean) => void;
  projectDetailsDrawerOpen: boolean;
  setProjectDetailsDrawerOpen: (status: boolean) => void;
}

export const useHomeStore = create<HomeState>()(
  persist(
    (set) => ({
      isHydrated: false,
      setIsHydrated: (isHydrated: boolean) => set({ isHydrated: isHydrated }),
      selectedTab: "new-project",
      setSelectedTab: (name) => set({ selectedTab: name }),
      selectedProject: null,
      setSelectedProject: (iterm: Project) => set({ selectedProject: iterm }),
      newProjectDialogOpen: false,
      setNewProjectDialogOpen: (status: boolean) =>
        set({ newProjectDialogOpen: status }),
      projectDetailsDrawerOpen: false,
      setProjectDetailsDrawerOpen: (status: boolean) =>
        set({ projectDetailsDrawerOpen: status }),
    }),
    {
      name: "home-store",
      partialize: (state) => ({
        selectedTab: state.selectedTab,
        selectedProject: state.selectedProject,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setIsHydrated(true);
      },
    },
  ),
);
