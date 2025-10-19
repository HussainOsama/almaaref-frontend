import axios from "axios";

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:1337";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// UPayments (sandbox) minimal client - for quick integration from app
const UPAY_BASE = "https://api.upayments.com/v2"; // sandbox-compatible base
const UPAY_TOKEN = "Bearer jtest123"; // provided test token

export async function upaymentsMakeCharge(params: {
  amount: number;
  currency?: string; // default KWD
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  orderId: string;
  lang?: "ar" | "en";
  methods?: "all";
}) {
  const payload: any = {
    amount: params.amount,
    currency: params.currency || "KWD",
    customer: {
      name: params.customerName,
      phone: params.customerPhone,
      email: params.customerEmail || "no-reply@almaaref.kw",
    },
    orderId: params.orderId,
    lang: params.lang || "ar",
    methods: params.methods || "all",
    returnUrl: "https://example.com/return", // placeholder
    cancelUrl: "https://example.com/cancel", // placeholder
  };
  try {
    const r = await axios.post(`${UPAY_BASE}/charge`, payload, {
      headers: {
        Authorization: UPAY_TOKEN,
        "Content-Type": "application/json",
      },
    });
    return r.data; // expect { chargeId, redirectUrl, ... }
  } catch (e: any) {
    console.error(
      "upaymentsMakeCharge error",
      e?.response?.status,
      e?.response?.data || e?.message
    );
    throw new Error("فشل إنشاء عملية الدفع");
  }
}

export async function upaymentsGetStatus(chargeId: string) {
  const r = await axios.get(`${UPAY_BASE}/charge/${chargeId}`, {
    headers: { Authorization: UPAY_TOKEN },
  });
  return r.data; // expect { status, ... }
}

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

export async function listEvents() {
  const r = await api.get("/api/events", { params: { populate: "image" } });
  return r.data?.data ?? [];
}

// Account helpers
export async function getMe() {
  const r = await api.get("/api/users/me");
  return r.data;
}

export async function updateMe(payload: {
  name?: string;
  email?: string;
  secondary_phone?: string;
}) {
  const r = await api.put("/api/users/me", payload);
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

export async function createRegistration(
  eventDocumentId: string,
  studentDocumentId: string
) {
  const r = await api.post("/api/registrations", {
    data: {
      event: { connect: [eventDocumentId] },
      student: { connect: [studentDocumentId] },
    },
  });
  return r.data?.data;
}

export async function listRegistrationsForEventByParent(
  eventDocumentId: string,
  parentDocumentId: string
) {
  const r = await api.get("/api/registrations", {
    params: {
      "filters[event][documentId][$eq]": eventDocumentId,
      "filters[student][parent][documentId][$eq]": parentDocumentId,
      populate: "student",
    },
  });
  return r.data?.data ?? [];
}
