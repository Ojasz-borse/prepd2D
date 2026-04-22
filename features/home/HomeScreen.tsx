import PostCard from "@/components/PostCard";
import PostCardSkeleton from "@/components/PostCardSkeleton";
import { useAuth } from "@/context/AuthContext";
import { useNews } from "@/hooks/useNews";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from "react-native";
import TopHeader from "@/components/TopHeader";
import { router, useRouter } from "expo-router";

const avatarColors = ["#F06292", "#64B5F6", "#81C784", "#FFD54F", "#BA68C8"];

const getAvatarColor = (name?: string) => {
  if (!name) return avatarColors[0];
  const index = name.toUpperCase().charCodeAt(0) % avatarColors.length;
  return avatarColors[index];
};

const dummyCollections = ["🎯 Easy Chapters", "🏆 Last 2 years"];

const collectionColors = [
  "#cce2ff", // light blue
  "#deccff", // light purple
  "#ffecd1", // light orange
  "#d1ffe4", // light green
];

const getDarkerColor = (hex: string, amount = 150) => {
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  r = Math.max(0, r - amount);
  g = Math.max(0, g - amount);
  b = Math.max(0, b - amount);

  return `rgb(${r}, ${g}, ${b})`;
};


const DreamCollegeSection = () => {
  const router = useRouter();

  return (
    <View style={styles.card1}>
      <Text style={styles.heading1}>Dream College</Text>

      <View style={styles.gridContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.gridItem}
          onPress={() => router.push("/dream-college")}
        >
          <View style={[
            styles.iconBox,
            { backgroundColor: "#ff7a2220" },
          ]}>
            <Ionicons name="heart-outline" size={24} color="#ff7a22" />
          </View>
          <Text style={styles.gridTitle}>Dream College</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const PopularSearches = () => {
  const router = useRouter();

  const items = [
    { title: "Percentile from Marks", icon: "stats-chart-outline", tab: "marks" as const },
    { title: "Rank from Percentile", icon: "trophy-outline", tab: "rank" as const },
  ];

  return (
    <View style={styles.card1}>
      <Text style={styles.heading1}>Estimators</Text>

      <View style={styles.gridContainer}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            style={styles.gridItem}
            onPress={() => router.push({ pathname: "/estimator", params: { tab: item.tab } })}
          >
            <View style={[
              styles.iconBox,
              {
                backgroundColor:
                  item.title === "Percentile from Marks" ? "#ff5e3220" :
                    item.title === "Rank from Percentile" ? "#004aad20" :
                      "#fff",
              },
            ]}>
              <Ionicons name={item.icon as any} size={24} color={
                item.title === "Percentile from Marks" ? "#ff5e32" :
                  item.title === "Rank from Percentile" ? "#004aad" :
                    "#b6cf4f"
              } />
            </View>
            <Text style={styles.gridTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};


export default function HomeScreen() {
  const { news, loading } = useNews();
  const { user } = useAuth();
  const initials = (user?.first_name?.[0] || "") + (user?.last_name?.[0] || "");
  const [newsExpanded, setNewsExpanded] = useState(false);

  // Show 1 initially, or show more (e.g., 4) when expanded
  const displayedNews = newsExpanded ? news.slice(0, 4) : news.slice(0, 1);
  const showToggleButton = !loading && news.length > 1;

  return (
    <LinearGradient
      colors={["#f8fafc", "#e6f1ff", "#e8dcff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >

      <TopHeader title="Home" />

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* WELCOME BANNER */}
        <View style={styles.bannerSection}>
          <LinearGradient
            colors={["#003580", "#004aad", "#0073e6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bannerCard}
          >
            {/* Subtle background decoration */}
            <View style={styles.bannerCircle1} />
            <View style={styles.bannerCircle2} />

            <View style={styles.bannerTop}>
              <View style={styles.bannerInfo}>
                <Text style={styles.bannerLabel}>Your Admission Journey</Text>
                <Text style={styles.bannerTitle}>
                  PrepCET
                </Text>
                <Text style={styles.bannerSubtitle}>
                  Search, Compare & Get Into the Right College After MHT CET
                </Text>
              </View>
              <View style={styles.bannerIconBox}>
                <Feather name="trending-up" size={48} color="#fff" />
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* NEWS SECTION */}
        <View style={styles.card}>
          <Text style={styles.heading}>News</Text>

          <View style={{ gap: 16 }}>
            {loading
              ? [1].map((_, index) => <PostCardSkeleton key={index} />)
              : displayedNews.map((item, index) => (
                <View key={index} style={{ width: "100%" }}>
                  <PostCard {...item} />
                </View>
              ))}
          </View>

          {/* Toggle Button */}
          {showToggleButton && (
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setNewsExpanded(!newsExpanded)}
            >
              <Feather
                name={newsExpanded ? "chevron-up" : "chevron-down"}
                size={24}
                color="#004aad"
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={{ marginHorizontal: 16 }}><DreamCollegeSection /></View>
        <View style={{ marginHorizontal: 16 }}><PopularSearches /></View>

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    margin: 20,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "SourceSans3SemiBold",
  },
  welcomeText: {
    fontSize: 18,
    color: "#333",
    fontFamily: "SourceSans3Medium",
  },
  sectionLabel: {
    paddingHorizontal: 18,
    borderRadius: 14,
    marginRight: 12,
  },
  sectionLabelText: {
    fontSize: 16,
    fontFamily: "SourceSans3SemiBold",
    color: "#444",
    marginBottom: 10,
  },

  popularWrapper: {
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 14,
  },

  collectionCard: {
    backgroundColor: "#deccff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 14,
    marginRight: 12,
    width: 180,
    marginBottom: 100
  },
  collectionTitle: {
    fontSize: 16,
    fontFamily: "SourceSans3SemiBold",
    color: "#262626",
    marginBottom: 6,
  },
  collectionText: {
    fontSize: 14,
    fontFamily: "SourceSans3Medium",
    color: "#26262680",
    marginBottom: 10,
  },
  collectionSolveButton: {
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignSelf: "flex-start",

  },
  collectionSolveButtonText: {
    color: "#cce2ff",
    fontFamily: "SourceSans3Medium",
    fontSize: 14,
  },

  // Daily Challenge
  dailyChallengeSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  dailyChallengeCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: "#004aad",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  challengeTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  challengeImage: {
    width: 150,
    height: 90,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: "SourceSans3Medium",

    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  challengeTitle: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "SourceSans3Medium",
    marginBottom: 6,
  },
  solveButton: {
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  solveButtonText: {
    color: "#004aad",
    fontFamily: "SourceSans3Medium",
    fontSize: 14,
  },

  // Streak
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  streakDaysRow: {
    flexDirection: "row",
    gap: 6,
    flex: 1,
  },
  streakDay: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  streakDayActive: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },
  streakDayText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    fontFamily: "SourceSans3Medium",
  },
  streakDayTextActive: {
    color: "#004aad",
  },
  streakInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginLeft: 12,
  },
  streakLabel: {
    fontSize: 18,
    fontFamily: "SourceSans3Medium",
  },
  streakCount: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "SourceSans3Medium",
  },
  // Welcome Banner
  bannerSection: {
    marginHorizontal: 16,
    paddingTop: 16,
  },
  bannerCard: {
    borderRadius: 24,
    padding: 24,
    overflow: "hidden",
    shadowColor: "#004aad",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    position: "relative",
  },
  bannerCircle1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    top: -100,
    right: -50,
  },
  bannerCircle2: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    bottom: -40,
    left: -20,
  },
  bannerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bannerInfo: {
    flex: 1,
    paddingRight: 10,
  },
  bannerLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: "SourceSans3Medium",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  bannerTitle: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "SourceSans3Bold",
    marginBottom: 8,
    lineHeight: 32,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: "#e0f2fe",
    fontFamily: "SourceSans3Medium",
    lineHeight: 20,
  },
  bannerIconBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 0,
    marginTop: 16,
  },
  heading: {
    fontSize: 18,
    fontFamily: "SourceSans3SemiBold",
    color: "#004aad",
    marginBottom: 16,
  },
  toggleButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 12,
    marginTop: 4,
  },





  card1: {
    backgroundColor: "#fff",
    width: "100%",
    alignSelf: "center",
    borderRadius: 18,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,

  },
  heading1: {
    fontSize: 18,
    fontFamily: "SourceSans3SemiBold",
    color: "#004aad",
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: "column",
    flexWrap: "wrap",
    gap: 12,
  },
  gridItem: {
    width: "100%", // 2 in a row
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  iconBox: {
    padding: 12,
    borderRadius: 12,
  },
  gridTitle: {
    fontSize: 16,
    fontFamily: "SourceSans3SemiBold",
    color: "#2E2E32",
  },
});
