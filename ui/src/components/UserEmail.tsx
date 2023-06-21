import localforage from "localforage";
import { Button } from "./Button";
import { useState } from "react";
import clsx from "clsx";

type UserEmailProps = {
  className?: string;
};

export default function UserEmail(props: UserEmailProps) {
  const { className } = props;

  const [user, setUser] = useState("");
  const [domain, setDomain] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await localforage.setItem("email", `${user}${domain}`);
  };

  return (
    <div className={clsx("flex flex-col text-center", className)}>
      <div className="mx-auto max-w-lg overflow-hidden rounded border-4 border-violet-300 bg-gradient-to-r from-violet-600/40 to-indigo-600/70 py-6 shadow-xl">
        <form id="userForm" onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-6 px-6 py-2">
            <div className="relative mt-2 rounded-md shadow-sm">
              <input
                type="text"
                name="user"
                id="user"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="block w-full rounded border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="user"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <select
                  id="domain"
                  name="domain"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="h-full rounded border-0 bg-transparent py-0 pl-2 pr-7 text-gray-900 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                >
                  <option>@external.io</option>
                  <option>@internal.biz</option>
                </select>
              </div>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-end gap-x-2 px-6">
            <Button
              className="border border-white/70 bg-violet-400 font-normal text-gray-100 hover:bg-violet-300"
              onClick={(e: any) => {
                e.preventDefault();
                setUser("");
                localforage.removeItem("email");
              }}
            >
              Reset
            </Button>
            <Button
              className="border border-white/70 font-normal text-gray-100"
              type="submit"
            >
              Set
            </Button>
          </div>
        </form>
      </div>
      <p className="text-sm text-gray-500">
        <span className="font-semibold text-gray-700">Instructions:</span>
        &nbsp;Set an email address to mimic a user interacting with our bot
      </p>
    </div>
  );
}
