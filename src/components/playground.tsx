import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  useChatInteract, // gửi tin nhắn
  useChatMessages, // lấy danh sách tn
  IStep, // Interface định nghĩa một bước trong cuộc hội thoại (một tin nhắn).
} from "@chainlit/react-client";
import { useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Markdown from "react-markdown";
declare global {
  interface Window {
    webkitSpeechRecognition?: typeof SpeechRecognition;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition?: any;
  }

  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
  }
}

const SpeechRecognition: typeof window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

function flattenMessages( // Xử lý tin nhắn dạng cây
  messages: IStep[], // nested messages
  condition: (node: IStep) => boolean
): IStep[] {
  return messages.reduce((acc: IStep[], node) => {
    if (condition(node)) {
      // Nếu tin nhắn thỏa mãn condition, nó sẽ được thêm vào mảng kết quả.
      acc.push(node);
    }

    if (node.steps?.length) {
      // Nếu tin nhắn có bước con (steps) => iếp tục đệ quy để thêm các tin nhắn con vào danh sách.
      acc.push(...flattenMessages(node.steps, condition));
    }

    return acc;
  }, []);
}

export function Playground() {
  const [inputValue, setInputValue] = useState("");
  const { sendMessage } = useChatInteract();
  const { messages } = useChatMessages(); // Danh sách tin nhắn từ Chainlit (có thể chứa nested messages).
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<typeof SpeechRecognition | null>(null);
  const navigate = useNavigate();
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
        setInputValue(transcript);
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

  const flatMessages = useMemo(() => {
    return flattenMessages(messages, (m) => m.type.includes("message"));
  }, [messages]);
  // useMemo(...): chỉ tính toán lại danh sách khi messages thay đổi.
  // flattenMessages(...): Làm phẳng danh sách tin nhắn, lọc ra những tin có type chứa "message"

  const [pendingMessages, setPendingMessages] = useState<IStep[]>([]);
  const handleSendMessage = async () => {
    const content = inputValue.trim();
    if (!content) return;
    let conversationId = "HiHAHA_convid";
    const tempMessage: IStep = {
      id: crypto.randomUUID(),
      name: "user",
      type: "user_message",
      output: content,
      createdAt: new Date().toISOString(),
      // metadata: {
      //   conversation_id: conversationId, // ✅ Thêm conversation_id vào metadata
      // },
    };

    setPendingMessages((prev) => [...prev, tempMessage]); // Hiển thị tin nhắn "đang gửi"
    try {
      await sendMessage(tempMessage);

      console.log("Danh sách tin nhắn:", messages);
      setPendingMessages((prev) =>
        prev.filter((msg) => msg.id !== tempMessage.id)
      ); // Xóa tin nhắn "đang gửi"
    } catch (error) {
      console.error("Gửi tin nhắn thất bại:", error);
      alert("Tin nhắn chưa gửi được. Hãy thử lại.");
    }
    // navigate("/conversations");
    setInputValue("");
  };
  // const retrySendMessage = async (message, retries = 3) => {
  //   for (let i = 0; i < retries; i++) {
  //     try {
  //       await sendMessage(message, []);
  //       return true;
  //     } catch (error) {
  //       console.warn(`Thử lại lần ${i + 1}: Lỗi gửi tin nhắn`, error);
  //     }
  //   }
  //   return false;
  // };

  const renderMessage = (message: IStep) => {
    // Mỗi tin nhắn ở UI (name, content, createdAt)
    const dateOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };
    const date = new Date(message.createdAt).toLocaleTimeString(
      undefined,
      dateOptions
    );
    return (
      <div key={message.id} className="flex items-start space-x-2">
        <div className="w-20 text-sm text-green-500">{message.name}</div>
        <div className="flex-1 border rounded-lg p-2">
          <Markdown>{message.output}</Markdown>
          {/* <p className="text-black dark:text-white">{message.output}</p> */}
          <small className="text-xs text-gray-500">{date}</small>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-4">
          {flatMessages.map((message) => renderMessage(message))}
        </div>
      </div>
      <div className="border-t p-4 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-2">
          <Input
            autoFocus
            className="flex-1"
            id="message-input"
            placeholder="Type a message"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          {inputValue ? (
            <Button onClick={handleSendMessage} type="button">
              Send
            </Button>
          ) : (
            <Button onClick={handleVoiceInput} type="button">
              {isRecording ? "⏹ Dừng" : "🎤 Bắt đầu"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
