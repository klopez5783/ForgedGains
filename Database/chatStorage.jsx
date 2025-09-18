import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../fireBaseConfig"; // Make sure this path is correct

/**
 * Loads saved chat messages from Firestore for a given user.
 * @param {string} userId - The unique ID of the user.
 * @returns {Array} An array of messages or an initial greeting.
 */
export const loadChatFromFirestore = async (userId, setMessages, setIsLoading) => {
  if (!userId) {
    setIsLoading(false);
    return [];
  }
  try {
    const chatRef = doc(db, "chats", userId);
    const chatSnap = await getDoc(chatRef);

    if (chatSnap.exists()) {
      setMessages(chatSnap.data().messages);
    } else {
      const greeting = `Hello! I'm your virtual fitness coach and nutritionist...`;
      setMessages([{ role: "model", parts: [{ text: greeting }] }]);
    }
  } catch (e) {
    console.error("Error loading chat from Firestore:", e);
    setMessages([]);
  } finally {
    setIsLoading(false);
  }
};

/**
 * Saves the current chat messages to Firestore for a given user.
 * @param {string} userId - The unique ID of the user.
 * @param {Array} chatMessages - The array of messages to save.
 */
export const saveChatToFirestore = async (userId, chatMessages) => {
  if (!userId || !chatMessages) return;
  try {
    const chatRef = doc(db, "chats", userId);
    await setDoc(chatRef, { messages: chatMessages }, { merge: true });
  } catch (e) {
    console.error("Error saving chat to Firestore:", e);
  }
};