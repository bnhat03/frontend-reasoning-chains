import { useEffect } from "react";
import { sessionState, useChatSession } from "@chainlit/react-client";
import { useRecoilValue } from "recoil";
import { userState } from "./state";
import DashboardPage from "./pages/DashboardPage";
import Login from "./pages/Login";
import { Route, Routes } from "react-router-dom";
import OAuth2RedirectHandler from "./components/OAuth2RedirectHandler";
import { Playground } from "@/components/playground";
import SignUp from "@/pages/SignUp";
import DashboardLayout from "@/layouts/DashboardLayout";
import ChatPage from "@/pages/ChatPage";
import { useApp } from "@/context/AppContext";
function App() {
  const { user } = useApp();
  const { connect } = useChatSession();
  const session = useRecoilValue(sessionState);
  useEffect(() => {
    if (session?.socket.connected) {
      return;
    }
    if (user) {
      console.log("🆔 Sending user info:", user);
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
      {/* <Route path="/" element={user ? <Dashboard /> : <Login />} /> */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="chats/:id" element={<ChatPage />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/auth/google/callback" element={<OAuth2RedirectHandler />} />
      <Route path="/playground" element={<Playground />} />
    </Routes>
  );
}

export default App;
