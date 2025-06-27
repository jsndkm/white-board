import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SceneState {
  isHydrated: boolean;
  setIsHydrated: (isHydrated: boolean) => void;
  newProjectDialogOpen: boolean;
  setNewProjectDialogOpen: (status: boolean) => void;
  openProjectDialogOpen: boolean;
  setOpenProjectDialogOpen: (status: boolean) => void;
  deleteProjectDialogOpen: boolean;
  setDeleteProjectDialogOpen: (status: boolean) => void;
  resetSceneDialogOpen: boolean;
  setResetSceneDialogOpen: (status: boolean) => void;
}

export const useSceneStore = create<SceneState>()(
  persist(
    (set) => ({
      isHydrated: false,
      setIsHydrated: (isHydrated: boolean) => set({ isHydrated: isHydrated }),
      newProjectDialogOpen: false,
      setNewProjectDialogOpen: (status: boolean) =>
        set({ newProjectDialogOpen: status }),
      openProjectDialogOpen: false,
      setOpenProjectDialogOpen: (status: boolean) =>
        set({ openProjectDialogOpen: status }),
      deleteProjectDialogOpen: false,
      setDeleteProjectDialogOpen: (status: boolean) =>
        set({ deleteProjectDialogOpen: status }),
      resetSceneDialogOpen: false,
      setResetSceneDialogOpen: (status: boolean) =>
        set({ resetSceneDialogOpen: status }),
    }),
    {
      name: "scene-store",
      partialize: () => ({}),
      onRehydrateStorage: () => (state) => {
        state?.setIsHydrated(true);
      },
    },
  ),
);
