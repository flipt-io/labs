import { CheckIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useRef, useState } from "react";

export default function Code(
  props: React.JSX.IntrinsicAttributes &
    React.ClassAttributes<HTMLPreElement> &
    React.HTMLAttributes<HTMLPreElement>
) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copyTextToClipboard = (text: string) => {
    if ("clipboard" in navigator) {
      return navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  };

  return (
    <div className="relative flex">
      <pre
        className="w-full overflow-x-auto rounded bg-[#0d1117]"
        {...props}
        ref={ref}
      />

      <button
        aria-label="Copy"
        className="absolute right-0 top-6 hidden p-2.5 md:block"
        onClick={() => {
          copyTextToClipboard(ref.current?.innerText || "");
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 2000);
        }}
      >
        <CheckIcon
          className={clsx(
            "absolute m-auto h-4 w-4 justify-center align-middle text-green-400 transition-opacity duration-300 ease-in-out hover:text-white",
            copied ? "visible opacity-100" : "invisible opacity-0"
          )}
        />
        <ClipboardDocumentIcon
          className={clsx(
            "m-auto h-4 w-4 justify-center align-middle text-gray-200 transition-opacity duration-300 ease-in-out hover:text-white",
            copied ? "invisible opacity-0" : "visible opacity-100"
          )}
        />
      </button>
    </div>
  );
}
