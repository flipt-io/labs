import { Button } from "./Button";
import { UserIcon } from "@heroicons/react/24/outline";
import { useUser } from "../hooks/user";

export default function User() {
  const { user, setUser } = useUser();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
  };

  return (
    <div className="mt-4 flex flex-col">
      <div className="mx-auto max-w-lg overflow-hidden rounded border-2 border-violet-300 bg-gradient-to-r from-violet-600/40 to-indigo-600/70 py-6">
        <form id="userForm" onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-6 px-6 py-2">
            <div className="relative mt-2 flex flex-grow items-stretch rounded-md shadow-sm">
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
                className="block w-full rounded border-0 py-1.5 pl-10 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="user"
              />
            </div>
          </div>
          <div className="mt-2 flex items-center justify-end gap-x-2 px-6">
            <Button
              className="border border-white/70 bg-violet-300 font-normal text-white hover:bg-violet-200"
              onClick={(e: any) => {
                e.preventDefault();
                setUser("");
              }}
            >
              Reset
            </Button>
            <Button
              className="border border-white/70 font-normal text-white"
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
