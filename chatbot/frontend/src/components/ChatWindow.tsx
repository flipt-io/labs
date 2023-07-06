import React from "react";

type ChatWindowProps = {
  children: React.ReactNode;
};

export default function ChatWindow(props: ChatWindowProps) {
  const { children } = props;

  return (
    <div className="pointer-events-none hidden max-w-full justify-end lg:flex">
      <div className="pointer-events-auto max-w-xs bg-white">
        <div className="flex h-screen flex-col overflow-y-scroll bg-gradient-to-r from-violet-600/80 to-indigo-600/80 py-4">
          <div className="relative flex-1 px-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
