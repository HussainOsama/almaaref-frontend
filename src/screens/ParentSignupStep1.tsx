import React from "react";
import { View, Text, Pressable, TextInput, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useParentSignupStore } from "../store/parentSignup";
import { useAppStore } from "../store/app";

export default function ParentSignupStep1({ navigation }: any) {
  const { role, name, phone, set } = useParentSignupStore();
  const otpPhone = useAppStore((s) => s.phone);

  React.useEffect(() => {
    if (!phone && otpPhone) set({ phone: otpPhone });
  }, [otpPhone]);

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <View style={{ alignItems: "center", marginTop: 24, marginBottom: 16 }}>
        <Image
          source={require("../../assets/icon.png")}
          style={{ width: 56, height: 56 }}
        />
      </View>
      <Text style={{ fontSize: 22, fontWeight: "700", textAlign: "center" }}>
        إنشاء حساب جديد
      </Text>
      <Text
        style={{
          textAlign: "center",
          color: "#666",
          marginTop: 6,
          marginBottom: 16,
        }}
      >
        اختر صفتك وأدخل بياناتك
      </Text>

      <Text style={{ marginBottom: 6, textAlign: "right" }}>
        علاقتي بالطالب
      </Text>
      <View
        style={{
          flexDirection: "row",
          marginBottom: 12,
          justifyContent: "space-between",
        }}
      >
        {[
          { k: "mother", t: "الأم", icon: "👩" },
          { k: "father", t: "الأب", icon: "👨" },
        ].map((o) => (
          <Pressable
            key={o.k}
            onPress={() => set({ role: o.k as any })}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginHorizontal: 4,
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: role === o.k ? "#1d3f2d" : "#ddd",
              backgroundColor: "#fff",
            }}
          >
            <Text>{o.icon}</Text>
            <Text>{o.t}</Text>
          </Pressable>
        ))}
      </View>

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
        <Text style={{ marginBottom: 6, textAlign: "right" }}>
          الاسم الكامل
        </Text>
        <TextInput
          value={name}
          onChangeText={(v) => set({ name: v })}
          placeholder="الاسم"
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            padding: 12,
            borderRadius: 12,
            marginBottom: 12,
            textAlign: "right",
          }}
        />
        <Text style={{ marginBottom: 6, textAlign: "right" }}>رقم الهاتف</Text>
        <TextInput
          value={phone}
          onChangeText={(v) => set({ phone: v })}
          keyboardType="phone-pad"
          placeholder="+965"
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
        onPress={() => navigation.navigate("ParentSignupStep2")}
        disabled={!role || !name || !phone}
        style={{
          position: "absolute",
          right: 20,
          bottom: 20,
          backgroundColor: !role || !name || !phone ? "#9fb5aa" : "#1d3f2d",
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18 }}>→</Text>
      </Pressable>
    </SafeAreaView>
  );
}
