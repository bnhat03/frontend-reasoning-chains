import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ChatList from "../components/ChatList";
import Header from "@/components/Header";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="w-1/6">
        <ChatList />
      </div>
      <div className="flex-1 flex flex-col">
        <div>
          <Header />
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
