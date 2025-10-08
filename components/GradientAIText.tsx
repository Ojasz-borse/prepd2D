import { FontAwesome5 } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

interface GradientTextButtonProps {
  text: string;
  iconName?: string;
  style?: ViewStyle;
}

export default function GradientAIText({
  text,
  iconName = "magic",
  style,
}: GradientTextButtonProps) {
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
          colors={["#e699ff", "#809fff"]}
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
  mask: {
    flexDirection: "row",
    alignItems: "center",
    fontFamily: "SourceSans3Medium",
    gap: 4,
  },
  text: {
    fontSize: 16,
    fontFamily: "SourceSans3SemiBold",
    color: "black", // mask color, important for masking
  },
  gradient: {
    height: 22, // enough to cover the text height
    width: 70, // wide enough for your text + icon
  },
});
