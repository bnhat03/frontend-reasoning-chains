import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";
import NewPrompt from "@/components/NewPrompt";
import {
  IStep,
  useChatInteract,
  useChatMessages,
} from "@chainlit/react-client";
import { getHistory } from "@/services/apiService";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { getListConversations } from "@/services/apiService";

const ChatPage = () => {
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const chatId = path.split("/").pop() || "1";
  const location = useLocation();
  const { sendMessage } = useChatInteract();
  const { messages } = useChatMessages();
  const { addChatList } = useApp();

  const firstMessage = location.state?.firstMessage || null;
  // list messages on UI
  const [history, setHistory] = useState(() => {
    return chatId === "new" && firstMessage ? [firstMessage] : [];
  });

  //
  const sendFirstMessage = async (text: string) => {
    const tempMessage: IStep = {
      id: crypto.randomUUID(),
      name: "user",
      type: "user_message",
      output: text,
      createdAt: new Date().toISOString(),
    };
    await sendMessage(tempMessage);
    console.log("gửi tiếp rồi nha!");
  };

  useEffect(() => {
    if (chatId === "new") {
      sendFirstMessage(firstMessage.parts[0].text);
    } else {
      getHistory(chatId).then((res) => {
        setHistory(res.data);
      });
    }
  }, [chatId]);
  function flattenMessages(
    messages: IStep[],
    condition: (node: IStep) => boolean
  ): IStep[] {
    return messages.reduce((acc: IStep[], node) => {
      if (condition(node)) {
        acc.push(node);
      }
      if (node.steps?.length) {
        acc.push(...flattenMessages(node.steps, condition));
      }
      return acc;
    }, []);
  }
  // Reset list conversations
  const updateListConversations = async () => {
    const responseConversation = await getListConversations();
    addChatList(responseConversation.data);
  };
  const getLatestMessages = async () => {
    const responseHistory = await getHistory(chatId);
    setHistory((prev) => {
      const mergedHistory = [...responseHistory.data];
      return mergedHistory;
    });
  };
  useEffect(() => {
    const result = flattenMessages(messages, (m) => m.type.includes("message"));
    if (!result) return;
    if (result.length === 3) {
      const formattedResponse = {
        role: "assistant",
        parts: [{ type: "text", text: result[2].output }],
      };
      setHistory((prev) =>
        prev.length === 1 ? [...prev, formattedResponse] : prev
      );
      if (result[2]?.metadata?.conversation_id) {
        navigate(`/dashboard/chats/${result[2].metadata.conversation_id}`, {
          replace: true,
        });
        updateListConversations();
      }
    } else if (result.length > 3 && result.length % 2 === 1) {
      const lastMessage =
        history.length > 0 ? history[history.length - 1] : null;
      if (lastMessage.role === "assistant") {
        return;
      }
      getLatestMessages();
    }
  }, [messages]);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [history]);

  // Hàm thêm tin nhắn mới
  const addMessage = async (newMessage: string) => {
    if (chatId === "new") return;
    const content = newMessage.trim();
    if (!content) return;
    const tempMessage: IStep = {
      id: crypto.randomUUID(),
      name: "user",
      type: "user_message",
      output: content,
      createdAt: new Date().toISOString(),
      metadata: { conversation_id: chatId },
    };

    try {
      await sendMessage(tempMessage);
      setHistory((prev) => [
        ...prev,
        { role: "user", parts: [{ type: "text", text: content }] },
      ]);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col items-center h-full relative">
      <div
        className="flex-1 overflow-auto w-full flex justify-center"
        ref={chatContainerRef}
      >
        <div className="w-1/2 flex flex-col gap-5 p-4">
          {/* History message */}
          {history.map((message, i) => (
            <div
              key={i}
              className={`p-4 max-w-[80%] rounded-xl ${
                message.role === "user"
                  ? "bg-gray-500 self-end text-white"
                  : "bg-gray-100 self-start text-black dark:bg-[#63636377] dark:text-white"
              }`}
            >
              <Markdown>{message.parts[0].text}</Markdown>
            </div>
          ))}
        </div>
      </div>

      {/* Form input */}
      <NewPrompt addMessage={addMessage} chatData={history} />
    </div>
  );
};

export default ChatPage;
