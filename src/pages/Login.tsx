import googleIcon from "./../assets/img/google-icon.png";
import codecompleteImg from "./../assets/img/code-complete.jpg";
import { Link } from "react-router-dom";
import { useState } from "react";
import { loginService } from "@/services/apiService";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { getListConversations } from "@/services/apiService";
export function Login() {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let navigate = useNavigate();
  const { setUserInfor, addChatList } = useApp();
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    try {
      const responseLogin = await loginService(email, password);
      const token = responseLogin.data.token;
      setUserInfor({ email, token, isAuthenticated: true });
      localStorage.setItem("token", token);
      const responseConversation = await getListConversations();
      addChatList(responseConversation.data);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="h-screen w-full flex flex-col">
      <div className="px-3 py-2">
        <img src={codecompleteImg} alt="" className="w-50 h-20" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center w-full">
        <h1 className="font-bold text-[32px] uppercase mb-8">Đăng nhập</h1>
        {/* Form */}
        <div className="flex flex-col w-80">
          <div className="relative w-80 mb-6">
            <input
              type="email"
              id="email"
              className="peer w-full border border-gray-300 rounded-md px-3 pt-4 pb-2 text-gray-900 focus:border-[#f5145f] focus:ring-1 focus:ring-[#f5145f] outline-none"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label
              htmlFor="email"
              className="absolute left-3 -top-2 bg-white px-1 text-sm text-[#f5145f] transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-[#f5145f]"
            >
              Email *
            </label>
          </div>

          <div className="relative w-80 mb-6">
            <input
              type="password"
              id="password"
              className="peer w-full border border-gray-300 rounded-md px-3 pt-4 pb-2 text-gray-900 focus:border-[#f5145f] focus:ring-1 focus:ring-[#f5145f] outline-none"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label
              htmlFor="password"
              className="absolute left-3 -top-2 bg-white px-1 text-sm text-[#f5145f] transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-[#f5145f]"
            >
              Mật khẩu *
            </label>
          </div>

          <button
            className="bg-[#f5145f] text-lg text-white py-2 rounded-lg text-center hover:bg-[#f5145f8b]"
            onClick={handleLogin}
          >
            Đăng nhập
          </button>
        </div>
        {/* Navigate sign-up */}
        <div className="flex gap-4 my-6">
          <span>Bạn chưa có tài khoản?</span>
          <Link
            to={"/sign-up"}
            className="text-[#f5145f] hover:text-[#f5145f8b]"
          >
            Đăng ký ngay
          </Link>
        </div>
        <div className="flex items-center w-80 mb-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">Hoặc</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="w-80 flex justify-center gap-6 border border-[#dbdada] py-4 rounded-lg hover:cursor-pointer hover:bg-[#e3e3e3]">
          <span className="text-base">Đăng nhập với</span>
          <button>
            <div className="w-6 h-6">
              <img src={googleIcon} alt="" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
export default Login;
