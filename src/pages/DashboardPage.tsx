import { useRecoilState, useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import { chatListState } from "../store/atoms";
import { useApp } from "../context/AppContext";
import { chatHistories } from "@/data";
import sendIcon from "./../assets/img/send.svg";
import {
  IStep,
  sessionState,
  useChatInteract,
  useChatMessages,
  useChatSession,
} from "@chainlit/react-client";
import { useEffect, useMemo } from "react";
import Markdown from "react-markdown";

interface Chat {
  _id: string;
  title: string;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const { sendMessage } = useChatInteract();
  const { messages } = useChatMessages();
  const { connect, disconnect } = useChatSession();
  // const { user } = useApp();

  function flattenMessages( // Xử lý tin nhắn dạng cây
    messages: IStep[], // nested messages
    condition: (node: IStep) => boolean
  ): IStep[] {
    return messages.reduce((acc: IStep[], node) => {
      if (condition(node)) {
        // Nếu tin nhắn thỏa mãn condition, nó sẽ được thêm vào mảng kết quả.
        acc.push(node);
      }

      if (node.steps?.length) {
        // Nếu tin nhắn có bước con (steps) => iếp tục đệ quy để thêm các tin nhắn con vào danh sách.
        acc.push(...flattenMessages(node.steps, condition));
      }

      return acc;
    }, []);
  }

  const flatMessages = useMemo(() => {
    const result = flattenMessages(messages, (m) => m.type.includes("message"));
    console.log("📌 Tổng số tin nhắn:", result.length);
    return result;
  }, [messages]);

  useEffect(() => {
    const reconnectSocket = async () => {
      console.log("🔌 Đang ngắt kết nối socket...");
      await disconnect();
      console.log("✅ Đã ngắt kết nối socket.");

      console.log("🔗 Đang kết nối lại socket...");
      const token = localStorage.getItem("token");
      await connect({
        transports: ["websocket"],
        userEnv: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      console.log("✅ Đã kết nối lại socket.");
    };

    reconnectSocket(); // Gọi hàm async bên trong useEffect
  }, []); // Chạy 1 lần khi component mount

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = (e.target as HTMLFormElement).text.value.trim();
    if (!text) return;

    try {
      const tempMessage: IStep = {
        id: crypto.randomUUID(),
        name: "user",
        type: "user_message",
        output: text,
        createdAt: new Date().toISOString(),
      };

      console.log("📤 Đang gửi tin nhắn đến BE:", tempMessage);
      await sendMessage(tempMessage);
      console.log("✅ Tin nhắn đã gửi thành công!");
      console.log("Danh sách tin nhắn:", messages);
    } catch (error) {
      console.error("🚨 Lỗi khi gửi tin nhắn:", error);
    }
  };
  const renderMessage = (message: IStep) => {
    // Mỗi tin nhắn ở UI (name, content, createdAt)
    const dateOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };
    const date = new Date(message.createdAt).toLocaleTimeString(
      undefined,
      dateOptions
    );
    return (
      <div
        key={message.id}
        className="flex items-start space-x-2 max-h-[200px] overflow-auto"
      >
        <div className="w-20 text-sm text-green-500">{message.name}</div>
        <div className="flex-1 border rounded-lg p-2">
          <Markdown>{message.output}</Markdown>
          {/* <p className="text-black dark:text-white">{message.output}</p> */}
          <small className="text-xs text-gray-500">{date}</small>
        </div>
      </div>
    );
  };
  return (
    <div className="h-screen w-full flex justify-center items-center">
      {/* Text Section */}
      <div className="w-1/2 flex flex-col items-center gap-8">
        <div className="space-y-4">
          {flatMessages.map((message) => {
            // console.log("message", message); // Log tin nhắn trước
            return renderMessage(message); // Trả về UI hợp lệ
          })}
        </div>

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
