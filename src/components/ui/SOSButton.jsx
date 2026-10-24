import { cn } from "@/lib/utils";

export default function Button({ className, variant = "default", size = "default", ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50",
        // Variants (Add your actual styling here if different)
        variant === "default" && "bg-slate-900 text-slate-50 hover:bg-slate-900/90",
        variant === "outline" && "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900",
        // Sizes
        size === "default" && "h-10 px-4 py-2",
        size === "sm" && "h-9 rounded-md px-3",
        size === "lg" && "h-11 rounded-md px-8",
        className
      )}
      {...props}
    />
  );
}