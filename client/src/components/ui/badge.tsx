import { cn } from "@/lib/utils";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-transparent bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700",
        className
      )}
      {...props}
    />
  );
}
