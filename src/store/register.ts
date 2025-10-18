import { create } from "zustand";

export type ParentDraft = {
  phone: string;
  name: string;
  gender: "male" | "female";
  birthdate?: string;
  role: "father" | "mother";
  secondary_phone?: string;
};

export type StudentDraft = {
  phone: string;
  name: string;
  gender: "male" | "female";
  birthdate?: string;
  hasParent?: boolean;
};

export type RegisterDraft = ParentDraft | StudentDraft;

type RegisterState = {
  draft: Partial<RegisterDraft> | null;
  setDraft: (partial: Partial<RegisterDraft>) => void;
  clearDraft: () => void;
};

export const useRegisterStore = create<RegisterState>((set, get) => ({
  draft: null,
  setDraft: (partial) => {
    const current = get().draft || {};
    set({ draft: { ...current, ...partial } });
  },
  clearDraft: () => set({ draft: null }),
}));
