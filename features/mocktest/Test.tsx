import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image, // Import Image component
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from '@expo/vector-icons'; // Import icons

const TestScreen = () => {
  // Force landscape orientation when screen mounts
  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    };
    lockOrientation();

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.leftHeader}>
          <Text style={styles.systemNameLabel}>System Name :</Text>
          <Text style={styles.systemName}>C001</Text>
        </View>
        <Text style={styles.note}>
          Kindly get in touch with the invigilator if there are any
          discrepancies in the Name and Photograph displayed on the screen or if
          the photograph is not yours
        </Text>
        <View style={styles.rightHeader}>
          <Text style={styles.candidateLabel}>Candidate Name :</Text>
          <Text style={styles.candidateName}>John Smith</Text>
          <Text style={styles.subject}>Subject : Mock Exam</Text>
          <Image
            source={{ uri: 'https://via.placeholder.com/40x40/555555/FFFFFF?text=👤' }} // Placeholder for avatar
            style={styles.avatar}
          />
        </View>
      </View>

      {/* Login Box */}
      <View style={styles.loginContainer}>
        <View style={styles.loginBox}>
          <Text style={styles.loginTitle}>Login</Text>
          <View style={styles.inputGroup}>
            <FontAwesome name="user" size={20} color="#555" style={styles.inputIcon} />
            <TextInput style={styles.input} value="11111" />
            <TouchableOpacity style={styles.keyboardIcon}>
                <FontAwesome name="keyboard-o" size={20} color="#555" />
            </TouchableOpacity>
          </View>
          <View style={styles.inputGroup}>
            <FontAwesome name="lock" size={20} color="#555" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value="••••••"
              secureTextEntry
            />
            <TouchableOpacity style={styles.keyboardIcon}>
                <FontAwesome name="keyboard-o" size={20} color="#555" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.signInButton}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0", // Light grey background
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#2b5b84",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: 70, // Fixed height for the header
  },
  leftHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  systemNameLabel: {
    color: "#fff",
    fontSize: 14,
    marginRight: 5,
  },
  systemName: {
    color: "yellow",
    fontSize: 18,
    fontWeight: "bold",
  },
  note: {
    flex: 1,
    color: "#fff",
    fontSize: 10,
    marginHorizontal: 10,
    textAlign: 'center',
  },
  rightHeader: {
    alignItems: "flex-end",
    position: 'relative', // To position the avatar
    paddingRight: 60, // Make space for the avatar
  },
  candidateLabel: {
    color: "#fff",
    fontSize: 11,
  },
  candidateName: {
    color: "#ffeb3b",
    fontSize: 16,
    fontWeight: "bold",
  },
  subject: {
    color: "#fff",
    fontSize: 11,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20, // Make it circular
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: [{ translateY: -20 }], // Center vertically
    backgroundColor: '#d0d0d0', // Placeholder background for the avatar
  },
  loginContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#e0e0e0', // Light grey background for the main content
  },
  loginBox: {
    width: 300,
    padding: 25,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
  },
  loginTitle: {
    fontSize: 22,
    marginBottom: 25,
    fontWeight: "bold",
    color: '#333',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    width: '100%',
    height: 45,
  },
  inputIcon: {
    paddingHorizontal: 10,
    color: '#888',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 8,
    paddingRight: 10,
    fontSize: 16,
    color: '#333',
  },
  keyboardIcon: {
      paddingHorizontal: 10,
      color: '#888',
  },
  signInButton: {
    backgroundColor: "#5cb85c", // Green button
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 5,
    marginTop: 20,
    width: 'auto', // Adjust width as needed
  },
  signInText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});