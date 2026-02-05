import { GET_CHAT_LLM_RESPONSE } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/services/api";
import { useState } from "react";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export function useChatLLM(userContext: { name: string; email: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const newMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, newMessage]);

    try {
      setLoading(true);
      const token = await getToken();
      const res = await apiFetch(GET_CHAT_LLM_RESPONSE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          userContext,
          userQuery: text,
          history: [...messages, newMessage], // include history
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const reply: Message = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, reply]);
    } catch (error) {
      console.error("Error fetching reply:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };


  const refresh = () => {
    setMessages([])
  }

  return { messages, sendMessage, loading, refresh };
}
