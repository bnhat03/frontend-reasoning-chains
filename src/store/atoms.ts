import { atom } from "recoil";
// import { Chat } from "../types";
interface Chat {
  _id: string;
  title: string;
}
export const chatListState = atom<Chat[]>({
  key: "chatListState",
  default: [],
});
