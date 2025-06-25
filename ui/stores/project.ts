import { ProjectInfo } from "@/lib/types/project";
import { create } from "zustand";

interface ProjectState {
  projectList: ProjectInfo[];
}

export const useProjectStore = create<ProjectState>(() => ({
  projectList: [],
}));
