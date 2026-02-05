import StatusCounter from "@/components/StatusCounter";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type GuidelinesProps = {
  isAgreed: boolean;
  setIsAgreed: (value: boolean) => void;
  setSection: (value: number) => void;
};

const languages = [
  { label: "English", value: "en" },
  { label: "Marathi", value: "mr" },
  { label: "Hindi", value: "hi" },
];

const translations = {
  en: {
    examineeDetails: "Examinee Details",
    name: "Name:",
    examDuration: "Exam Duration:",
    dateOfExam: "Date of Exam:",
    maxMarks: "Maximum Marks:",
    examInstructions: "Exam Instructions",
    aboutPaper: "About Question Paper :",
    qBreakdown: "• There are in all 150 Questions for this exam, Physics - 50 Questions (1 mark for each question), Chemistry - 50 Questions (1 mark for each question), Mathematics - 50 Questions (2 mark for each question).",
    durationInfo: "• You will be given 180 minutes to answer all questions.",
    noNegative: "• There is no negative marking system for this test.",
    langInfo: "• Questions will be in two languages (English, Marathi)",
    modeInfo: "• Mode of Examination - Online.",
    formatInfo: "• The test will comprise of multiple choice objective type questions (Four Options)",
    brochureInfo: "• Refer Information Brochure of MHT-CET 2026 for detail information.",
    navButtons: "Navigation Buttons",
    answered: "Answered",
    notAnswered: "Not Answered",
    notVisited: "Not Visited",
    marked: "Marked for Review",
    ansMarked: "Answered & Marked for Review",
    agreeText: "I have read and accept the disclaimer, terms and conditions and understood the instructions given above.",
    beginBtn: "I am ready to begin",
    min: "Minutes",
  },
  mr: {
    examineeDetails: "परीक्षार्थी तपशील",
    name: "नाव:",
    examDuration: "परीक्षेचा कालावधी:",
    dateOfExam: "परीक्षेची तारीख:",
    maxMarks: "कमाल गुण:",
    examInstructions: "परीक्षेच्या सूचना",
    aboutPaper: "प्रश्नपत्रिकेबद्दल :",
    qBreakdown: "• या परीक्षेसाठी एकूण 150 प्रश्न आहेत, भौतिकशास्त्र - 50 प्रश्न (प्रत्येक प्रश्नासाठी 1 गुण), रसायनशास्त्र - 50 प्रश्न (प्रत्येक प्रश्नासाठी 1 गुण), गणित - 50 प्रश्न (प्रत्येक प्रश्नासाठी 2 गुण).",
    durationInfo: "• तुम्हाला सर्व प्रश्नांची उत्तरे देण्यासाठी 180 मिनिटे दिली जातील.",
    noNegative: "• या चाचणीसाठी कोणतीही नकारात्मक गुण पद्धत नाही.",
    langInfo: "• प्रश्न दोन भाषांमध्ये असतील (इंग्रजी, मराठी)",
    modeInfo: "• परीक्षेचे स्वरूप - ऑनलाइन.",
    formatInfo: "• परीक्षेत बहुपर्यायी वस्तुनिष्ठ प्रकारचे प्रश्न असतील (चार पर्याय)",
    brochureInfo: "• तपशीलवार माहितीसाठी MHT-CET 2026 चे माहिती पुस्तिका पहा.",
    navButtons: "नेव्हिगेशन बटणे",
    answered: "उत्तर दिले",
    notAnswered: "उत्तर दिले नाही",
    notVisited: "भेट दिली नाही",
    marked: "पुनरावलोकनासाठी चिन्हांकित",
    ansMarked: "उत्तर दिले आणि पुनरावलोकनासाठी चिन्हांकित",
    agreeText: "मी वरील सूचना वाचल्या आहेत आणि त्या मला समजल्या आहेत. मी अस्वीकरण, अटी आणि शर्ती स्वीकारतो.",
    beginBtn: "मी सुरू करण्यास तयार आहे",
    min: "मिनिटे",
  },
  hi: {
    examineeDetails: "परीक्षार्थी विवरण",
    name: "नाम:",
    examDuration: "परीक्षा की अवधि:",
    dateOfExam: "परीक्षा की तारीख:",
    maxMarks: "अधिकतम अंक:",
    examInstructions: "परीक्षा के निर्देश",
    aboutPaper: "प्रश्न पत्र के बारे में :",
    qBreakdown: "• इस परीक्षा के लिए कुल 150 प्रश्न हैं, भौतिकी - 50 प्रश्न (प्रत्येक प्रश्न के लिए 1 अंक), रसायन विज्ञान - 50 प्रश्न (प्रत्येक प्रश्न के लिए 1 अंक), गणित - 50 प्रश्न (प्रत्येक प्रश्न के लिए 2 अंक)।",
    durationInfo: "• आपको सभी प्रश्नों के उत्तर देने के लिए 180 मिनट दिए जाएंगे।",
    noNegative: "• इस परीक्षण के लिए कोई नकारात्मक अंकन प्रणाली नहीं है।",
    langInfo: "• प्रश्न दो भाषाओं (अंग्रेजी, मराठी) में होंगे",
    modeInfo: "• परीक्षा का मोड - ऑनलाइन।",
    formatInfo: "• परीक्षा में बहुविकल्पीय वस्तुनिष्ठ प्रकार के प्रश्न होंगे (चार विकल्प)",
    brochureInfo: "• विस्तृत जानकारी के लिए MHT-CET 2026 की सूचना पुस्तिका देखें।",
    navButtons: "नेविगेशन बटन",
    answered: "उत्तर दिया",
    notAnswered: "उत्तर नहीं दिया",
    notVisited: "देखा नहीं गया",
    marked: "समीक्षा के लिए चिह्नित",
    ansMarked: "उत्तर दिया और समीक्षा के लिए चिह्नित",
    agreeText: "मैंने उपरोक्त निर्देशों को पढ़ लिया है और समझ लिया है। मैं अस्वीकरण, नियमों और शर्तों को स्वीकार करता हूँ।",
    beginBtn: "मैं शुरू करने के लिए तैयार हूँ",
    min: "मिनट",
  },
};

const todayDate = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
};

function Guidelines({ isAgreed, setIsAgreed, setSection }: GuidelinesProps) {
  const { user } = useAuth();
  const [selectedLang, setSelectedLang] = useState("en");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const t = translations[selectedLang as keyof typeof translations];
  const selectedLangLabel = languages.find(l => l.value === selectedLang)?.label;

  return (
    <TouchableWithoutFeedback onPress={() => setIsDropdownOpen(false)}>
      <View style={styles.guidelinesContainer}>
        <View style={styles.topDarkHeader}>
          <Text style={styles.headerTitle}>PCM CET - 02</Text>

          <View style={styles.dropdownWrapper}>
            <TouchableOpacity
              style={styles.dropdownBox}
              onPress={() => setIsDropdownOpen(!isDropdownOpen)}
              activeOpacity={0.8}
            >
              <Text style={styles.dropdownSelectedText}>{selectedLangLabel}</Text>
              <Ionicons
                name={isDropdownOpen ? "chevron-up" : "chevron-down"}
                size={16}
                color="#333"
              />
            </TouchableOpacity>

            {isDropdownOpen && (
              <View style={styles.dropdownMenu}>
                {languages.map((lang) => (
                  <TouchableOpacity
                    key={lang.value}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedLang(lang.value);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{lang.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={{ padding: 10, flex: 1 }}>
          <View style={styles.detailsBox}>
            <Text style={styles.detailsTitle}>{t.examineeDetails}</Text>
            <View style={styles.hr} />
            <View style={styles.row}>
              <Text style={styles.label}>{t.name}</Text>
              <Text style={styles.value}>
                {user?.first_name} {user?.last_name}
              </Text>

              <Text style={styles.labelRight}>{t.examDuration}</Text>
              <Text style={[styles.value, { width: "20%", textAlign: "right" }]}>180 {t.min}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>{t.dateOfExam}</Text>
              <Text style={styles.value}>{todayDate()}</Text>

              <Text style={styles.labelRight}>{t.maxMarks}</Text>
              <Text style={[styles.value, { width: "20%", textAlign: "right" }]}>200</Text>
            </View>
            <View style={styles.hr} />
            <Text style={styles.detailsTitle}>{t.examInstructions}</Text>
            <View style={styles.hr} />

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={{ paddingBottom: 40 }}
              showsVerticalScrollIndicator={true}
            >
              <View style={{ padding: 4, paddingHorizontal: 10 }}>
                <Text style={styles.subTitle}>{t.aboutPaper}</Text>
                <View style={styles.bulletWrapper}>
                  <Text style={styles.bullet}>{t.qBreakdown}</Text>
                  <Text style={styles.bullet}>{t.durationInfo}</Text>
                  <Text style={styles.bulletBold}>{t.noNegative}</Text>
                  <Text style={styles.bullet}>{t.langInfo}</Text>
                  <Text style={styles.bullet}>{t.modeInfo}</Text>
                  <Text style={styles.bullet}>{t.formatInfo}</Text>
                  <Text style={styles.bullet}>{t.brochureInfo}</Text>
                </View>

                <View style={styles.wrapper}>
                  <View style={styles.header}>
                    <Text style={styles.headerText}>{t.navButtons}</Text>
                  </View>

                  <View style={styles.tableRow}>
                    <Text style={styles.tableLabel}>{t.answered}</Text>
                    <StatusCounter status="answered" count={0} size={0.8} />
                  </View>

                  <View style={styles.tableRow}>
                    <Text style={styles.tableLabel}>{t.notAnswered}</Text>
                    <StatusCounter status="notAnswered" count={0} size={0.8} />
                  </View>

                  <View style={styles.tableRow}>
                    <Text style={styles.tableLabel}>{t.notVisited}</Text>
                    <StatusCounter status="notVisited" count={0} size={0.8} />
                  </View>

                  <View style={styles.tableRow}>
                    <Text style={styles.tableLabel}>{t.marked}</Text>
                    <StatusCounter status="marked" count={0} size={0.8} />
                  </View>

                  <View style={styles.tableRow}>
                    <Text style={styles.tableLabel}>{t.ansMarked}</Text>
                    <StatusCounter status="answeredMarked" count={0} size={0.8} />
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={[styles.checkbox, isAgreed && styles.checkboxChecked]}
              onPress={() => setIsAgreed(!isAgreed)}
            >
              {isAgreed && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
            <Text style={styles.agreeText}>{t.agreeText}</Text>
          </View>

          <TouchableOpacity
            style={[styles.beginButton, !isAgreed && styles.beginButtonDisabled]}
            onPress={() => isAgreed && setSection(2)}
            disabled={!isAgreed}
          >
            <Text style={styles.beginButtonText}>{t.beginBtn}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default Guidelines;

const styles = StyleSheet.create({
  guidelinesContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  dropdownWrapper: {
    position: "relative",
    zIndex: 9999,
  },
  dropdownBox: {
    height: 30,
    width: 100,
    backgroundColor: "white",
    borderRadius: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownSelectedText: {
    fontSize: 12,
    color: "#333",
  },
  dropdownMenu: {
    position: "absolute",
    top: 35,
    right: 0,
    width: 100,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    zIndex: 9999,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemText: {
    fontSize: 12,
    color: "#333",
  },
  detailsBox: {
    borderWidth: 1,
    borderColor: "#d9d9d9",
    borderRadius: 4,
    marginTop: 5,
    flex: 1,
  },
  detailsTitle: {
    fontWeight: "bold",
    fontSize: 14,
    padding: 6,
    color: "#000",
    backgroundColor: "#f2f2f2",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 4,
  },
  label: {
    fontSize: 12,
    color: "#000",
    width: "25%",
  },
  value: {
    fontSize: 12,
    color: "#000",
    width: "30%",
    fontWeight: "600",
  },
  labelRight: {
    fontSize: 12,
    color: "#000",
    width: "25%",
    textAlign: "right",
  },
  subTitle: {
    fontWeight: "600",
    fontSize: 13,
    marginBottom: 8,
    color: "#000",
  },
  bulletWrapper: {
    marginLeft: 4,
    marginTop: 2,
    marginBottom: 20,
  },
  bullet: {
    fontSize: 12,
    marginBottom: 8,
    color: "#000",
    lineHeight: 18,
  },
  bulletBold: {
    fontSize: 12,
    marginBottom: 8,
    color: "#000",
    fontWeight: "bold",
    lineHeight: 18,
  },
  topDarkHeader: {
    width: "100%",
    backgroundColor: "#173d60",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    zIndex: 9999,
  },
  hr: {
    width: "100%",
    height: 1,
    backgroundColor: "#d9d9d9",
  },
  wrapper: {
    backgroundColor: "#fff",
    borderRadius: 4,
    width: "70%",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EAEAEA",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    alignItems: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "#EAEAEA",
  },
  tableLabel: {
    fontSize: 12,
    color: "#000",
    flex: 1,
  },
  header: {
    backgroundColor: "#08AEEC",
    paddingVertical: 6,
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    marginRight: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 3,
    marginRight: 8,
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
    paddingHorizontal: 15,
    paddingVertical: 10,

  },
  beginButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  beginButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
  },
});
