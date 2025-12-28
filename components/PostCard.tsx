import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Linking,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface PostCardProps {
  created_at: string;
  news_desc: string;
  news_heading: string;
  news_url: string;
}

// Reusable gradient wrapper
const GradientBox = ({ children, style }: any) => (
  <LinearGradient
    colors={["#f8fafc90", "#e6f1ff90", "#e8dcff90"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.gradientContent, style]}
  >
    {children}
  </LinearGradient>
);

export default function PostCard({
  created_at,
  news_heading,
  news_desc,
  news_url,
}: PostCardProps) {
  const [expanded, setExpanded] = useState(false);

  const maxChars = 120;
  const isLongText = news_desc.length > maxChars;
  const displayText =
    expanded || !isLongText
      ? news_desc
      : news_desc.substring(0, maxChars) + "... ";

  const handleShare = async () => {
    try {
      const message = `${news_heading}\n\n${news_desc}${news_url ? `\n\nRead more: ${news_url}` : ""
        }`;
      await Share.share({ message });
    } catch (error) {
      // console.log("Error sharing:", error);
    }
  };

  const handleOpenLink = () => {
    if (news_url) {
      Linking.openURL(news_url).catch((err) =>
        console.error("Failed to open URL:", err)
      );
    }
  };

  function timeAgo(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);
    const diff = (now.getTime() - date.getTime()) / 1000;

    if (diff < 60) return "just now";
    if (diff < 3600) {
      const mins = Math.floor(diff / 60);
      return `${mins} min${mins > 1 ? "s" : ""} ago`;
    }
    if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }
    if (diff < 604800) {
      const days = Math.floor(diff / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
    const weeks = Math.floor(diff / 604800);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }

  return (
    <View style={styles.shadowWrapper}>
      <View style={styles.container}>

        {/* Header Row */}
        {/*  <View style={styles.headerRow}>
         
          <GradientBox style={styles.badge}>
            <Text style={styles.badgeText}>PC</Text>
          </GradientBox>

          <View style={styles.headerTextContainer}>
            <Text style={styles.postedBy}>PrepCET Admin</Text>
            <Text style={styles.postTime}>{timeAgo(created_at)}</Text>
          </View>
        </View>
*/}
        {/* Title */}
        <Text style={styles.title}>{news_heading}</Text>

        {/* News text */}
        <Text style={styles.text}>
          <Text>{displayText}</Text>
          {isLongText && (
            <Text style={styles.viewMore} onPress={() => setExpanded(!expanded)}>
              {expanded ? " View less" : " View more"}
            </Text>
          )}
        </Text>

        {/* Bottom Row */}
        <View style={styles.bottomRow}>
          <View style={{ flexDirection: "row", gap: 16 }}>

            {/* Visit button */}
            <TouchableOpacity onPress={handleOpenLink}>
              <Feather name="external-link" size={18} color="#141414" />
            </TouchableOpacity>

            {/* Share button */}
            <TouchableOpacity onPress={handleShare}>
              <Feather name="share-2" size={18} color="#141414" />
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  container: {

  },

  gradientContent: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  badge: {
    marginRight: 10,
  },

  badgeText: {
    color: "#004aad",
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
  },

  headerTextContainer: {
    flexDirection: "column",
  },
  postedBy: {
    fontSize: 14,
    fontFamily: "SourceSans3SemiBold",
    color: "#000",
  },
  postTime: {
    fontSize: 10,
    fontFamily: "SourceSans3Medium",
    color: "#7e7e7e",
  },

  title: {
    fontSize: 16,
    fontFamily: "SourceSans3SemiBold",
    color: "#004aad",
    marginBottom: 8,
  },

  text: {
    fontSize: 14,
    fontFamily: "SourceSans3Medium",
    color: "#737373",
    marginBottom: 8,
  },

  viewMore: {
    fontSize: 14,
    color: "#004aad",
    fontFamily: "SourceSans3Medium",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 12,
  },

  linkRow: {
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});
