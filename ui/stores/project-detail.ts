import { Project } from "@/lib/types/project";
import { create } from "zustand";

interface ProjectDetailsState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  project: Project | null;
  openDialog: (project: Project) => void;
}

export const useProjectDetailsStore = create<ProjectDetailsState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => {
    if (isOpen) set({ isOpen });
    else set({ isOpen, project: null });
  },
  project: null,
  openDialog: (project: Project) => set({ isOpen: true, project: project }),
}));
