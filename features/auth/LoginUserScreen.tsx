"use client";

import FloatingLabelInput from "@/components/FloatingLabelInput";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";

import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const LoginUserScreen: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      return Alert.alert("Error", "Please enter email and password");
    }
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#063866" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.whiteCard}>
            <View style={styles.centerWrapper}>
              <Text style={styles.headingText}>Login</Text>

              <FloatingLabelInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />

              <FloatingLabelInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <View
                style={{
                  width: "100%",
                  alignItems: "flex-end",
                  marginTop: -10,
                  marginBottom: 10,
                }}
              >
                
<TouchableOpacity onPress={() => router.push("../auth/forgot-password")}>
                
                  <Text style={{ color: "#56aeff", fontFamily: "BreeSerif" }}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.buttonWrapper}>
                <TouchableOpacity
                  style={[
                    styles.confirmButton,
                    email && password && styles.confirmButtonActive,
                  ]}
                  onPress={handleLogin}
                  disabled={!email || !password || loading}
                >
                  <Text
                    style={[
                      styles.confirmButtonText,
                      email && password && styles.confirmButtonTextActive,
                    ]}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#063866" },
  whiteCard: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 10 },
  centerWrapper: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: "5%",
  },

  headingText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 20,
    fontFamily: "BreeSerif",
  },
  buttonWrapper: { width: "100%", alignItems: "flex-end", marginTop: 10 },
  confirmButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  confirmButtonActive: { backgroundColor: "#063866" },
  confirmButtonText: {
    color: "#999",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "BreeSerif",
  },
  confirmButtonTextActive: { color: "#fff" },
});

export default LoginUserScreen;
