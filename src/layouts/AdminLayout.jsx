import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Map, Users, Radio, LogOut, ShieldAlert, BarChart3 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/admin", icon: LayoutDashboard, label: "Command Center", end: true },
    { to: "/admin/map", icon: Map, label: "Live Map" },
    { to: "/admin/teams", icon: Users, label: "Agency Teams" },
    { to: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  ];

  return (
    <div className="min-h-screen bg-bg-base flex">
      <aside className="w-64 bg-bg-surface border-r border-white/5 flex flex-col fixed inset-y-0 z-40">
        <div className="h-16 flex items-center gap-2 px-6 border-b border-white/5">
          <ShieldAlert className="text-critical" size={24} />
          <span className="font-extrabold text-lg tracking-tight text-white">
            AAPDA <span className="text-critical">MATRIX</span>
          </span>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-6 px-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Command Center
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Radio size={14} className="text-safe animate-pulse" />
              System Online
            </div>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive ? "bg-critical/10 text-critical" : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                  )
                }
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{user?.role}</p>
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-critical rounded-lg hover:bg-critical/10 transition" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}