import { create } from "zustand";

interface NewProjectDialogState {
  isOpen: boolean;
  templateName: string;
  templateDesc: string;
  base64String: string;
  openDialog: (name: string, description: string, base64Str: string) => void;

  setIsOpen: (isOpen: boolean) => void;
}

export const useNewProjectDialogStore = create<NewProjectDialogState>(
  (set) => ({
    isOpen: false,
    templateName: "",
    templateDesc: "",
    base64String: "",
    onConfirm: null,

    openDialog: (name, description, base64Str) =>
      set({
        isOpen: true,
        templateName: name,
        templateDesc: description,
        base64String: base64Str,
      }),

    setIsOpen: (isOpen) => set({ isOpen }),
  }),
);
