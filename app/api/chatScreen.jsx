import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Button, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { useGlobalContext } from "../../context/globalProvider";
import { getUserData } from "../../Database/FitnessData";

export default function ChatScreen() {
  const { user } = useGlobalContext();
  const [userData, setUserData] = useState(null); // State to hold user fitness data
  const [messages, setMessages] = useState([]); // chat history
  const [input, setInput] = useState("");       // current text input
  const navigation = useNavigation();           // navigation instance

  // Fetch user data when the component mounts or user changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) { // Only fetch if user is logged in
        try {
          const data = await getUserData(user);
          console.log("User Data in ChatScreen:\n", data);
          console.log("********************************************************************************");
          setUserData(data); // Set the fetched data to state
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Optionally set userData to a default or error state
        }
      }
    };
    fetchUserData();
  }, [user]); // Re-run if user changes

  // Send message to backend
  const sendMessage = async () => {
    if (!input.trim() || !userData) return; // Prevent sending if input is empty OR userData is not loaded

    // Add user message immediately to chat
    const userMessage = { role: "user", parts: [{ text: input }] };
    setMessages((prev) => [...prev, userMessage]);
    setInput(""); // Clear input field

    try {
      // Call backend
      const response = await fetch("http://192.168.1.50:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Construct the messages array correctly for the backend
          // Note: The backend might expect a specific initial system message.
          // This example assumes the backend will handle the system prompt.
          messages: [
            { // This is your system prompt/context
              role: "user", // Or "system", depending on backend interpretation
              parts: [
                {
                  text: `You are an expert fitness coach and certified nutritionist. 
                    Only provide advice related to fitness, exercise, diet, and nutrition. 
                    Do not answer questions on topics outside of this domain. 
                    If a user asks for information outside of your expertise, politely state that you can only help with fitness and nutrition.
                    The user's data is: Weight: ${userData.weight || ''}, Height: ${userData.height || ''}, Gender: ${userData.gender || ''}, Activity Level: ${userData.activityLevel || ''}.`
                }
              ]
            },
            // Add previous conversation messages if any
            ...messages,
            // Add the current user message to the end of the list
            userMessage
          ],
        }),
      });

      if (!response.ok) { // Handle non-2xx responses from the backend
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // The backend should ideally return the reply in the expected format.
      // Assuming data.reply contains the assistant's response.
      const botMessage = { role: "assistant", parts: [{ text: data.reply || "Sorry, I didn't get a response." }] };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Provide a user-friendly error message
      setMessages((prev) => [
        ...prev,
        { role: "assistant", parts: [{ text: "⚠️ Sorry, I couldn't reach the server or process your request." }] },
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
                  color: msg.role === "user" ? "blue" : "green", // Example styling
                  marginBottom: 4,
                }}
              >
                {/* Correctly render text from parts array */}
                {msg.role}: {msg.parts && msg.parts.length > 0 ? msg.parts[0].text : "..."}
              </Text>
            ))}
          </ScrollView>

          {/* Input + Send Button */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <TextInput
              style={{
                flex: 1, // Take up available space
                borderWidth: 1,
                padding: 8,
                marginRight: 8, // Space between input and button
                borderRadius: 4,
              }}
              value={input}
              onChangeText={setInput}
              placeholder="Type a message..."
              editable={!!userData} // Disable input if user data is not loaded
            />
            <Button
              title="Send"
              onPress={sendMessage}
              disabled={!input.trim() || !userData} // Disable button if input is empty or userData not loaded
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}