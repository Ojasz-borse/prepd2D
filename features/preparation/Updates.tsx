import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    SafeAreaView,
    ActivityIndicator,
    Platform,
    RefreshControl,
} from "react-native";
import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { GET_RESOURCES } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import { fetchWithRetry } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CACHE_RESOURCES, CACHE_TTL } from "@/constants/cacheStorageConfig";
import ResourceCardSkeleton from "@/components/ResourceCardSkeleton";

// Interface for Resource
interface Resource {
    title: string;
    description: string;
    url: string;
    created_at: string;
}

interface CachePayload {
    resources: Resource[];
    lastFetched: number;
}

export default function Resources() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPdf, setSelectedPdf] = useState<{ url: string; title: string } | null>(null);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const { getToken } = useAuth();

    const fetchResources = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                // 1. Load from cache first
                const cached = await AsyncStorage.getItem(CACHE_RESOURCES);
                if (cached) {
                    const parsed: CachePayload = JSON.parse(cached);
                    setResources(parsed.resources);

                    // If cache is fresh, don't show loading spinner for background fetch
                    if (Date.now() - parsed.lastFetched < CACHE_TTL) {
                        setLoading(false);
                    }
                } else {
                    setLoading(true);
                }
            }

            // 2. Always fetch latest data from API
            const token = await getToken();
            const response = await fetchWithRetry(
                GET_RESOURCES,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                },
                3,
                1000
            );
            const data = await response.json();
            if (data.success) {
                setResources(data.resources);
                // Update cache
                const payload: CachePayload = {
                    resources: data.resources,
                    lastFetched: Date.now(),
                };
                await AsyncStorage.setItem(CACHE_RESOURCES, JSON.stringify(payload));
            } else if (!cached) {
                // Only set error if we don't have cached data
                setError("Failed to load resources");
            }
        } catch (err) {
            console.error("Error fetching resources:", err);
            // Only show error if we have no resources at all
            if (resources.length === 0 && !isRefresh) {
                setError("Something went wrong. Please try again later.");
            }
        } finally {
            setLoading(false);
            if (isRefresh) {
                setRefreshing(false);
            }
        }
    };

    const onRefresh = React.useCallback(() => {
        fetchResources(true);
    }, []);

    useEffect(() => {
        fetchResources();
    }, []);

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    if (error) {
        return (
            <View style={styles.centered}>
                <Ionicons name="alert-circle-outline" size={48} color="red" />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={fetchResources} style={styles.retryBtn}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
                }
            >
                <View style={styles.resultsContainer}>
                    <Text style={styles.resultCount}>Latest Resources</Text>

                    {loading ? (
                        <>
                            <ResourceCardSkeleton />
                            <ResourceCardSkeleton />
                            <ResourceCardSkeleton />
                            <ResourceCardSkeleton />
                            <ResourceCardSkeleton />
                        </>
                    ) : resources.length === 0 ? (
                        <View style={styles.noDataContainer}>
                            <Text style={styles.noDataText}>No resources available yet.</Text>
                        </View>
                    ) : (
                        resources.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={0.7}
                                style={styles.chapterTag}
                            >
                                <View style={styles.subRow}>
                                    <View style={styles.subjectTag}>
                                        <Text style={styles.subText}>{formatDate(item.created_at)}</Text>
                                    </View>
                                </View>

                                <View style={styles.titleRow}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.chapterTitle}>{item.title}</Text>
                                        {item.description && item.description !== item.title && (
                                            <Text style={styles.descriptionText}>{item.description}</Text>
                                        )}
                                    </View>
                                    <TouchableOpacity
                                        style={styles.pdfButton}
                                        onPress={() => setSelectedPdf({ url: item.url, title: item.title })}
                                    >
                                        <Text style={styles.pdfButtonText}>PDF</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </View>
            </ScrollView>

            {/* Integrated PDF Viewer Overlay (Full Screen Modal) */}
            <Modal
                visible={!!selectedPdf}
                animationType="slide"
                onRequestClose={() => setSelectedPdf(null)}
            >
                <SafeAreaView style={styles.fullScreenContainer}>
                    <View style={styles.pdfHeader}>
                        <TouchableOpacity onPress={() => setSelectedPdf(null)} style={styles.closeBtn}>
                            <Ionicons name="arrow-back" size={24} color="#141414" />
                        </TouchableOpacity>
                        <Text style={styles.pdfHeaderTitle} numberOfLines={1}>{selectedPdf?.title}</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <View style={styles.pdfWebWrapper}>
                        <WebView
                            source={{
                                uri: Platform.OS === "android" && selectedPdf?.url
                                    ? `https://docs.google.com/viewer?url=${encodeURIComponent(selectedPdf.url)}&embedded=true`
                                    : selectedPdf?.url || ""
                            }}
                            style={styles.webview}
                            onLoadStart={() => setPdfLoading(true)}
                            onLoadEnd={() => setPdfLoading(false)}
                            startInLoadingState={true}
                            renderLoading={() => (
                                <View style={styles.loader}>
                                    <ActivityIndicator size="large" color={colors.primary} />
                                </View>
                            )}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                        />
                    </View>
                </SafeAreaView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        fontFamily: "SourceSans3Medium",
        color: "#737373",
    },
    errorText: {
        marginTop: 10,
        fontSize: 16,
        fontFamily: "SourceSans3Medium",
        color: "red",
        textAlign: "center",
        paddingHorizontal: 20,
    },
    retryBtn: {
        marginTop: 15,
        backgroundColor: colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryText: {
        color: "#fff",
        fontFamily: "SourceSans3SemiBold",
    },
    scrollContent: {
        paddingBottom: 20,
        marginTop: 20,
    },
    resultsContainer: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    resultCount: {
        fontSize: 18,
        fontFamily: "SourceSans3SemiBold",
        color: "#004aad",
        marginBottom: 16,
    },
    noDataContainer: {
        padding: 40,
        alignItems: "center",
    },
    noDataText: {
        fontSize: 16,
        fontFamily: "SourceSans3Medium",
        color: "#737373",
    },
    chapterTag: {
        width: "100%",
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        backgroundColor: "#fff",
        marginBottom: 16,
    },
    subRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
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
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    chapterTitle: {
        fontSize: 17,
        color: "#000",
        fontFamily: "SourceSans3SemiBold",
        marginRight: 8,
    },
    descriptionText: {
        fontSize: 14,
        color: "#737373",
        fontFamily: "SourceSans3Medium",
        marginTop: 4,
        marginRight: 8,
    },
    pdfButton: {
        backgroundColor: "#ff5e32",
        paddingHorizontal: 18,
        paddingVertical: 6,
        borderRadius: 999,
    },
    pdfButtonText: {
        color: "#fff",
        fontSize: 14,
        fontFamily: "SourceSans3SemiBold",
    },
    // PDF Viewer Styles
    fullScreenContainer: {
        flex: 1,
        backgroundColor: "#fff",
    },
    pdfHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 8,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
    },
    pdfHeaderTitle: {
        flex: 1,
        fontFamily: "SourceSans3SemiBold",
        fontSize: 16,
        color: "#141414",
        textAlign: "center",
    },
    closeBtn: {
        padding: 4,
    },
    pdfWebWrapper: {
        flex: 1,
    },
    webview: {
        flex: 1,
    },
    loader: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
});
