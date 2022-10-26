import React from "react";
import { Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

export default function ChartComponent(props: any) {
  const screenWidth = Dimensions.get("window").width;
  const data = {
    labels: props.labels,
    datasets: [
      {
        data: props.dataset,
        //color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        //strokeWidth: 2, // optional
      },
    ],
    //legend: ["Rainy Days"], // optional
  };

  const chartConfig = {
    backgroundGradientFrom: "#f2f2f2",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#f2f2f2",
    backgroundGradientToOpacity: 0.5,

    fillShadowGradient: 0,
    fillShadowGradientOpacity: 0,
    color: (opacity = 1) => `rgb(192, 192, 192)`,
    labelColor: (opacity = 1) => `#333`,
    strokeWidth: 2,

    useShadowColorFromDataset: false,
    decimalPlaces: 2,
  };

  return (
    <LineChart
      data={data}
      width={screenWidth}
      height={220}
      yAxisInterval={2}
      chartConfig={chartConfig}
      withInnerLines={false}
      withOuterLines={false}
      bgColor={"transparent"}
      formatXLabel={() => ""}
      formatYLabel={(label) => label}
      getDotColor={() => "rgb(52, 52, 52)"}
    />
  );
}
