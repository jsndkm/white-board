import { create } from "zustand";

type ConfirmDialogType = "deleteProject" | "removeMember" | "exitProject";

interface ConfirmDialogState {
  isOpen: boolean;
  type: ConfirmDialogType | null;
  title: string;
  description: string;
  onConfirm: (() => void) | null;

  openDialog: (config: {
    type: ConfirmDialogType;
    title: string;
    description: string;
    onConfirm: () => void;
  }) => void;

  setIsOpen: (isOpen: boolean) => void;
}

export const useGlobalConfirmDialogStore = create<ConfirmDialogState>(
  (set) => ({
    isOpen: false,
    type: null,
    title: "",
    description: "",
    onConfirm: null,

    openDialog: ({ type, title, description, onConfirm }) =>
      set({
        isOpen: true,
        type,
        title,
        description,
        onConfirm,
      }),

    setIsOpen: (isOpen) => set({ isOpen }),
  }),
);
