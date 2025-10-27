import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AuthStatusModalProps {
  visible: boolean;
  loading?: boolean;
  message: string;
  error?: boolean;
  onClose?: () => void;
  showButton?: boolean;
}

const AuthStatusModal: React.FC<AuthStatusModalProps> = ({
  visible,
  loading = false,
  message,
  error = false,
  onClose,
  showButton = false,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Cross icon for error state */}
          {error && (
            <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
              <Ionicons name="close" size={22} color="#484848ff" />
            </TouchableOpacity>
          )}

          {loading && !error && (
            <>
              <Image
                source={require("./../assets/images/loading.gif")}
                style={styles.gif}
              />
              <Text style={styles.modalMessage}>{message}</Text>
            </>
          )}

          {!loading && (
            <>
              <Image
                source={
                  error
                    ? require("./../assets/images/failed.gif")
                    : require("./../assets/images/success.gif")
                }
                style={styles.gif}
              />
              <Text
                style={[
                  styles.modalMessage,
                  { color: error ? "red" : "#004aad" },
                ]}
              >
                {message}
              </Text>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "80%",
    alignItems: "center",
    paddingVertical: 40,
    position: "relative",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 6,
  },
  modalMessage: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    textAlign: "center",
    marginTop: 20,
    width: "70%",
  },
  gif: { width: 100, height: 80 },
});

export default AuthStatusModal;
