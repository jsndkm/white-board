import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProjectDetailsState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  projectId?: number;
  openDialog: (projectId?: number) => void;
}

export const useProjectDetailsStore = create<ProjectDetailsState>()(
  persist(
    (set) => ({
      isOpen: false,
      setIsOpen: (isOpen: boolean) => set({ isOpen }),
      openDialog: (projectId?: number) => {
        if (!projectId) set({ isOpen: true });
        else set({ isOpen: true, projectId: projectId });
      },
    }),
    {
      name: "project-details-store",
      partialize: () => {},
    },
  ),
);
