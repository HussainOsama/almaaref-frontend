import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";
import PhoneScreen from "./src/screens/PhoneScreen";
import OtpScreen from "./src/screens/OtpScreen";
import SplashScreen from "./src/screens/SplashScreen";
import RoleSelectionScreen from "./src/screens/RoleSelectionScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ParentSignupStep1 from "./src/screens/ParentSignupStep1";
import ParentSignupStep2 from "./src/screens/ParentSignupStep2";
import ParentSignupStep3 from "./src/screens/ParentSignupStep3";
import AddChildScreen from "./src/screens/AddChildScreen";
import ChildrenListScreen from "./src/screens/ChildrenListScreen";
import StudentSignupScreen from "./src/screens/StudentSignupScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAppStore } from "./src/store/app";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:1337";

function EventsScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_URL}/api/events`);
        setEvents(res.data?.data ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => String(item.documentId || item.id)}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <Pressable
          onPress={() =>
            navigation.navigate("EventDetails", {
              documentId: item.documentId || String(item.id),
            })
          }
          style={{
            padding: 16,
            borderWidth: 1,
            borderColor: "#eee",
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600" }}>{item.title}</Text>
          <Text>
            {item.date} • {item.location}
          </Text>
          <Text>{item.price} KWD</Text>
        </Pressable>
      )}
    />
  );
}

function EventDetailsScreen({ route }: any) {
  const { documentId } = route.params;
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<any>(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_URL}/api/events`, {
          params: { "filters[documentId][$eq]": documentId },
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

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>{event.title}</Text>
      <Text style={{ marginTop: 8 }}>{event.description}</Text>
      <Text style={{ marginTop: 8 }}>{event.location}</Text>
      <Text style={{ marginTop: 8 }}>{event.date}</Text>
      <Text style={{ marginTop: 8 }}>{event.price} KWD</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();
function EventsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Events" component={EventsScreen} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
    </Stack.Navigator>
  );
}

function AccountStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Phone"
        component={PhoneScreen}
        options={{ title: "Get started" }}
      />
      <Stack.Screen
        name="Otp"
        component={OtpScreen}
        options={{ title: "Verify" }}
      />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
function MainTabs() {
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const accountType = useAppStore((s) => s.accountType);
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#1d3f2d",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: { height: 60 },
        tabBarIcon: ({ color, size }) => {
          const name =
            route.name === "Home"
              ? "home"
              : route.name === "Browse"
              ? "calendar"
              : route.name === "Children"
              ? "people"
              : "settings";
          return <Ionicons name={name as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "الرئيسية" }}
      />
      <Tab.Screen
        name="Browse"
        component={EventsStack}
        options={{ title: "الفعاليات" }}
      />
      {isLoggedIn && accountType === "parent" ? (
        <Tab.Screen
          name="Children"
          component={ChildrenListScreen}
          options={{ title: "أبنائي" }}
        />
      ) : null}
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "الإعدادات" }}
      />
    </Tab.Navigator>
  );
}

const RootStack = createNativeStackNavigator();
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="ParentDashboard" component={MainTabs} />
          <RootStack.Screen name="Splash" component={SplashScreen} />
          <RootStack.Screen
            name="RoleSelection"
            component={RoleSelectionScreen}
          />
          <RootStack.Screen name="Register" component={RegisterScreen} />
          <RootStack.Screen
            name="ParentSignupStep1"
            component={ParentSignupStep1}
          />
          <RootStack.Screen
            name="ParentSignupStep2"
            component={ParentSignupStep2}
          />
          <RootStack.Screen
            name="ParentSignupStep3"
            component={ParentSignupStep3}
          />
          <RootStack.Screen name="AddChild" component={AddChildScreen} />
          <RootStack.Screen
            name="ChildrenList"
            component={ChildrenListScreen}
          />
          <RootStack.Screen
            name="StudentSignup"
            component={StudentSignupScreen}
          />
          <RootStack.Screen name="Account" component={AccountStack} />
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
