import TopHeader from "@/components/TopHeader";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import * as ScreenCapture from "expo-screen-capture";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export default function PdfViewer() {
    const { url, title } = useLocalSearchParams<{ url: string; title: string }>();
    const [loading, setLoading] = useState(true);

    // Prevent screenshots while this screen is active
    ScreenCapture.usePreventScreenCapture();

    if (!url) {
        return (
            <SafeAreaView style={styles.container}>
                <TopHeader title="Error" showBackArrow={true} />
                <View style={styles.centered}>
                    <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <TopHeader title={title || "PDF Viewer"} showBackArrow={true} />
            <View style={styles.content}>
                <WebView
                    source={{ uri: url }}
                    style={styles.webview}
                    onLoadEnd={() => setLoading(false)}
                    startInLoadingState={true}
                    renderLoading={() => (
                        <View style={styles.loader}>
                            <ActivityIndicator size="large" color="#004aad" />
                        </View>
                    )}
                    // 🛡️ Security Restrictions
                    originWhitelist={["*"]}
                    allowsFullscreenVideo={false}
                    allowsInlineMediaPlayback={true}
                    mediaPlaybackRequiresUserAction={true}

                    // Prevent downloads and external navigation
                    onFileDownload={({ nativeEvent: { downloadUrl } }) => {
                        // console.log("Blocking download attempt:", downloadUrl);
                    }}
                    onShouldStartLoadWithRequest={(request) => {
                        // Only allow the original URL or common PDF viewer patterns
                        const isOriginalUrl = request.url.startsWith(url);
                        const isMainFrame = request.mainDocumentURL?.startsWith(url);

                        if (isOriginalUrl || isMainFrame) {
                            return true;
                        }

                        // console.log("Blocking navigation request:", request.url);
                        return false;
                    }}

                    // Privacy and storage restrictions
                    incognito={true}
                    cacheEnabled={false}
                    sharedCookiesEnabled={false}
                    domStorageEnabled={false}
                    javaScriptEnabled={true}
                />
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    content: {
        flex: 1,
    },
    webview: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loader: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
});
