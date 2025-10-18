import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { sendOtp, verifyOtp } from "../lib/api";
import { useNavigation } from "@react-navigation/native";
import { useAppStore } from "../store/app";

export default function PhoneAuthModal({ onClose }: { onClose: () => void }) {
  const [phone, setPhone] = useState("");
  const [stage, setStage] = useState<"phone" | "otp">("phone");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const setStorePhone = useAppStore((s) => s.setPhone);
  const navigation = useNavigation<any>();

  const onContinue = async () => {
    if (!phone) return;
    try {
      setSubmitting(true);
      await sendOtp(phone);
      setStorePhone(phone);
      setStage("otp");
    } catch (e: any) {
      console.log("sendOtp error", e?.message || e);
      alert("تعذر إرسال الرمز. حاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  };
  const onVerify = async () => {
    if (!code) return;
    try {
      setSubmitting(true);
      await verifyOtp(phone, code);
      onClose();
      // Navigate into the sign-up flow (or dashboard if you add existence check)
      navigation.navigate("RoleSelection");
    } catch (e: any) {
      console.log("verifyOtp error", e?.message || e);
      alert("رمز غير صحيح. حاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "#0006", justifyContent: "flex-end" }}
    >
      <View
        style={{
          backgroundColor: "#fff",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: 20,
          minHeight: "60%",
        }}
      >
        <Pressable onPress={onClose} style={{ alignSelf: "flex-start" }}>
          <Text style={{ fontSize: 18 }}>✕</Text>
        </Pressable>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            marginBottom: 12,
            textAlign: "right",
          }}
        >
          ابدأ التسجيل
        </Text>
        {stage === "phone" ? (
          <>
            <Text
              style={{ color: "#666", marginBottom: 8, textAlign: "right" }}
            >
              قم بإنشاء حساب جديد أو تسجيل الدخول مباشرة باستخدام رقم هاتفك.
            </Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="+965 6xxxxxxx"
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                padding: 12,
                borderRadius: 12,
                textAlign: "right",
              }}
            />
            <Pressable
              disabled={!phone || submitting}
              onPress={onContinue}
              style={{
                marginTop: 16,
                backgroundColor: !phone || submitting ? "#9fb5aa" : "#1d3f2d",
                padding: 14,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff" }}>
                {submitting ? "..." : "متابعة"}
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text
              style={{ color: "#666", marginBottom: 8, textAlign: "right" }}
            >
              أدخل رمز التحقق المكون من 6 أرقام
            </Text>
            <TextInput
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              placeholder="••••••"
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                padding: 12,
                borderRadius: 12,
                textAlign: "right",
              }}
            />
            <Pressable
              disabled={code.length < 4 || submitting}
              onPress={onVerify}
              style={{
                marginTop: 16,
                backgroundColor:
                  code.length < 4 || submitting ? "#9fb5aa" : "#1d3f2d",
                padding: 14,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff" }}>
                {submitting ? "..." : "تأكيد"}
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
