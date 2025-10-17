import { create } from "zustand";
import { api } from "../lib/api";

type Student = {
  id?: number;
  documentId?: string;
  phone?: string;
  name?: string;
  role?: "student" | "child";
};

type AuthState = {
  student: Student | null;
  phone: string;
  setPhone: (p: string) => void;
  requestOtp: (phone: string, role?: string) => Promise<void>;
  verifyOtp: (phone: string, code: string) => Promise<boolean>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  student: null,
  phone: "",
  setPhone: (p) => set({ phone: p }),
  requestOtp: async (phone, role) => {
    await api.post("/api/auth/request-otp", { phone, role });
    set({ phone });
  },
  verifyOtp: async (phone, code) => {
    const res = await api.post("/api/auth/verify-otp", { phone, code });
    const s = res.data?.student ?? null;
    set({ student: s });
    return !!s;
  },
  logout: () => set({ student: null, phone: "" }),
}));
