import { useState, useEffect } from "react";

// ── EDITABLE BUSINESS DETAILS ─────────────────────────────────────────────────
const BLUEVINE_LINK    = "https://pay.bluevine.com/p/c2238b2b9b234bd7957949790cc232c5";
const BLUEVINE_ROUTING = "125109019";
const BLUEVINE_ACCOUNT = "875112062463";
const BLUEVINE_NAME    = "RVP Engineering Services";
const GCASH            = "0945-130-3714";
const FEE_BASE     = 50;   // USD base fee (30-min session)
const FEE_PH_BASE  = 2500; // PHP base fee for Philippine consultations

const SERVICE_REGIONS = {
  us: {
    label: "United States",
    flag: "US",
    currency: "USD",
    services: [
      {
        id: "pre",
        title: "Preconstruction & Estimating",
        desc: "Conceptual budgeting, bid strategy, scope review, quantity takeoff, and value engineering for commercial and public works projects.",
        icon: "📐",
      },
      {
        id: "eng",
        title: "Project Engineering",
        desc: "RFI/submittal management, schedule coordination, subcontractor oversight, and field problem-solving for civil and structural scopes.",
        icon: "🏗️",
      },
    ],
  },
  ph: {
    label: "Philippines",
    flag: "PH",
    currency: "PHP",
    services: [
      { id: "bpa",  title: "Building Permit Application",  desc: "End-to-end preparation and filing of building permit documents with the local government unit.", icon: "📋" },
      { id: "csp",  title: "Complete Set of Plans",        desc: "Architectural, structural, electrical, plumbing, and sanitary drawings for permit and construction.", icon: "📏" },
      { id: "est",  title: "Detailed Estimates",           desc: "Line-item quantity takeoff and cost estimate for bidding and budget planning.", icon: "🧮" },
      { id: "tsp",  title: "Technical Specifications",     desc: "Written scope of work and material specifications aligned to Philippine construction standards.", icon: "📝" },
      { id: "str",  title: "Structural Analysis",          desc: "Load calculations and structural design review for residential and light commercial buildings.", icon: "🔩" },
      { id: "asb",  title: "As-Built Plans",               desc: "Accurate documentation of completed construction for permits, records, and future reference.", icon: "🗂️" },
      { id: "int",  title: "Interior Design",              desc: "Space planning, materials selection, and layout design for residential and commercial interiors.", icon: "🪴" },
    ],
  },
};

const US_FORMATS = [
  { id: "video", label: "Video Call", sub: "Google Meet or Zoom", fee: FEE_BASE, icon: "📹" },
  { id: "phone", label: "Phone Call", sub: "We call you",         fee: FEE_BASE, icon: "📞" },
];
const PH_FORMATS = [
  { id: "video", label: "Video Call",  sub: "Google Meet or Zoom", fee: FEE_PH_BASE, icon: "📹" },
  { id: "phone", label: "Phone Call",  sub: "We call you",         fee: FEE_PH_BASE, icon: "📞" },
];

const TIMES = ["8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"];

const NAVY  = "#1B2A4A";
const BLUE  = "#2B5797";
const GOLD  = "#C9A84C";
const PALE  = "#E8D8A0";
const BG    = "#0E1A2D";
const CARD  = "#162236";
const CARD2 = "#1E2F47";
const BORD  = "#243551";
const TEXT  = "#F0F4FA";
const MUTED = "#8BA3C4";

// ── UTILITY ───────────────────────────────────────────────────────────────────
const fmtDate = (d) => d ? d.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"}) : "";
const getDays = (y,m) => new Date(y,m+1,0).getDate();
const getFirst = (y,m) => new Date(y,m,1).getDay();
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// ── SUB-COMPONENTS ────────────────────────────────────────────────────────────
function FlagUS() {
  return (
    <svg width="36" height="26" viewBox="0 0 36 26" xmlns="http://www.w3.org/2000/svg" style={{borderRadius:"3px"}}>
      <rect width="36" height="26" fill="#B22234"/>
      <rect y="2" width="36" height="2" fill="#fff"/>
      <rect y="6" width="36" height="2" fill="#fff"/>
      <rect y="10" width="36" height="2" fill="#fff"/>
      <rect y="14" width="36" height="2" fill="#fff"/>
      <rect y="18" width="36" height="2" fill="#fff"/>
      <rect y="22" width="36" height="2" fill="#fff"/>
      <rect width="15" height="14" fill="#3C3B6E"/>
      <g fill="#fff" fontSize="4" fontFamily="serif">
        <text x="1.5" y="4.5">★★★</text>
        <text x="3" y="8">★★</text>
        <text x="1.5" y="11.5">★★★</text>
      </g>
    </svg>
  );
}
function FlagPH() {
  return (
    <svg width="36" height="26" viewBox="0 0 36 26" xmlns="http://www.w3.org/2000/svg" style={{borderRadius:"3px"}}>
      <rect width="36" height="13" fill="#0038A8"/>
      <rect y="13" width="36" height="13" fill="#CE1126"/>
      <polygon points="0,0 18,13 0,26" fill="#fff"/>
      <circle cx="7" cy="13" r="3.5" fill="#FCD116"/>
      <polygon points="7,8 7.6,11 10.5,11 8.2,12.8 9,15.8 7,14 5,15.8 5.8,12.8 3.5,11 6.4,11" fill="#0038A8"/>
    </svg>
  );
}
function BlueVineLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" aria-label="BlueVine">
      <rect width="36" height="36" rx="8" fill="#0A4F96"/>
      <path d="M8 24l6-12 4 8 4-8 6 12" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function ACHLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" aria-label="Bank Transfer">
      <rect width="36" height="36" rx="8" fill="#1B4F72"/>
      <rect x="8" y="20" width="4" height="8" fill="#fff"/>
      <rect x="14" y="16" width="4" height="12" fill="#fff"/>
      <rect x="20" y="18" width="4" height="10" fill="#fff"/>
      <rect x="26" y="13" width="4" height="15" fill="#fff"/>
      <rect x="7" y="11" width="22" height="2.5" fill="#C9A84C" rx="1"/>
      <polygon points="18,6 7,11 29,11" fill="#C9A84C"/>
    </svg>
  );
}
function GCashLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" aria-label="GCash">
      <circle cx="18" cy="18" r="18" fill="#007DFE"/>
      <path d="M18 8.5a9.5 9.5 0 1 0 9.5 9.5h-3.2a6.3 6.3 0 1 1-1.85-4.46l2.27-2.27A9.47 9.47 0 0 0 18 8.5z" fill="#fff"/>
      <rect x="18" y="16.4" width="9.5" height="3.2" fill="#fff"/>
      <path d="M28.6 12.2c.9 1.3 1.5 2.7 1.8 4.2" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.85"/>
      <path d="M30.9 9.4c1.3 1.8 2.2 3.9 2.5 6.1" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.55"/>
    </svg>
  );
}
function GoldCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="10" fill={GOLD}/>
      <path d="M5.5 10.5l3 3 5.5-6" stroke="#1B2A4A" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function StepRail({ step }) {
  const steps = ["Region & Service","Consultation Format","Date & Time","Your Info","Confirm & Pay"];
  return (
    <div style={{ display:"flex", gap:"6px", alignItems:"center", justifyContent:"center", marginBottom:"28px", flexWrap:"wrap" }}>
      {steps.map((label, i) => {
        const active = i+1 === step;
        const done   = i+1 < step;
        return (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:"6px" }}>
            <div style={{
              display:"flex", alignItems:"center", gap:"6px",
              background: active ? GOLD : done ? BLUE : CARD2,
              borderRadius:"20px",
              padding: active ? "5px 14px" : "5px 10px",
              transition:"all 0.25s",
            }}>
              <div style={{
                width:"20px", height:"20px", borderRadius:"50%",
                background: active ? NAVY : done ? "#fff" : BORD,
                color: active ? GOLD : done ? BLUE : MUTED,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"11px", fontWeight:700, flexShrink:0,
              }}>
                {done ? <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke={BLUE} strokeWidth="2" fill="none" strokeLinecap="round"/></svg> : i+1}
              </div>
              {active && <span style={{ fontSize:"12px", fontWeight:600, color:NAVY, whiteSpace:"nowrap" }}>{label}</span>}
            </div>
            {i < steps.length-1 && <div style={{ width:"16px", height:"1px", background:BORD, flexShrink:0 }}/>}
          </div>
        );
      })}
    </div>
  );
}

function StepHead({ title, sub }) {
  return (
    <div style={{ marginBottom:"20px" }}>
      <h2 style={{ fontSize:"20px", fontWeight:700, color:TEXT, letterSpacing:"-0.3px" }}>{title}</h2>
      {sub && <p style={{ fontSize:"13px", color:MUTED, marginTop:"4px" }}>{sub}</p>}
    </div>
  );
}

function Card({ selected, onClick, children, style={} }) {
  return (
    <div onClick={onClick} style={{
      background: selected ? `${NAVY}CC` : CARD2,
      border: `1.5px solid ${selected ? GOLD : BORD}`,
      borderRadius:"12px",
      padding:"16px",
      cursor:"pointer",
      transition:"all 0.18s",
      position:"relative",
      ...style,
    }}>
      {selected && <div style={{ position:"absolute", top:"10px", right:"10px" }}><GoldCheck/></div>}
      {children}
    </div>
  );
}

function Input({ label, value, onChange, type="text", placeholder="" }) {
  return (
    <div style={{ marginBottom:"14px" }}>
      <label style={{ display:"block", fontSize:"12px", fontWeight:600, color:MUTED, marginBottom:"5px", textTransform:"uppercase", letterSpacing:"0.5px" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width:"100%",
          background:CARD2,
          border:`1.5px solid ${BORD}`,
          borderRadius:"8px",
          padding:"10px 12px",
          color:TEXT,
          fontSize:"14px",
          outline:"none",
        }}
      />
    </div>
  );
}

function BookingSummary({ region, service, format, date, time }) {
  const regionData = region ? SERVICE_REGIONS[region] : null;
  const svc = regionData?.services.find(s => s.id === service);
  const formats = region === "ph" ? PH_FORMATS : US_FORMATS;
  const fmt = formats.find(f => f.id === format);
  if (!svc && !fmt && !date) return null;
  return (
    <div style={{ background:CARD, border:`1px solid ${BORD}`, borderRadius:"12px", padding:"14px 16px", marginBottom:"20px" }}>
      <p style={{ fontSize:"11px", fontWeight:600, color:GOLD, textTransform:"uppercase", letterSpacing:"1px", marginBottom:"10px" }}>Your Booking</p>
      {regionData && <Row label="Region" value={regionData.label}/>}
      {svc && <Row label="Service" value={svc.title}/>}
      {fmt && <Row label="Format" value={`${fmt.label} — ${regionData?.currency === "PHP" ? `₱${fmt.fee.toLocaleString()}` : `$${fmt.fee}`}`}/>}
      {date && <Row label="Date" value={fmtDate(date)}/>}
      {time && <Row label="Time" value={time}/>}
    </div>
  );
}
function Row({ label, value }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"12px", marginBottom:"6px" }}>
      <span style={{ fontSize:"12px", color:MUTED, flexShrink:0 }}>{label}</span>
      <span style={{ fontSize:"12px", color:TEXT, textAlign:"right", fontWeight:500 }}>{value}</span>
    </div>
  );
}

function Calendar({ value, onChange }) {
  const today = new Date();
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const days = getDays(view.y, view.m);
  const first = getFirst(view.y, view.m);
  const cells = Array(first).fill(null).concat(Array.from({length:days},(_,i)=>i+1));
  const prev = () => setView(v => v.m === 0 ? {y:v.y-1,m:11} : {y:v.y,m:v.m-1});
  const next = () => setView(v => v.m === 11 ? {y:v.y+1,m:0} : {y:v.y,m:v.m+1});
  const isPast = (d) => { if(!d) return true; const dt = new Date(view.y, view.m, d); dt.setHours(0,0,0,0); const t = new Date(); t.setHours(0,0,0,0); return dt < t; };
  const isSel  = (d) => { if(!d||!value) return false; return value.getFullYear()===view.y && value.getMonth()===view.m && value.getDate()===d; };
  return (
    <div style={{ background:CARD, border:`1px solid ${BORD}`, borderRadius:"12px", overflow:"hidden" }}>
      <div style={{ background:NAVY, padding:"14px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button onClick={prev} style={{ background:"none", border:"none", color:PALE, cursor:"pointer", fontSize:"18px", padding:"2px 8px" }}>‹</button>
        <span style={{ fontWeight:700, color:TEXT, fontSize:"15px" }}>{MONTHS[view.m]} {view.y}</span>
        <button onClick={next} style={{ background:"none", border:"none", color:PALE, cursor:"pointer", fontSize:"18px", padding:"2px 8px" }}>›</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"2px", padding:"10px 10px 14px" }}>
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
          <div key={d} style={{ textAlign:"center", fontSize:"11px", fontWeight:600, color:MUTED, padding:"4px 0" }}>{d}</div>
        ))}
        {cells.map((d, i) => (
          <div key={i} onClick={() => d && !isPast(d) && onChange(new Date(view.y, view.m, d))}
            style={{
              textAlign:"center", padding:"7px 0", borderRadius:"8px", fontSize:"13px",
              cursor: d && !isPast(d) ? "pointer" : "default",
              background: isSel(d) ? GOLD : "transparent",
              color: isSel(d) ? NAVY : isPast(d) ? BORD : TEXT,
              fontWeight: isSel(d) ? 700 : 400,
              transition:"background 0.15s",
            }}>{d || ""}</div>
        ))}
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function RVPBooking() {
  const [step, setStep]           = useState(1);
  const [region, setRegion]       = useState(null);
  const [service, setService]     = useState(null);
  const [format, setFormat]       = useState(null);
  const [date, setDate]           = useState(null);
  const [time, setTime]           = useState(null);
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [phone, setPhone]         = useState("");
  const [notes, setNotes]         = useState("");
  const [payMethod, setPayMethod] = useState(null);
  const [payConfirmed, setPayConfirmed] = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [aiNote, setAiNote]             = useState("");
  const [done, setDone]                 = useState(false);

  const regionData = region ? SERVICE_REGIONS[region] : null;
  const services   = regionData?.services || [];
  const formats    = region === "ph" ? PH_FORMATS : US_FORMATS;
  const fmt        = formats.find(f => f.id === format);
  const svc        = services.find(s => s.id === service);
  const currency   = regionData?.currency || "USD";
  const amount     = fmt ? (currency === "PHP" ? `₱${fmt.fee.toLocaleString()}` : `$${fmt.fee}`) : "";
  const payHandle  = region === "ph" ? GCASH : BLUEVINE_LINK;
  const payOptions = region === "ph"
    ? [
        { id:"gcash",    label:"GCash",                 sub: "Send to " + GCASH,                              Logo: GCashLogo },
        { id:"bluevine", label:"Pay Online",             sub: "Credit / Debit Card via BlueVine",              Logo: BlueVineLogo },
        { id:"ach",      label:"Bank Transfer (ACH)",   sub: "Direct deposit to RVP Engineering Services",    Logo: ACHLogo },
      ]
    : [
        { id:"bluevine", label:"Pay Online",            sub: "Credit / Debit Card via BlueVine",              Logo: BlueVineLogo },
        { id:"ach",      label:"Bank Transfer (ACH)",   sub: "Direct deposit to RVP Engineering Services",    Logo: ACHLogo },
      ];

  const canNext = {
    1: region && service,
    2: format,
    3: date && time,
    4: name.trim() && email.trim(),
    5: payConfirmed,
  };

  const fetchAiNote = async (bookingData) => {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:180,
          messages:[{
            role:"user",
            content:`Write a warm 2-sentence confirmation for ${bookingData.name}, who just booked a ${bookingData.format} consultation on ${bookingData.date} at ${bookingData.time} for ${bookingData.service} with RVP Engineering Services. Keep it professional and encouraging. No greetings.`
          }]
        })
      });
      const data = await res.json();
      return data.content?.[0]?.text || "";
    } catch { return ""; }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const note = await fetchAiNote({
      name, format: fmt?.label, date: fmtDate(date), time, service: svc?.title,
    });
    setAiNote(note);
    setSubmitting(false);
    setDone(true);
  };

  if (done) {
    return (
      <div style={{ minHeight:"100vh", background:BG, display:"flex", alignItems:"center", justifyContent:"center", padding:"24px" }}>
        <div style={{ maxWidth:"480px", width:"100%", background:CARD, border:`1px solid ${BORD}`, borderRadius:"20px", padding:"36px 32px", textAlign:"center" }}>
          <div style={{ width:"64px", height:"64px", borderRadius:"50%", background:GOLD, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
            <svg width="30" height="30" viewBox="0 0 30 30"><path d="M5 15l7 7L25 7" stroke={NAVY} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <h2 style={{ fontSize:"22px", fontWeight:700, color:TEXT, marginBottom:"8px" }}>You're confirmed, {name.split(" ")[0]}!</h2>
          {aiNote && <p style={{ fontSize:"14px", color:MUTED, lineHeight:"1.6", marginBottom:"20px" }}>{aiNote}</p>}
          <div style={{ background:CARD2, borderRadius:"12px", padding:"16px", textAlign:"left", marginBottom:"24px" }}>
            <Row label="Service"  value={svc?.title || ""}/>
            <Row label="Format"   value={fmt?.label || ""}/>
            <Row label="Date"     value={fmtDate(date)}/>
            <Row label="Time"     value={time}/>
            <Row label="Amount"   value={amount}/>
            <Row label="Paid via" value={payMethod === "gcash" ? "GCash" : payMethod === "ach" ? "ACH Bank Transfer" : "BlueVine Online"}/>
          </div>
          <p style={{ fontSize:"12px", color:MUTED }}>A confirmation will be sent to <strong style={{color:TEXT}}>{email}</strong>.</p>
          <button onClick={() => { setStep(1); setRegion(null); setService(null); setFormat(null); setDate(null); setTime(null); setName(""); setEmail(""); setPhone(""); setNotes(""); setPayMethod(null); setPayConfirmed(false); setDone(false); setAiNote(""); }}
            style={{ marginTop:"24px", background:"none", border:`1px solid ${BORD}`, borderRadius:"8px", color:MUTED, fontSize:"13px", padding:"9px 20px", cursor:"pointer" }}>
            Book Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:BG, padding:"32px 16px", fontFamily:"'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:"32px" }}>
        <img src="/RVP Logo V2.png" alt="RVP Engineering Services" style={{ height:"100px", objectFit:"contain", marginBottom:"6px", borderRadius:"8px" }}/>
        <p style={{ fontSize:"13px", color:MUTED }}>Schedule a Consultation</p>
      </div>

      <div style={{ maxWidth:"580px", margin:"0 auto" }}>
        <StepRail step={step}/>

        {step > 1 && (
          <BookingSummary region={region} service={service} format={format} date={date} time={time}/>
        )}

        <div style={{ background:CARD, border:`1px solid ${BORD}`, borderRadius:"16px", padding:"24px" }}>

          {/* STEP 1 — Region & Service */}
          {step === 1 && (
            <>
              <StepHead title="Select a Region" sub="Choose where you're located"/>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"24px" }}>
                {Object.entries(SERVICE_REGIONS).map(([key, r]) => (
                  <Card key={key} selected={region===key} onClick={() => { setRegion(key); setService(null); }}>
                    <div style={{ marginBottom:"8px" }}>{key === "us" ? <FlagUS/> : <FlagPH/>}</div>
                    <div style={{ fontSize:"14px", fontWeight:600, color:TEXT }}>{r.label}</div>
                  </Card>
                ))}
              </div>

              {region && (
                <>
                  <StepHead title="Select a Service" sub={`${regionData.label} offerings`}/>
                  <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                    {services.map(s => (
                      <Card key={s.id} selected={service===s.id} onClick={() => setService(s.id)}>
                        <div style={{ display:"flex", gap:"12px", alignItems:"flex-start", paddingRight:"28px" }}>
                          <span style={{ fontSize:"22px", flexShrink:0 }}>{s.icon}</span>
                          <div>
                            <div style={{ fontSize:"14px", fontWeight:600, color:TEXT, marginBottom:"3px" }}>{s.title}</div>
                            <div style={{ fontSize:"12px", color:MUTED, lineHeight:"1.5" }}>{s.desc}</div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* STEP 2 — Consultation Format */}
          {step === 2 && (
            <>
              <StepHead title="How would you like to meet?" sub="Select a consultation format"/>
              <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                {formats.map(f => (
                  <Card key={f.id} selected={format===f.id} onClick={() => setFormat(f.id)}>
                    <div style={{ display:"flex", alignItems:"center", gap:"14px", paddingRight:"28px" }}>
                      <span style={{ fontSize:"24px" }}>{f.icon}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:"14px", fontWeight:600, color:TEXT }}>{f.label}</div>
                        <div style={{ fontSize:"12px", color:MUTED, marginTop:"2px" }}>{f.sub}</div>
                      </div>
                      <div style={{ fontSize:"15px", fontWeight:700, color:GOLD, flexShrink:0 }}>
                        {currency === "PHP" ? `₱${f.fee.toLocaleString()}` : `$${f.fee}`}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* STEP 3 — Date & Time */}
          {step === 3 && (
            <>
              <StepHead title="Pick a date and time" sub="All times are in your local timezone"/>
              <Calendar value={date} onChange={setDate}/>
              {date && (
                <div style={{ marginTop:"16px" }}>
                  <p style={{ fontSize:"12px", fontWeight:600, color:MUTED, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"10px" }}>Available times</p>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(90px,1fr))", gap:"8px" }}>
                    {TIMES.map(t => (
                      <div key={t} onClick={() => setTime(t)} style={{
                        padding:"9px 0", textAlign:"center", borderRadius:"8px", fontSize:"13px", fontWeight:500, cursor:"pointer",
                        background: time===t ? GOLD : CARD2,
                        color: time===t ? NAVY : TEXT,
                        border: `1.5px solid ${time===t ? GOLD : BORD}`,
                        transition:"all 0.15s",
                      }}>{t}</div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* STEP 4 — Contact Info */}
          {step === 4 && (
            <>
              <StepHead title="Your contact information"/>
              <Input label="Full Name" value={name} onChange={setName} placeholder="Ruth Van Patten"/>
              <Input label="Email Address" value={email} onChange={setEmail} type="email" placeholder="hello@example.com"/>
              <Input label="Phone Number" value={phone} onChange={setPhone} type="tel" placeholder="+1 (209) 555-0100"/>
              <div style={{ marginBottom:"14px" }}>
                <label style={{ display:"block", fontSize:"12px", fontWeight:600, color:MUTED, marginBottom:"5px", textTransform:"uppercase", letterSpacing:"0.5px" }}>Notes (optional)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Describe your project or question..."
                  style={{ width:"100%", background:CARD2, border:`1.5px solid ${BORD}`, borderRadius:"8px", padding:"10px 12px", color:TEXT, fontSize:"14px", outline:"none", resize:"vertical", fontFamily:"inherit" }}/>
              </div>
            </>
          )}

          {/* STEP 5 — Payment */}
          {step === 5 && (
            <>
              <StepHead title="Confirm and pay" sub="Complete payment to finalize your booking"/>
              <div style={{ background:CARD2, borderRadius:"12px", padding:"16px", marginBottom:"20px" }}>
                <Row label="Service"  value={svc?.title || ""}/>
                <Row label="Format"   value={fmt?.label || ""}/>
                <Row label="Date"     value={fmtDate(date)}/>
                <Row label="Time"     value={time}/>
                <div style={{ borderTop:`1px solid ${BORD}`, marginTop:"10px", paddingTop:"10px" }}>
                  <Row label="Total due" value={<span style={{ color:GOLD, fontWeight:700, fontSize:"15px" }}>{amount}</span>}/>
                </div>
              </div>

              <p style={{ fontSize:"12px", fontWeight:600, color:MUTED, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"10px" }}>Select payment method</p>
              {payOptions.map(pm => (
                <div key={pm.id} onClick={() => { setPayMethod(pm.id); setPayConfirmed(false); }}
                  style={{
                    background: payMethod===pm.id ? `${NAVY}CC` : CARD2,
                    border: `1.5px solid ${payMethod===pm.id ? GOLD : BORD}`,
                    borderRadius:"12px", padding:"14px 16px", cursor:"pointer", transition:"all 0.18s",
                    display:"flex", alignItems:"center", gap:"14px", marginBottom:"10px",
                  }}>
                  <pm.Logo/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:"14px", fontWeight:600, color:TEXT }}>{pm.label}</div>
                    {pm.sub && <div style={{ fontSize:"12px", color:MUTED, marginTop:"2px" }}>{pm.sub}</div>}
                    {pm.id === "gcash" && <div style={{ fontSize:"12px", color:GOLD, marginTop:"2px", fontWeight:500 }}>{GCASH}</div>}
                  </div>
                  {payMethod===pm.id && <GoldCheck/>}
                </div>
              ))}

              {payMethod === "bluevine" && (
                <div style={{ background:"#0D2B1A", border:`1px solid #1E5C38`, borderRadius:"10px", padding:"14px 16px", marginTop:"12px" }}>
                  <p style={{ fontSize:"13px", color:"#6EE7A0", fontWeight:600, marginBottom:"4px" }}>Pay {amount} securely online</p>
                  <p style={{ fontSize:"12px", color:"#4BAD78", marginBottom:"12px" }}>Click the button below to complete payment via BlueVine's secure checkout.</p>
                  <a href={BLUEVINE_LINK} target="_blank" rel="noopener noreferrer"
                    style={{ display:"inline-block", background:GOLD, color:NAVY, fontWeight:700, fontSize:"13px", padding:"10px 20px", borderRadius:"8px", textDecoration:"none" }}>
                    Pay {amount} Now →
                  </a>
                  <label style={{ display:"flex", alignItems:"center", gap:"10px", marginTop:"14px", cursor:"pointer" }}>
                    <input type="checkbox" checked={payConfirmed} onChange={e => setPayConfirmed(e.target.checked)}
                      style={{ width:"16px", height:"16px", accentColor:GOLD }}/>
                    <span style={{ fontSize:"13px", color:"#6EE7A0", fontWeight:500 }}>I've completed the payment of {amount}</span>
                  </label>
                </div>
              )}

              {payMethod === "ach" && (
                <div style={{ background:"#0D2238", border:`1px solid #1E3A5C`, borderRadius:"10px", padding:"14px 16px", marginTop:"12px" }}>
                  <p style={{ fontSize:"13px", color:"#7DB8F7", fontWeight:600, marginBottom:"10px" }}>Send {amount} via ACH to:</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:"6px", marginBottom:"12px" }}>
                    <Row label="Account Name"   value={BLUEVINE_NAME}/>
                    <Row label="Routing Number" value={BLUEVINE_ROUTING}/>
                    <Row label="Account Number" value={BLUEVINE_ACCOUNT}/>
                    <Row label="Account Type"   value="Checking"/>
                  </div>
                  <label style={{ display:"flex", alignItems:"center", gap:"10px", cursor:"pointer" }}>
                    <input type="checkbox" checked={payConfirmed} onChange={e => setPayConfirmed(e.target.checked)}
                      style={{ width:"16px", height:"16px", accentColor:GOLD }}/>
                    <span style={{ fontSize:"13px", color:"#7DB8F7", fontWeight:500 }}>I've initiated the ACH transfer of {amount}</span>
                  </label>
                </div>
              )}

              {payMethod === "gcash" && (
                <div style={{ background:"#0D2B1A", border:`1px solid #1E5C38`, borderRadius:"10px", padding:"14px 16px", marginTop:"12px" }}>
                  <p style={{ fontSize:"13px", color:"#6EE7A0", fontWeight:600, marginBottom:"4px" }}>Send {amount} to {GCASH} via GCash</p>
                  <p style={{ fontSize:"12px", color:"#4BAD78" }}>After sending, check the box below to confirm your booking.</p>
                  <label style={{ display:"flex", alignItems:"center", gap:"10px", marginTop:"12px", cursor:"pointer" }}>
                    <input type="checkbox" checked={payConfirmed} onChange={e => setPayConfirmed(e.target.checked)}
                      style={{ width:"16px", height:"16px", accentColor:GOLD }}/>
                    <span style={{ fontSize:"13px", color:"#6EE7A0", fontWeight:500 }}>I've sent the payment of {amount}</span>
                  </label>
                </div>
              )}
            </>
          )}

          {/* Navigation */}
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:"24px", gap:"10px" }}>
            {step > 1 ? (
              <button onClick={() => setStep(s => s-1)} style={{ background:"none", border:`1.5px solid ${BORD}`, borderRadius:"10px", color:MUTED, fontSize:"14px", fontWeight:500, padding:"11px 20px", cursor:"pointer" }}>
                Back
              </button>
            ) : <div/>}

            {step < 5 ? (
              <button onClick={() => canNext[step] && setStep(s => s+1)} style={{
                background: canNext[step] ? GOLD : BORD,
                border:"none", borderRadius:"10px",
                color: canNext[step] ? NAVY : MUTED,
                fontSize:"14px", fontWeight:700, padding:"11px 28px", cursor: canNext[step] ? "pointer" : "not-allowed",
                transition:"all 0.18s",
              }}>
                Continue
              </button>
            ) : (
              <button onClick={() => canNext[5] && !submitting && handleSubmit()} style={{
                background: canNext[5] && !submitting ? GOLD : BORD,
                border:"none", borderRadius:"10px",
                color: canNext[5] && !submitting ? NAVY : MUTED,
                fontSize:"14px", fontWeight:700, padding:"11px 28px", cursor: canNext[5] && !submitting ? "pointer" : "not-allowed",
                transition:"all 0.18s",
              }}>
                {submitting ? "Confirming..." : "Confirm Booking"}
              </button>
            )}
          </div>
        </div>

        <p style={{ textAlign:"center", fontSize:"12px", color:BORD, marginTop:"24px" }}>
          RVP Engineering Services &bull; Ruth Van Patten &bull; <a href="mailto:info@rvpengineering.us" style={{ color:MUTED, textDecoration:"none" }}>info@rvpengineering.us</a>
        </p>
      </div>
    </div>
  );
}
