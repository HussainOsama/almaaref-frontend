import React from "react";
import { View, Text, Pressable, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppStore } from "../store/app";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen({ navigation }: any) {
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const accountType = useAppStore((s) => s.accountType);
  const phone = useAppStore((s) => s.phone);
  const logout = useAppStore((s) => s.logout);
  const user = useAppStore((s) => s.user);
  console.log(user);

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(["token", "roleType", "parentDocumentId"]);
    } catch {}
    logout();
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", textAlign: "center" }}>
        الإعدادات
      </Text>

      {isLoggedIn ? (
        <View
          style={{
            marginTop: 16,
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: "#eee",
            flexDirection: "row-reverse",
            alignItems: "center",
            gap: 12,
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: "#f3efe1",
              borderWidth: 1,
              borderColor: "#eee",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="person" size={24} color="#9a8f7a" />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                textAlign: "right",
                fontWeight: "700",
                color: "#241c10",
              }}
            >
              {user?.name || "—"}
            </Text>
            <Text style={{ textAlign: "right", color: "#666", marginTop: 2 }}>
              {accountType === "parent" ? "ولي أمر" : "طالب"}
            </Text>
            <Text style={{ textAlign: "right", color: "#666", marginTop: 2 }}>
              {user?.email || "—"}
            </Text>
            <Text style={{ textAlign: "right", color: "#666", marginTop: 2 }}>
              {phone || user?.phone || "—"}
            </Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate("AccountDetails")}
            style={{ padding: 8, borderRadius: 10, backgroundColor: "#eaf4ef" }}
          >
            <Ionicons name="create" size={18} color="#1d3f2d" />
          </Pressable>
        </View>
      ) : null}

      <View
        style={{
          marginTop: 24,
          backgroundColor: "#fff",
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "#eee",
        }}
      >
        {isLoggedIn ? (
          <Pressable
            onPress={() => navigation.navigate("AccountDetails")}
            style={{
              padding: 14,
              flexDirection: "row-reverse",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ textAlign: "right" }}>تفاصيل الحساب</Text>
            <Ionicons name="person" size={18} color="#241c10" />
          </Pressable>
        ) : null}
        <View
          style={{ height: 1, backgroundColor: "#eee", marginHorizontal: 12 }}
        />
        <Pressable
          onPress={() => navigation.navigate("Invoices")}
          style={{
            padding: 14,
            flexDirection: "row-reverse",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ textAlign: "right" }}>الفواتير</Text>
          <Ionicons name="receipt" size={18} color="#241c10" />
        </Pressable>
        <View
          style={{ height: 1, backgroundColor: "#eee", marginHorizontal: 12 }}
        />
        <Pressable
          onPress={() => navigation.navigate("Terms")}
          style={{
            padding: 14,
            flexDirection: "row-reverse",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ textAlign: "right" }}>الشروط والأحكام</Text>
          <Ionicons name="document-text" size={18} color="#241c10" />
        </Pressable>
        <View
          style={{ height: 1, backgroundColor: "#eee", marginHorizontal: 12 }}
        />
        <Pressable
          onPress={() => Linking.openURL("tel:+96560000000")}
          style={{
            padding: 14,
            flexDirection: "row-reverse",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ textAlign: "right" }}>اتصل بنا</Text>
          <Ionicons name="call" size={18} color="#241c10" />
        </Pressable>
      </View>

      {isLoggedIn ? (
        <Pressable
          onPress={handleLogout}
          style={{
            position: "absolute",
            left: 20,
            right: 20,
            bottom: 20,
            padding: 14,
            backgroundColor: "#1d3f2d",
            borderRadius: 14,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff" }}>تسجيل الخروج</Text>
        </Pressable>
      ) : null}
    </SafeAreaView>
  );
}
