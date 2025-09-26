import ExternalLinkIcon from "@/assets/icons/ExternalLinkIcon";
import ShareIcon from "@/assets/icons/ShareIcon";
import React, { useState } from "react";
import {
  Linking,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface PostCardProps {
  created_at: string;
  news_desc: string;
  news_heading: string;
  news_url: string;
}

export default function PostCard({
  news_heading,
  news_desc,
  news_url,
}: PostCardProps) {
  const [expanded, setExpanded] = useState(false);

  const maxChars = 200;
  const isLongText = news_desc.length > maxChars;
  const displayText =
    expanded || !isLongText
      ? news_desc
      : news_desc.substring(0, maxChars) + "... ";

  const handleShare = async () => {
    try {
      const message = `${news_heading}\n\n${news_desc}${
        news_url ? `\n\nRead more: ${news_url}` : ""
      }`;
      await Share.share({ message });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  const handleOpenLink = () => {
    if (news_url) {
      Linking.openURL(news_url).catch((err) =>
        console.error("Failed to open URL:", err)
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Row: Profile + Posted by + Time */}
      <View style={styles.headerRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Pa</Text>
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.postedBy}>PrepAcademy Admin</Text>
          <Text style={styles.postTime}>2 hours ago</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>{news_heading}</Text>

      {/* Post Text with view more/less */}
      <Text style={styles.text}>
        <Text>{displayText}</Text>
        {isLongText && (
          <Text style={styles.viewMore} onPress={() => setExpanded(!expanded)}>
            {expanded ? " View less" : " View more"}
          </Text>
        )}
      </Text>

      {/* Bottom row: Visit link (left) + Share icon (right) */}
      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.linkRow} onPress={handleOpenLink}>
          <Text style={styles.linkText}>visit </Text>
          <ExternalLinkIcon size={14} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareBadge} onPress={handleShare}>
          <ShareIcon size={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#d3d3d3",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  badge: {
    backgroundColor: "#f0f4fb",
    marginRight: 10,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: "#063866",
    fontSize: 18,
    fontFamily: "SourceSans3Medium",
  },
  headerTextContainer: {
    flexDirection: "column",
  },
  postedBy: {
    fontSize: 16,
    fontFamily: "SourceSans3SemiBold",
    color: "#000",
  },
  postTime: {
    fontSize: 12,
    fontFamily: "SourceSans3Medium",
    color: "#7e7e7e",
  },

  title: {
    fontSize: 16,
    fontFamily: "SourceSans3SemiBold",
    color: "#000",
    marginBottom: 6,
    marginTop: 6,
  },
  text: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    color: "#737373",
    marginBottom: 8,
  },
  viewMore: {
    fontSize: 14,
    color: "#063866",
    fontFamily: "SourceSans3Medium",
  },
  shareBadge: {
    backgroundColor: "#f0f4fb",
    paddingRight: 12,
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignSelf: "flex-start",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f4fb",
    paddingRight: 12,
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignSelf: "flex-start",
  },
  linkText: {
    color: "#063866",
    fontFamily: "SourceSans3Medium",
    fontSize: 14,
    lineHeight: 18,
    textDecorationLine: "underline",
    marginLeft: 4,
  },
});
