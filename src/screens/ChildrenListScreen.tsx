import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Pressable, FlatList, RefreshControl } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { listStudentsByParentDoc } from "../lib/api";
import { useAppStore } from "../store/app";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChildrenListScreen({ navigation }: any) {
  const isFocused = useIsFocused();
  const parentDocumentId = useAppStore((s) => s.parentDocumentId);
  const [data, setData] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      if (!parentDocumentId) return;
      const rows = await listStudentsByParentDoc(parentDocumentId);
      setData(rows);
    })();
  }, [isFocused, parentDocumentId]);

  const onRefresh = useCallback(async () => {
    if (!parentDocumentId) return;
    setRefreshing(true);
    try {
      const rows = await listStudentsByParentDoc(parentDocumentId);
      setData(rows);
    } finally {
      setRefreshing(false);
    }
  }, [parentDocumentId]);
  const renderItem = ({ item }: any) => {
    const name = item?.name ?? item?.attributes?.name ?? "بدون اسم";
    const birthdate = item?.birthdate ?? item?.attributes?.birthdate;
    const grade = item?.level ?? item?.attributes?.level;
    const initial = String(name).trim().charAt(0) || "أ";
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          padding: 14,
          borderWidth: 1,
          borderColor: "#eee",
          borderRadius: 16,
          backgroundColor: "#fff",
          marginBottom: 10,
          shadowColor: "#000",
          shadowOpacity: 0.04,
          shadowRadius: 6,
          elevation: 1,
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: "#fffaf0",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: "#f1e6c8",
          }}
        >
          <Text style={{ fontWeight: "700", color: "#241c10" }}>{initial}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{ fontWeight: "700", color: "#241c10", textAlign: "right" }}
          >
            {name}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 4,
            }}
          >
            {grade ? (
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 8,
                  backgroundColor: "#eaf4ef",
                }}
              >
                <Text style={{ color: "#1d3f2d", fontSize: 12 }}>
                  الصف {grade}
                </Text>
              </View>
            ) : null}
            {birthdate ? (
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 8,
                  backgroundColor: "#f6f6f6",
                }}
              >
                <Text style={{ color: "#555", fontSize: 12 }}>{birthdate}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", textAlign: "center" }}>
        أبنائي
      </Text>
      <Text
        style={{
          textAlign: "center",
          color: "#666",
          marginTop: 6,
          marginBottom: 16,
        }}
      >
        قائمة الأطفال المسجلين لديك
      </Text>

      <Pressable
        onPress={() => navigation.navigate("AddChild")}
        style={{
          marginBottom: 12,
          backgroundColor: "#1d3f2d",
          padding: 14,
          borderRadius: 14,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16 }}>+ إضافة طفل جديد</Text>
      </Pressable>

      <FlatList
        data={data}
        keyExtractor={(item: any) => String(item.id || item.documentId)}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={{ paddingVertical: 24, alignItems: "center" }}>
            <Text style={{ color: "#666" }}>لا يوجد أطفال بعد</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
