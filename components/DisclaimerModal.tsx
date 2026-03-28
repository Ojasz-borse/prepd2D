import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface DisclaimerModalProps {
    visible: boolean;
    onClose: () => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({
    visible,
    onClose,
}) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Ionicons name="information-circle" size={32} color="#004aad" />
                        <Text style={styles.headerTitle}>Important Information</Text>
                    </View>

                    <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
                        <View style={styles.content}>
                            <Text style={styles.message}>
                                The information provided in this application is collected from publicly available sources such as the official CET Cell website, and respective college websites.
                            </Text>

                            <View style={styles.divider} />

                            <Text style={styles.note}>
                                While we strive to keep the data accurate and up-to-date, users are advised to verify important details from the official sources before making any decisions.
                            </Text>
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.button}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>I Understand</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    modalContainer: {
        width: "100%",
        maxWidth: 360,
        minHeight: 440,
        backgroundColor: "#fff",
        borderRadius: 28,
        overflow: "hidden",
        justifyContent: "space-between",
        elevation: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 24,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: "SourceSans3Medium",
        color: "#004aad",
    },
    contentScroll: {
        maxHeight: 400,
    },
    content: {
        padding: 24,
    },
    message: {
        fontSize: 16,
        fontFamily: "SourceSans3Medium",
        color: "#1e293b",
        lineHeight: 24,
        textAlign: "left",
    },
    divider: {
        height: 1,
        backgroundColor: "#e2e8f0",
        marginVertical: 20,
        width: "100%",
    },
    note: {
        fontSize: 16,
        fontFamily: "SourceSans3Medium",
        color: "#1e293b",
        lineHeight: 24,
        textAlign: "left",
    },
    footer: {
        padding: 24,
        paddingTop: 8,
        alignItems: "flex-end",
    },
    button: {
        backgroundColor: "#ff7a22",
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 999,
    },
    buttonText: {
        color: "#fff",
        fontSize: 14,
        fontFamily: "SourceSans3SemiBold",
    },
});

export default DisclaimerModal;
