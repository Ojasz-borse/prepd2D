import TopHeader from "@/components/TopHeader";
import syllabusData from "@/dataConfig/chapters.json";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChapterDetails() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const chapter = useMemo(() => {
    return syllabusData.find((c) => c.id.toString() === id);
  }, [id]);

  if (!chapter) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Chapter not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopHeader title="Chapter Details" showBackArrow={true} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.subRow}>
          <Text style={styles.subText}>
            {chapter.subject === 1
              ? "Physics"
              : chapter.subject === 2
              ? "Chemistry"
              : "Mathematics"}
          </Text>
          <Text style={styles.subText}>
            {chapter.class === 1 ? "11th" : "12th"}
          </Text>
        </View>

        <Text style={styles.chapterText}>
          {chapter.chapter_no}. {chapter.chapter_name}
        </Text>

        <View style={styles.bottomSubRow}>
          <View style={styles.bottomSubRowView}>
            <Text style={styles.bottomSubRowText}>
              Weightage: {chapter.weightage}
            </Text>
          </View>
        </View>

        <View style={styles.topicContainer}>
          {chapter.topics.map((e, i) => (
            <View key={i} style={styles.topic}>
              <Text style={styles.topicText}>{e.topic}</Text>
              {e.sub_topic && (
                <View style={{ marginTop: 4 }}>
                  {e.sub_topic.map((e, i) => {
                    return <Text style={styles.subtopicText}>- {e}</Text>;
                  })}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,

    backgroundColor: "#ffffff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFound: {
    fontSize: 18,
    color: "red",
  },
  chapterTag: {
    width: "100%",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    marginBottom: 16,
  },
  chapterText: {
    fontSize: 16,
    color: "#000",
    marginTop: 2,
    fontWeight: "600",
    fontFamily: "SourceSans3Medium",
  },
  subRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subText: {
    fontSize: 14,
    color: "#004aad",
    fontFamily: "SourceSans3Medium",
  },
  noResult: {
    fontSize: 16,
    color: "#777",
    fontFamily: "SourceSans3Medium",
    textAlign: "center",
    marginTop: 20,
  },
  bottomSubRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  bottomSubRowView: {
    backgroundColor: "#ebf0fa",
    padding: 2,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  bottomSubRowText: {
    fontSize: 12,
    color: "#004aad",
    fontFamily: "SourceSans3Medium",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    color: "#000",
  },
  tag: {
    fontSize: 16,
    color: "#004aad",
    marginBottom: 4,
  },
  subHeading: {
    fontSize: 18,
    marginVertical: 12,
    fontWeight: "600",
  },
  topicCard: {
    backgroundColor: "#ebf0fa",
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  subItem: {
    fontSize: 14,
    marginLeft: 15,
    color: "#333",
  },

  topicContainer: {
    marginTop: 16,
    paddingBottom: 40 
  },
  topic: {
    borderWidth: 1,
    borderColor: "#d9d9d9",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 10,
  },
  topicText: {
    width: "auto",
    fontSize: 14,
    color: "#000000",
    fontFamily: "SourceSans3Medium",
  },
  subtopicText: {
    fontSize: 14,
    color: "#2d3748",
    fontFamily: "SourceSans3Medium",
    marginLeft: 4,
  },
});
