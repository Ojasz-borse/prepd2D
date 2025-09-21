import PostCard from "@/components/PostCard";
import PostCardSkeleton from "@/components/PostCardSkeleton";
import TopHeader from "@/components/TopHeader";
import { GET_NEWS } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/theme";

interface News {
  created_at: string;
  news_desc: string;
  news_heading: string;
  news_url: string;
}
export default function HomeScreen() {
  const [posts, setPosts] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  const { getToken } = useAuth();

  useEffect(() => {
    const fetchNews = async () => {
      console.log(GET_NEWS);
      try {
        const token = await getToken();
        console.log(token);

        const res = await fetch(GET_NEWS, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const data = await res.json();

        if (data.success && Array.isArray(data.news)) {
          setPosts(data.news);
          console.log("news are", data.news);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <>
      <TopHeader title="Home" showBackArrow={false} />

      <FlatList
        data={posts}
        keyExtractor={(item) => item.created_at.toString()}
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
