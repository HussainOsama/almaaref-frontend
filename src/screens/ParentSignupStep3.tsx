import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useParentSignupStore } from "../store/parentSignup";

export default function ParentSignupStep3({ navigation }: any) {
  const { password, set } = useParentSignupStore();
  const [local, setLocal] = useState(password);
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
        onPress={() => {
          set({ password: local });
          navigation.navigate("AddChild");
        }}
        disabled={local.length < 6}
        style={{
          position: "absolute",
          right: 20,
          bottom: 20,
          backgroundColor: local.length < 6 ? "#9fb5aa" : "#1d3f2d",
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
