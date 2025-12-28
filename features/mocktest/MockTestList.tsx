import MockTestCardSkeleton from "@/components/MockTestCardSkeleton";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MockTestListProps {
  tests: any[];
  loading: boolean;
  error: string | null;
}

const MockTestList: React.FC<MockTestListProps> = ({
  tests,
  loading,
  error,
}) => {
  const router = useRouter();

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={tests}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 4, paddingTop: 10, paddingBottom: 20 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          // onPress={() =>
          //   router.push({
          //     pathname: "/start-mock-test",
          //     params: { testid: item.id.toString() },
          //   })
          // }
          activeOpacity={0.7}
        >
          <View style={styles.subRow}>
            <View style={styles.subjectTag}>
              <Text style={styles.subText}>{item.shift_time}</Text>
            </View>

            <View style={styles.subjectTag}>
              <Text style={styles.subText}>
                {item.shift_date} {item.shift_year}
              </Text>
            </View>
          </View>

          <View style={styles.titleRow}>
            <Text style={styles.title}>{item.title}</Text>
            <View>
              <TouchableOpacity
                style={styles.solveButton}
              // onPress={() =>
              //   router.push({
              //     pathname: "/start-mock-test",
              //     params: { testid: item.id.toString() },
              //   })
              // }
              >
                <Text style={styles.solveButtonText}>Solve</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        loading ? (
          <>
            <MockTestCardSkeleton />
            <MockTestCardSkeleton />
            <MockTestCardSkeleton />
            <MockTestCardSkeleton />
            <MockTestCardSkeleton />
            <MockTestCardSkeleton />
          </>
        ) : (
          <Text style={styles.noResult}>No tests available</Text>
        )
      }
    />
  );
};

export default MockTestList;

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  listContainer: {
    flex: 1,
  },
  card: {
    width: "100%",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  subRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  subjectTag: {
    backgroundColor: "#f0f7d4",
    borderWidth: 1,
    borderColor: "#b6cf4f",
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  subText: {
    fontSize: 12,
    color: "#8b9e3dff",
    fontFamily: "SourceSans3Medium",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 17,
    color: "#000",
    fontFamily: "SourceSans3SemiBold",
    marginRight: 8,
  },
  solveButton: {
    backgroundColor: "#ff5e32",
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 999,
  },
  solveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "SourceSans3SemiBold",
  },
  noResult: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#777",
    fontFamily: "SourceSans3Medium",
  },
  errorText: {
    textAlign: "center",
    marginTop: 40,
    color: "red",
    fontFamily: "SourceSans3Medium",
  },
});
