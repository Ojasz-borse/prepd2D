import React from "react";
import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import MathJaxSvg from "react-native-mathjax-svg";

const { width: screenWidth } = Dimensions.get("window");

interface MathRendererProps {
  content: string;
}

interface TextSegment {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  isNewline?: boolean;
}

const MathRenderer: React.FC<MathRendererProps> = React.memo(({ content }) => {
  if (!content) return <View><Text /></View>;

  /**
   * 1. SPLIT LOGIC
   * This identifies Math and Images before any text cleaning happens.
   */
  const splitContent = (text: string) => {
    const parts: Array<{ type: "math" | "text" | "image"; content: string; isBlock?: boolean }> = [];
    let currentPos = 0;

    // Matches $$...$$, $...$, and <prep-img ... >
    const combinedRegex = /(\$\$[\s\S]+?\$\$|\$[^\$\n]+?\$|<prep-img[^>]+>)/g;
    let match;

    while ((match = combinedRegex.exec(text)) !== null) {
      // Push text found before the match
      if (match.index > currentPos) {
        parts.push({
          type: "text",
          content: text.substring(currentPos, match.index),
        });
      }

      const matchStr = match[0];

      if (matchStr.startsWith("<prep-img")) {
        // Extract the URL from the src attribute
        const srcMatch = matchStr.match(/src="([^"]+)"/);
        parts.push({
          type: "image",
          content: srcMatch ? srcMatch[1] : "",
        });
      } else {
        // Handle Math logic
        const isBlock = matchStr.startsWith("$$");
        parts.push({
          type: "math",
          content: matchStr.replace(/^\$\$?|\$\$?$/g, "").trim(),
          isBlock,
        });
      }
      currentPos = match.index + matchStr.length;
    }

    if (currentPos < text.length) {
      parts.push({ type: "text", content: text.substring(currentPos) });
    }
    return parts;
  };

  /**
   * 2. TEXT PARSING
   * This handles bold/italic/newlines and cleans remaining HTML.
   */
  const parseMarkdown = (text: string): TextSegment[] => {
    const segments: TextSegment[] = [];

    // Clean only formatting tags, leaving math symbols alone
    let cleaned = text
      .replace(/<\/prep-p>|<prep-br\s*\/?>/g, "\n")
      .replace(/<\/?prep-(?!img)[^>]+>/g, ""); // Remove all prep tags EXCEPT img (already handled)

    let i = 0;
    let currentText = "";
    let bold = false, italic = false, code = false;

    const flush = () => {
      if (currentText) {
        segments.push({ text: currentText, bold, italic, code });
        currentText = "";
      }
    };

    while (i < cleaned.length) {
      if (cleaned[i] === "\n") {
        flush();
        segments.push({ text: "\n", isNewline: true });
        i++; continue;
      }
      if (cleaned[i] === "`") {
        flush(); code = !code; i++; continue;
      }
      if (code) {
        currentText += cleaned[i]; i++; continue;
      }
      if (cleaned.substr(i, 3) === "***") {
        flush(); bold = !bold; italic = !italic; i += 3; continue;
      }
      if (cleaned.substr(i, 2) === "**" || cleaned.substr(i, 2) === "__") {
        flush(); bold = !bold; i += 2; continue;
      }
      if (cleaned[i] === "*" || cleaned[i] === "_") {
        flush(); italic = !italic; i++; continue;
      }
      currentText += cleaned[i];
      i++;
    }
    flush();
    return segments;
  };

  const parts = splitContent(content);

  return (
    <View style={styles.container}>
      {parts.map((part, idx) => {
        if (part.type === "math") {
          return (
            <View key={idx} style={part.isBlock ? styles.blockMath : styles.inlineMath}>
              <MathJaxSvg fontSize={16} color="#000">{part.content}</MathJaxSvg>
            </View>
          );
        }

        if (part.type === "image") {
          return (
            <View key={idx} style={styles.imageContainer}>
              <Image
                source={{ uri: part.content }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            </View>
          );
        }

        const segments = parseMarkdown(part.content);
        return (
          <React.Fragment key={idx}>
            {segments.map((seg, sIdx) => {
              if (seg.isNewline) return <View key={sIdx} style={styles.newline} />;
              if (!seg.text.trim() && seg.text !== "\n") return null;

              return (
                <Text key={sIdx} style={[
                  styles.text,
                  seg.bold && styles.bold,
                  seg.italic && styles.italic,
                  seg.code && styles.code
                ]}>
                  {seg.text}
                </Text>
              );
            })}
          </React.Fragment>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    fontFamily: "SourceSans3Medium",
  },
  bold: { fontFamily: "SourceSans3Bold" },
  italic: { fontFamily: "SourceSans3Italic" },
  code: { backgroundColor: "#eee", fontFamily: "monospace" },
  inlineMath: { marginHorizontal: 2 },
  blockMath: { width: "100%", marginVertical: 10 },
  newline: { width: "100%", height: 5 },
  imageContainer: {
    width: "100%",
    height: 250,
    marginVertical: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: screenWidth - 40,
    height: "100%",
  }
});

export default MathRenderer;