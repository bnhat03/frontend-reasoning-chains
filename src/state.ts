import { atom } from "recoil";

interface User {
  name: string;
  email: string;
  picture: string;
}

export const userState = atom<User | null>({
  key: "userState",
  default: null,
});
