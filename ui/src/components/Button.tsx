import clsx from "clsx";

export function Button({ className, ...props }: any) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white outline-offset-2 transition hover:bg-violet-400 focus:ring-1 focus:ring-violet-500 focus:ring-offset-2 active:bg-violet-800 active:transition-none disabled:bg-violet-300",
        className
      )}
      {...props}
    />
  );
}
