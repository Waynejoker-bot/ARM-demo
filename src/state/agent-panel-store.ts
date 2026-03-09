"use client";

import { create } from "zustand";

export type AgentPanelContext = {
  title: string;
  description?: string;
  prompt?: string;
  roleHint?: "ceo" | "manager" | "rep";
  suggestedPrompts?: string[];
};

type AgentPanelState = {
  isOpen: boolean;
  context: AgentPanelContext;
  setContext: (context: AgentPanelContext) => void;
  openPanel: (context: AgentPanelContext) => void;
  expandPanel: () => void;
  collapsePanel: () => void;
};

const defaultContext: AgentPanelContext = {
  title: "Agent 工作台",
  description: "你可以继续追问为什么有风险、下一步该做什么、以及哪些证据最值得信任。",
  prompt: "在当前上下文里，我最应该优先处理什么？",
  suggestedPrompts: [
    "为什么现在风险升高了？",
    "我最该相信哪条证据？",
    "这周最该推进的动作是什么？",
  ],
};

export const useAgentPanelStore = create<AgentPanelState>((set) => ({
  isOpen: true,
  context: defaultContext,
  setContext: (context) => set((state) => ({ context: { ...state.context, ...context } })),
  openPanel: (context) => set({ isOpen: true, context: { ...defaultContext, ...context } }),
  expandPanel: () => set({ isOpen: true }),
  collapsePanel: () => set({ isOpen: false }),
}));
