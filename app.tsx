import React, { useCallback } from "react";
import { View, Text } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";

// Keep splash screen visible while loading fonts
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    "BreeSerif-Regular": require("./assets/fonts/BreeSerif-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // stays on splash until font is ready
  }

  return (
    <View
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      onLayout={onLayoutRootView}
    >
      <Text style={{ fontFamily: "BreeSerif-Regular", fontSize: 20 }}>
        Hello Ojas 👋
      </Text>
    </View>
  );
}
