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

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:1337";

function EventsScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_URL}/api/events`);
        // Strapi v5 default response is flat (no attributes)
        setEvents(res.data?.data ?? []);
        console.log(res.data);
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
        // Fetch by documentId (Strapi v5)
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
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Browse"
          component={EventsStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Account"
          component={AccountStack}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
