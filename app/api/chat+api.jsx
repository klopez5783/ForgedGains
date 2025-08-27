import { useState } from "react";
import { Button, ScrollView, Text, TextInput, View } from "react-native";

export default function ChatScreen() {
  const [messages, setMessages] = useState([]); // chat history
  const [input, setInput] = useState("");       // current text

  // Send message to backend
  const sendMessage = async () => {
    if (!input.trim()) return; // don't send empty

    // Add user message immediately to chat
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    // Clear input field
    setInput("");

    try {
      // Call backend
      const response = await fetch("http://192.168.1.50:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: userMessage.content }],
        }),
      });

      const data = await response.json();

      // Add assistant reply
      const botMessage = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      // fallback message if server fails
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Sorry, I couldn’t reach the server." },
      ]);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Chat messages */}
      <ScrollView style={{ flex: 1, marginBottom: 8 }}>
        {messages.map((msg, i) => (
          <Text
            key={i}
            style={{
              color: msg.role === "user" ? "blue" : "green",
              marginBottom: 4,
            }}
          >
            {msg.role}: {msg.content}
          </Text>
        ))}
      </ScrollView>

      {/* Input + Send */}
      <TextInput
        style={{
          borderWidth: 1,
          padding: 8,
          marginBottom: 8,
          borderRadius: 4,
        }}
        value={input}
        onChangeText={setInput}
        placeholder="Type a message..."
      />

      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}
