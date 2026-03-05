import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

// map backend keys → readable labels
const categoryMap: Record<string, string> = {
  jk_pmsss: "JK",
  open: "Open",
  obc_ews: "OBC/EWS",
  sc_st: "SC/ST",
  vjnt_sbc_tfws: "VJNT/TFWS",
};

interface FeeCategory {
  development_fees: number;
  other_fees: number;
  total: number;
  tuition_fees: number;
}

interface Props {
  fees: Record<string, FeeCategory> | null;
}

// helper to format currency in Indian style
const formatINR = (value: number) => {
  return value.toLocaleString("en-IN");
};

export default function CollegeFees({ fees }: Props) {
  useEffect(() => {
    // console.log("fees", fees);
  }, [fees]);

  // pick the first available key as default
  const firstKey = fees ? Object.keys(fees)[0] : null;
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    if (fees) {
      const firstKey = Object.keys(fees)[0];
      setActiveKey(firstKey); // always show first key when fees updates
    }
  }, [fees]);

  // build dropdown options dynamically from available keys
  const categories = fees
    ? Object.keys(fees).map((key) => ({
      label: categoryMap[key] || key, // fallback to key if not mapped
      value: key,
    }))
    : [];

  const activeFees = activeKey && fees ? fees[activeKey] : null;

  return (
    <View>
      {categories.length > 0 && (
        <View style={styles.dropdownWrapper}>
          <View style={styles.rightGroup}>

            <Dropdown
              style={styles.dropdown}
              data={categories}
              labelField="label"
              valueField="value"
              value={activeKey}
              onChange={(item) => setActiveKey(item.value)}
              placeholder="Select Category"
              placeholderStyle={styles.dropdownText}
              selectedTextStyle={styles.dropdownText}
              itemTextStyle={styles.dropdownText}
            />

          </View>
        </View>
      )}

      {/* Fees Card */}
      {activeFees ? (
        <View style={styles.card}>
          <View style={styles.feesWrapper}>
            <View style={styles.feeBox}>
              <Text style={styles.feeCategory}>Tution</Text>
              <Text style={styles.feeValue}>
                ₹{formatINR(activeFees.tuition_fees)}
              </Text>
            </View>
            <View style={styles.feeBox}>
              <Text style={styles.feeCategory}>Development</Text>
              <Text style={styles.feeValue}>
                ₹{formatINR(activeFees.development_fees)}
              </Text>
            </View>
            <View style={styles.feeBox}>
              <Text style={styles.feeCategory}>Other</Text>
              <Text style={styles.feeValue}>
                ₹{formatINR(activeFees.other_fees)}
              </Text>
            </View>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Fees</Text>
            <Text style={styles.fees_total}>₹{formatINR(activeFees.total)}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.notAVailable}>No Fees Data available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownWrapper: {
    flexDirection: "row",
    marginBottom: 10,
    marginTop: -45,
  },
  rightGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",

  },

  dropdown: {
    width: 100,
    height: 40,
    borderRadius: 20,
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium", // ✅ applied
    color: "#333",
    textTransform: "capitalize",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  feesWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  feeBox: {
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 2,
    alignItems: "center",
    flex: 1,

  },
  feeCategory: {
    fontSize: 12,
    color: "#0A5BD3",
    fontFamily: "SourceSans3SemiBold",
  },
  feeValue: {
    fontSize: 14,
    color: "#141a2aff",
    fontFamily: "SourceSans3SemiBold",
    marginTop: 2,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  totalLabel: {
    fontSize: 14,
    color: "#141a2aff",
    fontFamily: "SourceSans3SemiBold",
  },
  fees_total: {
    fontSize: 16,
    color: "#004aad",
    fontFamily: "SourceSans3SemiBold",
    backgroundColor: "rgba(0, 74, 173, 0.1)",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  notAVailable: {
    fontSize: 14,
    color: "#787878ff",
    fontFamily: "SourceSans3Medium",
  },
});
