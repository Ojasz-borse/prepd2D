import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

type ClockIconProps = {
  size?: number;
};

export default function ClockIcon({ size = 24 }: ClockIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Circle with light gray fill and black stroke */}
      <Circle
        cx={12}
        cy={12}
        r={10.75}
        fill="#d3d3d3"
        stroke="#000000"
        strokeWidth={1.5}
      />

      {/* Clock hands */}
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V11.6893L15.0303 13.9697C15.3232 14.2626 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2626 15.3232 13.9697 15.0303L11.4697 12.5303C11.329 12.3897 11.25 12.1989 11.25 12V8C11.25 7.58579 11.5858 7.25 12 7.25Z"
        fill="#000000"
      />
    </Svg>
  );
}
