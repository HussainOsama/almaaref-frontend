import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";

export default function StudentSignupScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [dob, setDob] = useState("");
  const [level, setLevel] = useState("");
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 12 }}>
        معلوماتي الشخصية
      </Text>
      <Text style={{ marginBottom: 6 }}>الاسم الكامل</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="الاسم"
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          padding: 12,
          borderRadius: 12,
          marginBottom: 12,
        }}
      />
      <Text style={{ marginBottom: 6 }}>الجنس</Text>
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
        {["male", "female"].map((g) => (
          <Pressable
            key={g}
            onPress={() => setGender(g as any)}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: gender === g ? "#1d3f2d" : "#ddd",
              backgroundColor: "#fff",
            }}
          >
            <Text>{g === "male" ? "ولد" : "بنت"}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={{ marginBottom: 6 }}>تاريخ الميلاد</Text>
      <TextInput
        value={dob}
        onChangeText={setDob}
        placeholder="YYYY-MM-DD"
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          padding: 12,
          borderRadius: 12,
          marginBottom: 12,
        }}
      />
      <Text style={{ marginBottom: 6 }}>المستوى المدرسي</Text>
      <TextInput
        value={level}
        onChangeText={setLevel}
        placeholder="الصف"
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          padding: 12,
          borderRadius: 12,
        }}
      />
      <Pressable
        onPress={() => navigation.navigate("ParentDashboard")}
        disabled={!name}
        style={{
          position: "absolute",
          right: 20,
          bottom: 20,
          backgroundColor: !name ? "#9fb5aa" : "#1d3f2d",
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18 }}>→</Text>
      </Pressable>
    </View>
  );
}
