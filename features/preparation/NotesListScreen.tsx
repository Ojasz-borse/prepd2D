import MathText from "@/components/MathText";
import SyllabusChapterCardSkeleton from "@/components/SyllabusChapterCardSkeleton";
import TopHeader from "@/components/TopHeader";
import { GET_NOTES } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import { usePreventScreenCapture } from "@/hooks/usePreventScreenCapture";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Animated,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ✅ Note Card Component
const NoteCard = React.memo(({ note, index, router }: { note: any; index: number; router: any }) => {
    const handlePress = () => {
        if (note.notes_url) {
            router.push({
                pathname: "/pdf-viewer",
                params: { url: note.notes_url, title: note.notes_title || `Note ${index + 1}` },
            });
        }
    };

    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={handlePress}>
            <View style={styles.cardGradient}>
                <View style={styles.cardHeader}>
                    <View style={styles.noteNumber}>
                        <Text style={styles.noteNumberText}>Note {index + 1}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#004aad" />
                </View>

                <View style={styles.noteContent}>
                    <MathText content={note.note_content} />
                </View>

                {note.notes_title && (
                    <View style={styles.cardFooter}>
                        <Text style={styles.noteTitleText}>{note.notes_title}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
});


export default function NotesListScreen() {
    const router = useRouter();
    const { id, chapter_name, title } = useLocalSearchParams<{
        id: string;
        chapter_name: string;
        title: string;
    }>();

    const [loading, setLoading] = useState(true);
    const { user, getToken } = useAuth();
    const [notesList, setNotesList] = useState<any[]>([]);

    const listRef = React.useRef<FlatList>(null);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    usePreventScreenCapture();

    useEffect(() => {
        const fetchNotes = async () => {
            setLoading(true);
            const token = await getToken();

            try {
                const response = await fetch(GET_NOTES, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                    body: JSON.stringify({ chapter_id: id, user_id: user?.user_id }),
                });

                const json = await response.json();
                // console.log("Notes List API response data:", json);

                if (json.success) {
                    setNotesList(json.notes || []);
                }
            } catch (err) {
                console.error("Error fetching Notes list", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, [id]);

    const handleScroll = (e: any) => {
        const y = e.nativeEvent.contentOffset.y;
        if (y > 250 && !showScrollTop) {
            setShowScrollTop(true);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        } else if (y <= 250 && showScrollTop) {
            setShowScrollTop(false);
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    };

    const scrollToTop = () => {
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <TopHeader title={title || "Notes"} showBackArrow={true} />

            <FlatList
                ref={listRef}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                data={notesList}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <View style={styles.screenHeader}>
                        <Text style={styles.title}>{chapter_name}</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {notesList.length} Items
                            </Text>
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    loading ? (
                        <>
                            <SyllabusChapterCardSkeleton />
                            <SyllabusChapterCardSkeleton />
                            <SyllabusChapterCardSkeleton />
                            <SyllabusChapterCardSkeleton />
                            <SyllabusChapterCardSkeleton />
                        </>
                    ) : (
                        <View style={styles.noResultsContainer}>
                            <Text style={styles.noResultTitle}>No Notes Found</Text>
                            <Text style={styles.noResultSub}>
                                There are no notes available for this chapter yet.
                            </Text>
                        </View>
                    )
                }
                renderItem={({ item, index }) => (
                    <NoteCard note={item} index={index} router={router} />
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />

            {showScrollTop && (
                <Animated.View style={[styles.scrollTopBtn, { opacity: fadeAnim }]}>
                    <TouchableOpacity
                        onPress={scrollToTop}
                        style={styles.scrollTopTouchable}
                    >
                        <Ionicons name="chevron-up" size={24} color="#000" />
                    </TouchableOpacity>
                </Animated.View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    listContent: {
        padding: 16,
        paddingBottom: 32,
        backgroundColor: "#fff",
    },
    screenHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 18,
    },
    title: {
        fontSize: 18,
        fontFamily: "SourceSans3Bold",
        color: "#0f172a",
        flex: 1,
        marginRight: 12,
    },
    badge: {
        backgroundColor: "#ebf0fa",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 12,
        color: "#004aad",
        fontFamily: "SourceSans3Bold",
    },
    card: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        backgroundColor: "#f8fafc",
    },
    cardGradient: {
        borderRadius: 20,
        padding: 16,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    noteNumber: {
        backgroundColor: "#ebf0fa",
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 8,
    },
    noteNumberText: {
        fontSize: 12,
        color: "#004aad",
        fontFamily: "SourceSans3Bold",
    },
    noteContent: {
        marginBottom: 8,
    },
    cardFooter: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#e2e8f0",
    },
    noteTitleText: {
        fontSize: 14,
        color: "#475569",
        fontFamily: "SourceSans3SemiBold",
    },
    separator: {
        height: 16,
    },
    noResultsContainer: {
        alignItems: "center",
        padding: 40,
        marginTop: 50,
    },
    noResultTitle: {
        fontSize: 20,
        color: "#0f172a",
        fontFamily: "SourceSans3Bold",
        textAlign: "center",
    },
    noResultSub: {
        fontSize: 15,
        color: "#475569",
        fontFamily: "SourceSans3Regular",
        textAlign: "center",
        marginTop: 8,
        lineHeight: 22,
    },
    scrollTopBtn: {
        position: "absolute",
        bottom: 20,
        right: 20,
        elevation: 5,
    },
    scrollTopTouchable: {
        backgroundColor: "#fff",
        width: 46,
        height: 46,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
    },
});
