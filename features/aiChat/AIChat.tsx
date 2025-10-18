// import GradientAIText from "@/components/GradientAIText";
// import { useChatLLM } from "@/hooks/useChatLLM";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import MaskedView from "@react-native-masked-view/masked-view";
// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import React, { useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   FlatList,
//   Keyboard,
//   KeyboardAvoidingView,
//   Platform,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
// } from "react-native";
// import Markdown from "react-native-markdown-display";
// import { SafeAreaView } from "react-native-safe-area-context";

// // 🧭 TopHeader Component
// const TopHeader = ({
//   onBack,
//   onRefresh,
// }: {
//   onBack: () => void;
//   onRefresh: () => void;
// }) => {
//   return (
//     <View style={styles.headerContainer}>
//       {/* Back Arrow */}
//       <TouchableOpacity onPress={onBack} style={styles.headerButton}>
//         <Ionicons name="arrow-back" size={22} color="#000" />
//       </TouchableOpacity>

//       <View style={styles.alertContainer}>
//         <MaterialCommunityIcons
//           name="clock-outline"
//           size={14}
//           color="#f57c00"
//         />
//         <Text style={styles.alertText}>Auto-deletes in 48 hrs</Text>
//       </View>

//       {/* Refresh */}
//       <TouchableOpacity onPress={onRefresh} style={styles.headerButton}>
//         <MaterialCommunityIcons name="refresh" size={22} color="#000" />
//       </TouchableOpacity>
//     </View>
//   );
// };

// // ✨ Gradient Text
// const GradientText = ({ text, style }: { text: string; style?: any }) => {
//   return (
//     <MaskedView
//       maskElement={
//         <Text style={[style, { backgroundColor: "transparent" }]}>{text}</Text>
//       }
//     >
//       <LinearGradient
//         colors={["#2690f2", "#0b69c1"]}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//       >
//         <Text style={[style, { opacity: 0 }]}>{text}</Text>
//       </LinearGradient>
//     </MaskedView>
//   );
// };

// // 💬 Chat Screen
// const AIChat: React.FC = () => {
//   const { messages, sendMessage, loading, refresh } = useChatLLM({
//     name: "Kaustubh",
//     email: "Kaustubh@example.com",
//   });

//   const [input, setInput] = useState("");
//   const [hasStartedChat, setHasStartedChat] = useState(false);
//   const [displayedMessages, setDisplayedMessages] = useState<any[]>([]);
//   const [typingText, setTypingText] = useState("");
//   const flatListRef = useRef<FlatList>(null);

//   const router = useRouter();

//   // Watch for backend messages
//   React.useEffect(() => {
//     if (messages.length === 0) return;
//     const lastMsg = messages[messages.length - 1];
//     setDisplayedMessages((prev) => [...prev, lastMsg]);
//   }, [messages]);

//   const handleSend = () => {
//     if (input.trim()) {
//       sendMessage(input);
//       setInput("");
//       setHasStartedChat(true);
//     }
//   };

//   const handleRefresh = () => {
//     setDisplayedMessages([]);
//     setTypingText("");
//     setHasStartedChat(false);
//     if (refresh) refresh();
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />

//       {/* Header */}
//       <TopHeader
//         onBack={() => {
//           if (router.canGoBack()) {
//             router.back();
//           } else {
//             router.replace("/home");
//           }
//         }}
//         onRefresh={handleRefresh}
//       />

//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
//       >
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <View style={styles.container}>
//             {!hasStartedChat ? (
//               <View style={styles.welcomeContainer}>
//                 <Text style={styles.welcomeText}>Hey, how can I help you?</Text>
//               </View>
//             ) : (
//               <FlatList
//                 ref={flatListRef}
//                 data={
//                   typingText
//                     ? [
//                         ...displayedMessages,
//                         { role: "assistant", content: typingText },
//                       ]
//                     : displayedMessages
//                 }
//                 keyExtractor={(_, index) => index.toString()}
//                 renderItem={({ item }) => (
//                   <View
//                     style={[
//                       styles.message,
//                       item.role === "user"
//                         ? styles.userMessage
//                         : styles.assistantMessage,
//                     ]}
//                   >
//                     {item.role !== "user" && (
//                       <GradientAIText text="PrepCET AI" style={styles.aiName} />
//                     )}
//                     {item.role === "assistant" ? (
//                       <Markdown style={markdownStyles}>{item.content}</Markdown>
//                     ) : (
//                       <Text style={styles.messageText}>{item.content}</Text>
//                     )}
//                   </View>
//                 )}
//                 contentContainerStyle={{ paddingBottom: 80 }}
//                 onContentSizeChange={() =>
//                   flatListRef.current?.scrollToEnd({ animated: true })
//                 }
//                 onLayout={() =>
//                   flatListRef.current?.scrollToEnd({ animated: true })
//                 }
//               />
//             )}

//             {/* Input Section */}
//             <View style={styles.inputContainer}>
//               <TextInput
//                 style={styles.textInput}
//                 placeholder="Type your message..."
//                 placeholderTextColor="#888"
//                 value={input}
//                 onChangeText={setInput}
//                 multiline
//               />

//               <View style={styles.bottomRow}>
//                 <TouchableOpacity style={styles.modeButton}>
//                   <MaterialCommunityIcons
//                     name="tune-variant"
//                     size={22}
//                     color="#004aad"
//                   />
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   onPress={handleSend}
//                   disabled={loading || input.trim().length === 0}
//                 >
//                   <View
//                     style={[
//                       styles.sendButton,
//                       {
//                         backgroundColor:
//                           loading || input.trim().length === 0
//                             ? "#d9d9d9"
//                             : "#004aad",
//                       },
//                     ]}
//                   >
//                     {loading ? (
//                       <ActivityIndicator color="#fff" />
//                     ) : (
//                       <MaterialCommunityIcons
//                         name="send"
//                         size={20}
//                         color="#fff"
//                       />
//                     )}
//                   </View>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </TouchableWithoutFeedback>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default AIChat;

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#f2f2f2",
//   },
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   // 💬 Messages
//   message: { margin: 8, padding: 10, borderRadius: 8, maxWidth: "80%" },
//   userMessage: {
//     alignSelf: "flex-end",
//     backgroundColor: "#e6f1ff",
//     borderTopRightRadius: 0,
//     borderTopLeftRadius: 24,
//     borderBottomRightRadius: 24,
//     borderBottomLeftRadius: 24,
//     margin: 8,
//     padding: 10,
//     paddingHorizontal: 16,
//   },
//   assistantMessage: {
//     alignSelf: "flex-start",
//     backgroundColor: "#fff",
//   },
//   messageText: { fontSize: 16, fontFamily: "SourceSans3Medium" },
//   aiName: { marginBottom: 4 },

//   // 🧠 Input
//   inputContainer: {
//     borderWidth: 1,
//     borderColor: "#e0e0e0",
//     borderRadius: 24,
//     marginHorizontal: 10,
//     marginBottom: 10,
//     padding: 12,
//     paddingTop: 2,
//     backgroundColor: "#fff",
//   },
//   textInput: {
//     fontSize: 16,
//     fontFamily: "SourceSans3Medium",
//     color: "#000",
//     maxHeight: 120,
//     paddingBottom: 8,
//   },
//   bottomRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   modeButton: {
//     padding: 8,
//   },
//   sendButton: {
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//     borderRadius: 99,
//   },

//   // 🩵 Header
//   headerContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   headerButton: {
//     padding: 6,
//   },
//   alertContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff3e0",
//     paddingHorizontal: 10,
//     paddingVertical: 2,
//     borderRadius: 20,
//     marginHorizontal: 10,
//     justifyContent: "center",
//     alignSelf: "center", // optional, keeps it neat
//   },

//   alertText: {
//     fontSize: 12,
//     color: "#f57c00",
//     marginLeft: 4,
//     textAlign: "center",
//     fontFamily: "SourceSans3Medium",
//   },

//   // 🩵 Welcome
//   welcomeContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   welcomeText: {
//     fontSize: 22,
//     fontFamily: "SourceSans3Medium",
//     color: "#000",
//   },
// });

// const markdownStyles: StyleSheet.NamedStyles<any> = {
//   body: {
//     fontSize: 16,
//     color: "#000",
//     fontFamily: "SourceSans3Medium",
//   },
//   strong: {
//     fontWeight: "700", // ✅ fix: use literal type, not string
//   },
//   em: {
//     fontStyle: "italic",
//   },
//   code_inline: {
//     backgroundColor: "#f0f0f0",
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 6,
//     fontFamily: "monospace",
//   },
//   code_block: {
//     backgroundColor: "#f7f7f7",
//     borderRadius: 8,
//     padding: 10,
//     fontFamily: "monospace",
//   },
//   bullet_list: {
//     marginVertical: 6,
//   },
// };

import GradientAIText from "@/components/GradientAIText";
import { useChatLLM } from "@/hooks/useChatLLM";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
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
      <Ionicons name="arrow-back" size={24} color="#004aad" />
    </TouchableOpacity>

    <View style={styles.headerCenter}>
      <GradientAIText text="PrepCET AI" />
      <Text style={styles.headerSubtitle}>Auto-deletes in 48 hrs</Text>
    </View>

    <TouchableOpacity onPress={onRefresh} style={styles.headerButton}>
      <MaterialCommunityIcons name="refresh" size={22} color="#004aad" />
    </TouchableOpacity>
  </View>
);

// ✨ Typing Indicator
const TypingDots = () => {
  const dotAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
      {[0, 1, 2].map((i) => (
        <Animated.View
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: "#004aad",
            marginHorizontal: 3,
            opacity: dotAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1],
            }),
            transform: [
              {
                scale: dotAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.3],
                }),
              },
            ],
          }}
        />
      ))}
    </View>
  );
};

// 💬 AI Chat
const AIChat: React.FC = () => {
  const { messages, sendMessage, loading, refresh } = useChatLLM({
    name: "Kaustubh",
    email: "Kaustubh@example.com",
  });

  const [input, setInput] = useState("");
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [displayedMessages, setDisplayedMessages] = useState<any[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      setDisplayedMessages((prev) => [...prev, lastMsg]);
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
    setHasStartedChat(true);
  };

  const handleRefresh = () => {
    setDisplayedMessages([]);
    setHasStartedChat(false);
    refresh?.();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <TopHeader
        onBack={() =>
          router.canGoBack() ? router.back() : router.replace("/home")
        }
        onRefresh={handleRefresh}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            {!hasStartedChat ? (
              <View style={styles.welcomeContainer}>
                <GradientAIText text="Hey 👋" />
                <Text style={styles.welcomeText}>
                  How can I help you today?
                </Text>
              </View>
            ) : (
              <FlatList
                ref={flatListRef}
                data={displayedMessages}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.message,
                      item.role === "user"
                        ? styles.userMessage
                        : styles.assistantMessage,
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
                )}
                onContentSizeChange={() =>
                  flatListRef.current?.scrollToEnd({ animated: true })
                }
                onLayout={() =>
                  flatListRef.current?.scrollToEnd({ animated: true })
                }
                contentContainerStyle={{
                  paddingBottom: 100,
                  paddingHorizontal: 10,
                }}
              />
            )}

            {loading && (
              <View style={styles.typingContainer}>
                <TypingDots />
              </View>
            )}

            {/* Input Box */}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Type your message..."
                placeholderTextColor="#888"
                style={styles.textInput}
                value={input}
                onChangeText={setInput}
                multiline
              />
              <TouchableOpacity
                onPress={handleSend}
                disabled={loading || !input.trim()}
                style={[
                  styles.sendButton,
                  {
                    backgroundColor:
                      loading || !input.trim() ? "#ccc" : "#004aad",
                  },
                ]}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <MaterialCommunityIcons name="send" size={20} color="#fff" />
                )}
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
  safeArea: { flex: 1, backgroundColor: "#f2f6ff" },
  container: { flex: 1 },
  // Header
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerButton: { padding: 6 },
  headerCenter: { alignItems: "center" },
  headerTitle: { fontSize: 20, fontFamily: "SourceSans3Semibold" },
  headerSubtitle: {
    fontSize: 12,
    color: "#004aad",
    opacity: 0.7,
    fontFamily: "SourceSans3Medium",
  },
  // Messages
  message: {
    marginVertical: 6,
    padding: 12,
    borderRadius: 16,
    maxWidth: "80%",
    elevation: 1,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#e6f1ff",
    borderBottomRightRadius: 4,
  },
  assistantMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
  },
  messageText: { fontSize: 16, color: "#000", fontFamily: "SourceSans3Medium" },
  aiName: { fontSize: 13, marginBottom: 4 },
  // Typing
  typingContainer: {
    paddingLeft: 16,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  // Input
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: "#fff",
    margin: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    maxHeight: 100,
    fontFamily: "SourceSans3Medium",
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },
  // Welcome
  welcomeContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  welcomeHeading: { fontSize: 26, fontFamily: "SourceSans3Semibold" },
  welcomeText: {
    fontSize: 18,
    color: "#444",
    fontFamily: "SourceSans3Medium",
    marginTop: 4,
  },
});

const markdownStyles = {
  body: { fontSize: 16, color: "#000", fontFamily: "SourceSans3Medium" },
  code_inline: {
    backgroundColor: "#f1f3f4",
    paddingHorizontal: 6,
    borderRadius: 6,
    fontFamily: "monospace",
  },
  code_block: {
    backgroundColor: "#f1f3f4",
    borderRadius: 8,
    padding: 10,
    fontFamily: "monospace",
  },
};
