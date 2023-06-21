import { useState } from "react";
import { Button } from "./Button";
import { type ChatGPTMessage, ChatLine, LoadingChatLine } from "./ChatLine";
import { useUser } from "../hooks/user";

// default first message to display in UI (not necessary to define the prompt)
export const initialMessages: ChatGPTMessage[] = [
  {
    role: "assistant",
    content: "Hi! I am a friendly AI assistant. Ask me anything Flipt related!",
  },
];

const InputMessage = ({ input, setInput, sendMessage }: any) => (
  <div className="clear-both my-3 flex">
    <input
      type="text"
      aria-label="chat input"
      required
      autoFocus
      className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 sm:text-sm"
      value={input}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          sendMessage(input);
          setInput("");
        }
      }}
      onChange={(e) => {
        setInput(e.target.value);
      }}
    />
    <Button
      type="submit"
      className="ml-4 flex-none"
      onClick={() => {
        sendMessage(input);
        setInput("");
      }}
    >
      Chat
    </Button>
  </div>
);

export function Chat() {
  const [messages, setMessages] = useState<ChatGPTMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const sendMessage = async (input: string) => {
    setLoading(true);
    const newMessages = [
      ...messages,
      { role: "user", content: input } as ChatGPTMessage,
    ];
    setMessages(newMessages);

    const response = await fetch("http://localhost:9000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user,
        prompt: input,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status}; ${response.text}`
      );
    }

    const data = await response.json();

    setMessages([
      ...newMessages,
      { role: "assistant", content: data.response } as ChatGPTMessage,
    ]);

    setLoading(false);
  };

  return (
    <div className="h-full overflow-y-auto rounded-2xl border border-zinc-200 bg-slate-50/95 p-6">
      <div className="flex h-full flex-col justify-between gap-2 divide-y-2 divide-gray-200">
        <div>
          {messages.map(({ content, role }, index) => (
            <ChatLine key={index} role={role} content={content} />
          ))}

          {loading && <LoadingChatLine />}
        </div>

        <div className="pt-2">
          <InputMessage
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
          />
        </div>
      </div>
    </div>
  );
}
