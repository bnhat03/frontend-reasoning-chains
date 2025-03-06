import { Link, useLocation } from "react-router-dom";
// import { useChat } from "../context/ChatContext";
import sidebarIcon from "../assets/img/sidebar.svg";
import newChatIcon from "../assets/img/newchat.svg";

interface ChatListProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

// const ChatList: React.FC<ChatListProps> = ({
//   isSidebarOpen,
//   setIsSidebarOpen,
// }) => {
  // const { chatList } = useChat();
  

import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
// import sidebarIcon from "../assets/img/sidebar.svg";
// import newChatIcon from "../assets/img/newchat.svg";

const ChatList: React.FC<ChatListProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const { chatList } = useApp(); // Lấy danh sách chat từ Context API
  const location = useLocation();
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [listConversation, setListConversation] = useState(chatList); // State quản lý danh sách cuộc trò chuyện
  useEffect(() => {
    setListConversation(chatList);
    // console.log("list conversation: >>>>>>>>>>>>>>>", chatList);
  }, [chatList]);
  return (
    <div className="relative">
      <div
        className={`fixed top-0 left-0 h-full bg-[#f9f9f9] dark:bg-[#918f8f2f] shadow-lg p-5 w-[260px] transition-transform duration-1000 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <button
            className="w-6 h-6 dark:invert transition-all duration-1000"
            onClick={() => setIsSidebarOpen(false)}
          >
            <img src={sidebarIcon} alt="Toggle Sidebar" />
          </button>
          <Link to="/dashboard" className="w-8 h-8">
            <img
              className="w-8 h-8 dark:invert transition-all duration-1000"
              src={newChatIcon}
              alt="New Chat"
            />
          </Link>
        </div>

        <span className="font-semibold text-xs mb-2 text-gray-500">
          DASHBOARD
        </span>
        <Link
          to="/dashboard"
          className="block px-3 py-2 rounded-lg hover:bg-[#d1d1d13e] dark:hover:bg-[#63636337] text-sm"
        >
          Cuộc trò chuyện mới
        </Link>
        <hr className="border-none h-[2px] bg-gray-400 opacity-30 rounded my-5" />

        <span className="font-semibold text-xs mb-2 text-gray-500 uppercase">
          Đoạn chat gần đây
        </span>
        <div className="flex flex-col overflow-auto">
          {listConversation.map((chat) => {
            const isActive =
              location.pathname === `/dashboard/chats/${chat.id_conv}`;

            return (
              <Link
                to={`/dashboard/chats/${chat.id_conv}`}
                key={chat.id_conv}
                className={`px-2 py-2 rounded-lg hover:bg-[#d1d1d13e] dark:hover:bg-[#63636337] truncate ${
                  isActive ? "bg-[#d1d1d168] dark:bg-[#61606a77]" : ""
                } text-sm`}
              >
                {chat.content}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatList;
