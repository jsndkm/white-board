import {
  Collaborator,
  CollaboratorPointer,
  SocketId,
} from "@excalidraw/excalidraw/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RoomState {
  isHydrated: boolean;
  setIsHydrated: (isHydrated: boolean) => void;
  roomId?: string;
  setRoomId: (roomId: string | undefined) => void;
  collaborators: Map<SocketId, Collaborator>;
  addUser: (username: string) => void;
  removeUser: (username: string) => void;
  updatePointers: (users: { username: string; x: number; y: number }[]) => void;
}

export const useRoomState = create<RoomState>()(
  persist(
    (set) => ({
      isHydrated: false,
      setIsHydrated: (isHydrated: boolean) => set({ isHydrated: isHydrated }),
      roomId: undefined,
      setRoomId: (roomId: string | undefined) => set({ roomId: roomId }),
      collaborators: new Map<SocketId, Collaborator>(),
      addUser: (username: string) =>
        set((state) => {
          const map = new Map(state.collaborators);
          map.set(username as SocketId, {} as Collaborator);
          return { collaborators: map };
        }),
      removeUser: (username: string) =>
        set((state) => {
          const map = new Map(state.collaborators);
          map.delete(username as SocketId);
          return { collaborators: map };
        }),
      updatePointers: (users: { username: string; x: number; y: number }[]) =>
        set(() => {
          const newMap = new Map<SocketId, Collaborator>();
          users.forEach((user) => {
            newMap.set(user.username as SocketId, {
              pointer: {
                x: user.x,
                y: user.y,
              } as CollaboratorPointer,
              username: user.username,
            });
          });
          return { collaborators: newMap };
        }),
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
