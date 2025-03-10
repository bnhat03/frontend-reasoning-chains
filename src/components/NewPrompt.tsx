import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import FormInput from "./FormInput";

window.SpeechRecognition || window.webkitSpeechRecognition;

const NewPrompt = ({
  addMessage,
  chatData,
}: {
  addMessage: (messages: string) => void;
  chatData: any;
}) => {
  const [question, setQuestion] = useState("");
  const endChatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatData]);
  const add = async (text: string, isInitial: boolean) => {
    addMessage(text);
  };

  useEffect(() => {
    if (chatData.length === 1 && chatData[0].role === "user") {
      add(chatData[0].text, true);
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
      <div className="w-[65%] mb-5 absolute bottom-0 bg-white dark:bg-[#63636377] rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.15)] transition-colors duration-1000">
        <FormInput
          question={question}
          setQuestion={setQuestion}
          handleSubmit={handleSubmit}
        />
      </div>
    </>
  );
};

export default NewPrompt;
