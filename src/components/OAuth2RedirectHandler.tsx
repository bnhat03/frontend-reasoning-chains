import { IUser } from "@chainlit/react-client";
import { userState } from "./../state";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSetRecoilState, useRecoilValue } from "recoil";

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useSetRecoilState(userState);
  const user = useRecoilValue(userState);
  const [isUserSet, setIsUserSet] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      try {
        localStorage.setItem("token", token);
        alert("Đăng nhập thành công!");

        let data: IUser = {
          id: "1",
          name: "Nguyễn Văn A",
          email: "biennhat2k3b@gmail.com",
          picture: "hehe",
        };

        setUser(data);
        setIsUserSet(true); // ✅ Đánh dấu là đã cập nhật user
      } catch (error) {
        console.error("Failed to save token:", error);
      }
    } else {
      console.warn("No token found in URL.");
      navigate("/login");
    }
  }, [location.search, navigate, setUser]);

  // 👉 Theo dõi khi `userState` cập nhật, rồi mới điều hướng
  useEffect(() => {
    if (isUserSet && user) {
      navigate("/");
    }
  }, [user, isUserSet, navigate]);

  return <div>Redirecting...</div>;
};

export default OAuth2RedirectHandler;
