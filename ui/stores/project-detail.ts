import { Project } from "@/lib/types/project";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProjectDetailsState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  project: Project | null;
  setProject: (project: Project) => void;
  openDialog: (project?: Project) => void;
}

export const useProjectDetailsStore = create<ProjectDetailsState>()(
  persist(
    (set) => ({
      isOpen: false,
      setIsOpen: (isOpen: boolean) => set({ isOpen }),
      project: null,
      setProject: (project: Project) => set({ project }),
      openDialog: (project?: Project) => {
        if (!project) set({ isOpen: true });
        else set({ isOpen: true, project: project });
      },
    }),
    {
      name: "project-details-store",
      partialize: (state) => ({ project: state.project }),
    },
  ),
);
