import React from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppStore } from "../store/app";

export default function SettingsScreen({ navigation }: any) {
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const accountType = useAppStore((s) => s.accountType);
  const phone = useAppStore((s) => s.phone);
  const logout = useAppStore((s) => s.logout);

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
          }}
        >
          <Text style={{ textAlign: "right" }}>الحالة: مسجّل الدخول</Text>
          <Text style={{ textAlign: "right" }}>
            نوع الحساب: {accountType === "parent" ? "ولي أمر" : "طالب"}
          </Text>
          <Text style={{ textAlign: "right" }}>رقم الهاتف: {phone || "—"}</Text>
        </View>
      ) : (
        <View
          style={{
            marginTop: 16,
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: "#eee",
          }}
        >
          <Text style={{ textAlign: "right" }}>أنت غير مسجّل الدخول</Text>
          <Pressable
            onPress={() =>
              navigation.navigate("ParentDashboard", {
                screen: "Home",
                params: { openAuth: true },
              })
            }
            style={{
              marginTop: 10,
              backgroundColor: "#1d3f2d",
              padding: 12,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff" }}>ابدأ التسجيل</Text>
          </Pressable>
        </View>
      )}

      {/* <View style={{ marginTop: 24, gap: 12 }}>
        <Pressable
          onPress={() => navigation.navigate("Home")}
          style={{
            padding: 12,
            borderWidth: 1,
            borderColor: "#eee",
            borderRadius: 12,
          }}
        >
          <Text style={{ textAlign: "right" }}>الذهاب للواجهة</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("Browse")}
          style={{
            padding: 12,
            borderWidth: 1,
            borderColor: "#eee",
            borderRadius: 12,
          }}
        >
          <Text style={{ textAlign: "right" }}>الفعاليات</Text>
        </Pressable>
        {isLoggedIn && accountType === "parent" && (
          <Pressable
            onPress={() => navigation.navigate("Children")}
            style={{
              padding: 12,
              borderWidth: 1,
              borderColor: "#eee",
              borderRadius: 12,
            }}
          >
            <Text style={{ textAlign: "right" }}>أبنائي</Text>
          </Pressable>
        )}
      </View> */}

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
