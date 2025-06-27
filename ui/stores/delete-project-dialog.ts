import { create } from "zustand";

interface DeleteProjectDialogState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  targetProjectId: number | null;
  onSuccess: (() => void) | null;
  openDialog: (projectId: number, onSuccess: () => void) => void;
}

export const useDeleteProjectDialogStore = create<DeleteProjectDialogState>(
  (set) => ({
    isOpen: false,
    setIsOpen: (isOpen: boolean) => set({ isOpen }),
    targetProjectId: null,
    onSuccess: null,
    openDialog: (projectId: number, onSuccess: () => void) =>
      set({ isOpen: true, targetProjectId: projectId, onSuccess: onSuccess }),
  }),
);
