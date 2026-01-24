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
import * as ImagePicker from 'expo-image-picker';
import { Image } from "expo-image";

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
  const [showPaymentStep, setShowPaymentStep] = React.useState(false);
  const [screenshot, setScreenshot] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (!visible) return null;

  const handleInitialPay = () => {
    if (paymentTag === 'after_subscription') return;
    setShowPaymentStep(true);

    // Optional: Also try to open UPI app immediately
    // const upiUrl = `upi://pay?pa=9403343871@axl&pn=PrepCET&am=${upiAmount}&cu=INR&tn=prep-payment_id_${userId}_${paymentTag}`;
    // Linking.openURL(upiUrl).catch((err) =>
    //   console.log("UPI app not available or error:", err)
    // );
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setScreenshot(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!screenshot) {
      alert("Please upload a screenshot first!");
      return;
    }

    setIsSubmitting(true);
    // TODO: Implement actual submission logic (upload to server)
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Payment screenshot submitted! We will verify and activate your subscription soon.");
      setShowPaymentStep(false);
      setScreenshot(null);
    }, 2000);
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

        {!showPaymentStep ? (
          <>
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
              onPress={handleInitialPay}
              activeOpacity={0.85}
            >
              <Text style={styles.subscribeButtonText}>{priceText}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Maybe Later</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.qrHeader}>
              <TouchableOpacity onPress={() => setShowPaymentStep(false)} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#64748b" />
              </TouchableOpacity>
              <Text style={styles.qrTitle}>Scan to Pay</Text>
              <View style={{ width: 24 }} />
            </View>

            <View style={styles.qrContainer}>
              <Image
                source={require("../assets/images/pay-qr.png")}
                style={styles.qrImage}
                contentFit="contain"
              />
              <Text style={styles.qrHint}>Amount: ₹{upiAmount}</Text>
            </View>

            <View style={styles.screenshotSection}>
              {screenshot ? (
                <View style={styles.screenshotPreviewContainer}>
                  <Image source={{ uri: screenshot }} style={styles.screenshotPreview} />
                  <TouchableOpacity style={styles.changeImageButton} onPress={pickImage}>
                    <Text style={styles.changeImageText}>Change Screenshot</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                  <Ionicons name="cloud-upload-outline" size={32} color="#004aad" />
                  <Text style={styles.uploadButtonText}>Upload Transaction Screenshot</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.subscribeButton,
                (!screenshot || isSubmitting) && styles.disabledButton,
                { marginTop: 10 }
              ]}
              onPress={handleSubmit}
              disabled={!screenshot || isSubmitting}
              activeOpacity={0.85}
            >
              <Reanimated.View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {isSubmitting && <Ionicons name="refresh" size={20} color="#fff" style={{ marginRight: 8 }} />}
                <Text style={styles.subscribeButtonText}>
                  {isSubmitting ? "Submitting..." : "Complete Payment"}
                </Text>
              </Reanimated.View>
            </TouchableOpacity>
          </>
        )}
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
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    margin: "auto"
  },
  content: {
    width: "100%",
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
    marginBottom: -10,
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
  qrHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  qrTitle: {
    fontSize: 20,
    fontFamily: "SourceSans3Bold",
    color: "#004aad",
  },
  qrContainer: {
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "#f8fafc",
    padding: 20,
    borderRadius: 20,
    width: "100%",
  },
  qrImage: {
    width: 200,
    height: 200,
    marginBottom: 12,
  },
  qrHint: {
    fontSize: 16,
    fontFamily: "SourceSans3Bold",
    color: "#1e293b",
  },
  screenshotSection: {
    width: "100%",
    marginBottom: 24,
  },
  uploadButton: {
    width: "100%",
    height: 100,
    borderWidth: 2,
    borderColor: "#004aad30",
    borderStyle: "dashed",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#004aad05",
  },
  uploadButtonText: {
    marginTop: 8,
    color: "#004aad",
    fontSize: 14,
    fontFamily: "SourceSans3Medium",
  },
  screenshotPreviewContainer: {
    alignItems: "center",
  },
  screenshotPreview: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    marginBottom: 10,
  },
  changeImageButton: {
    padding: 8,
  },
  changeImageText: {
    color: "#64748b",
    fontSize: 14,
    fontFamily: "SourceSans3Medium",
    textDecorationLine: "underline",
  },
  disabledButton: {
    backgroundColor: "#cbd5e1",
  },
  successContainer: {
    alignItems: "center",
    padding: 20,
  },
  successText: {
    fontSize: 18,
    fontFamily: "SourceSans3SemiBold",
    color: "#059669",
    marginTop: 16,
    textAlign: "center",
  },
});
