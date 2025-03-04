import { createContext, useContext, useState, ReactNode } from "react";
import { Chat } from "../types";
import { chats } from "@/data";
// Định nghĩa kiểu dữ liệu cho context
interface ChatContextType {
  chatList: Chat[];
  addChat: (title: string) => void;
}

// Khởi tạo Context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider bọc toàn bộ ứng dụng
export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chatList, setChatList] = useState<Chat[]>(chats);

  // Hàm thêm chat mới
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

// Hook để sử dụng context dễ dàng hơn
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within a ChatProvider");
  return context;
};
