import { deleteProject, ProjectDetail } from "@/lib/api/project";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProjectState {
  projectDetail: ProjectDetail | null;
  setProject: (projectDetail: ProjectDetail) => void;
  newProjectStatus: "idle" | "success" | "failed" | "invalid_data";
  resetStatus: () => void;
  deleteProjectAction: (id: number) => Promise<void>;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projectDetail: null,
      setProject: (project: ProjectDetail | null) =>
        set({ projectDetail: project }),
      newProjectStatus: "idle",
      resetStatus: () => set({ newProjectStatus: "idle" }),
      deleteProjectAction: async (id: number) => {
        await deleteProject(id);
      },
    }),
    {
      name: "project-store",
      partialize: (state) => ({
        projectDetail: state.projectDetail,
      }),
    },
  ),
);
