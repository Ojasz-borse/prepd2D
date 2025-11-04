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
  size?: number;
}

const StatusCounter: React.FC<Props> = ({ status, count, size = 1 }) => {
  const baseWidth = 40; // Reduced from 52
  const baseHeight = 38;

  const scale = (val: number) => val * size;

  const statusConfig = {
    answered: {
      color: "#70C23A",
      points: [
        [12, 0],
        [28, 0],
        [38, 15],
        [38, 35],
        [2, 35],
        [2, 15],
      ],
    },
    notAnswered: {
      color: "#EF4136",
      points: [
        [2, 0],
        [38, 0],
        [38, 20],
        [28, 35],
        [12, 35],
        [2, 20],
      ],
    },
    notVisited: {
      color: "#C5C5C5",
      points: [
        [2, 0],
        [38, 0],
        [38, 40],
        [2, 40],
      ],
    },
    marked: {
      color: "#7F5BC4",
      type: "circle",
      cx: 20,
      cy: 18,
      r: 18,
    },
    answeredMarked: {
      color: "#5636B3",
      type: "circle",
      cx: 20,
      cy: 18,
      r: 18,
    },
  }[status];

  return (
    <View style={{ width: scale(baseWidth), height: scale(baseHeight) }}>
      <Svg height={scale(baseHeight)} width={scale(baseWidth)}>
        {statusConfig.type === "circle" ? (
          <Circle
            cx={scale(statusConfig.cx)}
            cy={scale(statusConfig.cy)}
            r={scale(statusConfig.r)}
            fill={statusConfig.color}
          />
        ) : (
          <Polygon
            fill={statusConfig.color}
            points={(statusConfig.points || [])
              .map(([x, y]) => `${scale(x)},${scale(y)}`)
              .join(" ")}
          />
        )}
        <SvgText
          fill="white"
          fontSize={scale(16)}
          fontWeight="bold"
          x={scale(baseWidth / 2)}
          y={scale(24)}
          textAnchor="middle"
        >
          {count}
        </SvgText>
      </Svg>
    </View>
  );
};

export default StatusCounter;
