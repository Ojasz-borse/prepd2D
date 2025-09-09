import React from "react";
import { Circle, Path, Svg } from "react-native-svg";

type Props = {
  focused: boolean;
  size?: number;
};

export const ProfilePageIcon: React.FC<Props> = ({ focused, size = 24 }) => {
  return focused ? (
    // FOCUSED VERSION
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM15 9C15 10.6569 13.6569 12 12 12C10.3431 12 9 10.6569 9 9C9 7.34315 10.3431 6 12 6C13.6569 6 15 7.34315 15 9ZM12 20.5C13.784 20.5 15.4397 19.9504 16.8069 19.0112C17.4108 18.5964 17.6688 17.8062 17.3178 17.1632C16.59 15.8303 15.0902 15 11.9999 15C8.90969 15 7.40997 15.8302 6.68214 17.1632C6.33105 17.8062 6.5891 18.5963 7.19296 19.0111C8.56018 19.9503 10.2159 20.5 12 20.5Z"
        fill="#063866"
      />
    </Svg>
  ) : (
    // NORMAL VERSION
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Outer circle */}
      <Circle
        cx="12"
        cy="12"
        r="10"
        fill="#d3d3d3"
        stroke="#000000"
        strokeWidth="0.7"
      />

      {/* Head */}
      <Circle
        cx="12"
        cy="9"
        r="3"
        fill="#ffffff"
        stroke="#000000"
        strokeWidth="0.7"
      />

      {/* Shoulders */}
      <Path
        d="M17.9691 20C17.81 17.1085 16.9247 15 11.9999 15C7.07521 15 6.18991 17.1085 6.03076 20"
        fill="#ffffff"
        stroke="#000000"
        strokeWidth="0.7"
        strokeLinecap="round"
      />
    </Svg>
  );
};
