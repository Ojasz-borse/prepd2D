import { Image } from "expo-image";
import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";

interface AuthStatusModalProps {
  visible: boolean;
  loading?: boolean;
  message: string;
  error?: boolean;
  onClose?: () => void;
  showButton?: boolean; // if true, show button (e.g., for errors)
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
  },
  modalMessage: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    textAlign: "center",
    marginTop: 20,
    width: "70%",
  },
  gif: { width: 100, height: 80 },
  buttonWrapper: {
    width: "100%",
    alignItems: "flex-end",
    position: "relative",
    bottom: 180,
  },
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
  confirmButtonTextActive: { color: "#fff" },
});

export default AuthStatusModal;
