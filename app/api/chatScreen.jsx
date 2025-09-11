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
  // Front-end code (in your ChatScreen.js)

useEffect(() => {
  // Only send the greeting once the user data is loaded and the messages array is empty
  if (userData && messages.length === 0) {
    const greeting = `Hello! I'm your virtual fitness coach and nutritionist. I'm here to provide personalized guidance to help you reach your goals. How can I assist you today?`;
    
    // The initial message is a bot response, so its role should be 'model'
    const initialMessage = { 
      role: "model", 
      parts: [{ text: greeting }] 
    };
    setMessages([initialMessage]);
  }
}, [userData, messages]);

  // Send message to backend
  const sendMessage = async () => {
    if (!input.trim() || !userData) return;

    // ✅ Correctly define and add the user's message to the state
    const userMessage = { role: "user", parts: [{ text: input }] };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
        const response = await fetch("http://192.168.1.50:5000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            userData: userData,
          }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // ✅ The bot's message is created here, after the response is received
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

          <ScrollView style={{ flex: 1, marginBottom: 15 }} contentContainerStyle={{ paddingBottom: 20 }}>
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
                padding: 10,
                marginRight: 8,
                borderRadius: 9,
                textAlignVertical: 'top', // Aligns the text to the top for multiline
                minHeight: 30, // Ensures a minimum height
              }}
              value={input}
              onChangeText={setInput}
              placeholder="Type a message..."
              editable={!!userData}
              multiline={true}
              numberOfLines={1} // Start with one line, expand as needed
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