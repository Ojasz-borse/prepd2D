import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Reanimated, {
  FadeIn,
  SlideInDown,
} from "react-native-reanimated";

interface SubscriptionLockSheetProps {
  visible: boolean;
  title: string;
  description: string;
  subDescription?: string;
  priceText: string;
  upiAmount: number;
  userId?: string;
  paymentTag: string; // before_subscription | after_subscription
//   onClose: () => void;
}

const SubscriptionLockSheet: React.FC<SubscriptionLockSheetProps> = ({
  visible,
  title,
  description,
  subDescription,
  priceText,
  upiAmount,
  userId,
  paymentTag,
//   onClose,
}) => {
  if (!visible) return null;

  const handlePayment = () => {
    const upiUrl = `upi://pay?pa=9403343871@axl&pn=PrepCET&am=${upiAmount}&cu=INR&tn=prep-payment_id_${userId}_${paymentTag}`;
    Linking.openURL(upiUrl).catch((err) =>
      console.error("Couldn't load UPI", err)
    );
  };

  return (
    <Reanimated.View
      entering={FadeIn.duration(400)}
      style={styles.lockScreenContainer}
    >
      <Reanimated.View
        entering={SlideInDown.duration(600)}
        style={styles.content}
      >
        <View style={styles.handle} />

        <View style={styles.iconContainer}>
          <View style={styles.lockCircle}>
            <Ionicons name="lock-closed" size={40} color="#fff" />
          </View>
        </View>

        <Text style={styles.title}>{title}</Text>

        <Text style={styles.description}>{description}</Text>

        {subDescription && (
          <Text style={styles.subDescription}>{subDescription}</Text>
        )}

        <TouchableOpacity
          style={styles.subscribeButton}
          onPress={handlePayment}
          activeOpacity={0.85}
        >
          <Text style={styles.subscribeButtonText}>{priceText}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Maybe Later</Text>
        </TouchableOpacity>
      </Reanimated.View>
    </Reanimated.View>
  );
};

export default SubscriptionLockSheet;

/* ───────────────────────── STYLES ───────────────────────── */

const styles = StyleSheet.create({
  lockScreenContainer: {
    flex: 1,
    backgroundColor: "#00000050",
    width: "110%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  content: {
    width: "97%",
    position: "absolute",
    left: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#e2e8f0",
    borderRadius: 2,
    marginBottom: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  lockCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#004aad",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#004aad",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontFamily: "SourceSans3Bold",
    color: "#004aad",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    color: "#64748b",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  subDescription: {
    fontSize: 14,
    fontFamily: "SourceSans3Medium",
    color: "#64748b80",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  subscribeButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#004aad",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  subscribeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "SourceSans3SemiBold",
  },
  closeButton: {
    paddingVertical: 12,
  },
  closeButtonText: {
    color: "#94a3b8",
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
  },
});
