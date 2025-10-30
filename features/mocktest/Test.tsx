import StatusCounter from "@/components/StatusCounter";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons"; // Icons
import NavigationBar from "expo-navigation-bar";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const TestScreen = () => {
  const [section, setSection] = useState(0);
  const [isAgreed, setIsAgreed] = useState(false);

  useEffect(() => {
    const setupFullscreen = async () => {
      try {
        // Lock in landscape
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );

        // Hide status bar
        StatusBar.setHidden(true, "none");

        // ✅ Only run NavigationBar code on Android
        if (Platform.OS === "android" && NavigationBar) {
          await NavigationBar.setVisibilityAsync("hidden");
          await NavigationBar.setBehaviorAsync("overlay-swipe");
          await NavigationBar.setPositionAsync("absolute");
          await NavigationBar.setBackgroundColorAsync("#00000000");

          setTimeout(async () => {
            await NavigationBar.setVisibilityAsync("hidden");
          }, 100);
        }
      } catch (e) {
        console.log("Fullscreen setup error:", e);
      }
    };

    setupFullscreen();

    const subscription = ScreenOrientation.addOrientationChangeListener(
      async (o) => {
        if (
          o.orientationInfo.orientation !==
            ScreenOrientation.Orientation.LANDSCAPE_LEFT &&
          o.orientationInfo.orientation !==
            ScreenOrientation.Orientation.LANDSCAPE_RIGHT
        ) {
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.LANDSCAPE
          );
        }

        // ✅ Hide nav bar only on Android
        if (Platform.OS === "android" && NavigationBar) {
          await NavigationBar.setVisibilityAsync("hidden");
        }
      }
    );

    return () => {
      subscription.remove();
      StatusBar.setHidden(false);

      ScreenOrientation.unlockAsync();

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
      console.log("Error hiding nav bar:", e);
    }
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
                <Text style={styles.candidate}>John Smith</Text>
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
        <View style={styles.guidelinesContainer}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {/* ✅ Dark Blue Top Bar */}
            <View style={styles.topDarkHeader}>
              <Text style={styles.headerTitle}>PCM CET - 02</Text>

              <TouchableOpacity style={styles.langBox}>
                <Text style={styles.langText}>English</Text>
              </TouchableOpacity>
            </View>

            <View style={{ padding: 10 }}>
              <View style={styles.detailsBox}>
                <Text style={styles.detailsTitle}>Examinee Details</Text>
                <View style={styles.hr} />
                <View style={styles.row}>
                  <Text style={styles.label}>Name:</Text>
                  <Text style={styles.value}>RAJESH POTDAR</Text>

                  <Text style={styles.labelRight}>Exam Duration:</Text>
                  <Text style={styles.value}>180 Minutes</Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>Date of Exam:</Text>
                  <Text style={styles.value}>05/04/2025</Text>

                  <Text style={styles.labelRight}>Maximum Marks:</Text>
                  <Text style={styles.value}>200</Text>
                </View>
                <View style={styles.hr} />
                <Text style={styles.detailsTitle}>Exam Instrutions</Text>
                <View style={styles.hr} />
                <View style={{ padding: 4, paddingHorizontal: 10 }}>
                  <Text style={styles.subTitle}>About Question Paper :</Text>
                  <View style={styles.bulletWrapper}>
                    <Text style={styles.bullet}>
                      • There are in all 150 Questions for this exam,{" "}
                      <Text style={styles.bold}>Physics - 50 Questions</Text> (1
                      mark for each question),{" "}
                      <Text style={styles.bold}>Chemistry - 50 Questions</Text>{" "}
                      (1 mark for each question),{" "}
                      <Text style={styles.bold}>
                        Mathematics - 50 Questions
                      </Text>{" "}
                      (2 mark for each question).
                    </Text>

                    <Text style={styles.bullet}>
                      • You will be given 180 minutes to answer all questions.
                    </Text>

                    <Text style={styles.bulletBold}>
                      • There is no negative marking system for this test.
                    </Text>

                    <Text style={styles.bullet}>
                      • Questions will be in two languages (English,Marathi)
                    </Text>
                    <Text style={styles.bullet}>
                      • Mode of Examination - Online.
                    </Text>
                    <Text style={styles.bullet}>
                      • The test will comprise of multiple choice objective type
                      questions (Four Options)
                    </Text>
                    <Text style={styles.bullet}>
                      • Refer Information Broucher of MHT-CET 2026 for detail
                      information.
                    </Text>
                  </View>

                  <View style={styles.wrapper}>
                    <View style={styles.header}>
                      <Text style={styles.headerText}>Navigation Buttons</Text>
                    </View>

                    <View style={styles.tableRow}>
                      <Text style={styles.tableLabel}>Answered</Text>
                      <StatusCounter status="answered" count={0} />
                    </View>

                    <View style={styles.tableRow}>
                      <Text style={styles.tableLabel}>Not Answered</Text>
                      <StatusCounter status="notAnswered" count={0} />
                    </View>

                    <View style={styles.tableRow}>
                      <Text style={styles.tableLabel}>Not Visited</Text>
                      <StatusCounter status="notVisited" count={0} />
                    </View>

                    <View style={styles.tableRow}>
                      <Text style={styles.tableLabel}>Marked for Review</Text>
                      <StatusCounter status="marked" count={0} />
                    </View>

                    <View style={styles.tableRow}>
                      <Text style={styles.tableLabel}>
                        Answered & Marked for Review
                      </Text>
                      <StatusCounter status="answeredMarked" count={0} />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Fixed Bottom Section */}
          <View style={styles.bottomSection}>
            {/* Checkbox and I Agree Text */}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={[styles.checkbox, isAgreed && styles.checkboxChecked]}
                onPress={() => setIsAgreed(!isAgreed)}
              >
                {isAgreed && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
              <Text style={styles.agreeText}>
                I have read and understood the instructions. All the computer
                hardware allotted to me are in proper working condition. I agree
                that I am aware of the instructions and I shall not violate or
                challenge the sanctity of the examination.
              </Text>
            </View>

            {/* I am Ready to Begin Button */}
            <TouchableOpacity
              style={[
                styles.beginButton,
                !isAgreed && styles.beginButtonDisabled,
              ]}
              onPress={() => isAgreed && setSection(2)}
              disabled={!isAgreed}
            >
              <Text style={styles.beginButtonText}>I am ready to begin</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default TestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "flex-start",
    width: "100%", // Always use the larger dimension
    height: "100%", // Always use the smaller dimension
  },
  topBlueBar: {
    width: "100%",
    height: 20,
    backgroundColor: "#1a4d80",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  },

  guidelinesHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },

  headerTitle: {
    fontSize: 16,
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
});
