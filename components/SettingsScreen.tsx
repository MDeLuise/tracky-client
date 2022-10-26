import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { Button, ScrollView } from "react-native";

export default function SettingsScreen(props: any) {
  return (
    <ScrollView>
      <Button
        title="logout"
        onPress={() => {
          AsyncStorage.clear();
          props.navigation.navigate("LoginScreen");
        }}
      />
    </ScrollView>
  );
}
