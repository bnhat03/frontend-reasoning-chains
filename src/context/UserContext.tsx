import { createContext, useContext, useState, ReactNode } from "react";

// Định nghĩa kiểu dữ liệu cho User
interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

// Tạo Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider để bọc toàn bộ ứng dụng
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Hàm đăng nhập
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("token", userData.token); // Lưu token vào localStorage
  };

  // Hàm đăng xuất
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token"); // Xóa token khi logout
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook để sử dụng UserContext dễ dàng hơn
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
