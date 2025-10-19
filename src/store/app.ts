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
  isLoggedIn: boolean;
  accountType: "parent" | "student" | null;
  setIsLoggedIn: (v: boolean) => void;
  setAccountType: (t: "parent" | "student" | null) => void;
  logout: () => void;
  token?: string;
  setToken: (t?: string) => void;
  pendingEventDocumentId?: string;
  setPendingEventDocumentId: (id?: string) => void;
  user?: {
    id?: number;
    name?: string;
    phone?: string;
    email?: string;
    roleType?: "father" | "mother" | "student";
    secondary_phone?: string;
    avatarUrl?: string;
  };
  setUser: (u?: AppState["user"]) => void;
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
  isLoggedIn: false,
  accountType: null,
  setIsLoggedIn: (v) => set({ isLoggedIn: v }),
  setAccountType: (t) => set({ accountType: t })
  token: undefined,
  setToken: (t?: string) => set({ token: t }),
  pendingEventDocumentId: undefined,
  setPendingEventDocumentId: (id?: string) =>
    set({ pendingEventDocumentId: id }),
  user: undefined,
  setUser: (u) => set({ user: u }),
  logout: () =>
    set({
      isLoggedIn: false,
      accountType: null,
      roleType: null,
      phone: "",
      parentId: undefined,
      parentDocumentId: undefined,
      token: undefined,
      pendingEventDocumentId: undefined,
      user: undefined,
    }),
}));
