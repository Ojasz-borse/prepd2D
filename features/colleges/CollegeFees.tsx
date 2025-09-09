import React, { useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const categories = ["Open", "OBC", "SC/ST", "VJNT", "TFWS", "EWS"];

export default function CollegeDetails({ fees }: any) {
  const [active, setActive] = useState("Open");
  const scrollRef = useRef<ScrollView>(null);

  const handlePress = (item: string, index: number) => {
    setActive(item);

    scrollRef.current?.scrollTo({
      x: index * 70,
      animated: true,
    });
  };

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {categories.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, active === item && styles.activeTab]}
            onPress={() => handlePress(item, index)}
          >
            <View style={styles.tabInner}>
              <Text
                style={[styles.tabText, active === item && styles.activeText]}
              >
                {item}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View
        style={{
          paddingVertical: 8,
          borderRadius: 16,
          padding: 12,
          marginBottom: 12,
          marginTop: 12,
          borderWidth: 1,
          borderColor: "#e6e6e6",
        }}
      >
        {active == "Open" && (
          <View>
            <View style={styles.fees_row}>
              {/* Tuition Fees */}
              <View>
                <Text style={styles.fees_label}>Tution fees</Text>
                <Text style={styles.fees_value}>₹{fees.open.tution_fees}</Text>
              </View>

              <Text style={styles.fees_plus}>+</Text>

              {/* Development Fees */}
              <View>
                <Text style={styles.fees_label}>Development fees</Text>
                <Text style={styles.fees_value}>
                  ₹{fees.open.development_fees}
                </Text>
              </View>

              <Text style={styles.fees_plus}>+</Text>

              {/* Other Fees */}
              <View>
                <Text style={styles.fees_label}>Other fees</Text>
                <Text style={styles.fees_value}>₹{fees.open.other_fees}</Text>
              </View>
            </View>

            <Text style={styles.fees_total}>₹{fees.open.total}</Text>
          </View>
        )}

        {active == "OBC" && (
          <View>
            <View style={styles.fees_row}>
              {/* Tuition Fees */}
              <View>
                <Text style={styles.fees_label}>Tution fees</Text>
                <Text style={styles.fees_value}>₹{fees.open.tution_fees}</Text>
              </View>

              <Text style={styles.fees_plus}>+</Text>

              {/* Development Fees */}
              <View>
                <Text style={styles.fees_label}>Development fees</Text>
                <Text style={styles.fees_value}>
                  ₹{fees.open.development_fees}
                </Text>
              </View>

              <Text style={styles.fees_plus}>+</Text>

              {/* Other Fees */}
              <View>
                <Text style={styles.fees_label}>Other fees</Text>
                <Text style={styles.fees_value}>₹{fees.open.other_fees}</Text>
              </View>
            </View>

            <Text style={styles.fees_total}>₹{fees.open.total}</Text>
          </View>
        )}

        {active == "SC/ST" && (
          <View>
            <View style={styles.fees_row}>
              {/* Tuition Fees */}
              <View>
                <Text style={styles.fees_label}>Tution fees</Text>
                <Text style={styles.fees_value}>₹{fees.open.tution_fees}</Text>
              </View>

              <Text style={styles.fees_plus}>+</Text>

              {/* Development Fees */}
              <View>
                <Text style={styles.fees_label}>Development fees</Text>
                <Text style={styles.fees_value}>
                  ₹{fees.open.development_fees}
                </Text>
              </View>

              <Text style={styles.fees_plus}>+</Text>

              {/* Other Fees */}
              <View>
                <Text style={styles.fees_label}>Other fees</Text>
                <Text style={styles.fees_value}>₹{fees.open.other_fees}</Text>
              </View>
            </View>

            <Text style={styles.fees_total}>₹{fees.open.total}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tab: {
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#f0f0f0",
    overflow: "hidden", // keeps inner bar clipped
  },
  activeTab: {
    backgroundColor: "#063866",
  },
  tabInner: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  tabText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "BreeSerif",
  },
  activeText: {
    color: "#fff",
    fontWeight: "600",
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
