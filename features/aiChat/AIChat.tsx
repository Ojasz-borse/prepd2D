import UpArrowIcon from "@/assets/icons/UpArrowIcon";
import GradientAIText from "@/components/GradientAIText";
import { useAuth } from "@/context/AuthContext";
import { useChatLLM } from "@/hooks/useChatLLM";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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

// 🧭 Header
const TopHeader = ({
  onBack,
  onRefresh,
}: {
  onBack: () => void;
  onRefresh: () => void;
}) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity onPress={onBack} style={styles.headerButton}>
      <Ionicons name="arrow-back" size={22} color="#000" />
    </TouchableOpacity>

    <View style={styles.alertContainer}>
      <MaterialCommunityIcons name="clock-outline" size={14} color="#f57c00" />
      <Text style={styles.alertText}>Auto-deletes in 48 hrs</Text>
    </View>

    <TouchableOpacity onPress={onRefresh} style={styles.headerButton}>
      <MaterialCommunityIcons name="refresh" size={22} color="#000" />
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
  const [typingText, setTypingText] = useState("");

  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  // 🧩 Append new messages when received
  useEffect(() => {
    if (messages.length === 0) return;
    const last = messages[messages.length - 1];
    setDisplayedMessages((prev) => [...prev, last]);

    // ✅ Wait a frame before scrolling (ensures layout done)
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 80);
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
    setHasStartedChat(true);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleRefresh = () => {
    setDisplayedMessages([]);
    setTypingText("");
    setHasStartedChat(false);
    refresh?.();
  };

  const renderMessage = ({ item }: any) => (
    <View
      style={[
        styles.message,
        item.role === "user" ? styles.userMessage : styles.assistantMessage,
      ]}
    >
      {item.role === "assistant" && (
        <GradientAIText text="PrepCET AI" style={styles.aiName} />
      )}
      {item.role === "assistant" ? (
        <Markdown style={markdownStyles}>{item.content}</Markdown>
      ) : (
        <Text style={styles.messageText}>{item.content}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <TopHeader
        onBack={() => {
          if (router.canGoBack()) router.back();
          else router.replace("/home");
        }}
        onRefresh={handleRefresh}
      />

      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.chatWrapper}>
            {!hasStartedChat ? (
              <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeText}>Hey, how can I help you?</Text>
              </View>
            ) : (
              <FlatList
                ref={flatListRef}
                data={[
                  ...displayedMessages,
                  ...(typingText
                    ? [{ role: "assistant", content: typingText }]
                    : []),
                ]}
                renderItem={renderMessage}
                keyExtractor={(_, i) => i.toString()}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() =>
                  flatListRef.current?.scrollToEnd({ animated: true })
                }
                contentContainerStyle={{ paddingVertical: 12 }}
              />
            )}

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Type your message..."
                placeholderTextColor="#888"
                value={input}
                onChangeText={setInput}
                multiline
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
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AIChat;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  flexContainer: { flex: 1 },
  chatWrapper: { flex: 1 },

  message: { margin: 8, padding: 10, borderRadius: 12, maxWidth: "80%" },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#e6f1ff",
    borderTopRightRadius: 0,
  },
  assistantMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
  },
  messageText: { fontSize: 16, fontFamily: "SourceSans3Medium" },
  aiName: { marginBottom: -8 },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 99,
    marginHorizontal: 10,
    marginBottom: 10,
    padding: 8,
    backgroundColor: "#fff",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    color: "#000",
    maxHeight: 120,
    paddingVertical: 8,
  },
  sendButton: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 99,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerButton: { padding: 6 },
  alertContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3e0",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 20,
  },
  alertText: {
    fontSize: 12,
    color: "#f57c00",
    marginLeft: 4,
    fontFamily: "SourceSans3Medium",
  },
  welcomeContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  welcomeText: { fontSize: 22, fontFamily: "SourceSans3Medium", color: "#000" },
});

const markdownStyles = {
  body: { fontSize: 16, color: "#000", fontFamily: "SourceSans3Medium" },
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
};
