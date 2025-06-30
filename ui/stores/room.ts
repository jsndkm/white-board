import { Collaborator, SocketId } from "@excalidraw/excalidraw/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RoomState {
  isHydrated: boolean;
  setIsHydrated: (isHydrated: boolean) => void;
  roomId?: string;
  setRoomId: (roomId: string | undefined) => void;
  collaborators: Map<SocketId, Collaborator>;
}

export const useRoomState = create<RoomState>()(
  persist(
    (set) => ({
      isHydrated: false,
      setIsHydrated: (isHydrated: boolean) => set({ isHydrated: isHydrated }),
      roomId: undefined,
      setRoomId: (roomId: string | undefined) => set({ roomId: roomId }),
      collaborators: new Map<SocketId, Collaborator>(),
    }),
    {
      name: "room-store",
      partialize: (state) => ({
        roomId: state.roomId,
        collaborators: state.collaborators,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setIsHydrated(true);
      },
    },
  ),
);
