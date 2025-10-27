import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MathJaxSvg from "react-native-mathjax-svg";

interface MathRendererProps {
  content: string;
}

const MathRenderer: React.FC<MathRendererProps> = ({ content }) => {
  // Clean and split HTML + math parts
  const clean = content.replace(/\n/g, " ");
  const parts = clean.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/g).filter(Boolean);

  return (
    <View
      style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}
    >
      {parts.map((part, idx) => {
        const isMath = part.startsWith("$$") || part.startsWith("$");

        if (isMath) {
          const math = part.replace(/^\$\$?|\$\$?$/g, "").trim();
          const isBlock = part.startsWith("$$");

          return (
            <View
              key={idx}
              style={
                isBlock ? styles.blockMathContainer : styles.inlineMathContainer
              }
            >
              <MathJaxSvg fontSize={15} color="#000">
                {math}
              </MathJaxSvg>
            </View>
          );
        } else {
          const plain = part.replace(/<\/?[^>]+(>|$)/g, "").trim();
          return (
            <Text key={idx} style={styles.questionText}>
              {plain}
            </Text>
          );
        }
      })}
    </View>
  );
};

export default MathRenderer;

const styles = StyleSheet.create({
  questionText: {
    fontSize: 15,
    color: "#222",
    fontFamily: "SourceSans3Medium",
  },
  inlineMathContainer: {
    marginHorizontal: 2,
  },
  blockMathContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 6,
  },
});
