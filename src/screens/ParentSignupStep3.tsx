import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useParentSignupStore } from "../store/parentSignup";
import { useAppStore } from "../store/app";
import { createParent } from "../lib/api";

export default function ParentSignupStep3({ navigation }: any) {
  const { password, set, name, phone, role, otherParentPhone } =
    useParentSignupStore();
  const setParentId = useAppStore((s) => s.setParentId);
  const setParentDocumentId = useAppStore((s) => s.setParentDocumentId);
  const [local, setLocal] = useState(password);
  const [submitting, setSubmitting] = useState(false);
  return (
    <SafeAreaView style={{ flex: 1, padding: 20, direction: "rtl" }}>
      <Text style={{ fontSize: 22, fontWeight: "700", textAlign: "center" }}>
        الخطوة الأخيرة
      </Text>
      <Text
        style={{
          textAlign: "center",
          color: "#666",
          marginTop: 6,
          marginBottom: 16,
        }}
      >
        قم بإنشاء كلمة مرور لحسابك.
      </Text>
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 16,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <Text style={{ marginBottom: 6, textAlign: "right" }}>كلمة المرور</Text>
        <TextInput
          value={local}
          onChangeText={(v) => setLocal(v)}
          secureTextEntry
          placeholder="••••••••"
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            padding: 12,
            borderRadius: 12,
            textAlign: "right",
          }}
        />
      </View>

      <Pressable
        onPress={async () => {
          if (local.length < 6 || !name || !phone || !role) return;
          try {
            setSubmitting(true);
            set({ password: local });
            const created = await createParent({
              name,
              phone,
              role: role as any,
              secondary_phone: otherParentPhone,
            });
            const id = created?.id ?? created?.data?.id;
            const docId = created?.documentId ?? created?.data?.documentId;
            if (id) setParentId(id);
            if (docId) setParentDocumentId(docId);
            navigation.replace("AddChild");
          } catch (e) {
            console.log("createParent error", e);
            alert("تعذر إنشاء حساب ولي الأمر. تأكد من البيانات وحاول مجددًا.");
          } finally {
            setSubmitting(false);
          }
        }}
        disabled={local.length < 6 || submitting}
        style={{
          position: "absolute",
          right: 20,
          bottom: 20,
          backgroundColor:
            local.length < 6 || submitting ? "#9fb5aa" : "#1d3f2d",
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18 }}>
          {submitting ? "…" : "→"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
