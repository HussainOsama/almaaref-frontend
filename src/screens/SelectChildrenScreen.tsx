import React, { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import { useAppStore } from "../store/app";
import {
  listRegistrationsForEventByParent,
  listStudentsByParentDoc,
  createRegistration,
  upaymentsMakeCharge,
  upaymentsGetStatus,
} from "../lib/api";

export default function SelectChildrenScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { eventDocumentId, eventPrice, eventTitle } = route.params || {};
  const parentDocumentId = useAppStore((s) => s.parentDocumentId);
  const [children, setChildren] = useState<any[]>([]);
  const [registeredDocs, setRegisteredDocs] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      if (!parentDocumentId || !eventDocumentId) return;
      const kids = await listStudentsByParentDoc(parentDocumentId);
      setChildren(kids);
      const regs = await listRegistrationsForEventByParent(
        eventDocumentId,
        parentDocumentId
      );
      const docs = new Set<string>();
      for (const r of regs) {
        const sd =
          r?.student?.documentId ||
          r?.attributes?.student?.data?.attributes?.documentId;
        if (sd) docs.add(sd);
      }
      setRegisteredDocs(docs);
      setSelected(new Set(docs));
    })();
  }, [parentDocumentId, eventDocumentId]);

  const toggle = (doc: string) => {
    if (registeredDocs.has(doc)) return;
    const next = new Set(selected);
    if (next.has(doc)) next.delete(doc);
    else next.add(doc);
    setSelected(next);
  };

  const canSave = useMemo(() => {
    for (const doc of selected) {
      if (!registeredDocs.has(doc)) return true;
    }
    return false;
  }, [selected, registeredDocs]);

  const onSave = async () => {
    try {
      setSaving(true);
      const newDocs = Array.from(selected).filter(
        (d) => !registeredDocs.has(d)
      );
      if (newDocs.length === 0) {
        setSaving(false);
        return;
      }
      const priceNum = Number(eventPrice || 0);
      if (!priceNum) {
        Alert.alert("", "سعر الدورة غير متوفر");
        setSaving(false);
        return;
      }
      const total = priceNum * newDocs.length;

      // Build customer from first selected child
      const firstDoc = newDocs[0];
      const firstChild = children.find(
        (c) => (c.documentId || c?.attributes?.documentId) === firstDoc
      ) as any;
      const attrs = (firstChild && (firstChild.attributes || firstChild)) || {};
      const customerName = attrs.name || "بدون اسم";
      const customerPhone = attrs.phone || undefined;
      const customerEmail = attrs.email || undefined;

      // Initiate charge (hosted checkout)
      const charge = await upaymentsMakeCharge({
        amount: total,
        currency: "KWD",
        customerName,
        customerPhone,
        customerEmail,
        orderId: `EV-${eventDocumentId}-${Date.now()}`,
        orderDescription: eventTitle || "Event Registration",
        lang: "ar",
        methods: "all",
        productName: eventTitle || "Event",
        productDescription: eventTitle || "Event",
        unitPrice: priceNum,
        quantity: newDocs.length,
      });
      console.log(charge);
      const redirectUrl = charge?.redirectUrl;
      const chargeId = charge?.chargeId;
      if (!redirectUrl || !chargeId) throw new Error("فشل إنشاء عملية الدفع");

      await WebBrowser.openBrowserAsync(redirectUrl, {
        enableBarCollapsing: true,
        showTitle: true,
      });

      // Poll for payment status after the in-app browser is closed
      let statusOk = false;
      for (let i = 0; i < 10; i++) {
        await new Promise((r) => setTimeout(r, 3000));
        const statusResp = await upaymentsGetStatus(chargeId);
        const status = String(statusResp?.status || "").toLowerCase();
        if (/success|paid|approved/.test(status)) {
          statusOk = true;
          break;
        }
      }
      if (!statusOk) {
        Alert.alert("", "لم تكتمل عملية الدفع");
        setSaving(false);
        return;
      }

      // Create registrations after successful payment
      for (const doc of newDocs) {
        await createRegistration(eventDocumentId, doc);
      }
      Alert.alert("", "تم تسجيل الأبناء ودفع الرسوم ✅");
      navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert("", "تعذر الحفظ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "800", textAlign: "right" }}>
        اختر الأبناء
      </Text>
      <FlatList
        style={{ marginTop: 12 }}
        data={children}
        keyExtractor={(it) => String(it.documentId || it.id)}
        renderItem={({ item }) => {
          const name = item?.name || item?.attributes?.name || "—";
          const doc = item?.documentId || item?.attributes?.documentId;
          const isRegistered = registeredDocs.has(doc);
          const isSelected = selected.has(doc);
          return (
            <Pressable
              onPress={() => toggle(doc)}
              style={{
                padding: 14,
                borderWidth: 1,
                borderColor: isSelected ? "#1d3f2d" : "#eee",
                borderRadius: 14,
                backgroundColor: isSelected ? "#eaf4ef" : "#fff",
                marginBottom: 10,
                flexDirection: "row-reverse",
                justifyContent: "space-between",
                alignItems: "center",
                opacity: isRegistered ? 0.85 : 1,
              }}
            >
              <Text style={{ textAlign: "right" }}>{name}</Text>
              <Text style={{ color: isRegistered ? "#1d3f2d" : "#999" }}>
                {isRegistered ? "مسجل" : "غير مسجل"}
              </Text>
            </Pressable>
          );
        }}
      />
      <View style={{ flexDirection: "row-reverse", gap: 10, marginTop: 12 }}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#241c10",
            paddingVertical: 14,
            borderRadius: 9999,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#241c10", fontWeight: "700" }}>إلغاء</Text>
        </Pressable>
        <Pressable
          disabled={!canSave || saving}
          onPress={onSave}
          style={{
            flex: 1,
            backgroundColor: canSave ? "#1d3f2d" : "#8aa196",
            paddingVertical: 14,
            borderRadius: 9999,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            {saving ? "..." : "حفظ"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
