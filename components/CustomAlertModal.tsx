import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CustomAlertModalProps {
    visible: boolean;
    title: string;
    message: string;
    type?: "success" | "error" | "info";
    onClose: () => void;
}

const CustomAlertModal: React.FC<CustomAlertModalProps> = ({
    visible,
    title,
    message,
    type = "info",
    onClose,
}) => {
    const getIcon = () => {
        switch (type) {
            case "success":
                return <Ionicons name="checkmark-circle" size={60} color="#10b981" />;
            case "error":
                return <Ionicons name="alert-circle" size={60} color="#ef4444" />;
            default:
                return <Ionicons name="information-circle" size={60} color="#004aad" />;
        }
    };

    const getTitleColor = () => {
        switch (type) {
            case "success":
                return "#059669";
            case "error":
                return "#dc2626";
            default:
                return "#004aad";
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.iconContainer}>{getIcon()}</View>
                    <Text style={[styles.title, { color: getTitleColor() }]}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: getTitleColor() }]}
                        onPress={onClose}
                    >
                        <Text style={styles.buttonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalContainer: {
        width: "100%",
        maxWidth: 340,
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 24,
        alignItems: "center",
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
    },
    iconContainer: {
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontFamily: "SourceSans3Bold",
        marginBottom: 8,
        textAlign: "center",
    },
    message: {
        fontSize: 16,
        fontFamily: "SourceSans3Medium",
        color: "#475569",
        textAlign: "center",
        marginBottom: 24,
        lineHeight: 22,
    },
    button: {
        width: "100%",
        height: 50,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "SourceSans3Bold",
    },
});

export default CustomAlertModal;
