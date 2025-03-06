import { useNavigate } from "react-router-dom";
import sendIcon from "./../assets/img/send.svg";
import {
  IStep,
  useChatInteract,
  useChatMessages,
  useChatSession,
} from "@chainlit/react-client";
import { useEffect } from "react";

const DashboardPage = () => {
  const navigate = useNavigate();
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
    const text = (e.target as HTMLFormElement).text.value.trim();
    if (!text) return;
    try {
      let firstMessage = {
        role: "user",
        parts: [
          {
            text: text,
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
    <div className="h-screen w-full flex justify-center items-center">
      {/* Text Section */}
      <div className="w-1/2 flex flex-col items-center gap-8">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Tôi có thể giúp gì cho bạn?
        </h1>
        {/* Form Section */}
        <div
          className={`w-full bg-white dark:bg-[#636363] rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.15)] transition-all`}
        >
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
