import { useRecoilState, useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import { chatListState } from "../store/atoms";
import { useApp } from "../context/AppContext";
import { chatHistories } from "@/data";
import sendIcon from "./../assets/img/send.svg";
import { sessionState, useChatSession } from "@chainlit/react-client";
import { useEffect } from "react";

interface Chat {
  _id: string;
  title: string;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const { chatList, addChat } = useApp();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = (e.target as HTMLFormElement).text.value.trim();
    if (!text) return;

    // Tạo ID chat mới
    const newChatId = String(chatList.length + 1);
    const newChat: Chat = { _id: newChatId, title: `Chat ${newChatId}` };

    // Cập nhật trạng thái danh sách chat
    addChat(text);
    chatHistories[newChatId] = {
      _id: newChatId,
      history: [{ role: "user", parts: [{ type: "text", text }] }],
    };
    // Điều hướng đến cuộc trò chuyện mới
    navigate(`/dashboard/chats/${newChatId}`);
  };

  return (
    <div className="h-screen w-full flex justify-center items-center">
      {/* Text Section */}
      <div className="w-1/2 flex flex-col items-center gap-8">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Tôi có thể giúp gì cho bạn?
        </h1>
        {/* Form Section */}
        <div className="w-full bg-white dark:bg-[#636363] rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.15)]">
          <form
            onSubmit={handleSubmit}
            className="flex items-center justify-between gap-5"
          >
            <input
              type="text"
              name="text"
              placeholder="Hỏi bất cứ điều gì..."
              className="flex-1 p-2 bg-transparent border-none outline-none text-black placeholder-gray-400 dark:text-white dark:placeholder-gray-300"
            />
            <button className="bg-[#f5145f] rounded-full p-3 flex items-center justify-center">
              <img
                src={sendIcon}
                alt="send"
                className="w-4 h-4 text-blue-700"
              />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
