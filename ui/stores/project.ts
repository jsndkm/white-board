import { ProjectDetail } from "@/lib/types/project";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProjectState {
  projectDetail: ProjectDetail | null;
  setProject: (projectDetail: ProjectDetail) => void;
  newProjectStatus: "idle" | "success" | "failed" | "invalid_data";
  resetStatus: () => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projectDetail: null,
      setProject: (project: ProjectDetail | null) =>
        set({ projectDetail: project }),
      newProjectStatus: "idle",
      resetStatus: () => set({ newProjectStatus: "idle" }),
    }),
    {
      name: "project-store",
      partialize: (state) => ({
        projectDetail: state.projectDetail,
      }),
    },
  ),
);
