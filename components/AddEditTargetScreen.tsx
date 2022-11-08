import React, { useEffect, useState } from "react";
import { StyleSheet, Text, SafeAreaView, TextInput, TouchableOpacity } from "react-native";
import { GlobalStyles } from "../common/GlobalStyles";
import { doPost, doPut } from "../common/ServerRequests";

export default function AddTargetScreen({ route, navigation }) {
  const { hostAddress, apiKey, description, name, unit, id } = route.params;
  const [selectedName, setSelectedName]: [string, Function] = useState(name || name);
  const [selectedDescription, setSelectedDescription]: [string, Function] = useState(description || "");
  const [selectedUnit, setSelectedUnit]: [string, Function] = useState(unit || unit);

  const isUpdate: Function = () => {
    return name !== undefined
  }

  const addTarget: Function = () => {
    const dataToSend: string = JSON.stringify({
      name: selectedName,
      description: selectedDescription,
      unit: selectedUnit
    });
    doPost(
      hostAddress + "/target",
      dataToSend,
      apiKey
    )
      .then((resp) => {
        if (resp.status === 200) {
          return resp.json();
        } else {
          alert("error adding target");
          return Promise.reject("server");
        }
      })
      .then((_resp) => {
        navigation.navigate("Targets");
      })
      .catch((err) => {
        if (err === "server") return;
        alert("cannot connect to the server");
        console.error(err);
      });
  };

  const updateTarget: Function = () => {
    const dataToSend: string = JSON.stringify({
      name: selectedName,
      description: selectedDescription,
      unit: selectedUnit
    });
    doPut(
      hostAddress + "/target/" + id,
      dataToSend,
      apiKey
    )
      .then((resp) => {
        if (resp.status === 200) {
          return resp.json();
        } else {
          alert("error updating target");
          return Promise.reject("server");
        }
      })
      .then((_resp) => {
        navigation.navigate("Targets");
      })
      .catch((err) => {
        if (err === "server") return;
        alert("cannot connecting to the server");
        console.error(err);
      });
  };

  useEffect(() => {
    navigation.setOptions({
      title: isUpdate() ? "Edit target" : "New target"
    })
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={(val) => setSelectedName(val)}
        placeholder="Name"
        defaultValue={selectedName} />
      <TextInput
        style={styles.input}
        onChangeText={(val) => setSelectedDescription(val)}
        placeholder="Description"
        defaultValue={selectedDescription} />
      <TextInput
        style={styles.input}
        onChangeText={(val) => setSelectedUnit(val)}
        placeholder="Unit"
        defaultValue={selectedUnit} />
      <TouchableOpacity
        style={{ ...GlobalStyles.btn, width: "80%" }}
        onPress={() => isUpdate() ? updateTarget() : addTarget()}>
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
