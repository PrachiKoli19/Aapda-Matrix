import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, MapPin, AlertTriangle, Phone } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSOS } from "../../context/SOSContext";
import StatCard from "../../components/ui/StatCard";
import Card, { CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/SOSButton";
import Badge from "../../components/ui/Badge";
import SOSButton from "../../components/ui/SOSButton";

export default function CitizenDashboard() {
  const { user } = useAuth();
  const { activeAlerts, triggerSOS, alerts } = useSOS();
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);

  const handleSOS = () => {
    setIsSending(true);
    // Simulate fetching location & sending to backend
    setTimeout(() => {
      triggerSOS("General Emergency", "Current Location (GPS)");
      setIsSending(false);
      // Show success or navigate to alerts
      navigate("/citizen/alerts");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">
          Hello, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-slate-400 text-sm">
          Stay safe. Help is one tap away.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Active Alerts"
          value={activeAlerts.length}
          icon={AlertTriangle}
          tone={activeAlerts.length > 0 ? "critical" : "safe"}
        />
        <StatCard
          label="Safe Zones"
          value="3 Nearby"
          icon={MapPin}
          tone="safe"
        />
      </div>

      {/* Big SOS Button Area */}
      <Card className="flex flex-col items-center justify-center py-12 bg-gradient-to-b from-bg-surface to-bg-base border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-critical/5 rounded-full blur-3xl" />
        <SOSButton onClick={handleSOS} disabled={isSending} />
        <p className="text-center text-sm text-slate-400 mt-6 max-w-[250px]">
          {isSending
            ? "Sending SOS signal and location..."
            : "Press in case of a life-threatening emergency."}
        </p>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="secondary"
          className="h-16 flex-col gap-2"
          onClick={() => navigate("/citizen/map")}
        >
          <MapPin size={20} className="text-safe" />
          Find Safe Zone
        </Button>
        <Button
          variant="secondary"
          className="h-16 flex-col gap-2"
          onClick={() => window.location.href = "tel:112"}
        >
          <Phone size={20} className="text-blue-400" />
          Call Helpline
        </Button>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader
          title="Recent Alerts Nearby"
          action={
            <Button variant="ghost" size="sm" onClick={() => navigate("/citizen/alerts")}>
              View All
            </Button>
          }
        />
        <div className="space-y-3 px-5 pb-5">
          {alerts.slice(0, 3).map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
            >
              <div
                className={`p-2 rounded-lg shrink-0 ${
                  alert.severity === "critical" ? "bg-critical/10 text-critical" : "bg-high/10 text-high"
                }`}
              >
                <ShieldAlert size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-100 truncate">
                  {alert.type}
                </p>
                <p className="text-xs text-slate-400 truncate">{alert.location}</p>
              </div>
              <Badge
                variant={alert.severity}
                className="ml-auto shrink-0"
              >
                {alert.status.toUpperCase()}
              </Badge>
            </div>
          ))}
          {alerts.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-4">
              No alerts in your area.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}