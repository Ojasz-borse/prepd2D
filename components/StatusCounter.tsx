import React from "react";
import { View } from "react-native";
import Svg, { Circle, Polygon, Text as SvgText } from "react-native-svg";

interface Props {
  status:
    | "answered"
    | "notAnswered"
    | "notVisited"
    | "marked"
    | "answeredMarked";
  count: number;
}

const StatusCounter: React.FC<Props> = ({ status, count }) => {
  const statusConfig = {
    answered: { color: "#70C23A", points: "16,0 34,0 45,15 45,35 5,35 5,15" }, // Green shape from image
    notAnswered: {
      color: "#EF4136",
      points: "5,0 45,0 45,20 34,35 16,35 5,20",
    },
    notVisited: {
      color: "#C5C5C5",
      points: "5,0 45,0 45,40 5,40",
    },
    marked: {
      color: "#7F5BC4",
      type: "circle",
      cx: "25",
      cy: "20",
      r: "18",
    },
    answeredMarked: {
      color: "#5636B3",
      type: "circle",
      cx: "25",
      cy: "20",
      r: "18",
    },
  }[status];

  return (
    <View style={{ width: 52, height: 38 }}>
      <Svg height="38" width="52">
        {statusConfig.type === "circle" ? (
          <Circle
            cx={statusConfig.cx}
            cy={statusConfig.cy}
            r={statusConfig.r}
            fill={statusConfig.color}
          />
        ) : (
          <Polygon fill={statusConfig.color} points={statusConfig.points} />
        )}
        <SvgText
          fill="white"
          fontSize="18"
          fontWeight="bold"
          x="26"
          y="24"
          textAnchor="middle"
        >
          {count}
        </SvgText>
      </Svg>
    </View>
  );
};

export default StatusCounter;
