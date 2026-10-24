import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cn } from "@/lib/utils";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}