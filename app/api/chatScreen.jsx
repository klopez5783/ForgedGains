import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Button, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { useGlobalContext } from "../../context/globalProvider";
import { getUserData } from "../../Database/FitnessData";


export default function ChatScreen() {
  const { user } = useGlobalContext();
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]); // chat history
  const [input, setInput] = useState("");       // current text
  const navigation = useNavigation();           // navigation instance

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserData(user);
      console.log("User Data in ChatScreen:", data);
      setUserData(data);
    };
    fetchUserData();
  }, [user]);

  // Send message to backend
  const sendMessage = async () => {
  if (!input.trim()) return;

  // Add user message immediately to chat
  const userMessage = { role: "user", parts: [{ text: input }] };
  setMessages((prev) => [...prev, userMessage]);
  setInput("");

  try {
    // Call backend
    const response = await fetch("http://192.168.1.50:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            parts: [
              {
                text: `You are an expert fitness coach and certified nutritionist. 
                    Only provide advice related to fitness, exercise, diet, and nutrition. 
                    Do not answer questions on topics outside of this domain. 
                    If a user asks for information outside of your expertise, politely state that you can only help with fitness and nutrition.
                    The user's data is: Weight: ${data.weight}, Height: ${data.height}, Gender: ${data.gender}, Activity Level: ${data.activityLevel}.`
              }
            ]
          },
          ...messages,
          userMessage
        ],
      }),
    });

    const data = await response.json();
    const botMessage = { role: "assistant", parts: [{ text: data.reply }] };
    setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    console.error("Error sending message:", error);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "⚠️ Sorry, I couldn’t reach the server." },
    ]);
  }
};

  return (
    <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={10}
          style={{ flex: 1 }}
        >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={{ flex: 1, padding: 16 }}>
              <Button title="Exit Chat" onPress={() => navigation.goBack()} />
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
                  {/* ⚠️ Change msg.content to msg.parts[0].text */}
                  {msg.role}: {msg.parts[0].text} 
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
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    
  );
}
