import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import sendIcon from "./../assets/img/send.svg";

const NewPrompt = ({
  addMessage,
  chatData,
}: {
  addMessage: (messages: string) => void;
  chatData: any;
}) => {
  const [question, setQuestion] = useState("");
  const endChatRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    endChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatData]);

  const add = async (text: string, isInitial: boolean) => {
    // if (isInitial) {
    //   addMessage(text);
    //   return;
    // }

    // try {
    //   addMessage(text);
    // } catch (err) {
    //   console.error(err);
    // }
    addMessage(text);
  };

  useEffect(() => {
    if (chatData.length === 1 && chatData[0].role === "user") {
      add(chatData[0].parts[0].text, true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question.trim()) return;
    add(question, false);
    setQuestion("");
  };

  return (
    <>
      {/* Đảm bảo khoảng cách hiển thị đúng */}
      <div className="pb-40" ref={endChatRef}></div>

      {/* Form nhập tin nhắn */}
      <form
        className="w-1/2 flex mb-5 fixed bottom-0 bg-white dark:bg-[#636363] rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.15)]"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="text"
          placeholder="Hỏi bất cứ điều gì..."
          className="flex-1 p-2 bg-transparent border-none outline-none text-black placeholder-gray-400 dark:text-white dark:placeholder-gray-300"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button className="bg-[#f5145f] rounded-full p-3 flex items-center justify-center">
          <img src={sendIcon} alt="send" className="w-4 h-4 text-blue-700" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
