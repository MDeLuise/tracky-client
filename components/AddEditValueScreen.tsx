import moment from "moment";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, SafeAreaView, TextInput, TouchableOpacity, Appearance } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { GlobalStyles } from "../common/GlobalStyles";
import { doPost, doPut } from "../common/ServerRequests";

export default function AddEditValueScreen({ route, navigation }) {
  const dateFormat = "DD/MM/YYYY hh:mm:ss";
  const { apiKey, hostAddress, targetId, date, id, value } = route.params;
  const [selectedValue, setSelectedValue]: [number, Function] = useState(value || 0);
  const [selectedDate, setSelectedDate]: [Date, Function] = useState(date || new Date())
  const [isVisible, setVisible]: [boolean, Function] = useState(false);

  const isUpdate: Function = () => {
    return id !== undefined;
  }

  const addValue: Function = () => {
    const dataToSend: string = JSON.stringify({
      value: selectedValue,
      target_id: targetId,
      time: selectedDate.toISOString(),
    });
    doPost(
      hostAddress + "/value",
      dataToSend,
      apiKey
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
        navigation.navigate("Details", {
          apiKey: apiKey,
          hostAddress: hostAddress,
          targetId: targetId,
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
      value: selectedValue,
      target_id: targetId,
      time: selectedDate.toISOString(),
    });
    doPut(
      hostAddress + "/value/" + id,
      dataToSend,
      apiKey
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
        navigation.navigate("Details", {
          apiKey: apiKey,
          hostAddress: hostAddress,
          targetId: targetId,
        });
      })
      .catch((err) => {
        if (err === "server") return;
        alert("cannot connecting to the server");
        console.error(err);
      });
  };


  useEffect(() => {
    navigation.setOptions({
      title: isUpdate() ? "Edit value" : "New value"
    })
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        keyboardType={"numeric"}
        style={styles.input}
        onChangeText={(val) => setSelectedValue(parseFloat(val.replace(',', '.')))}
        defaultValue={selectedValue.toString()}
        placeholder="value"
      />
      <TextInput
        style={styles.input}
        defaultValue={moment(selectedDate).format(dateFormat)}
        placeholder="date"
        onPressIn={() => setVisible(true)}
        onChangeText={(val) => setSelectedDate(moment(val, dateFormat).toDate())}
        showSoftInputOnFocus={false} />
      <DateTimePickerModal
        isVisible={isVisible}
        display={"inline"}
        isDarkModeEnabled={Appearance.getColorScheme() == "dark"} // FIXME to change
        mode="datetime"
        onConfirm={(date) => {
          setSelectedDate(date)
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
