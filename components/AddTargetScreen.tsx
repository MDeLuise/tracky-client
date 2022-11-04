import React, { useState } from "react";
import { StyleSheet, Text, SafeAreaView, TextInput, TouchableOpacity } from "react-native";
import { GlobalStyles } from "../common/GlobalStyles";
import { doPost } from "../common/ServerRequests";

export default function AddTargetScreen(props: any) {
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [unit, setUnit] = useState();

  const addTarget: Function = () => {
    const dataToSend: string = JSON.stringify({
      name: name,
      description: description,
      unit: unit
    });
    doPost(
      props.route.params.hostAddress + "/target",
      dataToSend,
      props.route.params.apiKey
    )
      .then((resp) => {
        if (resp.status === 200) {
          return resp.json();
        } else {
          alert("error adding target");
          return Promise.reject("server");
        }
      })
      /*.then((_dataJson) =>
        props.navigation.navigate("HomeScreen", {
          accessToken: props.route.params.accessToken,
          refreshToken: props.route.params.refreshToken,
          hostAddress: props.route.params.hostAddress,
          targetId: props.route.params.targetId,
          navigation: props.navigation
        })
      )*/
      .catch((err) => {
        if (err === "server") return;
        alert("cannot connect to the server");
        console.error(err);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={(val) => setName(val)}
        placeholder="Name" />
      <TextInput
        style={styles.input}
        onChangeText={(val) => setDescription(val)}
        placeholder="Description" />
      <TextInput
        style={styles.input}
        onChangeText={(val) => setUnit(val)}
        placeholder="Unit" />
      <TouchableOpacity
        style={{...GlobalStyles.btn, width: "80%" }}
        onPress={() => addTarget()}>
        <Text style={GlobalStyles.btnText}>Create</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 3,
    padding: 10,
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    height: 40,
    width: "80%",
    marginVertical: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
});
