import React, { useState } from "react";
import {
  Linking,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BuildingIcon from "../assets/icons/BuildingIcon";
import { ShareIcon } from "../assets/icons/ShareIcon";

interface PostCardProps {
  news_heading: string;
  news_desc: string;
  news_url?: string;
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
      {/* Title with icon */}
      <View style={styles.titleRow}>
        <BuildingIcon size={22} />
        <Text style={styles.title}>{news_heading}</Text>
      </View>

      {/* Wrapped content with left border */}
      <View style={styles.contentWrapper}>
        {/* Post Text with inline View more / less */}
        <Text style={styles.text}>
          {displayText}
          {isLongText && (
            <Text
              style={styles.viewMore}
              onPress={() => setExpanded(!expanded)}
            >
              {expanded ? " View less" : " View more"}
            </Text>
          )}
        </Text>

        {/* Open URL Button */}
      </View>
      <View style={styles.endRow}>
        <TouchableOpacity
          onPress={handleShare}
          style={styles.shareIconWrapper}
          activeOpacity={0.7} // optional for better touch feedback
        >
          <ShareIcon size={28} focused={false} />
        </TouchableOpacity>
        {news_url && (
          <Text style={styles.linkText} onPress={handleOpenLink}>
            Open link
          </Text>
        )}
      </View>
      {/* Full-width gray line */}
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: "BreeSerif",
    color: "#000",
  },
  contentWrapper: {
    marginLeft: 30,
    paddingLeft: 30,
    paddingRight: 30,
    borderLeftWidth: 1,
    borderLeftColor: "#000000",
  },
  text: {
    fontSize: 16,
    fontFamily: "BreeSerif",
    color: "#666666",
    marginBottom: 8,
  },
  viewMore: {
    fontSize: 14,
    color: "#063866",
    fontFamily: "BreeSerif",
  },
  linkButton: {
    marginTop: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#063866",
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  linkButtonText: {
    color: "#fff",
    fontFamily: "BreeSerif",
    fontSize: 14,
  },
  shareIconWrapper: {
    marginLeft: -10,
  },

  endRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10, // optional spacing between items
    paddingHorizontal: 30, // match content padding
    marginBottom: 10,
    marginTop: 5,
  },

  shareButtonText: {
    color: "#fff",
    fontFamily: "BreeSerif",
    fontSize: 14,
  },

  linkText: {
    color: "#063866",
    fontFamily: "BreeSerif",
    fontSize: 14,
    textDecorationLine: "underline",
  },

  divider: {
    height: 1,
    backgroundColor: "#ccc",
    width: "100%",
    marginTop: 10,
  },
});
