"use client";

import AuthStatusModal from "@/components/AuthStatusModal";
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
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      return Alert.alert("Error", "Please enter email and password");
    }

    setModalVisible(true);
    setLoading(true);
    setError(false);
    setModalMessage("Authenticating...");

    try {
      await login(email, password);
      setLoading(false);
      setModalMessage("Login Successful!");
      setTimeout(() => {
        setModalVisible(false);
        router.replace("/");
      }, 1000);
    } catch (err: any) {
      setLoading(false);
      setError(true);
      setModalMessage(err.message || "Login failed");
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
                <TouchableOpacity
                  onPress={() => router.push("/forgot-password")}
                >
                  <Text
                    style={{
                      color: "#56aeff",
                      fontFamily: "SourceSans3Medium",
                    }}
                  >
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
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Popup Modal */}
      <AuthStatusModal
        visible={modalVisible}
        loading={loading}
        message={modalMessage}
        error={error}
        showButton={error}
        onClose={() => setModalVisible(false)}
      />
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
    height: 100,
    paddingHorizontal: "5%",
  },
  headingText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 20,
    fontFamily: "SourceSans3Medium",
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
    fontFamily: "SourceSans3Medium",
  },
  confirmButtonTextActive: { color: "#fff" },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalMessage: {
    marginTop: 15,
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    textAlign: "center",
  },
});

export default LoginUserScreen;
