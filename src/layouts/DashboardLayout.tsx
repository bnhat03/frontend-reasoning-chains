import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ChatList from "../components/ChatList";
import Header from "@/components/Header";

const DashboardLayout = () => {
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (isLoaded && !userId) {
  //     navigate("/sign-in");
  //   }
  // }, [isLoaded, userId, navigate]);

  // if (!isLoaded) return "Loading...";

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="w-1/6">
        <ChatList />
      </div>
      <div className="flex-1 flex flex-col">
        <div>
          <Header />
        </div>
        <Outlet /> {/* Thay đổi theo route con */}
      </div>
    </div>
  );
};

export default DashboardLayout;
