import Link from "next/link";
import ClientInfo from "~/components/client-info";
import { ThemeToggle } from "~/components/theme-toggle";

export default function footer() {
  return (
    <footer className="border-t px-4 md:px-8">
      <div className="my-2 flex items-center justify-between">
        <p className="col-span-full row-start-2 text-center text-sm leading-loose text-muted-foreground md:flex-1 md:text-left">
          Built by{" "}
          <a
            href="http://github.com/shoodey"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Shoodey
          </a>
          .
        </p>
        <div className="flex h-12 items-center justify-end">
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
