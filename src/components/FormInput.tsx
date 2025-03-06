import sendIcon from "./../assets/img/send.svg";
import micIcon from "./../assets/img/mic.svg";
import stopIcon from "./../assets/img/stop.svg";
import { useRef, useState } from "react";

interface ChatInputProps {
  question: string;
  setQuestion: (value: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}
declare global {
  interface Window {
    webkitSpeechRecognition?: typeof SpeechRecognition;
    SpeechRecognition?: any;
  }
  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
  }
}

const SpeechRecognition: typeof window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const FormInput = ({ question, setQuestion, handleSubmit }: ChatInputProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<typeof SpeechRecognition | null>(null);
  const handleVoiceInput = () => {
    if (!SpeechRecognition) {
      alert("Trình duyệt của bạn không hỗ trợ nhận diện giọng nói.");
      return;
    }
    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.lang = "vi-VN";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setQuestion(transcript);
      };

      recognition.onend = () => {
        setIsRecording(false);
        recognitionRef.current = null;
      };

      recognitionRef.current = recognition;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  };

  return (
    <form
      className="flex items-center justify-between gap-5"
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
      {question ? (
        <button className="bg-[#f5145f] rounded-full p-3 flex items-center justify-center">
          <img src={sendIcon} alt="send" className="w-4 h-4 text-blue-700" />
        </button>
      ) : (
        <button
          className="bg-[#f5145f] rounded-full p-3 flex items-center justify-center"
          onClick={handleVoiceInput}
        >
          {isRecording ? (
            <img src={stopIcon} className="w-4 h-4" alt="" />
          ) : (
            <img src={micIcon} className="w-4 h-4" alt="" />
          )}
        </button>
      )}
    </form>
  );
};

export default FormInput;
