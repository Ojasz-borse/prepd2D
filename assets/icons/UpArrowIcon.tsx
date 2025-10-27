import React from "react";
import Svg, { Path } from "react-native-svg";

type UpArrowIconProps = {
  size?: number;
  color?: string;
};

export default function UpArrowIcon({
  size = 24,
  color = "#fff",
}: UpArrowIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 20L12 4M12 4L18 10M12 4L6 10"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
