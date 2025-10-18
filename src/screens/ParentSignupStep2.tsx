import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useParentSignupStore } from "../store/parentSignup";

export default function ParentSignupStep2({ navigation }: any) {
  const { otherParentName, otherParentPhone, set } = useParentSignupStore();
  return (
    <SafeAreaView style={{ flex: 1, padding: 20, direction: "rtl" }}>
      <Text style={{ fontSize: 22, fontWeight: "700", textAlign: "center" }}>
        أكمل بيانات ولي الأمر الآخر
      </Text>
      <Text
        style={{
          textAlign: "center",
          color: "#666",
          marginTop: 6,
          marginBottom: 16,
        }}
      >
        سنستخدم هذه البيانات لتوحيد التواصل بين الوالدين
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
        <Text style={{ marginBottom: 6, textAlign: "right" }}>الاسم</Text>
        <TextInput
          value={otherParentName}
          onChangeText={(v) => set({ otherParentName: v })}
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
        <Text style={{ marginBottom: 6, textAlign: "right" }}>
          رقم الهاتف (اختياري)
        </Text>
        <TextInput
          value={otherParentPhone}
          onChangeText={(v) => set({ otherParentPhone: v })}
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
        onPress={() => navigation.navigate("ParentSignupStep3")}
        disabled={!otherParentName}
        style={{
          position: "absolute",
          right: 20,
          bottom: 20,
          backgroundColor: !otherParentName ? "#9fb5aa" : "#1d3f2d",
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
