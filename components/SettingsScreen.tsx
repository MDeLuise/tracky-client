import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { Text, ScrollView, TouchableOpacity } from "react-native";
import { GlobalStyles } from "../common/GlobalStyles";

export default function SettingsScreen({ route, navigation }) {
  const versionNumber: string = route.params.versionNumber;

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null
    })
  }, []);

  return (
    <ScrollView contentContainerStyle={{ alignContent: "center", alignItems: "center" }}>
      <TouchableOpacity
        style={{ ...GlobalStyles.btn, width: "80%", backgroundColor: "rgb(255, 63, 63)", marginTop: 20 }}
        onPress={() => {
          AsyncStorage.clear();
          navigation.navigate("LoginScreen");
        }}>
        <Text style={GlobalStyles.btnText}>logout</Text>
      </TouchableOpacity>
      <Text style={{ opacity: 0.5, marginTop: 10 }}>version: {versionNumber}</Text>
    </ScrollView>
  );
}
