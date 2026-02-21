import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  showWordmark?: boolean;
  className?: string;
}

/** Atom: Fisk logo mark + optional "CONNECT" wordmark. */
export function Logo({
  href = "/",
  showWordmark = true,
  className,
}: LogoProps) {
  const content = (
    <>
      <span
        className={cn(
          "inline-flex items-center justify-center rounded px-2 py-1 sm:px-3 sm:py-1.5",
          "bg-secondary text-secondary-foreground text-xs sm:text-sm font-bold tracking-wide"
        )}
        aria-hidden
      >
        FISK
      </span>
      {showWordmark && (
        <span className="text-secondary hidden sm:inline font-bold tracking-tight">
          CONNECT
        </span>
      )}
    </>
  );

  const classNames = cn(
    "logo inline-flex items-center gap-2 transition-colors hover:opacity-90",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classNames}>
        {content}
      </Link>
    );
  }
  return <span className={classNames}>{content}</span>;
}
