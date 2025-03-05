import { createContext, useContext, useState, ReactNode } from "react";

// Định nghĩa kiểu dữ liệu cho User
interface User {
  email: string;
  token: string;
}
interface Conversation {
  id_conv: string;
  content: string;
}

interface UserContextType {
  user: User | null;
  setUserInfor: (userData: User) => void;
  logout: () => void;
}

// Định nghĩa kiểu dữ liệu cho Chat

interface ChatContextType {
  chatList: Conversation[];
  addChatList: (convesationData: Conversation[]) => void;
}

// Gộp tất cả vào AppContextType
interface AppContextType {
  user: User | null;
  setUserInfor: (userData: User) => void;
  logout: () => void;
  chatList: Conversation[];
  addChatList: (convesationData: Conversation[]) => void;
}

// Tạo AppContext
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider để bọc toàn bộ ứng dụng
export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Quản lý User
  const [user, setUser] = useState<User | null>(null);

  const setUserInfor = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  // Quản lý Chat
  const [chatList, setChatList] = useState<Conversation[]>([]);

  const addChatList = (conversationData: Conversation[]) => {
    setChatList((prevChats) => [...prevChats, ...conversationData]);
  };

  return (
    <AppContext.Provider
      value={{ user, setUserInfor, logout, chatList, addChatList }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Hook để sử dụng AppContext dễ dàng hơn
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
