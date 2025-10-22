import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useAppStore } from "../store/app";
import { useNavigation } from "@react-navigation/native";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:1337";

export default function EventDetailsScreen({ route }: any) {
  const { documentId } = route.params;
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<any>(null);
  const parentDocumentId = useAppStore((s) => s.parentDocumentId);
  const navigation = useNavigation<any>();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_URL}/api/events`, {
          params: { "filters[documentId][$eq]": documentId, populate: "image" },
        });
        const item = res.data?.data?.[0] ?? null;
        setEvent(item);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [documentId]);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;
  if (!event) return <Text style={{ margin: 16 }}>Event not found</Text>;

  const img = event?.image || event?.attributes?.image;
  const url = img?.url || img?.data?.attributes?.url;
  const title = event.title || event.attributes?.title;
  const description = event.description || event.attributes?.description;
  const location = event.location || event.attributes?.location;
  const date = event.date || event.attributes?.date;
  const price = event.price || event.attributes?.price;

  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: "#fffaf0" }}
    >
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {url ? (
          <View style={{ marginBottom: 12, position: "relative" }}>
            <Image
              source={{ uri: `${API_URL}${url}` }}
              style={{ width: "100%", aspectRatio: 0.75, borderRadius: 16 }}
              resizeMode="cover"
            />
            <View
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                backgroundColor: "#eaf4ef",
                borderRadius: 16,
                paddingHorizontal: 10,
                paddingVertical: 6,
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Ionicons name="calendar" size={16} color="#1d3f2d" />
              {date ? (
                <Text style={{ color: "#1d3f2d", fontSize: 12 }}>
                  {String(date).slice(0, 10)}
                </Text>
              ) : null}
            </View>
          </View>
        ) : null}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 18,
            borderWidth: 1,
            borderColor: "#eee",
            padding: 14,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
            elevation: 4,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "800",
              textAlign: "right",
              color: "#241c10",
            }}
          >
            {title}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 10,
            }}
          >
            {location ? (
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 12,
                  backgroundColor: "#f6f6f6",
                }}
              >
                <Text style={{ color: "#555", fontSize: 12 }}>{location}</Text>
              </View>
            ) : null}
            {price ? (
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 12,
                  backgroundColor: "#ffc44d",
                }}
              >
                <Text style={{ color: "#241c10", fontWeight: "700" }}>
                  {price} KWD
                </Text>
              </View>
            ) : null}
          </View>
          {description ? (
            <Text style={{ marginTop: 12, textAlign: "right", lineHeight: 22 }}>
              {description}
            </Text>
          ) : null}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {parentDocumentId ? (
        <Pressable
          onPress={() =>
            navigation.navigate("SelectChildren", {
              eventDocumentId: documentId,
              eventPrice: price,
              eventTitle: title,
            })
          }
          style={{
            position: "absolute",
            right: 16,
            left: 16,
            bottom: 20,
            backgroundColor: "#1d3f2d",
            paddingVertical: 16,
            borderRadius: 9999,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            تسجيل أحد الأبناء في الدورة
          </Text>
        </Pressable>
      ) : null}
    </SafeAreaView>
  );
}
