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

function App() {
  const user = useRecoilValue(userState);
  const { connect } = useChatSession();

  useEffect(() => {
    if (!user) return;
    connect({ userEnv: { email: user.email } }); // websocket connection
  }, [user, connect]);

  return (
      <Routes>
        {/* <Route path="/" element={user ? <Dashboard /> : <Login />} /> */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="chats/:id" element={<ChatPage />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        <Route path="/" element={<Playground />} />
      </Routes>
  );
}

export default App;
