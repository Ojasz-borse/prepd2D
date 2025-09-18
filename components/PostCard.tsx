import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  Linking,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
      {/* Row: Profile + Posted by + Time */}
      <View style={styles.headerRow}>
        <Image
          source={require("./../assets/images/buildings.png")}
          style={styles.profileIcon}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.postedBy}>PrepAcademy Admin</Text>
          <Text style={styles.postTime}>2 hours ago</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>{news_heading}</Text>

      {/* Post Text with view more/less */}
      <Text style={styles.text}>
        {displayText}
        {isLongText && (
          <Text style={styles.viewMore} onPress={() => setExpanded(!expanded)}>
            {expanded ? " View less" : " View more"}
          </Text>
        )}
      </Text>

      {/* Bottom row: Visit link (left) + Share icon (right) */}
      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.linkRow} onPress={handleOpenLink}>
          <Text style={styles.linkText}>visit link</Text>
          <Ionicons name="open-outline" size={16} color="#063866" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleShare}>
          <Ionicons name="share-social-outline" size={20} color="#063866" />
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
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerTextContainer: {
    flexDirection: "column",
  },
  postedBy: {
    fontSize: 16,
    fontFamily: "WixMadeforTextBold",
    color: "#000",
  },
  postTime: {
    fontSize: 12,
    fontFamily: "WixMadeforTextMedium",
    color: "#7e7e7e",
  },

  title: {
    fontSize: 16,
    fontFamily: "WixMadeforTextBold",
    color: "#000",
    marginBottom: 6,
    marginTop: 6,
  },
  text: {
    fontSize: 16,
    fontFamily: "WixMadeforTextMedium",
    color: "#737373",
    marginBottom: 8,
  },
  viewMore: {
    fontSize: 14,
    color: "#063866",
    fontFamily: "WixMadeforTextMedium",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  linkText: {
    color: "#063866",
    fontFamily: "WixMadeforTextMedium",
    fontSize: 14,
    lineHeight: 18,
    textDecorationLine: "underline",
    marginLeft: 4,
  },
});
