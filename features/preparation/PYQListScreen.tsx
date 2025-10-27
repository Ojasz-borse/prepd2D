import MathText from "@/components/MathText";
import NormalFindCollegeCardSkeleton from "@/components/NormalFindCollegeCardSkeleton";
import TopHeader from "@/components/TopHeader";
import { GET_PYQS } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

export default function PYQListScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<PYQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchPYQs = async () => {
      const token = await getToken();
      try {
        const response = await fetch(GET_PYQS, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ chapter_id: id }),
        });

        const json = await response.json();
        if (json.success) setData(json.pyqs);
      } catch (err) {
        console.error("Error fetching PYQs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPYQs();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#004aad" />
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.noData}>No questions found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopHeader title={id || "PYQs"} showBackArrow={true} />
      <View style={styles.container}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            loading ? (
              <>
                <NormalFindCollegeCardSkeleton />
                <NormalFindCollegeCardSkeleton />
                <NormalFindCollegeCardSkeleton />
                <NormalFindCollegeCardSkeleton />
              </>
            ) : (
              <Text style={styles.noResult}>No PYQs found</Text>
            )
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/pyq-detail",
                  params: {
                    data: JSON.stringify(data),
                    currentIndex: index.toString(),
                  },
                })
              }
            >
              <MathText content={item.pyq_content} />
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    backgroundColor: "#ffffff",
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  noData: { fontSize: 16, color: "#777" },
  noResult: {
    fontSize: 16,
    color: "#777",
    fontFamily: "SourceSans3Medium",
    textAlign: "center",
    marginTop: 20,
  },
});
