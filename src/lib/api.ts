import axios from "axios";

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:1337";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// UPayments (sandbox) minimal client - for quick integration from app
// Sandbox base provided: https://sandboxapi.upayments.com/api/v1
// const UPAY_BASE = "https://sandboxapi.upayments.com/api/v1";
const UPAY_BASE = "https://uapi.upayments.com/api/v1";
const UPAY_TOKEN = "Bearer a6ffef80b365e1d961c339018f9305af117f521d"; // provided test token

export async function upaymentsMakeCharge(params: {
  amount: number;
  currency?: string; // default KWD
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  orderId: string;
  orderDescription?: string;
  lang?: "ar" | "en";
  methods?: "all";
  returnUrl?: string;
  cancelUrl?: string;
  notificationUrl?: string;
  productName?: string;
  productDescription?: string;
  unitPrice?: number;
  quantity?: number;
}) {
  const shortRef = String(params.orderId).slice(0, 35);
  const payload: any = {
    language: params.lang || "ar",
    order: {
      amount: Number(params.amount),
      currency: params.currency || "KWD",
      id: shortRef,
      description: params.orderDescription,
    },
    reference: {
      id: shortRef,
    },
    products: [
      {
        name: params.productName || "Almaaref Event",
        description: params.productDescription || "Almaaref Event",
        price:
          params.unitPrice != null
            ? Number(params.unitPrice)
            : Number(params.amount) || 1,
        quantity: params.quantity != null ? Number(params.quantity) : 1,
      },
    ],
    customer: {
      name: params.customerName,
      phone: params.customerPhone,
      mobile: params.customerPhone,
      email: params.customerEmail || "no-reply@almaaref.kw",
    },
    // v1 requires top-level returnUrl/cancelUrl
    returnUrl: params.returnUrl || "https://www.yourwebsite.com/return",
    cancelUrl: params.cancelUrl || "https://www.yourwebsite.com/cancel",
    notificationUrl: params.notificationUrl || "https://example.com/notify",
    methods: params.methods || "all",
    paymentGateway: { src: "create-invoice" },
    notificationType: "link",
    paymentMethod: params.methods || "all",
  };
  try {
    const r = await axios.post(`${UPAY_BASE}/charge`, payload, {
      headers: {
        Authorization: UPAY_TOKEN,
        "Content-Type": "application/json",
      },
    });
    console.log(
      "upaymentsMakeCharge response",
      JSON.stringify(r.data, null, 2)
    );
    const data = r.data?.data || r.data || {};
    console.log("data", data);
    return {
      redirectUrl: data.url || data.redirectUrl,
      chargeId: data.invoice_id,
      raw: r.data,
    };
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
  const data = r.data?.data || r.data || {};
  return {
    status: data.status || r.data?.status || data?.order?.status,
    raw: r.data,
  };
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

// // This is for testing purposes only
// async function createLink(customer) {
//   // First char in string
//   const week = customer.Category.charAt(0);
//   if (week != "1" && week != "2") {
//     console.log("Week is not 1 or 2");
//   }

//   let description = "";

//   if (week == "1") {
//     description = `11-13 September 2025`;
//   } else if (week == "2") {
//     description = `18-20 September 2025`;
//   }

//   const options = {
//     method: "POST",
//     // url: "https://sandboxapi.upayments.com/api/v1/charge",
//     url: "https://uapi.upayments.com/api/v1/charge",
//     headers: {
//       accept: "application/json",
//       "content-type": "application/json",
//       // Authorization: "Bearer jtest123",
//       Authorization: "Bearer a6ffef80b365e1d961c339018f9305af117f521d",
//     },

//     data: {
//       products: [
//         {
//           name: customer.Class,
//           description: customer.Class,
//           price: customer.Price,
//           quantity: 1,
//         },
//       ],
//       order: {
//         id: `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
//         description: description,
//         currency: "KWD",
//         amount: customer.Price,
//       },
//       language: "ar",
//       paymentGateway: { src: "create-invoice" },
//       notificationType: "link",
//       reference: {
//         id: `ref-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
//       },
//       customer: {
//         name: customer.Name,
//         mobile: customer.Mobile,
//       },
//       returnUrl: "https://www.yourwebsite.com/success",
//       cancelUrl: "https://www.yourwebsite.com/cancel",
//       notificationUrl: "https://www.yourwebsite.com/notification",
//     },
//   };

//   try {
//     const res = await axios.request(options);
//     // console.log(res.data);
//     return res.data.data.url || null;
//   } catch (err) {
//     console.error(`Error for ${customer.Name}:`, err.response.data);
//     return null;
//   }
// }
