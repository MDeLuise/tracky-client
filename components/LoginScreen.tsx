import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  SafeAreaView,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { doGet } from "../common/ServerRequests";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GlobalStyles } from "../common/GlobalStyles";

export default function LoginScreen({ navigation }: any) {
  const [hostAddress, setHostAddress]: [string, Function] = useState("http://localhost:3000");
  const [apiKey, setApiKey]: [string, Function] = useState('');

  const login = (host: string, key: string) => {
    doGet(`${host}/target`, key)
      .then((resp) => {
        if (resp.status === 200) {
          return resp.json();
        } else if (resp.status == 401) {
          alert("wrong credentials");
          return Promise.reject("server");
        } else {
          alert("cannot connect to the server");
          return Promise.reject("server");
        }
      })
      .then((_dataJson) => {
        try {
          AsyncStorage.multiSet(
            [["apiKey", apiKey], ["hostAddress", hostAddress]],
            () => navigation.navigate("TabScreen", {
              hostAddress: hostAddress,
              apiKey: apiKey,
            }));
        } catch (e) {
          console.error("error persisting data", e);
        }
      })
      .catch((err) => {
        if (err === "server") return;
        alert("cannot connect to the server");
        console.error(err);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}>
      <ImageBackground
        style={styles.backgroundImg}
        resizeMode="repeat"
        source={require("../assets/dots.png")}>
        <SafeAreaView style={styles.container}>
          <Image style={styles.img} source={require("../assets/logo.png")} />
          <View style={styles.view}>
            <Text style={styles.text}>Login to your Account</Text>
            <TextInput
              style={{ ...GlobalStyles.input, width: "100%", marginVertical: 0 }}
              placeholder="Host Address"
              placeholderTextColor={"grey"}
              onChangeText={(newAddress) => setHostAddress(newAddress)} />
            <TextInput
              style={{ ...GlobalStyles.input, width: "100%", marginVertical: 0 }}
              placeholder="Api Key"
              placeholderTextColor={"grey"}
              secureTextEntry={true}
              onChangeText={(newKey) => setApiKey(newKey)} />
            <TouchableOpacity
              style={GlobalStyles.btn}
              onPress={() => login(hostAddress, apiKey)}>
              <Text style={GlobalStyles.btnText}>Login</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  backgroundImg: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  img: {
    width: 100,
    height: 100,
  },
  text: {
    fontWeight: "bold",
  },
  view: {
    flex: 0.5,
    justifyContent: "space-around",
    width: "70%",
  },
});
