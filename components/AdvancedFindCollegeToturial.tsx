// AdvancedFindCollegeToturial.tsx
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import AdvancedFindCollegeCard from "./AdvancedFindCollegeCard";

interface Props {
  cardLayout: { x: number; y: number; width: number; height: number } | null;
}

const AdvancedFindCollegeToturial: React.FC<Props> = ({ cardLayout }) => {
  const [step, setStep] = useState(1);
  const [visible, setVisible] = useState(true);

  // For countdown
  const [countdown, setCountdown] = useState(5);
  const [canContinue, setCanContinue] = useState(false);

  const handAnim = useRef(new Animated.Value(0)).current;

  // 🔄 Animate hand
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

  // ⏳ Start countdown whenever step changes
  useEffect(() => {
    setCountdown(5);
    setCanContinue(false);

    let t = setInterval(() => {
      setCountdown((c) => {
        if (c === 1) {
          setCanContinue(true);
          clearInterval(t);
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [step]);

  if (!visible || !cardLayout) return null;

  const onOverlayPress = () => {
    if (!canContinue) return;

    if (step === 1) {
      setStep(2); // move to next step
      return;
    }

    if (step === 2) {
      setVisible(false); // close tutorial
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onOverlayPress}>
        <View style={styles.overlay}>
          {/* Top Message */}
          <View style={styles.topMessageContainer}>
            <Text style={styles.topMessage}>
              {canContinue
                ? "Tap anywhere to continue"
                : `Continue in ${countdown}s`}
            </Text>
          </View>

          {/* --------------------- STEP 1 ----------------------- */}
          {step === 1 && (
            <>
              {/* Tooltip */}
              <View
                style={{
                  position: "absolute",
                  top: cardLayout.y + cardLayout.height + 60,
                  left: cardLayout.x + cardLayout.width / 2 - 120,
                  width: 240,
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  padding: 12,
                  elevation: 5,
                }}
              >
                <Text
                  style={{ fontFamily: "SourceSans3Medium", color: "#333" }}
                >
                  Longpress on the card to select it
                </Text>
              </View>

              {/* Hand Pointer */}
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

              {/* Highlighted Card */}
              <View
                style={{
                  position: "absolute",
                  top: cardLayout.y,
                  left: cardLayout.x,
                  width: cardLayout.width,
                  height: cardLayout.height,
                }}
                pointerEvents="none"
              >
                <AdvancedFindCollegeCard
                  item={{
                    branch_name: "Electronics Engineering",
                    choice_code: "0301237610",
                    college_code: "03012",
                    district: "Mumbai",
                    is_autonomous: true,
                    is_government: true,
                    name: "Veermata Jijabai Technological Institute(VJTI), Matunga, Mumbai",
                    standard_cutoff_data: [
                      { rank: 110, category: "Open", percentile: 99.57 },
                      { rank: 111, category: "OBC", percentile: 99.31 },
                      { rank: 112, category: "SC", percentile: 97.13 },
                      { rank: 113, category: "VJ", percentile: 98.23 },
                      { rank: 114, category: "TFWS", percentile: 99.36 },
                    ],
                  }}
                />
              </View>
            </>
          )}

          {/* --------------------- STEP 2 ----------------------- */}
          {step === 2 && (
            <>
              {/* Tooltip */}
              <View
                style={{
                  position: "absolute",
                  bottom: 220,
                  right: 20,
                  width: 240,
                  backgroundColor: "#ffffff",
                  borderRadius: 12,
                  padding: 12,
                  elevation: 5,
                }}
              >
                <Text
                  style={{ fontFamily: "SourceSans3Medium", color: "#333" }}
                >
                  Click save to add this card to MyList
                </Text>
              </View>

              {/* Hand Pointer */}
              <Animated.View
                style={{
                  position: "absolute",
                  bottom: 160,
                  right: 80,
                  transform: [{ translateY: handAnim }],
                }}
              >
                <FontAwesome5
                  name="hand-point-down"
                  size={34}
                  color="#d9d9d9"
                />
              </Animated.View>

              {/* Fake Save Button Display */}
              <View style={styles.bottomSaveWrapper}>
                <TouchableOpacity style={styles.bottomSaveBtn}>
                  <Ionicons name="checkmark" size={20} color="#fff" />
                  <Text style={styles.bottomSaveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AdvancedFindCollegeToturial;

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
  bottomSaveWrapper: {
    position: "absolute",
    bottom: 100,
    right: 20,
  },
  bottomSaveBtn: {
    flexDirection: "row",
    backgroundColor: "#004aad",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 30,
    elevation: 5,
  },
  bottomSaveText: {
    color: "#fff",
    marginLeft: 8,
    fontFamily: "SourceSans3Medium",
    fontSize: 15,
  },
});
