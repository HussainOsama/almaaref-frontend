import axios from "axios";

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:1337";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export async function sendOtp(phone: string, roleType?: string) {
  // Strapi v5 custom route
  await api.post("/api/auth/request-otp", { phone, role: roleType });
}

export async function verifyOtp(phone: string, code: string) {
  const r = await api.post("/api/auth/verify-otp", { phone, code });
  return r.data;
}
