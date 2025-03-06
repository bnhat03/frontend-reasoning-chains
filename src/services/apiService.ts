// apiService.ts
import api from "../config/apiConfig";

// 📝 Bài viết (Post)
// export const deletePost = async (postId: number) => {
//   return api.delete(`/api/posts/${postId}`);
// };

// export const postComment = async (postId: number, content: string) => {
//   return api.post(`/api/posts/${postId}/comments`, { content });
// };

// export const likeUnlikePost = async (postId: number, isLiked: boolean) => {
//   return isLiked
//     ? api.delete(`/api/likes/${postId}`)
//     : api.post(`/api/posts/${postId}/likes`);
// };

// export const createPost = async (content: string, image?: File) => {
//   const formData = new FormData();
//   formData.append("content", content);
//   if (image) {
//     formData.append("image", image);
//   }
//   return api.post("/api/posts/", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
// };

// 🔑 Xác thực (Auth)
export const loginService = async (email: string, password: string) => {
  return api.post("/login", { email, password });
};

export const signUpService = async (
  username: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  return api.post("/register", { username, email, password, confirmPassword });
};

export const getListConversations = async () => {
  return api.get(`/conversations`);
};

export const getHistory = async (idConversation: string) => {
  return api.get(`/history/${idConversation}`);
};
