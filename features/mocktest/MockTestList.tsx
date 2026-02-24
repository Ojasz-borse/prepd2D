import MockTestCardSkeleton from "@/components/MockTestCardSkeleton";
import { useSubscriptionLock } from "@/hooks/useSubcribtion";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import SubscriptionLockSheet from "@/components/ShowLockScreen";
import { useState } from "react";

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
  const [showLock, setShowLock] = useState(false);

  const { isAllowed } = useSubscriptionLock({
    gate: "before",
  });

  const handlerRoute = (id: number, index: number) => {
    if (index > 0 && !isAllowed) {
      setShowLock(true);
      return;
    }
    router.push({
      pathname: "/start-mock-test",
      params: { testid: id.toString() },
    });
  };
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderHeader = () => (
    <View style={styles.resultCountContainer}>
      <Text style={styles.resultCount}>
        Total Tests: {tests.length}
      </Text>
    </View>
  );

  return (
    <>


      <FlatList
        data={tests}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={renderHeader}
        renderItem={({ item, index }) => (
          <View style={styles.cardWrapper}>
            <TouchableOpacity style={styles.card} activeOpacity={0.7}>
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
                    onPress={() => handlerRoute(item.id, index)}
                  >
                    <Text style={styles.solveButtonText}>Solve</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          loading ? (
            <View style={styles.skeletonContainer}>
              <MockTestCardSkeleton />
              <MockTestCardSkeleton />
              <MockTestCardSkeleton />
              <MockTestCardSkeleton />
              <MockTestCardSkeleton />
              <MockTestCardSkeleton />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.noResult}>No tests available</Text>
            </View>
          )
        }
        ListFooterComponent={<View style={styles.listFooter} />}
      />

      {showLock && (
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
          <SubscriptionLockSheet
            visible={showLock}
            planType="before"
            onClose={() => setShowLock(false)}
          />
        </View>
      )}
    </>
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
    paddingTop: 10,
    paddingBottom: 20,
  },
  resultCountContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "#fff",
  },
  resultCount: {
    fontSize: 16,
    fontFamily: "SourceSans3SemiBold",
    color: "#004aad",
  },
  listFooter: {
    height: 20,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#fff",
  },
  cardWrapper: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    borderColor: "#fff",
    borderLeftWidth: 1,
    borderRightWidth: 1,
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
  skeletonContainer: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 16,
  },
  emptyContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
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
