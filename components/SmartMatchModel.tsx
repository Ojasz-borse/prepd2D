import FloatingLabelInput from "@/components/FloatingLabelInput";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SmartMatchModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  setSmartMatchEnabled: (value: boolean) => void;
  percentile: string;
  setPercentile: (val: string) => void;
  rank: string;
  setRank: (val: string) => void;
  category: string | null;
  setCategory: React.Dispatch<
    React.SetStateAction<"Open" | "OBC" | "TFWS" | "SC_ST" | "VJ_NT" | null>
  >;
}

export default function SmartMatchModal({
  modalVisible,
  setModalVisible,
  setSmartMatchEnabled,
  percentile,
  setPercentile,
  rank,
  setRank,
  category,
  setCategory,
}: SmartMatchModalProps) {
  const [error, setError] = useState("");

  const handleEnable = () => {
    if (!percentile.trim()) {
      setError("Please enter Percentile.");
      return;
    }
    if (!rank.trim()) {
      setError("Please enter Rank.");
      return;
    }
    if (!category) {
      setError("Please select a Category.");
      return;
    }

    // ✅ All validations passed
    setError("");
    setModalVisible(false);
    setSmartMatchEnabled(true);
  };

  const handlePercentileInput = (text: string) => {
    if (!/^\d*\.?\d*$/.test(text)) return;
    const parts = text.split(".");
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 7) return;

    const num = Number(text);
    if (!isNaN(num) && num > 100) {
      setPercentile("100");
    } else {
      setPercentile(text);
    }
  };

  const handleRankInput = (text: string) => {
    setRank(text.replace(/[^0-9]/g, ""));
  };

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            To enable Smart Match mode, please enter your Percentile & Rank
          </Text>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ width: "48%" }}>
              <FloatingLabelInput
                label="Percentile"
                value={percentile}
                keyboardType="number-pad"
                onChangeText={handlePercentileInput}
                maxLength={
                  percentile.includes(".") ? percentile.indexOf(".") + 8 : 4
                }
              />
            </View>
            <View style={{ width: "48%" }}>
              <FloatingLabelInput
                label="Rank"
                value={rank}
                keyboardType="number-pad"
                onChangeText={handleRankInput}
              />
            </View>
          </View>

          <Text
            style={{
              marginTop: -14,
              marginBottom: 10,
              fontSize: 15,
              fontFamily: "SourceSans3Medium",
              color: "#004aad",
            }}
          >
            Select category
          </Text>

          <View style={styles.groupWrapper}>
            {["Open", "OBC", "TFWS", "SC_ST", "VJ_NT"].map((cat: any) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.groupOption,
                  category === cat && styles.groupOptionSelected,
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.groupOptionText,
                    category === cat && styles.groupOptionTextSelected,
                  ]}
                >
                  {cat === "SC_ST" ? "SC/ST" : cat === "VJ_NT" ? "VJNT" : cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalButtonCancel}
              onPress={() => {
                setModalVisible(false);
                setSmartMatchEnabled(false);
                setError("");
              }}
            >
              <Text style={styles.modalButtonTextCancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButtonSubmit}
              onPress={handleEnable}
            >
              <Text style={styles.modalButtonTextSubmit}>Enable</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 30,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    marginBottom: 16,
    color: "#004aad",
    textAlign: "center",
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButtonCancel: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 14,
  },
  modalButtonSubmit: {
    backgroundColor: "#004aad",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 99,
  },
  modalButtonTextCancel: {
    fontSize: 15,
    color: "#999",
    fontFamily: "SourceSans3Medium",
  },
  modalButtonTextSubmit: {
    fontSize: 15,
    color: "#fff",
    fontFamily: "SourceSans3Medium",
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flexInput: {
    flex: 1,
  },

  groupWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 8,
  },
  groupOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  groupOptionSelected: {
    borderColor: "#004aad",
    borderWidth: 2,
    backgroundColor: "#004aad10",
  },
  groupOptionText: {
    fontSize: 12,
    color: "#777",
    fontFamily: "SourceSans3Medium",
  },
  groupOptionTextSelected: { color: "#004aad", fontWeight: "600" },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
    fontFamily: "SourceSans3Medium",
    marginBottom: 10,
  },
});
