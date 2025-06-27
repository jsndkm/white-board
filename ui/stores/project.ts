import {
  createProject,
  deleteProject,
  MyProjectListItem,
} from "@/lib/api/project";
import { z } from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProjectState {
  project?: MyProjectListItem;
  newProjectStatus: "idle" | "success" | "failed" | "invalid_data";
  resetStatus: () => void;
  createProjectAction: (formData: FormData) => Promise<void>;
  deleteProjectAction: (id: number) => Promise<void>;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      project: undefined,
      newProjectStatus: "idle",
      resetStatus: () => set({ newProjectStatus: "idle" }),
      createProjectAction: async (formData) => {
        try {
          const project = await createProject(formData);
          set({ newProjectStatus: "success", project: project });
        } catch (error) {
          if (error instanceof z.ZodError) {
            set({ newProjectStatus: "invalid_data" });
          } else {
            set({ newProjectStatus: "failed" });
          }
        }
      },
      deleteProjectAction: async (id: number) => {
        await deleteProject(id);
      },
    }),
    {
      name: "project-store",
      partialize: (state) => ({
        project: state.project,
      }),
    },
  ),
);
