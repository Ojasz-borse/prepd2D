// NormalFindCollegeToturial.tsx
import NormalFindCollegeCard from "@/components/NormalFindCollegeCard";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface NormalFindCollegeToturialProps {
  cardLayout: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
}

const NormalFindCollegeToturial: React.FC<NormalFindCollegeToturialProps> = ({
  cardLayout,
}) => {
  const [visible, setVisible] = useState(true);
  const [canClose, setCanClose] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const handAnim = useRef(new Animated.Value(0)).current;

  // Animate hand (up-down loop)
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(handAnim, {
          toValue: -12,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(handAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Countdown
  useEffect(() => {
    let t = setInterval(() => {
      setCountdown((c) => {
        if (c === 1) {
          setCanClose(true);
          clearInterval(t);
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  if (!visible || !cardLayout) return null;

  const handlePress = () => {
    if (canClose) setVisible(false);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.overlay}>
          {/* Top Center Message */}
          <View style={styles.topMessageContainer}>
            <Text style={styles.topMessage}>
              {canClose
                ? "Click anywhere to continue"
                : `Tap available in ${countdown}s`}
            </Text>
          </View>

          {/* Tooltip Box */}
          <View
            style={{
              position: "absolute",
              top: cardLayout.y + cardLayout.height + 60,
              left: cardLayout.x + cardLayout.width / 2 - 120,
              width: 240,
              backgroundColor: "#ffffff",
              borderRadius: 12,
              padding: 12,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text style={{ fontFamily: "SourceSans3Medium", color: "#333" }}>
              Click on the college to see details
            </Text>
          </View>

          {/* Animated Hand Pointer (FontAwesome5) */}
          <Animated.View
            style={{
              position: "absolute",
              top: cardLayout.y + cardLayout.height + 10,
              left: cardLayout.x + cardLayout.width / 2 - 15,
              transform: [{ translateY: handAnim }],
            }}
          >
            <FontAwesome5 name="hand-point-up" size={34} color="#d9d9d9" />
          </Animated.View>

          {/* Highlighted actual card */}
          <View
            style={{
              position: "absolute",
              top: cardLayout.y,
              left: cardLayout.x,
              width: cardLayout.width,
              height: cardLayout.height,
            }}
          >
            <NormalFindCollegeCard
              college={{
                college_code: "03012",
                name: "Veermata Jijabai Technological Institute(VJTI), Matunga, Mumbai",
                district: "Mumbai",
                is_government: true,
                status: "Autonomous",
              }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default NormalFindCollegeToturial;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  topMessageContainer: {
    position: "absolute",
    top: 40,
    width: "100%",
    alignItems: "center",
  },
  topMessage: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "SourceSans3SemiBold",
  },
});
