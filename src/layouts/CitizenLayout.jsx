import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Home, Map, AlertCircle, FileText, LogOut, ShieldAlert } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";

export default function CitizenLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/citizen", icon: Home, label: "Home", end: true },
    { to: "/citizen/map", icon: Map, label: "Live Map" },
    { to: "/citizen/report", icon: FileText, label: "Report" },
    { to: "/citizen/alerts", icon: AlertCircle, label: "Alerts" },
  ];

  return (
    <div className="min-h-screen bg-bg-base flex flex-col pb-16 md:pb-0">
      <header className="sticky top-0 z-40 bg-bg-surface/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-critical" size={24} />
            <span className="font-extrabold text-lg tracking-tight text-white">
              AAPDA <span className="text-critical">MATRIX</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400 hidden sm:block">
              Hi, {user?.name?.split(" ")[0]}
            </span>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition" title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-bg-surface border-t border-white/5 md:hidden pb-safe">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center w-full h-full gap-1 text-[10px] font-medium transition-colors",
                  isActive ? "text-critical" : "text-slate-400 hover:text-slate-200"
                )
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
      <nav className="hidden md:flex fixed top-16 left-0 right-0 z-30 bg-bg-base border-b border-white/5 justify-center gap-8 h-12">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 h-full px-4 text-sm font-medium transition-colors border-b-2",
                isActive ? "border-critical text-critical" : "border-transparent text-slate-400 hover:text-slate-200"
              )
            }
          >
            <item.icon size={16} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}