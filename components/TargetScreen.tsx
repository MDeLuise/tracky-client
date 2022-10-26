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
import { doDelete, doGet } from "../lib/common";
import Ionicons from "react-native-vector-icons/Ionicons";
import ChartComponent from "./ChartComponent";
import { useActionSheet } from "@expo/react-native-action-sheet";

export default function TargetScreen(props: Object) {
  const [target, setTarget]: [string?, Function?] = useState();
  const [graphLabels, setGraphLabels]: [Array<String>?, Function?] = useState(
    []
  );
  const [graphValues, setGraphValues]: [Array<String>?, Function?] = useState(
    []
  );
  const [loading, setLoading]: [boolean?, Function?] = useState(true);

  const { showActionSheetWithOptions } = useActionSheet();
  const contextMenu = (valueId: string) => {
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
            // Edit
            break;

          case 1:
            doDelete(
              props.route.params.hostAddress + "/value/" + valueId,
              props.route.params.apiKey
            )
              .then((res) => {
                //dispatchEvent(new Event("focus"));
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
      props.route.params.hostAddress + "/target/" + props.route.params.targetId,
      props.route.params.apiKey
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
    props.navigation.setOptions({ title: props.route.params.targetName });
    fetchTarget();
    props.navigation.addListener("focus", () => {
      fetchTarget();
    });
  }, []);

  const renderValues = ({ item }: Object) => (
    <TouchableOpacity
      style={{ width: "100%" }}
      onLongPress={() => contextMenu(item.id)}
    >
      <View style={styles.item}>
        <Text style={styles.text}>{item.value}</Text>
        <Text style={styles.date}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

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
              props.navigation.navigate("AddValueScreen", {
                apiKey: props.route.params.apiKey,
                hostAddress: props.route.params.hostAddress,
                targetId: props.route.params.targetId,
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
