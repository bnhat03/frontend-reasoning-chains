import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";
import NewPrompt from "@/components/NewPrompt";
import { chatHistories } from "@/data";

const ChatPage = () => {
  const path = useLocation().pathname;
  const chatId = path.split("/").pop() || "1";
  const [history, setHistory] = useState(chatHistories[chatId]?.history || []);

  // Cập nhật lịch sử khi chatId thay đổi
  useEffect(() => {
    setHistory(chatHistories[chatId]?.history || []);
  }, [chatId]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [history]);

  // Hàm thêm tin nhắn mới
  const addMessage = (newMessages: any[]) => {
    setHistory((prev) => {
      const updatedHistory = [...prev, ...newMessages];
      chatHistories[chatId].history = updatedHistory; // Cập nhật dữ liệu toàn cục
      return updatedHistory;
    });
  };

  return (
    <div className="flex flex-col items-center h-full relative">
      <div
        className="flex-1 overflow-auto w-full flex justify-center"
        ref={chatContainerRef}
      >
        <div className="w-1/2 flex flex-col gap-5 p-4">
          {/* Hiển thị lịch sử chat */}
          {history.map((message, i) => (
            <div
              key={i}
              className={`p-4 max-w-[80%] rounded-xl ${
                message.role === "user"
                  ? "bg-gray-500 self-end text-white"
                  : "bg-gray-100 self-start text-black dark:bg-[#63636377] dark:text-white"
              }`}
            >
              <Markdown>{message.parts[0].text}</Markdown>
            </div>
          ))}
        </div>
      </div>

      {/* Ô nhập tin nhắn */}
      <NewPrompt addMessage={addMessage} chatData={history} />
    </div>
  );
};

export default ChatPage;
