import PostCard from "@/components/PostCard";
import PostCardSkeleton from "@/components/PostCardSkeleton";
import TopHeader from "@/components/TopHeader";
import { useNews } from "@/hooks/useNews"; // ✅ new hook
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/theme";

export default function HomeScreen() {
  const { news, loading } = useNews();

  return (
    <>
      <TopHeader title="Home" showBackArrow={false} />

      <FlatList
        data={news}
        keyExtractor={(item) => item.created_at}
        renderItem={({ item, index }) => <PostCard key={index} {...item} />}
        ListEmptyComponent={
          loading ? (
            <View>
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
            </View>
          ) : (
            <Text
              style={{
                textAlign: "center",
                marginTop: 100,
                color: colors.textDark,
              }}
            >
              No news available
            </Text>
          )
        }
        showsVerticalScrollIndicator={false}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    fontFamily: "NotoSansKRMedium",
  },
  postsSection: {
    flex: 1,
  },
});
