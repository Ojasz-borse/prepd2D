import { useAuth } from "@/context/AuthContext";
import { useMockTests } from "@/hooks/useMockTests";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons"; // Icons
import NavigationBar from "expo-navigation-bar";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import * as ScreenCapture from "expo-screen-capture";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect, useState } from "react";
import {
  BackHandler,
  Image,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Exam from "./Exam";
import Guidelines from "./Guidelines";
import { usePreventScreenCapture } from "@/hooks/usePreventScreenCapture";

interface PYQItem {
  id: number;
  pyq_content: string;
  a: string;
  b: string;
  c: string;
  d: string;
  correct_option: string;
  explanation_content: string;
}

const StartMockTest = () => {
  const { user } = useAuth(); // assuming logout is provided
  const [section, setSection] = useState(0);
  const [isAgreed, setIsAgreed] = useState(false);
  const [questions, setQuestions] = useState<PYQItem[]>([]);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const { testid } = useLocalSearchParams();

  const { fetchMockTestQuestions } = useMockTests();


  const navigation = useNavigation();
  const exitPromptShownRef = React.useRef(false);

  useEffect(() => {
    const loadQuestions = async () => {
      const q = await fetchMockTestQuestions(testid as string);
      setQuestions(q);
    };

    loadQuestions();
  }, [testid]);

  usePreventScreenCapture();

  // useEffect(() => {
  //   const setupFullscreen = async () => {
  //     try {
  //       // Lock in landscape
  //       await ScreenOrientation.lockAsync(
  //         ScreenOrientation.OrientationLock.LANDSCAPE
  //       );

  //       // Hide status bar
  //       StatusBar.setHidden(true, "none");

  //       // ✅ Only run NavigationBar code on Android
  //       if (Platform.OS === "android" && NavigationBar) {
  //         await NavigationBar.setVisibilityAsync("hidden");
  //         await NavigationBar.setBehaviorAsync("overlay-swipe");
  //         await NavigationBar.setPositionAsync("absolute");
  //         await NavigationBar.setBackgroundColorAsync("#00000000");

  //         setTimeout(async () => {
  //           await NavigationBar.setVisibilityAsync("hidden");
  //         }, 100);
  //       }
  //     } catch (e) {
  //       console.log("Fullscreen setup error:", e);
  //     }
  //   };

  //   setupFullscreen();

  //   const subscription = ScreenOrientation.addOrientationChangeListener(
  //     async (o) => {
  //       if (
  //         o.orientationInfo.orientation !==
  //           ScreenOrientation.Orientation.LANDSCAPE_LEFT &&
  //         o.orientationInfo.orientation !==
  //           ScreenOrientation.Orientation.LANDSCAPE_RIGHT
  //       ) {
  //         await ScreenOrientation.lockAsync(
  //           ScreenOrientation.OrientationLock.LANDSCAPE
  //         );
  //       }

  //       // ✅ Hide nav bar only on Android
  //       if (Platform.OS === "android" && NavigationBar) {
  //         await NavigationBar.setVisibilityAsync("hidden");
  //       }
  //     }
  //   );

  //   return () => {
  //     subscription.remove();
  //     StatusBar.setHidden(false);

  //     ScreenOrientation.unlockAsync();

  //     if (Platform.OS === "android" && NavigationBar) {
  //       NavigationBar.setVisibilityAsync("visible");
  //     }
  //   };
  // }, []);

  useEffect(() => {
    const lockLandscape = async () => {
      // Force Landscape immediately
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );

      // Hide Status Bar
      StatusBar.setHidden(true, "none");

      // Hide Android Navigation Bar (Soft keys)
      if (Platform.OS === "android" && NavigationBar) {
        await NavigationBar.setVisibilityAsync("hidden");
        await NavigationBar.setBehaviorAsync("overlay-swipe");
      }
    };

    lockLandscape();

    // CLEANUP: Run this when leaving the page
    return () => {
      // Force back to Portrait
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );

      // Show Status Bar
      StatusBar.setHidden(false);

      // Show Android Navigation Bar
      if (Platform.OS === "android" && NavigationBar) {
        NavigationBar.setVisibilityAsync("visible");
      }
    };
  }, []);

  const handleScreenTouch = async () => {
    try {
      if (Platform.OS === "android" && NavigationBar) {
        await NavigationBar.setVisibilityAsync("hidden");
      }
    } catch (e) {
      // console.log("Error hiding nav bar:", e);
    }
  };

  const exitGuard = React.useRef(false);

  useFocusEffect(
    React.useCallback(() => {
      if (section < 1) return;

      const onBackPress = () => {
        setShowExitConfirm(true);
        return true; // block default
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => {
        backHandler.remove();
      };
    }, [section])
  );

  const handleConfirmExit = () => {
    setShowExitConfirm(false);
    router.back();
  };

  return (
    <View style={styles.container}>
      {section == 0 && (
        <>
          {/* Top Blue Bar - now spans full width */}
          <View style={styles.topBlueBar} />

          {/* Header Panel */}
          <View style={styles.headerPanel}>
            <View style={styles.leftBox}>
              <Text style={styles.smallWhite}>System Name :</Text>
              <Text style={styles.systemId}>C001</Text>
              <Text style={styles.disclaimer}>
                Kindly get in touch with the invigilator if there are any
                discrepancies in the Name and Photograph displayed on the screen
                or if the photograph is not yours
              </Text>
            </View>

            <View style={styles.rightBox}>
              <View>
                <Text style={styles.smallWhite}>Candidate Name :</Text>
                <Text style={styles.candidate}>
                  {user?.first_name} {user?.last_name}
                </Text>
                <View style={{ flexDirection: "row", marginTop: 2 }}>
                  <Text style={styles.smallWhite}>Subject :</Text>
                  <Text style={styles.subject}> Mock Exam</Text>
                </View>
              </View>
              <Image
                source={require("./../../assets/images/avatar.png")}
                style={styles.avatar}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Centered Login Box */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginTitle}>Login</Text>

            {/* Username */}
            <View style={styles.inputBox}>
              <View style={styles.iconBox}>
                <FontAwesome name="user" size={16} color="#999" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter User ID"
                placeholderTextColor="#999"
                defaultValue="11111"
              />
              <View style={styles.iconBox}>
                <MaterialIcons name="keyboard" size={16} color="#999" />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputBox}>
              <View style={styles.iconBox}>
                <MaterialIcons name="lock" size={16} color="#999" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry
                defaultValue="•••••"
              />
              <View style={styles.iconBox}>
                <MaterialIcons name="keyboard" size={16} color="#999" />
              </View>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              style={styles.signInButton}
              onPress={() => setSection(1)}
            >
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {section == 1 && (
        <Guidelines
          setIsAgreed={setIsAgreed}
          isAgreed={isAgreed}
          setSection={setSection}
        />
      )}

      {section == 2 && <Exam questions={questions} />}

      {/* Exit Confirmation Modal */}
      <Modal
        visible={showExitConfirm}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowExitConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Exit Test?</Text>
            <Text style={styles.modalBody}>
              Are you sure you want to exit? Your progress will not be saved.
            </Text>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalCancelBtn]}
                onPress={() => setShowExitConfirm(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalConfirmBtn]}
                onPress={handleConfirmExit}
              >
                <Text style={styles.modalBtnText}>Exit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default StartMockTest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    margin: "auto",
    width: 800, // Always use the larger dimension
    height: "100%", // Always use the smaller dimension
    borderWidth: 1,
    borderColor: "#000",
  },
  topBlueBar: {
    width: "100%",
    height: 20,
    backgroundColor: "#1a4d80",
  },
  headerPanel: {
    width: "100%",
    backgroundColor: "#6d6d6d", // Gray header
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 10,
  },
  leftBox: { flex: 3 },
  rightBox: {
    flexDirection: "row",
    justifyContent: "flex-end",
    textAlign: "right",
    alignItems: "center",
  },
  smallWhite: { color: "#ffffff", fontSize: 12 },
  systemId: { fontSize: 18, color: "#e6e600" },
  candidate: { fontSize: 18, color: "#e6e600" },
  subject: { fontSize: 12, color: "#e6e600" },
  disclaimer: { color: "#ffffff", fontSize: 13, width: "90%" },
  avatar: { width: 70, height: 70 },

  loginContainer: {
    backgroundColor: "#ffffff", // White login box
    width: 320,
    alignSelf: "center",
    marginTop: 30,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    paddingBottom: 20,
  },
  loginTitle: {
    fontSize: 12,
    padding: 8,
    marginBottom: 15,
    backgroundColor: "#e6e6e6",
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 3,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    height: 35,
    marginHorizontal: 30,
  },
  input: {
    flex: 1,
    color: "#000",
    fontSize: 12,
    paddingHorizontal: 20,
  },
  signInButton: {
    backgroundColor: "#3399ff",
    paddingVertical: 10,
    borderRadius: 3,
    marginTop: 16,
    marginHorizontal: 30,
  },
  signInText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 12,
  },
  iconBox: {
    backgroundColor: "#e6e6e670", // Light gray
    padding: 10,
    width: 45,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  guidelinesContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    height: 200,
  },

  guidelinesHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },

  langBox: {
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  langText: {
    fontSize: 12,
    color: "#000",
  },

  detailsBox: {
    borderWidth: 1,
    borderColor: "#d9d9d9",
    borderRadius: 4,

    marginTop: 5,
  },

  detailsTitle: {
    fontWeight: "bold",
    fontSize: 14,
    padding: 4,
    color: "#000",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 1,
  },

  label: {
    fontSize: 12,
    color: "#000",
    width: "25%",
  },

  value: {
    fontSize: 12,
    color: "#000",
    width: "25%",
    fontWeight: "600",
  },

  labelRight: {
    fontSize: 12,
    color: "#000",
    width: "30%",
    textAlign: "right",
  },

  instructionsBox: {
    borderWidth: 1,
    borderColor: "#d9d9d9",
    borderRadius: 4,
    padding: 10,
    marginTop: 10,
    flex: 1,
  },

  subTitle: {
    fontWeight: "600",
    fontSize: 12,
  },

  bulletWrapper: {
    marginLeft: 8,
    marginTop: 2,
  },

  bullet: {
    fontSize: 12,
    marginBottom: 6,
    color: "#000",
    lineHeight: 16,
  },

  bulletBold: {
    fontSize: 12,
    marginBottom: 6,
    color: "#000",
    fontWeight: "bold",
    lineHeight: 16,
  },

  bold: {
    fontWeight: "bold",
  },
  topDarkHeader: {
    width: "100%",
    backgroundColor: "#173d60", // dark navy blue from screenshot
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  hr: {
    width: "100%",
    height: 1,
    backgroundColor: "#d9d9d9",
  },

  wrapper: {
    backgroundColor: "#fff",
    borderRadius: 4,
    width: "50%",
    overflow: "hidden",
    elevation: 1,
    marginLeft: 12,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
    alignItems: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "#EAEAEA",
  },
  tableLabel: {
    fontSize: 12,
    color: "#000",
  },

  header: {
    backgroundColor: "#08AEEC",
    paddingVertical: 4,
    alignItems: "center",
  },
  headerText: {
    color: "#000000",
    fontSize: 12,
  },

  // New styles for bottom section
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f8f8f8",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    marginRight: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 3,
    marginRight: 10,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#3399ff",
    borderColor: "#3399ff",
  },
  checkmark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  agreeText: {
    flex: 1,
    fontSize: 12,
    color: "#ff0000", // Red color as requested
    lineHeight: 16,
  },
  beginButton: {
    backgroundColor: "#28a745",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    minWidth: 150,
  },
  beginButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  beginButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "50%", // Landscape friendly width
    padding: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1a4d80",
  },
  modalBody: {
    fontSize: 14,
    color: "#333",
    marginBottom: 20,
    lineHeight: 20,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  modalBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  modalCancelBtn: {
    backgroundColor: "#ccc",
  },
  modalConfirmBtn: {
    backgroundColor: "#d9534f", // Red for destructive action
  },
  modalBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
