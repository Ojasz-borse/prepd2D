import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
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

  if (loading)
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <View style={styles.listContainer}>
      {tests.map((test) => (
        <TouchableOpacity
          key={test.id}
          style={styles.card}
          onPress={() =>
            router.push({
              pathname: "/start-mock-test",
              params: { testid: test.id.toString() },
            })
          }
        >
          <Text style={styles.title}>{test.title}</Text>
          <Text style={styles.subtitle}>
            {test.shift_time} • {test.shift_date} {test.shift_year}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default MockTestList;

const styles = StyleSheet.create({
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
    fontSize: 14,
    color: "#666",
    marginTop: 2,
    fontFamily: "SourceSans3Medium",
  },
  errorText: {
    textAlign: "center",
    marginTop: 40,
    color: "red",
    fontFamily: "SourceSans3Medium",
  },
});
