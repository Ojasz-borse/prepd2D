import GradientAIText from "@/components/GradientAIText";
import { useChatLLM } from "@/hooks/useChatLLM";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { SafeAreaView } from "react-native-safe-area-context";

// 🧭 TopHeader Component
const TopHeader = ({
  onBack,
  onRefresh,
}: {
  onBack: () => void;
  onRefresh: () => void;
}) => {
  return (
    <View style={styles.headerContainer}>
      {/* Back Arrow */}
      <TouchableOpacity onPress={onBack} style={styles.headerButton}>
        <Ionicons name="arrow-back" size={22} color="#000" />
      </TouchableOpacity>

      <View style={styles.alertContainer}>
        <MaterialCommunityIcons
          name="clock-outline"
          size={14}
          color="#f57c00"
        />
        <Text style={styles.alertText}>Auto-deletes in 48 hrs</Text>
      </View>

      {/* Refresh */}
      <TouchableOpacity onPress={onRefresh} style={styles.headerButton}>
        <MaterialCommunityIcons name="refresh" size={22} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

// ✨ Gradient Text
const GradientText = ({ text, style }: { text: string; style?: any }) => {
  return (
    <MaskedView
      maskElement={
        <Text style={[style, { backgroundColor: "transparent" }]}>{text}</Text>
      }
    >
      <LinearGradient
        colors={["#2690f2", "#0b69c1"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[style, { opacity: 0 }]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
};

// 💬 Chat Screen
const AIChat: React.FC = () => {
  const { messages, sendMessage, loading, refresh } = useChatLLM({
    name: "Kaustubh",
    email: "Kaustubh@example.com",
  });

  const [input, setInput] = useState("");
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [displayedMessages, setDisplayedMessages] = useState<any[]>([]);
  const [typingText, setTypingText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const router = useRouter();

  // Watch for backend messages
  React.useEffect(() => {
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    setDisplayedMessages((prev) => [...prev, lastMsg]);
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput("");
      setHasStartedChat(true);
    }
  };

  const handleRefresh = () => {
    setDisplayedMessages([]);
    setTypingText("");
    setHasStartedChat(false);
    if (refresh) refresh();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <TopHeader
        onBack={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace("/home");
          }
        }}
        onRefresh={handleRefresh}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            {!hasStartedChat ? (
              <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeText}>Hey, how can I help you?</Text>
                {/* <View style={styles.preAskContainer}>
                  {[
                    "What documents are required on exam day?",
                    "What are the high-scoring topics?",
                    "What rank will I get for 95 percentile?",
                    "Can you show me colleges in Pune/Mumbai region?",
                  ].map((q, i) => (
                    <TouchableOpacity
                      key={i}
                      style={styles.preAskChip}
                      onPress={() => {
                        setInput(q);
                        handleSend();
                      }}
                    >
                      <Text style={styles.preAskText}>{q}</Text>
                    </TouchableOpacity>
                  ))}
                </View> */}
              </View>
            ) : (
              <FlatList
                ref={flatListRef}
                data={
                  typingText
                    ? [
                        ...displayedMessages,
                        { role: "assistant", content: typingText },
                      ]
                    : displayedMessages
                }
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.message,
                      item.role === "user"
                        ? styles.userMessage
                        : styles.assistantMessage,
                    ]}
                  >
                    {item.role !== "user" && (
                      <GradientAIText text="PrepCET AI" style={styles.aiName} />
                    )}
                    {item.role === "assistant" ? (
                      <Markdown style={markdownStyles}>{item.content}</Markdown>
                    ) : (
                      <Text style={styles.messageText}>{item.content}</Text>
                    )}
                  </View>
                )}
                ListFooterComponent={
                  loading ? (
                    <View style={{ padding: 14 }}>
                      <GradientAIText
                        text="Thinking"
                        isLoading
                        style={styles.aiName}
                      />
                    </View>
                  ) : null
                }
                contentContainerStyle={{ paddingBottom: 80 }}
                onContentSizeChange={() =>
                  flatListRef.current?.scrollToEnd({ animated: true })
                }
                onLayout={() =>
                  flatListRef.current?.scrollToEnd({ animated: true })
                }
              />
            )}

            {/* Input Section */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Type your message..."
                placeholderTextColor="#888"
                value={input}
                onChangeText={setInput}
                multiline
              />

              <View style={styles.bottomRow}>
                <TouchableOpacity style={styles.modeButton}></TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSend}
                  disabled={loading || input.trim().length === 0}
                >
                  <View
                    style={[
                      styles.sendButton,
                      {
                        backgroundColor:
                          loading || input.trim().length === 0
                            ? "#d9d9d9"
                            : "#004aad",
                      },
                    ]}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <MaterialCommunityIcons
                        name="send"
                        size={20}
                        color="#fff"
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AIChat;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // 💬 Messages
  message: { margin: 8, padding: 10, borderRadius: 8, maxWidth: "80%" },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#e6f1ff",
    borderTopRightRadius: 0,
    borderTopLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24,
    margin: 8,
    padding: 10,
    paddingHorizontal: 16,
  },
  assistantMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
  },
  messageText: { fontSize: 16, fontFamily: "SourceSans3Medium" },
  aiName: { marginBottom: 4 },

  // 🧠 Input
  inputContainer: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 24,
    marginHorizontal: 10,
    marginBottom: 10,
    padding: 12,
    paddingTop: 2,
    backgroundColor: "#fff",
  },
  textInput: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    color: "#000",
    maxHeight: 120,
    paddingBottom: 8,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modeButton: {
    padding: 8,
  },
  sendButton: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 99,
  },

  // 🩵 Header
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerButton: {
    padding: 6,
  },
  alertContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3e0",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 20,
    marginHorizontal: 10,
    justifyContent: "center",
    alignSelf: "center", // optional, keeps it neat
  },

  alertText: {
    fontSize: 12,
    color: "#f57c00",
    marginLeft: 4,
    textAlign: "center",
    fontFamily: "SourceSans3Medium",
  },

  // 🩵 Welcome
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 22,
    fontFamily: "SourceSans3Medium",
    color: "#000",
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    marginLeft: 12,
    marginTop: 4,
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#555",
    fontFamily: "SourceSans3Medium",
  },
  preAskContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
    paddingHorizontal: 12,
  },

  preAskChip: {
    borderWidth: 1,
    borderColor: "#004aad",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    margin: 6,
  },

  preAskText: {
    color: "#004aad",
    fontSize: 14,
    fontFamily: "SourceSans3Medium",
    textAlign: "center",
  },
});

const markdownStyles: StyleSheet.NamedStyles<any> = {
  body: {
    fontSize: 16,
    color: "#000",
    fontFamily: "SourceSans3Medium",
  },
  strong: {
    fontWeight: "700", // ✅ fix: use literal type, not string
  },
  em: {
    fontStyle: "italic",
  },
  code_inline: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    fontFamily: "monospace",
  },
  code_block: {
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    padding: 10,
    fontFamily: "monospace",
  },
  bullet_list: {
    marginVertical: 6,
  },
};
