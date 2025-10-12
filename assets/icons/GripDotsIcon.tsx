import React from "react";
import Svg, { Path } from "react-native-svg";

type GripDotsIconProps = {
  size?: number;
  color?: string;
};

export default function GripDotsIcon({
  size = 24,
  color = "#000000",
}: GripDotsIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 256 256" fill="none">
      <Path
        d="M104,196a12,12,0,1,1-12-12A12,12,0,0,1,104,196Zm-12-80a12,12,0,1,0,12,12A12,12,0,0,0,92,116Zm72-44a12,12,0,1,0-12-12A12,12,0,0,0,164,72Zm0,44a12,12,0,1,0,12,12A12,12,0,0,0,164,116Zm-72-68a12,12,0,1,0,12,12A12,12,0,0,0,92,48Zm72,136a12,12,0,1,0,12,12A12,12,0,0,0,164,184Z"
        fill={color}
      />
    </Svg>
  );
}
