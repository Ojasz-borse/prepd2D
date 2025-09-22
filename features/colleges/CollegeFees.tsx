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
    console.log("fees", fees);
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
            <Text style={styles.icon}>👇</Text>
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
      {activeFees && (
        <View style={styles.card}>
          <View style={styles.fees_row}>
            <View>
              <Text style={styles.fees_label}>Tuition fees</Text>
              <Text style={styles.fees_value}>
                ₹{formatINR(activeFees.tuition_fees)}
              </Text>
            </View>

            <Text style={styles.fees_plus}>+</Text>

            <View>
              <Text style={styles.fees_label}>Development fees</Text>
              <Text style={styles.fees_value}>
                ₹{formatINR(activeFees.development_fees)}
              </Text>
            </View>

            <Text style={styles.fees_plus}>+</Text>

            <View>
              <Text style={styles.fees_label}>Other fees</Text>
              <Text style={styles.fees_value}>
                ₹{formatINR(activeFees.other_fees)}
              </Text>
            </View>
          </View>

          <Text style={styles.fees_total}>₹{formatINR(activeFees.total)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownWrapper: {
    flexDirection: "row",
    marginBottom: 12,
    marginTop: -45,
  },
  rightGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
  },
  icon: {
    marginRight: 6,
    fontSize: 18,
  },
  dropdown: {
    width: 120,
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
    paddingVertical: 8,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#d9d9d9",
  },
  fees_row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fees_label: {
    fontSize: 14,
    color: "#787878ff",
    fontFamily: "SourceSans3Medium", // ✅ applied
  },

  fees_plus: {
    fontSize: 14,
    color: "#787878ff",
    fontFamily: "SourceSans3Medium", // ✅ applied
  },
  fees_value: {
    fontSize: 16,
    color: "#000",
    fontFamily: "SourceSans3Medium", // ✅ applied
  },
  fees_total: {
    fontSize: 16,
    color: "#063866",
    fontFamily: "SourceSans3Medium", // ✅ applied
    marginTop: 10,
  },
});
