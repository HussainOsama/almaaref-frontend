import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, Modal, FlatList } from "react-native";
import PhoneAuthModal from "../screens/PhoneAuthModal";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "../store/app";
import { listEvents } from "../lib/api";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ route }: any) {
  const [open, setOpen] = useState(false);
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const [events, setEvents] = useState<any[]>([]);
  const navigation = useNavigation<any>();
  useEffect(() => {
    if (route?.params?.openAuth) {
      setOpen(true);
    }
  }, [route?.params?.openAuth]);
  useEffect(() => {
    (async () => {
      try {
        const rows = await listEvents();
        setEvents(rows);
      } catch {}
    })();
  }, []);
  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ alignItems: "center", marginTop: 32 }}>
          <Image
            source={require("../../assets/icon.png")}
            style={{ width: "100%", height: 72, objectFit: "contain" }}
          />
        </View>

        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              marginBottom: 8,
              textAlign: "right",
              paddingHorizontal: 20,
            }}
          >
            الدورات
          </Text>
          <FlatList
            data={events}
            keyExtractor={(item) => String(item.documentId || item.id)}
            contentContainerStyle={{ paddingBottom: 24 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  const parent = (navigation as any).getParent?.();
                  if (parent) {
                    parent.navigate("EventDetails", {
                      documentId: item.documentId || String(item.id),
                    });
                  } else {
                    navigation.navigate(
                      "EventDetails" as never,
                      {
                        documentId: item.documentId || String(item.id),
                      } as never
                    );
                  }
                }}
                style={{
                  padding: 12,
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: "#eee",
                  backgroundColor: "#fff",
                  marginTop: 14,
                  // stronger, softer shadow
                  shadowColor: "#000",
                  shadowOpacity: 0.12,
                  shadowRadius: 14,
                  shadowOffset: { width: 0, height: 6 },
                  elevation: 6,
                  position: "relative",
                  marginHorizontal: 20,
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    backgroundColor: "#eaf4ef",
                    borderRadius: 16,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Ionicons name="calendar" size={14} color="#1d3f2d" />
                  <Text style={{ color: "#1d3f2d", fontSize: 12 }}>
                    {(item.date || item.attributes?.date || "")
                      .toString()
                      .slice(0, 10)}
                  </Text>
                </View>
                <View
                  style={{ flexDirection: "row-reverse", alignItems: "center" }}
                >
                  <View
                    style={{ flex: 1, paddingHorizontal: 6, marginTop: 25 }}
                  >
                    <Text
                      style={{
                        fontWeight: "800",
                        color: "#241c10",
                        textAlign: "right",
                      }}
                      numberOfLines={2}
                    >
                      {item.title || item.attributes?.title}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        marginTop: 8,
                        gap: 8,
                      }}
                    >
                      {item.location || item.attributes?.location ? (
                        <View
                          style={{
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 10,
                            backgroundColor: "#f6f6f6",
                          }}
                        >
                          <Text style={{ color: "#555", fontSize: 12 }}>
                            {item.location || item.attributes?.location}
                          </Text>
                        </View>
                      ) : null}
                      {item.available_seats ||
                      item.attributes?.available_seats ? (
                        <View
                          style={{
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 10,
                            backgroundColor: "#fff1e0",
                            borderWidth: 1,
                            borderColor: "#ffe0b3",
                          }}
                        >
                          <Text style={{ color: "#8a5a00", fontSize: 12 }}>
                            {`المقاعد: ${
                              item.available_seats ||
                              item.attributes?.available_seats
                            }`}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                    <View
                      style={{
                        flexDirection: "row-reverse",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 10,
                      }}
                    >
                      <View
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          borderRadius: 12,
                          backgroundColor: "#ffc44d",
                        }}
                      >
                        <Text style={{ color: "#241c10", fontWeight: "700" }}>
                          {item.price || item.attributes?.price
                            ? `${item.price || item.attributes?.price} KWD`
                            : ""}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: 6,
                        marginTop: 10,
                      }}
                    >
                      <Ionicons name="chevron-back" size={16} color="#1d3f2d" />
                      <Text
                        style={{
                          color: "#1d3f2d",
                          fontWeight: "700",
                          textAlign: "right",
                        }}
                      >
                        تفاصيل
                      </Text>
                    </View>
                  </View>
                  {(() => {
                    const img = item?.image || item?.attributes?.image;
                    const url = img?.url || img?.data?.attributes?.url;
                    return url ? (
                      <Image
                        source={{
                          uri: `${require("../lib/api").API_URL}${url}`,
                        }}
                        style={{
                          width: 112,
                          height: 148,
                          borderRadius: 14,
                          marginHorizontal: 6,
                        }}
                        resizeMode="cover"
                      />
                    ) : null;
                  })()}
                </View>
              </Pressable>
            )}
          />
        </View>

        {!isLoggedIn ? (
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
        ) : null}

        <Modal
          visible={open}
          animationType="slide"
          transparent
          onRequestClose={() => setOpen(false)}
        >
          <PhoneAuthModal onClose={() => setOpen(false)} />
        </Modal>
      </View>
    </SafeAreaView>
  );
}
