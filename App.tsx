import LoginScreen from "./components/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./components/HomeScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView, Text } from "react-native";
import React, { useState } from "react";
import TargetScreen from "./components/TargetScreen";
import AddEditValueScreen from "./components/AddEditValueScreen";
import AddEditTargetScreen from "./components/AddEditTargetScreen";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

const Stack = createNativeStackNavigator();

export default function App() {
  //AsyncStorage.clear()
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [hostAddress, setHostAddress] = useState("");
  const versionNumber: String = "1.0.0-SNAPSHOT"
  const getData = async () => {
    try {
      const storedApiKey = await AsyncStorage.getItem("apiKey");
      setApiKey(storedApiKey);
      setLoggedIn(storedApiKey !== null);
      const storedHostAddress = await AsyncStorage.getItem("hostAddress");
      setHostAddress(storedHostAddress);
      setLoading(false);
    } catch (e) {
      console.error("error retrieving data", e);
    }
  };
  getData();

  return (
    <ActionSheetProvider>
      <SafeAreaView style={{ flex: 1 }}>
        {loading && <Text>loading...</Text>}
        {!loading && (
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerBackVisible: true,
                headerLeft: undefined,
                headerBackTitleVisible: false,
              }}
              initialRouteName={loggedIn ? "HomeScreen" : "LoginScreen"}
            >
              <Stack.Screen name="LoginScreen" component={LoginScreen} />
              <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                initialParams={{
                  apiKey: apiKey,
                  hostAddress: hostAddress,
                  versionNumber: versionNumber,
                }}
                options={{ title: "Tracky" }}
              />
              <Stack.Screen
                name="TargetScreen"
                component={TargetScreen}
                options={{ title: "" }}
              />
              <Stack.Screen
                name="AddEditValueScreen"
                component={AddEditValueScreen}
                options={{ title: "New value" }}
              />
              <Stack.Screen
                name="AddEditTargetScreen"
                component={AddEditTargetScreen}
                options={{ title: "New target" }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        )}
      </SafeAreaView>
    </ActionSheetProvider>
  );
}
