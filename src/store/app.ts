import { create } from "zustand";

type AppState = {
  roleType: "parent" | "student" | null;
  setRoleType: (r: "parent" | "student") => void;
  phone: string;
  setPhone: (p: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
  roleType: null,
  setRoleType: (r) => set({ roleType: r }),
  phone: "",
  setPhone: (p) => set({ phone: p }),
}));
