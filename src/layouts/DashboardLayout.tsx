import { Outlet } from "react-router-dom";
import { useState } from "react";
import ChatList from "../components/ChatList";
import Header from "../components/Header";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div
        className={`transition-all duration-1000 ${
          isSidebarOpen ? "w-[250px]" : "w-[0px]"
        }`}
      >
        <ChatList
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
      <div
        className={`relative flex-1 flex flex-col transition-all ${
          isSidebarOpen ? "w-[calc(100%-250px)]" : "ml-0"
        }`}
      >
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
