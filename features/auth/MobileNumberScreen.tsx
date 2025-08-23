"use client"

import { useState } from "react"
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Dimensions } from "react-native"
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window")

const App = () => {
  const [mobileNumber, setMobileNumber] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter();

  const handleConfirm = () => {
    console.log("Mobile Number:", mobileNumber)
    router.push("/(auth)/otp");

  }

  const showFloatingLabel = isFocused || mobileNumber.length > 0

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Logo and Subtitle */}
        <View style={styles.logoSection}>
          <Text style={styles.logoText}>PrepAcademy</Text>
          <Text style={styles.tagline}>All Things Startups.</Text>
        </View>

        {/* Input Section */}
        <View style={styles.formSection}>
          <Text style={styles.label}>Enter Mobile Number</Text>

          <View style={styles.inputWrapper}>
            {/* Floating Label */}
            {showFloatingLabel && (
              <View style={styles.floatingLabelContainer}>
                <Text style={styles.floatingLabel}>Number</Text>
              </View>
            )}

            <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
              {/* Show Country Code only on focus or when user typed */}
              {showFloatingLabel && <Text style={styles.countryCodeText}>🇮🇳 +91</Text>}

              <TextInput
                style={styles.input}
                placeholder={showFloatingLabel ? "000 000 0000" : "Number"}
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                value={mobileNumber}
                onChangeText={setMobileNumber}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </View>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            style={[styles.confirmButton, mobileNumber.length > 0 && styles.confirmButtonActive]}
            onPress={handleConfirm}
            disabled={mobileNumber.length === 0}
          >
            <Text
              style={[
                styles.confirmButtonText,
                mobileNumber.length > 0 && styles.confirmButtonTextActive,
              ]}
            >
              Confirm
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
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
  },
  tagline: {
    fontSize: 16,
    color: "#555",
  },
  formSection: {
    width: "100%",
    paddingHorizontal: width * 0.05,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 10,
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
    marginBottom: 20,
  },
  floatingLabelContainer: {
    position: "absolute",
    left: 15,
    top: -8,
    zIndex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 4,
  },
  floatingLabel: {
    fontSize: 14,
    color: "#063866",
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  inputContainerFocused: {
    borderColor: "#063866",
    borderWidth: 2,
  },
  countryCodeText: {
    fontSize: 16,
    color: "#333",
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 0,
  },
  confirmButton: {
    alignSelf: "flex-end",
    backgroundColor: "#e0e0e0",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  confirmButtonActive: {
    backgroundColor: "#063866",
  },
  confirmButtonText: {
    color: "#999",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButtonTextActive: {
    color: "#fff",
  },
})

export default App
