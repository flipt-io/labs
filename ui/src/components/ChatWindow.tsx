import React from "react";

type ChatWindowProps = {
  children: React.ReactNode;
};

export default function ChatWindow(props: ChatWindowProps) {
  const { children } = props;

  return (
    <div className="flex h-[48rem] flex-col overflow-y-scroll rounded-lg bg-gradient-to-r from-violet-600/80 to-indigo-600/80 py-6 shadow-xl">
      <div className="relative h-full px-4 sm:px-6">{children}</div>
    </div>
  );
}
