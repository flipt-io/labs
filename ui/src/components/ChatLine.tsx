import clsx from "clsx";

type ChatGPTAgent = "user" | "system" | "assistant";

type ChatGPTPersona = "default" | "sarcastic" | "liar";

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
  persona?: ChatGPTPersona;
}

// loading placeholder animation for the chat line
export const LoadingChatLine = () => (
  <div className="flex min-w-full animate-pulse px-4 py-5 sm:px-6">
    <div className="flex flex-grow space-x-3">
      <div className="min-w-0 flex-1">
        <p className="font-large text-xxl text-gray-900">
          <span className="hover:underline">AI</span>
        </p>
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 h-2 rounded bg-zinc-500"></div>
            <div className="col-span-1 h-2 rounded bg-zinc-500"></div>
          </div>
          <div className="h-2 rounded bg-zinc-500"></div>
        </div>
      </div>
    </div>
  </div>
);

// util helper to convert new lines to <br /> tags
const convertNewLines = (text: string) =>
  text.split("\n").map((line, i) => (
    <span key={i}>
      {line}
      <br />
    </span>
  ));

export function ChatLine({
  role = "assistant",
  content,
  persona,
}: ChatGPTMessage) {
  if (!content) {
    return null;
  }
  const formattedMessage = convertNewLines(content);

  return (
    <div
      className={
        role !== "assistant"
          ? "float-right clear-both"
          : "float-left clear-both"
      }
    >
      <div
        className={clsx(
          "float-right mb-5 rounded-lg bg-white px-4 py-5 shadow-lg ring-1 ring-zinc-100 sm:px-6",
          role === "assistant" ? "shadow-violet-300" : "shadow-blue-300"
        )}
      >
        <div className="flex space-x-3">
          <div className="flex-1 gap-4">
            <p className="font-large text-xxl relative text-gray-900">
              <span className="hover:underline">
                {role === "assistant" ? "AI" : "You"}
              </span>
            </p>
            <p
              className={clsx(
                "text relative ",
                role === "assistant"
                  ? "font-light text-gray-600"
                  : "text-gray-400"
              )}
            >
              <span className="absolute -bottom-4 -right-4">
                {persona === "sarcastic" && role === "assistant" ? "😏" : ""}
                {persona === "liar" && role === "assistant" ? "😈" : ""}
              </span>
              {formattedMessage}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
