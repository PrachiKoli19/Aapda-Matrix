import { cn } from "@/lib/utils";

export default function Badge({ className, variant = "default", ...props }) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2",
        variant === "default" && "border-transparent bg-slate-900 text-slate-50",
        variant === "secondary" && "border-transparent bg-slate-100 text-slate-900",
        variant === "destructive" && "border-transparent bg-red-500 text-slate-50",
        variant === "outline" && "text-slate-950",
        className
      )}
      {...props}
    />
  );
}