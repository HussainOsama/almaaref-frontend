import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  FlatList,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// DateTimePicker is supported in Expo SDK; if not, we can fallback to manual text input
// eslint-disable-next-line @typescript-eslint/no-var-requires
import DateTimePicker from "@react-native-community/datetimepicker";
import { createStudent } from "../lib/api";
import { useAppStore } from "../store/app";

export default function AddChildScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [showDate, setShowDate] = useState(false);
  const [grade, setGrade] = useState<string>("");
  const [gradeOpen, setGradeOpen] = useState(false);
  const [gender, setGender] = useState<"male" | "female">("male");
  const parentDocumentId = useAppStore((s) => s.parentDocumentId);

  const gradeOptions = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const fmtLocal = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${da}`;
  };
  const formattedDate = date ? fmtLocal(date) : "";

  const canContinue = name && date && grade;

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", textAlign: "center" }}>
        إضافة طفل
      </Text>
      <Text
        style={{
          textAlign: "center",
          color: "#666",
          marginTop: 6,
          marginBottom: 16,
        }}
      >
        أدخل بيانات الطفل للتسجيل في الفعاليات
      </Text>

      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 16,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <Text style={{ marginBottom: 6, textAlign: "right" }}>الجنس</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          {[
            { k: "female", t: "بنت", icon: "👧" },
            { k: "male", t: "ولد", icon: "👦" },
          ].map((o) => (
            <Pressable
              key={o.k}
              onPress={() => setGender(o.k as any)}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginHorizontal: 4,
                paddingVertical: 10,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: gender === o.k ? "#1d3f2d" : "#ddd",
                backgroundColor: "#fff",
              }}
            >
              <Text>{o.icon}</Text>
              <Text>{o.t}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={{ marginBottom: 6, textAlign: "right" }}>
          الاسم الكامل
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="الاسم الثلاثي"
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            padding: 12,
            borderRadius: 12,
            marginBottom: 12,
            textAlign: "right",
          }}
        />

        <Text style={{ marginBottom: 6, textAlign: "right" }}>
          تاريخ الميلاد
        </Text>
        <Pressable
          onPress={() => setShowDate(true)}
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            padding: 12,
            borderRadius: 12,
            marginBottom: 12,
            backgroundColor: "#fff",
          }}
        >
          <Text
            style={{
              textAlign: "right",
              color: formattedDate ? "#000" : "#999",
            }}
          >
            {formattedDate || "اختر التاريخ"}
          </Text>
        </Pressable>

        <Text style={{ marginBottom: 6, textAlign: "right" }}>
          الصف الدراسي
        </Text>
        <Pressable
          onPress={() => setGradeOpen(true)}
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            padding: 12,
            borderRadius: 12,
            backgroundColor: "#fff",
          }}
        >
          <Text style={{ textAlign: "right", color: grade ? "#000" : "#999" }}>
            {grade || "اختر الصف (1 - 12)"}
          </Text>
        </Pressable>
      </View>

      <Modal
        transparent
        visible={showDate}
        animationType="fade"
        onRequestClose={() => setShowDate(false)}
      >
        <Pressable
          onPress={() => setShowDate(false)}
          style={{
            flex: 1,
            backgroundColor: "#0006",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{ backgroundColor: "#fff", borderRadius: 16, padding: 12 }}
          >
            <DateTimePicker
              value={date || new Date(2012, 0, 1)}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={(_: any, selected?: Date) => {
                if (Platform.OS !== "ios") setShowDate(false);
                if (selected) {
                  // Normalize to local midnight to avoid UTC timezone shift
                  const normalized = new Date(
                    selected.getFullYear(),
                    selected.getMonth(),
                    selected.getDate(),
                    0,
                    0,
                    0,
                    0
                  );
                  setDate(normalized);
                }
              }}
            />
            {Platform.OS === "ios" && (
              <Pressable
                onPress={() => setShowDate(false)}
                style={{ marginTop: 8, alignItems: "center" }}
              >
                <Text style={{ color: "#1d3f2d" }}>تم</Text>
              </Pressable>
            )}
          </View>
        </Pressable>
      </Modal>

      <Modal
        transparent
        visible={gradeOpen}
        animationType="fade"
        onRequestClose={() => setGradeOpen(false)}
      >
        <Pressable
          onPress={() => setGradeOpen(false)}
          style={{
            flex: 1,
            backgroundColor: "#0006",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              width: "80%",
              maxHeight: 360,
              borderRadius: 16,
              padding: 12,
            }}
          >
            <Text
              style={{
                fontWeight: "700",
                fontSize: 16,
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              اختر الصف
            </Text>
            <FlatList
              data={gradeOptions}
              keyExtractor={(i) => i}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setGrade(item);
                    setGradeOpen(false);
                  }}
                  style={{
                    padding: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: "#eee",
                  }}
                >
                  <Text style={{ textAlign: "center" }}>{item}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>

      <Pressable
        onPress={async () => {
          if (!name || !date || !grade) return;
          if (!parentDocumentId) {
            alert("يرجى إكمال بيانات ولي الأمر أولاً");
            return;
          }
          try {
            await createStudent({
              name,
              birthdate: fmtLocal(date),
              gender,
              parentDocumentId,
            });
            navigation.replace("ChildrenList");
          } catch (e: any) {
            console.log(
              "createStudent error",
              e?.response?.data || e?.message || e
            );
            alert("تعذر حفظ بيانات الطفل. تأكد من الأذونات واتصال الشبكة.");
          }
        }}
        disabled={!canContinue}
        style={{
          position: "absolute",
          right: 20,
          bottom: 20,
          backgroundColor: !canContinue ? "#9fb5aa" : "#1d3f2d",
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18 }}>→</Text>
      </Pressable>
    </SafeAreaView>
  );
}
