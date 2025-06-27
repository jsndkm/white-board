import { createProject, deleteProject, ProjectDetail } from "@/lib/api/project";
import { useUserStore } from "@/stores/user";
import { z } from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProjectState {
  projectDetail: ProjectDetail | null;
  setProject: (projectDetail: ProjectDetail) => void;
  newProjectStatus: "idle" | "success" | "failed" | "invalid_data";
  resetStatus: () => void;
  createProjectAction: (formData: FormData) => Promise<void>;
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
      createProjectAction: async (formData) => {
        try {
          const project = await createProject(formData);

          const projectDetail: ProjectDetail = {
            id: project.id,
            name: project.name,
            description: project.description,
            user: [
              {
                username: useUserStore.getState().username ?? "Unknown",
                admin: true,
              },
            ],
          };

          set({ newProjectStatus: "success", projectDetail: projectDetail });
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
        projectDetail: state.projectDetail,
      }),
    },
  ),
);
