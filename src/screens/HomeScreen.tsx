import React, { useState } from "react";
import { View, Text, Image, Pressable, Modal } from "react-native";
import PhoneAuthModal from "../screens/PhoneAuthModal";

export default function HomeScreen() {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ alignItems: "center", marginTop: 32 }}>
        <Image
          source={require("../../assets/icon.png")}
          style={{ width: 72, height: 72 }}
        />
      </View>

      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 8 }}>
          Bundles
        </Text>
        <View
          style={{ height: 120, backgroundColor: "#fffaf0", borderRadius: 16 }}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            marginTop: 20,
            marginBottom: 8,
          }}
        >
          Discounts
        </Text>
        <View
          style={{ height: 120, backgroundColor: "#fffaf0", borderRadius: 16 }}
        />
      </View>

      <Pressable
        onPress={() => setOpen(true)}
        style={{
          position: "absolute",
          bottom: 24,
          left: 24,
          right: 24,
          backgroundColor: "#1d3f2d",
          padding: 16,
          borderRadius: 16,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16 }}>سجل أطفالك</Text>
      </Pressable>

      <Modal
        visible={open}
        animationType="slide"
        transparent
        onRequestClose={() => setOpen(false)}
      >
        <PhoneAuthModal onClose={() => setOpen(false)} />
      </Modal>
    </View>
  );
}
