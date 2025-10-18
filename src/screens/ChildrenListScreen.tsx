import React from "react";
import { View, Text, Pressable, FlatList } from "react-native";

export default function ChildrenListScreen({ navigation }: any) {
  const data = [] as any[]; // placeholder list
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 12 }}>
        أبنائي
      </Text>
      <Pressable
        onPress={() => navigation.navigate("AddChild")}
        style={{
          marginBottom: 12,
          backgroundColor: "#1d3f2d",
          padding: 12,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff" }}>+ إضافة طفل جديد</Text>
      </Pressable>
      <FlatList
        data={data}
        renderItem={({ item }) => <Text>{item.name}</Text>}
        ListEmptyComponent={
          <Text style={{ color: "#666" }}>لا يوجد أطفال بعد</Text>
        }
      />
    </View>
  );
}
