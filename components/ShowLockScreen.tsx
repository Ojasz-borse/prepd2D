import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import Reanimated, {
  FadeIn,
  SlideInDown,
} from "react-native-reanimated";
import RazorpayCheckout from "react-native-razorpay";
import { CREATE_ORDER, RAZORPAY_KEY, VERIFY_ORDER } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/services/api";
import {
  DEFAULT_PRICE_BEFORE,
  DEFAULT_PRICE_AFTER,
} from "@/constants/couponConfig";
import CustomAlertModal from "@/components/CustomAlertModal";
import { VERIFY_COUPON } from "@/constants/config"; // Ensure this is exported in your config
import { fetchWithRetry } from "@/services/api";


type RazorpaySuccess = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};




interface SubscriptionLockSheetProps {
  visible: boolean;
  planType: "before" | "after";
  cssType?: "type1" | "type2";
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
    description: "Unlock accurate data of all colleges in Maharashtra, and advanced filters.",
    priceText: "Unlock After MHT-CET Plan",
  },
};

const SubscriptionLockSheet: React.FC<SubscriptionLockSheetProps> = ({
  visible,
  planType,
  cssType,
  onClose,
}) => {
  const { getToken, user, updateUserSubscription } = useAuth();
  const [alertConfig, setAlertConfig] = React.useState<{
    visible: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "info";
    onClose?: () => void;
  }>({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });

  const [couponInput, setCouponInput] = React.useState("");
  const [appliedCoupon, setAppliedCoupon] = React.useState("");
  const [validationMsg, setValidationMsg] = React.useState<{ text: string; type: "valid" | "invalid" | "none" }>({
    text: "",
    type: "none",
  });
  const [isValidating, setIsValidating] = React.useState(false);

  const defaultPrice = planType === "before" ? DEFAULT_PRICE_BEFORE : DEFAULT_PRICE_AFTER;
  const [displayedPrice, setDisplayedPrice] = React.useState(defaultPrice);

  const overallCss = (cssType === "type2") ? styles.content_type2 : styles.content_type1;

  const handleCouponChange = (text: string) => {
    const code = text.toUpperCase();
    setCouponInput(code);

    // Reset applied coupon and price if input changes
    setAppliedCoupon("");
    setDisplayedPrice(defaultPrice);

    if (code.length === 0) {
      setValidationMsg({ text: "", type: "none" });
      return;
    }

    setValidationMsg({ text: "", type: "none" });
  };

  const validateCouponOnBackend = async () => {
    if (!couponInput) return;

    setIsValidating(true);
    try {
      const token = await getToken();
      const res = await fetchWithRetry(
        VERIFY_COUPON,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({
            payment_tag: planType,
            couponCode: couponInput,
          }),
        },
        2,
        1000
      );

      if (!res.ok) {
        throw new Error("Validation failed");
      }

      const data = await res.json();

      if (data.success) {
        setAppliedCoupon(couponInput);
        setDisplayedPrice(data.finalPrice);
        setValidationMsg({ text: "Coupon applied successfully!", type: "valid" });
      } else {
        setDisplayedPrice(data.finalPrice || defaultPrice);
        setValidationMsg({ text: data.message || "Invalid coupon", type: "invalid" });
      }
    } catch (err) {
      setValidationMsg({ text: "Error validating coupon", type: "invalid" });
    } finally {
      setIsValidating(false);
    }
  };

  const showAlert = (title: string, message: string, type: "success" | "error" | "info" = "info", onModalClose?: () => void) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      type,
      onClose: onModalClose,
    });
  };

  const hideAlert = () => {
    const callback = alertConfig.onClose;
    setAlertConfig((prev) => ({ ...prev, visible: false }));
    if (callback) callback();
  };

  if (!visible) return null;

  const content = CONTENT_MAP[planType] || CONTENT_MAP.before;



  const startPayment = async () => {
    try {
      const token = await getToken();

      const res = await apiFetch(CREATE_ORDER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          user_id: user?.user_id,
          payment_tag: planType,
          couponCode: appliedCoupon || null
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Payment Order Creation Failed:", {
          status: res.status,
          statusText: res.statusText,
          body: errorText,
          url: CREATE_ORDER
        });
        throw new Error(`Server returned ${res.status}: ${errorText.substring(0, 100)}`);
      }

      const order = await res.json();

      // 2️⃣ Razorpay options
      const options = {
        description: "PrepCET Subscription",
        currency: "INR",
        key: RAZORPAY_KEY, // TEST KEY ONLY
        amount: order.amount,
        order_id: order.id,
        name: "PrepCET",
        prefill: {
          email: user?.email,
          name: user?.first_name + " " + user?.last_name,
        },
        theme: { color: "#004aad" },
      };

      RazorpayCheckout.open(options)
        .then(async (data: RazorpaySuccess) => {

          // Call verify API with ALL required fields
          const verifyRes = await apiFetch(VERIFY_ORDER, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
            body: JSON.stringify({
              user_id: user?.user_id,
              payment_tag: planType,
              razorpay_order_id: data.razorpay_order_id,
              razorpay_payment_id: data.razorpay_payment_id,
              razorpay_signature: data.razorpay_signature,
              coupon_code: appliedCoupon,
            }),
          });

          if (!verifyRes.ok) {
            showAlert(
              "Payment Verification Failed",
              "Payment was done but verification failed. Please contact support.",
              "error"
            );
            return;
          }

          await updateUserSubscription(planType);
          showAlert("Payment Successful", "Subscription activated 🎉", "success", () => {
            onClose?.();
          });
        })
        .catch((error: { description?: string }) => {
          showAlert("Payment Failed", "Payment Failed.", "error");
        });

    } catch (err) {
      console.error("Payment error:", err);
      showAlert("Error", "Something went wrong while initiating payment.", "error");
    }
  };



  return (
    <Reanimated.View
      entering={FadeIn.duration(400)}
      style={styles.lockScreenContainer}
    >
      <Reanimated.View
        entering={SlideInDown.duration(600)}
        style={overallCss}
      >
        <View style={styles.handle} />

        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="crown" size={48} color="#fff" />
          </View>
        </View>

        <Text style={styles.title}>{content.title}</Text>

        <Text style={styles.description}>{content.description}</Text>

        <Text style={styles.price}>₹{displayedPrice}</Text>

        <View style={styles.couponContainer}>

          {(
            <Text style={[
              styles.validationText,
              validationMsg.type === "valid" ? styles.validText : styles.invalidText
            ]}>
              {validationMsg.text}
            </Text>
          )}

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.couponInput}
              placeholder="Coupon Code (Optional)"
              value={couponInput}
              onChangeText={handleCouponChange}
              autoCapitalize="characters"
              editable={!isValidating}
            />
            <TouchableOpacity
              style={[
                styles.applyButton,
                (!couponInput || isValidating) && styles.disabledApplyButton
              ]}
              onPress={validateCouponOnBackend}
              disabled={!couponInput || isValidating}
            >
              <Text style={styles.applyButtonText}>{isValidating ? "Applying.." : "Apply"}</Text>
            </TouchableOpacity>
          </View>

        </View>

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
          style={[
            styles.subscribeButton
          ]}
          activeOpacity={0.85}
          onPress={() => startPayment()}
          disabled={planType === "after"}
        >
          <Text style={styles.subscribeButtonText}>{content.priceText}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
        >
          <Text style={styles.closeButtonText}>Not Now</Text>
        </TouchableOpacity>


      </Reanimated.View>

      <CustomAlertModal
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={hideAlert}
      />
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
  content_type1: {
    width: "100%",
    position: "absolute",
    left: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 20,
    alignItems: "center",
    marginBottom: -10

  },
  content_type2: {
    width: "100%",
    position: "absolute",
    left: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 20,
    alignItems: "center",
    marginBottom: 150

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
  disabledButton: {
    backgroundColor: "#94a3b8",
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
  couponContainer: {
    width: "100%",
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  couponInput: {
    flex: 1,
    height: 43,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontFamily: "SourceSans3Medium",
    fontSize: 14,
    color: "#1e293b",
  },
  applyButton: {
    backgroundColor: "#004aad",
    paddingHorizontal: 20,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
  },
  disabledApplyButton: {
    backgroundColor: "#cbd5e1",
  },
  applyButtonText: {
    color: "#fff",
    fontFamily: "SourceSans3SemiBold",
    fontSize: 14,
  },
  validationText: {
    fontSize: 12,
    fontFamily: "SourceSans3Medium",
    marginLeft: 4,
    color: "#ffffff",
  },
  validText: {
    color: "#10b981",
  },
  invalidText: {
    color: "#ef4444",
  },
});
