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

export async function passwordLogin(phone: string, password: string) {
  const r = await api.post("/api/auth/password-login", { phone, password });
  return r.data;
}

// Parent and Student helpers
export async function createParent(payload: {
  name: string;
  phone: string;
  role: "father" | "mother";
  secondary_phone?: string;
}) {
  const r = await api.post("/api/parents", { data: payload });
  return r.data?.data;
}

export async function createStudent(payload: {
  name: string;
  birthdate?: string;
  gender?: "male" | "female";
  parentDocumentId: string; // relation by documentId
}) {
  const r = await api.post("/api/students", {
    data: {
      name: payload.name,
      birthdate: payload.birthdate,
      gender: payload.gender,
      parent: { connect: [payload.parentDocumentId] },
    },
  });
  return r.data?.data;
}

export async function listStudentsByParentDoc(parentDocumentId: string) {
  const r = await api.get("/api/students", {
    params: { "filters[parent][documentId][$eq]": parentDocumentId },
  });
  console.log("r", r.data);
  return r.data?.data ?? [];
}
