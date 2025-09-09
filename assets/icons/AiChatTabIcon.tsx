import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

type AiChatTabIconProps = {
  focused: boolean;
  size?: number;
};

export default function AiChatTabIcon({
  focused,
  size = 24,
}: AiChatTabIconProps) {
  if (focused) {
    return (
      <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        {/* Large filled star */}
        <Path
          d="M12,17c0.8-4.2,1.9-5.3,6.1-6.1c0.5-0.1,0.8-0.5,0.8-1s-0.3-0.9-0.8-1C13.9,8.1,12.8,7,12,2.8C11.9,2.3,11.5,2,11,2
          c-0.5,0-0.9,0.3-1,0.8C9.2,7,8.1,8.1,3.9,8.9C3.5,9,3.1,9.4,3.1,9.9s0.3,0.9,0.8,1c4.2,0.8,5.3,1.9,6.1,6.1c0.1,0.5,0.5,0.8,1,0.8
          S11.9,17.4,12,17z"
          fill="#063866"
        />
        <Path
          d="M22,24c-2.8-0.6-3.4-1.2-4-4c-0.1-0.5-0.5-0.8-1-0.8s-0.9,0.3-1,0.8c-0.6,2.8-1.2,3.4-4,4c-0.5,0.1-0.8,0.5-0.8,1
          s0.3,0.9,0.8,1c2.8,0.6,3.4,1.2,4,4c0.1,0.5,0.5,0.8,1,0.8s0.9-0.3,1-0.8c0.6-2.8,1.2-3.4,4-4c0.5-0.1,0.8-0.5,0.8-1
          S22.4,24.1,22,24z"
          fill="#063866"
        />
        <Path
          d="M29.2,14c-2.2-0.4-2.7-0.9-3.1-3.1c-0.1-0.5-0.5-0.8-1-0.8c-0.5,0-0.9,0.3-1,0.8c-0.4,2.2-0.9,2.7-3.1,3.1
          c-0.5,0.1-0.8,0.5-0.8,1s0.3,0.9,0.8,1c2.2,0.4,2.7,0.9,3.1,3.1c0.1,0.5,0.5,0.8,1,0.8c0.5,0,0.9-0.3,1-0.8
          c0.4-2.2,0.9-2.7,3.1-3.1c0.5-0.1,0.8-0.5,0.8-1S29.7,14.1,29.2,14z"
          fill="#063866"
        />
        {/* Small stars */}
        <Circle cx="5.7" cy="22.3" r={0.7} fill="#063866" />
        <Circle cx="28" cy="7" r={0.7} fill="#063866" />
      </Svg>
    );
  }

  // Default (unfocused) version
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M17.9,9.9c-4.6,0.9-6,2.3-6.9,6.9c-0.9-4.6-2.3-6-6.9-6.9C8.7,9,10.1,7.6,11,3C11.9,7.6,13.3,9,17.9,9.9z"
        fill="#D3D3D3"
        stroke="#000000"
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21.8,25c-3.2,0.6-4.1,1.6-4.8,4.8c-0.6-3.2-1.6-4.1-4.8-4.8c3.2-0.6,4.1-1.6,4.8-4.8C17.6,23.4,18.6,24.4,21.8,25z"
        fill="none"
        stroke="#000000"
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M29,15c-2.6,0.5-3.4,1.3-3.9,3.9c-0.5-2.6-1.3-3.4-3.9-3.9c2.6-0.5,3.4-1.3,3.9-3.9C25.6,13.7,26.4,14.5,29,15z"
        fill="none"
        stroke="#000000"
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="5" cy="23" r={1} stroke="#000000" strokeWidth={1} />
      <Circle cx="28" cy="6" r={1} stroke="#000000" strokeWidth={1} />
    </Svg>
  );
}
