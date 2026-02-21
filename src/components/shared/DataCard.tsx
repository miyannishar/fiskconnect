import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DataCardProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  noPadding?: boolean;
}

/** CRM-style card: optional header (title + action), content area. Use for tables and list blocks. */
export function DataCard({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
  noPadding,
}: DataCardProps) {
  return (
    <Card
      className={cn(
        "border-border/50 bg-card shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      {(title || action) && (
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 border-b border-border/50 pb-4">
          <div>
            {title && (
              <CardTitle className="text-base font-semibold">{title}</CardTitle>
            )}
            {description && (
              <CardDescription className="mt-0.5">{description}</CardDescription>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </CardHeader>
      )}
      <CardContent
        className={cn(
          !noPadding && "p-6",
          title && "pt-6",
          contentClassName
        )}
      >
        {children}
      </CardContent>
    </Card>
  );
}
