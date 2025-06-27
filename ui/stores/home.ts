import { MyProjectListItem } from "@/lib/api/project";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HomeState {
  isHydrated: boolean;
  setIsHydrated: (isHydrated: boolean) => void;
  selectedTab: string;
  setSelectedTab: (name: string) => void;
  selectedProject?: MyProjectListItem;
  setSelectedProject: (item: MyProjectListItem) => void;
  newProjectDialogOpen: boolean;
  setNewProjectDialogOpen: (status: boolean) => void;
  projectDetailsDialogOpen: boolean;
  setProjectDetailsDialogOpen: (status: boolean) => void;
}

export const useHomeStore = create<HomeState>()(
  persist(
    (set) => ({
      isHydrated: false,
      setIsHydrated: (isHydrated: boolean) => set({ isHydrated: isHydrated }),
      selectedTab: "new-project",
      setSelectedTab: (name) => set({ selectedTab: name }),
      setSelectedProject: (iterm: MyProjectListItem) =>
        set({ selectedProject: iterm }),
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
      onRehydrateStorage: () => (state) => {
        state?.setIsHydrated(true);
      },
    },
  ),
);
