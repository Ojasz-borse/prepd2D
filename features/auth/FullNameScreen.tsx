"use client"
import { useState } from "react"
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Dimensions } from "react-native"
import { useRouter } from "expo-router"

const { width } = Dimensions.get("window")

export default function NameInputScreen() {
  const [name, setName] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()

  const handleConfirm = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter your name")
      return
    }

    // Navigate to next screen
    router.push("/home")
  }

  const showFloatingLabel = isFocused || name.length > 0

  return (
    <View style={styles.container}>
      {/* Logo + tagline */}
      <View style={styles.logoSection}>
        <Text style={styles.logoText}>PrepAcademy</Text>
        <Text style={styles.tagline}>All Things Startups.</Text>
      </View>

      {/* Name Input Section */}
      <View style={styles.inputContainer}>
        <Text style={styles.enterName}>Enter your name</Text>

        <View style={styles.inputWrapper}>
          {/* Floating Label */}
          {showFloatingLabel && (
            <View style={styles.floatingLabelContainer}>
              <Text style={styles.floatingLabel}>Name</Text>
            </View>
          )}

          <View style={[styles.nameInputContainer, isFocused && styles.nameInputContainerFocused]}>
            <TextInput
              style={styles.nameInput}
              value={name}
              onChangeText={setName}
              placeholder={showFloatingLabel ? "Enter your full name" : "Name"}
              placeholderTextColor="#999"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </View>
        </View>

        {/* Confirm Button */}
        <View style={styles.confirmButtonContainer}>
          <TouchableOpacity
            disabled={!name.trim()}
            style={[styles.confirmButton, !name.trim() ? styles.confirmButtonDisabled : styles.confirmButtonEnabled]}
            onPress={handleConfirm}
          >
            <Text style={[styles.confirmText, !name.trim() ? styles.confirmTextDisabled : styles.confirmTextEnabled]}>
              Confirm
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
    backgroundColor: "#f5f5f5",
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
    fontFamily: "BreeSerif",
  },
  tagline: {
    fontSize: 14,
    color: "#333",
    fontFamily: "BreeSerif",
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    maxWidth: 350,
    paddingHorizontal: width * 0.05,
  },
  enterName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 10,
    fontFamily: "BreeSerif",
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
    fontFamily: "BreeSerif",
  },
  nameInputContainer: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  nameInputContainerFocused: {
    borderColor: "#063866",
    borderWidth: 2,
  },
  nameInput: {
    fontSize: 16,
    fontFamily: "BreeSerif",
    color: "#333",
    paddingVertical: 0,
  },
  confirmButtonContainer: {
    alignItems: "flex-end",
  },
  confirmButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: "#e0e0e0",
  },
  confirmButtonEnabled: {
    backgroundColor: "#063866",
  },
  confirmText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "BreeSerif",
  },
  confirmTextDisabled: {
    color: "#999",
  },
  confirmTextEnabled: {
    color: "#fff",
  },
})
