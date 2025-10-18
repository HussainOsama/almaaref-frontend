import React, { useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  I18nManager,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

const darkGreen = "#1d3f2d";
const beige = "#ffc44d";

export default function SplashScreen({ navigation }: any) {
  useEffect(() => {
    // Ensure RTL capability (doesn't force reload in Expo Go)
    I18nManager.allowRTL(true);
    const timer = setTimeout(async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const role = await AsyncStorage.getItem("roleType");
        if (token && role) {
          if (role === "parent") navigation.replace("ParentDashboard");
          else navigation.replace("Browse");
          return;
        }
      } catch {}
      navigation.replace("RoleSelection");
    }, 1200);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient
      colors={[darkGreen, beige]}
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Image
        source={require("../../assets/icon.png")}
        style={{ width: 96, height: 96, marginBottom: 16 }}
      />
      <Text style={{ color: "#fff", fontSize: 18, marginBottom: 24 }}>
        مؤسسة المعارف الإسلامية
      </Text>
      <ActivityIndicator color="#fff" />
    </LinearGradient>
  );
}
