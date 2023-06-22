import React from "react";

type ChatWindowProps = {
  children: React.ReactNode;
};

export default function ChatWindow(props: ChatWindowProps) {
  const { children } = props;

  return (
    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
      <div className="pointer-events-auto max-w-sm bg-white">
        <div className="flex h-full flex-col overflow-y-scroll bg-gradient-to-r from-violet-600/80 to-indigo-600/80 py-6 shadow-xl">
          <div className="relative flex-1 px-4 sm:px-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
