import FloatingLabelInput from "@/components/FloatingLabelInput";
import TopHeader from "@/components/TopHeader";
import { useEstimator } from "@/hooks/useEstimator";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/context/AuthContext";
import { logUserAction } from "@/services/api";
import { UserFeature } from "@/constants/userActions";
import { usePreventScreenCapture } from "@/hooks/usePreventScreenCapture";
import { useSubscriptionLock } from "@/hooks/useSubcribtion";
import SubscriptionLockSheet from "@/components/ShowLockScreen";
import { useTrialUsage } from "@/hooks/useTrialUsage";

export default function EstimatorScreen() {
  const { rank, loading, error, predictRank } = useEstimator();
  const { user } = useAuth();
  usePreventScreenCapture();

  // Percentage state (separate so inputs don't overwrite each other)
  const [overallPercentage, setOverallPercentage] = useState("");
  const [errMsgRank, setErrMsgRank] = useState("");

  // Shared UI state
  const [showInfo, setShowInfo] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  const { isAllowed } = useSubscriptionLock({
    gate: "after",
  });

  const [showLock, setShowLock] = useState(false);
  const rankTrial = useTrialUsage("trial_percentile_to_rank", 3);

  // Validate percentage range
  useEffect(() => {
    const checkNumberRange = (val: string) => {
      if (val === "") return true;

      const num = Number(val);

      // ✅ Must be within 0–100
      if (isNaN(num) || num < 0 || num > 100) return false;

      // ✅ Allow only up to 7 digits after decimal
      const decimalCheck = /^(\d{1,2}(\.\d{0,7})?|100(\.0{0,7})?)$/;
      return decimalCheck.test(val);
    };

    if (!checkNumberRange(overallPercentage)) {
      setErrMsgRank("Percentage must be between 0 - 100");
      return;
    }

    setErrMsgRank("");
  }, [overallPercentage]);

  const handlePercentageInput = (
    text: string,
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (text === "") {
      setState("");
      return;
    }

    // Keep only digits and one dot
    if (!/^\d*\.?\d*$/.test(text)) return;

    const parts = text.split(".");
    if (parts.length > 2) return;

    // Limit to 7 decimal digits
    if (parts[1] && parts[1].length > 7) {
      return; // Stop if 8th digit after decimal
    }

    // Clamp max value to 100
    const num = Number(text);
    if (!isNaN(num) && num > 100) {
      setState("100");
    } else {
      setState(text);
    }
  };

  const handlePercentageBlur = (
    val: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (val) {
      const numValue = parseFloat(val);
      if (!isNaN(numValue)) {
        const clampedValue = Math.min(Math.max(numValue, 0), 100);
        const formattedValue = Number.isInteger(clampedValue)
          ? clampedValue.toString()
          : parseFloat(clampedValue.toFixed(7)).toString();
        setter(formattedValue);
      }
    }
  };

  // For rank: require overallPercentage and no validation error
  const isRankValid = overallPercentage !== "" && !errMsgRank;

  const handleCalculateRank = async () => {
    if (!isRankValid) return;

    // Check if user has access (either subscribed OR has trials remaining)
    if (!isAllowed && !rankTrial.hasRemainingTrials) {
      setShowLock(true);
      return;
    }

    await predictRank(
      Number(overallPercentage),
      0,
      0,
      0
    );
    setShowResultModal(true);

    if (user?.user_id) {
      logUserAction(user.user_id, UserFeature.PERCENTILE_TO_RANK_BUTTON);
    }

    // Increment usage ONLY if not subscribed
    if (!isAllowed) {
      await rankTrial.incrementUsage();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={["#f8fafc", "#e6f1ff", "#e8dcff"]}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <TopHeader title="Estimator" showBackArrow={true} />

        <View style={styles.contentWrapper}>
          <View style={styles.centerContainer}>
            <View style={styles.cardContainer}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Enter Overall Percentage</Text>
                <TouchableOpacity onPress={() => setShowInfo(true)}>
                  <Ionicons
                    name="information-circle-outline"
                    size={22}
                    color="#004aad"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.cardBody}>
                {!!error && <Text style={styles.errorText}>{error}</Text>}
                {!!errMsgRank && (
                  <Text style={styles.errorText}>{errMsgRank}</Text>
                )}

                <FloatingLabelInput
                  label="Overall Percentage"
                  value={overallPercentage}
                  onChangeText={(text) =>
                    handlePercentageInput(text, setOverallPercentage)
                  }
                  onBlur={() =>
                    handlePercentageBlur(
                      overallPercentage,
                      setOverallPercentage
                    )
                  }
                  keyboardType="number-pad"
                  maxLength={
                    overallPercentage.includes(".")
                      ? overallPercentage.indexOf(".") + 8
                      : 4
                  }
                />

                <View style={styles.buttonWrapper}>
                  <TouchableOpacity
                    style={[
                      styles.confirmButton,
                      isRankValid && styles.confirmButtonActive,
                    ]}
                    onPress={handleCalculateRank}
                    disabled={!isRankValid || loading}
                  >
                    <Text style={[
                      styles.confirmButtonText,
                      isRankValid && styles.confirmButtonTextActive,
                    ]}>
                      {loading ? "Calculating..." : "Calculate"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Result Modal */}
        <Modal visible={showResultModal} transparent animationType="fade">
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalBg}
            onPress={() => setShowResultModal(false)}
          >
            <View style={styles.resultBox}>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setShowResultModal(false)}
              >
                <Ionicons name="close" size={22} color="#333" />
              </TouchableOpacity>

              {!!rank && (
                <>
                  <Text style={{ fontSize: 100, opacity: 0.8 }}>🏅</Text>
                  <Text style={styles.resultText}>{rank}</Text>
                  <Text style={styles.resultTextSub}>Estimated Rank</Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Info modal */}
        <Modal visible={showInfo} transparent animationType="fade">
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalBg}
            onPress={() => setShowInfo(false)}
          >
            <View style={styles.modalBox}>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setShowInfo(false)}
              >
                <Ionicons name="close" size={22} color="#717171ff" />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Percentage to Rank — Info</Text>
              <Text style={styles.modalPoint}>
                • Enter your overall percentage (required).
              </Text>
              <Text style={styles.modalPoint}>
                • Percentage must be between 0 and 100.
              </Text>
              <Text style={styles.modalPoint}>
                • Predictions are estimates — actual rank may differ.
              </Text>
            </View>
          </TouchableOpacity>
        </Modal>

        {showLock && (
          <SubscriptionLockSheet
            visible={showLock}
            planType="after"
            onClose={() => setShowLock(false)}
          />
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

/* STYLES — kept all your font families, widths and alignment intact */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f2f2f2" },
  container: { flex: 1, backgroundColor: "#fff" },

  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d350",
    backgroundColor: "#fff",
    marginTop: -10,
    paddingHorizontal: 16,
    gap: 24,
    position: 'relative',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  movingIndicatorContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 3,
    zIndex: 0,
  },
  movingIndicator: {
    height: 3,
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  tabText: {
    fontSize: 17,
    color: "#737373",
    fontFamily: "SourceSans3SemiBold",
  },
  activeTabText: { color: colors.primary },

  contentWrapper: { flex: 1 },

  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  cardTitle: {
    fontSize: 18,
    color: "#004aad",
    fontFamily: "SourceSans3Medium",
  },
  cardBody: {
    padding: 20,
  },

  /* center content vertically */
  centerContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },

  contentBox: { marginBottom: 20 },

  errorText: {
    color: "#e11d48",
    fontSize: 13,
    fontFamily: "SourceSans3Medium",
    marginBottom: 8,
  },
  headingText: {
    fontSize: 16,
    color: "#1e293b",
    fontFamily: "SourceSans3SemiBold",
  },

  dropdown: {
    width: "100%",
    height: 55,
    backgroundColor: "#fff",
    borderColor: "#d6e0f5",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  dropdownText: {
    fontSize: 15,
    fontFamily: "SourceSans3Medium",
    color: "#333",
  },

  buttonWrapper: { width: "100%" },
  confirmButton: {
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 20,
    alignSelf: "flex-end",
  },
  confirmButtonActive: { backgroundColor: "#ff7a22" },
  confirmButtonText: {
    color: "#94a3b8",
    fontSize: 14,
    fontFamily: "SourceSans3SemiBold",
  },
  confirmButtonTextActive: { color: "#fff" },

  /* RESULT MODAL */
  resultModalBg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  resultBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
    alignItems: "center",
    position: "relative",
  },
  resultText: {
    fontSize: 30,
    fontFamily: "SourceSans3Medium",
    color: colors.primary,
    textAlign: "center",
    marginTop: 8,
  },
  resultTextSub: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    color: "#333",
  },
  closeBtn: { position: "absolute", top: 12, right: 12, padding: 6 },

  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 12,
    position: "relative",
  },
  modalTitle: {
    fontFamily: "SourceSans3Medium",
    color: colors.primary,
    fontSize: 18,
    marginBottom: 20,
  },
  modalPoint: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    marginBottom: 6,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    alignSelf: "center",
    borderRadius: 18,
    padding: 12,
    marginTop: 16,
  },
  heading: {
    fontSize: 18,
    fontFamily: "SourceSans3SemiBold",
    color: "#004aad",
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: "column",
    flexWrap: "wrap",
    gap: 12,
  },
  gridItem: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  iconBox: {
    padding: 12,
    borderRadius: 12,
  },
  gridTitle: {
    fontSize: 16,
    fontFamily: "SourceSans3SemiBold",
    color: "#2E2E32",
  },
  banner: {
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    marginBottom: 4,
  },
  bannerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bannerTitle: {
    fontSize: 20,
    fontFamily: "SourceSans3Bold",
    color: "#fff",
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    fontFamily: "SourceSans3Medium",
    color: "#e6f1ff",
    lineHeight: 20,
    paddingRight: 10,
  },
  bannerIcon: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 15,
  },



  lockScreenContainer: {
    flex: 1,
    backgroundColor: "#00000050",
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "100%",
    position: "absolute",
    left: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',

  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#e2e8f0',
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
    backgroundColor: '#004aad',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#004aad',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontFamily: 'SourceSans3Bold',
    color: '#004aad',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'SourceSans3Medium',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  subscribeButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#004aad',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'SourceSans3SemiBold',
  },
  closeButton: {
    paddingVertical: 12,
  },
  closeButtonText: {
    color: '#94a3b8',
    fontSize: 16,
    fontFamily: 'SourceSans3Medium',
  },
});
