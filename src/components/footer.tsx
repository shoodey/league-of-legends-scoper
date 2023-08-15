import { ThemeToggle } from "~/components/theme-toggle";

export default function footer() {
  return (
    <>
      <div className="flex items-center  align-middle z-10 fixed bottom-5 right-5">
        <ThemeToggle />
      </div>
      <div className="flex items-center align-middle z-10 fixed bottom-5">
        <p className="flex w-full justify-center border-b border-gray-300 dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:dark:bg-zinc-800/30">
          <code className="font-mono text-xs">v1.0.0</code>
        </p>
      </div>
    </>
  );
}
