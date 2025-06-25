import { ENDPOINT } from "@/lib/constants";
import { ProjectInfo } from "@/lib/types/project";
import { Resp } from "@/lib/types/types";
import { fetcher } from "@/lib/utils";
import { create } from "zustand";

interface ProjectState {
  id: number;
  createProject: (name: string, description: string) => Promise<ProjectInfo>;
  deleteProject: (id: number) => Promise<void>;
}

export const useProjectStore = create<ProjectState>(() => ({
  id: 1,
  createProject: async (name: string, description: string) => {
    const resp = await fetcher<Resp<ProjectInfo>>(ENDPOINT.CreateProject, {
      method: "POST",
      body: JSON.stringify({ name, description }),
    });

    return resp.data;
  },
  deleteProject: async (id: number) => {
    await fetcher<Resp<ProjectInfo>>(ENDPOINT.DeleteProject(id), {
      method: "DELETE",
    });
  },
}));
