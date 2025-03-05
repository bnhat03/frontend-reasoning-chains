import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { chatListState } from "../store/atoms";
import { useChat } from "../context/ChatContext";
import { chatHistories } from "@/data";
import FormInput from "@/components/FormInput";
import { useState } from "react";

interface Chat {
  _id: string;
  title: string;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const { chatList, addChat } = useChat();
  const [question, setQuestion] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question) return;

    const newChatId = String(chatList.length + 1);
    const newChat: Chat = { _id: newChatId, title: `Chat ${newChatId}` };

    addChat(question);
    chatHistories[newChatId] = {
      _id: newChatId,
      history: [{ role: "user", parts: [{ type: "text", text: question }] }],
    };
    navigate(`/dashboard/chats/${newChatId}`);
  };

  return (
    <div className="h-screen w-full flex justify-center items-center ">
      <div className="w-1/2 flex flex-col items-center gap-8">
        <h1 className="text-3xl font-bold text-black dark:text-white ">
          Tôi có thể giúp gì cho bạn?
        </h1>
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
