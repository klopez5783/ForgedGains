import { useState } from "react";
import { Button, ScrollView, Text, TextInput, View } from "react-native";

// Chat screen component
export default function ChatScreen() {
  // State to store chat history (array of messages)
  const [messages, setMessages] = useState([]);

  // State to store the text currently typed in the input box
  const [input, setInput] = useState("");

  // Example fetch call in your Expo app
const sendMessage = async (userMessage) => {
  const response = await fetch("http://192.168.1.50:5000/chat", {
    method: "POST", // Send a POST request
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: userMessage }], // Send user’s message
    }),
  });

  const data = await response.json(); // Parse JSON reply
  return data.reply; // Return reply text from backend
};


  // The UI layout of the chat screen
  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Scrollable area to display all messages */}
      <ScrollView style={{ flex: 1 }}>
        {messages.map((msg, i) => (
          <Text
            key={i}
            // User messages are blue, assistant messages are green
            style={{ color: msg.role === "user" ? "blue" : "green" }}
          >
            {/* Display who sent the message and its content */}
            {msg.role}: {msg.content}
          </Text>
        ))}
      </ScrollView>

      {/* Input box for typing a new message */}
      <TextInput
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
        value={input}                 // value comes from state
        onChangeText={setInput}       // update state whenever user types
        placeholder="Type a message..." // gray hint text when empty
      />

      {/* Button to send the message */}
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}

