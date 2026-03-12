"use client";

import { create } from "zustand";

import type { RoleType } from "@/lib/domain/types";

type TaskCardDemoStore = {
  role: RoleType;
  isDemoModeOpen: boolean;
  expandedCardIds: string[];
  setRole: (role: RoleType) => void;
  toggleDemoMode: () => void;
  toggleCardExpanded: (cardId: string) => void;
  reset: () => void;
};

function createInitialState() {
  return {
    role: "rep" as RoleType,
    isDemoModeOpen: false,
    expandedCardIds: [] as string[],
  };
}

export const useTaskCardDemoStore = create<TaskCardDemoStore>((set) => ({
  ...createInitialState(),
  setRole: (role) => set({ role, isDemoModeOpen: false }),
  toggleDemoMode: () => set((state) => ({ isDemoModeOpen: !state.isDemoModeOpen })),
  toggleCardExpanded: (cardId) =>
    set((state) => ({
      expandedCardIds: state.expandedCardIds.includes(cardId)
        ? state.expandedCardIds.filter((value) => value !== cardId)
        : [...state.expandedCardIds, cardId],
    })),
  reset: () => set(createInitialState()),
}));

export function resetTaskCardDemoStore() {
  useTaskCardDemoStore.getState().reset();
}
