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
} from "react-native";
import { doGet } from "../lib/common";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }: any) {
  const [hostAddress, setHostAddress] = useState("http://localhost:3000");
  const [apiKey, setApiKey] = useState('');

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
        console.log("ok")
        try {
          AsyncStorage.setItem("key", apiKey, () => navigation.navigate("HomeScreen", {
              hostAddress: hostAddress,
              apiKey: apiKey,
              navigation: navigation,
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
    //<KeyboardAvoidingView>
    <ImageBackground
      style={styles.backgroundImg}
      resizeMode="repeat"
      source={require("../assets/dots.png")}
    >
      <SafeAreaView style={styles.container}>
        <Image style={styles.img} source={require("../assets/logo.png")} />
        <View style={styles.view}>
          <Text style={styles.text}>Login to your Account</Text>
          <TextInput
            style={styles.input}
            placeholder="Host address"
            placeholderTextColor={"grey"}
            onChangeText={(newAddress) => setHostAddress(newAddress)}
          />
          <TextInput
            style={styles.input}
            placeholder="Api Key"
            placeholderTextColor={"grey"}
            secureTextEntry={true}
            onChangeText={(newKey) => setApiKey(newKey)}
          />
          <TouchableOpacity
            style={styles.btn}
            onPress={() => login(hostAddress, apiKey)}
            >
            <Text style={styles.btnText}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
    //</KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  backgroundImg: {
    flex: 1,
  },
  btn: {
    backgroundColor: "rgb(18, 58, 221)",
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff',
    height: 50,
    width: "100%",
    justifyContent: "center",

  },
  btnText: {
    color: "#fff",
    textAlign:'center',
    paddingLeft: 10,
    paddingRight: 10,
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
  input: {
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 3,
    padding: 10,
    shadowColor: "#171717",
    //shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    height: 40,
    width: "100%",
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
