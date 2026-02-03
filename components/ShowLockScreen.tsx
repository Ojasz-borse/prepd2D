import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import Reanimated, {
  FadeIn,
  SlideInDown,
} from "react-native-reanimated";
import RazorpayCheckout from "react-native-razorpay";
import { Alert } from "react-native";
import { CREATE_ORDER, VERIFY_ORDER } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/services/api";


interface SubscriptionLockSheetProps {
  visible: boolean;
  planType: "before" | "after";
  onClose?: () => void;
}

const CONTENT_MAP = {
  before: {
    title: "CET Preparation Plan",
    description: "Get access to PYQ's section & Mock Tests section of the PrepCET application",
    priceText: "Unlock CET Preparation Plan",
  },
  after: {
    title: "After MHT-CET Plan",
    description: "Unlock accurate data of all 600+ colleges in Maharashtra, college predictor, and advanced filters.",
    priceText: "Unlock After MHT-CET Plan",
  },
};

const SubscriptionLockSheet: React.FC<SubscriptionLockSheetProps> = ({
  visible,
  planType,
  onClose,
}) => {
  const { getToken } = useAuth();
  if (!visible) return null;

  const content = CONTENT_MAP[planType] || CONTENT_MAP.before;



  const startPayment = async () => {
    try {
      const token = await getToken();
      // 1️⃣ Call backend to create order
      const res = await apiFetch(CREATE_ORDER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      console.log("res", res);
      const order = await res.json();

      // 2️⃣ Razorpay options
      const options = {
        description: "PrepCET Subscription",
        // image: "https://yourdomain.com/logo.png",
        currency: "INR",
        key: "rzp_test_xxxxxxxx", // TEST KEY ONLY
        amount: order.amount,
        order_id: order.id,
        name: "PrepCET",
        prefill: {
          email: "student@test.com",
          contact: "+919999999999",
          name: "Student Name",
        },
        theme: { color: "#004aad" },
      };

      // 3️⃣ Open Checkout
      RazorpayCheckout.open(options)
        .then(async (data: { razorpay_payment_id: string | undefined }) => {
          // Payment success
          Alert.alert("Success", data.razorpay_payment_id);

          // 4️⃣ Send data to backend for verification
          await apiFetch(VERIFY_ORDER, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
            body: JSON.stringify(data),
          });
        })
        .catch((error: { description: string | undefined }) => {
          Alert.alert("Payment Failed", error.description);
        });
    } catch (err) {
      console.error("Payment error:", err);
      Alert.alert("Error", "Something went wrong while initiating payment.");
    }
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
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="crown" size={48} color="#fff" />
          </View>
        </View>

        <Text style={styles.title}>{content.title}</Text>

        <Text style={styles.description}>{content.description}</Text>

        <Text style={styles.price}>₹199</Text>

        {planType === "before" && (
          <View style={styles.tabIndicatorContainer}>
            <View style={styles.tabIndicator}>
              <Feather name="book-open" size={20} color="#004aad" />
              <Text style={styles.tabLabel}>Preparation</Text>
            </View>
            <View style={styles.tabIndicator}>
              <Feather name="file-text" size={20} color="#004aad" />
              <Text style={styles.tabLabel}>Mock Tests</Text>
            </View>
          </View>
        )}

        {planType === "after" && (
          <View style={styles.tabIndicatorContainer}>
            <View style={styles.tabIndicator}>
              <Feather name="search" size={20} color="#004aad" />
              <Text style={styles.tabLabel}>Colleges</Text>
            </View>
            <View style={styles.tabIndicator}>
              <Feather name="bar-chart-2" size={20} color="#004aad" />
              <Text style={styles.tabLabel}>Estimator</Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.subscribeButton}
          activeOpacity={0.85}
          onPress={startPayment}
        >
          <Text style={styles.subscribeButtonText}>{content.priceText}</Text>
        </TouchableOpacity>


      </Reanimated.View>
    </Reanimated.View>
  );
};

export default SubscriptionLockSheet;

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
    zIndex: 1000,
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
  iconCircle: {
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
  price: {
    fontSize: 30,
    fontFamily: "SourceSans3Bold",
    color: "#004aad",
    textAlign: "center",
    marginBottom: 12,
    marginTop: -18,
  },
  description: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    color: "#64748b",
    textAlign: "center",
    lineHeight: 24,
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
  tabIndicatorContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
    justifyContent: "center",
    width: "100%",
  },
  tabIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 30,
    backgroundColor: "rgba(0, 74, 173, 0.1)",
    gap: 8,
  },
  tabLabel: {
    fontSize: 14,
    fontFamily: "SourceSans3SemiBold",
    color: "#004aad",
  },
});
