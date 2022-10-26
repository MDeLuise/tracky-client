import React, { useState } from "react";
import { StyleSheet, Button, SafeAreaView } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { doPost } from "../lib/common";

export default function AddValueScreen(props: any) {
  const [value, setValue] = useState();

  const addValue: Function = () => {
    const dataToSend: string = JSON.stringify({
      value: parseFloat(value),
      target_id: props.route.params.targetId,
      time: new Date(),
    });
    doPost(
      props.route.params.hostAddress + "/value",
      dataToSend,
      props.route.params.apiKey
    )
      .then((resp) => {
        if (resp.status === 200) {
          return resp.json();
        } else {
          alert("error adding value");
          return Promise.reject("server");
        }
      })
      .then((_dataJson) => {
        props.navigation.navigate("TargetScreen", {
          apiKey: props.route.params.apiKey,
          hostAddress: props.route.params.hostAddress,
          targetId: props.route.params.targetId,
        });
      })
      .catch((err) => {
        if (err === "server") return;
        alert("cannot connect to the server");
        console.error(err);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        keyboardType={"number-pad"}
        style={styles.input}
        onChangeText={(val) => setValue(val)}
        placeholder="value"
      />
      <Button title="add" onPress={() => addValue()} />
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
