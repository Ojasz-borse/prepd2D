import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, TextInput, View } from "react-native";

interface FloatingLabelInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "number-pad";
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const labelAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isFocused || value.length > 0 ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  return (
    <View style={styles.inputWrapper}>
      <Animated.Text
        style={[
          styles.animatedLabel,
          {
            top: labelAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [18, -10],
            }),
            fontSize: labelAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [16, 12],
            }),
            color: labelAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["#999", "#063866"],
            }),
          },
        ]}
      >
        {label}
      </Animated.Text>
      <View
        style={[
          styles.inputContainer,
          (isFocused || value.length > 0) && styles.inputContainerFocused,
        ]}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          placeholder=""
          returnKeyType="done"
          blurOnSubmit
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: { position: "relative", width: "100%", marginBottom: 30 },
  animatedLabel: {
    position: "absolute",
    left: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 2,
    zIndex: 1,
    fontFamily: "BreeSerif",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 60,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  inputContainerFocused: { borderColor: "#063866", borderWidth: 2 },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 0,
    fontFamily: "BreeSerif",
  },
});

export default FloatingLabelInput;
