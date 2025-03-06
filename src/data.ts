export const chats = [
  { _id: "1", title: "Chat 1" },
  { _id: "2", title: "Chat 2" },
  { _id: "3", title: "Chat 3" },
  { _id: "4", title: "Chat 4" }, // Thêm cuộc trò chuyện mới
];

export const chatHistories: Record<
  string,
  {
    _id: string;
    history: { role: string; parts: { type: string; text: string }[] }[];
  }
> = {
  "1": {
    _id: "1",
    history: [
      { role: "user", parts: [{ type: "text", text: "Hello, how are you?" }] },
      {
        role: "lama",
        parts: [{ type: "text", text: "I'm good! How can I help you today?" }],
      },
    ],
  },
  "2": {
    _id: "2",
    history: [
      { role: "user", parts: [{ type: "text", text: "Tell me about AI." }] },
      {
        role: "lama",
        parts: [
          { type: "text", text: "AI stands for Artificial Intelligence..." },
        ],
      },
    ],
  },
  "3": {
    _id: "3",
    history: [
      {
        role: "user",
        parts: [{ type: "text", text: "Any ideas for AI research?" }],
      },
      {
        role: "lama",
        parts: [
          { type: "text", text: "Sure! Here are some trending AI topics..." },
        ],
      },
    ],
  },
  "4": {
    _id: "4",
    history: [
      {
        role: "user",
        parts: [{ type: "text", text: "What's new in tech today?" }],
      },
      {
        role: "lama",
        parts: [
          {
            type: "text",
            text: `Okay, I will calculate 202.32 x 13. I'll use several methods to ensure accuracy.

**Step 1: Standard Multiplication Method**

This is the traditional pen-and-paper method for multiplying.
\`\`\`
  202.32
x     13
--------
  606.96  (202.32 x 3)
2023.20  (202.32 x 10, shifted one place left)
--------
2629.16
\`\`\`
Therefore, using the standard multiplication method, 202.32 x 13 = 2629.16.
`,
          },
        ],
      },
    ],
  },
};
