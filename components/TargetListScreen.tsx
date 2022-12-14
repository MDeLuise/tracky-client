import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  FlatList,
  View,
  TouchableOpacity,
} from "react-native";
import { doDelete, doGet } from "../common/ServerRequests";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { GlobalStyles } from "../common/GlobalStyles";

export default function TargetListScreen({ route, navigation }) {
  const { hostAddress, apiKey } = route.params;
  const [targets, setTargets]: [Array<string>, Function] = useState([]);
  const [values, setValues]: [Object, Function] = useState({});
  const [units, setUnits]: [Object, Function] = useState({});
  const [loading, setLoading]: [boolean, Function] = useState(true);

  const { showActionSheetWithOptions } = useActionSheet();
  const contextMenu = (target: string) => {
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
            navigation.navigate("AddEditTarget", {
              apiKey: apiKey,
              hostAddress: hostAddress,
              name: target.name,
              description: target.description,
              unit: target.unit,
              id: target.id
            })
            break;

          case 1:
            doDelete(
              hostAddress + "/target/" + target.id,
              apiKey
            ).catch((err) => {
              if (err === "server") return;
              console.error(err);
              alert(err);
            });
            removeTargetLocally(target.id)
            break;

          case 2:
          // Canceled
        }
      }
    );
  };

  const fetchTargets: Function = () => {
    doGet(hostAddress + "/target", apiKey)
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
    doGet(hostAddress + "/target/" + targetId, apiKey)
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
          units[targetId] = dataJson["Data"]["unit"];
          setUnits({ ...units });
        }
      })
      .catch((err) => {
        if (err === "server") return;
        alert("cannot connect to the server");
        console.error(err);
      });
  };

  const removeTargetLocally = (targetId: string) => {
    console.log("deleting " + targetId)
    setTargets(targets.filter(tar => tar.id != targetId));
  }

  useEffect(() => {
    fetchTargets();
    navigation.addListener("focus", () => {
      fetchTargets();
    });
    navigation.setOptions({
      headerLeft: () => null
    })
  }, []);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Details", {
          apiKey: apiKey,
          hostAddress: hostAddress,
          targetId: item.id,
          targetName: item.name,
        })
      }
      style={{ width: "100%" }}
      onLongPress={() => contextMenu(item)}>
      <View style={GlobalStyles.item}>
        <View>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
        <Text style={styles.lastValue}>{values[item.id]} {units[item.id]}</Text>
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
              navigation.navigate("AddEditTarget", {
                apiKey: apiKey,
                hostAddress: hostAddress,
              })
            }>
            <Ionicons name="add" size={20} color={"white"} />
            <Text style={GlobalStyles.btnText}>Create New</Text>
          </TouchableOpacity>
          <FlatList
            data={targets}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.list} />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addTarget: {
    ...GlobalStyles.btn,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: 'row',
    marginTop: 20,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
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
