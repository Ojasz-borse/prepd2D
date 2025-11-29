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
          onPress={() =>
            router.push({
              pathname: "/start-mock-test",
              params: { testid: item.id.toString() },
            })
          }
        >
          <Text style={styles.title}>{item.title}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 6,
            }}
          >
            <Text style={styles.subtitle}>
              <Text style={styles.subtitleText}>{item.shift_time}</Text>
            </Text>

            <Text style={styles.subtitle}>
              <Text style={styles.subtitleText}>
                {item.shift_date} {item.shift_year}
              </Text>
            </Text>
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
    borderColor: "#d9d9d9",
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    color: "#000",
    marginTop: 2,
    fontWeight: "600",
    fontFamily: "SourceSans3Medium",
  },

  subtitle: {
    backgroundColor: "#ebf0fa",
    padding: 2,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  subtitleText: {
    fontSize: 12,
    color: "#004aad",
    fontFamily: "SourceSans3Medium",
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
