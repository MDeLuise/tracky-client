import LoginScreen from "./components/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./components/HomeScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView, Text } from "react-native";
import React, { useState } from "react";
import TargetScreen from "./components/TargetScreen";
import AddValueScreen from "./components/AddValueScreen";
import AddTargetScreen from "./components/AddTargetScreen";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

const Stack = createNativeStackNavigator();

export default function App() {
  //AsyncStorage.clear()
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [hostAddress, setHostAddress] = useState("");
  const getData = async () => {
    try {
      const storedAccessToken = await AsyncStorage.getItem("accessToken");
      setAccessToken(storedAccessToken);
      setLoggedIn(storedAccessToken !== null);
      const storedRefreshToken = await AsyncStorage.getItem("refreshToken");
      setRefreshToken(storedRefreshToken);
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
                  accessToken: accessToken,
                  refreshToken: refreshToken,
                  hostAddress: hostAddress,
                }}
                options={{ title: "Tracky" }}
              />
              <Stack.Screen
                name="TargetScreen"
                component={TargetScreen}
                options={{ title: "" }}
              />
              <Stack.Screen
                name="AddValueScreen"
                component={AddValueScreen}
                options={{ title: "New value" }}
              />
              <Stack.Screen
                name="AddTargetScreen"
                component={AddTargetScreen}
                options={{ title: "New target" }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        )}
      </SafeAreaView>
    </ActionSheetProvider>
  );
}
