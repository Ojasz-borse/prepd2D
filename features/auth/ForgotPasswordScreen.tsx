"use client";

import AuthStatusModal from "@/components/AuthStatusModal";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const ForgotPasswordScreen: React.FC = () => {
  const { forgotRequestOtp, forgotVerifyOtp, forgotResetPassword } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const otpRefs = useRef<(TextInput | null)[]>([]);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(179);

  // Modal state
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [modalError, setModalError] = useState<boolean>(false);

  // Countdown timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown, step]);

  // Hardware back
  useEffect(() => {
    const backAction = () => {
      if (step > 1) {
        setStep(step - 1);
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [step]);

  // --- Backend calls ---
  const requestOtp = async () => {
    setModalVisible(true);
    setModalLoading(true);
    setModalError(false);
    setModalMessage("Sending OTP...");
    try {
      await forgotRequestOtp(email);
      setModalLoading(false);
      setModalMessage("OTP sent to your email");
      setTimeout(() => {
        setModalVisible(false);
        setStep(2);
      }, 1500);
    } catch (err: any) {
      setModalLoading(false);
      setModalError(true);
      setModalMessage(err.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    setModalVisible(true);
    setModalLoading(true);
    setModalError(false);
    setModalMessage("Verifying OTP...");
    try {
      await forgotVerifyOtp(email, otp.join(""));
      setModalLoading(false);
      setModalMessage("OTP verified! Now reset your password.");
      setTimeout(() => {
        setModalVisible(false);
        setStep(3);
      }, 1500);
    } catch (err: any) {
      setModalLoading(false);
      setModalError(true);
      setModalMessage(err.message || "OTP verification failed");
    }
  };

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setModalVisible(true);
      setModalError(true);
      setModalMessage("Passwords do not match!");
      return;
    }
    setModalVisible(true);
    setModalLoading(true);
    setModalError(false);
    setModalMessage("Resetting password...");
    try {
      await forgotResetPassword(email, password);
      setModalLoading(false);
      setModalMessage("Password reset successfully!");
      setTimeout(() => {
        setModalVisible(false);
        router.replace("/login-user");
      }, 1500);
    } catch (err: any) {
      setModalLoading(false);
      setModalError(true);
      setModalMessage(err.message || "Password reset failed");
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text.slice(-1);
    setOtp(newOtp);
    if (text && index < otp.length - 1) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpBackspace = (key: string, index: number) => {
    if (key === "Backspace" && otp[index] === "" && index > 0)
      otpRefs.current[index - 1]?.focus();
  };

  const handleResendOtp = () => {
    setCountdown(179);
    setOtp(["", "", "", ""]);
    otpRefs.current[0]?.focus();
    requestOtp();
  };

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;

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
              {/* STEP 1: Email */}
              {step === 1 && (
                <>
                  <Text style={styles.headingText}>Enter Email</Text>
                  <FloatingLabelInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                  />
                  <View style={styles.buttonWrapper}>
                    <TouchableOpacity
                      style={[
                        styles.confirmButton,
                        email && styles.confirmButtonActive,
                      ]}
                      onPress={requestOtp}
                      disabled={!email}
                    >
                      <Text
                        style={[
                          styles.confirmButtonText,
                          email && styles.confirmButtonTextActive,
                        ]}
                      >
                        Send OTP
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {/* STEP 2: OTP */}
              {step === 2 && (
                <>
                  <Text style={styles.headingText}>Enter OTP</Text>
                  <View style={styles.inputRow}>
                    {otp.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => {
                          otpRefs.current[index] = ref;
                        }}
                        style={[
                          styles.inputBox,
                          (digit !== "" || focusedIndex === index) &&
                            styles.inputBoxActive,
                        ]}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={digit}
                        onChangeText={(text) => handleOtpChange(text, index)}
                        onKeyPress={({ nativeEvent }) =>
                          handleOtpBackspace(nativeEvent.key, index)
                        }
                        onFocus={() => setFocusedIndex(index)}
                        onBlur={() => setFocusedIndex(null)}
                        autoFocus={index === 0}
                      />
                    ))}
                  </View>
                  <View style={styles.resendRow}>
                    <TouchableOpacity
                      onPress={handleResendOtp}
                      disabled={countdown > 0}
                    >
                      <Text
                        style={[
                          styles.resendText,
                          countdown === 0 && styles.resendTextActive,
                        ]}
                      >
                        {countdown > 0
                          ? `Resend OTP (${formatTime(countdown)})`
                          : "Resend OTP"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.buttonWrapper}>
                    <TouchableOpacity
                      style={[
                        styles.confirmButton,
                        otp.every((d) => d !== "") &&
                          styles.confirmButtonActive,
                      ]}
                      onPress={handleVerifyOtp}
                      disabled={!otp.every((d) => d !== "")}
                    >
                      <Text
                        style={[
                          styles.confirmButtonText,
                          otp.every((d) => d !== "") &&
                            styles.confirmButtonTextActive,
                        ]}
                      >
                        Verify OTP
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {/* STEP 3: Password */}
              {step === 3 && (
                <>
                  <Text style={styles.headingText}>Reset Password</Text>
                  <FloatingLabelInput
                    label="New Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                  <FloatingLabelInput
                    label="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />
                  <View style={styles.buttonWrapper}>
                    <TouchableOpacity
                      style={[
                        styles.confirmButton,
                        password &&
                          confirmPassword &&
                          styles.confirmButtonActive,
                      ]}
                      onPress={handleResetPassword}
                      disabled={!password || !confirmPassword}
                    >
                      <Text
                        style={[
                          styles.confirmButtonText,
                          password &&
                            confirmPassword &&
                            styles.confirmButtonTextActive,
                        ]}
                      >
                        Reset Password
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* AuthStatusModal */}
      <AuthStatusModal
        visible={modalVisible}
        loading={modalLoading}
        message={modalMessage}
        error={modalError}
        onClose={() => setModalVisible(false)}
        showButton={modalError}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#063866" },
  whiteCard: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingTop: 0,
  },
  centerWrapper: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: "5%",
  },
  headingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 20,
    textAlign: "left",
    width: "100%",
    fontFamily: "SourceSans3Medium",
  },
  buttonWrapper: { width: "100%", alignItems: "flex-end" },
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
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4,
    marginBottom: 20,
  },
  inputBox: {
    width: 75,
    height: 75,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
    backgroundColor: "#fff",
    color: "#000",
    fontFamily: "SourceSans3Medium",
  },
  inputBoxActive: {
    borderColor: "#063866",
    borderWidth: 2,
    backgroundColor: "#f8fbff",
  },
  resendRow: { width: "100%", alignItems: "flex-end", marginBottom: 20 },
  resendText: { fontSize: 14, color: "#777", fontFamily: "SourceSans3Medium" },
  resendTextActive: {
    color: "#56aeff",
    fontWeight: "600",
    fontFamily: "SourceSans3Medium",
  },
});

export default ForgotPasswordScreen;
