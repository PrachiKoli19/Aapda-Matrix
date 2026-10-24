// Users for Auth
export const mockUsers = [
  { id: "U-01", name: "Aarav (Citizen)", role: "citizen", phone: "+91 98765 43210" },
  { id: "U-02", name: "Unit Alpha (Rescuer)", role: "rescuer", phone: "+91 98765 11111" },
  { id: "U-03", name: "Command Center (Admin)", role: "admin", phone: "100" },
];

// Active Alerts / SOS Requests
export const mockAlerts = [
  {
    id: "A-1001",
    type: "Flood",
    severity: "critical",
    location: "Sector 14, Riverside",
    lat: 28.6139,
    lng: 77.209,
    time: new Date(Date.now() - 12 * 60000).toISOString(), // 12 mins ago
    status: "active",
    description: "Water level rising rapidly, 3 families stranded.",
  },
  {
    id: "A-1002",
    type: "Fire",
    severity: "high",
    location: "Industrial Area, Block C",
    lat: 28.6205,
    lng: 77.218,
    time: new Date(Date.now() - 42 * 60000).toISOString(), // 42 mins ago
    status: "responding",
    description: "Warehouse fire, 2 units on scene.",
  },
  {
    id: "A-1003",
    type: "Building Collapse",
    severity: "critical",
    location: "Old Town, Lane 7",
    lat: 28.606,
    lng: 77.203,
    time: new Date(Date.now() - 8 * 60000).toISOString(), // 8 mins ago
    status: "active",
    description: "Partial collapse reported, casualties unknown.",
  },
];

// Safe Zones / Shelters
export const mockSafeZones = [
  {
    id: "Z-01",
    name: "Central High School Shelter",
    lat: 28.611,
    lng: 77.212,
    capacity: 400,
    occupied: 210,
    status: "open",
  },
  {
    id: "Z-02",
    name: "Stadium Relief Camp",
    lat: 28.618,
    lng: 77.2,
    capacity: 1200,
    occupied: 640,
    status: "open",
  },
  {
    id: "Z-03",
    name: "Community Center",
    lat: 28.626,
    lng: 77.216,
    capacity: 250,
    occupied: 250,
    status: "full",
  },
];

// Rescue Teams
export const mockRescuers = [
  { id: "R-01", name: "Fire Unit Alpha", type: "Fire & Rescue", lat: 28.614, lng: 77.208, status: "on-mission" },
  { id: "R-02", name: "Medic Bravo", type: "Medical", lat: 28.622, lng: 77.221, status: "available" },
  { id: "R-03", name: "NDRF Charlie", type: "Disaster Relief", lat: 28.605, lng: 77.199, status: "on-mission" },
];