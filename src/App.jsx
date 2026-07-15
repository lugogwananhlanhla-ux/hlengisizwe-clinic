import { useState, useEffect, useRef } from "react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const colors = {
  primary: "#0A6E4E",
  primaryLight: "#12936A",
  primaryDark: "#064A34",
  primaryBg: "#E8F5F0",
  accent: "#1A6EAA",
  accentLight: "#2A8ED0",
  accentBg: "#E8F2FA",
  danger: "#C0392B",
  dangerBg: "#FDECEA",
  warning: "#D4840A",
  warningBg: "#FEF3E2",
  success: "#0A7C4E",
  successBg: "#E6F5EE",
  white: "#FFFFFF",
  bg: "#F4F7F5",
  surface: "#FFFFFF",
  surfaceAlt: "#F0F4F2",
  border: "#D5E4DE",
  text: "#1A2E25",
  textMuted: "#5A7A6E",
  textLight: "#8AA89E",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_USERS = {
  patient: { id: "P001", name: "Thabo Dlamini", role: "patient", email: "thabo@email.com", dob: "1988-03-15", phone: "071 234 5678", emergency: "072 987 6543", photo: null },
  doctor: { id: "D001", name: "Dr. Nomsa Khumalo", role: "doctor", email: "dr.khumalo@hlengisizwe.co.za", specialty: "General Practitioner", photo: null },
  reception: { id: "R001", name: "Zanele Mokoena", role: "reception", email: "zanele@hlengisizwe.co.za", photo: null },
  fileroom: { id: "F001", name: "Sipho Ndlovu", role: "fileroom", email: "sipho@hlengisizwe.co.za", photo: null },
  admin: { id: "A001", name: "Dr. Lungelo Zulu", role: "admin", email: "admin@hlengisizwe.co.za", photo: null },
};

const DEMO_CREDS = {
  "patient@demo.com": { password: "patient123", user: MOCK_USERS.patient },
  "doctor@demo.com": { password: "doctor123", user: MOCK_USERS.doctor },
  "reception@demo.com": { password: "reception123", user: MOCK_USERS.reception },
  "fileroom@demo.com": { password: "fileroom123", user: MOCK_USERS.fileroom },
  "admin@demo.com": { password: "admin123", user: MOCK_USERS.admin },
};

const MOCK_PATIENTS = [
  { id: "P001", name: "Thabo Dlamini", dob: "1988-03-15", phone: "071 234 5678", patientNo: "HLC-2024-001", department: "General", priority: "Normal", status: "checked-in" },
  { id: "P002", name: "Lindiwe Shabalala", dob: "1995-07-22", phone: "082 345 6789", patientNo: "HLC-2024-002", department: "Maternal Health", priority: "High", status: "waiting" },
  { id: "P003", name: "Bongani Ntuli", dob: "1972-11-08", phone: "079 456 7890", patientNo: "HLC-2024-003", department: "Chronic", priority: "Normal", status: "with-doctor" },
  { id: "P004", name: "Nokwanda Cele", dob: "2002-05-14", phone: "064 567 8901", patientNo: "HLC-2024-004", department: "General", priority: "Low", status: "file-retrieved" },
];

const MOCK_APPOINTMENTS = [
  { id: "A001", patient: "Thabo Dlamini", doctor: "Dr. Khumalo", date: "2026-06-06", time: "09:00", type: "Follow-up", status: "confirmed", department: "General" },
  { id: "A002", patient: "Thabo Dlamini", doctor: "Dr. Khumalo", date: "2026-06-20", time: "10:30", type: "Chronic Review", status: "pending", department: "Chronic" },
  { id: "A003", patient: "Lindiwe Shabalala", doctor: "Dr. Moyo", date: "2026-06-07", time: "08:30", type: "Antenatal", status: "confirmed", department: "Maternal" },
];

const MOCK_NOTIFICATIONS = [
  { id: "N001", type: "arrival", message: "Thabo Dlamini has arrived — Patient HLC-2024-001", time: "08:47", priority: "Normal", dept: "General", unread: true },
  { id: "N002", type: "arrival", message: "Lindiwe Shabalala has arrived — Patient HLC-2024-002", time: "08:52", priority: "High", dept: "Maternal", unread: true },
  { id: "N003", type: "appointment", message: "Your appointment is tomorrow at 09:00 with Dr. Khumalo", time: "Yesterday", unread: false },
  { id: "N004", type: "lab", message: "Your laboratory results are now available", time: "2 days ago", unread: false },
];

const MOCK_FILES = [
  { id: "FILE001", patient: "Thabo Dlamini", patientNo: "HLC-2024-001", status: "With Doctor", location: "Consultation Room 2", handler: "Dr. Khumalo", updated: "09:15", history: ["08:47 – Arrival scanned", "08:50 – File retrieved by Sipho", "09:00 – Delivered to Reception", "09:15 – With Doctor"] },
  { id: "FILE002", patient: "Lindiwe Shabalala", patientNo: "HLC-2024-002", status: "Awaiting Retrieval", location: "File Room — Row C, Shelf 4", handler: "Unassigned", updated: "08:52", history: ["08:52 – Arrival scanned"] },
  { id: "FILE003", patient: "Bongani Ntuli", patientNo: "HLC-2024-003", status: "Returned to File Room", location: "File Room — Row A, Shelf 2", handler: "Sipho Ndlovu", updated: "08:30", history: ["07:45 – Arrival scanned", "07:50 – File retrieved", "08:00 – At Reception", "08:15 – With Doctor", "08:30 – Returned"] },
];

const MOCK_RECORDS = [
  { date: "2026-05-15", type: "Consultation", doctor: "Dr. Khumalo", diagnosis: "Hypertension follow-up", notes: "BP 138/88 — stable. Continue current medication.", rx: "Amlodipine 5mg daily" },
  { date: "2026-04-02", type: "Lab Results", doctor: "Dr. Moyo", diagnosis: "Routine blood work", notes: "HbA1c 6.1%, Cholesterol within range.", rx: null },
  { date: "2026-03-10", type: "Consultation", doctor: "Dr. Khumalo", diagnosis: "Hypertension management", notes: "Initiated antihypertensive therapy.", rx: "Amlodipine 5mg daily, Hydrochlorothiazide 12.5mg" },
];

const ANALYTICS = {
  dailyPatients: [42, 38, 55, 61, 47, 58, 44],
  monthlyPatients: [820, 945, 1023, 987, 1102, 1045],
  departments: { General: 45, Maternal: 20, Chronic: 25, Pediatric: 10 },
  filePerformance: 92,
  avgWaitTime: 18,
  activeDoctors: 7,
  todayCount: 58,
};

// ─── Utility ──────────────────────────────────────────────────────────────────
const roleColors = {
  patient: colors.accent,
  doctor: colors.primary,
  reception: "#7B52AB",
  fileroom: "#D4840A",
  admin: "#C0392B",
};

const roleLabels = {
  patient: "Patient",
  doctor: "Doctor",
  reception: "Reception Staff",
  fileroom: "File Room Staff",
  admin: "Administrator",
};

const fileStatusColors = {
  "Awaiting Retrieval": colors.warning,
  "Being Retrieved": colors.accent,
  "At Reception": "#7B52AB",
  "With Nurse": colors.primaryLight,
  "With Doctor": colors.primary,
  "Returned to File Room": colors.textMuted,
};

function Avatar({ name, size = 40, color = colors.primary }) {
  const initials = name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${color}, ${color}99)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 700, fontSize: size * 0.36,
      fontFamily: "'DM Sans', sans-serif", flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

function Badge({ label, color = colors.primary, bg }) {
  return (
    <span style={{
      background: bg || color + "22", color, fontSize: 11, fontWeight: 700,
      padding: "3px 10px", borderRadius: 20, fontFamily: "'DM Sans', sans-serif",
      letterSpacing: "0.03em", textTransform: "uppercase",
    }}>{label}</span>
  );
}

function Card({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: colors.white, borderRadius: 16, border: `1px solid ${colors.border}`,
      padding: 20, boxShadow: "0 2px 12px rgba(10,110,78,0.06)",
      cursor: onClick ? "pointer" : "default",
      transition: "box-shadow 0.2s, transform 0.2s",
      ...style,
    }}
      onMouseEnter={e => onClick && (e.currentTarget.style.boxShadow = "0 6px 24px rgba(10,110,78,0.12)")}
      onMouseLeave={e => onClick && (e.currentTarget.style.boxShadow = "0 2px 12px rgba(10,110,78,0.06)")}
    >{children}</div>
  );
}

function StatCard({ icon, label, value, color = colors.primary, sub }) {
  return (
    <Card style={{ flex: 1, minWidth: 140 }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: "'DM Serif Display', serif", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>{sub}</div>}
    </Card>
  );
}

function SectionHeader({ title, sub, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 16 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: colors.text, fontFamily: "'DM Serif Display', serif" }}>{title}</h2>
        {sub && <p style={{ margin: "4px 0 0", fontSize: 13, color: colors.textMuted }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder, icon }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: colors.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>}
      <div style={{ position: "relative" }}>
        {icon && <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>{icon}</span>}
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={{
            width: "100%", padding: icon ? "10px 12px 10px 38px" : "10px 14px", borderRadius: 10,
            border: `1.5px solid ${colors.border}`, fontSize: 14, color: colors.text,
            background: colors.surfaceAlt, outline: "none", boxSizing: "border-box",
            fontFamily: "'DM Sans', sans-serif",
            transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = colors.primary}
          onBlur={e => e.target.style.borderColor = colors.border}
        />
      </div>
    </div>
  );
}

function Button({ children, onClick, variant = "primary", size = "md", full, disabled, style = {} }) {
  const base = {
    border: "none", cursor: disabled ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700, borderRadius: 10, transition: "all 0.2s", display: "inline-flex",
    alignItems: "center", gap: 6, opacity: disabled ? 0.6 : 1,
    width: full ? "100%" : "auto", justifyContent: "center",
    padding: size === "sm" ? "7px 14px" : size === "lg" ? "14px 28px" : "10px 20px",
    fontSize: size === "sm" ? 12 : size === "lg" ? 15 : 13,
  };
  const variants = {
    primary: { background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`, color: "#fff", boxShadow: "0 2px 10px rgba(10,110,78,0.3)" },
    secondary: { background: colors.primaryBg, color: colors.primary },
    accent: { background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentLight})`, color: "#fff" },
    danger: { background: colors.dangerBg, color: colors.danger },
    ghost: { background: "transparent", color: colors.textMuted, border: `1px solid ${colors.border}` },
  };
  return (
    <button onClick={disabled ? null : onClick} style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={e => !disabled && (e.currentTarget.style.filter = "brightness(1.08)")}
      onMouseLeave={e => (e.currentTarget.style.filter = "none")}
    >{children}</button>
  );
}

function QRCodeDisplay({ patientNo, size = 80 }) {
  // Generate a simple QR-like visual pattern
  const seed = patientNo.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const cells = 11;
  const grid = Array.from({ length: cells }, (_, r) =>
    Array.from({ length: cells }, (_, c) => {
      if ((r < 3 && c < 3) || (r < 3 && c >= cells - 3) || (r >= cells - 3 && c < 3)) return 1;
      return ((seed * (r + 1) * (c + 1) * 7 + r * 13 + c * 17) % 5 < 2) ? 1 : 0;
    })
  );
  const cell = size / cells;
  return (
    <svg width={size} height={size} style={{ imageRendering: "pixelated" }}>
      <rect width={size} height={size} fill="white" />
      {grid.map((row, r) => row.map((v, c) => v ? (
        <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill={colors.primaryDark} />
      ) : null))}
    </svg>
  );
}

function PatientCard({ patient }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primary} 60%, ${colors.primaryLight} 100%)`,
      borderRadius: 20, padding: 24, color: "white", maxWidth: 360,
      boxShadow: "0 8px 32px rgba(10,110,78,0.35)", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
      <div style={{ position: "absolute", bottom: -30, left: -10, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", opacity: 0.7, textTransform: "uppercase" }}>Hlengisizwe Clinic</div>
          <div style={{ fontSize: 9, opacity: 0.5 }}>Digital Patient Card</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4AFF9F" }} />
          <span style={{ fontSize: 9, opacity: 0.7 }}>ACTIVE</span>
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, fontWeight: 700 }}>{patient.name}</div>
        <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>Patient No: <strong>{patient.patientNo}</strong></div>
        <div style={{ fontSize: 12, opacity: 0.6, marginTop: 2 }}>DOB: {patient.dob}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 2 }}>Department</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{patient.department}</div>
          <div style={{ fontSize: 10, opacity: 0.5, marginTop: 4 }}>Emergency: {MOCK_USERS.patient.emergency}</div>
        </div>
        <div style={{ background: "white", padding: 6, borderRadius: 8 }}>
          <QRCodeDisplay patientNo={patient.patientNo} size={64} />
        </div>
      </div>
    </div>
  );
}

// ─── MINI BAR CHART ───────────────────────────────────────────────────────────
function MiniBarChart({ data, labels, color = colors.primary, height = 80 }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{
            width: "100%", height: (v / max) * (height - 20),
            background: `linear-gradient(180deg, ${color}, ${color}88)`,
            borderRadius: "4px 4px 0 0", transition: "height 0.6s ease",
          }} />
          {labels && <div style={{ fontSize: 10, color: colors.textMuted }}>{labels[i]}</div>}
        </div>
      ))}
    </div>
  );
}

function DonutChart({ segments, size = 100 }) {
  const total = Object.values(segments).reduce((a, b) => a + b, 0);
  const segColors = [colors.primary, colors.accent, colors.warning, colors.danger];
  let cumulative = 0;
  const r = 40, cx = 50, cy = 50, stroke = 16;
  const circumference = 2 * Math.PI * r;
  const paths = Object.entries(segments).map(([key, val], i) => {
    const pct = val / total;
    const dash = pct * circumference;
    const offset = circumference - cumulative * circumference;
    cumulative += pct;
    return { key, val, pct, dash, offset, color: segColors[i] };
  });
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {paths.map(p => (
          <circle key={p.key} cx={cx} cy={cy} r={r} fill="none"
            stroke={p.color} strokeWidth={stroke}
            strokeDasharray={`${p.dash} ${circumference - p.dash}`}
            strokeDashoffset={p.offset}
          />
        ))}
      </svg>
      <div>
        {paths.map(p => (
          <div key={p.key} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: p.color }} />
            <span style={{ fontSize: 11, color: colors.textMuted }}>{p.key}: <strong style={{ color: colors.text }}>{p.val}%</strong></span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState("login");
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [fileRecords, setFileRecords] = useState(MOCK_FILES);
  const [arrivals, setArrivals] = useState([]);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [queueItems] = useState(MOCK_PATIENTS);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setView("app");
    setActiveSection("dashboard");
    showToast(`Welcome back, ${user.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView("login");
    setActiveSection("dashboard");
  };

  const simulateArrival = () => {
    const patient = MOCK_PATIENTS[Math.floor(Math.random() * MOCK_PATIENTS.length)];
    const time = new Date().toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
    const newNotif = {
      id: `N${Date.now()}`, type: "arrival",
      message: `${patient.name} has arrived — ${patient.patientNo}`,
      time, priority: patient.priority, dept: patient.department, unread: true,
    };
    setNotifications(prev => [newNotif, ...prev]);
    setArrivals(prev => [{ ...patient, time }, ...prev]);
    showToast(`🔔 New arrival: ${patient.name}`, "info");
  };

  if (view === "login") return <LoginScreen onLogin={handleLogin} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: colors.bg, fontFamily: "'DM Sans', sans-serif", overflow: "hidden" }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 9999,
          background: toast.type === "success" ? colors.primary : toast.type === "info" ? colors.accent : colors.danger,
          color: "#fff", padding: "12px 22px", borderRadius: 24,
          fontSize: 13, fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
          animation: "slideIn 0.3s ease", whiteSpace: "nowrap", maxWidth: "90vw",
        }}>{toast.msg}</div>
      )}

      {/* Drawer overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200,
          animation: "fadeIn 0.2s ease",
        }} />
      )}

      {/* Slide-over drawer */}
      <div style={{
        position: "fixed", top: 0, left: 0, height: "100%", width: 280, zIndex: 300,
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
        background: colors.primaryDark, display: "flex", flexDirection: "column",
        boxShadow: sidebarOpen ? "4px 0 32px rgba(0,0,0,0.3)" : "none",
      }}>
        {/* Drawer header */}
        <div style={{ padding: "20px 20px 14px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 26 }}>🏥</div>
            <div>
              <div style={{ color: "white", fontFamily: "'DM Serif Display', serif", fontSize: 15, lineHeight: 1.2 }}>Hlengisizwe</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>Clinic DHS</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{
            background: "rgba(255,255,255,0.1)", border: "none", color: "white",
            width: 32, height: 32, borderRadius: 8, cursor: "pointer", fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>

        {/* User pill */}
        <div style={{ padding: "12px 16px 8px" }}>
          <div style={{ padding: "10px 12px", background: "rgba(255,255,255,0.08)", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar name={currentUser.name} size={38} color={roleColors[currentUser.role]} />
            <div style={{ overflow: "hidden" }}>
              <div style={{ color: "white", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{currentUser.name}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>{roleLabels[currentUser.role]}</div>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: "6px 12px", overflow: "auto" }}>
          {(NAV_ITEMS[currentUser.role] || []).map(item => (
            <button key={item.id} onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "12px 14px", border: "none", cursor: "pointer", borderRadius: 12,
                background: activeSection === item.id ? "rgba(255,255,255,0.14)" : "transparent",
                color: activeSection === item.id ? "white" : "rgba(255,255,255,0.65)",
                fontSize: 14, fontWeight: activeSection === item.id ? 700 : 500,
                fontFamily: "'DM Sans', sans-serif", marginBottom: 2, textAlign: "left",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.id === "notifications" && notifications.filter(n => n.unread).length > 0 && (
                <span style={{ background: "#FF4757", color: "white", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
                  {notifications.filter(n => n.unread).length}
                </span>
              )}
              {activeSection === item.id && (
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: colors.primaryLight }} />
              )}
            </button>
          ))}
        </nav>

        {/* Sign out */}
        <div style={{ padding: "12px 16px 24px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={() => { handleLogout(); setSidebarOpen(false); }} style={{
            width: "100%", padding: "12px 14px", background: "rgba(255,80,80,0.12)", border: "1px solid rgba(255,80,80,0.2)",
            color: "#FF8080", borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 10,
            transition: "background 0.15s",
          }}>🚪 Sign Out</button>
        </div>
      </div>

      {/* Top navigation bar */}
      <TopBar
        user={currentUser} notifications={notifications}
        onSimulateArrival={simulateArrival}
        onMenuOpen={() => setSidebarOpen(true)}
        activeSection={activeSection}
      />

      {/* Main content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <main style={{ padding: "16px", maxWidth: 900, width: "100%", margin: "0 auto", paddingBottom: 32 }}>
          {renderSection(activeSection, currentUser, { notifications, fileRecords, setFileRecords, arrivals, queueItems, showToast, setActiveSection })}
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Serif+Display&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: ${colors.bg}; }
        ::-webkit-scrollbar-thumb { background: ${colors.border}; border-radius: 3px; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-50%) translateY(-8px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      const match = DEMO_CREDS[email.toLowerCase()];
      if (match && match.password === password) {
        onLogin(match.user);
      } else {
        setError("Invalid credentials. Tap a demo account below.");
      }
      setLoading(false);
    }, 800);
  };

  const fillCreds = (em, pw) => { setEmail(em); setPassword(pw); setError(""); };

  return (
    <div style={{
      minHeight: "100vh", fontFamily: "'DM Sans', sans-serif",
      background: `linear-gradient(160deg, ${colors.primaryDark} 0%, ${colors.primary} 45%, ${colors.primaryLight} 100%)`,
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "0 0 40px",
    }}>
      {/* Hero header */}
      <div style={{ width: "100%", textAlign: "center", padding: "48px 24px 32px", color: "white", position: "relative" }}>
        {/* Decorative rings */}
        {[160, 260, 360].map((s, i) => (
          <div key={i} style={{
            position: "absolute", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.08)",
            width: s, height: s, top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }} />
        ))}
        <div style={{ position: "relative" }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20, background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 36, margin: "0 auto 16px", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}>🏥</div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, margin: "0 0 4px", fontWeight: 400, letterSpacing: "-0.01em" }}>
            Hlengisizwe Clinic
          </h1>
          <p style={{ fontSize: 13, opacity: 0.75, margin: 0 }}>Digital Healthcare System</p>
        </div>
      </div>

      {/* Feature pills */}
      <div style={{ display: "flex", gap: 8, padding: "0 20px 28px", flexWrap: "wrap", justifyContent: "center" }}>
        {[["🔒", "Secure"], ["📱", "QR Cards"], ["⚡", "Real-Time"], ["📊", "Analytics"]].map(([icon, text]) => (
          <div key={text} style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "rgba(255,255,255,0.12)", color: "white",
            padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
            border: "1px solid rgba(255,255,255,0.15)",
          }}>
            <span>{icon}</span><span>{text}</span>
          </div>
        ))}
      </div>

      {/* Login card */}
      <div style={{
        width: "100%", maxWidth: 440, margin: "0 16px",
        background: colors.white, borderRadius: 24,
        padding: "28px 24px 24px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        boxSizing: "border-box",
      }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, margin: "0 0 4px", color: colors.text }}>Sign In</h2>
        <p style={{ color: colors.textMuted, fontSize: 13, margin: "0 0 20px" }}>Access your healthcare portal</p>

        {error && (
          <div style={{ background: colors.dangerBg, color: colors.danger, padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>
            ⚠️ {error}
          </div>
        )}

        <Input label="Email Address" value={email} onChange={setEmail} type="email" placeholder="your@email.com" icon="✉️" />
        <Input label="Password" value={password} onChange={setPassword} type="password" placeholder="••••••••" icon="🔑" />

        <Button onClick={handleLogin} variant="primary" full size="lg" disabled={loading} style={{ marginTop: 4 }}>
          {loading ? "Signing in…" : "Sign In →"}
        </Button>

        {/* Demo accounts */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1, height: 1, background: colors.border }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Demo Accounts</span>
            <div style={{ flex: 1, height: 1, background: colors.border }} />
          </div>
          <p style={{ fontSize: 12, color: colors.textMuted, margin: "0 0 10px", textAlign: "center" }}>
            Tap any role to auto-fill credentials
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {Object.entries(DEMO_CREDS).map(([em, { user, password: pw }]) => (
              <button key={em} onClick={() => fillCreds(em, pw)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 14px", border: `1.5px solid ${colors.border}`,
                  borderRadius: 12, cursor: "pointer", background: colors.surfaceAlt,
                  transition: "all 0.15s", width: "100%", textAlign: "left",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = colors.primaryBg; e.currentTarget.style.borderColor = colors.primary + "66"; }}
                onMouseLeave={e => { e.currentTarget.style.background = colors.surfaceAlt; e.currentTarget.style.borderColor = colors.border; }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: colors.text }}>{roleLabels[user.role]}</div>
                  <div style={{ fontSize: 11, color: colors.textMuted }}>{em}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: colors.textMuted }}>pw: {pw}</span>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: roleColors[user.role] + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                    {user.role === "patient" ? "🙋" : user.role === "doctor" ? "👩‍⚕️" : user.role === "reception" ? "💁" : user.role === "fileroom" ? "📁" : "⚙️"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Serif+Display&display=swap'); * { box-sizing: border-box; }`}</style>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const NAV_ITEMS = {
  patient: [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "card", icon: "💳", label: "My Clinic Card" },
    { id: "records", icon: "📋", label: "Medical Records" },
    { id: "appointments", icon: "📅", label: "Appointments" },
    { id: "messages", icon: "💬", label: "Messages" },
    { id: "notifications", icon: "🔔", label: "Notifications" },
    { id: "health-info", icon: "ℹ️", label: "Health Info" },
  ],
  doctor: [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "patients", icon: "👥", label: "My Patients" },
    { id: "appointments", icon: "📅", label: "Appointments" },
    { id: "consultations", icon: "🩺", label: "Consultations" },
    { id: "messages", icon: "💬", label: "Messages" },
    { id: "notifications", icon: "🔔", label: "Notifications" },
  ],
  reception: [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "register", icon: "➕", label: "Register Patient" },
    { id: "queue", icon: "⏳", label: "Queue Monitor" },
    { id: "patients", icon: "👥", label: "Patient Lookup" },
    { id: "appointments", icon: "📅", label: "Appointments" },
    { id: "notifications", icon: "🔔", label: "Notifications" },
  ],
  fileroom: [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "arrivals", icon: "🔔", label: "Live Arrivals" },
    { id: "files", icon: "📁", label: "File Tracking" },
    { id: "notifications", icon: "📨", label: "Notifications" },
  ],
  admin: [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "analytics", icon: "📊", label: "Analytics" },
    { id: "users", icon: "👥", label: "User Management" },
    { id: "patients", icon: "🏥", label: "All Patients" },
    { id: "announcements", icon: "📢", label: "Announcements" },
    { id: "health-info", icon: "💊", label: "Health Campaigns" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ],
};

function TopBar({ user, notifications, onSimulateArrival, onMenuOpen, activeSection }) {
  const unread = notifications.filter(n => n.unread).length;
  const sectionLabel = Object.values(NAV_ITEMS).flat().find(i => i.id === activeSection)?.label || "Dashboard";
  return (
    <div style={{
      background: colors.primaryDark,
      padding: "0 16px", height: 58, display: "flex", alignItems: "center",
      justifyContent: "space-between", flexShrink: 0, zIndex: 100,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onMenuOpen} style={{
          background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer",
          width: 38, height: 38, borderRadius: 10, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 5, padding: 0, flexShrink: 0,
        }}>
          <div style={{ width: 18, height: 2, background: "white", borderRadius: 2 }} />
          <div style={{ width: 14, height: 2, background: "white", borderRadius: 2 }} />
          <div style={{ width: 18, height: 2, background: "white", borderRadius: 2 }} />
        </button>
        <div>
          <div style={{ color: "white", fontWeight: 700, fontSize: 15, fontFamily: "'DM Serif Display', serif" }}>{sectionLabel}</div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>
            {new Date().toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {(user?.role === "fileroom" || user?.role === "reception" || user?.role === "admin") && (
          <button onClick={onSimulateArrival} style={{
            background: colors.accent, border: "none", color: "white", borderRadius: 10,
            padding: "7px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap",
          }}>📲 Arrival</button>
        )}
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 22, cursor: "pointer" }}>🔔</div>
          {unread > 0 && (
            <div style={{
              position: "absolute", top: -3, right: -3, background: "#FF4757",
              color: "white", fontSize: 9, fontWeight: 800, width: 16, height: 16,
              borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            }}>{unread}</div>
          )}
        </div>
        <Avatar name={user?.name} size={34} color={roleColors[user?.role]} />
      </div>
    </div>
  );
}


// ─── SECTION ROUTER ───────────────────────────────────────────────────────────
function renderSection(section, user, ctx) {
  const { notifications, fileRecords, setFileRecords, arrivals, queueItems, showToast, setActiveSection } = ctx;

  switch (section) {
    case "dashboard": return <DashboardSection user={user} notifications={notifications} arrivals={arrivals} queueItems={queueItems} setActiveSection={setActiveSection} />;
    case "card": return <PatientCardSection user={user} />;
    case "records": return <MedicalRecordsSection />;
    case "appointments": return <AppointmentsSection user={user} showToast={showToast} />;
    case "messages": return <MessagesSection user={user} />;
    case "notifications": return <NotificationsSection notifications={notifications} />;
    case "patients": return <PatientsSection user={user} showToast={showToast} />;
    case "queue": return <QueueSection queueItems={queueItems} />;
    case "arrivals": return <ArrivalsSection arrivals={arrivals} notifications={notifications} />;
    case "files": return <FilesSection fileRecords={fileRecords} setFileRecords={setFileRecords} showToast={showToast} />;
    case "register": return <RegisterPatientSection showToast={showToast} />;
    case "analytics": return <AnalyticsSection />;
    case "consultations": return <ConsultationsSection showToast={showToast} />;
    case "users": return <UsersSection />;
    case "announcements": return <AnnouncementsSection showToast={showToast} />;
    case "health-info": return <HealthInfoSection />;
    case "settings": return <SettingsSection />;
    default: return <DashboardSection user={user} notifications={notifications} arrivals={arrivals} queueItems={queueItems} setActiveSection={setActiveSection} />;
  }
}

// ─── DASHBOARDS ───────────────────────────────────────────────────────────────
function DashboardSection({ user, notifications, arrivals, queueItems, setActiveSection }) {
  if (user.role === "patient") return <PatientDashboard user={user} notifications={notifications} setActiveSection={setActiveSection} />;
  if (user.role === "doctor") return <DoctorDashboard user={user} />;
  if (user.role === "reception") return <ReceptionDashboard queueItems={queueItems} notifications={notifications} setActiveSection={setActiveSection} />;
  if (user.role === "fileroom") return <FileRoomDashboard arrivals={arrivals} notifications={notifications} />;
  if (user.role === "admin") return <AdminDashboardMain setActiveSection={setActiveSection} />;
  return null;
}

function PatientDashboard({ user, notifications, setActiveSection }) {
  const upcoming = MOCK_APPOINTMENTS.filter(a => a.patient === user.name).slice(0, 2);
  const unread = notifications.filter(n => n.unread).length;
  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, margin: 0, color: colors.text }}>Good morning, {user.name.split(" ")[0]} 👋</h1>
        <p style={{ color: colors.textMuted, margin: "6px 0 0", fontSize: 14 }}>Here's your health overview for today.</p>
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard icon="📅" label="Upcoming Appointments" value={upcoming.length} color={colors.accent} sub="Next: 6 Jun at 09:00" />
        <StatCard icon="🔔" label="Unread Notifications" value={unread} color={unread > 0 ? colors.warning : colors.primary} sub={unread > 0 ? "Action required" : "All clear"} />
        <StatCard icon="💊" label="Active Prescriptions" value="2" color={colors.primary} sub="Amlodipine, Hydrochlorothiazide" />
        <StatCard icon="🧪" label="Lab Results" value="1" color={colors.accentLight} sub="Available to view" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <Card>
          <SectionHeader title="Upcoming Appointments" />
          {upcoming.map(a => (
            <div key={a.id} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: `1px solid ${colors.border}` }}>
              <div style={{ width: 42, height: 42, background: colors.primaryBg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📅</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: colors.text }}>{a.type}</div>
                <div style={{ fontSize: 12, color: colors.textMuted }}>{a.doctor} · {a.date} at {a.time}</div>
                <Badge label={a.status} color={a.status === "confirmed" ? colors.primary : colors.warning} />
              </div>
            </div>
          ))}
          <Button variant="secondary" size="sm" style={{ marginTop: 12 }} onClick={() => setActiveSection("appointments")}>View All →</Button>
        </Card>
        <Card>
          <SectionHeader title="Recent Medical Activity" />
          {MOCK_RECORDS.slice(0, 3).map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: `1px solid ${colors.border}` }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors.primary, marginTop: 5, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{r.diagnosis}</div>
                <div style={{ fontSize: 11, color: colors.textMuted }}>{r.date} · {r.type}</div>
              </div>
            </div>
          ))}
          <Button variant="secondary" size="sm" style={{ marginTop: 12 }} onClick={() => setActiveSection("records")}>Full History →</Button>
        </Card>
      </div>
      <Card>
        <SectionHeader title="Health Reminders" />
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { icon: "💊", text: "Take Amlodipine 5mg", sub: "Daily at 08:00", color: colors.primary },
            { icon: "📋", text: "Collect prescription", sub: "Expires 20 Jun", color: colors.warning },
            { icon: "🩸", text: "Blood pressure check", sub: "Next appointment", color: colors.accent },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 12, background: colors.surfaceAlt, padding: "12px 16px", borderRadius: 12, flex: 1, minWidth: 160 }}>
              <div style={{ fontSize: 24 }}>{r.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: colors.text }}>{r.text}</div>
                <div style={{ fontSize: 11, color: colors.textMuted }}>{r.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function DoctorDashboard({ user }) {
  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, margin: 0, color: colors.text }}>Good morning, {user.name} 👩‍⚕️</h1>
        <p style={{ color: colors.textMuted, margin: "6px 0 0", fontSize: 14 }}>Your clinical overview for today.</p>
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard icon="👥" label="Patients Today" value="12" color={colors.primary} sub="3 still waiting" />
        <StatCard icon="📅" label="Appointments" value="8" color={colors.accent} sub="Next at 10:30" />
        <StatCard icon="📝" label="Pending Notes" value="3" color={colors.warning} sub="Require completion" />
        <StatCard icon="🧪" label="Lab Reviews" value="5" color={colors.accentLight} sub="Awaiting review" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <SectionHeader title="Today's Appointments" />
          {MOCK_APPOINTMENTS.slice(0, 3).map(a => (
            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${colors.border}` }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Avatar name={a.patient} size={32} color={colors.primary} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{a.patient}</div>
                  <div style={{ fontSize: 11, color: colors.textMuted }}>{a.time} · {a.type}</div>
                </div>
              </div>
              <Badge label={a.status} color={a.status === "confirmed" ? colors.primary : colors.warning} />
            </div>
          ))}
        </Card>
        <Card>
          <SectionHeader title="Patient Queue" />
          {MOCK_PATIENTS.slice(0, 4).map((p, i) => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${colors.border}`, alignItems: "center" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 11, color: colors.textMuted, width: 16 }}>#{i + 1}</span>
                <Avatar name={p.name} size={28} color={colors.accent} />
                <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
              </div>
              <Badge label={p.status.replace("-", " ")} color={fileStatusColors[p.status] || colors.primary} />
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function ReceptionDashboard({ queueItems, notifications, setActiveSection }) {
  const arrivals = notifications.filter(n => n.type === "arrival");
  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, margin: 0, color: colors.text }}>Reception Dashboard</h1>
        <p style={{ color: colors.textMuted, margin: "6px 0 0" }}>Manage patient flow and arrivals</p>
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard icon="👥" label="Today's Patients" value={ANALYTICS.todayCount} color={colors.primary} />
        <StatCard icon="⏳" label="In Queue" value={queueItems.filter(p => p.status !== "with-doctor").length} color={colors.warning} />
        <StatCard icon="✅" label="Checked In" value={arrivals.length} color={colors.success} />
        <StatCard icon="⏱" label="Avg Wait (min)" value={ANALYTICS.avgWaitTime} color={colors.accent} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Card>
          <SectionHeader title="Live Queue" action={<Button variant="secondary" size="sm" onClick={() => setActiveSection("queue")}>View Full Queue</Button>} />
          {queueItems.map((p, i) => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${colors.border}` }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: colors.textMuted, width: 20, fontWeight: 700 }}>#{i + 1}</span>
                <Avatar name={p.name} size={34} color={p.priority === "High" ? colors.danger : colors.primary} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: colors.textMuted }}>{p.department} · {p.patientNo}</div>
                </div>
              </div>
              <Badge label={p.status.replace(/-/g, " ")} color={p.status === "checked-in" ? colors.accent : p.status === "with-doctor" ? colors.primary : colors.textMuted} />
            </div>
          ))}
        </Card>
        <Card>
          <SectionHeader title="Recent Arrivals" />
          {arrivals.slice(0, 5).map(n => (
            <div key={n.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: `1px solid ${colors.border}` }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: n.unread ? colors.accent : colors.border, marginTop: 4, flexShrink: 0, animation: n.unread ? "pulse 2s infinite" : "none" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{n.message}</div>
                <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>{n.time} · {n.dept}</div>
              </div>
              <Badge label={n.priority || "Normal"} color={n.priority === "High" ? colors.danger : colors.primary} />
            </div>
          ))}
          {arrivals.length === 0 && (
            <div style={{ color: colors.textMuted, fontSize: 13, padding: "16px 0", textAlign: "center" }}>
              No recent arrivals yet. Tap <strong>📲 Arrival</strong> in the top bar to simulate one.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function FileRoomDashboard({ arrivals, notifications }) {
  const pending = notifications.filter(n => n.type === "arrival" && n.unread);
  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, margin: 0, color: colors.text }}>File Room Dashboard</h1>
        <p style={{ color: colors.textMuted, margin: "6px 0 0" }}>Real-time patient arrival and file management</p>
      </div>
      {pending.length > 0 && (
        <div style={{ background: `linear-gradient(135deg, ${colors.warning}22, ${colors.warning}11)`, border: `1px solid ${colors.warning}44`, borderRadius: 14, padding: "14px 18px", marginBottom: 20, display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 24, animation: "pulse 1.5s infinite" }}>🔔</span>
          <div>
            <div style={{ fontWeight: 700, color: colors.warning, fontSize: 14 }}>{pending.length} patient{pending.length > 1 ? "s" : ""} require file retrieval</div>
            <div style={{ fontSize: 12, color: colors.textMuted }}>Check the Live Arrivals section to action these.</div>
          </div>
        </div>
      )}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard icon="🔔" label="Pending Retrieval" value={pending.length} color={colors.warning} sub="Awaiting action" />
        <StatCard icon="📁" label="Files In Transit" value="3" color={colors.accent} sub="Currently moving" />
        <StatCard icon="✅" label="Files Returned" value="8" color={colors.success} sub="Today" />
        <StatCard icon="⏱" label="Avg Retrieval (min)" value="4" color={colors.primary} sub="Today's performance" />
      </div>
      <Card>
        <SectionHeader title="File Status Overview" />
        {MOCK_FILES.map(f => (
          <div key={f.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${colors.border}` }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 20 }}>📁</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{f.patient}</div>
                <div style={{ fontSize: 11, color: colors.textMuted }}>{f.patientNo} · {f.location}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: colors.textMuted }}>{f.updated}</span>
              <Badge label={f.status} color={fileStatusColors[f.status] || colors.textMuted} />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function AdminDashboardMain({ setActiveSection }) {
  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, margin: 0, color: colors.text }}>Administration Overview</h1>
        <p style={{ color: colors.textMuted, margin: "6px 0 0" }}>Hlengisizwe Clinic — System Control</p>
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard icon="👥" label="Patients Today" value={ANALYTICS.todayCount} color={colors.primary} sub="+12% vs yesterday" />
        <StatCard icon="👩‍⚕️" label="Active Doctors" value={ANALYTICS.activeDoctors} color={colors.accent} />
        <StatCard icon="📁" label="File Performance" value={`${ANALYTICS.filePerformance}%`} color={colors.success} sub="On-time retrieval" />
        <StatCard icon="⏱" label="Avg Wait (min)" value={ANALYTICS.avgWaitTime} color={colors.warning} sub="-3 vs last week" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card>
          <SectionHeader title="Weekly Patient Volume" sub="Last 7 days" />
          <MiniBarChart data={ANALYTICS.dailyPatients} labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]} height={100} />
        </Card>
        <Card>
          <SectionHeader title="By Department" />
          <DonutChart segments={ANALYTICS.departments} />
        </Card>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[
          { icon: "👥", label: "Manage Users", id: "users", color: colors.accent },
          { icon: "📊", label: "Full Analytics", id: "analytics", color: colors.primary },
          { icon: "📢", label: "Announcements", id: "announcements", color: colors.warning },
          { icon: "💊", label: "Health Campaigns", id: "health-info", color: colors.success },
          { icon: "🏥", label: "All Patients", id: "patients", color: colors.accent },
          { icon: "⚙️", label: "Settings", id: "settings", color: colors.textMuted },
        ].map(item => (
          <Card key={item.id} onClick={() => setActiveSection(item.id)} style={{ textAlign: "center", padding: 16, cursor: "pointer" }}>
            <div style={{ fontSize: 30, marginBottom: 8 }}>{item.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.label}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── PATIENT CARD ─────────────────────────────────────────────────────────────
function PatientCardSection({ user }) {
  const patient = MOCK_PATIENTS.find(p => p.id === user.id) || MOCK_PATIENTS[0];
  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <SectionHeader title="My Clinic Card" sub="Digital patient identification and QR check-in card" />
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div>
          <PatientCard patient={patient} />
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <Button variant="primary">⬇️ Download PDF</Button>
            <Button variant="ghost">🖨️ Print Card</Button>
          </div>
        </div>
        <Card style={{ flex: 1, minWidth: 240 }}>
          <SectionHeader title="How to Use Your Card" />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { step: "1", icon: "📱", text: "Show your QR code at the clinic gate scanner or reception desk" },
              { step: "2", icon: "✅", text: "Your arrival is automatically logged in the system" },
              { step: "3", icon: "📁", text: "File room staff are instantly notified to prepare your file" },
              { step: "4", icon: "⏱", text: "Your file is ready before you reach reception — saving time" },
              { step: "5", icon: "🔔", text: "You receive a confirmation SMS and push notification" },
            ].map(s => (
              <div key={s.step} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: colors.primary, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{s.step}</div>
                <div>
                  <span style={{ fontSize: 16, marginRight: 6 }}>{s.icon}</span>
                  <span style={{ fontSize: 13, color: colors.text }}>{s.text}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── MEDICAL RECORDS ──────────────────────────────────────────────────────────
function MedicalRecordsSection() {
  const [tab, setTab] = useState("consultations");
  const tabs = [
    { id: "consultations", label: "Consultations" },
    { id: "prescriptions", label: "Prescriptions" },
    { id: "lab", label: "Lab Results" },
    { id: "chronic", label: "Chronic Care" },
  ];
  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <SectionHeader title="Medical Records" sub="Your complete health history" />
      <div style={{ display: "flex", gap: 4, background: colors.surfaceAlt, padding: 4, borderRadius: 12, marginBottom: 20, width: "fit-content" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "8px 18px", border: "none", cursor: "pointer", borderRadius: 9,
            background: tab === t.id ? colors.white : "transparent",
            color: tab === t.id ? colors.primary : colors.textMuted,
            fontWeight: tab === t.id ? 700 : 500, fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: tab === t.id ? "0 2px 8px rgba(10,110,78,0.1)" : "none",
            transition: "all 0.2s",
          }}>{t.label}</button>
        ))}
      </div>
      {tab === "consultations" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {MOCK_RECORDS.map((r, i) => (
            <Card key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ width: 44, height: 44, background: colors.primaryBg, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                    {r.type === "Lab Results" ? "🧪" : "🩺"}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: colors.text }}>{r.diagnosis}</div>
                    <div style={{ fontSize: 12, color: colors.textMuted }}>{r.doctor} · {r.date}</div>
                    <div style={{ fontSize: 13, color: colors.text, marginTop: 6 }}>{r.notes}</div>
                    {r.rx && (
                      <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 12 }}>💊</span>
                        <span style={{ fontSize: 12, color: colors.primary, fontWeight: 600 }}>{r.rx}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Badge label={r.type} color={colors.accent} />
              </div>
            </Card>
          ))}
        </div>
      )}
      {tab === "prescriptions" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { med: "Amlodipine 5mg", dose: "Once daily at 08:00", prescribed: "2026-03-10", status: "Active", refills: 2 },
            { med: "Hydrochlorothiazide 12.5mg", dose: "Once daily", prescribed: "2026-03-10", status: "Active", refills: 1 },
          ].map((p, i) => (
            <Card key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 44, height: 44, background: colors.accentBg, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>💊</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{p.med}</div>
                  <div style={{ fontSize: 12, color: colors.textMuted }}>{p.dose}</div>
                  <div style={{ fontSize: 11, color: colors.textMuted }}>Prescribed: {p.prescribed} · Refills remaining: {p.refills}</div>
                </div>
              </div>
              <Badge label={p.status} color={colors.success} />
            </Card>
          ))}
        </div>
      )}
      {tab === "lab" && (
        <Card>
          <div style={{ padding: "12px 0" }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Latest Blood Work — 2 April 2026</div>
            {[["HbA1c", "6.1%", "Normal", colors.success], ["Total Cholesterol", "4.8 mmol/L", "Normal", colors.success], ["Blood Pressure", "138/88 mmHg", "Elevated", colors.warning], ["Blood Glucose", "5.4 mmol/L", "Normal", colors.success]].map(([name, val, status, color]) => (
              <div key={name} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${colors.border}` }}>
                <span style={{ fontSize: 13, color: colors.text }}>{name}</span>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{val}</span>
                  <Badge label={status} color={color} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
      {tab === "chronic" && (
        <Card>
          <SectionHeader title="Chronic Medication Program" />
          <div style={{ background: colors.primaryBg, borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div style={{ fontWeight: 700, color: colors.primary, marginBottom: 4 }}>Hypertension (HTN) — Controlled</div>
            <div style={{ fontSize: 13, color: colors.text }}>Enrolled since March 2026. Next review: 20 June 2026.</div>
          </div>
          <div style={{ fontSize: 13, color: colors.text }}>Your chronic medications are dispensed monthly. Collection reminders will be sent 3 days before your collection date.</div>
        </Card>
      )}
    </div>
  );
}

// ─── APPOINTMENTS ─────────────────────────────────────────────────────────────
function AppointmentsSection({ user, showToast }) {
  const [showBook, setShowBook] = useState(false);
  const [form, setForm] = useState({ date: "", time: "", type: "Consultation", dept: "General", notes: "" });
  const userAppts = user.role === "patient"
    ? MOCK_APPOINTMENTS.filter(a => a.patient === user.name)
    : user.role === "doctor" ? MOCK_APPOINTMENTS : MOCK_APPOINTMENTS;

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <SectionHeader title="Appointments"
        action={<Button variant="primary" onClick={() => setShowBook(!showBook)}>+ Book Appointment</Button>}
      />
      {showBook && (
        <Card style={{ marginBottom: 20, border: `1.5px solid ${colors.primary}44` }}>
          <SectionHeader title="Book New Appointment" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Preferred Date" value={form.date} onChange={v => setForm({ ...form, date: v })} type="date" />
            <Input label="Preferred Time" value={form.time} onChange={v => setForm({ ...form, time: v })} type="time" />
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: colors.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${colors.border}`, fontSize: 14, background: colors.surfaceAlt, fontFamily: "'DM Sans', sans-serif" }}>
                {["Consultation", "Follow-up", "Chronic Review", "Antenatal", "Vaccination"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: colors.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Department</label>
              <select value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${colors.border}`, fontSize: 14, background: colors.surfaceAlt, fontFamily: "'DM Sans', sans-serif" }}>
                {["General", "Maternal Health", "Chronic Care", "Pediatric", "Emergency"].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <Button variant="primary" onClick={() => { showToast("Appointment request submitted!"); setShowBook(false); }}>Submit Request</Button>
            <Button variant="ghost" onClick={() => setShowBook(false)}>Cancel</Button>
          </div>
        </Card>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {userAppts.map(a => (
          <Card key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 14 }}>
              <div style={{ width: 50, height: 50, background: colors.primaryBg, borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: colors.primary }}>{a.date.slice(8)}</div>
                <div style={{ fontSize: 9, color: colors.textMuted, textTransform: "uppercase" }}>{new Date(a.date).toLocaleDateString("en", { month: "short" })}</div>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{a.type}</div>
                <div style={{ fontSize: 12, color: colors.textMuted }}>{user.role === "patient" ? a.doctor : a.patient} · {a.time} · {a.department}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Badge label={a.status} color={a.status === "confirmed" ? colors.success : colors.warning} />
              {user.role === "patient" && (
                <Button variant="danger" size="sm" onClick={() => showToast("Appointment cancellation requested", "info")}>Cancel</Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── MESSAGES ─────────────────────────────────────────────────────────────────
function MessagesSection({ user }) {
  const [selected, setSelected] = useState(null);
  const [newMsg, setNewMsg] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, from: "Dr. Khumalo", to: "Thabo", time: "09:15", text: "Good morning! Your blood pressure reading from your last visit was slightly elevated. Please ensure you take your medication consistently and monitor your readings at home if possible.", mine: false },
    { id: 2, from: "Thabo", to: "Dr. Khumalo", time: "09:30", text: "Thank you, Doctor. I have been taking the Amlodipine every morning as prescribed. I will try to track my readings.", mine: true },
    { id: 3, from: "Dr. Khumalo", to: "Thabo", time: "09:32", text: "Perfect. If readings exceed 150/95 on two consecutive days, please visit the clinic or call us. Your follow-up is next Friday at 09:00.", mine: false },
  ]);

  const conversations = [
    { id: 1, name: user.role === "patient" ? "Dr. Khumalo" : "Thabo Dlamini", role: user.role === "patient" ? "Doctor" : "Patient", lastMsg: "Please monitor your readings.", time: "09:32", unread: 1 },
    { id: 2, name: "Clinic Admin", role: "Notice", lastMsg: "Health campaign next Saturday.", time: "Yesterday", unread: 0 },
  ];

  const send = () => {
    if (!newMsg.trim()) return;
    setMessages(m => [...m, { id: Date.now(), from: user.name, to: "Dr. Khumalo", time: new Date().toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" }), text: newMsg, mine: true }]);
    setNewMsg("");
  };

  return (
    <div style={{ animation: "fadeUp 0.4s ease", display: "flex", gap: 16, height: 520 }}>
      <Card style={{ width: 260, padding: 12, overflow: "auto" }}>
        <div style={{ fontWeight: 800, fontSize: 15, color: colors.text, marginBottom: 12, fontFamily: "'DM Serif Display', serif" }}>Messages</div>
        {conversations.map(c => (
          <div key={c.id} onClick={() => setSelected(c.id)}
            style={{ display: "flex", gap: 10, padding: "10px 8px", borderRadius: 10, cursor: "pointer", background: selected === c.id ? colors.primaryBg : "transparent", marginBottom: 4 }}
            onMouseEnter={e => e.currentTarget.style.background = colors.surfaceAlt}
            onMouseLeave={e => e.currentTarget.style.background = selected === c.id ? colors.primaryBg : "transparent"}
          >
            <Avatar name={c.name} size={38} color={c.role === "Doctor" ? colors.primary : colors.accent} />
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{c.name}</span>
                {c.unread > 0 && <span style={{ background: colors.accent, color: "white", fontSize: 10, padding: "2px 6px", borderRadius: 20 }}>{c.unread}</span>}
              </div>
              <div style={{ fontSize: 11, color: colors.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.lastMsg}</div>
            </div>
          </div>
        ))}
      </Card>
      <Card style={{ flex: 1, padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {selected ? (
          <>
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${colors.border}`, display: "flex", gap: 10, alignItems: "center" }}>
              <Avatar name={conversations.find(c => c.id === selected)?.name} size={36} color={colors.primary} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{conversations.find(c => c.id === selected)?.name}</div>
                <div style={{ fontSize: 11, color: colors.textMuted }}>{conversations.find(c => c.id === selected)?.role}</div>
              </div>
            </div>
            <div style={{ flex: 1, overflow: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
              {messages.map(m => (
                <div key={m.id} style={{ display: "flex", justifyContent: m.mine ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "72%", padding: "10px 14px", borderRadius: m.mine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: m.mine ? `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})` : colors.surfaceAlt,
                    color: m.mine ? "white" : colors.text, fontSize: 13,
                  }}>
                    {m.text}
                    <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4, textAlign: "right" }}>{m.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "12px 16px", borderTop: `1px solid ${colors.border}`, display: "flex", gap: 8 }}>
              <input value={newMsg} onChange={e => setNewMsg(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
                placeholder="Type a message..."
                style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${colors.border}`, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" }}
                onFocus={e => e.target.style.borderColor = colors.primary}
                onBlur={e => e.target.style.borderColor = colors.border}
              />
              <Button variant="primary" onClick={send}>Send</Button>
            </div>
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: colors.textMuted, fontSize: 14 }}>
            Select a conversation to start messaging
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
function NotificationsSection({ notifications }) {
  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <SectionHeader title="Notifications" sub={`${notifications.filter(n => n.unread).length} unread`} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {notifications.map(n => (
          <Card key={n.id} style={{ display: "flex", gap: 14, alignItems: "flex-start", opacity: n.unread ? 1 : 0.7, borderLeft: n.unread ? `3px solid ${n.type === "arrival" ? colors.accent : colors.primary}` : "none" }}>
            <div style={{ fontSize: 24, flexShrink: 0 }}>
              {n.type === "arrival" ? "🚶" : n.type === "appointment" ? "📅" : n.type === "lab" ? "🧪" : "🔔"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: n.unread ? 700 : 500, color: colors.text }}>{n.message}</div>
              <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 3 }}>
                {n.time}{n.dept ? ` · ${n.dept}` : ""}
                {n.priority && n.priority !== "Normal" && <span style={{ marginLeft: 6 }}><Badge label={n.priority} color={colors.danger} /></span>}
              </div>
            </div>
            {n.unread && <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors.accent, marginTop: 6, animation: "pulse 2s infinite", flexShrink: 0 }} />}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── PATIENTS ─────────────────────────────────────────────────────────────────
function PatientsSection({ user, showToast }) {
  const [search, setSearch] = useState("");
  const filtered = MOCK_PATIENTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.patientNo.includes(search));
  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <SectionHeader title={user.role === "admin" ? "All Patients" : "Patient Lookup"}
        action={user.role === "reception" && <Button variant="primary" size="sm">+ Register New</Button>}
      />
      <div style={{ marginBottom: 16 }}>
        <Input value={search} onChange={setSearch} placeholder="Search by name or patient number..." icon="🔍" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(p => (
          <Card key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <Avatar name={p.name} size={42} color={p.priority === "High" ? colors.danger : colors.primary} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: colors.textMuted }}>{p.patientNo} · DOB: {p.dob} · {p.department}</div>
                <div style={{ fontSize: 11, color: colors.textMuted }}>{p.phone}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Badge label={p.priority} color={p.priority === "High" ? colors.danger : p.priority === "Low" ? colors.textMuted : colors.primary} />
              <Button variant="secondary" size="sm" onClick={() => showToast(`Viewing ${p.name}'s profile`, "info")}>View</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── QUEUE ────────────────────────────────────────────────────────────────────
function QueueSection({ queueItems }) {
  const statuses = ["checked-in", "file-retrieved", "with-doctor", "waiting"];
  const statusLabels = { "checked-in": "Checked In", "file-retrieved": "File Ready", "with-doctor": "With Doctor", "waiting": "Waiting" };
  const statusColors2 = { "checked-in": colors.accent, "file-retrieved": colors.success, "with-doctor": colors.primary, "waiting": colors.warning };
  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <SectionHeader title="Live Queue Monitor" sub="Real-time patient queue status" />
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        {statuses.map(s => (
          <Card key={s} style={{ flex: 1, minWidth: 120, textAlign: "center", padding: 14 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: statusColors2[s] }}>{queueItems.filter(p => p.status === s).length}</div>
            <div style={{ fontSize: 11, color: colors.textMuted, fontWeight: 600 }}>{statusLabels[s]}</div>
          </Card>
        ))}
      </div>
      <Card>
        {queueItems.map((p, i) => (
          <div key={p.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 0", borderBottom: i < queueItems.length - 1 ? `1px solid ${colors.border}` : "none" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: colors.primaryBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: colors.primary, flexShrink: 0 }}>#{i + 1}</div>
            <Avatar name={p.name} size={36} color={p.priority === "High" ? colors.danger : colors.primary} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: colors.textMuted }}>{p.patientNo} · {p.department}</div>
            </div>
            <Badge label={p.priority} color={p.priority === "High" ? colors.danger : colors.textMuted} />
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColors2[p.status], animation: p.status === "checked-in" ? "pulse 2s infinite" : "none" }} />
              <Badge label={statusLabels[p.status]} color={statusColors2[p.status]} />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── LIVE ARRIVALS ────────────────────────────────────────────────────────────
function ArrivalsSection({ arrivals, notifications }) {
  const recent = notifications.filter(n => n.type === "arrival");
  const [actioned, setActioned] = useState({});

  const statusFlow = ["Awaiting Retrieval", "Being Retrieved", "At Reception", "With Nurse", "With Doctor", "Returned to File Room"];
  const actionLabels = {
    "Awaiting Retrieval": { btn: "📁 Start Retrieval", next: "Being Retrieved", color: colors.warning },
    "Being Retrieved":   { btn: "🏃 File En Route", next: "At Reception",     color: colors.accent },
    "At Reception":      { btn: "🙋 Patient Called", next: "With Nurse",       color: "#7B52AB" },
    "With Nurse":        { btn: "🩺 Send to Doctor", next: "With Doctor",      color: colors.primary },
    "With Doctor":       { btn: "✅ Return to File Room", next: "Returned to File Room", color: colors.success },
    "Returned to File Room": { btn: "🗄️ Filed Away", next: null, color: colors.textMuted },
  };

  const getStatus = (id) => actioned[id] || "Awaiting Retrieval";

  const advance = (id) => {
    const current = getStatus(id);
    const info = actionLabels[current];
    if (info?.next) setActioned(a => ({ ...a, [id]: info.next }));
  };

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <SectionHeader title="🔔 Live Arrivals" sub="Tap the Arrival button in the top bar to simulate a patient scanning their QR card at the gate" />

      {/* How it works banner */}
      <div style={{ background: `linear-gradient(135deg, ${colors.primaryDark}, ${colors.primary})`, borderRadius: 16, padding: "16px 20px", marginBottom: 20, color: "white" }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>⚡ How the QR Arrival Flow Works</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            ["📲", "Patient scans QR card at clinic gate"],
            ["🔔", "File room receives instant notification"],
            ["📁", "Staff locate & retrieve patient file"],
            ["🚶", "File is ready before patient reaches reception"],
          ].map(([icon, text]) => (
            <div key={text} style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 16, width: 24, textAlign: "center" }}>{icon}</span>
              <span style={{ fontSize: 13, opacity: 0.9 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {recent.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "40px 24px" }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>📲</div>
          <div style={{ fontWeight: 800, fontSize: 16, color: colors.text, marginBottom: 6 }}>Waiting for patients to arrive…</div>
          <div style={{ fontSize: 13, color: colors.textMuted, marginBottom: 20 }}>Tap the <strong>📲 Arrival</strong> button in the green top bar to simulate a patient scanning their QR card at the gate.</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: colors.accentBg, color: colors.accent, padding: "10px 20px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
            <span style={{ animation: "pulse 1.5s infinite" }}>●</span> System is live and listening
          </div>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {recent.map((n, idx) => {
            const status = getStatus(n.id);
            const info = actionLabels[status];
            const statusIdx = statusFlow.indexOf(status);
            const isDone = status === "Returned to File Room";
            return (
              <Card key={n.id} style={{
                borderLeft: `4px solid ${info.color}`,
                animation: idx === 0 ? "fadeUp 0.4s ease" : "none",
              }}>
                {/* Header row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 14,
                      background: n.unread && !actioned[n.id] ? colors.accentBg : colors.surfaceAlt,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
                      border: n.unread && !actioned[n.id] ? `2px solid ${colors.accent}` : "2px solid transparent",
                    }}>
                      {isDone ? "🗄️" : actioned[n.id] ? "📁" : "🚶"}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15, color: colors.text }}>{n.message.replace("has arrived — ", "")}</div>
                      <div style={{ fontSize: 12, color: colors.textMuted }}>Arrived {n.time} · {n.dept} · {n.priority || "Normal"} priority</div>
                    </div>
                  </div>
                  <Badge label={n.priority || "Normal"} color={n.priority === "High" ? colors.danger : colors.primary} />
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: info.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {isDone ? "✅ Complete" : `Step ${statusIdx + 1} of ${statusFlow.length}`}
                    </span>
                    <span style={{ fontSize: 11, color: colors.textMuted }}>{status}</span>
                  </div>
                  <div style={{ height: 6, background: colors.border, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 3,
                      background: `linear-gradient(90deg, ${colors.primary}, ${info.color})`,
                      width: `${((statusIdx + 1) / statusFlow.length) * 100}%`,
                      transition: "width 0.6s ease",
                    }} />
                  </div>
                </div>

                {/* Status steps */}
                <div style={{ display: "flex", gap: 0, marginBottom: 14, overflowX: "auto", paddingBottom: 4 }}>
                  {statusFlow.map((s, i) => {
                    const done = i <= statusIdx;
                    const active = i === statusIdx;
                    return (
                      <div key={s} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                          <div style={{
                            width: active ? 28 : 22, height: active ? 28 : 22, borderRadius: "50%",
                            background: done ? (active ? info.color : colors.primary) : colors.border,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: active ? 13 : 10, color: "white", fontWeight: 800,
                            transition: "all 0.4s ease",
                            boxShadow: active ? `0 0 0 4px ${info.color}33` : "none",
                            animation: active && !isDone ? "pulse 2s infinite" : "none",
                          }}>
                            {done && !active ? "✓" : i + 1}
                          </div>
                          <div style={{ fontSize: 9, color: done ? colors.text : colors.textLight, fontWeight: done ? 700 : 400, textAlign: "center", maxWidth: 48, lineHeight: 1.2 }}>
                            {s.replace("Awaiting ", "").replace("Being ", "").replace("Returned to ", "→ ")}
                          </div>
                        </div>
                        {i < statusFlow.length - 1 && (
                          <div style={{ width: 16, height: 2, background: i < statusIdx ? colors.primary : colors.border, marginBottom: 18, transition: "background 0.4s ease", flexShrink: 0 }} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Action button */}
                {!isDone ? (
                  <button onClick={() => advance(n.id)} style={{
                    width: "100%", padding: "12px", border: "none", borderRadius: 12, cursor: "pointer",
                    background: `linear-gradient(135deg, ${info.color}, ${info.color}cc)`,
                    color: "white", fontWeight: 700, fontSize: 14,
                    fontFamily: "'DM Sans', sans-serif",
                    boxShadow: `0 4px 16px ${info.color}44`,
                    transition: "all 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.08)"}
                    onMouseLeave={e => e.currentTarget.style.filter = "none"}
                  >
                    {info.btn}
                  </button>
                ) : (
                  <div style={{ textAlign: "center", padding: "10px", background: colors.successBg, borderRadius: 12, color: colors.success, fontWeight: 700, fontSize: 13 }}>
                    ✅ File journey complete — returned to file room
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── FILE TRACKING ────────────────────────────────────────────────────────────
function FilesSection({ fileRecords, setFileRecords, showToast }) {
  const statusFlow = ["Awaiting Retrieval", "Being Retrieved", "At Reception", "With Nurse", "With Doctor", "Returned to File Room"];
  const statusIcons = {
    "Awaiting Retrieval": "⏳",
    "Being Retrieved": "🏃",
    "At Reception": "🙋",
    "With Nurse": "👩‍⚕️",
    "With Doctor": "🩺",
    "Returned to File Room": "🗄️",
  };

  const advance = (fileId) => {
    setFileRecords(prev => prev.map(f => {
      if (f.id !== fileId) return f;
      const idx = statusFlow.indexOf(f.status);
      const next = statusFlow[idx + 1] || f.status;
      const time = new Date().toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" });
      showToast(`📁 ${f.patient}: ${next}`, "info");
      return { ...f, status: next, updated: time, history: [...f.history, `${time} – ${next}`] };
    }));
  };

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <SectionHeader title="📁 File Tracking" sub="Advance each file through the clinic journey" />

      {/* Legend */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        {statusFlow.map(s => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 4, background: colors.white, border: `1px solid ${colors.border}`, padding: "4px 10px", borderRadius: 20 }}>
            <span style={{ fontSize: 12 }}>{statusIcons[s]}</span>
            <span style={{ fontSize: 11, color: colors.textMuted, fontWeight: 600 }}>{s}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {fileRecords.map(f => {
          const statusIdx = statusFlow.indexOf(f.status);
          const isDone = f.status === "Returned to File Room";
          const statusColor = fileStatusColors[f.status] || colors.textMuted;
          return (
            <Card key={f.id} style={{ borderTop: `3px solid ${statusColor}` }}>
              {/* Patient info */}
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${statusColor}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
                  {statusIcons[f.status]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: colors.text }}>{f.patient}</div>
                  <div style={{ fontSize: 12, color: colors.textMuted }}>{f.patientNo} · {f.location}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Badge label={f.status} color={statusColor} />
                  <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 4 }}>Updated {f.updated}</div>
                </div>
              </div>

              {/* Visual progress stepper */}
              <div style={{ background: colors.surfaceAlt, borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>File Journey</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {statusFlow.map((s, i) => {
                    const done = i < statusIdx;
                    const active = i === statusIdx;
                    const future = i > statusIdx;
                    return (
                      <div key={s} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: "50%",
                            background: done ? colors.primary : active ? statusColor : colors.border,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 13, color: "white", fontWeight: 800,
                            boxShadow: active ? `0 0 0 4px ${statusColor}33` : "none",
                            transition: "all 0.4s",
                            animation: active && !isDone ? "pulse 2s infinite" : "none",
                          }}>
                            {done ? "✓" : statusIcons[s]}
                          </div>
                          {i < statusFlow.length - 1 && (
                            <div style={{ width: 2, height: 20, background: done ? colors.primary : colors.border, transition: "background 0.4s" }} />
                          )}
                        </div>
                        <div style={{ paddingTop: 4, paddingBottom: i < statusFlow.length - 1 ? 0 : 0 }}>
                          <div style={{ fontSize: 13, fontWeight: active ? 800 : done ? 600 : 400, color: future ? colors.textLight : colors.text }}>
                            {s}
                          </div>
                          {active && (
                            <div style={{ fontSize: 11, color: statusColor, fontWeight: 700, marginTop: 1 }}>← Current location · {f.updated}</div>
                          )}
                          {f.history[i] && done && (
                            <div style={{ fontSize: 10, color: colors.textMuted }}>{f.history[i].split("–")[0].trim()}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Handler info */}
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14, background: colors.primaryBg, borderRadius: 10, padding: "8px 12px" }}>
                <Avatar name={f.handler !== "Unassigned" ? f.handler : "?"} size={28} color={f.handler !== "Unassigned" ? colors.primary : colors.border} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: colors.text }}>{f.handler}</div>
                  <div style={{ fontSize: 11, color: colors.textMuted }}>Current handler</div>
                </div>
              </div>

              {/* Action button */}
              {!isDone ? (
                <button onClick={() => advance(f.id)} style={{
                  width: "100%", padding: "13px", border: "none", borderRadius: 12, cursor: "pointer",
                  background: `linear-gradient(135deg, ${statusColor}, ${statusColor}bb)`,
                  color: "white", fontWeight: 700, fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: `0 4px 16px ${statusColor}44`,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}>
                  <span>{statusIcons[statusFlow[statusIdx + 1] || statusFlow[statusIdx]]}</span>
                  <span>Move to: {statusFlow[statusIdx + 1] || "Complete"}</span>
                  <span style={{ marginLeft: "auto", opacity: 0.7 }}>→</span>
                </button>
              ) : (
                <div style={{ textAlign: "center", padding: "12px", background: colors.successBg, borderRadius: 12, color: colors.success, fontWeight: 700, fontSize: 13 }}>
                  🗄️ File returned — journey complete
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── REGISTER PATIENT ──────────────────────────────────────────────────────────
function RegisterPatientSection({ showToast }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", dob: "", gender: "Female", phone: "", emergency: "", dept: "General", address: "" });
  const f = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <SectionHeader title="Register New Patient" sub="Create a new patient profile and generate clinic card" />
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
          <Input label="First Name" value={form.firstName} onChange={v => f("firstName", v)} placeholder="Enter first name" />
          <Input label="Last Name" value={form.lastName} onChange={v => f("lastName", v)} placeholder="Enter last name" />
          <Input label="Date of Birth" value={form.dob} onChange={v => f("dob", v)} type="date" />
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: colors.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Gender</label>
            <select value={form.gender} onChange={e => f("gender", e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${colors.border}`, fontSize: 14, background: colors.surfaceAlt, fontFamily: "'DM Sans', sans-serif" }}>
              {["Female", "Male", "Other", "Prefer not to say"].map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <Input label="Phone Number" value={form.phone} onChange={v => f("phone", v)} placeholder="071 000 0000" icon="📱" />
          <Input label="Emergency Contact" value={form.emergency} onChange={v => f("emergency", v)} placeholder="072 000 0000" icon="🆘" />
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: colors.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Department</label>
            <select value={form.dept} onChange={e => f("dept", e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${colors.border}`, fontSize: 14, background: colors.surfaceAlt, fontFamily: "'DM Sans', sans-serif" }}>
              {["General", "Maternal Health", "Chronic Care", "Pediatric", "Emergency"].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <Input label="Home Address" value={form.address} onChange={v => f("address", v)} placeholder="Street, City" icon="🏠" />
        </div>
        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <Button variant="primary" size="lg" onClick={() => showToast(`Patient ${form.firstName} ${form.lastName} registered! QR card generated.`)}>
            ✅ Register & Generate Card
          </Button>
          <Button variant="ghost" onClick={() => setForm({ firstName: "", lastName: "", dob: "", gender: "Female", phone: "", emergency: "", dept: "General", address: "" })}>
            Clear Form
          </Button>
        </div>
      </Card>
    </div>
  );
}

// ─── ANALYTICS ───────────────────────────────────────────────────────────────
function AnalyticsSection() {
  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <SectionHeader title="Analytics & Reports" sub="Comprehensive clinic performance metrics" />
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon="👥" label="Today's Patients" value={ANALYTICS.todayCount} color={colors.primary} sub="+12% vs 
