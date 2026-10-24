import { useEffect, useMemo, useState } from 'react';
import {
  MapContainer, TileLayer, Marker, Popup, CircleMarker, Circle, useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Activity, AlertTriangle, Bell, CheckCircle2, ChevronRight, LogOut, MapPin,
  Menu, Phone, Radio, Shield, ShieldAlert, Siren, Users, LocateFixed,
  PlusCircle, Navigation, Clock3, Ban, Flame, BatteryFull, BatteryLow, BatteryWarning,
} from 'lucide-react';

/* ============================================================
   SEED — first load bootstrap only. After that, everything is
   persisted to localStorage under `am-alerts`.
   ============================================================ */
const seedAlerts = [
  {
    id: 'SOS-1001',
    type: 'Medical emergency',
    severity: 'critical',
    location: 'Vashi Sector 17, Navi Mumbai',
    lat: 19.077,
    lng: 73.002,
    status: 'active',
    time: new Date(Date.now() - 4 * 60000).toISOString(),
    description: 'Person needs urgent medical assistance.',
    redZone: null,
    battery: { level: 47, charging: false }, // sample — real ones come from navigator.getBattery()
  },
];

const zones = [
  { id: 1, name: 'Vashi Municipal School',  type: 'Shelter',  lat: 19.075, lng: 72.998, occupied: 120, capacity: 250 },
  { id: 2, name: 'Nerul Community Hall',     type: 'Shelter',  lat: 19.034, lng: 73.016, occupied: 86,  capacity: 180 },
  { id: 3, name: 'DY Patil Hospital',        type: 'Hospital', lat: 19.036, lng: 73.017, occupied: 0,   capacity: 0   },
  { id: 4, name: 'Apollo Hospital',          type: 'Hospital', lat: 19.022, lng: 73.057, occupied: 0,   capacity: 0   },
];

const teams = [
  { id: 1, name: 'Navi Mumbai Police',        type: 'Police', status: 'available' },
  { id: 2, name: 'Fire & Emergency Services', type: 'Fire',   status: 'responding' },
  { id: 3, name: 'NDRF Unit 5',               type: 'NDRF',   status: 'available' },
];

/* ============================================================
   Helpers
   ============================================================ */
const fmt = (v) =>
  new Date(v).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota */ }
}

/** Browser Battery Status API. Returns { level, charging } or nulls. */
async function readBattery() {
  if (!('getBattery' in navigator)) return { level: null, charging: null };
  try {
    const b = await navigator.getBattery();
    return {
      level: Math.round(b.level * 100),
      charging: b.charging,
    };
  } catch {
    return { level: null, charging: null };
  }
}

/* ============================================================
   Leaflet bits
   ============================================================ */
function Pin({ color = '#ef4444' }) {
  return L.divIcon({
    className: 'custom-pin',
    html: `<div style="background:${color};width:15px;height:15px;border:3px solid white;border-radius:50%;box-shadow:0 1px 9px #0008"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function Recenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 14);
  }, [position, map]);
  return null;
}

function MapView({ alerts, position, wide = false }) {
  return (
    <div className={`map-shell ${wide ? 'map-wide' : ''}`}>
      <MapContainer
        center={position || [19.076, 72.8777]}
        zoom={12}
        scrollWheelZoom
        className="leaflet-map"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter position={position} />

        {position && (
          <CircleMarker
            center={position}
            radius={8}
            pathOptions={{ color: '#2563eb', fillColor: '#60a5fa', fillOpacity: 1 }}
          >
            <Popup>Your current location (GPS)</Popup>
          </CircleMarker>
        )}

        {/* --- 10 m red zones first so pins draw on top --- */}
        {alerts
          .filter((a) => a.redZone?.active)
          .map((a) => (
            <Circle
              key={`rz-${a.id}`}
              center={[a.redZone.lat, a.redZone.lng]}
              radius={10}
              pathOptions={{
                color: '#dc2626',
                fillColor: '#ef4444',
                fillOpacity: 0.45,
                weight: 2,
              }}
            >
              <Popup>
                <b>RED ZONE — {a.type}</b>
                <br />
                {a.location}
                <br />
                Radius: 10 m
                <br />
                Declared by Command Center
              </Popup>
            </Circle>
          ))}

        {/* --- Incident pins --- */}
        {alerts
          .filter((a) => a.lat && a.lng && a.status !== 'resolved')
          .map((a) => (
            <Marker
              key={a.id}
              position={[a.lat, a.lng]}
              icon={Pin({ color: a.severity === 'critical' ? '#dc2626' : '#f97316' })}
            >
              <Popup>
                <b>{a.type}</b>
                <br />
                {a.location}
                <br />
                Status: {a.status}
                {a.battery?.level != null && (
                  <>
                    <br />
                    Battery: {a.battery.level}%
                    {a.battery.charging ? ' (charging)' : ''}
                  </>
                )}
              </Popup>
            </Marker>
          ))}

        {/* --- Safe zones --- */}
        {zones.map((z) => (
          <Marker
            key={z.id}
            position={[z.lat, z.lng]}
            icon={Pin({ color: z.type === 'Hospital' ? '#2563eb' : '#16a34a' })}
          >
            <Popup>
              <b>{z.name}</b>
              <br />
              {z.type}
              {z.type === 'Shelter' ? ` · ${z.capacity - z.occupied} spaces available` : ''}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="map-legend">
        <span><i className="dot red" /> SOS / incident</span>
        <span><i className="dot" style={{ background: '#ef4444', border: '2px solid #7f1d1d' }} /> Red zone (10 m)</span>
        <span><i className="dot green" /> Safe zone</span>
        <span><i className="dot blue" /> Hospital / you</span>
      </div>
    </div>
  );
}

/* ============================================================
   Small UI components
   ============================================================ */
function Status({ value }) {
  return <span className={`status status-${value}`}>{value}</span>;
}

function Stat({ icon: Icon, label, value, tone }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}><Icon size={20} /></div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

/** Battery badge — reads a.battery = { level, charging } */
function BatteryBadge({ battery }) {
  if (!battery || battery.level == null) {
    return (
      <span className="battery-badge na" title="Battery info unavailable in this browser">
        <BatteryWarning size={12} /> N/A
      </span>
    );
  }
  const tone =
    battery.level <= 15 ? 'critical' : battery.level <= 40 ? 'low' : 'ok';
  const Icon = tone === 'critical' ? BatteryWarning : tone === 'low' ? BatteryLow : BatteryFull;

  return (
    <span
      className={`battery-badge ${tone}`}
      title={`${battery.level}%${battery.charging ? ' (charging)' : ''}`}
    >
      <span className="battery-icon" aria-hidden="true">
        <span className="battery-fill" style={{ width: `${battery.level}%` }} />
      </span>
      <Icon size={12} />
      {battery.level}%
      {battery.charging && <span className="bolt">⚡</span>}
    </span>
  );
}

function IncidentList({
  alerts,
  actions = false,
  adminView = false,
  onAccept,
  onResolve,
  onRedZone,
}) {
  if (!alerts.length) {
    return (
      <div className="panel empty-state">
        <CheckCircle2 size={28} />
        <h3>All clear</h3>
        <p>No incidents to display.</p>
      </div>
    );
  }
  return (
    <div className="incident-list">
      {alerts.map((a) => (
        <article
          className={`incident-card ${a.status === 'resolved' ? 'is-resolved' : ''}`}
          key={a.id}
        >
          <div className={`incident-icon ${a.severity}`}>
            <AlertTriangle size={19} />
          </div>
          <div className="incident-main">
            <div className="incident-title">
              <h3>{a.type}</h3>
              <span className={`severity ${a.severity}`}>{a.severity}</span>
              {a.redZone?.active && (
                <span
                  className="severity critical"
                  style={{ background: '#7f1d1d', color: '#fecaca' }}
                >
                  RED ZONE
                </span>
              )}
            </div>
            <p className="muted incident-location">
              <MapPin size={14} />
              {a.location}
            </p>
            <p className="incident-desc">{a.description}</p>
            <div className="incident-meta">
              <span>{a.id}</span>
              <span><Clock3 size={13} />{fmt(a.time)}</span>
              <Status value={a.status} />
              <BatteryBadge battery={a.battery} />
            </div>
          </div>
          {actions && a.status !== 'resolved' && (
            <div className="incident-actions">
              {a.status !== 'responding' && (
                <button
                  className="button button-primary compact"
                  onClick={() => onAccept(a.id)}
                >
                  Accept
                </button>
              )}
              {adminView && (
                <button
                  className={`button compact ${a.redZone?.active ? 'button-outline' : 'button-danger'}`}
                  onClick={() => onRedZone(a.id)}
                >
                  {a.redZone?.active ? 'Lift Red Zone' : 'Declare Red Zone'}
                </button>
              )}
              <button
                className="button button-outline compact"
                onClick={() => onResolve(a.id)}
              >
                Resolve
              </button>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

function AgencyPanel({ expanded = false }) {
  return (
    <div className="panel agency-panel">
      <div className="panel-heading">
        <div>
          <h3>Agency status</h3>
          <p className="muted">Coordination overview</p>
        </div>
        <Users size={19} />
      </div>
      {teams.map((t) => (
        <div className="agency-row" key={t.id}>
          <div className="agency-avatar">
            {t.type === 'Police' ? 'P' : t.type === 'Fire' ? 'F' : 'N'}
          </div>
          <div className="agency-info">
            <b>{t.name}</b>
            <small>{t.type} agency</small>
          </div>
          <Status value={t.status} />
        </div>
      ))}
      {expanded && (
        <div className="agency-note">
          <Radio size={16} /> Agency statuses are configured statically in this prototype.
        </div>
      )}
    </div>
  );
}

function ReportForm({
  reportType, setReportType,
  severity, setSeverity,
  reportLocation, setReportLocation,
  reportDetails, setReportDetails,
  submitReport,
}) {
  return (
    <div className="form-layout">
      <div className="page-intro">
        <h2>Report a disaster</h2>
        <p className="muted">Share incident details so responders can assess the situation.</p>
      </div>
      <form className="panel report-form" onSubmit={submitReport}>
        <div className="form-field">
          <label>Incident type</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option>Flood</option>
            <option>Fire</option>
            <option>Road accident</option>
            <option>Building collapse</option>
            <option>Medical emergency</option>
            <option>Other</option>
          </select>
        </div>
        <div className="form-field">
          <label>Severity</label>
          <div className="choice-row">
            {['low', 'high', 'critical'].map((s) => (
              <button
                type="button"
                key={s}
                className={`choice ${severity === s ? 'active' : ''} ${s}`}
                onClick={() => setSeverity(s)}
              >
                {s[0].toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="form-field">
          <label>Location / landmark (optional)</label>
          <input
            value={reportLocation}
            onChange={(e) => setReportLocation(e.target.value)}
            placeholder="e.g. Vashi Sector 17, near bus depot"
          />
        </div>
        <div className="form-field">
          <label>What is happening?</label>
          <textarea
            value={reportDetails}
            onChange={(e) => setReportDetails(e.target.value)}
            rows="4"
            placeholder="Describe the situation, people affected, and any immediate risks…"
          />
        </div>
        <div className="form-help">
          <MapPin size={16} /> GPS permission is required to attach your location. Your battery % is also attached.
        </div>
        <button className="button button-primary full" type="submit">
          Submit disaster report <ChevronRight size={17} />
        </button>
      </form>
    </div>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */
function App() {
  const [role, setRole] = useState(localStorage.getItem('am-role') || '');
  const [page, setPage] = useState('dashboard');

  const [alerts, setAlerts] = useState(() => load('am-alerts', seedAlerts));
  const [position, setPosition] = useState(null);

  const [showSOS, setShowSOS] = useState(false);
  const [sosType, setSosType] = useState('Medical emergency');
  const [modalBattery, setModalBattery] = useState({ level: null, charging: null });

  const [reportType, setReportType] = useState('Flood');
  const [severity, setSeverity] = useState('high');
  const [reportLocation, setReportLocation] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  const [notice, setNotice] = useState('');
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => { save('am-alerts', alerts); }, [alerts]);

  // Read battery when the SOS modal opens so the user can see it before confirming.
  useEffect(() => {
    if (showSOS) readBattery().then(setModalBattery);
  }, [showSOS]);

  const active = useMemo(
    () => alerts.filter((a) => a.status !== 'resolved'),
    [alerts]
  );

  const gps = () =>
    new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 7000 }
      );
    });

  const login = (r) => {
    setRole(r);
    localStorage.setItem('am-role', r);
    setPage('dashboard');
  };
  const logout = () => {
    setRole('');
    localStorage.removeItem('am-role');
    setPage('dashboard');
  };

  /* ------------ SOS submission (GPS + battery) ------------ */
  const sendSOS = async () => {
    const p = await gps();
    if (p) setPosition([p.lat, p.lng]);
    if (!p) {
      setNotice('GPS permission is required to send SOS. Please allow location and try again.');
      return;
    }
    const bat = await readBattery();

    const a = {
      id: `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
      type: sosType,
      severity: 'critical',
      location: `${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}`,
      lat: p.lat,
      lng: p.lng,
      status: 'active',
      time: new Date().toISOString(),
      description: 'Citizen SOS submitted from Aapda Matrix.',
      redZone: null,
      battery: bat,
    };
    setAlerts((prev) => [a, ...prev]);
    setShowSOS(false);
    setPage('dashboard');
    setNotice(`SOS ${a.id} submitted. Keep your phone accessible.`);
  };

  /* ------------ Report submission (GPS + battery) ------------ */
  const submitReport = async (e) => {
    e.preventDefault();
    const p = await gps();
    if (p) setPosition([p.lat, p.lng]);
    if (!p) {
      setNotice('GPS permission is required to submit a report with a map pin. Please allow location.');
      return;
    }
    const bat = await readBattery();

    const a = {
      id: `RPT-${Math.floor(100 + Math.random() * 900)}`,
      type: reportType,
      severity,
      location: reportLocation || `${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}`,
      lat: p.lat,
      lng: p.lng,
      status: 'active',
      time: new Date().toISOString(),
      description: reportDetails || `${reportType} reported by citizen.`,
      redZone: null,
      battery: bat,
    };
    setAlerts((prev) => [a, ...prev]);
    setReportLocation('');
    setReportDetails('');
    setNotice('Disaster report submitted successfully.');
    setPage('alerts');
  };

  const act = (id, status) =>
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));

  /* ------------ Command Center: 10 m red zone ------------ */
  const declareRedZone = (id) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              redZone: a.redZone?.active
                ? { ...a.redZone, active: false }
                : {
                    lat: a.lat,
                    lng: a.lng,
                    radius: 10,
                    active: true,
                    declaredAt: new Date().toISOString(),
                  },
            }
          : a
      )
    );
    setNotice(`Red zone toggled for incident ${id}.`);
  };

  /* ============================================================
     Login screen
     ============================================================ */
  if (!role) {
    return (
      <div className="login-page">
        <div className="login-top">
          <div className="brand-mark"><ShieldAlert size={30} /></div>
          <p className="eyebrow">DISASTER RESPONSE NETWORK</p>
          <h1>AAPDA <span>MATRIX</span></h1>
          <p className="login-copy">
            When every second matters, connect citizens, responders and command teams in one coordinated response.
          </p>
        </div>
        <div className="role-grid">
          {[
            { id: 'citizen', name: 'Citizen',        desc: 'Send SOS, report disasters and find nearby safe zones.' },
            { id: 'rescuer', name: 'Rescuer',        desc: 'Accept emergency requests and update mission status.' },
            { id: 'admin',   name: 'Command Center', desc: 'Monitor incidents, declare red zones and coordinate agencies.' },
          ].map((r, i) => (
            <button className="role-card" key={r.id} onClick={() => login(r.id)}>
              <div className={`role-icon role-${r.id}`}>
                {i === 0 ? <Users /> : i === 1 ? <Siren /> : <Shield />}
              </div>
              <h2>{r.name}</h2>
              <p>{r.desc}</p>
              <span>Enter workspace <ChevronRight size={17} /></span>
            </button>
          ))}
        </div>
        <p className="demo-note">
          <Radio size={14} /> DEMO MODE · Data is stored locally in your browser
        </p>
      </div>
    );
  }

  /* ============================================================
     Navigation
     ============================================================ */
  const nav =
    role === 'citizen'
      ? [
          ['dashboard', 'Overview', Activity],
          ['map', 'Live map', MapPin],
          ['alerts', 'Alerts & warnings', Bell],
          ['report', 'Report disaster', PlusCircle],
          ['safe', 'Safe zones', Shield],
        ]
      : role === 'rescuer'
      ? [
          ['dashboard', 'Rescue dashboard', Activity],
          ['map', 'Incident map', MapPin],
          ['alerts', 'SOS requests', Siren],
        ]
      : [
          ['dashboard', 'Command center', Activity],
          ['map', 'Live operations map', MapPin],
          ['alerts', 'Incident management', Bell],
          ['teams', 'Agency coordination', Users],
          ['safe', 'Safe zones & capacity', Shield],
        ];

  const title = nav.find((n) => n[0] === page)?.[1] || 'Overview';

  const sidebar = (
    <>
      <div className="side-brand">
        <div className="brand-mark small"><ShieldAlert size={22} /></div>
        <div>
          <b>AAPDA <span>MATRIX</span></b>
          <small>RESPONSE NETWORK</small>
        </div>
      </div>
      <div className="role-label">
        WORKSPACE <span>{role === 'admin' ? 'COMMAND' : role.toUpperCase()}</span>
      </div>
      <nav>
        {nav.map(([id, label, Icon]) => (
          <button
            key={id}
            className={`nav-item ${page === id ? 'selected' : ''}`}
            onClick={() => {
              setPage(id);
              setMobileNav(false);
            }}
          >
            <Icon size={18} />
            {label}
            {id === 'alerts' && active.length > 0 && <em>{active.length}</em>}
          </button>
        ))}
      </nav>
      <div className="side-bottom">
        <div className="connection">
          <span className="pulse-dot" /> Local system online
          <small>Browser-persisted data</small>
        </div>
        <button className="nav-item logout" onClick={logout}>
          <LogOut size={18} /> Switch role
        </button>
      </div>
    </>
  );

  /* ============================================================
     App shell
     ============================================================ */
  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'mobile-open' : ''}`}>{sidebar}</aside>
      {mobileNav && (
        <button className="scrim" onClick={() => setMobileNav(false)} aria-label="Close menu" />
      )}

      <main className="main-area">
        <header className="topbar">
          <button className="icon-btn menu-btn" onClick={() => setMobileNav(!mobileNav)}>
            <Menu />
          </button>
          <div>
            <div className="breadcrumb">
              AAPDA MATRIX / <b>{title.toUpperCase()}</b>
            </div>
            <h1>{title}</h1>
          </div>
          <div className="top-actions">
            <span className="live-pill"><i /> LIVE</span>
            <button className="icon-btn" title="Alerts" onClick={() => setPage('alerts')}>
              <Bell size={19} />
              {active.length > 0 && <b className="notif-count">{active.length}</b>}
            </button>
            <div className="avatar">
              {role === 'admin' ? 'CC' : role === 'rescuer' ? 'RS' : 'CT'}
            </div>
          </div>
        </header>

        {notice && (
          <div className="notice">
            <CheckCircle2 size={18} />
            {notice}
            <button onClick={() => setNotice('')}>×</button>
          </div>
        )}

        <div className="content">
          {/* ---------------- Citizen dashboard ---------------- */}
          {page === 'dashboard' && role === 'citizen' && (
            <>
              <div className="welcome-row">
                <div>
                  <p className="eyebrow">CITIZEN SAFETY PORTAL</p>
                  <h2>Your safety comes first.</h2>
                  <p className="muted">Get help quickly or stay informed about nearby incidents.</p>
                </div>
                <span className="date-label">
                  <Clock3 size={15} />
                  {new Date().toLocaleDateString(undefined, {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>

              <div className="stats-grid">
                <Stat icon={AlertTriangle} label="Active incidents" value={active.length} tone="red" />
                <Stat icon={Shield} label="Nearby safe zones" value={zones.filter((z) => z.type === 'Shelter').length} tone="green" />
                <Stat icon={Ban} label="Red zones active" value={alerts.filter((a) => a.redZone?.active).length} tone="orange" />
              </div>

              <section className="sos-panel">
                <div className="sos-copy">
                  <span className="sos-kicker">
                    <span className="pulse-dot red-pulse" /> EMERGENCY ASSISTANCE
                  </span>
                  <h2>Need immediate help?</h2>
                  <p>Send your GPS location and emergency type to the response network.</p>
                  <button className="button button-danger" onClick={() => setShowSOS(true)}>
                    <Siren size={19} /> Trigger SOS <ChevronRight size={17} />
                  </button>
                  <button
                    className="button button-ghost"
                    onClick={() => (window.location.href = 'tel:112')}
                  >
                    <Phone size={17} /> Call 112 helpline
                  </button>
                </div>
                <div className="sos-orb">
                  <div>
                    <Siren size={42} />
                    <b>SOS</b>
                    <small>EMERGENCY</small>
                  </div>
                </div>
              </section>

              <div className="section-head">
                <div>
                  <h3>Nearby activity</h3>
                  <p className="muted">Current incidents and response updates</p>
                </div>
                <button className="text-button" onClick={() => setPage('alerts')}>
                  View all <ChevronRight size={16} />
                </button>
              </div>

              <div className="two-col">
                <IncidentList alerts={alerts.slice(0, 3)} />
                <div className="panel map-preview">
                  <div className="panel-heading">
                    <div>
                      <h3>Area overview</h3>
                      <p className="muted">Incidents, red zones & safe zones</p>
                    </div>
                    <button className="icon-btn" onClick={() => setPage('map')}>
                      <Navigation size={17} />
                    </button>
                  </div>
                  <MapView alerts={alerts} position={position} />
                  <button
                    className="button button-outline full"
                    onClick={() => setPage('map')}
                  >
                    Open live map <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ---------------- Rescuer dashboard ---------------- */}
          {page === 'dashboard' && role === 'rescuer' && (
            <>
              <div className="welcome-row">
                <div>
                  <p className="eyebrow">FIELD RESPONSE</p>
                  <h2>Rescue operations</h2>
                  <p className="muted">Review incoming requests and keep incident status up to date.</p>
                </div>
                <span className="live-pill"><i /> Dispatch active</span>
              </div>
              <div className="stats-grid">
                <Stat icon={Siren} label="Open requests" value={active.length} tone="red" />
                <Stat icon={Activity} label="Responding" value={alerts.filter((a) => a.status === 'responding').length} tone="orange" />
                <Stat icon={CheckCircle2} label="Resolved" value={alerts.filter((a) => a.status === 'resolved').length} tone="green" />
              </div>
              <div className="section-head">
                <div>
                  <h3>Incoming SOS requests</h3>
                  <p className="muted">Accept a request to mark your team as responding</p>
                </div>
              </div>
              <IncidentList
                alerts={alerts}
                actions
                onAccept={(id) => act(id, 'responding')}
                onResolve={(id) => act(id, 'resolved')}
              />
            </>
          )}

          {/* ---------------- Command Center dashboard ---------------- */}
          {page === 'dashboard' && role === 'admin' && (
            <>
              <div className="welcome-row">
                <div>
                  <p className="eyebrow">EMERGENCY OPERATIONS</p>
                  <h2>Command center overview</h2>
                  <p className="muted">Monitor incidents, declare red zones and coordinate agencies.</p>
                </div>
                <span className="live-pill"><i /> Network operational</span>
              </div>
              <div className="stats-grid">
                <Stat icon={Siren} label="Total active SOS" value={active.length} tone="red" />
                <Stat icon={AlertTriangle} label="Critical incidents" value={active.filter((a) => a.severity === 'critical').length} tone="orange" />
                <Stat icon={Ban} label="Active red zones" value={alerts.filter((a) => a.redZone?.active).length} tone="red" />
                <Stat icon={Shield} label="Safe zones" value={zones.filter((z) => z.type === 'Shelter').length} tone="blue" />
              </div>
              <div className="panel command-map">
                <div className="panel-heading">
                  <div>
                    <h3>Live operations map</h3>
                    <p className="muted">Red zones render as a 10 m radius circle around the incident</p>
                  </div>
                  <span className="live-pill"><i /> Local sync</span>
                </div>
                <MapView alerts={alerts} position={position} wide />
              </div>
              <div className="two-col">
                <div>
                  <div className="section-head">
                    <div>
                      <h3>Live incident feed</h3>
                      <p className="muted">Declare a 10 m red zone to warn citizens</p>
                    </div>
                    <button className="text-button" onClick={() => setPage('alerts')}>
                      Manage all <ChevronRight size={16} />
                    </button>
                  </div>
                  <IncidentList
                    alerts={alerts.slice(0, 4)}
                    adminView
                    onAccept={(id) => act(id, 'responding')}
                    onResolve={(id) => act(id, 'resolved')}
                    onRedZone={declareRedZone}
                  />
                </div>
                <AgencyPanel />
              </div>
            </>
          )}

          {/* ---------------- Map page ---------------- */}
          {page === 'map' && (
            <>
              <div className="page-intro">
                <div>
                  <h2>Live incident map</h2>
                  <p className="muted">
                    Allow location access to show your current GPS position. Red zones appear as a
                    10 m radius circle.
                  </p>
                </div>
                <button
                  className="button button-outline"
                  onClick={async () => {
                    const p = await gps();
                    if (p) {
                      setPosition([p.lat, p.lng]);
                      setNotice('Current location found.');
                    } else {
                      setNotice('Location unavailable. Check browser permissions.');
                    }
                  }}
                >
                  <LocateFixed size={17} /> Locate me
                </button>
              </div>
              <MapView alerts={alerts} position={position} wide />
              <div className="map-summary">
                <span><i className="dot red" /> {active.length} active incidents</span>
                <span>
                  <i className="dot" style={{ background: '#ef4444', border: '2px solid #7f1d1d' }} />{' '}
                  {alerts.filter((a) => a.redZone?.active).length} red zones
                </span>
                <span><i className="dot green" /> {zones.filter((z) => z.type === 'Shelter').length} shelters</span>
                <span><i className="dot blue" /> {zones.filter((z) => z.type === 'Hospital').length} hospitals</span>
              </div>
            </>
          )}

          {/* ---------------- Alerts page ---------------- */}
          {page === 'alerts' && (
            <>
              <div className="page-intro">
                <div>
                  <h2>
                    {role === 'rescuer'
                      ? 'SOS request queue'
                      : 'Incident & alert management'}
                  </h2>
                  <p className="muted">
                    {role === 'admin'
                      ? 'Review each incident and declare a 10 m red zone if the calamity warrants it. Battery % of the sender is shown on every card.'
                      : 'Review status, location, sender battery and severity for each report.'}
                  </p>
                </div>
                {role === 'citizen' && (
                  <button className="button button-primary" onClick={() => setPage('report')}>
                    <PlusCircle size={17} /> Report incident
                  </button>
                )}
              </div>
              <IncidentList
                alerts={alerts}
                actions={role !== 'citizen'}
                adminView={role === 'admin'}
                onAccept={(id) => act(id, 'responding')}
                onResolve={(id) => act(id, 'resolved')}
                onRedZone={declareRedZone}
              />
            </>
          )}

          {/* ---------------- Report form ---------------- */}
          {page === 'report' && (
            <ReportForm
              reportType={reportType}
              setReportType={setReportType}
              severity={severity}
              setSeverity={setSeverity}
              reportLocation={reportLocation}
              setReportLocation={setReportLocation}
              reportDetails={reportDetails}
              setReportDetails={setReportDetails}
              submitReport={submitReport}
            />
          )}

          {/* ---------------- Agency coordination ---------------- */}
          {page === 'teams' && (
            <>
              <div className="page-intro">
                <h2>Agency coordination</h2>
                <p className="muted">Current agency availability.</p>
              </div>
              <AgencyPanel expanded />
            </>
          )}

          {/* ---------------- Safe zones ---------------- */}
          {page === 'safe' && (
            <>
              <div className="page-intro">
                <h2>Safe zones & medical facilities</h2>
                <p className="muted">Check shelter capacity and locate nearby hospitals on the map.</p>
              </div>
              <div className="safe-grid">
                {zones.map((z) => (
                  <div className="panel safe-card" key={z.id}>
                    <div className={`safe-icon ${z.type === 'Hospital' ? 'hospital' : ''}`}>
                      {z.type === 'Hospital' ? <PlusCircle /> : <Shield />}
                    </div>
                    <div>
                      <span className="eyebrow">{z.type.toUpperCase()}</span>
                      <h3>{z.name}</h3>
                      <p className="muted">
                        <MapPin size={14} />
                        {z.lat.toFixed(3)}, {z.lng.toFixed(3)}
                      </p>
                      {z.type === 'Shelter' && (
                        <>
                          <div className="capacity-line">
                            <span>Occupancy</span>
                            <b>{z.occupied}/{z.capacity}</b>
                          </div>
                          <div className="capacity-bar">
                            <span style={{ width: `${(z.occupied / z.capacity) * 100}%` }} />
                          </div>
                          <small className="muted">
                            {z.capacity - z.occupied} spaces available
                          </small>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <MapView alerts={alerts} position={position} wide />
            </>
          )}
        </div>

        <footer className="footer">
          <span>AAPDA MATRIX · Disaster Response Prototype</span>
          <span>Browser-persisted data · Not connected to emergency services</span>
        </footer>
      </main>

      {/* ---------------- SOS modal ---------------- */}
      {showSOS && (
        <div className="modal-backdrop" onClick={() => setShowSOS(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowSOS(false)}>×</button>
            <div className="modal-symbol"><Siren size={27} /></div>
            <h2>Confirm emergency SOS</h2>
            <p className="muted">
              This creates a local incident. It does not contact real emergency services.
            </p>
            <label>Emergency type</label>
            <select value={sosType} onChange={(e) => setSosType(e.target.value)}>
              <option>Medical emergency</option>
              <option>Fire</option>
              <option>Flood</option>
              <option>Trapped / rescue needed</option>
              <option>Other emergency</option>
            </select>
            <div className="modal-warning">
              <MapPin size={17} /> GPS permission is required. If blocked, SOS cannot be sent.
              {modalBattery.level != null && (
                <>
                  {' '}
                  Battery: <b>{modalBattery.level}%</b>
                  {modalBattery.charging ? ' (charging)' : ''}.
                </>
              )}
            </div>
            <button className="button button-danger full" onClick={sendSOS}>
              <Siren size={18} /> Confirm & submit SOS
            </button>
            <button
              className="button button-outline full"
              onClick={() => setShowSOS(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;