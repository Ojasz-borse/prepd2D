import { AuthProvider } from "@/context/AuthContext";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { View } from "react-native";

// keep splash visible until fonts are loaded
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
 const [fontsLoaded] = useFonts({
  WixMadeforTextBold: require("../assets/fonts/WixMadeforText-Bold.ttf"),
  WixMadeforTextBoldItalic: require("../assets/fonts/WixMadeforText-BoldItalic.ttf"),
  WixMadeforTextExtraBold: require("../assets/fonts/WixMadeforText-ExtraBold.ttf"),
  WixMadeforTextExtraBoldItalic: require("../assets/fonts/WixMadeforText-ExtraBoldItalic.ttf"),
  WixMadeforTextItalic: require("../assets/fonts/WixMadeforText-Italic.ttf"),
  WixMadeforTextMedium: require("../assets/fonts/WixMadeforText-Medium.ttf"),
  WixMadeforTextMediumItalic: require("../assets/fonts/WixMadeforText-MediumItalic.ttf"),
  WixMadeforTextRegular: require("../assets/fonts/WixMadeforText-Regular.ttf"),
  WixMadeforTextSemiBold: require("../assets/fonts/WixMadeforText-SemiBold.ttf"),
  WixMadeforTextSemiBoldItalic: require("../assets/fonts/WixMadeforText-SemiBoldItalic.ttf"),
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
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </AuthProvider>
  );
}
