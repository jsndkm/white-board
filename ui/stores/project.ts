import { fetcher } from "@/lib/api";
import { ProjectInfo } from "@/lib/api/project";
import { ENDPOINT } from "@/lib/constants";
import { z } from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const newProjectInfoSchema = z.object({
  name: z.string().min(2).max(12),
  description: z.string().min(5).max(30),
});

interface ProjectState {
  project: ProjectInfo | null;
  newProjectStatus:
    | "idle"
    | "in_progress"
    | "success"
    | "failed"
    | "invalid_data";
  resetStatus: () => void;
  createProject: (formData: FormData) => Promise<void>;
  deleteProject: (id: number | undefined) => Promise<void>;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      project: null,
      newProjectStatus: "idle",
      resetStatus: () => set({ newProjectStatus: "idle" }),
      createProject: async (formData) => {
        try {
          const validatedData = newProjectInfoSchema.parse({
            name: formData.get("name"),
            description: formData.get("description"),
          });

          const project = await fetcher<ProjectInfo>(ENDPOINT.CreateProject, {
            method: "POST",
            body: JSON.stringify({
              name: validatedData.name,
              description: validatedData.description,
            }),
          });

          set({ newProjectStatus: "success", project: project });
        } catch (error) {
          if (error instanceof z.ZodError) {
            set({ newProjectStatus: "invalid_data" });
          } else {
            set({ newProjectStatus: "failed" });
          }
        }
      },
      deleteProject: async (id: number | undefined) => {
        if (!id) return;
        await fetcher<ProjectInfo>(ENDPOINT.DeleteProject(id), {
          method: "DELETE",
        });
      },
    }),
    {
      name: "project-store",
      partialize: (state) => ({
        projectId: state.project?.id,
      }),
    },
  ),
);
