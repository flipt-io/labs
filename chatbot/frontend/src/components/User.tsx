import Button from "./Button";
import { UserIcon } from "@heroicons/react/24/outline";
import { useUser } from "~/hooks/user";
import { useState } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";

export default function User() {
  const { user, setUser } = useUser();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
    }, 2000);
  };

  return (
    <div className="mt-4 flex flex-col">
      <div className="mx-auto max-w-lg overflow-hidden rounded border border-violet-300 bg-violet-300/20 shadow-lg shadow-violet-300">
        <form id="userForm" onSubmit={handleSubmit}>
          <div className="flex flex-col p-4">
            <div className="relative mt-2 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <UserIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                name="user"
                id="user"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="block w-full rounded border-0 py-1.5 pl-10 pr-12 text-gray-900 shadow-sm shadow-white/50 ring-1 ring-inset ring-violet-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="username"
              />
              {submitting && (
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-7">
                  <CheckIcon
                    className={
                      "absolute m-auto h-6 w-6 justify-center align-middle text-green-400 transition-opacity duration-300 ease-in-out hover:text-white"
                    }
                  />
                </div>
              )}
            </div>
            <Button
              className="mx-auto mt-3 w-1/3 border border-white/70"
              type="submit"
            >
              Set
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
