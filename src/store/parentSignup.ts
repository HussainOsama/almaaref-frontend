import { create } from "zustand";

export type ParentRole = "father" | "mother";

type ParentSignupState = {
  role: ParentRole | null;
  name: string;
  phone: string;
  otherParentName: string;
  otherParentPhone?: string;
  password: string;
  set: (p: Partial<ParentSignupState>) => void;
  reset: () => void;
};

const initial: Omit<ParentSignupState, "set" | "reset"> = {
  role: null,
  name: "",
  phone: "",
  otherParentName: "",
  otherParentPhone: "",
  password: "",
};

export const useParentSignupStore = create<ParentSignupState>((set) => ({
  ...initial,
  set: (p) => set(p),
  reset: () => set(initial),
}));
