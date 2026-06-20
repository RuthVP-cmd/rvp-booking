// RVPBooking.jsx
// ─────────────────────────────────────────────────────────────────────────────
// RVP Engineering Services — "Schedule a Consultation" booking flow.
// Single self-contained component. Blueprint Dark theme, Golden Gate Bridge
// blueprint background, 5-step flow + confirmation.
//
// Fonts (load once in your app, e.g. in index.html or a global stylesheet):
//   Hanken Grotesk (400–800) + Libre Caslon Display
//   https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&family=Libre+Caslon+Display&display=swap
//
// Logo: drop your transparent white-on-dark PNG at the path in LOGO_SRC below
//   (or swap for an imported asset). Falls back to a CSS wordmark if missing.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from "react";

const LOGO_SRC = "/RVP Logo.png";

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  BG: "#0E1A2D", BG2: "#0A1525",
  CARD: "#15233B", CARD2: "#1B2D49", CARD3: "#213553",
  BORD: "#26395A", BORDS: "#2F466B", BORD_SOFT: "#223350",
  GOLD: "#D4B25A", GOLD_DEEP: "#C9A84C", GOLD_SOFT: "rgba(212,178,90,0.14)",
  TEXT: "#EFF4FB", TEXT2: "#C6D4E8", MUTED: "#90A6C7", FAINT: "#6A7E9E",
  GREEN: "#5FD39A", GREEN_BG: "#0E2A1C", GREEN_BD: "#1E5C38",
  BLUE_BG: "#0D2238", BLUE_BD: "#274a72", BLUE_TX: "#8FC0F5",
};

// ── Business details ──────────────────────────────────────────────────────────
const BIZ = {
  bluevineLink: "https://pay.bluevine.com/p/c2238b2b9b234bd7957949790cc232c5",
  routing: "125109019",
  account: "875112062463",
  name: "RVP Engineering Services",
  gcash: "0945-130-3714",
  email: "info@rvpengineering.us",
  owner: "Ruth Van Patten",
};
const FEE_US = 50;
const FEE_PH = 2500;

// ── Regions & services ────────────────────────────────────────────────────────
const REGIONS = {
  us: {
    label: "United States", currency: "USD", fee: FEE_US,
    blurb: "Preconstruction & project engineering for commercial and public works.",
    services: [
      { id: "pre", icon: "ruler", title: "Preconstruction & Estimating", desc: "Conceptual budgeting, bid strategy, scope review, quantity takeoff, and value engineering.", tag: "Most booked" },
      { id: "eng", icon: "crane", title: "Project Engineering", desc: "RFI/submittal management, schedule coordination, subcontractor oversight, and field problem-solving." },
    ],
  },
  ph: {
    label: "Philippines", currency: "PHP", fee: FEE_PH,
    blurb: "Permits, plans, estimates and structural work for homes and light commercial.",
    services: [
      { id: "bpa", icon: "doc", title: "Building Permit Application", desc: "End-to-end preparation and filing of permit documents with your local government unit.", tag: "Popular" },
      { id: "csp", icon: "draft", title: "Complete Set of Plans", desc: "Architectural, structural, electrical, plumbing, and sanitary drawings for permit and build." },
      { id: "est", icon: "calc", title: "Detailed Estimates", desc: "Line-item quantity takeoff and cost estimate for bidding and budget planning." },
      { id: "tsp", icon: "clip", title: "Technical Specifications", desc: "Written scope of work and material specs aligned to Philippine construction standards." },
      { id: "str", icon: "beam", title: "Structural Analysis", desc: "Load calculations and structural design review for residential and light commercial." },
      { id: "asb", icon: "folder", title: "As-Built Plans", desc: "Accurate documentation of completed construction for permits, records, and the future." },
      { id: "int", icon: "plant", title: "Interior Design", desc: "Space planning, materials selection, and layout for residential and commercial interiors." },
    ],
  },
};

const FORMATS = [
  { id: "video", icon: "video", label: "Video Call", sub: "Google Meet or Zoom" },
  { id: "phone", icon: "phone", label: "Phone Call", sub: "We'll call you" },
];

const TIMES = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// ── Helpers ───────────────────────────────────────────────────────────────────
const money = (region, fee) => region === "ph" ? `₱${fee.toLocaleString()}` : `$${fee}`;
const fmtDate = (d) => d ? d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : "";
const fmtDateShort = (d) => d ? d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "";
const SANS = "'Hanken Grotesk', sans-serif";
const SERIF = "'Libre Caslon Display', serif";

// ── Line icon set ─────────────────────────────────────────────────────────────
function Icon({ name, size = 22, stroke = 1.6, color }) {
  const p = { fill: "none", stroke: color || "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    ruler: <g {...p}><rect x="3" y="8" width="18" height="8" rx="1.5" transform="rotate(-45 12 12)" /><path d="M9 7.5l1.2 1.2M11.5 5l1.2 1.2M14 2.5l1.2 1.2" /></g>,
    crane: <g {...p}><path d="M5 21V5l13 2" /><path d="M5 5l11-1.6" /><path d="M14 5.7V10M14 10l-2.2 2.2M14 10h3" /><path d="M3 21h7" /></g>,
    doc: <g {...p}><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4" /><path d="M10 12h6M10 15.5h6" /></g>,
    draft: <g {...p}><path d="M4 4h16v16H4z" /><path d="M4 9h16M9 9v11" /><path d="M13 13l4 4M13 17l4-4" /></g>,
    calc: <g {...p}><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8" /><path d="M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01" /></g>,
    clip: <g {...p}><rect x="5" y="5" width="14" height="16" rx="2" /><path d="M9 5a3 3 0 0 1 6 0" /><path d="M9 12h6M9 16h4" /></g>,
    beam: <g {...p}><path d="M3 7h18M3 7l3 4M21 7l-3 4M6 11h12M6 11l-2 6M18 11l2 6" /><circle cx="12" cy="14" r="1.1" /></g>,
    folder: <g {...p}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M3 11h18" /></g>,
    plant: <g {...p}><path d="M12 21v-7" /><path d="M12 14c-3 0-5-2-5-5 3 0 5 2 5 5z" /><path d="M12 12c0-3 2-5 5-5 0 3-2 5-5 5z" /><path d="M8 21h8" /></g>,
    video: <g {...p}><rect x="3" y="6" width="13" height="12" rx="2" /><path d="M16 10l5-3v10l-5-3z" /></g>,
    phone: <g {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L20 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" transform="scale(0.86) translate(1.6 1.2)" /></g>,
    globe: <g {...p}><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18" /></g>,
    check: <g {...p}><path d="M4 12l5 5L20 6" /></g>,
    cal: <g {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></g>,
    clock: <g {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></g>,
    card: <g {...p}><rect x="2.5" y="5" width="19" height="14" rx="2.5" /><path d="M2.5 9.5h19M6 15h4" /></g>,
    bank: <g {...p}><path d="M4 10h16M5 10l7-5 7 5M6 10v7M10 10v7M14 10v7M18 10v7M4 20h16" /></g>,
    mail: <g {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3.5 7l8.5 6 8.5-6" /></g>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24">{paths[name] || null}</svg>;
}

// ── Brand: CSS wordmark fallback + flags ──────────────────────────────────────
function RVPLogo({ variant = "light", scale = 1, align = "center" }) {
  const ink = variant === "light" ? "#F4F6FB" : "#14233E";
  const rule = variant === "light" ? "rgba(244,246,251,0.85)" : "rgba(20,35,62,0.85)";
  const sub = "#C9A84C";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: align === "center" ? "center" : "flex-start", lineHeight: 1, fontFamily: SERIF }}>
      <div style={{ position: "relative", display: "inline-flex", alignItems: "baseline", color: ink, fontSize: `${64 * scale}px`, fontWeight: 400 }}>
        <span>R</span>
        <span style={{ position: "relative", display: "inline-block" }}>V
          <span style={{ position: "absolute", top: `${0.30 * scale}em`, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: `${0.13 * scale}em solid transparent`, borderRight: `${0.13 * scale}em solid transparent`, borderTop: `${0.20 * scale}em solid ${sub}` }} />
        </span>
        <span>P</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: `${6 * scale}px`, marginTop: `${10 * scale}px`, width: "100%", justifyContent: align === "center" ? "center" : "flex-start" }}>
        <div style={{ flex: 1, height: "1px", background: rule }} />
        <span style={{ color: ink, fontFamily: SANS, fontSize: `${13 * scale}px`, fontWeight: 600, letterSpacing: `${0.42 * scale}em`, paddingLeft: `${0.42 * scale}em` }}>ENGINEERING&nbsp;SERVICES</span>
        <div style={{ flex: 1, height: "1px", background: rule }} />
      </div>
      <span style={{ color: sub, fontFamily: SANS, fontSize: `${10.5 * scale}px`, fontWeight: 700, letterSpacing: `${0.26 * scale}em`, marginTop: `${8 * scale}px`, paddingLeft: `${0.26 * scale}em` }}>PRECONSTRUCTION &amp; ESTIMATION</span>
    </div>
  );
}

function FlagUS({ w = 64, radius = 5 }) {
  const h = w * 0.66;
  return (
    <svg width={w} height={h} viewBox="0 0 66 44" style={{ borderRadius: radius, display: "block", boxShadow: "0 2px 8px rgba(0,0,0,0.25)" }}>
      <rect width="66" height="44" fill="#B22234" />
      {[1, 3, 5, 7, 9, 11].map(i => <rect key={i} y={i * 44 / 13} width="66" height={44 / 13} fill="#fff" />)}
      <rect width="28" height={44 * 7 / 13} fill="#3C3B6E" />
      {Array.from({ length: 4 }).map((_, r) =>
        Array.from({ length: 5 }).map((_, c) => (
          <circle key={`${r}-${c}`} cx={3 + c * 5.4 + (r % 2 ? 2.7 : 0)} cy={3.2 + r * 5} r="0.9" fill="#fff" />
        ))
      )}
    </svg>
  );
}

function FlagPH({ w = 64, radius = 5 }) {
  const h = w * 0.66;
  return (
    <svg width={w} height={h} viewBox="0 0 66 44" style={{ borderRadius: radius, display: "block", boxShadow: "0 2px 8px rgba(0,0,0,0.25)" }}>
      <rect width="66" height="22" fill="#0038A8" />
      <rect y="22" width="66" height="22" fill="#CE1126" />
      <polygon points="0,0 30,22 0,44" fill="#fff" />
      <g fill="#FCD116">
        <circle cx="10.5" cy="22" r="4" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
          const r = a * Math.PI / 180;
          return <line key={a} x1={10.5 + Math.cos(r) * 5} y1={22 + Math.sin(r) * 5} x2={10.5 + Math.cos(r) * 7.4} y2={22 + Math.sin(r) * 7.4} stroke="#FCD116" strokeWidth="1.1" strokeLinecap="round" />;
        })}
        <circle cx="4.5" cy="6.5" r="1.2" />
        <circle cx="4.5" cy="37.5" r="1.2" />
        <circle cx="20" cy="22" r="1.2" />
      </g>
    </svg>
  );
}

// Logo: real PNG if present, else CSS wordmark fallback.
function Logo({ scale = 1.5 }) {
  const [err, setErr] = useState(false);
  if (err) return <RVPLogo variant="light" scale={0.82} />;
  return <img src={LOGO_SRC} alt="RVP Engineering Services" onError={() => setErr(true)} style={{ height: 104 * scale, objectFit: "contain", display: "block" }} />;
}

// ── Golden Gate Bridge blueprint background ───────────────────────────────────
function BlueprintBG() {
  const L = "#6AA0E6";
  const s = { stroke: L, fill: "none", vectorEffect: "non-scaling-stroke" };
  const thin = { ...s, strokeWidth: 1 };
  const med = { ...s, strokeWidth: 1.4 };
  const hair = { ...s, strokeWidth: 0.6 };
  const dash = { ...s, strokeWidth: 1, strokeDasharray: "7 6" };
  const tick = { stroke: L, strokeWidth: 1.2 };
  const txt = { fill: L, fontFamily: SANS, fontSize: 13, letterSpacing: "0.12em" };

  const txL = 430, txR = 1010, topY = 150, deckY = 620, waterY = 760, baseY = 760, aL = 120, aR = 1320, anchY = 612;
  const midSag = 470;
  const mid = (txL + txR) / 2;
  const k = (midSag - topY) / Math.pow(mid - txL, 2);
  const cableY = (x) => midSag - k * Math.pow(x - mid, 2);
  const legHalfTop = 11, legHalfBot = 30;
  const legX = (cx, y, side) => {
    const t = (y - topY) / (baseY - topY);
    return cx + side * (legHalfTop + (legHalfBot - legHalfTop) * t);
  };

  const Tower = ({ cx }) => {
    const braceY = [196, 262, 336, 420, 512, 588];
    return (
      <g>
        <line x1={legX(cx, topY, -1)} y1={topY} x2={legX(cx, baseY, -1)} y2={baseY} {...med} />
        <line x1={legX(cx, topY, 1)} y1={topY} x2={legX(cx, baseY, 1)} y2={baseY} {...med} />
        <line x1={legX(cx, topY, -1)} y1={topY} x2={legX(cx, topY, 1)} y2={topY} {...med} />
        <rect x={cx - 8} y={topY - 14} width="16" height="14" {...thin} />
        {braceY.map((y, i) => (
          <g key={i}>
            <line x1={legX(cx, y, -1)} y1={y} x2={legX(cx, y, 1)} y2={y} {...thin} />
            <line x1={legX(cx, y + 9, -1)} y1={y + 9} x2={legX(cx, y + 9, 1)} y2={y + 9} {...hair} />
          </g>
        ))}
        <line x1={legX(cx, baseY, -1)} y1={baseY} x2={legX(cx, baseY, 1)} y2={baseY} {...med} />
      </g>
    );
  };

  const suspenders = [];
  for (let x = txL + 26; x < txR - 20; x += 42) suspenders.push(<line key={x} x1={x} y1={cableY(x)} x2={x} y2={deckY} {...hair} />);
  const sideSus = [];
  for (let i = 1; i <= 5; i++) {
    const xl = aL + (txL - aL) * (i / 6);
    const yl = anchY + (topY - anchY) * Math.pow(i / 6, 1.4);
    sideSus.push(<line key={"l" + i} x1={xl} y1={yl} x2={xl} y2={deckY} {...hair} />);
    const xr = txR + (aR - txR) * (i / 6);
    const yr = topY + (anchY - topY) * Math.pow(i / 6, 1 / 1.4);
    sideSus.push(<line key={"r" + i} x1={xr} y1={yr} x2={xr} y2={deckY} {...hair} />);
  }

  return (
    <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden", opacity: 0.16 }}>
      <svg width="100%" height="100%" viewBox="0 0 1440 1024" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
        <g {...hair} opacity="0.4">
          {Array.from({ length: 30 }, (_, i) => <line key={"v" + i} x1={i * 52} y1="0" x2={i * 52} y2="1024" />)}
          {Array.from({ length: 22 }, (_, i) => <line key={"h" + i} x1="0" y1={i * 52} x2="1440" y2={i * 52} />)}
        </g>
        <path d={`M${txL} ${topY} Q${mid} ${2 * midSag - topY} ${txR} ${topY}`} {...med} />
        <path d={`M${aL} ${anchY} C${aL + 130} ${anchY - 30} ${txL - 70} ${topY + 130} ${txL} ${topY}`} {...med} />
        <path d={`M${txR} ${topY} C${txR + 70} ${topY + 130} ${aR - 130} ${anchY - 30} ${aR} ${anchY}`} {...med} />
        <g>{suspenders}{sideSus}</g>
        <Tower cx={txL} />
        <Tower cx={txR} />
        <line x1={aL - 20} y1={deckY} x2={aR + 20} y2={deckY} {...med} />
        <line x1={aL - 20} y1={deckY + 11} x2={aR + 20} y2={deckY + 11} {...thin} />
        <line x1={aL - 20} y1={deckY + 5.5} x2={aR + 20} y2={deckY + 5.5} {...hair} />
        <rect x={aL - 34} y={anchY} width="40" height={deckY - anchY + 26} {...thin} />
        <rect x={aR - 6} y={anchY} width="40" height={deckY - anchY + 26} {...thin} />
        <line x1="0" y1={waterY} x2="1440" y2={waterY} {...thin} opacity="0.6" />
        {Array.from({ length: 18 }, (_, i) => <path key={"w" + i} d={`M${40 + i * 80} ${waterY + 20} q20 -10 40 0 t40 0`} {...hair} opacity="0.55" />)}
        {Array.from({ length: 16 }, (_, i) => <path key={"w2" + i} d={`M${80 + i * 80} ${waterY + 44} q20 -10 40 0 t40 0`} {...hair} opacity="0.4" />)}
        <line x1={txL} y1="700" x2={txR} y2="700" {...thin} />
        <line x1={txL} y1="694" x2={txL} y2="706" {...tick} />
        <line x1={txR} y1="694" x2={txR} y2="706" {...tick} />
        <text x={mid} y="694" {...txt} textAnchor="middle">MAIN SPAN 1,280 m</text>
        <line x1="350" y1={topY} x2="350" y2={deckY} {...thin} />
        <line x1="344" y1={topY} x2="356" y2={topY} {...tick} />
        <line x1="344" y1={deckY} x2="356" y2={deckY} {...tick} />
        <text x="338" y={(topY + deckY) / 2} {...txt} textAnchor="middle" transform={`rotate(-90 338 ${(topY + deckY) / 2})`}>TOWER 227 m</text>
        <g transform="translate(1140 110)" opacity="0.82">
          <circle cx="80" cy="80" r="78" {...thin} />
          <circle cx="80" cy="80" r="78" {...dash} opacity="0.5" />
          <circle cx="80" cy="80" r="48" {...thin} />
          {Array.from({ length: 6 }, (_, ring) =>
            Array.from({ length: 6 + ring * 3 }, (_, j) => {
              const r = 7 + ring * 8, a = (j / (6 + ring * 3)) * Math.PI * 2;
              return <circle key={`${ring}-${j}`} cx={80 + r * Math.cos(a)} cy={80 + r * Math.sin(a)} r="3.2" {...hair} />;
            })
          )}
          <line x1="158" y1="80" x2="220" y2="80" {...thin} />
          <text x="220" y="76" {...txt} fontSize="12">MAIN CABLE</text>
          <text x="220" y="94" {...txt} fontSize="11" opacity="0.8">⌀ 0.92 m</text>
        </g>
        <g transform="translate(1330 360)" opacity="0.8">
          <line x1="0" y1="0" x2="0" y2="240" {...dash} />
          <path d="M0 0 l-14 22 28 0 z" {...thin} />
          <text x="18" y="130" {...txt} fontSize="12">SECTION A–A</text>
        </g>
        <g transform="translate(110 900)" opacity="0.85">
          <circle cx="0" cy="0" r="32" {...thin} />
          <path d="M0 -26 L9 7 L0 0 L-9 7 Z" {...thin} />
          <text x="0" y="-38" {...txt} fontSize="13" textAnchor="middle">N</text>
        </g>
      </svg>
    </div>
  );
}

// ── UI atoms ──────────────────────────────────────────────────────────────────
const LBL = { fontFamily: SANS, fontSize: 12, fontWeight: 700, color: T.MUTED, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 11px" };
const NEXT = (on, grow) => ({ background: on ? T.GOLD : T.BORD, border: "none", borderRadius: 11, color: on ? T.BG : T.FAINT, fontFamily: SANS, fontSize: 15, fontWeight: 700, padding: "13px 30px", cursor: on ? "pointer" : "not-allowed", transition: "all .18s", flex: grow ? 1 : "none", boxShadow: on ? "0 8px 20px rgba(212,178,90,0.28)" : "none" });

function Chip({ children, color }) {
  return <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: color || T.GOLD, background: T.GOLD_SOFT, border: `1px solid ${(color || T.GOLD)}55`, borderRadius: 999, padding: "3px 9px", whiteSpace: "nowrap" }}>{children}</span>;
}

function Stepper({ step }) {
  const steps = ["Service", "Format", "Time", "Details", "Pay"];
  return (
    <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 26 }}>
      {steps.map((s, i) => {
        const done = i < step, active = i === step;
        return (
          <div key={s} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
            {i > 0 && <div style={{ position: "absolute", top: 17, right: "50%", width: "100%", height: 2, background: i <= step ? T.GOLD : T.BORD, transition: "background .3s" }} />}
            <div style={{ position: "relative", zIndex: 1, width: 34, height: 34, borderRadius: "50%", background: active || done ? T.GOLD : T.CARD2, border: `2px solid ${active || done ? T.GOLD : T.BORD}`, color: active || done ? T.BG : T.MUTED, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13.5, transition: "all .3s", boxShadow: active ? `0 0 0 5px ${T.GOLD_SOFT}` : "none" }}>
              {done ? <Icon name="check" size={15} stroke={2.4} color={T.BG} /> : i + 1}
            </div>
            <span style={{ fontFamily: SANS, fontSize: 11.5, marginTop: 8, color: active ? T.GOLD : T.MUTED, fontWeight: active ? 700 : 500 }}>{s}</span>
          </div>
        );
      })}
    </div>
  );
}

function SelCard({ selected, onClick, children, style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: selected ? T.CARD3 : T.CARD2, border: `1.5px solid ${selected ? T.GOLD : hov ? T.BORDS : T.BORD}`, borderRadius: 14, padding: 16, cursor: "pointer", position: "relative", transition: "all .18s", transform: hov && !selected ? "translateY(-1px)" : "none", boxShadow: selected ? "0 6px 22px rgba(0,0,0,0.28)" : hov ? "0 4px 16px rgba(0,0,0,0.22)" : "none", ...style }}>
      {children}
    </div>
  );
}

function RadioDot({ on }) {
  return <div style={{ width: 22, height: 22, borderRadius: "50%", border: `1.5px solid ${on ? T.GOLD : T.BORD}`, background: on ? T.GOLD : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .18s" }}>{on && <Icon name="check" size={12} stroke={2.6} color={T.BG} />}</div>;
}

function IconBadge({ name, active }) {
  return <div style={{ width: 46, height: 46, borderRadius: 12, flexShrink: 0, background: active ? T.GOLD : T.CARD, border: `1px solid ${active ? T.GOLD : T.BORD}`, display: "flex", alignItems: "center", justifyContent: "center", color: active ? T.BG : T.GOLD, transition: "all .18s" }}><Icon name={name} size={23} /></div>;
}

function Field({ label, value, onChange, type = "text", placeholder = "", hint }) {
  const [foc, setFoc] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontFamily: SANS, fontSize: 12.5, fontWeight: 600, color: T.TEXT2, marginBottom: 6 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} onFocus={() => setFoc(true)} onBlur={() => setFoc(false)}
        style={{ width: "100%", background: T.BG, border: `1.5px solid ${foc ? T.GOLD : T.BORD}`, borderRadius: 10, padding: "12px 14px", color: T.TEXT, fontFamily: SANS, fontSize: 15, outline: "none", transition: "border .15s", boxShadow: foc ? `0 0 0 4px ${T.GOLD_SOFT}` : "none" }} />
      {hint && <p style={{ fontSize: 11.5, color: T.FAINT, margin: "6px 0 0" }}>{hint}</p>}
    </div>
  );
}

function SummaryRow({ label, value, accent }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 7 }}>
      <span style={{ fontSize: 12.5, color: T.MUTED, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 12.5, color: accent ? T.GOLD : T.TEXT, textAlign: "right", fontWeight: accent ? 700 : 600 }}>{value}</span>
    </div>
  );
}

function Calendar({ value, onChange }) {
  const today = new Date();
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const days = new Date(view.y, view.m + 1, 0).getDate();
  const first = new Date(view.y, view.m, 1).getDay();
  const cells = Array(first).fill(null).concat(Array.from({ length: days }, (_, i) => i + 1));
  const prev = () => setView(v => v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 });
  const next = () => setView(v => v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 });
  const t0 = new Date(); t0.setHours(0, 0, 0, 0);
  const isPast = d => { if (!d) return true; const dt = new Date(view.y, view.m, d); dt.setHours(0, 0, 0, 0); return dt < t0; };
  const isToday = d => d && view.y === today.getFullYear() && view.m === today.getMonth() && d === today.getDate();
  const isSel = d => d && value && value.getFullYear() === view.y && value.getMonth() === view.m && value.getDate() === d;
  const navBtn = { background: T.CARD2, border: `1px solid ${T.BORD}`, color: T.TEXT, cursor: "pointer", fontSize: 16, width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" };
  return (
    <div style={{ background: T.BG, border: `1px solid ${T.BORD}`, borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "14px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={prev} style={navBtn}>‹</button>
        <span style={{ fontFamily: SANS, fontWeight: 700, color: T.TEXT, fontSize: 15 }}>{MONTHS[view.m]} {view.y}</span>
        <button onClick={next} style={navBtn}>›</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3, padding: "0 12px 14px" }}>
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: T.FAINT, padding: "4px 0" }}>{d}</div>)}
        {cells.map((d, i) => {
          const past = isPast(d), sel = isSel(d);
          return (
            <div key={i} onClick={() => d && !past && onChange(new Date(view.y, view.m, d))}
              style={{ position: "relative", textAlign: "center", padding: "9px 0", borderRadius: 9, fontSize: 13.5, cursor: d && !past ? "pointer" : "default", background: sel ? T.GOLD : "transparent", color: sel ? T.BG : past ? T.BORD : T.TEXT, fontWeight: sel ? 700 : 500, transition: "background .12s", outline: isToday(d) && !sel ? `1px solid ${T.BORDS}` : "none" }}
              onMouseEnter={e => { if (d && !past && !sel) e.currentTarget.style.background = T.CARD2; }}
              onMouseLeave={e => { if (!sel) e.currentTarget.style.background = "transparent"; }}>
              {d || ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PayPanel({ tone, children }) {
  const map = { green: { bg: T.GREEN_BG, bd: T.GREEN_BD }, blue: { bg: T.BLUE_BG, bd: T.BLUE_BD } }[tone];
  return <div style={{ background: map.bg, border: `1px solid ${map.bd}`, borderRadius: 12, padding: 16, marginTop: 12 }}>{children}</div>;
}

function Confirm({ checked, onChange, tone, label }) {
  const tx = tone === "blue" ? T.BLUE_TX : T.GREEN;
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 11, marginTop: 14, cursor: "pointer" }}>
      <span style={{ width: 20, height: 20, borderRadius: 6, border: `1.5px solid ${checked ? tx : tx + "88"}`, background: checked ? tx : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .15s" }}>
        {checked && <Icon name="check" size={12} stroke={2.6} color={T.BG} />}
      </span>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ display: "none" }} />
      <span style={{ fontSize: 13, color: tx, fontWeight: 600 }}>{label}</span>
    </label>
  );
}

// ── Shell + summary strip ─────────────────────────────────────────────────────
function BookingStrip({ rd, svc, fmt, amount, date, time }) {
  const items = [];
  if (rd) items.push(rd.label);
  if (svc) items.push(svc.title);
  if (fmt) items.push(`${fmt.label} · ${amount}`);
  if (date) items.push(fmtDateShort(date));
  if (time) items.push(time);
  if (!items.length) return null;
  return (
    <div style={{ background: T.CARD, border: `1px solid ${T.BORD}`, borderRadius: 12, padding: "12px 16px", marginBottom: 18, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.GOLD, marginRight: 2 }}>Your booking</span>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          <span style={{ color: T.FAINT }}>·</span>
          <span style={{ fontSize: 12.5, color: T.TEXT2, fontWeight: 600 }}>{it}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

function Shell({ children, step, summary, hideStepper }) {
  return (
    <div style={{ position: "relative", minHeight: "100vh", background: T.BG, fontFamily: SANS }}>
      <BlueprintBG />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "40px 24px 30px", borderBottom: `1px solid ${T.BORD}` }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}><Logo scale={1.5} /></div>
        <h1 style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 400, color: T.TEXT, letterSpacing: "-0.01em", margin: 0 }}>Schedule a Consultation</h1>
        <p style={{ fontSize: 14, color: T.MUTED, marginTop: 10 }}>Let's build something great together!</p>
      </div>
      <div style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto", padding: "28px 20px 44px" }}>
        {!hideStepper && <Stepper step={step} />}
        {summary && <BookingStrip {...summary} />}
        <div style={{ background: T.CARD, border: `1px solid ${T.BORD}`, borderRadius: 18, padding: "26px 24px" }}>{children}</div>
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <a href={`mailto:${BIZ.email}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, color: T.GOLD, textDecoration: "none", fontSize: 13 }}>
            <Icon name="mail" size={16} color={T.GOLD} />{BIZ.email}
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function RVPBooking() {
  const [step, setStep] = useState(0);
  const [region, setRegion] = useState(null);
  const [service, setService] = useState(null);
  const [format, setFormat] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [pay, setPay] = useState(null);
  const [payOk, setPayOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const [aiNote, setAiNote] = useState("");
  const [done, setDone] = useState(false);

  const rd = region ? REGIONS[region] : null;
  const svc = rd?.services.find(s => s.id === service);
  const fmt = FORMATS.find(f => f.id === format);
  const amount = rd ? money(region, rd.fee) : "";

  const payOptions = region === "ph"
    ? [{ id: "gcash", icon: "phone", label: "GCash", sub: `Send to ${BIZ.gcash}` },
       { id: "bluevine", icon: "card", label: "Pay Online", sub: "Credit / debit card via BlueVine" },
       { id: "ach", icon: "bank", label: "Bank Transfer (ACH)", sub: `Direct deposit to ${BIZ.name}` }]
    : [{ id: "bluevine", icon: "card", label: "Pay Online", sub: "Credit / debit card via BlueVine" },
       { id: "ach", icon: "bank", label: "Bank Transfer (ACH)", sub: `Direct deposit to ${BIZ.name}` }];

  const canNext = [region && service, format, date && time, name.trim() && email.trim(), payOk][step];

  const reset = () => { setStep(0); setRegion(null); setService(null); setFormat(null); setDate(null); setTime(null); setName(""); setEmail(""); setPhone(""); setNotes(""); setPay(null); setPayOk(false); setDone(false); setAiNote(""); };

  const submit = async () => {
    setBusy(true);
    const fallback = `Thanks, ${name.split(" ")[0]}! Your ${fmt?.label.toLowerCase()} for ${svc?.title} is locked in for ${fmtDateShort(date)} at ${time}. We're looking forward to it — talk soon!`;
    let note = fallback;
    try {
      // Optional: swap for your own confirmation/email API.
      if (typeof window !== "undefined" && window.claude?.complete) {
        const r = await window.claude.complete(`Write a warm, friendly 2-sentence booking confirmation for ${name.split(" ")[0]}, who booked a ${fmt?.label} consultation on ${fmtDate(date)} at ${time} for "${svc?.title}" with RVP Engineering Services. Encouraging and personable, no greeting line, no quotes.`);
        if (r && r.trim()) note = r.trim();
      }
    } catch { /* keep fallback */ }
    setAiNote(note);
    setBusy(false);
    setDone(true);
  };

  const goNext = () => { if (canNext) setStep(s => Math.min(4, s + 1)); };
  const goBack = () => setStep(s => Math.max(0, s - 1));

  if (done) {
    return (
      <Shell hideStepper>
        <div style={{ textAlign: "center", padding: "8px 0 4px" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: T.GOLD, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: `0 0 0 8px ${T.GOLD_SOFT}` }}>
            <Icon name="check" size={36} stroke={3} color={T.BG} />
          </div>
          <h2 style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 400, color: T.TEXT, margin: "0 0 10px" }}>You're all set, {name.split(" ")[0]}!</h2>
          {aiNote && <p style={{ fontSize: 14.5, color: T.TEXT2, lineHeight: 1.65, maxWidth: 420, margin: "0 auto 22px" }}>{aiNote}</p>}
        </div>
        <div style={{ background: T.BG, border: `1px solid ${T.BORD}`, borderRadius: 14, padding: 18, textAlign: "left", marginBottom: 20 }}>
          <SummaryRow label="Service" value={svc?.title} />
          <SummaryRow label="Format" value={fmt?.label} />
          <SummaryRow label="Date" value={fmtDate(date)} />
          <SummaryRow label="Time" value={time} />
          <div style={{ borderTop: `1px solid ${T.BORD}`, margin: "9px 0", paddingTop: 9 }}>
            <SummaryRow label="Amount" value={amount} accent />
            <SummaryRow label="Paid via" value={pay === "gcash" ? "GCash" : pay === "ach" ? "ACH Bank Transfer" : "BlueVine Online"} />
          </div>
        </div>
        <p style={{ fontSize: 12.5, color: T.MUTED, textAlign: "center" }}>A confirmation is on its way to <strong style={{ color: T.TEXT }}>{email}</strong>.</p>
        <button onClick={reset} style={{ display: "block", margin: "22px auto 0", background: "none", border: `1px solid ${T.BORD}`, borderRadius: 10, color: T.MUTED, fontFamily: SANS, fontSize: 13.5, padding: "10px 22px", cursor: "pointer" }}>Book another</button>
      </Shell>
    );
  }

  const heads = [
    ["Let's get started", "First, where are you based and what do you need?"],
    ["How should we meet?", "Pick whichever's easiest for you."],
    ["Find a time that works", "All times shown in your local timezone."],
    ["Tell us about you", "So we can confirm and prepare for your session."],
    ["Last step — confirm & pay", "Complete payment to lock in your booking."],
  ][step];

  return (
    <Shell step={step} summary={step > 0 ? { region, rd, svc, fmt, amount, date, time } : null}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: SERIF, fontSize: 25, fontWeight: 400, color: T.TEXT, margin: "0 0 5px" }}>{heads[0]}</h2>
        <p style={{ fontSize: 13.5, color: T.MUTED, margin: 0 }}>{heads[1]}</p>
      </div>

      {step === 0 && (
        <>
          <p style={LBL}>Your region</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22 }}>
            {Object.entries(REGIONS).map(([key, r]) => (
              <SelCard key={key} selected={region === key} onClick={() => { setRegion(key); setService(null); }} style={{ textAlign: "center", padding: "20px 14px" }}>
                {region === key && <div style={{ position: "absolute", top: 10, right: 10 }}><RadioDot on /></div>}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>{key === "us" ? <FlagUS w={74} /> : <FlagPH w={74} />}</div>
                <div style={{ fontFamily: SANS, fontSize: 15.5, fontWeight: 700, color: T.TEXT }}>{r.label}</div>
              </SelCard>
            ))}
          </div>
          {rd && (
            <>
              <p style={LBL}>What can we help with?</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {rd.services.map(sv => (
                  <SelCard key={sv.id} selected={service === sv.id} onClick={() => setService(sv.id)}>
                    <div style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
                      <IconBadge name={sv.icon} active={service === sv.id} />
                      <div style={{ flex: 1, paddingRight: 26 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                          <span style={{ fontFamily: SANS, fontSize: 14.5, fontWeight: 700, color: T.TEXT }}>{sv.title}</span>
                          {sv.tag && <Chip>{sv.tag}</Chip>}
                        </div>
                        <div style={{ fontSize: 12.5, color: T.MUTED, lineHeight: 1.5 }}>{sv.desc}</div>
                      </div>
                      <div style={{ position: "absolute", top: 16, right: 16 }}><RadioDot on={service === sv.id} /></div>
                    </div>
                  </SelCard>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {FORMATS.map(f => (
            <SelCard key={f.id} selected={format === f.id} onClick={() => setFormat(f.id)}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <IconBadge name={f.icon} active={format === f.id} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 700, color: T.TEXT }}>{f.label}</div>
                  <div style={{ fontSize: 12.5, color: T.MUTED, marginTop: 2 }}>{f.sub}</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.GOLD }}>{amount}</div>
              </div>
            </SelCard>
          ))}
          <p style={{ fontSize: 12.5, color: T.FAINT, margin: "4px 2px 0", display: "flex", alignItems: "center", gap: 7 }}>
            <Icon name="clock" size={15} color={T.FAINT} /> 30-minute session · reschedule anytime
          </p>
        </div>
      )}

      {step === 2 && (
        <>
          <Calendar value={date} onChange={setDate} />
          {date && (
            <div style={{ marginTop: 18 }}>
              <p style={LBL}>Available times — {fmtDateShort(date)}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(88px,1fr))", gap: 8 }}>
                {TIMES.map(t => (
                  <div key={t} onClick={() => setTime(t)} style={{ padding: "10px 0", textAlign: "center", borderRadius: 9, fontFamily: SANS, fontSize: 13, fontWeight: 600, cursor: "pointer", background: time === t ? T.GOLD : T.CARD2, color: time === t ? T.BG : T.TEXT, border: `1.5px solid ${time === t ? T.GOLD : T.BORD}`, transition: "all .15s" }}>{t}</div>
                ))}
              </div>
            </div>
          )}
          {!date && <p style={{ fontSize: 12.5, color: T.FAINT, margin: "14px 2px 0", display: "flex", alignItems: "center", gap: 7 }}><Icon name="cal" size={15} color={T.FAINT} /> Pick a day to see open times.</p>}
        </>
      )}

      {step === 3 && (
        <>
          <Field label="Full name" value={name} onChange={setName} placeholder="e.g. Maria Santos" />
          <Field label="Email address" value={email} onChange={setEmail} type="email" placeholder="you@example.com" hint="We'll send your confirmation here." />
          <Field label="Phone number" value={phone} onChange={setPhone} type="tel" placeholder={region === "ph" ? "0917 000 0000" : "+1 (209) 555-0100"} />
          <div style={{ marginBottom: 4 }}>
            <label style={{ display: "block", fontFamily: SANS, fontSize: 12.5, fontWeight: 600, color: T.TEXT2, marginBottom: 6 }}>Anything we should know? <span style={{ color: T.FAINT, fontWeight: 500 }}>(optional)</span></label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Tell us a bit about your project or question…"
              style={{ width: "100%", background: T.BG, border: `1.5px solid ${T.BORD}`, borderRadius: 10, padding: "12px 14px", color: T.TEXT, fontFamily: SANS, fontSize: 15, outline: "none", resize: "vertical" }} />
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <div style={{ background: T.BG, borderRadius: 14, border: `1px solid ${T.BORD}`, padding: 16, marginBottom: 20 }}>
            <SummaryRow label="Service" value={svc?.title} />
            <SummaryRow label="Format" value={fmt?.label} />
            <SummaryRow label="Date" value={fmtDate(date)} />
            <SummaryRow label="Time" value={time} />
            <div style={{ borderTop: `1px solid ${T.BORD}`, marginTop: 9, paddingTop: 9 }}>
              <SummaryRow label="Total due" value={amount} accent />
            </div>
          </div>
          <p style={LBL}>Choose how to pay</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {payOptions.map(pm => (
              <SelCard key={pm.id} selected={pay === pm.id} onClick={() => { setPay(pm.id); setPayOk(false); }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <IconBadge name={pm.icon} active={pay === pm.id} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: SANS, fontSize: 14.5, fontWeight: 700, color: T.TEXT }}>{pm.label}</div>
                    <div style={{ fontSize: 12.5, color: T.MUTED, marginTop: 2 }}>{pm.sub}</div>
                  </div>
                  <div><RadioDot on={pay === pm.id} /></div>
                </div>
              </SelCard>
            ))}
          </div>

          {pay === "bluevine" && (
            <PayPanel tone="green">
              <p style={{ fontSize: 13.5, color: T.GREEN, fontWeight: 700, margin: "0 0 4px" }}>Pay {amount} securely online</p>
              <p style={{ fontSize: 12.5, color: "#4FB587", margin: "0 0 12px" }}>BlueVine's secure checkout opens in a new tab.</p>
              <a href={BIZ.bluevineLink} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: T.GOLD, color: T.BG, fontFamily: SANS, fontWeight: 700, fontSize: 13.5, padding: "11px 22px", borderRadius: 9, textDecoration: "none" }}>Pay {amount} now →</a>
              <Confirm tone="green" checked={payOk} onChange={setPayOk} label={`I've completed the payment of ${amount}`} />
            </PayPanel>
          )}
          {pay === "ach" && (
            <PayPanel tone="blue">
              <p style={{ fontSize: 13.5, color: T.BLUE_TX, fontWeight: 700, margin: "0 0 10px" }}>Send {amount} via ACH to:</p>
              <SummaryRow label="Account name" value={BIZ.name} />
              <SummaryRow label="Routing number" value={BIZ.routing} />
              <SummaryRow label="Account number" value={BIZ.account} />
              <SummaryRow label="Account type" value="Checking" />
              <Confirm tone="blue" checked={payOk} onChange={setPayOk} label={`I've initiated the ACH transfer of ${amount}`} />
            </PayPanel>
          )}
          {pay === "gcash" && (
            <PayPanel tone="green">
              <p style={{ fontSize: 13.5, color: T.GREEN, fontWeight: 700, margin: "0 0 4px" }}>Send {amount} to {BIZ.gcash} via GCash</p>
              <p style={{ fontSize: 12.5, color: "#4FB587", margin: 0 }}>After sending, tick the box below to confirm.</p>
              <Confirm tone="green" checked={payOk} onChange={setPayOk} label={`I've sent the payment of ${amount}`} />
            </PayPanel>
          )}
        </>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 26 }}>
        {step > 0
          ? <button onClick={goBack} style={{ background: "none", border: `1.5px solid ${T.BORD}`, borderRadius: 11, color: T.TEXT2, fontFamily: SANS, fontSize: 14.5, fontWeight: 600, padding: "12px 22px", cursor: "pointer" }}>← Back</button>
          : <div />}
        {step < 4
          ? <button onClick={goNext} disabled={!canNext} style={NEXT(canNext, step === 0)}>Continue →</button>
          : <button onClick={() => canNext && !busy && submit()} disabled={!canNext || busy} style={NEXT(canNext && !busy)}>{busy ? "Confirming…" : "Confirm booking"}</button>}
      </div>
    </Shell>
  );
}
