import api from "../config/apiConfig";

export const loginService = async (email: string, password: string) => {
  return api.post("/login", { email, password });
};

export const signUpService = async (
  username: string,
  email: string,
  password: string
) => {
  return api.post("/register", { username, email, password });
};

export const getListConversations = async () => {
  return api.get(`/conversations`);
};

export const getHistory = async (idConversation: string) => {
  return api.get(`/history/${idConversation}`);
};

export const getMe = async () => {
  return api.get(`/info`);
};

export const getModels = async () => {
  return api.get(`/models`);
};
