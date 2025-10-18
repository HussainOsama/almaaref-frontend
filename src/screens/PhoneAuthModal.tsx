import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { sendOtp, verifyOtp, passwordLogin } from "../lib/api";
import { useNavigation } from "@react-navigation/native";
import { useAppStore } from "../store/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../lib/api";

export default function PhoneAuthModal({ onClose }: { onClose: () => void }) {
  const [phone, setPhone] = useState("");
  const [stage, setStage] = useState<"phone" | "otp" | "password">("phone");
  const [code, setCode] = useState("");
  const [pwd, setPwd] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const setStorePhone = useAppStore((s) => s.setPhone);
  const setIsLoggedIn = useAppStore((s) => s.setIsLoggedIn);
  const setAccountType = useAppStore((s) => s.setAccountType);
  const setParentId = useAppStore((s) => s.setParentId);
  const setParentDocumentId = useAppStore((s) => s.setParentDocumentId);
  const setToken = useAppStore((s) => s.setToken);
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
      const res = await verifyOtp(phone, code);
      onClose();
      const acc = res?.account;
      if (acc?.type === "parent") {
        setIsLoggedIn(true);
        setAccountType("parent");
        if (acc.id) setParentId(acc.id);
        if (acc.documentId) setParentDocumentId(acc.documentId);
        try {
          if (res?.token) {
            setToken(res.token);
            api.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${res.token}`;
            await AsyncStorage.setItem("token", res.token);
          }
          await AsyncStorage.setItem("roleType", "parent");
          if (acc.documentId)
            await AsyncStorage.setItem("parentDocumentId", acc.documentId);
        } catch {}
        navigation.navigate("Children");
      } else if (acc?.type === "student") {
        setIsLoggedIn(true);
        setAccountType("student");
        try {
          if (res?.token) {
            setToken(res.token);
            api.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${res.token}`;
            await AsyncStorage.setItem("token", res.token);
          }
          await AsyncStorage.setItem("roleType", "student");
        } catch {}
        navigation.navigate("Browse");
      } else {
        setIsLoggedIn(false);
        setAccountType(null);
        navigation.navigate("RoleSelection");
      }
    } catch (e: any) {
      console.log("verifyOtp error", e?.message || e);
      alert("رمز غير صحيح. حاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  };

  const onPasswordLogin = async () => {
    if (!phone || !pwd) return;
    try {
      setSubmitting(true);
      const res = await passwordLogin(phone, pwd);
      onClose();
      const acc = res?.account;
      if (acc?.type === "parent") {
        setIsLoggedIn(true);
        setAccountType("parent");
        if (acc.id) setParentId(acc.id);
        if (acc.documentId) setParentDocumentId(acc.documentId);
        try {
          await AsyncStorage.setItem("roleType", "parent");
          if (acc.documentId)
            await AsyncStorage.setItem("parentDocumentId", acc.documentId);
        } catch {}
        navigation.navigate("Children");
      } else if (acc?.type === "student") {
        setIsLoggedIn(true);
        setAccountType("student");
        try {
          await AsyncStorage.setItem("roleType", "student");
        } catch {}
        navigation.navigate("Browse");
      } else {
        alert("لا يوجد حساب مطابق لهذا الرقم");
      }
    } catch (e: any) {
      console.log("passwordLogin error", e?.message || e);
      alert("بيانات الدخول غير صحيحة");
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
            <Pressable
              disabled={!phone || submitting}
              onPress={() => setStage("password")}
              style={{
                marginTop: 12,
                padding: 14,
                borderRadius: 12,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#ddd",
              }}
            >
              <Text style={{ color: "#241c10" }}>تسجيل بكلمة المرور</Text>
            </Pressable>
          </>
        ) : stage === "otp" ? (
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
            <Pressable
              disabled={!phone || submitting}
              onPress={() => setStage("password")}
              style={{ marginTop: 12, alignItems: "center" }}
            >
              <Text style={{ color: "#1d3f2d" }}>
                استخدام كلمة المرور بدلاً من ذلك
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text
              style={{ color: "#666", marginBottom: 8, textAlign: "right" }}
            >
              أدخل كلمة المرور لحسابك
            </Text>
            <TextInput
              value={pwd}
              onChangeText={setPwd}
              secureTextEntry
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
              disabled={!phone || !pwd || submitting}
              onPress={onPasswordLogin}
              style={{
                marginTop: 16,
                backgroundColor:
                  !phone || !pwd || submitting ? "#9fb5aa" : "#1d3f2d",
                padding: 14,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff" }}>
                {submitting ? "..." : "تسجيل الدخول"}
              </Text>
            </Pressable>
            <Pressable
              disabled={!phone || submitting}
              onPress={async () => {
                try {
                  setSubmitting(true);
                  await sendOtp(phone);
                  setStage("otp");
                } catch {
                } finally {
                  setSubmitting(false);
                }
              }}
              style={{ marginTop: 12, alignItems: "center" }}
            >
              <Text style={{ color: "#1d3f2d" }}>
                إرسال رمز تحقق بدلاً من ذلك
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
