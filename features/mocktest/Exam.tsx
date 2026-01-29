import MathText from "@/components/MathText";
import StatusCounter from "@/components/StatusCounter";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomDropdown from "./CustomDropdown";

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

interface UserAnswer {
  id: number;
  section: "physics" | "chemistry" | "maths";
  question: string;
  options: { a: string; b: string; c: string; d: string };
  correct_option: string;
  user_choice: string | null;
  explanation: string;
}

interface ExamProps {
  questions: PYQItem[];
}

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
};

const todayDate = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
};

const Exam: React.FC<ExamProps> = ({ questions }) => {
  const { user } = useAuth(); // assuming logout is provided

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [id: number]: string | null }>({});
  const [visited, setVisited] = useState<number[]>([]);
  const [marked, setMarked] = useState<{ [id: number]: boolean }>({});
  const [section, setSection] = useState<"physics" | "chemistry" | "maths">(
    "physics"
  );
  const [sectionLocked, setSectionLocked] = useState(false);
  const [mathsUnlocked, setMathsUnlocked] = useState(false);
  const [showMathConfirm, setShowMathConfirm] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const [remainingSeconds, setRemainingSeconds] = useState(180 * 60); // 3 hours in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);

  // ✅ filter questions based on section
  const filteredQuestions = (() => {
    if (section === "physics") return questions.slice(0, 50);
    if (section === "chemistry") return questions.slice(50, 100);
    return questions.slice(100, 150);
  })();

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [section]);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      submitTest();
    }
  }, [remainingSeconds]);

  if (questions.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} color={"#1a4d80"} />
        <Text style={{ marginTop: 10 }}>Loading Questions...</Text>
      </View>
    );
  }

  const currentQ = filteredQuestions[currentIndex];
  if (!currentQ) return null;

  const handleSelect = (opt: string) => {
    setAnswers({ ...answers, [currentQ.id]: opt });

    setUserAnswers((prev) => {
      const existsIndex = prev.findIndex((ua) => ua.id === currentQ.id);
      const entry: UserAnswer = {
        id: currentQ.id,
        section,
        question: currentQ.pyq_content,
        options: { a: currentQ.a, b: currentQ.b, c: currentQ.c, d: currentQ.d },
        correct_option: currentQ.correct_option,
        user_choice: opt,
        explanation: currentQ.explanation_content,
      };

      if (existsIndex !== -1) {
        const newArr = [...prev];
        newArr[existsIndex] = entry;
        return newArr;
      } else {
        return [...prev, entry];
      }
    });
  };



  const handleSubmit = () => {
    if (isSubmitting) return;

    if (remainingSeconds > 0) {
      setShowSubmitConfirm(true);
    } else {
      submitTest();
    }
  };

  const submitTest = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    // console.log("Submitted Answers: ", userAnswers);
    router.replace({
      pathname: "/result",
      params: { data: JSON.stringify(userAnswers) },
    });
  };

  const goNext = () => {
    if (!visited.includes(currentQ.id)) setVisited([...visited, currentQ.id]);

    if (section === "physics" && currentIndex === 49) {
      setSection("chemistry");
      setCurrentIndex(0);
      return;
    }

    if (section === "chemistry" && currentIndex === 49) {
      if (!mathsUnlocked) {
        setShowMathConfirm(true);
        return;
      }
    }

    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const toggleMarkForReview = (id: number) => {
    setMarked({ ...marked, [id]: !marked[id] });
  };

  const getStatus = (id: number) => {
    if (marked[id] && answers[id]) return "answeredMarked";
    if (marked[id] && !answers[id]) return "marked";
    if (!visited.includes(id) && id !== currentQ.id) return "notVisited";
    if (answers[id]) return "answered";
    return "notAnswered";
  };

  const handleFinalMathEntry = () => {
    setMathsUnlocked(true);
    setSectionLocked(true);
    setSection("maths");
    setCurrentIndex(0);
    setShowMathConfirm(false);
  };

  const dropdownData: { label: string; value: "physics" | "chemistry" | "maths" }[] = mathsUnlocked
    ? [{ label: "Mathematics", value: "maths" }]
    : [
      { label: "Physics", value: "physics" },
      { label: "Chemistry", value: "chemistry" },
    ];

  return (
    <View style={styles.section2Container}>
      {/* Header */}
      <View style={styles.section2Header}>
        <Text style={styles.headerTextWhite}>
          Name : {user?.first_name} {user?.last_name}
        </Text>
        <Text style={styles.headerTextWhite}>Date : {todayDate()}</Text>
        <Text style={[styles.headerTextWhite, { fontWeight: "bold", fontSize: 13 }]}>
          Remaining Time : {formatTime(remainingSeconds)}
        </Text>
      </View>

      <View style={styles.section2Body}>
        {/* LEFT PANEL */}
        <View style={styles.paletteBox}>
          <Text style={styles.paletteTitle}>
            Section{" "}
            {section === "physics"
              ? "Physics"
              : section === "chemistry"
                ? "Chemistry"
                : "Mathematics"}
          </Text>

          <ScrollView contentContainerStyle={styles.paletteGrid}>
            {filteredQuestions.map((q, i) => (
              <TouchableOpacity
                key={q.id}
                onPress={() => {
                  setVisited([...new Set([...visited, q.id])]);
                  setCurrentIndex(i);
                }}
              >
                <StatusCounter
                  count={
                    section === "physics"
                      ? i + 1
                      : section === "chemistry"
                        ? i + 51
                        : i + 101
                  }
                  status={getStatus(q.id)}
                  size={0.7}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* RIGHT PANEL */}
        <View style={styles.questionArea}>
          <View style={styles.subHeader}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* ✅ Mark for review */}
              <TouchableOpacity
                style={styles.markReviewRow}
                onPress={() => toggleMarkForReview(currentQ.id)}
              >
                <View
                  style={[
                    styles.markCheckbox,
                    marked[currentQ.id] && { backgroundColor: "#3399ff" },
                  ]}
                />
                <Text style={styles.markText}>Mark for Review</Text>
              </TouchableOpacity>

              {/* ✅ dropdown */}
              <View
                style={{
                  width: 200,
                  flexDirection: "row",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    marginBottom: 2,
                    color: "#000",
                  }}
                >
                  Section
                </Text>
                <CustomDropdown
                  data={dropdownData}
                  value={section}
                  onChange={(item) => {
                    if (item.value === "maths" && !mathsUnlocked) {
                      setShowMathConfirm(true);
                      return;
                    }
                    setSection(item.value);
                  }}
                />
              </View>
            </View>
          </View>

          <View style={{ padding: 6 }}>
            <View style={styles.qHeader}>
              <Text style={styles.qNumber}>
                Question {currentIndex + 1} of {filteredQuestions.length} :
              </Text>
            </View>

            <ScrollView style={{ paddingBottom: 40, height: 210 }}>
              <Text style={styles.questionText}>
                <MathText content={currentQ.pyq_content} />
              </Text>

              {(["a", "b", "c", "d"] as const).map((opt) => (
                <TouchableOpacity
                  style={styles.optionRow}
                  key={opt}
                  onPress={() => handleSelect(opt)}
                >
                  <View
                    style={[
                      styles.circle,
                      answers[currentQ.id] === opt && {
                        backgroundColor: "#1a4d80",
                      },
                    ]}
                  />
                  <Text style={styles.optionText}>
                    <MathText content={currentQ[opt]} />
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>

      {/* ✅ Bottom Panel */}
      <View style={styles.bottomBar2}>
        <TouchableOpacity
          style={[styles.bottomBtn, currentIndex === 0 && { opacity: 0.5 }]}
          onPress={goPrev}
          disabled={currentIndex === 0}
        >
          <Text style={styles.bottomBtnText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.bottomBtn,
            currentIndex === filteredQuestions.length - 1 && section === "maths" && { opacity: 0.5 },
          ]}
          onPress={goNext}
          disabled={currentIndex === filteredQuestions.length - 1 && section === "maths"}
        >
          <Text style={styles.bottomBtnText}>Next</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetBtn}
          onPress={() => setAnswers({ ...answers, [currentQ.id]: null })}
        >
          <Text style={styles.bottomBtnText}>Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bottomBtn, { backgroundColor: "green" }]}
          onPress={handleSubmit}
        >
          <Text style={styles.bottomBtnText}>Submit Test</Text>
        </TouchableOpacity>
      </View>

      {/* Confirmation Modal for Maths */}
      <Modal
        visible={showMathConfirm}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMathConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Start Mathematics Section?</Text>
            <Text style={styles.modalBody}>
              Once you start the Mathematics section, you will not be able to go back to Physics or Chemistry. Are you sure you want to proceed?
            </Text>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalCancelBtn]}
                onPress={() => setShowMathConfirm(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalConfirmBtn]}
                onPress={handleFinalMathEntry}
              >
                <Text style={styles.modalBtnText}>Proceed</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal for Submission */}
      <Modal
        visible={showSubmitConfirm}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSubmitConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Submit Test?</Text>
            <Text style={styles.modalBody}>
              Are you sure you want to submit the test? You will not be able to change your answers once submitted.
            </Text>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalCancelBtn]}
                onPress={() => setShowSubmitConfirm(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "green", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 4 }]}
                onPress={() => {
                  setShowSubmitConfirm(false);
                  submitTest();
                }}
              >
                <Text style={styles.modalBtnText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Exam;

/* ✅ Styles unchanged except dropdown */
const styles = StyleSheet.create({
  section2Container: { flex: 1, backgroundColor: "#ffffff" },

  section2Header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: "#999999",
  },

  headerTextWhite: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  section2Body: { flex: 1, flexDirection: "row" },

  paletteBox: {
    width: "22%",
    borderRightWidth: 1,
    borderColor: "#cfcfcf",
    backgroundColor: "#f7f7f7",
  },

  paletteTitle: {
    backgroundColor: "#08AEEC",
    color: "#02374a",
    paddingVertical: 6,
    textAlign: "center",
    fontSize: 12,
  },

  paletteGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 2,
    paddingVertical: 10,
  },

  questionArea: {
    flex: 1,
    margin: 8,
    borderWidth: 0.5,
    borderColor: "#525252ff",
  },

  subHeader: {
    borderBottomWidth: 1,
    borderColor: "#bfbfbf",
    paddingVertical: 6,
    paddingHorizontal: 6,
  },

  markReviewRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  markCheckbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderRadius: 3,
    marginRight: 6,
  },
  markText: { fontSize: 12, color: "#333" },

  dropdown: {
    height: 28,
    width: 130,
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },

  dropdownPlaceholder: {
    fontSize: 12,
    color: "#666",
  },

  dropdownSelectedText: {
    fontSize: 12,
    color: "#333",
    fontFamily: "SourceSans3Medium",
  },

  dropdownItemText: {
    fontSize: 12,
    color: "#333",
    fontFamily: "SourceSans3Regular",
  },

  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderRadius: 4,
    marginTop: 4,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  dropdownItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  qHeader: { marginBottom: 6 },
  qNumber: { fontWeight: "bold", fontSize: 14, color: "#000" },
  questionText: {
    fontSize: 13,
    color: "#000",
    marginBottom: 14,
    lineHeight: 18,
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: 10,
  },

  circle: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderRadius: 8,
    marginRight: 10,
  },

  optionText: { fontSize: 13, color: "#000" },

  bottomBar2: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#bfbfbf",
    backgroundColor: "#f8f8f8",
  },

  bottomBtn: {
    backgroundColor: "#1a4d80",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 3,
    marginLeft: 10,
  },

  resetBtn: {
    backgroundColor: "#ff0000",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 3,
    marginLeft: 10,
  },

  bottomBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
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
    width: "50%",
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
    backgroundColor: "#1a4d80",
  },
  modalBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
