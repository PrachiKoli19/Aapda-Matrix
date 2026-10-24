import Card from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export default function StatCard({ title, value, icon, className }) {
  return (
    <Card className={cn("p-6 flex items-center gap-4", className)}>
      {icon && <div className="p-3 bg-slate-100 rounded-lg text-slate-700">{icon}</div>}
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      </div>
    </Card>
  );
}