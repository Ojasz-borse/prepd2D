import TopHeader from "@/components/TopHeader";
import syllabusData from "@/dataConfig/chapters.json";
import { useLocalSearchParams } from "expo-router";
import * as ScreenCapture from "expo-screen-capture";
import React, { useEffect, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";


export default function ChapterDetails() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const chapter = useMemo(() => {
    return syllabusData.find((c) => c.id.toString() === id);
  }, [id]);

  useEffect(() => {
    ScreenCapture.preventScreenCaptureAsync();

    return () => {
      ScreenCapture.allowScreenCaptureAsync();
    };
  }, []);

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
        <LinearGradient
          colors={["#f8fafc", "#e6f1ff", "#e8dcff"]}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.container}
        >
          <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
            <View style={styles.card}>


              <View style={styles.subRow}>
                <View style={styles.subjectTag}>
                  <Text style={styles.subText}>
                    {chapter.subject === 1
                      ? "Physics"
                      : chapter.subject === 2
                        ? "Chemistry"
                        : "Mathematics"}
                  </Text>
                </View>
                <View style={styles.subjectTag}>
                  <Text style={styles.subText}>
                    {chapter.class === 1 ? "11th" : "12th"}
                  </Text>
                </View>
              </View>


              <Text style={styles.chapterTitle}>
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
                          return <Text key={i} style={styles.subtopicText}>- {e}</Text>;
                        })}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",

  },

  card: {
    backgroundColor: "#fff",
    width: "100%",
    alignSelf: "center",
    borderRadius: 18,
    padding: 12,
    marginTop: 16,


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
  chapterTitle: {
    flex: 1,
    fontSize: 17,
    color: "#000",
    fontFamily: "SourceSans3SemiBold",
    marginRight: 8,
  },
  subRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  subjectTag: {
    backgroundColor: "#f0f7d4",
    borderWidth: 1,
    borderColor: "#b6cf4f",
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  subText: {
    fontSize: 12,
    color: "#8b9e3dff",
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
    marginTop: 8,
  },
  bottomSubRowView: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#004aad",
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 99,
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
    fontSize: 20,
    color: "#000",
    fontFamily: "SourceSans3Medium",
  },
  subItem: {
    fontSize: 14,
    marginLeft: 15,
    color: "#333",
  },

  topicContainer: {
    marginTop: 16,
    paddingBottom: 40,
  },
  topic: {
    borderWidth: 1,
    borderColor: "#d9d9d9",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  topicText: {
    width: "auto",
    fontSize: 16,
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
