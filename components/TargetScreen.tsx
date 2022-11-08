import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  Text,
  View,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { doDelete, doGet } from "../common/ServerRequests";
import Ionicons from "react-native-vector-icons/Ionicons";
import ChartComponent from "./ChartComponent";
import { useActionSheet } from "@expo/react-native-action-sheet";

export default function TargetScreen({ route, navigation }) {
  const { hostAddress, apiKey, targetId, targetName } = route.params;
  const [target, setTarget]: [Object?, Function?] = useState();
  const [graphLabels, setGraphLabels]: [Array<String>, Function] = useState(
    []
  );
  const [graphValues, setGraphValues]: [Array<String>, Function] = useState(
    []
  );
  const [unit, setUnit]: [string, Function] = useState('');
  const [loading, setLoading]: [boolean, Function] = useState(true);

  const { showActionSheetWithOptions } = useActionSheet();
  const contextMenu = (item: Object) => {
    const options = ["Edit", "Delete", "Cancel"];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex: number) => {
        switch (selectedIndex) {
          case 0:
            navigation.navigate("AddEditValue", {
              apiKey: apiKey,
              hostAddress: hostAddress,
              targetId: targetId,
              id: item.id,
              value: item.value,
              date: new Date(item.time),
            })
            break;

          case 1:
            doDelete(
              hostAddress + "/value/" + item.id,
              apiKey
            )
              .then((res) => {
                if (res.status === 200) {
                  removeValueLocally(item.id, item.value, item.time)
                } else {
                  alert("error deleting the value");
                  return Promise.reject("server");
                }
              })
              .catch((err) => {
                if (err === "server") return;
                console.error(err);
                alert(err);
              });
            break;

          case 2:
          // Canceled
        }
      }
    );
  };

  const fetchTarget: Function = () => {
    doGet(
      hostAddress + "/target/" + targetId,
      apiKey
    )
      .then((resp) => {
        if (resp.status === 200) {
          return resp.json();
        } else {
          alert("cannot connect to the server");
          return Promise.reject("server");
        }
      })
      .then((dataJson) => {
        setTarget(dataJson["Data"]);
        setUnit(dataJson["Data"]["unit"])
        if (dataJson["Data"]["values"] != undefined) {
          loadGraphData(dataJson["Data"]["values"]);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (err === "server") return;
        alert("cannot connect to the server");
        console.error(err);
      });
  };

  const loadGraphData: Function = (fetchedValues: Array<string>) => {
    let labels: Array<string> = [];
    let values: Array<string> = [];
    fetchedValues.forEach((val) => {
      labels.unshift(val.time);
      values.unshift(val.value);
    });

    setGraphLabels(labels);
    setGraphValues(values);
  };

  useEffect(() => {
    navigation.setOptions({ title: targetName });
    fetchTarget();
    navigation.addListener("focus", () => {
      fetchTarget();
    });
  }, []);

  const renderValues = ({ item }: Object) => (
    <TouchableOpacity
      style={{ width: "100%" }}
      onLongPress={() => contextMenu(item)}
    >
      <View style={styles.item}>
        <Text style={styles.text}>{item.value} {unit}</Text>
        <Text style={styles.date}>{new Date(item.time).toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  const removeValueLocally = (valueId: string, valueNum: string, valueTime: string) => {
    for (let i = 0; i < graphLabels.length; i++) {
      if ((graphLabels[i] == valueTime) && (graphValues[i] == valueNum)) {
        graphLabels.splice(i, 1);
        graphValues.splice(i, 1);
        break;
      }
    }
    let targetCopy = JSON.parse(JSON.stringify(target));
    targetCopy.values = targetCopy.values.filter(val => val.id != valueId)
    setTarget(targetCopy);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
      {loading && <Text>Loading...</Text>}
      {target && (
        <>
          <ChartComponent labels={graphLabels} dataset={graphValues} />
          <FlatList
            data={target.values}
            renderItem={renderValues}
            keyExtractor={(item) => item.id}
            style={{ height: "90%", backgroundColor: "#f2f2f2" }}
          />
          <Pressable
            style={styles.addBtn}
            onPress={() =>
              navigation.navigate("AddEditValue", {
                apiKey: apiKey,
                hostAddress: hostAddress,
                targetId: targetId,
              })
            }
          >
            <Ionicons name="add" size={20} color={"white"} />
            <Text style={styles.btnText}>add value</Text>
          </Pressable>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "white",
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    width: "80%",
    alignSelf: "center",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ececec",
  },
  text: {
    color: "#151515",
  },
  date: {
    color: "#4a4a4a",
  },
  addBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    elevation: 3,
    backgroundColor: "rgb(18, 58, 221)",
    width: "100%",
    height: "10%",
    flexDirection: "row",
  },
  btnText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
