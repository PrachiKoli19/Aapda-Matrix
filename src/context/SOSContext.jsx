import { createContext, useContext, useState } from "react";
import { mockAlerts, mockSafeZones, mockRescuers } from "../data/mockData";

const SOSContext = createContext(null);

export function SOSProvider({ children }) {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [safeZones, setSafeZones] = useState(mockSafeZones);
  const [rescuers, setRescuers] = useState(mockRescuers);

  // Trigger a new SOS
  const triggerSOS = (type, locationStr) => {
    const newAlert = {
      id: `SOS-${Math.floor(Math.random() * 10000)}`,
      type: type || "General Emergency",
      severity: "critical",
      location: locationStr || "Unknown Location",
      time: new Date().toISOString(),
      status: "active",
      description: "SOS Triggered via App",
    };
    setAlerts((prev) => [newAlert, ...prev]);
    return newAlert;
  };

  // Rescuer accepts an SOS
  const acceptAlert = (id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "responding" } : a))
    );
  };

  // Rescuer resolves an SOS
  const resolveAlert = (id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "resolved" } : a))
    );
  };

  return (
    <SOSContext.Provider
      value={{
        alerts,
        safeZones,
        rescuers,
        triggerSOS,
        acceptAlert,
        resolveAlert,
        activeAlerts: alerts.filter((a) => a.status !== "resolved"),
        criticalAlerts: alerts.filter((a) => a.severity === "critical" && a.status !== "resolved"),
      }}
    >
      {children}
    </SOSContext.Provider>
  );
}

export function useSOS() {
  const context = useContext(SOSContext);
  if (!context) {
    throw new Error("useSOS must be used within a SOSProvider");
  }
  return context;
}