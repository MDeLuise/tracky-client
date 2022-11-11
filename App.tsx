import LoginScreen from "./components/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView, Text } from "react-native";
import React, { useState } from "react";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SettingsScreen from "./components/SettingsScreen";
import TargetListScreen from "./components/TargetListScreen";
import TargetScreen from "./components/TargetScreen";
import AddEditValueScreen from "./components/AddEditValueScreen";
import AddEditTargetScreen from "./components/AddEditTargetScreen";
import Ionicons from "react-native-vector-icons/Ionicons";


const Tab = createBottomTabNavigator();

export default function App() {
  //AsyncStorage.clear()
  const [loggedIn, setLoggedIn]: [boolean, Function] = useState(false);
  const [loading, setLoading]: [boolean, Function] = useState(true);
  const [apiKey, setApiKey]: [string, Function] = useState("");
  const [hostAddress, setHostAddress]: [string, Function] = useState("");
  const versionNumber: String = "1.0.0"
  
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


  const TargetStack = createNativeStackNavigator();
  function TargetStackScreen({route}: any) {
    const { apiKey, hostAddress} = route.params;
    return (
      <TargetStack.Navigator>
        <TargetStack.Screen name="Targets" component={TargetListScreen}
          initialParams={{
            apiKey: apiKey,
            hostAddress: hostAddress,
          }} />
        <TargetStack.Screen name="Details" component={TargetScreen} />
        <TargetStack.Screen name="AddEditTarget" component={AddEditTargetScreen} />
        <TargetStack.Screen name="AddEditValue" component={AddEditValueScreen} />
      </TargetStack.Navigator>
    )
  }

  const SettingsStack = createNativeStackNavigator();
  function SettingsTabStack() {
    return (
      <SettingsStack.Navigator>
        <TargetStack.Screen name="Settings" component={SettingsScreen}
          initialParams={{
            versionNumber: versionNumber,
          }} />
      </SettingsStack.Navigator>
    )
  }

  function TabScreen({route}: any) {
    return (
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "TargetScreen") {
            iconName = "md-home-sharp";
          } else if (route.name === "SettingsTabStack") {
            iconName = "md-settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: "rgb(32,53,135)",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: [
          {
            display: "flex",
          },
          null,
        ],
      })}>
        <Tab.Screen options={{title: "Home"}} name="TargetScreen" component={TargetStackScreen}
          initialParams={{
            versionNumber: versionNumber,
            apiKey: apiKey || route.params.apiKey,
            hostAddress: hostAddress || route.params.hostAddress,
          }} />

        <Tab.Screen options={{title: "Settings"}} name="SettingsTabStack" component={SettingsTabStack} />
      </Tab.Navigator>
    )
  }

  const AppStack = createNativeStackNavigator();
  return (
    <ActionSheetProvider>
      <SafeAreaView style={{ flex: 1 }}>
        {loading && <Text>loading...</Text>}
        {!loading && (
          <NavigationContainer>
            <AppStack.Navigator
              screenOptions={{
                headerShown: false,
              }}
              initialRouteName={loggedIn ? "TabScreen" : "LoginScreen"}
            >
              <AppStack.Screen name="LoginScreen" component={LoginScreen} />
              <AppStack.Screen
                name="TabScreen"
                component={TabScreen}
              />
            </AppStack.Navigator>
          </NavigationContainer>
        )}
      </SafeAreaView>
    </ActionSheetProvider>
  );
}
