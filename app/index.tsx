import { useAuth } from "@/context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

function FloatingShape({ size, color, duration, delay, initialX, initialY }: any) {
  const moveAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnim, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim, {
          toValue: 0,
          duration: duration,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = moveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30],
  });

  const translateX = moveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 15],
  });

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: initialY,
        left: initialX,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: 0.1,
        transform: [{ translateY }, { translateX }],
        zIndex: 1,
      }}
    />
  );
}

export default function Index() {
  const router = useRouter();
  const { checkAuth } = useAuth();
  const [showContent, setShowContent] = useState(false);

  // Animation values
  const logoScale = React.useRef(new Animated.Value(0.8)).current;
  const logoOpacity = React.useRef(new Animated.Value(0)).current;
  const contentFade = React.useRef(new Animated.Value(0)).current;
  const pulseAnim = React.useRef(new Animated.Value(0.4)).current;
  const slideUp = React.useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Pulse animation logic
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const initApp = async () => {
      // Start logo animation
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();

      // Check auth while showing splash
      const isSignedIn = await checkAuth();

      // Minimum duration for splash effect
      const minDelay = new Promise(resolve => setTimeout(resolve, 500));
      await Promise.all([minDelay]);

      if (isSignedIn) {
        router.replace("/home");
      } else {
        // Show login/signup options if not signed in
        setShowContent(true);
        Animated.parallel([
          Animated.timing(contentFade, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.spring(slideUp, {
            toValue: 0,
            friction: 6,
            useNativeDriver: true,
          }),
        ]).start();
      }
    };

    initApp();
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Half - White with Icon */}
      <View style={styles.topHalf}>
        <Animated.View style={[
          styles.iconContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }]
          }
        ]}>
          <Image
            source={require("../assets/images/icon-homescreen.png")}
            style={styles.icon}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      {/* Bottom Half - Blue Gradient */}
      <LinearGradient
        colors={["#0073e6", "#004aad"]}
        style={styles.bottomHalf}
      >
        {showContent ? (
          <Animated.View style={[
            styles.content,
            {
              opacity: contentFade,
              transform: [{ translateY: slideUp }]
            }
          ]}>

            <View style={styles.buttonWrapper}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.registerButton}
                onPress={() => router.push("/login-user")}
              >
                <Text style={styles.registerButtonText}>Login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.loginButton}
                onPress={() => router.push("/register-user")}
              >
                <Text style={styles.loginButtonText}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ) : (
          <View style={styles.loaderContainer}>
            <View style={styles.dotContainer}>
              <Animated.View style={[styles.loadingDot, { opacity: pulseAnim }]} />
              <Animated.View style={[styles.loadingDot, { opacity: pulseAnim, transform: [{ scale: 1.2 }] }]} />
              <Animated.View style={[styles.loadingDot, { opacity: pulseAnim }]} />
            </View>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topHalf: {
    height: SCREEN_HEIGHT * 0.65,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 400,
    borderBottomRightRadius: 400,
    zIndex: 2,

  },
  iconContainer: {
    width: SCREEN_WIDTH * 0.35,
    height: SCREEN_WIDTH * 0.35,
    justifyContent: "center",
    marginTop: 300,
  },
  icon: {
    width: "100%",
    height: "100%",
  },
  bottomHalf: {
    flex: 1,
    marginTop: -200,
    paddingTop: 250,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,

  },
  content: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    paddingBottom: 60,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 28,
    color: "#fff",
    fontFamily: "SourceSans3SemiBold",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  buttonWrapper: {
    width: "100%",
    gap: 25,
    paddingHorizontal: 10,
    marginTop: 20,
  },
  loginButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 99,
    alignItems: "center",

  },
  loginButtonText: {
    color: "#004aad",
    fontSize: 18,
    fontFamily: "SourceSans3SemiBold",
  },
  registerButton: {
    paddingVertical: 12,
    borderRadius: 99,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffffff",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "SourceSans3SemiBold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dotContainer: {
    flexDirection: "row",
    gap: 10,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.6)",
  }
});
