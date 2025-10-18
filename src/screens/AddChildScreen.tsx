import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";

export default function AddChildScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [level, setLevel] = useState("");
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 12 }}>
        إضافة طفل
      </Text>
      <Text style={{ marginBottom: 6 }}>الاسم الكامل</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="ثلاثي"
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          padding: 12,
          borderRadius: 12,
          marginBottom: 12,
        }}
      />
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
      <Text style={{ marginBottom: 6 }}>الصف/المستوى</Text>
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
        onPress={() => navigation.navigate("ChildrenList")}
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
