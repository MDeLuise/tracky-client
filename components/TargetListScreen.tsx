import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  FlatList,
  View,
  TouchableOpacity,
} from "react-native";
import { doDelete, doGet } from "../lib/common";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useActionSheet } from "@expo/react-native-action-sheet";

export default function TargetListScreen(props: Object) {
  const [targets, setTargets]: [Array<string>, Function] = useState([]);
  const [values, setValues]: [Object, Function] = useState({});
  const [loading, setLoading]: [boolean, Function] = useState(true);

  const { showActionSheetWithOptions } = useActionSheet();
  const contextMenu = (targetId: string) => {
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
              props.hostAddress + "/target/" + targetId,
              props.accessToken
            ).catch((err) => {
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

  const fetchTargets: Function = () => {
    doGet(props.hostAddress + "/target", props.accessToken)
      .then((resp) => {
        if (resp.status === 200) {
          return resp.json();
        } else {
          alert("cannot connect to the server");
          return Promise.reject("server");
        }
      })
      .then((dataJson) => {
        setTargets(dataJson["Data"]);
        fetchLastValues(dataJson["Data"]);
        setLoading(false);
      })
      .catch((err) => {
        if (err === "server") return;
        alert("cannot connect to the server");
        console.error(err);
      });
  };

  const fetchLastValues: Function = (targetsObj) => {
    targetsObj.forEach((target) => fetchLastValueOfTarget(target.id));
  };

  const fetchLastValueOfTarget: Function = (targetId: string) => {
    doGet(props.hostAddress + "/target/" + targetId, props.accessToken)
      .then((resp) => {
        if (resp.status === 200) {
          return resp.json();
        } else {
          alert("cannot connect to the server");
          return Promise.reject("server");
        }
      })
      .then((dataJson) => {
        if (dataJson["Data"]["values"] != undefined) {
          values[targetId] = dataJson["Data"]["values"][0]["value"];
          setValues({ ...values });
        }
      })
      .catch((err) => {
        if (err === "server") return;
        alert("cannot connect to the server");
        console.error(err);
      });
  };

  useEffect(() => {
    fetchTargets();
    props.navigation.addListener("focus", () => {
      fetchTargets();
    });
  }, []);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() =>
        props.navigation.navigate("TargetScreen", {
          accessToken: props.accessToken,
          refreshToken: props.refreshToken,
          hostAddress: props.hostAddress,
          targetId: item.id,
          targetName: item.name,
        })
      }
      style={{ width: "100%" }}
      onLongPress={() => contextMenu(item.id)}
    >
      <View style={styles.item}>
        <View>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
        <Text style={styles.lastValue}>{values[item.id]}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading && <Text>Loading...</Text>}
      {targets && (
        <>
          <TouchableOpacity
            style={styles.addTarget}
            onPress={() =>
              props.navigation.navigate("AddTargetScreen", {
                accessToken: props.accessToken,
                refreshToken: props.refreshToken,
                hostAddress: props.hostAddress,
                //navigation: props.navigation
              })
            }>
            <Ionicons name="add" size={20} color={"white"} />
            <Text style={styles.btnText}>Create New</Text>
          </TouchableOpacity>
          <FlatList
            data={targets}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addTarget: {
    backgroundColor: "rgb(18, 58, 221)",
    borderRadius: 10,
    //borderWidth: 1,
    //borderColor: '#fff',
    height: 50,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: 'row',
    marginTop: 20,
    fontWeight: "bold",
  },
  btnText: {
    color: "white",
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
  title: {
    color: "#151515",
    fontSize: 24,
  },
  description: {
    color: "#4a4a4a",
  },
  lastValue: {
    color: "#4a4a4a",
  },
  list: {
    width: "100%",
  },
});
