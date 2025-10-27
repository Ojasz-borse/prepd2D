import React from "react";
import Svg, { Path } from "react-native-svg";

type ChecklistIconProps = {
  size?: number;
};

export default function ChecklistIcon({ size = 24 }: ChecklistIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14 16L16.1 18.5L20 13.5"
        stroke="#1C274C"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        opacity={0.5}
        d="M21 6L3 6"
        stroke="#1C274C"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        opacity={0.5}
        d="M21 10L3 10"
        stroke="#1C274C"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        opacity={2}
        d="M10 14H3"
        stroke="#1C274C"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        opacity={0.5}
        d="M10 18H3"
        stroke="#1C274C"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}
