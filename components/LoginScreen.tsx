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
import { doPost } from "../lib/common";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }: any) {
  const [hostAddress, setHostAddress] = useState("http://localhost:3000");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");

  const login = (host: string, username: string, password: string) => {
    const dataToSend: string = JSON.stringify({
      username: username,
      password: password,
    });
    let accessToken: string = "";
    let refreshToken: string = "";
    doPost(host + "/auth/login", dataToSend)
      .then((resp) => {
        if (resp.status === 200) {
          return resp.json();
        } else if (resp.status == 401) {
          alert("wrong username or password");
          return Promise.reject("server");
        } else {
          alert("cannot connect to the server");
          return Promise.reject("server");
        }
      })
      .then((dataJson) => {
        refreshToken = dataJson["Data"]["refresh_token"];
        accessToken = dataJson["Data"]["token"];
        try {
          AsyncStorage.multiSet(
            [
              ["accessToken", accessToken],
              ["refreshToken", refreshToken],
              ["hostAddress", hostAddress],
            ],
            () =>
              navigation.navigate("HomeScreen", {
                accessToken: accessToken,
                refreshToken: refreshToken,
                hostAddress: hostAddress,
                navigation: navigation,
              })
          );
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
            placeholder="Username"
            placeholderTextColor={"grey"}
            onChangeText={(newUsername) => setUsername(newUsername)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={"grey"}
            secureTextEntry={true}
            onChangeText={(newPassword) => setPassword(newPassword)}
          />
          <TouchableOpacity
            style={styles.btn}
            onPress={() => login(hostAddress, username, password)}
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
