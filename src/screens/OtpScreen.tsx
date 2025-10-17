import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useAuthStore } from "../store/auth";

export default function OtpScreen({ navigation }: any) {
  const phone = useAuthStore((s) => s.phone);
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const [code, setCode] = useState("");

  const onVerify = async () => {
    try {
      const ok = await verifyOtp(phone, code);
      if (ok) {
        Alert.alert("Success", "Logged in");
        navigation.goBack();
      } else {
        Alert.alert("Failed", "Invalid code");
      }
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to verify");
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12 }}>
        Enter OTP
      </Text>
      <Text style={{ marginBottom: 8 }}>Code sent to {phone}</Text>
      <TextInput
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        placeholder="6-digit code"
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          padding: 12,
          borderRadius: 8,
        }}
      />
      <View style={{ height: 12 }} />
      <Button title="Verify" onPress={onVerify} />
    </View>
  );
}
