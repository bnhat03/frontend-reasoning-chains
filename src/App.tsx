import { useEffect } from "react";
import { sessionState, useChatSession } from "@chainlit/react-client";
import { useRecoilValue } from "recoil";
import DashboardPage from "./pages/DashboardPage";
import Login from "./pages/Login";
import { Route, Routes, Navigate, Outlet, useLocation } from "react-router-dom";
import SignUp from "@/pages/SignUp";
import DashboardLayout from "@/layouts/DashboardLayout";
import ChatPage from "@/pages/ChatPage";
import { useApp } from "./context/AppContext";
import OAuth2RedirectHandler from "@/components/OAuth2RedirectHandler";
import { getListConversations, getMe } from "@/services/apiService";
import { useNavigate } from "react-router-dom";
function App() {
  const { user, setUserInfor, addChatList, setModelsList } = useApp();
  const { connect } = useChatSession();
  const session = useRecoilValue(sessionState);
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const getUserAccount = async (token: string) => {
    let responseUser = await getMe();
    const user = responseUser.data;
    setUserInfor({ email: user.email, token, isAuthenticated: true });
    const responseConversation = await getListConversations();
    addChatList(responseConversation.data.reverse());
    navigate(`${path}`);
  };
  useEffect(() => {
    setModelsList([
      { id: "1", name: "GPT-4" },
      { id: "2", name: "GPT-3.5" },
      { id: "both", name: "Cả 2" },
    ]);
    const token = localStorage.getItem("token");
    if (token) {
      getUserAccount(token);
    } else {
      navigate("/login");
    }
  }, []);
  useEffect(() => {
    if (session?.socket.connected) return;
    if (user?.isAuthenticated) {
      const token = localStorage.getItem("token");
      connect({
        transports: ["websocket"],
        userEnv: {
          Authorization: `Bearer ${token}`,
          user_email: user.email,
        },
        withCredentials: true,
      });
    }
  }, [connect, user]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          user?.isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />
        }
      />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="chats/:id" element={<ChatPage />} />
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
    </Routes>
  );
}

// Protected Route Component
const ProtectedRoute = () => {
  const { user } = useApp();
  return user?.isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default App;
