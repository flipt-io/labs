import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { NavLink } from "react-router-dom";

const navigation = [
  { name: "Basic", to: "/basic" },
  { name: "Advanced", to: "/advanced" },
  { name: "GitOps", to: "/gitops" },
];

type SidebarProps = {
  collapsed: boolean;
  setCollapsed: (_collapsed: boolean) => void;
};

export default function Sidebar(props: SidebarProps) {
  const { collapsed, setCollapsed } = props;

  const Icon = collapsed ? ChevronDoubleRightIcon : ChevronDoubleLeftIcon;
  return (
    <>
      <div
        className={clsx(
          collapsed ? "grid-cols-sidebar-collapsed" : "grid-cols-sidebar",
          "grid min-h-screen transition-[grid-template-columns] duration-300 ease-in-out"
        )}
      >
        <div className="flex flex-col justify-between bg-gray-900">
          <div
            className={clsx(
              collapsed ? "justify-center py-4" : "justify-between p-4",
              "flex items-center"
            )}
          >
            {!collapsed && (
              <NavLink to="/" className="flex items-center">
                <img
                  className="h-10 w-auto"
                  src="/images/logo.svg"
                  alt="Flipt"
                />
                <p className="ml-2 whitespace-nowrap font-semibold text-white">
                  Flipt Labs
                </p>
              </NavLink>
            )}
            <button
              className="grid h-8 w-8 place-content-center rounded-full hover:bg-indigo-800"
              onClick={() =>
                setCollapsed(((prev: boolean) => !prev) as unknown as boolean)
              }
            >
              <Icon className="h-5 w-5 text-white" />
            </button>
          </div>

          {!collapsed && (
            <nav className="ml-2 flex flex-grow flex-col">
              <NavLink
                to="/"
                className="ml-2 mt-2 text-xs font-semibold uppercase tracking-wider text-gray-300"
              >
                Chatbot
              </NavLink>
              <div className="ml-2 mt-4 flex flex-col gap-y-4">
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Tutorials
                </p>
                <ul
                  role="list"
                  className="ml-2 flex flex-col items-stretch gap-2"
                >
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          clsx(
                            isActive
                              ? "bg-gray-800 text-white"
                              : "text-gray-400 hover:bg-gray-800 hover:text-white",
                            "flex w-full rounded-md p-2 text-sm font-semibold leading-6"
                          )
                        }
                      >
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          )}
        </div>
      </div>
    </>
  );
}
