import { useNavigate } from "react-router-dom";
// import sendIcon from "./../assets/img/send.svg";
import { chatListState } from "../store/atoms";
import { useApp } from "../context/AppContext";
import { chatHistories } from "@/data";
import FormInput from "@/components/FormInput";
import { useState } from "react";
import {
  IStep,
  useChatInteract,
  useChatMessages,
  useChatSession,
} from "@chainlit/react-client";
import { useEffect, useMemo } from "react";
import Markdown from "react-markdown";

// interface Chat {
//   _id: string;
//   title: string;
// }

const DashboardPage = () => {
  const navigate = useNavigate();
  // const { chatList, addChat } = useChat();
  const [question, setQuestion] = useState("");
  const { sendMessage } = useChatInteract();
  const { messages } = useChatMessages();
  const { connect, disconnect } = useChatSession();

  // re-connect socket
  useEffect(() => {
    const reconnectSocket = async () => {
      await disconnect();
      const token = localStorage.getItem("token");
      await connect({
        transports: ["websocket"],
        userEnv: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
    };
    reconnectSocket();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question) return;
    try {
      let firstMessage = {
        role: "user",
        parts: [
          {
            text: question,
          },
        ],
      };
      navigate(`/dashboard/chats/new`, {
        state: { firstMessage },
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="h-screen w-full flex justify-center items-center ">
      <div className="w-1/2 flex flex-col items-center gap-8">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Tôi có thể giúp gì cho bạn?
        </h1>
        {/* Form Section */}
        <div className="w-full bg-white dark:bg-[#63636377] rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.15)] transition-colors duration-1000">
          <FormInput
            question={question}
            setQuestion={setQuestion}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
