import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import TargetListScreen from "./TargetListScreen";
import SettingsScreen from "./SettingsScreen";

const sampleTabNavigation = createBottomTabNavigator();

export default function HomeScreen(props: any) {
  return (
    <NavigationContainer independent={true}>
      <sampleTabNavigation.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = "md-home-sharp";
            } else if (route.name === "Settings") {
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
        <sampleTabNavigation.Screen
          name="Home"
          children={() => (
            <TargetListScreen
              apiKey={props.route.params.apiKey}
              hostAddress={props.route.params.hostAddress}
              navigation={props.navigation} />
          )} />

        <sampleTabNavigation.Screen
          name="Settings"
          children={() => (
            <SettingsScreen
              navigation={props.navigation}
              versionNumber={props.route.params.versionNumber} />
          )} />
      </sampleTabNavigation.Navigator>
    </NavigationContainer>
  );
}
