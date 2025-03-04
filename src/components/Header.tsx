import React, { useState, useEffect } from "react";
import codecompleteImgLight from "./../assets/img/code-complete.jpg";
import codecompleteImgDark from "./../assets/img/code-complete-dark.jpg";
import googleIcon from "./../assets/img/google-icon.png";
import moonIcon from "./../assets/img/moon.svg";
import sunIcon from "./../assets/img/sun.svg";
import logoutIcon from "./../assets/img/logout.svg";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <div className="w-full flex justify-between items-center pl-5 pr-10 mx-3 relative bg-white dark:bg-black transition-colors">
      {/* Logo */}
      <div className="w-22 h-20">
        <img
          src={isDark ? codecompleteImgDark : codecompleteImgLight}
          alt="Code Complete"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Icons */}
      <div className="flex gap-5 items-center">
        {/* Toggle Light/Dark Mode */}
        <div
          className="w-6 h-6 cursor-pointer transition-all"
          onClick={() => setIsDark(!isDark)}
        >
          <img
            src={isDark ? moonIcon : sunIcon}
            alt="theme-icon"
            className="w-full h-full"
          />
        </div>

        {/* Google Avatar */}
        <div
          className="relative w-8 h-8 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <img src={googleIcon} alt="Google" className="w-full h-full" />

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-55 bg-white dark:bg-gray-800 shadow-lg rounded-md text-gray-700 dark:text-gray-200 flex flex-col justify-center items-center border border-[#e3e3e3] dark:border-gray-700">
              <div className="flex flex-col items-center p-3">
                <img className="w-12 h-12" src={googleIcon} alt="" />
                <span className="text-sm mt-2">nguyenvana@gmail.com</span>
              </div>
              <div className="flex gap-3 justify-center items-center p-3 border-t border-[#e3e3e3] dark:border-gray-700">
                <img
                  className="opacity-70 filter invert-0 dark:invert"
                  src={logoutIcon}
                  alt=""
                />
                <button className="dark:hover:text-red-400">Đăng xuất</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
