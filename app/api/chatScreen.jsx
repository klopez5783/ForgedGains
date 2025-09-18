// A. Imports
// ---------------------------------------------------
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useGlobalContext } from "../../context/globalProvider";
import { loadChatFromFirestore, saveChatToFirestore } from "../../Database/chatStorage";
import { getUserData } from "../../Database/FitnessData";

// B. ChatScreen Component
// ---------------------------------------------------
export default function ChatScreen() {
  // C. State Management
  // ---------------------------------------------------
  const { user } = useGlobalContext();
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Manages loading state for chat history
  const navigation = useNavigation();

  // D. useEffect Hooks (for side effects)
  // ---------------------------------------------------
  // Effect to fetch user data and load chat history when the component mounts
  useEffect(() => {
    const fetchUserDataAndChat = async () => {
      if (user) {
        try {
          const data = await getUserData(user);
          setUserData(data);
          await loadChatFromFirestore(user.uid, setMessages, setIsLoading);
        }  catch (error) {
          console.error("Error fetching user data or chat:", error);
          const greeting = `Hello! I'm your virtual fitness coach and nutritionist...`;
          setMessages([{ role: "model", parts: [{ text: greeting }] }]);
        } finally {
          setIsLoading(false); // Hide the loading indicator
        }
      }
    };
    fetchUserDataAndChat();
  }, [user]);

  // E. sendMessage Function
  // ---------------------------------------------------
  const sendMessage = async () => {
    if (!input.trim() || !userData) return;

    // Add user's message to the state immediately for quick UI update
    const userMessage = { role: "user", parts: [{ text: input }] };
    const fullConversation = [...messages, userMessage];
    setMessages(fullConversation);
    setInput("");

    let attempt = 0;
    const maxAttempts = 3;

    while (attempt < maxAttempts) {
      try {
        const response = await fetch("http://192.168.1.50:5000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: fullConversation,
            userData: userData,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Add the bot's reply to the state after a successful response
        const botMessage = {
          role: "model",
          parts: [{ text: data.reply || "Sorry, I didn't get a response." }],
        };
        const updatedConversation = [...fullConversation, botMessage];

        setMessages(updatedConversation);

        await saveChatToFirestore(user.uid, updatedConversation);
        return; // Exit the function on success
      } catch (error) {
        console.error("Error sending message:", error);
        // Add a temporary error message to the UI
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            parts: [
              {
                text: "⚠️ Sorry, I couldn't reach the server or process your request.",
              },
            ],
          },
        ]);
      }

      attempt++;
      if (attempt >= maxAttempts) {
        // Handle max attempts failure
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            parts: [
              {
                text: "⚠️ Unable to get a response after multiple attempts. Please try again later.",
              },
            ],
          },
        ]);
        return;
      }

      // Exponential backoff for retries
      const delayTime = Math.pow(2, attempt) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delayTime));
    }
  };

  // F. JSX Rendering (No changes needed here)
  // ---------------------------------------------------
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1, padding: 16 }}>
          <Button title="Exit Chat" onPress={() => navigation.goBack()} />

          {/* Conditional rendering based on loading state */}
          {isLoading ? (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              Loading chat history...
            </Text>
          ) : (
            <ScrollView
              style={{ flex: 1, marginBottom: 15 }}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {messages.map((msg, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    marginBottom: 8,
                    justifyContent:
                      msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <View
                    style={{
                      maxWidth: "80%",
                      padding: 10,
                      borderRadius: 15,
                      backgroundColor:
                        msg.role === "user" ? "#007AFF" : "#E5E5EA",
                    }}
                  >
                    <Text style={{ color: msg.role === "user" ? "white" : "black" }}>
                      {msg.parts && msg.parts.length > 0
                        ? msg.parts[0].text
                        : "..."}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Chat input and send button */}
          <View
            style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
          >
            <TextInput
              style={{
                flex: 1,
                borderWidth: 1,
                padding: 10,
                marginRight: 8,
                borderRadius: 9,
                textAlignVertical: "top",
                minHeight: 30,
              }}
              value={input}
              onChangeText={setInput}
              placeholder="Type a message..."
              editable={!!userData}
              multiline={true}
              numberOfLines={1}
            />
            <Button
              title="Send"
              onPress={sendMessage}
              disabled={!input.trim() || !userData}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}