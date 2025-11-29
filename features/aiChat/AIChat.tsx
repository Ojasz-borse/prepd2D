import UpArrowIcon from "@/assets/icons/UpArrowIcon";
import { useAuth } from "@/context/AuthContext";
import { useChatLLM } from "@/hooks/useChatLLM";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ScreenCapture from "expo-screen-capture";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { SafeAreaView } from "react-native-safe-area-context";

// 🧭 Modern Header
const TopHeader = ({
  onBack,
  onRefresh,
}: {
  onBack: () => void;
  onRefresh: () => void;
}) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity onPress={onBack} style={{ paddingHorizontal: 8 }}>
      <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
    </TouchableOpacity>

    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 16, fontFamily: "SourceSans3Medium" }}>
        PrepAI
      </Text>
    </View>

    <TouchableOpacity onPress={onRefresh} style={styles.headerButton}>
      <MaterialCommunityIcons name="refresh" size={22} color="#004aad" />
      <Text
        style={{
          fontSize: 14,
          fontFamily: "SourceSans3Medium",
          color: "#004aad",
        }}
      >
        Refresh
      </Text>
    </TouchableOpacity>
  </View>
);

const AIChat: React.FC = () => {
  const { user } = useAuth();
  const { messages, sendMessage, loading, refresh } = useChatLLM({
    name: user?.first_name || "",
    email: user?.email || "",
  });

  const [input, setInput] = useState("");
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [displayedMessages, setDisplayedMessages] = useState<any[]>([]);
  const [showBanner, setShowBanner] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBanner(false);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    ScreenCapture.preventScreenCaptureAsync();

    return () => {
      ScreenCapture.allowScreenCaptureAsync();
    };
  }, []);

  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();

  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  const animateDots = () => {
    Animated.loop(
      Animated.stagger(200, [
        Animated.sequence([
          Animated.timing(dot1, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot1, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(dot2, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot2, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(dot3, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot3, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  };

  useEffect(() => {
    animateDots();
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;

    const last = messages[messages.length - 1];

    // Check for error in message
    if (
      last.role === "assistant" &&
      (!last.content || last.content.trim().length === 0)
    ) {
      setError(true);
    } else {
      setError(false);
    }

    const isAlreadyDisplayed = displayedMessages.some(
      (msg) => msg.content === last.content
    );

    if (!isAlreadyDisplayed) {
      setDisplayedMessages((prev) => [...prev, last]);
    }

    // Smooth auto-scroll with delay
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 200);
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    setError(false); // Reset error on new message
    sendMessage(input);
    setInput("");
    setHasStartedChat(true);
    Keyboard.dismiss();

    // Smooth scroll after sending
    setTimeout(
      () => scrollViewRef.current?.scrollToEnd({ animated: true }),
      300
    );
  };

  const handleRefresh = () => {
    setDisplayedMessages([]);
    setHasStartedChat(false);
    setError(false);
    refresh?.();
  };

  const renderMessage = (item: any, index: number) => {
    const isUser = item.role === "user";

    // Check for empty or error content
    const hasError = !item.content || item.content.trim().length === 0;

    const safeContent = hasError
      ? "⚠️ Something went wrong at our end. Please try to refresh and ask again."
      : item.content;

    return (
      <View
        key={index}
        style={[
          styles.messageWrapper,
          isUser ? styles.userMessageWrapper : styles.assistantMessageWrapper,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.assistantBubble,
            hasError && !isUser && styles.errorBubble,
          ]}
        >
          {!isUser ? (
            hasError ? (
              <Text style={[styles.messageText, styles.errorText]}>
                {safeContent}
              </Text>
            ) : (
              <Markdown style={markdownStyles as any}>{item.content}</Markdown>
            )
          ) : (
            <Text style={[styles.messageText, { color: "#fff" }]}>
              {safeContent}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <TopHeader
            onBack={() => {
              if (router.canGoBack()) router.back();
              else router.replace("/home");
            }}
            onRefresh={handleRefresh}
          />

          {/* Auto-delete Banner */}
          {showBanner && (
            <View style={styles.bannerContainer}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={14}
                color="#f57c00"
              />
              <Text style={styles.bannerText}>
                Messages auto-delete in 48 hours
              </Text>
            </View>
          )}

          {/* Chat Area */}
          <View style={styles.chatArea}>
            {!hasStartedChat ? (
              <View style={styles.welcomeContainer}>
                <View style={styles.welcomeIcon}>
                  <FontAwesome5 name="magic" size={28} color="#004aad" />
                </View>
                <Text style={styles.welcomeTitle}>
                  Hi {user?.first_name || "there"}! 👋
                </Text>
                <Text style={styles.welcomeSubtitle}>
                  How can I assist you today?
                </Text>
                <View style={styles.suggestionsContainer}>
                  <TouchableOpacity
                    style={styles.suggestionChip}
                    onPress={() => {
                      setInput("Show me colleges for ");
                    }}
                  >
                    <Text style={styles.suggestionText}>
                      💡 Show colleges for
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.suggestionChip}
                    onPress={() => {
                      setInput("Give PYQs on ");
                    }}
                  >
                    <Text style={styles.suggestionText}>
                      🎯 Give me PYQ's on
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <ScrollView
                ref={scrollViewRef}
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                scrollEventThrottle={16}
                nestedScrollEnabled={true}
                onContentSizeChange={() =>
                  scrollViewRef.current?.scrollToEnd({ animated: true })
                }
              >
                {displayedMessages.map((msg, idx) => renderMessage(msg, idx))}

                {loading && (
                  <View
                    style={[
                      styles.messageWrapper,
                      styles.assistantMessageWrapper,
                    ]}
                  >
                    <View
                      style={[
                        styles.messageBubble,
                        styles.assistantBubble,
                        styles.loadingBubble,
                      ]}
                    >
                      <View style={styles.typingIndicator}>
                        <Animated.View
                          style={[styles.typingDot, { opacity: dot1 }]}
                        />
                        <Animated.View
                          style={[styles.typingDot, { opacity: dot2 }]}
                        />
                        <Animated.View
                          style={[styles.typingDot, { opacity: dot3 }]}
                        />
                      </View>
                    </View>
                  </View>
                )}

                {/* Error Banner */}
                {error && !loading && (
                  <View style={styles.errorBanner}>
                    <MaterialCommunityIcons
                      name="alert-circle"
                      size={16}
                      color="#d32f2f"
                    />
                    <Text style={styles.errorBannerText}>
                      Failed to get response. Try refreshing.
                    </Text>
                  </View>
                )}
              </ScrollView>
            )}
          </View>

          {/* Input Area */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Type your message..."
                placeholderTextColor="#888"
                value={input}
                onChangeText={setInput}
                multiline
                maxLength={2000}
              />

              <TouchableOpacity
                onPress={handleSend}
                disabled={loading || !input.trim()}
              >
                <View
                  style={[
                    styles.sendButton,
                    {
                      backgroundColor:
                        loading || !input.trim() ? "#d9d9d9" : "#004aad",
                    },
                  ]}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <UpArrowIcon size={20} />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default AIChat;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  // Header
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#e6f1ff",
    padding: 8,
    borderRadius: 25,
  },

  // Banner
  bannerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff8e1",
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 6,
  },
  bannerText: {
    fontSize: 13,
    color: "#f57c00",
    fontFamily: "SourceSans3Medium",
  },

  // Chat Area
  chatArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  // Welcome Screen
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  welcomeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e3f2fd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 20,
    fontFamily: "SourceSans3SemiBold",
    color: "#1a1a1a",
    marginBottom: 8,
    fontWeight: "600",
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#666",
    fontFamily: "SourceSans3Medium",
    marginBottom: 32,
  },
  suggestionsContainer: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },
  suggestionChip: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  suggestionText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "SourceSans3Medium",
  },

  // Messages
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100, // Space for input
  },
  messageWrapper: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-end",
  },
  userMessageWrapper: {
    justifyContent: "flex-end",
  },
  assistantMessageWrapper: {
    justifyContent: "flex-start",
  },

  // Message Bubbles
  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: "#004aad",
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  loadingBubble: {
    paddingVertical: 16,
  },
  messageText: {
    fontSize: 15,
    color: "#fff",
    lineHeight: 22,
  },

  // Error Styles
  errorBubble: {
    backgroundColor: "#ffebee",
    borderColor: "#ef5350",
  },
  errorText: {
    color: "#c62828",
    fontSize: 15,
    lineHeight: 22,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffebee",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  errorBannerText: {
    fontSize: 14,
    color: "#d32f2f",
    fontFamily: "SourceSans3Medium",
    flex: 1,
  },

  // Typing Indicator
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#004aad50",
    opacity: 0.4,
  },

  // Input Section - FIXED
  inputWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingBottom: Platform.OS === "ios" ? 0 : 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 50,
    backgroundColor: "#fff",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    maxHeight: 120,
    paddingHorizontal: 10,
    fontFamily: "SourceSans3Medium",
  },
  sendButton: {
    padding: 10,
    borderRadius: 50,
  },
});

const markdownStyles = {
  body: {
    fontSize: 15,
    color: "#1a1a1a",
    fontFamily: "SourceSans3Medium",
    lineHeight: 22,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 8,
  },
  strong: {
    fontWeight: "600",
  },
  em: {
    fontStyle: "italic",
  },
  code_inline: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 14,
    color: "#004aad",
  },
  code_block: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    marginVertical: 8,
  },
  fence: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    marginVertical: 8,
  },
  list_item: {
    marginBottom: 4,
  },
};
