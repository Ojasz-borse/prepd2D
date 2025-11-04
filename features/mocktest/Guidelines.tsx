import StatusCounter from "@/components/StatusCounter";
import { useAuth } from "@/context/AuthContext";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type GuidelinesProps = {
  isAgreed: boolean;
  setIsAgreed: (value: boolean) => void;
  setSection: (value: number) => void;
};

const todayDate = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
};

function Guidelines({ isAgreed, setIsAgreed, setSection }: GuidelinesProps) {
  const { user } = useAuth(); // assuming logout is provided

  return (
    <View style={styles.guidelinesContainer}>
      {/* ✅ Dark Blue Top Bar */}
      <View style={styles.topDarkHeader}>
        <Text style={styles.headerTitle}>PCM CET - 02</Text>

        <TouchableOpacity style={styles.langBox}>
          <Text style={styles.langText}>English</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Scrollable Content Area */}
      <View style={{ padding: 10, flex: 1 }}>
        <View style={styles.detailsBox}>
          <Text style={styles.detailsTitle}>Examinee Details</Text>
          <View style={styles.hr} />
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>
              {user?.first_name} {user?.last_name}
            </Text>

            <Text style={styles.labelRight}>Exam Duration:</Text>
            <Text style={styles.value}>180 Minutes</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Date of Exam:</Text>
            <Text style={styles.value}>{todayDate()}</Text>

            <Text style={styles.labelRight}>Maximum Marks:</Text>
            <Text style={styles.value}>200</Text>
          </View>
          <View style={styles.hr} />
          <Text style={styles.detailsTitle}>Exam Instrutions</Text>
          <View style={styles.hr} />

          {/* ✅ Now this scrolls */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={true}
          >
            <View style={{ padding: 4, paddingHorizontal: 10 }}>
              <Text style={styles.subTitle}>About Question Paper :</Text>
              <View style={styles.bulletWrapper}>
                <Text style={styles.bullet}>
                  • There are in all 150 Questions for this exam,{" "}
                  <Text style={styles.bold}>Physics - 50 Questions</Text> (1
                  mark for each question),{" "}
                  <Text style={styles.bold}>Chemistry - 50 Questions</Text> (1
                  mark for each question),{" "}
                  <Text style={styles.bold}>Mathematics - 50 Questions</Text> (2
                  mark for each question).
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
                  <StatusCounter status="answered" count={0} size={0.8} />
                </View>

                <View style={styles.tableRow}>
                  <Text style={styles.tableLabel}>Not Answered</Text>
                  <StatusCounter status="notAnswered" count={0} size={0.8} />
                </View>

                <View style={styles.tableRow}>
                  <Text style={styles.tableLabel}>Not Visited</Text>
                  <StatusCounter status="notVisited" count={0} size={0.8} />
                </View>

                <View style={styles.tableRow}>
                  <Text style={styles.tableLabel}>Marked for Review</Text>
                  <StatusCounter status="marked" count={0} size={0.8} />
                </View>

                <View style={styles.tableRow}>
                  <Text style={styles.tableLabel}>
                    Answered & Marked for Review
                  </Text>
                  <StatusCounter status="answeredMarked" count={0} size={0.8} />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* ✅ Fixed Bottom Section */}
      <View style={styles.bottomSection}>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={[styles.checkbox, isAgreed && styles.checkboxChecked]}
            onPress={() => setIsAgreed(!isAgreed)}
          >
            {isAgreed && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.agreeText}>
            I have read and accept the disclaimer, terms and conditions and
            understood the instructions given above.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.beginButton, !isAgreed && styles.beginButtonDisabled]}
          onPress={() => isAgreed && setSection(2)}
          disabled={!isAgreed}
        >
          <Text style={styles.beginButtonText}>I am ready to begin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Guidelines;

const styles = StyleSheet.create({
  guidelinesContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1, // ✅ scrolling works now
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
    flex: 1, // ✅ gives height to ScrollView area
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
    backgroundColor: "#173d60",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
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
    fontWeight: "bold",
  },

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
    fontSize: 12,
    fontWeight: "bold",
  },

  agreeText: {
    flex: 1,
    fontSize: 12,
    color: "#ff0000",
    lineHeight: 16,
    fontWeight: "bold",
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
