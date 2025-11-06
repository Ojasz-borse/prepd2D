import { AuthProvider } from "@/context/AuthContext";
import { PYQProvider } from "@/context/PYQContext";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { View } from "react-native";

// keep splash visible until fonts are loaded
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SourceSans3Black: require("../assets/fonts/SourceSans3-Black.ttf"),
    SourceSans3BlackItalic: require("../assets/fonts/SourceSans3-BlackItalic.ttf"),
    SourceSans3Bold: require("../assets/fonts/SourceSans3-Bold.ttf"),
    SourceSans3BoldItalic: require("../assets/fonts/SourceSans3-BoldItalic.ttf"),
    SourceSans3ExtraBold: require("../assets/fonts/SourceSans3-ExtraBold.ttf"),
    SourceSans3ExtraBoldItalic: require("../assets/fonts/SourceSans3-ExtraBoldItalic.ttf"),
    SourceSans3ExtraLight: require("../assets/fonts/SourceSans3-ExtraLight.ttf"),
    SourceSans3ExtraLightItalic: require("../assets/fonts/SourceSans3-ExtraLightItalic.ttf"),
    SourceSans3Italic: require("../assets/fonts/SourceSans3-Italic.ttf"),
    SourceSans3Light: require("../assets/fonts/SourceSans3-Light.ttf"),
    SourceSans3LightItalic: require("../assets/fonts/SourceSans3-LightItalic.ttf"),
    SourceSans3Medium: require("../assets/fonts/SourceSans3-Medium.ttf"),
    SourceSans3MediumItalic: require("../assets/fonts/SourceSans3-MediumItalic.ttf"),
    SourceSans3Regular: require("../assets/fonts/SourceSans3-Regular.ttf"),
    SourceSans3SemiBold: require("../assets/fonts/SourceSans3-SemiBold.ttf"),
    SourceSans3SemiBoldItalic: require("../assets/fonts/SourceSans3-SemiBoldItalic.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // keep splash screen until fonts are ready
  }

  return (
    <AuthProvider>
      <PYQProvider>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </PYQProvider>
    </AuthProvider>
  );
}
