import { XMarkIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

type BannerProps = {
  className?: string;
  text: string;
};

export default function Banner(props: BannerProps) {
  const { className, text } = props;
  const [show, setShow] = useState(true);

  return (
    <>
      {show && (
        <div
          className={`${className} flex items-center gap-x-6 bg-indigo-600 px-6 py-2.5 sm:px-3.5 sm:before:flex-1`}
        >
          <p className="text-sm leading-6 text-white">
            <a href="#">
              <strong className="font-semibold">Note:</strong>&nbsp;
              {text}
            </a>
          </p>
          <div className="flex flex-1 justify-end">
            <button
              type="button"
              className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
              onClick={() => setShow(false)}
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-5 w-5 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
