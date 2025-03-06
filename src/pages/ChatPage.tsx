import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";
import { CopyBlock, dracula } from "react-code-blocks";
import NewPrompt from "@/components/NewPrompt";
import { chatHistories } from "@/data";

interface Message {
  role: string;
  parts: { type: string; text: string }[];
}

const ChatPage = () => {
  const path = useLocation().pathname;
  const chatId = path.split("/").pop() || "1";
  const [history, setHistory] = useState(chatHistories[chatId]?.history || []);

  useEffect(() => {
    setHistory(chatHistories[chatId]?.history || []);
  }, [chatId]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [history]);

  const addMessage = (newMessages: Message[]) => {
    setHistory((prev) => {
      const updatedHistory = [...prev, ...newMessages];
      chatHistories[chatId].history = updatedHistory;
      return updatedHistory;
    });
  };

  return (
    <div className="flex flex-col items-center h-full w-full mt-16 overflow-hidden relative">
      <div
        className="flex-1 overflow-auto w-full flex justify-center mb-28"
        ref={chatContainerRef}
      >
        <div className="w-[65%] flex flex-col gap-5 p-4">
          {history.map((message, i) => (
            <div
              key={i}
              className={`p-4 max-w-[80%] rounded-xl ${
                message.role === "user"
                  ? "bg-[#d1d1d164] self-end text-black dark:bg-[#63636377] dark:text-white transition-all duration-700"
                  : "self-start text-black dark:text-white transition-all duration-1000"
              }`}
            >
              <div className="whitespace-pre-line leading-[1.2]">
                <Markdown
                  components={{
                    code({ inline, className, children }) {
                      const language =
                        className?.match(/language-(\w+)/)?.[1] || "plaintext";
                      if (!inline) {
                        return (
                          <CopyBlock
                            text={String(children).trim()}
                            language={language}
                            showLineNumbers
                            theme={dracula}
                            wrapLongLines
                          />
                        );
                      }
                      return (
                        <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">
                          {children}
                        </code>
                      );
                    },
                    pre({ children }) {
                      return <>{children}</>;
                    },
                  }}
                >
                  {message.parts[0].text}
                </Markdown>
              </div>
            </div>
          ))}
        </div>
      </div>
      <NewPrompt addMessage={addMessage} chatData={history} />
    </div>
  );
};

export default ChatPage;
