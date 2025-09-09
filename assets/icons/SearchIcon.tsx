import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

type TabIconProps = {
  focused: boolean;
  size?: number;
};

export default function SearchIcon({ focused, size = 24 }: TabIconProps) {
  if (focused) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* Filled Circle */}
        <Path
          d="M20.3133 11.1566C20.3133 16.2137 16.2137 20.3133 11.1566 20.3133C6.09956 20.3133 2 16.2137 2 11.1566C2 6.09956 6.09956 2 11.1566 2C16.2137 2 20.3133 6.09956 20.3133 11.1566Z"
          fill="#063866"
        />
        {/* Handle */}
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.8382 18.8382C19.1205 18.5559 19.5783 18.5559 19.8606 18.8382L21.7883 20.7659C22.0706 21.0483 22.0706 21.506 21.7883 21.7883C21.506 22.0706 21.0483 22.0706 20.7659 21.7883L18.8382 19.8606C18.5559 19.5783 18.5559 19.1205 18.8382 18.8382Z"
          fill="#063866"
        />
      </Svg>
    );
  }

  // 🔘 Unfocused
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Circle with gray fill */}
      <Circle cx="11.5" cy="11.5" r="9.5" stroke="#000000" strokeWidth="1.5" />
      {/* Handle */}
      <Path
        d="M20 20L22 22"
        stroke="#000000"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}
