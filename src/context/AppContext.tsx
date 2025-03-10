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

interface Model {
  id: string;
  name: string;
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
  // User State
  user: User | null;
  setUserInfor: (userData: User) => void;
  // Chat State
  chatList: Conversation[];
  addChatList: (conversationData: Conversation[]) => void;
  prevMessagesLength: number;
  setPrevMessagesLength: (length: number) => void;
  // Models State
  modelsList: Model[];
  setModelsList: (models: Model[]) => void;
}
const AppContext = createContext<AppContextType | undefined>(undefined);
const DEFAULT_USER: User = {
  email: "",
  token: "",
  isAuthenticated: false,
};
export const AppProvider = ({ children }: { children: ReactNode }) => {
  // User
  const [user, setUser] = useState<User | null>(DEFAULT_USER);
  const setUserInfor = (userData: User) => {
    setUser(userData);
  };

  //Chat
  const [chatList, setChatList] = useState<Conversation[]>([]);
  const addChatList = (conversationData: Conversation[]) => {
    setChatList((prevChats) => [...conversationData]);
  };
  const [prevMessagesLength, setPrevMessagesLength] = useState<number>(0);
  const [modelsList, setModelsList] = useState<Model[]>([]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUserInfor,
        chatList,
        addChatList,
        prevMessagesLength,
        setPrevMessagesLength,
        modelsList,
        setModelsList,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
