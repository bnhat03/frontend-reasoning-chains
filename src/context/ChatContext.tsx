import { createContext, useContext, useState, ReactNode } from "react";
import { Chat } from "../types";
import { chats } from "@/data";
interface ChatContextType {
  chatList: Chat[];
  addChat: (title: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chatList, setChatList] = useState<Chat[]>(chats);

  const addChat = (title: string) => {
    const newChatId = String(chatList.length + 1);
    const newChat: Chat = { _id: newChatId, title };
    setChatList((prevChats) => [...prevChats, newChat]);
  };

  return (
    <ChatContext.Provider value={{ chatList, addChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within a ChatProvider");
  return context;
};
