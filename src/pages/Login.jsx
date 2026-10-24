import { useNavigate } from "react-router-dom";
import { ShieldAlert, User, Shield, Activity } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role) => {
    login(role);
    
    // Route based on role
    if (role === "citizen") navigate("/citizen");
    else if (role === "rescuer") navigate("/rescuer");
    else if (role === "admin") navigate("/admin");
  };

  const roles = [
    {
      id: "citizen",
      title: "Citizen",
      desc: "Report emergencies, view live maps, and find safe zones.",
      icon: User,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      hover: "hover:border-blue-400/50",
    },
    {
      id: "rescuer",
      title: "Rescuer",
      desc: "View active SOS requests, accept missions, and coordinate.",
      icon: Activity,
      color: "text-high",
      bg: "bg-high/10",
      hover: "hover:border-high/50",
    },
    {
      id: "admin",
      title: "Command Center",
      desc: "Monitor all alerts, track agencies, and manage resources.",
      icon: Shield,
      color: "text-critical",
      bg: "bg-critical/10",
      hover: "hover:border-critical/50",
    },
  ];

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-critical/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-critical/10 rounded-2xl mb-6">
            <ShieldAlert className="text-critical w-12 h-12" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            AAPDA <span className="text-critical">MATRIX</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Disaster Response Network. Select your role to enter the system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <Card
              key={role.id}
              className={`p-6 flex flex-col items-center text-center cursor-pointer transition-all duration-300 border border-white/5 bg-bg-surface/50 backdrop-blur-sm ${role.hover} hover:-translate-y-1`}
              onClick={() => handleLogin(role.id)}
            >
              <div className={`p-4 rounded-full mb-4 ${role.bg} ${role.color}`}>
                <role.icon size={32} />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">{role.title}</h2>
              <p className="text-sm text-slate-400 mb-6 flex-1">
                {role.desc}
              </p>
              <Button variant="secondary" className="w-full">
                Enter as {role.title}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}