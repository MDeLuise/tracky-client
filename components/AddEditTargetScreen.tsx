import React, { useState } from "react";
import { StyleSheet, Text, SafeAreaView, TextInput, TouchableOpacity } from "react-native";
import { GlobalStyles } from "../common/GlobalStyles";
import { doPost, doPut } from "../common/ServerRequests";

export default function AddTargetScreen(props: any) {
  const [name, setName] = useState(props.route.params.name);
  const [description, setDescription] = useState(props.route.params.description);
  const [unit, setUnit] = useState(props.route.params.unit);

  const isUpdate: Function = () => {
    return props.route.params.name !== undefined
  }

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
      .catch((err) => {
        if (err === "server") return;
        alert("cannot connect to the server");
        console.error(err);
      });
  };

  const updateTarget: Function = () => {
    const dataToSend: string = JSON.stringify({
      name: name,
      description: description,
      unit: unit
    });
    doPut(
      props.route.params.hostAddress + "/target/" + props.route.params.id,
      dataToSend,
      props.route.params.apiKey
    )
      .then((resp) => {
        if (resp.status === 200) {
          return resp.json();
        } else {
          alert("error updating target");
          return Promise.reject("server");
        }
      })
      .catch((err) => {
        if (err === "server") return;
        alert("cannot connecting to the server");
        console.error(err);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={(val) => setName(val)}
        placeholder="Name"
        defaultValue={props.route.params.name} />
      <TextInput
        style={styles.input}
        onChangeText={(val) => setDescription(val)}
        placeholder="Description"
        defaultValue={props.route.params.description} />
      <TextInput
        style={styles.input}
        onChangeText={(val) => setUnit(val)}
        placeholder="Unit"
        defaultValue={props.route.params.unit} />
      <TouchableOpacity
        style={{...GlobalStyles.btn, width: "80%" }}
        onPress={() => isUpdate() ?  updateTarget() : addTarget()}>
        <Text style={GlobalStyles.btnText}>
          {isUpdate() ? "Update" : "Create"}
        </Text>
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
