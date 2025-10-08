import React from "react";
import { Animated, Easing } from "react-native";
import Svg, { G, Path } from "react-native-svg";

type MagicWandIconProps = {
  size?: number;
  color?: string;
  animated?: boolean;
};

export default function MagicWandIcon({
  size = 24,
  color = "#1C274C",
  animated = false,
}: MagicWandIconProps) {
  // --- Stars animation values ---
  const spinValue1 = React.useRef(new Animated.Value(0)).current;
  const spinValue2 = React.useRef(new Animated.Value(0)).current;
  const spinValue3 = React.useRef(new Animated.Value(0)).current;

  const pulseValue1 = React.useRef(new Animated.Value(1)).current;
  const pulseValue2 = React.useRef(new Animated.Value(1)).current;
  const pulseValue3 = React.useRef(new Animated.Value(1)).current;

  // --- Wand rotation animation ---
  const wandSwing = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (animated) {
      // 🔹 Wand swinging (like a pendulum)
      Animated.loop(
        Animated.sequence([
          Animated.timing(wandSwing, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(wandSwing, {
            toValue: -1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // 🔹 Star rotations
      Animated.loop(
        Animated.timing(spinValue1, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      Animated.loop(
        Animated.timing(spinValue2, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      Animated.loop(
        Animated.timing(spinValue3, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // 🔹 Pulsing
      const makePulse = (
        value: Animated.Value,
        toValue: number,
        duration: number
      ) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(value, {
              toValue,
              duration,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(value, {
              toValue: 1,
              duration,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        ).start();

      makePulse(pulseValue1, 1.8, 800);
      makePulse(pulseValue2, 1.5, 1000);
      makePulse(pulseValue3, 1.15, 1200);
    } else {
      wandSwing.stopAnimation();
      spinValue1.stopAnimation();
      spinValue2.stopAnimation();
      spinValue3.stopAnimation();
      pulseValue1.stopAnimation();
      pulseValue2.stopAnimation();
      pulseValue3.stopAnimation();

      wandSwing.setValue(0);
      spinValue1.setValue(0);
      spinValue2.setValue(0);
      spinValue3.setValue(0);
      pulseValue1.setValue(1);
      pulseValue2.setValue(1);
      pulseValue3.setValue(1);
    }
  }, [animated]);

  // 🔹 Interpolations
  const spin1 = spinValue1.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const spin2 = spinValue2.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const spin3 = spinValue3.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // 🔹 Wand rotation interpolation (-5° to +5°)
  const wandRotate = wandSwing.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-5deg", "5deg"],
  });

  // Star centers
  const star1Center = { x: 16.5, y: 4.5 };
  const star2Center = { x: 20.5, y: 10.5 };
  const star3Center = { x: 5.5, y: 16.5 };

  // Wand center (rotation pivot)
  const wandCenter = { x: 12, y: 12 };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* ✨ Animated wand (pendulum) */}
      <AnimatedG
        transform={
          animated
            ? [
                { translateX: wandCenter.x },
                { translateY: wandCenter.y },
                { rotate: wandRotate },
                { translateX: -wandCenter.x },
                { translateY: -wandCenter.y },
              ]
            : undefined
        }
      >
        <Path
          d="M3.84453 3.84453C2.71849 4.97056 2.71849 6.79623 3.84453 7.92226L5.43227 9.51C5.44419 9.49622 5.45669 9.48276 5.46978 9.46967L9.46978 5.46967C9.48284 5.45662 9.49625 5.44415 9.50999 5.43226L7.92226 3.84453C6.79623 2.71849 4.97056 2.71849 3.84453 3.84453Z"
          fill={color}
        />
        <Path
          d="M10.5679 6.49012C10.556 6.50386 10.5435 6.51728 10.5304 6.53033L6.53044 10.5303C6.51735 10.5434 6.5039 10.5559 6.49011 10.5678L16.0777 20.1555C17.2038 21.2815 19.0294 21.2815 20.1555 20.1555C21.2815 19.0294 21.2815 17.2038 20.1555 16.0777L10.5679 6.49012Z"
          fill={color}
        />
      </AnimatedG>

      {/* 🌟 Stars */}
      <AnimatedG
        transform={
          animated
            ? [
                { translateX: star1Center.x },
                { translateY: star1Center.y },
                { rotate: spin1 },
                { scale: pulseValue1 },
                { translateX: -star1Center.x },
                { translateY: -star1Center.y },
              ]
            : undefined
        }
      >
        <Path
          d="M16.1 2.30719C16.261 1.8976 16.8385 1.8976 16.9994 2.30719L17.4298 3.40247C17.479 3.52752 17.5776 3.62651 17.7022 3.67583L18.7934 4.1078C19.2015 4.26934 19.2015 4.849 18.7934 5.01054L17.7022 5.44252C17.5776 5.49184 17.479 5.59082 17.4298 5.71587L16.9995 6.81115C16.8385 7.22074 16.261 7.22074 16.1 6.81116L15.6697 5.71587C15.6205 5.59082 15.5219 5.49184 15.3973 5.44252L14.3061 5.01054C13.898 4.849 13.898 4.26934 14.3061 4.1078L15.3973 3.67583C15.5219 3.62651 15.6205 3.52752 15.6697 3.40247L16.1 2.30719Z"
          fill={color}
        />
      </AnimatedG>

      <AnimatedG
        transform={
          animated
            ? [
                { translateX: star2Center.x },
                { translateY: star2Center.y },
                { rotate: spin2 },
                { scale: pulseValue2 },
                { translateX: -star2Center.x },
                { translateY: -star2Center.y },
              ]
            : undefined
        }
      >
        <Path
          d="M19.9672 9.12945C20.1281 8.71987 20.7057 8.71987 20.8666 9.12945L21.0235 9.5288C21.0727 9.65385 21.1713 9.75284 21.2959 9.80215L21.6937 9.95965C22.1018 10.1212 22.1018 10.7009 21.6937 10.8624L21.2959 11.0199C21.1713 11.0692 21.0727 11.1682 21.0235 11.2932L20.8666 11.6926C20.7057 12.1022 20.1281 12.1022 19.9672 11.6926L19.8103 11.2932C19.7611 11.1682 19.6625 11.0692 19.5379 11.0199L19.14 10.8624C18.732 10.7009 18.732 10.1212 19.14 9.95965L19.5379 9.80215C19.6625 9.75284 19.7611 9.65385 19.8103 9.5288L19.9672 9.12945Z"
          fill={color}
        />
      </AnimatedG>

      <AnimatedG
        transform={
          animated
            ? [
                { translateX: star3Center.x },
                { translateY: star3Center.y },
                { rotate: spin3 },
                { scale: pulseValue3 },
                { translateX: -star3Center.x },
                { translateY: -star3Center.y },
              ]
            : undefined
        }
      >
        <Path
          d="M5.1332 15.3072C5.29414 14.8976 5.87167 14.8976 6.03261 15.3072L6.18953 15.7065C6.23867 15.8316 6.33729 15.9306 6.46188 15.9799L6.85975 16.1374C7.26783 16.2989 7.26783 16.8786 6.85975 17.0401L6.46188 17.1976C6.33729 17.2469 6.23867 17.3459 6.18953 17.471L6.03261 17.8703C5.87167 18.2799 5.29414 18.2799 5.1332 17.8703L4.97628 17.471C4.92714 17.3459 4.82852 17.2469 4.70393 17.1976L4.30606 17.0401C3.89798 16.8786 3.89798 16.2989 4.30606 16.1374L4.70393 15.9799C4.82852 15.9306 4.92714 15.8316 4.97628 15.7065L5.1332 15.3072Z"
          fill={color}
        />
      </AnimatedG>
    </Svg>
  );
}

// Animated G wrapper
const AnimatedG = Animated.createAnimatedComponent(G);
