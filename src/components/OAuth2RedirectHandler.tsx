import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getListConversations, getMe } from "@/services/apiService";
import { useApp } from "@/context/AppContext";
const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserInfor, addChatList } = useApp();
  const setUserContext = async (token: string) => {
    let responseUser = await getMe();
    const user = responseUser.data;
    setUserInfor({ email: user.email, token, isAuthenticated: true });
    const responseConversation = await getListConversations();
    addChatList(responseConversation.data.reverse());
    navigate("/dashboard");
  };
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      try {
        localStorage.setItem("token", token);
        setUserContext(token);
      } catch (error) {
        console.error("Failed to save token:", error);
      }
    } else {
      console.warn("No token found in URL.");
      navigate("/login");
    }
  }, [location.search, navigate]);
  return <div>Redirecting...</div>;
};

export default OAuth2RedirectHandler;
