import { create } from "zustand";

type DialogType = "newProject" | "openProject" | "projectDetails" | null;

interface ProjectDialogStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  dialogType: DialogType;
  openDialog: (type: DialogType) => void;
}

export const useProjectDialogStore = create<ProjectDialogStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => {
    if (isOpen) set({ isOpen });
    else set({ isOpen, dialogType: null });
  },
  dialogType: null,
  openDialog: (type) => set({ isOpen: true, dialogType: type }),
}));
