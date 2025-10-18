import React from "react";
import { View, Text, TextInput, Pressable, Image, Alert } from "react-native";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppStore } from "../store/app";
import { useAuthStore } from "../store/auth";
import { useRegisterStore } from "../store/register";
import { SafeAreaView } from "react-native-safe-area-context";

const darkGreen = "#1d3f2d";
const darkBrown = "#241c10";

const phoneRegex = /^[0-9]{8,9}$/;

const common = {
  name: z.string().min(2, "الاسم قصير"),
  phone: z.string().regex(phoneRegex, "رقم غير صالح"),
  gender: z.enum(["male", "female"]),
  birthdate: z.string().optional(),
};

const studentSchema = z.object({
  ...common,
});

const parentSchema = z.object({
  ...common,
  role: z.enum(["father", "mother"]),
  secondary_phone: z.string().regex(phoneRegex, "رقم غير صالح").optional(),
});

export default function RegisterScreen({ navigation }: any) {
  const roleType = useAppStore((s) => s.roleType);
  const requestOtp = useAuthStore((s) => s.requestOtp);
  const setDraft = useRegisterStore((s) => s.setDraft);

  const schema = roleType === "parent" ? parentSchema : studentSchema;
  type FormValues = z.infer<typeof schema>;

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: "onChange",
    resolver: zodResolver(schema as any),
    defaultValues: (roleType === "parent"
      ? { gender: "male", role: "father" }
      : { gender: "male" }) as any,
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setDraft(data);
      await requestOtp((data as any).phone);
      navigation.navigate("Account", { screen: "Otp" });
    } catch (e: any) {
      Alert.alert("خطأ", e?.message ?? "تعذر إرسال الرمز");
    }
  };

  const label = (t: string) => (
    <Text style={{ color: darkBrown, marginBottom: 6, textAlign: "right" }}>
      {t}
    </Text>
  );

  const input = (name: keyof FormValues, props?: any) => (
    <>
      <TextInput
        onChangeText={(v) =>
          setValue(name as any, v as any, { shouldValidate: true })
        }
        {...props}
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          padding: 12,
          borderRadius: 12,
          backgroundColor: "#fff",
          textAlign: "right",
        }}
      />
      {errors[name as string] && (
        <Text style={{ color: "#ef4444", marginTop: 4 }}>
          {(errors as any)[name]?.message}
        </Text>
      )}
    </>
  );

  React.useEffect(() => {
    register("name" as any);
    register("phone" as any);
    register("gender" as any);
    register("birthdate" as any);
    if (roleType === "parent") {
      register("role" as any);
      register("secondary_phone" as any);
    }
  }, [register, roleType]);

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, paddingHorizontal: 40 }}>
      <View style={{ alignItems: "center", marginTop: 24, marginBottom: 16 }}>
        <Image
          source={require("../../assets/icon.png")}
          style={{ width: "100%", height: 64 }}
          resizeMode="contain"
        />
      </View>
      <Text
        style={{
          fontSize: 22,
          fontWeight: "700",
          textAlign: "center",
          color: darkBrown,
        }}
      >
        إنشاء حساب جديد
      </Text>
      <Text
        style={{
          textAlign: "center",
          color: "#666",
          marginTop: 6,
          marginBottom: 16,
        }}
      >
        {roleType === "parent" ? "أدخل بيانات ولي الأمر" : "أدخل بيانات الطالب"}
      </Text>

      {label("الاسم الكامل")}
      {input("name")}

      {label("رقم الهاتف")}
      {input("phone", {
        keyboardType: "phone-pad",
        placeholder: "e.g. 65790570",
      })}

      {label("الجنس")}
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
        {(["male", "female"] as const).map((g) => (
          <Pressable
            key={g}
            onPress={() =>
              setValue("gender" as any, g as any, { shouldValidate: true })
            }
            style={({ pressed }) => ({
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#ddd",
              backgroundColor: pressed ? "#f3f4f6" : "#fff",
            })}
          >
            <Text>{g === "male" ? "ذكر" : "أنثى"}</Text>
          </Pressable>
        ))}
      </View>

      {label("تاريخ الميلاد (YYYY-MM-DD)")}
      {input("birthdate", { placeholder: "2008-02-12" })}

      {roleType === "parent" && (
        <>
          {label("صفة ولي الأمر")}
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
            {(["father", "mother"] as const).map((r) => (
              <Pressable
                key={r}
                onPress={() =>
                  setValue("role" as any, r as any, { shouldValidate: true })
                }
                style={({ pressed }) => ({
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#ddd",
                  backgroundColor: pressed ? "#f3f4f6" : "#fff",
                })}
              >
                <Text>{r === "father" ? "أب" : "أم"}</Text>
              </Pressable>
            ))}
          </View>

          {label("رقم هاتف إضافي (اختياري)")}
          {input("secondary_phone" as any, { keyboardType: "phone-pad" })}
        </>
      )}

      <Pressable
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid}
        style={{
          marginTop: 16,
          backgroundColor: isValid ? darkGreen : "#9fb5aa",
          padding: 14,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16 }}>استمرار</Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate("Account", { screen: "Phone" })}
        style={{ marginTop: 12, alignItems: "center" }}
      >
        <Text style={{ color: darkGreen }}>لدي حساب بالفعل؟ تسجيل الدخول</Text>
      </Pressable>
    </SafeAreaView>
  );
}
