import clsx from "clsx";

export function Button({ className, ...props }: any) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm outline-offset-2 transition active:transition-none",
        "bg-violet-600 font-semibold text-white hover:bg-violet-400 focus:ring-1 focus:ring-violet-500 focus:ring-offset-2 active:bg-violet-800 disabled:bg-violet-300",
        className
      )}
      {...props}
    />
  );
}
