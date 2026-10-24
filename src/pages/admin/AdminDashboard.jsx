import { useSOS } from "../../context/SOSContext";
import { ShieldAlert, Users, Activity, MapPin, Radio } from "lucide-react";
import Card, { CardHeader, CardBody } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import StatCard from "../../components/ui/StatCard";
import { formatRelativeTime } from "../../lib/utils";

export default function AdminDashboard() {
  const { alerts, rescuers, safeZones } = useSOS();

  const criticalCount = alerts.filter(
    (a) => a.severity === "critical" && a.status !== "resolved"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Command Center
          </h1>
          <p className="text-slate-400 text-sm">
            Live overview of disaster response operations.
          </p>
        </div>
        <Badge variant="safe" className="px-3 py-1.5 animate-pulse flex items-center gap-2">
          <Radio size={14} /> Live Sync
        </Badge>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total Active SOS"
          value={alerts.filter((a) => a.status !== "resolved").length}
          icon={ShieldAlert}
          tone="critical"
        />
        <StatCard
          label="Critical Zones"
          value={criticalCount}
          icon={Activity}
          tone="high"
        />
        <StatCard
          label="Available Teams"
          value={rescuers.filter((r) => r.status === "available").length}
          icon={Users}
          tone="safe"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Alert Feed */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Live Incident Feed"
            subtitle="Real-time SOS and disaster reports"
          />
          <CardBody>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-bg-base border border-white/5"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        alert.severity === "critical"
                          ? "bg-critical/10 text-critical"
                          : "bg-high/10 text-high"
                      }`}
                    >
                      <ShieldAlert size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-100 text-sm">
                        {alert.type} — {alert.location}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <span>{formatRelativeTime(alert.time)}</span>
                        <span>•</span>
                        <span className="capitalize">{alert.status}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={alert.severity}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Right Sidebar - Agency Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Agency Status" />
            <CardBody className="space-y-4">
              {rescuers.map((team) => (
                <div key={team.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-200">{team.name}</p>
                    <p className="text-xs text-slate-500">{team.type}</p>
                  </div>
                  <Badge
                    variant={team.status === "available" ? "safe" : "high"}
                  >
                    {team.status.replace("-", " ").toUpperCase()}
                  </Badge>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Shelter Capacity" />
            <CardBody className="space-y-4">
              {safeZones.map((zone) => (
                <div key={zone.id}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-slate-200">{zone.name}</p>
                    <span className="text-xs text-slate-400">
                      {zone.occupied} / {zone.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        zone.occupied >= zone.capacity ? "bg-critical" : "bg-safe"
                      }`}
                      style={{
                        width: `${Math.min(
                          (zone.occupied / zone.capacity) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}