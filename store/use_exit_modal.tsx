import { create } from "zustand";

type ExitModalState = {
    isOpen: boolean;
    Open: () => void;
    Close: () => void;
};

export const useExitModal = create<ExitModalState>((set) => ({
    isOpen: false,
    Open: () => set({ isOpen: true }),
    Close: () => set({ isOpen: false }),
}));