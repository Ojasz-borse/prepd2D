"use client";

import AuthStatusModal from "@/components/AuthStatusModal"; // 👈 Import modal
import FloatingLabelInput from "@/components/FloatingLabelInput";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useRef, useState } from "react";
import {
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RegisterUserScreen: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const { registerRequestOtp, registerVerifyOtp } = useAuth();

  // Step states
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [group, setGroup] = useState<"PCM">("PCM");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const otpRefs = useRef<(TextInput | null)[]>([]);
  const [countdown, setCountdown] = useState<number>(179);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Countdown timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (step === 5 && countdown > 0) {
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
    setLoading(true);
    setError(false);
    setModalMessage("Sending OTP...");

    try {
      await registerRequestOtp(firstName, lastName, email, group, password);
      setLoading(false);
      setModalMessage("OTP sent to your email");
      setTimeout(() => {
        setModalVisible(false);
        setStep(5);
      }, 1000);
    } catch (err: any) {
      setLoading(false);
      setError(true);
      setModalMessage(err.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    setModalVisible(true);
    setLoading(true);
    setError(false);
    setModalMessage("Verifying OTP...");

    try {
      await registerVerifyOtp(email, otp.join(""));
      setLoading(false);
      setModalMessage("Account created successfully!");
      // ✅ AuthContext will handle navigation after signup
      setTimeout(() => setModalVisible(false), 1200);
    } catch (err: any) {
      setLoading(false);
      setError(true);
      setModalMessage(err.message || "Invalid OTP, please try again");
    }
  };

  // --- Step handlers ---
  const handleEmailNext = () => email.trim() && setStep(2);
  const handleNameNext = () =>
    firstName.trim() && lastName.trim() && setStep(3);
  const handleGroupNext = () => {
    if (!group) {
      setError(true);
      setModalMessage("Please select a group");
      setModalVisible(true);
      return;
    }
    setStep(4);
  };
  const handlePasswordNext = () => {
    if (!password.trim() || !confirmPassword.trim()) return;
    if (password !== confirmPassword) {
      setError(true);
      setModalMessage("Passwords do not match!");
      setModalVisible(true);
      return;
    }
    requestOtp();
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

  // --- Password strength checks ---
  const passwordChecks = [
    {
      label: "At least 8 characters",
      valid: password.length >= 8,
    },
    {
      label: "Contains uppercase, lowercase, and number",
      valid:
        /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password),
    },
    {
      label: "At least one special symbol (!@#$%^&*)",
      valid: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#004aad" />
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
                      onPress={handleEmailNext}
                      disabled={!email || loading}
                    >
                      <Text
                        style={[
                          styles.confirmButtonText,
                          email && styles.confirmButtonTextActive,
                        ]}
                      >
                        Next
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {/* STEP 2: Name */}
              {step === 2 && (
                <>
                  <Text style={styles.headingText}>Enter Your Name</Text>
                  <FloatingLabelInput
                    label="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                  <FloatingLabelInput
                    label="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                  />
                  <View style={styles.buttonWrapper}>
                    <TouchableOpacity
                      style={[
                        styles.confirmButton,
                        firstName && lastName && styles.confirmButtonActive,
                      ]}
                      onPress={handleNameNext}
                      disabled={!firstName || !lastName || loading}
                    >
                      <Text
                        style={[
                          styles.confirmButtonText,
                          firstName &&
                            lastName &&
                            styles.confirmButtonTextActive,
                        ]}
                      >
                        Next
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {/* STEP 3: Group
              {step === 3 && (
                <>
                  <Text style={styles.headingText}>Select Your Group</Text>
                  <View style={styles.groupWrapper}>
                    <TouchableOpacity
                      style={[
                        styles.groupOption,
                        group === "PCM" && styles.groupOptionSelected,
                      ]}
                      onPress={() => setGroup("PCM")}
                    >
                      <Text
                        style={[
                          styles.groupOptionText,
                          group === "PCM" && styles.groupOptionTextSelected,
                        ]}
                      >
                        PCM
                      </Text>
                    </TouchableOpacity> */}
                    {/* <TouchableOpacity
                      style={[
                        styles.groupOption,
                        group === "PCB" && styles.groupOptionSelected,
                      ]}
                      onPress={() => setGroup("PCB")}
                    > */}
                      {/* <Text
                        style={[
                          styles.groupOptionText,
                          group === "PCB" && styles.groupOptionTextSelected,
                        ]}
                      >
                        PCB
                      </Text>
                    </TouchableOpacity> */}
                  {/* </View>
                  <View style={styles.buttonWrapper}>
                    <TouchableOpacity
                      style={[
                        styles.confirmButton,
                        group && styles.confirmButtonActive,
                      ]}
                      onPress={handleGroupNext}
                      disabled={!group || loading}
                    >
                      <Text
                        style={[
                          styles.confirmButtonText,
                          group && styles.confirmButtonTextActive,
                        ]}
                      >
                        Next
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )} */}

              {/* STEP 4: Password */}
              {step === 3 && (
                <>
                  <Text style={styles.headingText}>Set Password</Text>
                  <FloatingLabelInput
                    label="Password"
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
                      onPress={handlePasswordNext}
                      disabled={!password || !confirmPassword || loading}
                    >
                      <Text
                        style={[
                          styles.confirmButtonText,
                          password &&
                            confirmPassword &&
                            styles.confirmButtonTextActive,
                        ]}
                      >
                        Submit
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/* Password Strength Hints */}
                  <View style={{ marginTop: 10, marginBottom: 20 }}>
                    {passwordChecks.map((check, index) => (
                      <View key={index} style={styles.passwordCheckRow}>
                        <View
                          style={[
                            styles.bullet,
                            password === "" && confirmPassword === ""
                              ? styles.bulletGray
                              : check.valid
                              ? styles.bulletGreen
                              : styles.bulletRed,
                          ]}
                        />
                        <Text
                          style={[
                            styles.passwordCheckText,
                            password === "" && confirmPassword === ""
                              ? styles.textGray
                              : check.valid
                              ? styles.textGreen
                              : styles.textRed,
                          ]}
                        >
                          {check.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                </>
              )}

              {/* STEP 5: OTP */}
              {step === 5 && (
                <>
                  <Text style={styles.headingText}>Verify OTP</Text>
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
                      disabled={countdown > 0 || loading}
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
                      disabled={!otp.every((d) => d !== "") || loading}
                    >
                      <Text
                        style={[
                          styles.confirmButtonText,
                          otp.every((d) => d !== "") &&
                            styles.confirmButtonTextActive,
                        ]}
                      >
                        Verify
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* ✅ Status Modal */}
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

// Styles (unchanged)
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f2f2f2" },
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
  confirmButtonActive: { backgroundColor: "#004aad" },
  confirmButtonText: {
    color: "#999",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "SourceSans3Medium",
  },
  confirmButtonTextActive: { color: "#fff", fontFamily: "SourceSans3Medium" },
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
    borderColor: "#004aad",
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
  groupWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    gap: 15,
  },
  groupOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 18,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  groupOptionSelected: {
    borderColor: "#004aad",
    borderWidth: 2,
    backgroundColor: "#f8fbff",
  },
  groupOptionText: {
    fontSize: 16,
    color: "#777",
    fontFamily: "SourceSans3Medium",
  },
  groupOptionTextSelected: {
    color: "#004aad",
    fontFamily: "SourceSans3Medium",
  },
  passwordCheckRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 3,
  },
  bullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  bulletGray: { backgroundColor: "#ccc" },
  bulletRed: { backgroundColor: "#ff6b6b" },
  bulletGreen: { backgroundColor: "#4caf50" },
  passwordCheckText: {
    fontSize: 13,
    fontFamily: "SourceSans3Medium",
  },
  textGray: { color: "#777" },
  textRed: { color: "#ff6b6b" },
  textGreen: { color: "#4caf50" },
});

export default RegisterUserScreen;
