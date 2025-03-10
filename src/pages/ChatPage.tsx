import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import Markdown from "react-markdown";
import { SyncLoader } from "react-spinners";
import { CopyBlock, dracula } from "react-code-blocks";
import NewPrompt from "../components/NewPrompt";
import logoCodeComplete from "../assets/img/codecomplete-logo.webp";
import {
  IStep,
  useChatInteract,
  useChatMessages,
} from "@chainlit/react-client";
import { getHistory } from "@/services/apiService";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { getListConversations } from "@/services/apiService";

interface ModelResponse {
  text: string;
  model: string;
}
const ChatPage = () => {
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const chatId = path.split("/").pop() || "1";
  const location = useLocation();
  const { sendMessage } = useChatInteract();
  const { messages } = useChatMessages();
  const { addChatList, prevMessagesLength, setPrevMessagesLength } = useApp();
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);

  const firstMessage = location.state?.firstMessage || null;
  // list messages on UI
  const [history, setHistory] = useState(() => {
    return chatId === "new" && firstMessage ? [firstMessage] : [];
  });

  const sendFirstMessage = async (text: string) => {
    const tempMessage: IStep = {
      id: crypto.randomUUID(),
      name: "user",
      type: "user_message",
      output: text,
      createdAt: new Date().toISOString(),
      metadata: { model_id: localStorage.getItem("selectedModel") },
    };
    await sendMessage(tempMessage);
  };

  useEffect(() => {
    if (chatId === "new") {
      sendFirstMessage(firstMessage.text);
    } else {
      getHistory(chatId).then((res) => {
        // setHistory(res.data);
        if (!res.data) return;
        const updatedHistory = res.data.map((msg: any) => {
          if (msg.role === "user") return msg;
          else {
            if (msg.text.startsWith("Double")) {
              // 2 models
              const content = msg.text.split("Double: ")[1];
              const [model1Text, model2Text] = content.split(
                "\n\n🔹 **Model 2:** "
              );
              return {
                role: "assistant",
                modelResponses: [
                  {
                    model: "Model 1",
                    text: model1Text.replace("🔹 **Model 1:** ", ""),
                  },
                  { model: "Model 2", text: model2Text },
                ],
              };
            } else {
              // 1model
              const content = msg.text.split("Single: ")[1];
              return {
                role: "assistant",
                text: content,
              };
            }
          }
        });
        setHistory(updatedHistory);
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
    addChatList(responseConversation.data.reverse());
  };
  const getLatestMessages = async () => {
    if (chatId === "new") return;
    const responseHistory = await getHistory(chatId);
    setHistory((prev) => {
      const mergedHistory = [...responseHistory.data];
      return mergedHistory;
    });
  };
  // messages => change
  const flatMessages = useMemo(() => {
    return flattenMessages(messages, (m) => m.type.includes("message"));
  }, [messages]);
  useEffect(() => {
    if (!flatMessages || flatMessages.length === 0) return;
    if (flatMessages.length === prevMessagesLength) return;
    setPrevMessagesLength(flatMessages.length);
    console.log("flatMessages: >>>>>>>>>>>>>>>>", flatMessages);
    let newMessage = flatMessages[flatMessages.length - 1];
    if (
      //new chat
      chatId === "new" &&
      newMessage?.metadata?.conversation_id &&
      newMessage.name === "Assistant"
    ) {
      navigate(`/dashboard/chats/${newMessage.metadata.conversation_id}`, {
        replace: true,
      });
      updateListConversations();
    } else if (
      // old chat
      chatId === newMessage?.metadata?.conversation_id &&
      newMessage.name === "Assistant"
    ) {
      setIsWaitingForResponse(false);
      if (newMessage.metadata.result === "double") {
        // 2 models
        const [model1Text, model2Text] = newMessage.output.split(
          "\n\n🔹 **Model 2:** "
        );
        setHistory((prev) => [
          ...prev,
          {
            role: "assistant",
            modelResponses: [
              {
                model: "Model 1",
                text: model1Text.replace("🔹 **Model 1:** ", ""),
              },
              { model: "Model 2", text: model2Text },
            ],
          },
        ]);
      } else {
        // 1 model
        setHistory((prev) => [
          ...prev,
          { role: "assistant", text: newMessage.output },
        ]);
      }
    }
  }, [flatMessages]);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [history]);

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
      metadata: {
        conversation_id: chatId,
        model_id: localStorage.getItem("selectedModel"),
      },
    };
    try {
      sendMessage(tempMessage);
      setHistory((prev) => [...prev, { role: "user", text: content }]);
      setIsWaitingForResponse(true);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col items-center h-full w-full mt-16 overflow-hidden relative">
      <div
        className="flex-1 overflow-auto overflow-x-hidden w-full flex justify-center mb-28"
        ref={chatContainerRef}
      >
        <div className="w-[70%] flex flex-col gap-5 p-4">
          {history.map((message, i) => (
            <div
              key={i}
              className={`p-4 ${
                message.modelResponses ? "max-w-[100%]" : "max-w-[80%]"
              } rounded-xl ${
                message.role === "user"
                  ? "bg-[#d1d1d164] self-end text-black dark:bg-[#63636377] dark:text-white transition-all duration-700"
                  : "self-start text-black dark:text-white transition-all duration-1000"
              }`}
            >
              {message.modelResponses ? (
                <div className="grid grid-cols-2 gap-6">
                  {message.modelResponses.map(
                    (res: ModelResponse, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 border rounded-2xl shadow-md bg-white dark:bg-gray-900 transition-all duration-500"
                      >
                        <p className="font-semibold text-lg text-gray-800 dark:text-gray-200 text-center">
                          {res.model}
                        </p>
                        <div className="mt-2 text-gray-700 dark:text-gray-300 text-justify ">
                          <Markdown
                            components={{
                              code({ className, children, ...props }) {
                                const language =
                                  className?.match(/language-(\w+)/)?.[1] ||
                                  "plaintext";
                                const isInline =
                                  typeof children === "string" &&
                                  !children.includes("\n");
                                if (!isInline) {
                                  return (
                                    <div className="overflow-x-auto text-sm">
                                      {" "}
                                      {/* Giảm kích thước font */}
                                      <CopyBlock
                                        text={String(children).trim()}
                                        language={language}
                                        showLineNumbers
                                        theme={dracula}
                                        wrapLongLines={false}
                                      />
                                    </div>
                                  );
                                }
                                return (
                                  <code
                                    className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded"
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                );
                              },
                            }}
                          >
                            {res.text}
                          </Markdown>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="mt-2 text-gray-700 dark:text-gray-300 text-justify mt-0">
                  <Markdown
                    components={{
                      code({ className, children, ...props }) {
                        const language =
                          className?.match(/language-(\w+)/)?.[1] ||
                          "plaintext";
                        const isInline =
                          typeof children === "string" &&
                          !children.includes("\n");
                        if (!isInline) {
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
                          <code
                            className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {message.text}
                  </Markdown>
                </div>
              )}
            </div>
          ))}
          {isWaitingForResponse && (
            <div className="self-start flex items-center gap-4">
              <img src={logoCodeComplete} alt="" className="w-8 h-8" />
              <SyncLoader size={6} color="gray" />
            </div>
          )}
        </div>
      </div>
      {/* Form input */}
      <NewPrompt addMessage={addMessage} chatData={history} />
    </div>
  );
};

export default ChatPage;
