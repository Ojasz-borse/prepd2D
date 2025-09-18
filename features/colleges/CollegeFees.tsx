import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const categories = ["Open", "OBC", "SC/ST", "VJNT", "TFWS", "EWS"];

export default function CollegeDetails({ fees }: any) {
  const [active, setActive] = useState("Open");

  return (
    <View>
      <View style={styles.dropdownWrapper}>
        <View style={styles.rightGroup}>
          <Text style={styles.icon}>👇</Text>
          <Dropdown
            style={styles.dropdown}
            data={categories.map((c) => ({ label: c, value: c }))}
            labelField="label"
            valueField="value"
            value={active}
            onChange={(item) => setActive(item.value)}
            placeholder="Select Category"
            placeholderStyle={styles.dropdownText}
            selectedTextStyle={styles.dropdownText}
            itemTextStyle={styles.dropdownText}
          />
        </View>
      </View>

      {/* Fees Card */}
      <View style={styles.card}>
        {active === "Open" && (
          <View>
            <View style={styles.fees_row}>
              <View>
                <Text style={styles.fees_label}>Tuition fees</Text>
                <Text style={styles.fees_value}>₹{fees.open.tution_fees}</Text>
              </View>

              <Text style={styles.fees_plus}>+</Text>

              <View>
                <Text style={styles.fees_label}>Development fees</Text>
                <Text style={styles.fees_value}>
                  ₹{fees.open.development_fees}
                </Text>
              </View>

              <Text style={styles.fees_plus}>+</Text>

              <View>
                <Text style={styles.fees_label}>Other fees</Text>
                <Text style={styles.fees_value}>₹{fees.open.other_fees}</Text>
              </View>
            </View>

            <Text style={styles.fees_total}>₹{fees.open.total}</Text>
          </View>
        )}

        {active === "OBC" && (
          <View>
            <View style={styles.fees_row}>
              <View>
                <Text style={styles.fees_label}>Tuition fees</Text>
                <Text style={styles.fees_value}>₹{fees.obc.tution_fees}</Text>
              </View>

              <Text style={styles.fees_plus}>+</Text>

              <View>
                <Text style={styles.fees_label}>Development fees</Text>
                <Text style={styles.fees_value}>
                  ₹{fees.obc.development_fees}
                </Text>
              </View>

              <Text style={styles.fees_plus}>+</Text>

              <View>
                <Text style={styles.fees_label}>Other fees</Text>
                <Text style={styles.fees_value}>₹{fees.obc.other_fees}</Text>
              </View>
            </View>

            <Text style={styles.fees_total}>₹{fees.obc.total}</Text>
          </View>
        )}

        {/* Repeat SC/ST, VJNT, TFWS, EWS blocks same way */}
      </View>
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
    marginLeft: "auto", // push whole group to right
  },

  icon: {
    marginRight: 6, // little gap before dropdown
    fontSize: 18,
  },

  dropdown: {
    width: 80,
    height: 40,
    borderRadius: 20,
  },

  dropdownText: {
    fontSize: 16,
    fontFamily: "BreeSerif",
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
    fontFamily: "BreeSerif",
  },
  fees_value: {
    fontSize: 16,
    color: "#000",
    fontFamily: "BreeSerif",
  },
  fees_plus: {
    fontSize: 14,
    color: "#787878ff",
    fontFamily: "BreeSerif",
  },
  fees_total: {
    fontSize: 18,
    color: "#063866",
    fontFamily: "BreeSerif",
    marginTop: 10,
  },
});
