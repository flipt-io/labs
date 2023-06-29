import React from "react";

type ChatWindowProps = {
  children: React.ReactNode;
};

export default function ChatWindow(props: ChatWindowProps) {
  const { children } = props;

  return (
    <div className="pointer-events-none fixed inset-y-0 right-0 z-50 hidden max-w-full pl-10 lg:flex">
      <div className="pointer-events-auto max-w-xs bg-white">
        <div className="flex h-full flex-col overflow-y-scroll bg-gradient-to-r from-violet-600/80 to-indigo-600/80 py-4 shadow-xl">
          <div className="relative flex-1 px-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
