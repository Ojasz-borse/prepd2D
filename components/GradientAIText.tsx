import { FontAwesome5 } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

interface GradientTextButtonProps {
  text: string;
  iconName?: string;
  style?: ViewStyle;
  isLoading?: boolean;
}

export default function GradientAIText({
  text,
  iconName = "magic",
  style,
  isLoading,
}: GradientTextButtonProps) {
  // if loading, show spinner instead of gradient text
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, style]}>
        <ActivityIndicator size="small" color="#3399ff" />
        <Text style={styles.loadingText}>{text}</Text>
      </View>
    );
  }

  // otherwise show gradient text
  return (
    <View style={[styles.container, style]}>
      <MaskedView
        maskElement={
          <View style={styles.mask}>
            <FontAwesome5 name={iconName} size={14} color="black" />
            <Text style={styles.text}>{text}</Text>
          </View>
        }
      >
        <LinearGradient
          colors={["#3399ff", "#004aad"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </MaskedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "SourceSans3SemiBold",
    color: "#3399ff", // same as gradient tone
  },
  mask: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  text: {
    fontSize: 16,
    fontFamily: "SourceSans3SemiBold",
    color: "black", // important for masking
  },
  gradient: {
    height: 22,
    width: 160, // wide enough for your text + icon
  },
});
