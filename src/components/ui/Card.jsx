import { cn } from "@/lib/utils";

export default function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}