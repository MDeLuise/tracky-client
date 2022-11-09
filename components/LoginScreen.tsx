import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Linking
} from "react-native";
import { doGet } from "../common/ServerRequests";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GlobalStyles } from "../common/GlobalStyles";
import WavyHeader from "./WeavyHeader";

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
      style={styles.container}>
      <WavyHeader customStyles={{ position: "absolute", top: 0, width: "100%" }} />
      <View style={styles.headerContainer}>
        {/* <Text style={styles.headerText}>Custom Header</Text> */}
      </View>
      <View style={styles.view}>
        <View>
          <Text style={styles.text1}>Login</Text>
          <Text>Don't have an account?<Text> </Text>
            <Text style={styles.text2}
              onPress={() => Linking.openURL('https://github.com/MDeLuise/tracky-client#usage')}>
              Follow the instructions
            </Text>
          </Text>
        </View>
        <View>
          <TextInput
            style={{ ...GlobalStyles.input, width: "100%" }}
            placeholder="Host Address"
            placeholderTextColor={"grey"}
            onChangeText={(newAddress) => setHostAddress(newAddress)} />
          <TextInput
            style={{ ...GlobalStyles.input, width: "100%", marginTop: 20, }}
            placeholder="Api Key"
            placeholderTextColor={"grey"}
            secureTextEntry={true}
            onChangeText={(newKey) => setApiKey(newKey)} />
        </View>
        <TouchableOpacity
          style={GlobalStyles.btn}
          onPress={() => login(hostAddress, apiKey)}>
          <Text style={GlobalStyles.btnText}>Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  text1: {
    fontWeight: "bold",
    fontSize: 50,
  },
  text2: {
    paddingTop: 10,
    fontSize: 13,
    textDecorationLine: "underline"
  },
  view: {
    flex: 0.5,
    justifyContent: "space-around",
    width: "70%",
  },
  headerContainer: {
    marginTop: 50,
    marginHorizontal: 10
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 35
  }
});
