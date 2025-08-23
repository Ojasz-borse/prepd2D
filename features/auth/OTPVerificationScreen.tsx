"use client"
import { useState, useRef, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { useRouter } from "expo-router"

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", ""])
  const [countdown, setCountdown] = useState(179) // 2:59
  const inputRefs = useRef<(TextInput | null)[]>([])
  const router = useRouter()

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [countdown])

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp]
    newOtp[index] = text.slice(-1)
    setOtp(newOtp)

    if (text && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleBackspace = (key: string, index: number) => {
    if (key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleVerify = () => {
    const enteredOtp = otp.join("")
    if (enteredOtp === "1234") {
      router.push("/(auth)/full-name")
    } else {
      Alert.alert("Error", "❌ Invalid OTP. Try again.")
    }
  }

  const handleResendOTP = () => {
    setCountdown(179)
    setOtp(["", "", "", ""])
    inputRefs.current[0]?.focus()
  }

  const isOtpComplete = otp.every((digit) => digit !== "")

  return (
    <View style={styles.container}>
      {/* Logo + tagline */}
      <View style={styles.logoSection}>
        <Text style={styles.logoText}>PrepAcademy</Text>
        <Text style={styles.tagline}>All Things Startups.</Text>
      </View>

      {/* OTP section */}
      <View style={styles.otpContainer}>
        <Text style={styles.enterOtp}>Enter OTP</Text>

        {/* OTP Inputs */}
        <View style={styles.inputRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref
              }}
              style={[styles.inputBox, digit !== "" && styles.inputBoxFilled]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={({ nativeEvent }) => handleBackspace(nativeEvent.key, index)}
              autoFocus={index === 0}
            />
          ))}
        </View>

        {/* Resend OTP */}
        <View style={styles.resendRow}>
          <TouchableOpacity onPress={handleResendOTP} disabled={countdown > 0}>
            <Text style={[styles.resendText, countdown === 0 && styles.resendTextActive]}>
              {countdown > 0 ? `Resend OTP (${formatTime(countdown)})` : "Resend OTP"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Verify Button */}
        <View style={styles.verifyButtonContainer}>
          <TouchableOpacity
            disabled={!isOtpComplete}
            style={[
              styles.verifyButton,
              !isOtpComplete ? styles.verifyButtonDisabled : styles.verifyButtonEnabled,
            ]}
            onPress={handleVerify}
          >
            <Text
              style={[
                styles.verifyText,
                !isOtpComplete ? styles.verifyTextDisabled : styles.verifyTextEnabled,
              ]}
            >
              Verify
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 80,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
    fontFamily: "BreeSerif-Regular",
  },
  tagline: {
    fontSize: 14,
    color: "#333",
    marginBottom: 40,
    fontFamily: "BreeSerif-Regular",
    textAlign: "center",
  },
  otpContainer: {
    width: "100%",
    maxWidth: 350,
    padding: 20,
  },
  enterOtp: {
    fontSize: 16,
    fontWeight: "600",
    color: "#063866",
    marginBottom: 15,
    fontFamily: "BreeSerif-Regular",
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 2,
    marginBottom: 20,
  },
  inputBox: {
    width: 65,
    height: 65,
    borderWidth: 1.5,
    borderColor: "#063866",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
    fontFamily: "BreeSerif-Regular",
    backgroundColor: "#fff",
    color: "#000",
  },
  inputBoxFilled: {
    borderColor: "#56aeff",
    backgroundColor: "#f8fbff",
  },
  resendRow: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  resendText: {
    fontSize: 14,
    color: "#777",
    fontFamily: "BreeSerif-Regular",
  },
  resendTextActive: {
    color: "#56aeff",
    fontWeight: "600",
  },
  verifyButtonContainer: {
    alignItems: "flex-end",
  },
  verifyButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    alignItems: "center",
  },
  verifyButtonDisabled: {
    backgroundColor: "#ddd",
  },
  verifyButtonEnabled: {
    backgroundColor: "#063866",
  },
  verifyText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "BreeSerif-Regular",
  },
  verifyTextDisabled: {
    color: "#666",
  },
  verifyTextEnabled: {
    color: "#fff",
  },
})

export default OTPVerification
