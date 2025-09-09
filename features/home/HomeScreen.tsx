import PostCard from "@/components/PostCard";
import TopHeader from "@/components/TopHeader";
import { GET_NEWS } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, StyleSheet, Text } from "react-native";
import { colors } from "../../constants/theme";

export default function HomeScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { getToken } = useAuth();

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [60, 0],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  useEffect(() => {
    console.log(posts);
  }, [posts]);

  useEffect(() => {
    const fetchNews = async () => {
      console.log(GET_NEWS);
      try {
        const token = await getToken(); // fetch saved token
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
      <TopHeader title="Home" />

      <Animated.ScrollView
        style={styles.postsSection}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: 100 }}
          />
        ) : Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post, index) => <PostCard key={index} {...post} />)
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
        )}
      </Animated.ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  headerTitle: {
    fontSize: 18,
    color: colors.textDark,
    textAlign: "center",
    flex: 1,
    fontFamily: "BreeSerif",
  },
  postsSection: {
    flex: 1,
  },
});
