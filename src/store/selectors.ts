import { selector } from "recoil";
import { chatListState } from "./atoms";
interface Chat {
  _id: string;
  title: string;
}
export const chatListSelector = selector({
  key: "chatListSelector",
  //   get: async ({ get }) => {
  //     const cachedChats = get(chatListState);
  //     if (cachedChats.length > 0) return cachedChats; // Nếu đã có, trả về ngay

  //     try {
  //       const response = await fetch("/api/chats"); // Fetch nếu chưa có dữ liệu
  //       const data = await response.json();
  //       return data;
  //     } catch (error) {
  //       console.error("Lỗi khi lấy danh sách chat:", error);
  //       return [];
  //     }
  //   },
  get: async ({ get }) => {
    const cachedChats = get(chatListState);
    if (cachedChats.length > 0) return cachedChats; // Nếu có cache, trả về ngay

    // 🔹 Giả lập API fetch (fake data)
    return new Promise<Chat[]>((resolve) => {
      setTimeout(() => {
        resolve([
          { _id: "1", title: "Chat 1" },
          { _id: "2", title: "Chat 2" },
          { _id: "3", title: "Chat 3" },
        ]);
      }, 1000); // Mô phỏng thời gian chờ API
    });
  },
});
