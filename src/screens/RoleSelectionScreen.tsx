import React, { useState } from "react";
import { View, Text, Pressable, Image } from "react-native";
import { useAppStore } from "../store/app";

const darkGreen = "#1d3f2d";
const beige = "#ffc44d";
const darkBrown = "#241c10";

function RoleCard({ title, subtitle, selected, onPress }: any) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        borderWidth: 2,
        borderColor: selected ? darkGreen : "#eee",
        borderRadius: 16,
        padding: 16,
        backgroundColor: "#fff8ee",
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        marginBottom: 12,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "700", color: darkBrown }}>
        {title}
      </Text>
      <Text style={{ color: "#555", marginTop: 6 }}>{subtitle}</Text>
    </Pressable>
  );
}

export default function RoleSelectionScreen({ navigation }: any) {
  const { setRoleType } = useAppStore();
  const [role, setRole] = useState<"parent" | "student" | null>(null);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ alignItems: "center", marginTop: 36, marginBottom: 24 }}>
        <Image
          source={require("../../assets/icon.png")}
          style={{ width: 64, height: 64 }}
        />
      </View>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "700",
          textAlign: "center",
          color: darkBrown,
        }}
      >
        مرحبًا بك 👋
      </Text>
      <Text
        style={{
          textAlign: "center",
          color: "#666",
          marginTop: 6,
          marginBottom: 20,
        }}
      >
        اختر نوع حسابك للمتابعة
      </Text>

      <RoleCard
        title="🧑‍👩‍👧 ولي أمر (Parent)"
        subtitle="يمكنك إدارة أكثر من طالب."
        selected={role === "parent"}
        onPress={() => setRole("parent")}
      />
      <RoleCard
        title="🎓 طالب (Student)"
        subtitle="يمكنك التسجيل في الفعاليات بنفسك."
        selected={role === "student"}
        onPress={() => setRole("student")}
      />

      <Pressable
        disabled={!role}
        onPress={() => {
          if (role) {
            setRoleType(role);
            navigation.navigate("Register");
          }
        }}
        style={{
          marginTop: 12,
          backgroundColor: role ? darkGreen : "#9fb5aa",
          padding: 14,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16 }}>استمرار</Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate("Account", { screen: "Phone" })}
        style={{ marginTop: 12, alignItems: "center" }}
      >
        <Text style={{ color: darkGreen }}>لدي حساب بالفعل؟ تسجيل الدخول</Text>
      </Pressable>
    </View>
  );
}
