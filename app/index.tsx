"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";

function GlowBall({
  bottom,
  right,
  top,
  left,
}: {
  bottom?: number;
  right?: number;
  top?: number;
  left?: number;
}) {
  const size = 800; // glow size
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        bottom,
        right,
        top,
        left,
        width: size,
        height: size,
        zIndex: 0, // 👈 keep glow behind everything
      }}
    >
      <Svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#063866" stopOpacity="0.6" />
            <Stop offset="40%" stopColor="#063866" stopOpacity="0.3" />
            <Stop offset="100%" stopColor="#063866" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill="url(#glow)" />
      </Svg>
    </View>
  );
}

export default function Index() {
  const router = useRouter();
  const { checkAuth, loading } = useAuth(); // 👈 use loading

  useEffect(() => {
    const verify = async () => {
      const isSignedIn = await checkAuth();
      if (isSignedIn) {
        router.replace("/home");
      }
    };
    verify();
  }, []);

  // 🔹 While checking auth, show nothing (or splash/loader)
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingWrapper}>
        <Text style={{ fontSize: 18, color: "#063866" }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top-left glowing ball */}
      <GlowBall top={-400} left={-400} />

      {/* Bottom-right glowing ball */}
      <GlowBall bottom={-300} right={-350} />

      <View style={styles.container}>
        {/* Centered Title */}
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>PrepAcademy</Text>
          <Text style={styles.subtitle}>MHT CET</Text>
        </View>

        {/* Buttons at bottom center */}
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={[styles.button, styles.registerButton, { zIndex: 10 }]}
            onPress={() => router.push("/register-user")}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.loginButton, { zIndex: 10 }]}
            onPress={() => router.push("/login-user")}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 60,
    backgroundColor: "transparent",
  },
  titleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    color: "#063866",
    textAlign: "center",
    fontFamily: "BreeSerif",
    marginTop: 100,
  },
  subtitle: {
    fontSize: 16,
    color: "#063866",
    textAlign: "center",
    fontFamily: "BreeSerif",
    marginTop: 8,
    fontWeight: "400",
  },
  buttonWrapper: {
    width: "100%",
    alignItems: "center",
    marginBottom: 100,
  },
  button: {
    width: "80%",
    paddingVertical: 15,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  registerButton: {
    backgroundColor: "#063866",
  },
  loginButton: {
    backgroundColor: "#fff",
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    fontFamily: "BreeSerif",
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#063866",
    fontFamily: "BreeSerif",
  },
});
