import { create } from "zustand";

interface NewProjectDialogState {
  isOpen: boolean;
  templateName: string;
  templateDesc: string;
  openDialog: (name: string, description: string) => void;

  setIsOpen: (isOpen: boolean) => void;
}

export const useNewProjectDialogStore = create<NewProjectDialogState>(
  (set) => ({
    isOpen: false,
    templateName: "",
    templateDesc: "",
    onConfirm: null,

    openDialog: (name, description) =>
      set({
        isOpen: true,
        templateName: name,
        templateDesc: description,
      }),

    setIsOpen: (isOpen) => set({ isOpen }),
  }),
);
