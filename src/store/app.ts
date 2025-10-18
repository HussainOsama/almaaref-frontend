import { create } from "zustand";

type AppState = {
  roleType: "parent" | "student" | null;
  setRoleType: (r: "parent" | "student") => void;
  phone: string;
  setPhone: (p: string) => void;
  parentId?: number;
  setParentId: (id: number) => void;
  parentDocumentId?: string;
  setParentDocumentId: (id: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
  roleType: null,
  setRoleType: (r) => set({ roleType: r }),
  phone: "",
  setPhone: (p) => set({ phone: p }),
  parentId: undefined,
  setParentId: (id) => set({ parentId: id }),
  parentDocumentId: undefined,
  setParentDocumentId: (id) => set({ parentDocumentId: id }),
}));
