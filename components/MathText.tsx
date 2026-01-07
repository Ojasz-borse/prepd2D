import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import MathJaxSvg from "react-native-mathjax-svg";

interface MathRendererProps {
  content: string;
  textStyle?: any;
}

interface TextSegment {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  isNewline?: boolean;
}

const MathRenderer: React.FC<MathRendererProps> = ({ content, textStyle }) => {
  if (!content) {
    return (
      <View>
        <Text></Text>
      </View>
    );
  }

  // Split by math and images (preserve them)
  const splitContent = (text: string): Array<{ type: "math" | "text" | "image"; content: string; isBlock?: boolean; alt?: string }> => {
    const parts: Array<{ type: "math" | "text" | "image"; content: string; isBlock?: boolean; alt?: string }> = [];
    let currentPos = 0;

    // Match $$ ... $$ (block math), $ ... $ (inline math), and ![alt](url) (images)
    const combinedRegex = /(\$\$[\s\S]+?\$\$|\$[^\$\n]+?\$|!\[.*?\]\(.*?\))/g;
    let match;

    while ((match = combinedRegex.exec(text)) !== null) {
      if (match.index > currentPos) {
        parts.push({
          type: "text",
          content: text.substring(currentPos, match.index),
        });
      }

      const found = match[0];
      if (found.startsWith("![")) {
        // Handle Image
        const imgMatch = found.match(/!\[(.*?)\]\((.*?)\)/);
        if (imgMatch) {
          parts.push({
            type: "image",
            alt: imgMatch[1],
            content: imgMatch[2],
          });
        }
      } else {
        // Handle Math
        const isBlock = found.startsWith("$$");
        parts.push({
          type: "math",
          content: found.replace(/^\$\$?|\$\$?$/g, "").trim(),
          isBlock,
        });
      }

      currentPos = match.index + found.length;
    }

    if (currentPos < text.length) {
      parts.push({
        type: "text",
        content: text.substring(currentPos),
      });
    }

    return parts.length > 0 ? parts : [{ type: "text", content: text }];
  };

  // Parse markdown in text (non-math) segments
  const parseMarkdown = (text: string): TextSegment[] => {
    const segments: TextSegment[] = [];

    // Remove HTML tags
    text = text.replace(/<\/?[^>]+(>|$)/g, "");

    let i = 0;
    let currentText = "";
    let bold = false;
    let italic = false;
    let code = false;

    const flushCurrent = () => {
      if (currentText) {
        segments.push({
          text: currentText,
          bold,
          italic,
          code,
        });
        currentText = "";
      }
    };

    while (i < text.length) {
      // Check for newlines
      if (text[i] === "\n") {
        flushCurrent();
        segments.push({
          text: "\n",
          isNewline: true,
        });
        i++;
        continue;
      }

      // Check for code first (highest priority)
      if (text[i] === "`" && !code) {
        flushCurrent();
        code = true;
        i++;
        continue;
      } else if (text[i] === "`" && code) {
        flushCurrent();
        code = false;
        i++;
        continue;
      }

      // Don't process markdown inside code blocks
      if (code) {
        currentText += text[i];
        i++;
        continue;
      }

      // Check for bold+italic ***
      if (text.substr(i, 3) === "***") {
        flushCurrent();
        bold = !bold;
        italic = !italic;
        i += 3;
        continue;
      }

      // Check for bold ** or __
      if (text.substr(i, 2) === "**" || text.substr(i, 2) === "__") {
        flushCurrent();
        bold = !bold;
        i += 2;
        continue;
      }

      // Check for italic * or _
      if ((text[i] === "*" || text[i] === "_") && text.substr(i, 2) !== "**" && text.substr(i, 2) !== "__") {
        flushCurrent();
        italic = !italic;
        i++;
        continue;
      }

      // Regular character
      currentText += text[i];
      i++;
    }

    flushCurrent();
    return segments;
  };

  const parts = splitContent(content);

  return (
    <View style={styles.container}>
      {parts.map((part, idx) => {
        if (part.type === "math") {
          return (
            <View
              key={idx}
              style={
                part.isBlock
                  ? styles.blockMathContainer
                  : styles.inlineMathContainer
              }
            >
              <MathJaxSvg fontSize={15} color="#000">
                {part.content}
              </MathJaxSvg>
            </View>
          );
        } else if (part.type === "image") {
          return (
            <View key={idx} style={styles.imageContainer}>
              <Image
                source={{ uri: part.content }}
                style={styles.image}
                resizeMode="contain"
              />
              {part.alt ? <Text style={styles.altText}>{part.alt}</Text> : null}
            </View>
          );
        } else {
          const segments = parseMarkdown(part.content);
          return (
            <React.Fragment key={idx}>
              {segments.map((segment, segIdx) => {
                // Handle newlines specially
                if (segment.isNewline) {
                  return (
                    <View key={`${idx}-${segIdx}`} style={styles.newline} />
                  );
                }

                if (!segment.text.trim()) return null;

                const combinedTextStyles = [styles.questionText, textStyle];

                if (segment.code) {
                  combinedTextStyles.push(styles.code);
                } else {
                  if (segment.bold) combinedTextStyles.push(styles.bold);
                  if (segment.italic) combinedTextStyles.push(styles.italic);
                }

                return (
                  <Text key={`${idx}-${segIdx}`} style={combinedTextStyles}>
                    {segment.text}
                  </Text>
                );
              })}
            </React.Fragment>
          );
        }
      })}
    </View>
  );
};

export default MathRenderer;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  questionText: {
    fontSize: 17,
    color: "#222",
    fontFamily: "SourceSans3Medium",
  },
  bold: {
    fontFamily: "SourceSans3Bold",
  },
  italic: {
    fontFamily: "SourceSans3MediumItalic",
  },
  code: {
    fontFamily: "Courier",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
    fontSize: 14,
  },
  inlineMathContainer: {
    marginHorizontal: 0,
    marginTop: 4,
  },
  blockMathContainer: {
    width: "100%",
    alignItems: "left",
    marginVertical: 0,
    marginTop: 4,
  },
  newline: {
    width: "100%",
    height: 4,
  },
  imageContainer: {
    width: "90%",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 180,
  },
  altText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "SourceSans3Medium",
    marginTop: 4,
  },
});