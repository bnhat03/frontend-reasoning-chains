import { createContext, useContext, useState, ReactNode } from "react";
interface User {
  email: string;
  token: string;
  isAuthenticated: boolean;
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
interface ChatContextType {
  chatList: Conversation[];
  addChatList: (convesationData: Conversation[]) => void;
}

interface AppContextType {
  user: User | null;
  setUserInfor: (userData: User) => void;
  logout: () => void;
  chatList: Conversation[];
  addChatList: (convesationData: Conversation[]) => void;
}

// Tạo AppContext
const AppContext = createContext<AppContextType | undefined>(undefined);
const DEFAULT_USER: User = {
  email: "",
  token: "",
  isAuthenticated: false,
};
// Provider để bọc toàn bộ ứng dụng
export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Quản lý User
  const [user, setUser] = useState<User | null>(DEFAULT_USER);

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
    setChatList((prevChats) => [...conversationData]);
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
