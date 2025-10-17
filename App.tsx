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
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => navigation.navigate("EventDetails", { id: item.id })}
          style={{
            padding: 16,
            borderWidth: 1,
            borderColor: "#eee",
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            {item.attributes?.title}
          </Text>
          <Text>
            {item.attributes?.location} • {item.attributes?.date}
          </Text>
          <Text>{item.attributes?.price} KWD</Text>
        </Pressable>
      )}
    />
  );
}

function EventDetailsScreen({ route }: any) {
  const { id } = route.params;
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<any>(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_URL}/api/events/${id}`);
        setEvent(res.data?.data ?? null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;
  if (!event) return <Text style={{ margin: 16 }}>Event not found</Text>;

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>
        {event.attributes?.title}
      </Text>
      <Text style={{ marginTop: 8 }}>{event.attributes?.description}</Text>
      <Text style={{ marginTop: 8 }}>{event.attributes?.location}</Text>
      <Text style={{ marginTop: 8 }}>{event.attributes?.date}</Text>
      <Text style={{ marginTop: 8 }}>{event.attributes?.price} KWD</Text>
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
      </Tab.Navigator>
    </NavigationContainer>
  );
}
