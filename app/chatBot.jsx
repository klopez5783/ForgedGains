import { FlatList, Text, TextInput, View } from 'react-native';

const ChatBot = () => {
  return (
    <View className="flex-1 bg-white mb-10">
      <FlatList
        data={[{ id: '1', text: 'Hello 👋 I’m your assistant!' }]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text className="p-4 text-black">{item.text}</Text>
        )}
      />

      <View className="flex-row items-center border-t border-gray-300 p-2">
        <TextInput
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg text-black"
        />
      </View>
    </View>
  );
};

export default ChatBot;
