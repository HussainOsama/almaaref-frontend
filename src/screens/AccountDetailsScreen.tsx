import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAppStore } from "../store/app";
import { getMe, updateMe } from "../lib/api";

export default function AccountDetailsScreen() {
  const navigation = useNavigation<any>();
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);
  const accountType = useAppStore((s) => s.accountType);

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [secondaryPhone, setSecondaryPhone] = useState(
    user?.secondary_phone ?? ""
  );
  const phone = useAppStore((s) => s.phone);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if (!user) {
          const me = await getMe();
          setUser({
            id: me?.id,
            name: me?.name,
            phone: me?.phone,
            email: me?.email,
            roleType: me?.roleType,
            secondary_phone: me?.secondary_phone,
          });
          setName(me?.name ?? "");
          setEmail(me?.email ?? "");
          setSecondaryPhone(me?.secondary_phone ?? "");
        }
      } catch {}
    })();
  }, [user]);

  const onSave = async () => {
    if (!name.trim()) {
      Alert.alert("", "الاسم مطلوب");
      return;
    }
    try {
      setSaving(true);
      const updated = await updateMe({
        name,
        email,
        secondary_phone: secondaryPhone,
      });
      setUser({
        id: updated?.id,
        name: updated?.name ?? name,
        phone: updated?.phone ?? phone,
        email: updated?.email ?? email,
        roleType: updated?.roleType ?? user?.roleType,
        secondary_phone: updated?.secondary_phone ?? secondaryPhone,
      });
      Alert.alert("", "تم حفظ التغييرات بنجاح ✅");
      navigation.goBack();
    } catch (e) {
      Alert.alert("", "تعذر الحفظ. حاول مرة أخرى");
    } finally {
      setSaving(false);
    }
  };

  const roleBadgeColor =
    accountType === "parent"
      ? user?.roleType === "father"
        ? "#e3f2fd"
        : user?.roleType === "mother"
        ? "#fde4e7"
        : "#e3f2fd"
      : "#e8f5e9";

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#241c10" />
        </Pressable>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontWeight: "800", color: "#241c10" }}>
            Account Details
          </Text>
          <Text style={{ color: "#777", fontSize: 12 }}>
            Manage your personal information
          </Text>
        </View>
        <Pressable onPress={onSave} disabled={saving}>
          <Ionicons name="checkmark" size={22} color="#1d3f2d" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 36 }}>
        <View style={{ alignItems: "center", marginTop: 8 }}>
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: "#f3efe1",
              borderWidth: 1,
              borderColor: "#eee",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="person" size={40} color="#9a8f7a" />
            <Pressable
              style={{
                position: "absolute",
                bottom: -2,
                right: -2,
                backgroundColor: "#1d3f2d",
                borderRadius: 14,
                padding: 6,
              }}
            >
              <Ionicons name="camera" size={14} color="#fff" />
            </Pressable>
          </View>
          <View
            style={{
              marginTop: 8,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 10,
              backgroundColor: roleBadgeColor,
            }}
          >
            <Text style={{ color: "#241c10", fontSize: 12 }}>
              {user?.roleType === "father"
                ? "الأب"
                : user?.roleType === "mother"
                ? "الأم"
                : "طالب"}
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 20, gap: 12 }}>
          <View>
            <Text
              style={{ color: "#777", marginBottom: 6, textAlign: "right" }}
            >
              الاسم الكامل
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="الاسم"
              style={{
                borderWidth: 1,
                borderColor: "#eee",
                borderRadius: 12,
                padding: 12,
                textAlign: "right",
                color: "#241c10",
              }}
            />
          </View>
          <View>
            <Text
              style={{ color: "#777", marginBottom: 6, textAlign: "right" }}
            >
              رقم الهاتف
            </Text>
            <TextInput
              value={user?.phone ?? phone}
              editable={false}
              style={{
                borderWidth: 1,
                borderColor: "#eee",
                borderRadius: 12,
                padding: 12,
                textAlign: "right",
                color: "#241c10",
                backgroundColor: "#fafafa",
              }}
            />
          </View>
          <View>
            <Text
              style={{ color: "#777", marginBottom: 6, textAlign: "right" }}
            >
              البريد الإلكتروني
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="example@mail.com"
              keyboardType="email-address"
              style={{
                borderWidth: 1,
                borderColor: "#eee",
                borderRadius: 12,
                padding: 12,
                textAlign: "right",
                color: "#241c10",
              }}
            />
          </View>
          <View>
            <Text
              style={{ color: "#777", marginBottom: 6, textAlign: "right" }}
            >
              رقم هاتف إضافي
            </Text>
            <TextInput
              value={secondaryPhone}
              onChangeText={setSecondaryPhone}
              keyboardType="phone-pad"
              placeholder="—"
              style={{
                borderWidth: 1,
                borderColor: "#eee",
                borderRadius: 12,
                padding: 12,
                textAlign: "right",
                color: "#241c10",
              }}
            />
          </View>
        </View>

        <View style={{ marginTop: 24, gap: 12 }}>
          <Pressable
            disabled={saving}
            onPress={onSave}
            style={{
              backgroundColor: "#1d3f2d",
              paddingVertical: 14,
              borderRadius: 9999,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>
              حفظ التغييرات
            </Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.goBack()}
            style={{
              borderWidth: 1,
              borderColor: "#241c10",
              paddingVertical: 14,
              borderRadius: 9999,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#241c10", fontWeight: "700" }}>إلغاء</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
