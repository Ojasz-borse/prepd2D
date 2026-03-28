import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from "react-native";
import { colors } from "@/constants/theme";

interface GeneratingModalProps {
  visible: boolean;
}

const MESSAGES = [
  "Analyzing your rank, percentile, and category details...",
  "Evaluating colleges based on official cutoff trends...",
  "Matching suitable branches and preferred locations...",
  "Preparing your personalized college options..."
];

const GeneratingModal: React.FC<GeneratingModalProps> = ({ visible }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (visible) {
      interval = setInterval(() => {
        // Fade out
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
          // Fade in
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }).start();
        });
      }, 1500);
    } else {
      setMessageIndex(0);
    }
    return () => clearInterval(interval);
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#004aad" />
          </View>
          <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>

            <Text style={styles.message}>{MESSAGES[messageIndex]}</Text>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 30,
    paddingVertical: 50,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  loaderContainer: {
    marginBottom: 20,
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: "SourceSans3Bold",
    color: "#004aad",
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    color: "#64748b",
    textAlign: "center",
  },
});

export default GeneratingModal;
