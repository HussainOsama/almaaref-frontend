import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useAuthStore } from "../store/auth";

export default function PhoneScreen({ navigation }: any) {
  const [localPhone, setLocalPhone] = useState("");
  const requestOtp = useAuthStore((s) => s.requestOtp);

  const onContinue = async () => {
    try {
      await requestOtp(localPhone);
      navigation.navigate("Otp");
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to request OTP");
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12 }}>
        Get started
      </Text>
      <Text style={{ marginBottom: 8 }}>Enter your phone number</Text>
      <TextInput
        value={localPhone}
        onChangeText={setLocalPhone}
        keyboardType="phone-pad"
        placeholder="e.g. 65790570"
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          padding: 12,
          borderRadius: 8,
        }}
      />
      <View style={{ height: 12 }} />
      <Button title="Continue" onPress={onContinue} />
    </View>
  );
}
