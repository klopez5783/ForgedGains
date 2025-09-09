import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Button, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { useGlobalContext } from "../../context/globalProvider";
import { getUserData } from "../../Database/FitnessData";

export default function ChatScreen() {
  const { user } = useGlobalContext();
  const [userData, setUserData] = useState(null); 
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const navigation = useNavigation();

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const data = await getUserData(user);
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, [user]);

  // Send the initial greeting message automatically
  useEffect(() => {
    if (userData && messages.length === 0) {
      const systemPrompt = `Hello! I'm your virtual fitness coach and nutritionist. 
      \n\nBased on the data you provided, I can see your weight is ${userData?.weight || 'N/A'}, your height is ${userData?.height || 'N/A'}, your gender is ${userData?.gender || 'N/A'}, and your activity level is ${userData?.activityLevel || 'N/A'}. 
      \n\nI'm here to provide personalized guidance to help you reach your goals. How can I assist you today?`;
      
      // Use 'model' for the AI's initial greeting
      const initialMessage = { 
        role: "model", 
        parts: [{ text: systemPrompt }] 
      };
      setMessages([initialMessage]);
    }
  }, [userData, messages]);

  // Send message to backend
  const sendMessage = async () => {
    if (!input.trim() || !userData) return;

    // Use 'user' for the user's message
    const userMessage = { role: "user", parts: [{ text: input }] };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("http://192.168.1.50:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Ensure the messages array sent to the backend has consistent roles ('user', 'model')
          // The system prompt is often sent as the first 'user' message or a separate 'system' message.
          // Here, we're sending it as part of the initial messages.
          messages: [
            // If you had a separate system instruction that needs to always be first,
            // you might send it like this:
            // { role: "system", parts: [{ text: "Your system instructions here." }] },
            // ...followed by the conversation history.
            // For Gemini's generateContent, it often expects a history of {role: 'user', parts: [...]}, {role: 'model', parts: [...]}, etc.
            // The initial greeting is sent as 'model' role to start the conversation.
            ...messages, // Previous conversation history
            userMessage // The current user input
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Ensure the received role from backend is consistent, e.g., 'model'
      const botMessage = { role: "model", parts: [{ text: data.reply || "Sorry, I didn't get a response." }] };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { role: "model", parts: [{ text: "⚠️ Sorry, I couldn't reach the server or process your request." }] },
      ]);
    }
  };

  // --- JSX Rendering ---
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0} // Adjust as needed
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1, padding: 16 }}>
          <Button title="Exit Chat" onPress={() => navigation.goBack()} />

          <ScrollView style={{ flex: 1, marginBottom: 8 }}>
            {messages.map((msg, i) => (
              <View
                key={i}
                style={{
                  flexDirection: 'row',
                  marginBottom: 8,
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', // Align user right, model left
                }}
              >
                <View
                  style={{
                    maxWidth: '80%',
                    padding: 10,
                    borderRadius: 15,
                    backgroundColor: msg.role === 'user' ? '#007AFF' : '#E5E5EA', // User blue, Model gray
                  }}
                >
                  <Text style={{ color: msg.role === 'user' ? 'white' : 'black' }}>
                    {msg.parts && msg.parts.length > 0 ? msg.parts[0].text : '...'}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <TextInput
              style={{
                flex: 1,
                borderWidth: 1,
                padding: 8,
                marginRight: 8,
                borderRadius: 4,
              }}
              value={input}
              onChangeText={setInput}
              placeholder="Type a message..."
              editable={!!userData}
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