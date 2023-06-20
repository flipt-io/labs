import localforage from "localforage";
import { Button } from "./Button";
import { useState } from "react";

export default function Userdomain() {
  const [user, setUser] = useState("");
  const [domain, setDomain] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await localforage.setItem("email", `${user}${domain}`);
  };

  return (
    <div className="mx-auto max-w-lg overflow-hidden rounded bg-gradient-to-r from-violet-600/60 to-indigo-600/80 py-6 shadow-xl">
      <form id="userForm" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-6 px-6 py-2">
          <div className="relative mt-2 rounded-md shadow-sm">
            <input
              type="text"
              name="user"
              id="user"
              className="block w-full rounded border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="domain"
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <label htmlFor="domain" className="sr-only">
                domain
              </label>
              <select
                id="domain"
                name="domain"
                className="h-full rounded border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
              >
                <option>@external.io</option>
                <option>@internal.biz</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-end gap-x-2 px-6">
          <Button
            className="bg-violet-400 hover:bg-violet-300"
            onClick={(e: any) => {
              e.preventDefault();
              localforage.removeItem("email");
            }}
          >
            Reset
          </Button>
          <Button type="submit">Set</Button>
        </div>
      </form>
    </div>
  );
}
