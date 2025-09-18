import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback } from "react";
import { Text, View } from "react-native";

// Keep splash screen visible while loading fonts
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    "BreeSerif-Regular": require("./assets/fonts/BreeSerif-Regular.ttf"),
    "NotoSansKR-Black": require("./assets/fonts/NotoSansKR-Black.ttf"),
    "NotoSansKR-Bold": require("./assets/fonts/NotoSansKR-Bold.ttf"),
    "NotoSansKR-ExtraBold": require("./assets/fonts/NotoSansKR-ExtraBold.ttf"),
    "NotoSansKR-ExtraLight": require("./assets/fonts/NotoSansKR-ExtraLight.ttf"),
    "NotoSansKR-Light": require("./assets/fonts/NotoSansKR-Light.ttf"),
    "NotoSansKR-Medium": require("./assets/fonts/NotoSansKR-Medium.ttf"),
    "NotoSansKR-Regular": require("./assets/fonts/NotoSansKR-Regular.ttf"),
    "NotoSansKR-SemiBold": require("./assets/fonts/NotoSansKR-SemiBold.ttf"),
    "NotoSansKR-Thin": require("./assets/fonts/NotoSansKR-Thin.ttf"),
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
