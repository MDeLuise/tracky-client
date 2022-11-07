import React, { useState } from "react";
import { StyleSheet, Text, SafeAreaView, TextInput, TouchableOpacity, Appearance } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { GlobalStyles } from "../common/GlobalStyles";
import { doPost, doPut } from "../common/ServerRequests";

export default function AddEditValueScreen(props: any) {
  const [value, setValue]: [number, Function] = useState(props.route.params.value);
  const [date, setDate]: [Date, Function] = useState(props.route.params.date)
  const [isVisible, setVisible]: [boolean, Function] = useState(false);

  const isUpdate: Function = () => {
    return props.route.params.id !== undefined;
  }

  const addValue: Function = () => {
    const dataToSend: string = JSON.stringify({
      value: value,
      target_id: props.route.params.targetId,
      time: new Date(date),
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
        alert("cannot connecting to the server");
        console.error(err);
      });
  };

  const updateValue: Function = () => {
    const dataToSend: string = JSON.stringify({
      value: value,
      target_id: props.route.params.targetId,
      time: new Date(date),
    });
    doPut(
      props.route.params.hostAddress + "/value/" + props.route.params.id,
      dataToSend,
      props.route.params.apiKey
    )
      .then((resp) => {
        if (resp.status === 200) {
          return resp.json();
        } else {
          alert("error updating value");
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
        alert("cannot connecting to the server");
        console.error(err);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        keyboardType={"numeric"}
        style={styles.input}
        onChangeText={(val) => setValue(parseFloat(val.replace(',', '.')))}
        defaultValue={props.route.params.value.toString()}
        placeholder="value"
      />
      <TextInput
        style={styles.input}
        defaultValue={date.toLocaleString()}
        placeholder="date"
        onPressIn={() => setVisible(true)}
        onChangeText={(val) => setDate(val)}
        showSoftInputOnFocus={false} />
      <DateTimePickerModal
        isVisible={isVisible}
        display={"inline"}
        isDarkModeEnabled={Appearance.getColorScheme() == "dark"} // FIXME to change
        mode="datetime"
        onConfirm={(date) => {
          setDate(date)
          setVisible(false)
        }}
        onCancel={() => setVisible(false)}
      />
      <TouchableOpacity
        style={{ ...GlobalStyles.btn, width: "80%" }}
        onPress={() => isUpdate() ? updateValue() : addValue()}>
        <Text style={GlobalStyles.btnText}>
          {isUpdate() ? "Update" : "Add"}
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
