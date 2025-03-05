import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import sidebarIcon from "../assets/img/sidebar.svg";
import newChatIcon from "../assets/img/newchat.svg";

const ChatList = () => {
  const { chatList } = useApp(); // Lấy danh sách chat từ Context API
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State quản lý sidebar
  const [listConversation, setListConversation] = useState(chatList); // State quản lý danh sách cuộc trò chuyện
  useEffect(() => {
    setListConversation(chatList);
    // console.log("list conversation: >>>>>>>>>>>>>>>", chatList);
  }, [chatList]);
  return (
    <div className={`relative`}>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-[#f9f9f9] dark:bg-[#918f8f2f] shadow-[3px_0_8px_rgba(0,0,0,0.1)] dark:shadow-[3px_0_8px_rgba(255,255,255,0.2)] p-4 w-[260px] transition-all duration-500 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Icon đóng mở Sidebar */}
        <div className="flex justify-between items-center mb-6">
          <button
            className="w-6 h-6 opacity-70 filter invert-0 dark:invert"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <img src={sidebarIcon} alt="Toggle Sidebar" />
          </button>
          <Link to="/dashboard" className="w-8 h-8 cursor-pointer">
            <img
              className="opacity-90 filter invert-0 dark:invert"
              src={newChatIcon}
              alt="New Chat"
            />
          </Link>
        </div>

        {/* Nội dung Sidebar */}
        <span className="font-semibold text-xs mb-2 text-gray-400">
          DASHBOARD
        </span>
        <Link
          to="/dashboard"
          className="block px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-[#6363637e] transition text-sm"
        >
          Tạo cuộc trò chuyện mới
        </Link>
        <hr className="border-none h-[2px] bg-gray-300 opacity-30 rounded my-5" />

        <span className="font-semibold text-xs mb-2 text-gray-400 uppercase">
          Đoạn chat gần đây
        </span>

        <div className="flex flex-col overflow-auto">
          {listConversation?.map((chat) => (
            <Link
              to={`/dashboard/chats/${chat.id_conv}`}
              key={chat.id_conv}
              className="px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-[#6363637e] transition text-sm"
            >
              {chat.content}
            </Link>
          ))}
        </div>
      </div>

      {/* Nút mở sidebar khi đang ẩn */}
      {!isSidebarOpen && (
        <button
          className="fixed top-3 left-3 p-2 filter invert dark:invert-0"
          onClick={() => setIsSidebarOpen(true)}
        >
          <img
            src={sidebarIcon}
            alt="Open Sidebar"
            className="w-6 h-6 invert"
          />
        </button>
      )}
    </div>
  );
};

export default ChatList;
