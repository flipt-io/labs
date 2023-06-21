import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

type ChatWindowProps = {
  children: React.ReactNode;
};

export default function ChatWindow(props: ChatWindowProps) {
  const { children } = props;

  const [open, setOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full bg-white pl-2">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div
                    className={clsx(
                      "flex h-screen flex-col overflow-y-scroll bg-gradient-to-r py-6 shadow-xl",
                      isAdmin
                        ? "from-orange-600/80 to-red-800/90"
                        : "from-violet-600/80 to-indigo-600/80"
                    )}
                  >
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900"></Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          {isAdmin && (
                            <button
                              type="button"
                              className="rounded-md border-2 border-white bg-red-500 p-2 text-white hover:font-semibold focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-1"
                            >
                              🔥 Destroy
                            </button>
                          )}
                        </div>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-gray-100/[0.2] text-gray-400 hover:text-white focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-1"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 h-full flex-1 px-4 sm:px-6">
                      {children}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
