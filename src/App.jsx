import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { useState, useEffect, useRef, useCallback } from "react";
/* ═══════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════ */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400;1,700&family=Cabinet+Grotesk:wght@300;400;500;700;800;900&family=Bebas+Neue&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;font-size:16px;}
body{
  font-family:'Cabinet Grotesk',sans-serif;
  background:#F8F5EF;
  color:#1C1917;
  overflow-x:hidden;
  cursor:none;
}

::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-track{background:#F8F5EF;}
::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#B8892A,#7A5A18);border-radius:4px;}

/* ── CURSOR ── */
#hs-dot{
  width:8px;height:8px;
  background:#B8892A;border-radius:50%;
  position:fixed;top:0;left:0;pointer-events:none;z-index:99999;
  mix-blend-mode:multiply;
  transition:transform 0.1s,background 0.3s,width 0.3s,height 0.3s;
}
#hs-ring{
  width:44px;height:44px;
  border:1px solid rgba(184,137,42,0.5);
  border-radius:50%;position:fixed;top:0;left:0;
  pointer-events:none;z-index:99998;
  transition:transform 0.25s cubic-bezier(0.23,1,0.32,1),opacity 0.3s;
  opacity:0.7;
}
#hs-trail{
  width:200px;height:200px;
  border-radius:50%;position:fixed;top:0;left:0;
  background:radial-gradient(circle,rgba(184,137,42,0.08),transparent 70%);
  pointer-events:none;z-index:99997;
  transition:transform 0.6s cubic-bezier(0.23,1,0.32,1);
}

/* ── LOADER ── */
#hs-loader{
  position:fixed;inset:0;background:#0D0B08;
  z-index:99996;display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  transition:opacity 0.9s ease,visibility 0.9s ease;
  overflow:hidden;
}
.ldr-bg-grid{
  position:absolute;inset:0;
  background-image:linear-gradient(rgba(184,137,42,0.08) 1px,transparent 1px),
                   linear-gradient(90deg,rgba(184,137,42,0.08) 1px,transparent 1px);
  background-size:80px 80px;
  animation:gridPulse 4s ease-in-out infinite;
}
@keyframes gridPulse{0%,100%{opacity:0.3}50%{opacity:0.7}}
.ldr-title{
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(3rem,8vw,5.5rem);
  font-weight:700;color:#F8F5EF;
  letter-spacing:-1px;position:relative;z-index:1;
}
.ldr-title em{color:#B8892A;font-style:italic;}
.ldr-line{
  width:240px;height:1px;background:rgba(184,137,42,0.2);
  margin:1.5rem 0;position:relative;z-index:1;overflow:hidden;
}
.ldr-fill{
  height:100%;width:0;
  background:linear-gradient(90deg,transparent,#B8892A,#D4A843);
  animation:ldrFill 2.2s cubic-bezier(0.77,0,0.18,1) forwards;
}
@keyframes ldrFill{to{width:100%}}
.ldr-pct{
  font-size:0.75rem;letter-spacing:6px;text-transform:uppercase;
  color:rgba(184,137,42,0.6);position:relative;z-index:1;
}
.ldr-orb{
  position:absolute;width:600px;height:600px;border-radius:50%;
  background:radial-gradient(circle,rgba(184,137,42,0.12),transparent 65%);
  animation:orbPulse 3s ease-in-out infinite;
}
@keyframes orbPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}

/* ── TICKER ── */
.ticker-wrap{overflow:hidden;white-space:nowrap;background:#1C1917;padding:0.6rem 0;}
.ticker-inner{display:inline-flex;animation:tickerMove 32s linear infinite;}
@keyframes tickerMove{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}

/* ── REVEAL ANIMATIONS ── */
.reveal{opacity:0;transform:translateY(48px);transition:opacity 0.9s cubic-bezier(0.23,1,0.32,1),transform 0.9s cubic-bezier(0.23,1,0.32,1);}
.reveal.show{opacity:1;transform:translateY(0);}
.reveal-left{opacity:0;transform:translateX(-60px);transition:opacity 0.9s cubic-bezier(0.23,1,0.32,1),transform 0.9s cubic-bezier(0.23,1,0.32,1);}
.reveal-left.show{opacity:1;transform:translateX(0);}
.reveal-right{opacity:0;transform:translateX(60px);transition:opacity 0.9s cubic-bezier(0.23,1,0.32,1),transform 0.9s cubic-bezier(0.23,1,0.32,1);}
.reveal-right.show{opacity:1;transform:translateX(0);}
.reveal-scale{opacity:0;transform:scale(0.85);transition:opacity 0.9s cubic-bezier(0.23,1,0.32,1),transform 0.9s cubic-bezier(0.23,1,0.32,1);}
.reveal-scale.show{opacity:1;transform:scale(1);}

/* ── GOLD GRADIENT ── */
.gold{background:linear-gradient(135deg,#F0C060,#D4A843,#B8892A,#7A5A18);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}

/* ── PARTICLES ── */
.particle{position:absolute;border-radius:50%;background:#B8892A;animation:ptFloat linear infinite;}
@keyframes ptFloat{
  0%{transform:translateY(110%) translateX(0) scale(0);opacity:0;}
  10%{opacity:0.5;}90%{opacity:0.5;}
  100%{transform:translateY(-20px) translateX(30px) scale(1.2);opacity:0;}
}

/* ── GRID BG ── */
.grid-bg{
  position:absolute;inset:0;pointer-events:none;
  background-image:linear-gradient(rgba(184,137,42,0.05) 1px,transparent 1px),
                   linear-gradient(90deg,rgba(184,137,42,0.05) 1px,transparent 1px);
  background-size:72px 72px;
  mask-image:radial-gradient(ellipse at center,black 10%,transparent 75%);
  -webkit-mask-image:radial-gradient(ellipse at center,black 10%,transparent 75%);
}

/* ── 3D CARD EFFECT ── */
.card-3d{transform-style:preserve-3d;transition:transform 0.15s ease;}

/* ── NAV ── */
.nav-link{position:relative;transition:color 0.3s;}
.nav-link::after{content:'';position:absolute;bottom:-4px;left:0;right:0;height:1px;background:#B8892A;transform:scaleX(0);transition:transform 0.35s cubic-bezier(0.23,1,0.32,1);}
.nav-link:hover::after{transform:scaleX(1);}

/* ── HERO ANIMATIONS ── */
@keyframes heroFadeUp{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:translateY(0)}}
.h-a1{animation:heroFadeUp 1s 0.2s cubic-bezier(0.23,1,0.32,1) both;}
.h-a2{animation:heroFadeUp 1s 0.4s cubic-bezier(0.23,1,0.32,1) both;}
.h-a3{animation:heroFadeUp 1s 0.6s cubic-bezier(0.23,1,0.32,1) both;}
.h-a4{animation:heroFadeUp 1s 0.8s cubic-bezier(0.23,1,0.32,1) both;}
.h-a5{animation:heroFadeUp 1s 1s cubic-bezier(0.23,1,0.32,1) both;}

/* ── FLOAT ── */
@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
.float{animation:floatY 6s ease-in-out infinite;}

/* ── ORB RINGS ── */
.orb-r{position:absolute;border-radius:50%;border:1px solid;top:50%;left:50%;}
.orb-r1{width:100%;height:100%;border-color:rgba(184,137,42,0.12);animation:orbRot 28s linear infinite;}
.orb-r2{width:74%;height:74%;border-color:rgba(184,137,42,0.2);animation:orbRot 18s linear infinite reverse;}
.orb-r3{width:50%;height:50%;border-color:rgba(184,137,42,0.3);animation:orbRot 10s linear infinite;}
.orb-r4{width:28%;height:28%;border-color:rgba(184,137,42,0.5);animation:orbRot 6s linear infinite reverse;}
@keyframes orbRot{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}

/* ── SCAN LINES ── */
.scan{position:absolute;width:1px;height:100%;background:linear-gradient(180deg,transparent,rgba(184,137,42,0.15),transparent);animation:scanAnim 12s ease-in-out infinite;}
@keyframes scanAnim{0%,100%{opacity:0;transform:scaleY(0)}40%,60%{opacity:1;transform:scaleY(1)}}

/* ── BLINK ── */
@keyframes blinkAnim{0%,100%{opacity:1}50%{opacity:0.2}}
.blink{animation:blinkAnim 2.2s ease-in-out infinite;}

/* ── SERVICE CARD ── */
.svc-card{transition:all 0.5s cubic-bezier(0.23,1,0.32,1);}
.svc-card:hover{transform:translateY(-12px);}
.svc-arrow{opacity:0;transform:translateX(-14px);transition:all 0.4s cubic-bezier(0.23,1,0.32,1);}
.svc-card:hover .svc-arrow{opacity:1;transform:translateX(0);}

/* ── DETAIL BLOCK ── */
.detail-block{transition:all 0.4s cubic-bezier(0.23,1,0.32,1);}
.detail-block::before{content:'';position:absolute;top:0;left:0;width:3px;height:0;background:linear-gradient(180deg,#B8892A,#D4A843,transparent);transition:height 0.5s ease;}
.detail-block:hover::before{height:100%;}

/* ── SLIDER ── */
.slider-track{display:flex;transition:transform 0.8s cubic-bezier(0.77,0,0.18,1);}
.slide-dot{width:6px;height:6px;border-radius:50%;background:rgba(28,25,23,0.2);transition:all 0.4s;cursor:pointer;}
.slide-dot.active{background:#B8892A;width:28px;border-radius:4px;}

/* ── VIDEO SECTION ── */
.vid-overlay{position:absolute;inset:0;background:linear-gradient(135deg,rgba(12,9,6,0.9) 0%,rgba(12,9,6,0.5) 50%,rgba(12,9,6,0.7) 100%);}

/* ── PARALLAX ── */
.parallax-layer{will-change:transform;}

/* ── CONTACT INPUT ── */
.hs-inp{transition:border-color 0.3s,box-shadow 0.3s;}
.hs-inp:focus{border-color:#B8892A!important;outline:none;box-shadow:0 0 0 3px rgba(184,137,42,0.1)!important;}

/* ── COUNTER ── */
@keyframes countUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.count-cell{animation:countUp 0.8s ease both;}

/* ── MAGNETIC BTN ── */
.mag-btn{transition:transform 0.3s cubic-bezier(0.23,1,0.32,1),box-shadow 0.3s;}

/* ── MARQUEE IMG ── */
.marquee-row{display:flex;gap:20px;animation:marqueeAnim 35s linear infinite;}
.marquee-row.rev{animation:marqueeAnimRev 40s linear infinite;}
@keyframes marqueeAnim{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes marqueeAnimRev{0%{transform:translateX(-50%)}100%{transform:translateX(0)}}
.marquee-img{flex-shrink:0;width:280px;height:190px;object-fit:cover;border-radius:4px;overflow:hidden;}

/* ── ACCORDION ── */
.acc-body{max-height:0;overflow:hidden;transition:max-height 0.5s cubic-bezier(0.23,1,0.32,1);}
.acc-body.open{max-height:300px;}

/* ── GLOW ── */
@keyframes glowPulse{0%,100%{box-shadow:0 0 30px rgba(184,137,42,0.15)}50%{box-shadow:0 0 60px rgba(184,137,42,0.35)}}

/* ── RESPONSIVE ── */
@media(max-width:1100px){
  .r-grid{grid-template-columns:1fr!important;gap:3rem!important;}
  .r-grid3{grid-template-columns:1fr 1fr!important;}
  .r-grid4{grid-template-columns:1fr 1fr!important;gap:2rem!important;}
  .r-hide{display:none!important;}
  section,.hs-section{padding:5rem 1.5rem!important;}
  nav{padding:0 1.5rem!important;}
  .hero-orb{display:none!important;}
}
@media(max-width:700px){
  .r-grid3{grid-template-columns:1fr!important;}
  .r-grid4{grid-template-columns:1fr!important;}
  .r-stack{flex-direction:column!important;}
  .hero-btns{flex-direction:column!important;}
}
@media(min-width:1101px){.r-mshow{display:none!important;}}
`;

/* ═══════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════ */
const TICKER = ["HS Services", "✦", "Udyam Registered", "✦", "MSME Certified", "✦", "NIC 61900", "✦", "Moradabad UP", "✦", "Est. 2025", "✦", "UDYAM-UP-59-0079830", "✦", "Telecom & Trading", "✦", "HS Services", "✦", "Udyam Registered", "✦", "MSME Certified", "✦", "NIC 61900", "✦", "Moradabad UP", "✦", "Est. 2025", "✦", "UDYAM-UP-59-0079830", "✦", "Telecom & Trading", "✦"];

const NAV = [{ l: "About", h: "#about" }, { l: "Services", h: "#services" }, { l: "Portfolio", h: "#portfolio" }, { l: "Company", h: "#company" }, { l: "Certificate", h: "#certificate" }, { l: "Contact", h: "#contact" }];

const STATS = [
  { num: 18, suf: "", lab: "Team Members" },
  { num: 2025, suf: "", lab: "Established" },
  { num: 100, suf: "%", lab: "MSME Certified" },
  { num: 24, suf: "/7", lab: "Support" },
];

const SERVICES = [
  { no: "01", icon: "📡", title: "Telecommunications", desc: "End-to-end telecom services covering connectivity, network management and all activities under NIC Code 61900 — Other Telecom Activities." },
  { no: "02", icon: "📦", title: "Trading Solutions", desc: "Comprehensive trading services enabling businesses to source, procure and distribute goods efficiently across Uttar Pradesh and beyond." },
  { no: "03", icon: "🏛️", title: "MSME Consulting", desc: "Leverage our Udyam registration to help partners access government schemes, Priority Sector Lending and MSME benefits seamlessly." },
  { no: "04", icon: "🔗", title: "Network Services", desc: "Advanced network connectivity and telecom infrastructure services to keep your business always online and reliably connected." },
  { no: "05", icon: "💼", title: "Business Development", desc: "Strategic support helping enterprises leverage GeM, TReDS and National Career Service portals for growth and government tenders." },
  { no: "06", icon: "📊", title: "Enterprise Solutions", desc: "Tailored enterprise-grade solutions — from connectivity audits to comprehensive telecom roadmaps — for every business size." },
];

const COMPANY_BLOCKS = [
  {
    label: "Registration Details", title: "Udyam Certificate", rows: [
      { k: "Enterprise Name", v: "HS SERVICES", gold: true },
      { k: "Udyam Reg. No.", v: "UDYAM-UP-59-0079830" },
      { k: "Type of Enterprise", v: "Micro Enterprise" },
      { k: "Major Activity", v: "Trading" },
      { k: "Classification Year", v: "2025–26" },
      { k: "Date of Incorporation", v: "09 July 2025" },
      { k: "Udyam Reg. Date", v: "28 July 2025" },
    ]
  },
  {
    label: "Industry & Classification", title: "NIC Codes", rows: [
      { k: "NIC 2-Digit", v: "61 — Telecommunications", gold: true },
      { k: "NIC 4-Digit", v: "6190 — Other Telecom Activities" },
      { k: "NIC 5-Digit", v: "61900" },
      { k: "Organisation Type", v: "Partnership" },
      { k: "Social Category", v: "General" },
      { k: "PAN Number", v: "AASFH4698D" },
      { k: "Bank", v: "Axis Bank" },
    ]
  },
  {
    label: "Official Address", title: "Head Office", rows: [
      { k: "Building", v: "Rajkiye Kanya Inter College" },
      { k: "Area", v: "Linepar, Moradabad" },
      { k: "City", v: "Moradabad", gold: true },
      { k: "District", v: "Moradabad" },
      { k: "State", v: "Uttar Pradesh" },
      { k: "PIN Code", v: "244001" },
      { k: "Coordinates", v: "28.955°N, 78.839°E" },
    ]
  },
  {
    label: "Contact & Banking", title: "Get In Touch", rows: [
      { k: "Mobile", v: "+91 97582 90120", gold: true },
      { k: "Email", v: "hsservices899@gmail.com" },
      { k: "Bank Name", v: "Axis Bank" },
      { k: "IFSC Code", v: "UTIB0003735" },
      { k: "Employment (M/F)", v: "2 Male / 2 Female" },
      { k: "Total Staff", v: "4 Employees" },
      { k: "DIC", v: "Moradabad, UP" },
    ]
  },
];

const CERT_ITEMS = [
  { l: "Type", v: "Micro Enterprise" }, { l: "Classification", v: "2025–26" },
  { l: "Reg. Date", v: "28 July 2025" }, { l: "State", v: "Uttar Pradesh" },
  { l: "NIC Code", v: "61900" }, { l: "PAN", v: "AASFH4698D" },
  { l: "Major Activity", v: "Trading" }, { l: "Bank", v: "Axis Bank" },
];

const SLIDES = [
  { tag: "Telecommunications", title: "Cutting-Edge\nConnectivity", sub: "Next-gen telecom solutions for modern enterprises", bg: "linear-gradient(135deg,#0D0B08 0%,#1C1209 40%,#0A0D12 100%)" },
  { tag: "MSME Certified", title: "Government\nRegistered", sub: "Udyam certified, empowering access to national schemes", bg: "linear-gradient(135deg,#080B0D 0%,#0A130D 40%,#0D0808 100%)" },
  { tag: "Trading Solutions", title: "Smart Trade\nPlatform", sub: "Efficient sourcing and distribution across Uttar Pradesh", bg: "linear-gradient(135deg,#0B080D 0%,#140A0A 40%,#080D0A 100%)" },
];

const FAQS = [
  { q: "What is HS Services' primary business?", a: "HS Services is a Udyam-registered micro enterprise specializing in Telecommunications (NIC 61900) and Trading. We operate under MSME certification from the Government of India, headquartered in Moradabad, Uttar Pradesh." },
  { q: "How can I access MSME benefits through HS Services?", a: "Through our Udyam registration (UDYAM-UP-59-0079830), we help partners access Priority Sector Lending (PSL), government schemes, GeM procurement portal, and TReDS financing platform." },
  { q: "What is HS Services' Udyam Registration Number?", a: "Our official Udyam Registration Number is UDYAM-UP-59-0079830, registered on 28 July 2025, verified at udyamregistration.gov.in." },
  { q: "How many employees does HS Services have?", a: "HS Services currently has 4 employees — 2 Male and 2 Female — as a growing micro enterprise committed to inclusive employment practices." },
];

/* ═══════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════ */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("show"); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal,.reveal-left,.reveal-right,.reveal-scale").forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

function useCounter(target, active) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    let c = 0; const step = 14;
    const inc = target / (1800 / step);
    const t = setInterval(() => {
      c = Math.min(c + inc, target);
      setV(Math.floor(c));
      if (c >= target) clearInterval(t);
    }, step);
    return () => clearInterval(t);
  }, [active, target]);
  return v;
}

/* ═══════════════════════════════════════════════════
   CURSOR
═══════════════════════════════════════════════════ */
function Cursor() {
  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0, tx = 0, ty = 0;
    const dot = document.getElementById("hs-dot");
    const ring = document.getElementById("hs-ring");
    const trail = document.getElementById("hs-trail");
    const onMove = e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = `${mx - 4}px`;
      dot.style.top = `${my - 4}px`;
    };
    let raf;
    const anim = () => {
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      tx += (mx - tx) * 0.05; ty += (my - ty) * 0.05;
      ring.style.left = `${rx - 22}px`; ring.style.top = `${ry - 22}px`;
      trail.style.left = `${tx - 100}px`; trail.style.top = `${ty - 100}px`;
      raf = requestAnimationFrame(anim);
    };
    document.addEventListener("mousemove", onMove);
    anim();
    const big = () => { dot.style.width = "20px"; dot.style.height = "20px"; ring.style.transform = "scale(1.8)"; ring.style.opacity = "0.4"; };
    const sm = () => { dot.style.width = "8px"; dot.style.height = "8px"; ring.style.transform = ""; ring.style.opacity = "0.7"; };
    document.addEventListener(
      "mouseenter",
      (e) => {
        if (
          e.target instanceof Element &&
          e.target.closest("a,button,[data-hover]")
        ) {
          big();
        }
      },
      true
    );

    document.addEventListener(
      "mouseleave",
      (e) => {
        if (
          e.target instanceof Element &&
          e.target.closest("a,button,[data-hover]")
        ) {
          sm();
        }
      },
      true
    );
    return () => { document.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);
  return null;
}

/* ═══════════════════════════════════════════════════
   LOADER
═══════════════════════════════════════════════════ */
function Loader({ onDone }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    let v = 0;
    const iv = setInterval(() => {
      v += Math.random() * 4 + 1;
      if (v >= 100) { v = 100; clearInterval(iv); setTimeout(onDone, 400); }
      setPct(Math.floor(v));
    }, 30);
    return () => clearInterval(iv);
  }, [onDone]);
  return (
    <div id="hs-loader">
      <div className="ldr-bg-grid" />
      <div className="ldr-orb" />
      <div className="ldr-title">HS <em>Services</em></div>
      <div className="ldr-line"><div className="ldr-fill" /></div>
      <div className="ldr-pct">Loading · {pct}%</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TICKER
═══════════════════════════════════════════════════ */
function Ticker() {
  return (
    <div className="ticker-wrap">
      <div className="ticker-inner">
        {TICKER.map((t, i) => (
          <span key={i} style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", padding: "0 2rem", color: t === "✦" ? "#B8892A" : "rgba(255,255,255,0.45)" }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mob, setMob] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, padding: "0 4rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: "72px", background: scrolled ? "rgba(248,245,239,0.97)" : "rgba(248,245,239,0.88)", backdropFilter: "blur(32px)", borderBottom: `1px solid ${scrolled ? "#E5DDD0" : "transparent"}`, transition: "all 0.5s cubic-bezier(0.23,1,0.32,1)", boxShadow: scrolled ? "0 4px 40px rgba(28,25,23,0.06)" : "none" }}>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.9rem", fontWeight: 700, color: "#1C1917", letterSpacing: "-0.5px", cursor: "none" }}>
        HS <span className="gold">Services</span>
      </div>
      <ul style={{ display: "flex", gap: "2.5rem", listStyle: "none" }} className="r-hide">
        {NAV.map(n => (
          <li key={n.l}>
            <a href={n.h} className="nav-link" style={{ color: "#5A5550", textDecoration: "none", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "none" }}
              onMouseEnter={e => e.target.style.color = "#B8892A"} onMouseLeave={e => e.target.style.color = "#5A5550"}>{n.l}</a>
          </li>
        ))}
      </ul>
      <button data-hover onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
        className="r-hide mag-btn" style={{ cursor: "none", background: "#1C1917", color: "#fff", border: "none", padding: "0.6rem 1.8rem", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase" }}
        onMouseEnter={e => { e.target.style.background = "#B8892A"; e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 12px 32px rgba(184,137,42,0.3)"; }}
        onMouseLeave={e => { e.target.style.background = "#1C1917"; e.target.style.transform = ""; e.target.style.boxShadow = ""; }}>
        Get In Touch
      </button>
      <button onClick={() => setMob(o => !o)} className="r-mshow" style={{ background: "none", border: "none", fontSize: "1.5rem", color: "#1C1917", cursor: "pointer" }}>{mob ? "✕" : "☰"}</button>
      {mob && (
        <div style={{ position: "fixed", top: "72px", left: 0, right: 0, background: "#F8F5EF", borderBottom: "1px solid #E5DDD0", padding: "1.5rem 2rem", zIndex: 999 }}>
          {NAV.map(n => <a key={n.l} href={n.h} onClick={() => setMob(false)} style={{ display: "block", padding: "0.9rem 0", fontSize: "0.9rem", fontWeight: 700, color: "#1C1917", textDecoration: "none", borderBottom: "1px solid #F0EBE3", letterSpacing: "1px", textTransform: "uppercase" }}>{n.l}</a>)}
        </div>
      )}
    </nav>
  );
}

/* ═══════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════ */
function Hero() {
  const orbRef = useRef(null);
  const ptRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fn = e => {
      const x = (e.clientX / window.innerWidth - 0.5) * 36;
      const y = (e.clientY / window.innerHeight - 0.5) * 22;
      if (orbRef.current) orbRef.current.style.transform = `translateY(-50%) translate(${x}px,${y}px)`;
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  useEffect(() => {
    const box = ptRef.current; if (!box) return;
    const pts = [];
    const mk = () => {
      const el = document.createElement("div");
      el.className = "particle";
      const s = Math.random() * 3 + 1;
      el.style.cssText = `width:${s}px;height:${s}px;left:${Math.random() * 100}%;opacity:${Math.random() * 0.5 + 0.1};animation-duration:${Math.random() * 12 + 10}s;animation-delay:${Math.random() * 6}s;`;
      box.appendChild(el); pts.push(el);
      setTimeout(() => { el.remove(); pts.splice(pts.indexOf(el), 1); }, 22000);
    };
    for (let i = 0; i < 22; i++) setTimeout(mk, i * 300);
    const iv = setInterval(mk, 1800);
    return () => { clearInterval(iv); pts.forEach(p => p.remove()); };
  }, []);

  return (
    <section id="home" style={{ minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", padding: "0 4rem", paddingTop: "72px", background: "linear-gradient(150deg,#F8F5EF 0%,#F2EDE2 45%,#EDE5D4 80%,#E8DCC8 100%)" }}>
      <div className="grid-bg" />
      {[10, 28, 48, 68, 86].map((l, i) => <div key={i} className="scan" style={{ left: `${l}%`, animationDelay: `${i * 2}s`, animationDuration: `${10 + i * 2.5}s` }} />)}
      <div ref={ptRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 60% at ${50 + mousePos.x * 20}% ${50 + mousePos.y * 20}%, rgba(184,137,42,0.07) 0%, transparent 65%)`, transition: "background 0.5s ease", pointerEvents: "none" }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 820, paddingTop: "2rem" }}>
        <div className="h-a1" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", background: "rgba(184,137,42,0.08)", border: "1px solid rgba(184,137,42,0.22)", padding: "0.45rem 1.3rem", marginBottom: "2.2rem", fontSize: "0.68rem", letterSpacing: "3.5px", textTransform: "uppercase", color: "#B8892A" }}>
          <span className="blink" style={{ width: 7, height: 7, borderRadius: "50%", background: "#B8892A", display: "inline-block" }} />
          MSME · Udyam Certified · Since 2025
        </div>
        <h1 className="h-a2" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(3.8rem,8.5vw,7.5rem)", fontWeight: 700, lineHeight: 0.95, letterSpacing: "-3px", marginBottom: "1.8rem", color: "#1C1917" }}>
          Premium<br /><span className="gold">Telecom</span><br />Solutions
        </h1>
        <p className="h-a3" style={{ fontSize: "1.1rem", color: "#7A6F66", lineHeight: 1.9, maxWidth: 540, marginBottom: "3rem", fontWeight: 400 }}>
          HS Services delivers cutting-edge telecommunications and trading from the heart of Moradabad, Uttar Pradesh — powering businesses with reliable, modern connectivity.
        </p>
        <div className="h-a4 hero-btns" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <HBtn href="#services" dark>Explore Services ↗</HBtn>
          <HBtn href="#contact">Contact Us →</HBtn>
        </div>
        {/* Badges */}
        <div className="h-a5" style={{ display: "flex", gap: "1.5rem", marginTop: "4rem", flexWrap: "wrap" }}>
          {["NIC: 61900", "PAN: AASFH4698D", "Moradabad, UP", "Est. July 2025"].map(b => (
            <div key={b} style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "1.5px", color: "#9C9280", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#B8892A", display: "inline-block" }} />{b}
            </div>
          ))}
        </div>
      </div>

      {/* Orb */}
      <div ref={orbRef} className="hero-orb" style={{ position: "absolute", right: "-6%", top: "50%", width: 640, height: 640, zIndex: 1, pointerEvents: "none", transition: "transform 0.15s ease" }}>
        {["orb-r1", "orb-r2", "orb-r3", "orb-r4"].map(c => <div key={c} className={`orb-r ${c}`} style={{ transform: "translate(-50%,-50%)" }} />)}
        <div style={{ position: "absolute", width: "22%", height: "22%", top: "39%", left: "39%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle,rgba(184,137,42,0.4),transparent)", borderRadius: "50%", animation: "orbPulse 3s ease-in-out infinite" }} />
      </div>

      {/* Scroll hint */}
      <div style={{ position: "absolute", bottom: "3rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", opacity: 0.5 }}>
        <span style={{ fontSize: "0.65rem", letterSpacing: "4px", textTransform: "uppercase", color: "#9C9280" }}>Scroll</span>
        <div style={{ width: 1, height: 60, background: "linear-gradient(180deg,#B8892A,transparent)" }} />
      </div>
    </section>
  );
}

function HBtn({ href, dark, children }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: "0.95rem 2.6rem", fontSize: "0.82rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", textDecoration: "none", display: "inline-block", transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)", cursor: "none",
        background: dark ? (hov ? "#B8892A" : "#1C1917") : "transparent",
        color: dark ? "#fff" : (hov ? "#B8892A" : "#1C1917"),
        border: `2px solid ${dark ? (hov ? "#B8892A" : "#1C1917") : (hov ? "#B8892A" : "rgba(28,25,23,0.25)")}`,
        transform: hov ? "translateY(-3px)" : "",
        boxShadow: hov ? `0 16px 40px ${dark ? "rgba(184,137,42,0.25)" : "rgba(28,25,23,0.1)"}` : "",
      }}>
      {children}
    </a>
  );
}

/* ═══════════════════════════════════════════════════
   STATS
═══════════════════════════════════════════════════ */
function StatCell({ num, suf, lab }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  const v = useCounter(num, on);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOn(true); }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ textAlign: "center", padding: "3rem 2rem", borderRight: "1px solid rgba(255,255,255,0.06)", position: "relative", transition: "background 0.3s", cursor: "none" }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
      onMouseLeave={e => e.currentTarget.style.background = ""}>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "4.5rem", fontWeight: 700, lineHeight: 1, background: "linear-gradient(135deg,#F0C060,#B8892A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        {on ? v.toLocaleString() : "0"}{suf}
      </div>
      <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginTop: "0.6rem" }}>{lab}</div>
    </div>
  );
}

function Stats() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", background: "#0D0B08", borderTop: "1px solid rgba(184,137,42,0.12)", borderBottom: "1px solid rgba(184,137,42,0.12)" }} className="r-grid4">
      {STATS.map((s, i) => <StatCell key={i} {...s} />)}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   HERO SLIDER (FULL-SCREEN)
═══════════════════════════════════════════════════ */
function HeroSlider() {
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState(null);
  const [dir, setDir] = useState(1);
  const timerRef = useRef(null);

  const go = useCallback((idx) => {
    setDir(idx > cur ? 1 : -1);
    setPrev(cur);
    setCur(idx);
  }, [cur]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCur(c => { setPrev(c); setDir(1); return (c + 1) % SLIDES.length; });
    }, 5500);
    return () => clearInterval(timerRef.current);
  }, []);

  const s = SLIDES[cur];
  return (
    <div style={{ position: "relative", height: "85vh", minHeight: 540, overflow: "hidden", background: "#0D0B08" }}>
      {/* BG */}
      <div key={cur} style={{ position: "absolute", inset: 0, background: s.bg, transition: "opacity 1.2s ease", zIndex: 0 }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(184,137,42,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(184,137,42,0.05) 1px,transparent 1px)", backgroundSize: "80px 80px" }} />
        {/* Animated orb */}
        <div style={{ position: "absolute", right: "10%", top: "50%", transform: "translateY(-50%)", width: 500, height: 500, pointerEvents: "none" }}>
          {["orb-r1", "orb-r2", "orb-r3"].map(c => <div key={c} className={`orb-r ${c}`} style={{ transform: "translate(-50%,-50%)" }} />)}
        </div>
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 4rem", maxWidth: 900 }}>
        <div key={`tag-${cur}`} style={{ fontSize: "0.7rem", letterSpacing: "4px", textTransform: "uppercase", color: "#B8892A", marginBottom: "1.5rem", animation: "heroFadeUp 0.8s ease both" }}>
          — {s.tag}
        </div>
        <h2 key={`title-${cur}`} style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(3rem,7vw,6rem)", fontWeight: 700, color: "#F8F5EF", lineHeight: 1, letterSpacing: "-2px", marginBottom: "1.5rem", whiteSpace: "pre-line", animation: "heroFadeUp 0.9s 0.1s ease both" }}>
          {s.title}
        </h2>
        <p key={`sub-${cur}`} style={{ fontSize: "1.05rem", color: "rgba(248,245,239,0.6)", maxWidth: 480, lineHeight: 1.8, animation: "heroFadeUp 0.9s 0.2s ease both" }}>
          {s.sub}
        </p>
      </div>

      {/* Dots */}
      <div style={{ position: "absolute", bottom: "2.5rem", left: "4rem", display: "flex", gap: "0.6rem", zIndex: 3 }}>
        {SLIDES.map((_, i) => (
          <div key={i} className={`slide-dot ${i === cur ? "active" : ""}`} onClick={() => go(i)} style={{ cursor: "none" }} data-hover />
        ))}
      </div>

      {/* Timer bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "rgba(184,137,42,0.15)", zIndex: 3 }}>
        <div key={cur} style={{ height: "100%", background: "linear-gradient(90deg,#B8892A,#D4A843)", animation: "ldrFill 5.5s linear forwards" }} />
      </div>

      {/* Arrows */}
      <button onClick={() => go((cur - 1 + SLIDES.length) % SLIDES.length)} data-hover
        style={{ position: "absolute", left: "2rem", top: "50%", transform: "translateY(-50%)", background: "rgba(248,245,239,0.08)", border: "1px solid rgba(184,137,42,0.25)", color: "#B8892A", width: 52, height: 52, fontSize: "1.3rem", cursor: "none", transition: "all 0.3s", zIndex: 3, backdropFilter: "blur(8px)" }}
        onMouseEnter={e => e.target.style.background = "rgba(184,137,42,0.15)"}
        onMouseLeave={e => e.target.style.background = "rgba(248,245,239,0.08)"}>←</button>
      <button onClick={() => go((cur + 1) % SLIDES.length)} data-hover
        style={{ position: "absolute", right: "2rem", top: "50%", transform: "translateY(-50%)", background: "rgba(248,245,239,0.08)", border: "1px solid rgba(184,137,42,0.25)", color: "#B8892A", width: 52, height: 52, fontSize: "1.3rem", cursor: "none", transition: "all 0.3s", zIndex: 3, backdropFilter: "blur(8px)" }}
        onMouseEnter={e => e.target.style.background = "rgba(184,137,42,0.15)"}
        onMouseLeave={e => e.target.style.background = "rgba(248,245,239,0.08)"}>→</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ABOUT
═══════════════════════════════════════════════════ */
function About() {
  const cardRef = useRef(null);
  const handleTilt = e => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 18;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -18;
    cardRef.current.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg)`;
  };
  const resetTilt = () => { if (cardRef.current) cardRef.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg)"; };

  return (
    <section id="about" className="hs-section" style={{ padding: "9rem 4rem", background: "#FFFFFF" }}>
      <div style={{ maxWidth: 1300, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7rem", alignItems: "center" }} className="r-grid">
        {/* Visual col */}
        <div className="reveal-left" style={{ position: "relative", height: 520 }}>
          {/* Main tilt card */}
          <div ref={cardRef} onMouseMove={handleTilt} onMouseLeave={resetTilt} data-hover
            style={{ position: "absolute", width: "78%", height: "68%", top: 0, left: 0, background: "linear-gradient(145deg,#F2EDE2,#EDE5D4)", border: "1px solid #E5DDD0", padding: "2.8rem", display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden", transition: "transform 0.15s ease", cursor: "none" }}>
            <div style={{ position: "absolute", top: -20, left: -20, fontFamily: "'Cormorant Garamond',serif", fontSize: "18rem", fontWeight: 700, color: "rgba(184,137,42,0.04)", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>HS</div>
            <span style={{ display: "inline-block", background: "linear-gradient(135deg,#B8892A,#7A5A18)", color: "#fff", padding: "0.35rem 0.9rem", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "1rem", width: "fit-content" }}>MSME · Micro Enterprise</span>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.6rem", fontWeight: 700, color: "#1C1917", marginBottom: "0.5rem" }}>Trusted Telecom Partner</div>
            <div style={{ fontSize: "0.85rem", color: "#9C9280" }}>Moradabad, Uttar Pradesh</div>
          </div>
          {/* Float card */}
          <div className="float" style={{ position: "absolute", bottom: 0, right: 0, background: "#fff", border: "1px solid #E5DDD0", boxShadow: "0 32px 70px rgba(28,25,23,0.12)", padding: "2rem 2.2rem", minWidth: 220, cursor: "none" }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "3.5rem", fontWeight: 700, color: "#B8892A", lineHeight: 1 }}>4</div>
            <div style={{ fontSize: "0.78rem", color: "#9C9280", marginTop: "0.3rem", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>Team Members</div>
            <div style={{ marginTop: "1rem", display: "flex", gap: "0.4rem" }}>
              {[...Array(4)].map((_, i) => <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg,${["#B8892A", "#D4A843", "#7A5A18", "#C09030"][i]},${["#D4A843", "#E5B850", "#B8892A", "#D4A843"][i]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", color: "#fff", fontWeight: 700 }}>{["M", "M", "F", "F"][i]}</div>)}
            </div>
          </div>
          {/* Badge */}
          <div style={{ position: "absolute", top: "-1.5rem", right: "-1.5rem", background: "#1C1917", padding: "1.1rem 1.6rem", boxShadow: "0 20px 50px rgba(28,25,23,0.18)" }}>
            <div style={{ fontSize: "0.62rem", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.3rem" }}>Udyam No.</div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1rem", letterSpacing: "2px", color: "#D4A843" }}>UDYAM-UP-59-0079830</div>
          </div>
          {/* Accent line */}
          <div style={{ position: "absolute", bottom: "10%", left: "-3rem", width: "2.5rem", height: 1, background: "#B8892A" }} />
        </div>

        {/* Text col */}
        <div className="reveal-right">
          <Badge>Who We Are</Badge>
          <Title><Gold>Future</Gold> of Connectivity</Title>
          <p style={{ fontSize: "1.05rem", color: "#7A6F66", lineHeight: 1.95, marginBottom: "1.5rem" }}>
            HS Services is a Udyam-registered micro enterprise operating in the telecommunications sector under NIC code 61900 — Other Telecommunications Activities. MSME certified, enabling access to government schemes and priority sector lending.
          </p>
          <p style={{ fontSize: "1.05rem", color: "#7A6F66", lineHeight: 1.95, marginBottom: "2.8rem" }}>
            Incorporated in July 2025 and headquartered at Rajkiye Kanya Inter College, Linepar, Moradabad, Uttar Pradesh — bringing a forward-thinking approach to telecom and trading services.
          </p>
          <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
            {["General Category", "Axis Bank", "MSME Micro", "NIC 61900", "Partnership"].map(t => (
              <div key={t} style={{ background: "#F8F5EF", border: "1px solid #E5DDD0", padding: "0.55rem 1.2rem", fontSize: "0.75rem", fontWeight: 700, color: "#3D3530", display: "flex", alignItems: "center", gap: "0.5rem", letterSpacing: "0.5px" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#B8892A", display: "inline-block" }} />{t}
              </div>
            ))}
          </div>
          <HBtn href="#company" dark>View Company Details →</HBtn>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   SERVICES
═══════════════════════════════════════════════════ */
function SvcCard({ no, icon, title, desc }) {
  const [hov, setHov] = useState(false);
  const ref = useRef(null);
  const handleTilt = e => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 12;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -12;
    ref.current.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${y}deg) translateY(-10px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = "perspective(600px) rotateY(0) rotateX(0) translateY(0)"; };

  return (
    <div ref={ref} onMouseMove={handleTilt} onMouseLeave={() => { reset(); setHov(false); }} onMouseEnter={() => setHov(true)}
      style={{ background: hov ? "#fff" : "#FDFAF6", border: "1px solid #E5DDD0", padding: "3rem 2.5rem", position: "relative", overflow: "hidden", transition: "all 0.5s cubic-bezier(0.23,1,0.32,1)", boxShadow: hov ? "0 32px 70px rgba(28,25,23,0.1),0 0 0 1px rgba(184,137,42,0.15)" : "", cursor: "none" }}>
      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "7rem", position: "absolute", top: "0.5rem", right: "1rem", lineHeight: 1, color: hov ? "rgba(184,137,42,0.08)" : "rgba(28,25,23,0.03)", transition: "color 0.5s", pointerEvents: "none" }}>{no}</div>
      <div style={{ width: 60, height: 60, background: hov ? "#1C1917" : "#F2EDE2", border: "1px solid", borderColor: hov ? "#1C1917" : "#E5DDD0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: "2rem", transition: "all 0.4s" }}>{icon}</div>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.5rem", fontWeight: 700, color: "#1C1917", marginBottom: "1rem" }}>{title}</div>
      <div style={{ fontSize: "0.92rem", color: "#7A6F66", lineHeight: 1.9 }}>{desc}</div>
      <div className="svc-arrow" style={{ marginTop: "1.8rem", color: "#B8892A", fontSize: "1.4rem" }}>→</div>
    </div>
  );
}

function Services() {
  return (
    <section id="services" className="hs-section" style={{ padding: "9rem 4rem", background: "#F2EDE2" }}>
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", maxWidth: 660, margin: "0 auto 5.5rem" }}>
          <Badge center>What We Offer</Badge>
          <Title center>Our <Gold>Core</Gold> Services</Title>
          <p style={{ fontSize: "1.05rem", color: "#7A6F66", lineHeight: 1.9 }}>From telecommunications infrastructure to trading solutions — comprehensive services tailored to modern business needs.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5px", background: "#E5DDD0" }} className="r-grid3">
          {SERVICES.map((s, i) => (
            <div key={i} className="reveal" style={{ transitionDelay: `${(i % 3) * 0.1}s` }}>
              <SvcCard {...s} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   VIDEO / MARQUEE SECTION
═══════════════════════════════════════════════════ */
function Portfolio() {
  const IMGS1 = [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
  ];
  const IMGS2 = [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  ];
  return (
    <section id="portfolio" style={{ padding: "7rem 0", background: "#0D0B08", overflow: "hidden" }}>
      <div style={{ maxWidth: 1300, margin: "0 auto 4rem", padding: "0 4rem" }} className="reveal">
        <Badge dark>Visual Portfolio</Badge>
        <Title dark>Our <Gold>Work</Gold> In Action</Title>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", overflow: "hidden" }}>
        <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
          <div className="marquee-row" style={{ display: "inline-flex", gap: "20px" }}>
            {[...IMGS1, ...IMGS1].map((src, i) => (
              <div key={i} className="marquee-img" style={{ position: "relative" }}>
                <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(15%) saturate(1.1)" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(184,137,42,0.15),transparent)", opacity: 0, transition: "opacity 0.3s" }}
                  onMouseEnter={e => e.target.style.opacity = 1} onMouseLeave={e => e.target.style.opacity = 0} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
          <div className="marquee-row rev" style={{ display: "inline-flex", gap: "20px" }}>
            {[...IMGS2, ...IMGS2].map((src, i) => (
              <div key={i} className="marquee-img">
                <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(15%) saturate(1.1)" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   COMPANY
═══════════════════════════════════════════════════ */
function DetailBlock({ label, title, rows }) {
  const [hov, setHov] = useState(false);
  return (
    <div className="detail-block" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} data-hover
      style={{ background: "#fff", border: "1px solid #E5DDD0", padding: "3rem", position: "relative", overflow: "hidden", boxShadow: hov ? "0 24px 60px rgba(28,25,23,0.08)" : "", borderLeft: `3px solid ${hov ? "#B8892A" : "transparent"}`, transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)", cursor: "none" }}>
      <div style={{ fontSize: "0.68rem", letterSpacing: "3px", textTransform: "uppercase", color: "#B8892A", marginBottom: "0.7rem" }}>{label}</div>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.6rem", fontWeight: 700, color: "#1C1917", marginBottom: "2rem" }}>{title}</div>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.85rem 0", borderBottom: i < rows.length - 1 ? "1px solid #F2EDE2" : "none", fontSize: "0.9rem", gap: "1rem" }}>
          <span style={{ color: "#9C9280", fontWeight: 500 }}>{r.k}</span>
          <span style={{ color: r.gold ? "#B8892A" : "#1C1917", fontWeight: 700, textAlign: "right", maxWidth: "55%" }}>{r.v}</span>
        </div>
      ))}
    </div>
  );
}

function Company() {
  return (
    <section id="company" className="hs-section" style={{ padding: "9rem 4rem", background: "#F8F5EF" }}>
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <div className="reveal">
          <Badge>Company Profile</Badge>
          <Title>Verified <Gold>Business</Gold> Information</Title>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginTop: "4rem" }} className="r-grid">
          {COMPANY_BLOCKS.map((b, i) => (
            <div key={i} className="reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
              <DetailBlock {...b} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   MAP
═══════════════════════════════════════════════════ */
function MapSection() {
  return (
    <div style={{ position: "relative", height: 520, borderTop: "1px solid #E5DDD0", overflow: "hidden" }}>
      <iframe src="https://maps.google.com/maps?q=28.955058895420574,78.83925397805548&z=15&output=embed"
        style={{ width: "100%", height: "100%", border: "none", filter: "sepia(20%) saturate(0.8) brightness(1.0)" }} allowFullScreen loading="lazy" title="HS Services Location" />
      <div style={{ position: "absolute", top: "2.5rem", left: "3rem", background: "rgba(248,245,239,0.97)", border: "1px solid #E5DDD0", backdropFilter: "blur(24px)", padding: "2.2rem 2.5rem", maxWidth: 360, boxShadow: "0 24px 60px rgba(28,25,23,0.14)" }}>
        <div style={{ fontSize: "0.68rem", letterSpacing: "3px", textTransform: "uppercase", color: "#B8892A", marginBottom: "0.5rem" }}>Head Office</div>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem", fontWeight: 700, color: "#1C1917", marginBottom: "0.9rem" }}>HS Services HQ</div>
        <p style={{ fontSize: "0.85rem", color: "#7A6F66", lineHeight: 1.75, marginBottom: "1.3rem" }}>Rajkiye Kanya Inter College, Linepar, Moradabad, Uttar Pradesh — 244001</p>
        {[["📍", "Linepar, Moradabad, UP 244001"], ["📞", "+91 97582 90120"], ["✉️", "hsservices899@gmail.com"], ["🕐", "Mon–Sat, 9AM – 6PM"]].map(([ic, t], i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.7rem", fontSize: "0.82rem", color: "#7A6F66", marginBottom: "0.5rem" }}>
            <span>{ic}</span><span>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CERTIFICATE
═══════════════════════════════════════════════════ */
function Certificate() {
  return (
    <section id="certificate" className="hs-section" style={{ padding: "9rem 4rem", background: "#fff" }}>
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "4.5rem" }}>
          <Badge center>Official Certification</Badge>
          <Title center>Udyam <Gold>Registration</Gold></Title>
          <p style={{ fontSize: "1.05rem", color: "#7A6F66", maxWidth: 480, margin: "0 auto", lineHeight: 1.9 }}>Government of India recognised MSME Udyam Registration Certificate — your guarantee of authenticity.</p>
        </div>
        <div className="reveal-scale" style={{ maxWidth: 700, margin: "0 auto", border: "2px solid rgba(184,137,42,0.3)", padding: "4.5rem", textAlign: "center", position: "relative", background: "#FDFAF6", boxShadow: "0 50px 100px rgba(28,25,23,0.08)", animation: "glowPulse 3s ease-in-out infinite" }}>
          {[[{ top: 22, left: 22 }, { borderRight: "none", borderBottom: "none" }], [{ top: 22, right: 22 }, { borderLeft: "none", borderBottom: "none" }], [{ bottom: 22, left: 22 }, { borderRight: "none", borderTop: "none" }], [{ bottom: 22, right: 22 }, { borderLeft: "none", borderTop: "none" }]].map(([pos, brd], i) => (
            <div key={i} style={{ position: "absolute", width: 52, height: 52, border: "2px solid rgba(184,137,42,0.4)", ...pos, ...brd }} />
          ))}
          <div style={{ width: 88, height: 88, background: "linear-gradient(135deg,#B8892A,#7A5A18)", margin: "0 auto 2rem", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.2rem", boxShadow: "0 16px 40px rgba(184,137,42,0.25)" }}>🏛️</div>
          <div style={{ fontSize: "0.68rem", letterSpacing: "5px", textTransform: "uppercase", color: "#9C9280", marginBottom: "0.5rem" }}>Government of India · Ministry of MSME</div>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "2.2rem", letterSpacing: "4px", marginBottom: "0.3rem" }} className="gold">UDYAM-UP-59-0079830</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2.2rem", fontWeight: 700, color: "#1C1917", marginBottom: "0.5rem" }}>HS SERVICES</div>
          <div style={{ fontSize: "0.9rem", color: "#9C9280" }}>Micro Enterprise · Telecommunications · Trading</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.9rem", marginTop: "2.8rem", textAlign: "left" }}>
            {CERT_ITEMS.map((r, i) => (
              <div key={i} style={{ background: "#F8F5EF", border: "1px solid #E5DDD0", padding: "1rem 1.2rem" }}>
                <div style={{ fontSize: "0.62rem", letterSpacing: "2px", textTransform: "uppercase", color: "#B8892A", marginBottom: "0.3rem" }}>{r.l}</div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1C1917" }}>{r.v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #E5DDD0", fontSize: "0.7rem", color: "#9C9280", letterSpacing: "1px" }}>
            Verified · udyamregistration.gov.in · Computer Generated · No Signature Required
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   FAQ
═══════════════════════════════════════════════════ */
function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section style={{ padding: "9rem 4rem", background: "#0D0B08" }} className="hs-section">
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div className="reveal" style={{ marginBottom: "4rem" }}>
          <Badge dark>FAQ</Badge>
          <Title dark>Frequently <Gold>Asked</Gold> Questions</Title>
        </div>
        {FAQS.map((f, i) => (
          <div key={i} className="reveal" style={{ transitionDelay: `${i * 0.1}s`, borderBottom: "1px solid rgba(184,137,42,0.12)" }}>
            <button onClick={() => setOpen(open === i ? null : i)} data-hover
              style={{ width: "100%", textAlign: "left", background: "none", border: "none", padding: "1.8rem 0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "none", gap: "1rem" }}>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.25rem", fontWeight: 600, color: open === i ? "#D4A843" : "#F8F5EF", transition: "color 0.3s" }}>{f.q}</span>
              <span style={{ color: "#B8892A", fontSize: "1.3rem", flexShrink: 0, transform: open === i ? "rotate(45deg)" : "", transition: "transform 0.4s cubic-bezier(0.23,1,0.32,1)" }}>+</span>
            </button>
            <div className={`acc-body ${open === i ? "open" : ""}`}>
              <p style={{ fontSize: "0.95rem", color: "rgba(248,245,239,0.55)", lineHeight: 1.9, paddingBottom: "1.5rem" }}>{f.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}



function ContactCard({ icon, label, val, href }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined}
      style={{ display: "flex", alignItems: "center", gap: "1.2rem", background: "#fff", border: "1px solid", borderColor: hov ? "#B8892A" : "#E5DDD0", padding: "1.4rem 1.6rem", marginBottom: "1rem", textDecoration: "none", color: "#1C1917", transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)", cursor: "none", transform: hov ? "translateX(10px)" : "", boxShadow: hov ? "0 12px 36px rgba(28,25,23,0.09)" : "" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={{ width: 52, height: 52, background: hov ? "#1C1917" : "#F8F5EF", border: "1px solid #E5DDD0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0, transition: "background 0.3s" }}>{icon}</div>
      <div>
        <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#9C9280", marginBottom: "0.3rem" }}>{label}</div>
        <div style={{ fontSize: "0.95rem", fontWeight: 700, color: hov ? "#B8892A" : "#1C1917", transition: "color 0.3s" }}>{val}</div>
      </div>
    </a>
  );
}






import { Link } from "react-router-dom";



/* =========================================
   FOOTER
========================================= */

function Footer() {
  return (
    <footer
      style={{
        background: "#0D0B08",
        padding: "6rem 4rem 3rem",
        color: "rgba(255,255,255,0.5)",
        borderTop: "1px solid rgba(184,137,42,0.1)",
      }}
    >
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "4rem",
            marginBottom: "5rem",
          }}
          className="r-grid4"
        >
          {/* LEFT */}
          <div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: "2.2rem",
                fontWeight: 700,
                marginBottom: "1.2rem",
              }}
            >
              HS <span className="gold">Services</span>
            </div>

            <p
              style={{
                fontSize: "0.9rem",
                lineHeight: 1.9,
                maxWidth: 320,
                marginBottom: "1.8rem",
              }}
            >
              A Udyam-registered micro enterprise delivering premium
              telecommunications and trading from Moradabad, Uttar Pradesh.
            </p>

            <div
              style={{
                fontSize: "0.68rem",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#B8892A",
              }}
            >
              UDYAM-UP-59-0079830
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <div
              style={{
                fontSize: "0.68rem",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#B8892A",
                marginBottom: "1.5rem",
                fontWeight: 700,
              }}
            >
              Company
            </div>

            <ul style={{ listStyle: "none" }}>
              {[
                "About Us",
                "Services",
                "Certificate",
                "Company Details",
              ].map((l) => (
                <li key={l} style={{ marginBottom: "0.8rem" }}>
                  <a
                    href="#"
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      textDecoration: "none",
                      fontSize: "0.88rem",
                    }}
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <div
              style={{
                fontSize: "0.68rem",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#B8892A",
                marginBottom: "1.5rem",
                fontWeight: 700,
              }}
            >
              Legal
            </div>

            <ul style={{ listStyle: "none" }}>
              <li style={{ marginBottom: "0.8rem" }}>
                <a
                  href="#"
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    textDecoration: "none",
                    fontSize: "0.88rem",
                  }}
                >
                  UDYAM-UP-59-0079830
                </a>
              </li>

              <li style={{ marginBottom: "0.8rem" }}>
                <a
                  href="#"
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    textDecoration: "none",
                    fontSize: "0.88rem",
                  }}
                >
                  PAN: AASFH4698D
                </a>
              </li>

              <li style={{ marginBottom: "0.8rem" }}>
                <a
                  href="#"
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    textDecoration: "none",
                    fontSize: "0.88rem",
                  }}
                >
                  NIC: 61900
                </a>
              </li>

              <li style={{ marginBottom: "0.8rem" }}>
                <Link
                  to="/privacy-policy"
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    textDecoration: "none",
                    fontSize: "0.88rem",
                  }}
                >
                  Privacy Policy
                </Link>
              </li>

              <li style={{ marginBottom: "0.8rem" }}>
                <Link
                  to="/terms-condition"
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    textDecoration: "none",
                    fontSize: "0.88rem",
                  }}
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <div
              style={{
                fontSize: "0.68rem",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#B8892A",
                marginBottom: "1.5rem",
                fontWeight: 700,
              }}
            >
              Contact
            </div>

            <ul style={{ listStyle: "none" }}>
              {[
                "+91 9758290120",
                "hsservices899@gmail.com",
                "Moradabad UP 244001",
                "Mon–Sat, 9AM–6PM",
              ].map((l) => (
                <li key={l} style={{ marginBottom: "0.8rem" }}>
                  <a
                    href="#"
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      textDecoration: "none",
                      fontSize: "0.88rem",
                    }}
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* BOTTOM */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "2.5rem",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p style={{ fontSize: "0.78rem" }}>
            © 2025 HS Services. All rights reserved.
          </p>

          <p style={{ fontSize: "0.78rem" }}>
            Moradabad · Uttar Pradesh · India
          </p>
        </div>
      </div>
    </footer>
  );
}



/* =========================================
   CONTACT
========================================= */

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [sent, setSent] = useState(false);

  const [checked, setChecked] = useState(false);

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = () => {
    if (!checked) {
      alert(
        "Please accept Privacy Policy & Terms & Conditions"
      );
      return;
    }

    setSent(true);

    setTimeout(() => {
      setSent(false);

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      setChecked(false);
    }, 3500);
  };

  return (
    <section
      id="contact"
      className="hs-section"
      style={{
        padding: "9rem 4rem",
        background: "#F2EDE2",
      }}
    >
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <div
          className="reveal"
          style={{
            textAlign: "center",
            marginBottom: "5.5rem",
          }}
        >
          <Badge center>Reach Out</Badge>

          <Title center>
            Get In <Gold>Touch</Gold>
          </Title>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "6rem",
          }}
          className="r-grid"
        >
          {/* LEFT */}
          <div className="reveal-left">
            <p
              style={{
                fontSize: "1.05rem",
                color: "#7A6F66",
                lineHeight: 1.95,
                marginBottom: "3rem",
              }}
            >
              Whether you need telecom solutions or trading
              partnerships — we're here to help.
            </p>

            {[
              {
                icon: "📞",
                label: "Call Us",
                val: "+91 9758290120",
                href: "tel:+919758290120",
              },
              {
                icon: "✉️",
                label: "Email Us",
                val: "hsservices899@gmail.com",
                href: "mailto:hsservices899@gmail.com",
              },
              {
                icon: "📍",
                label: "Visit Us",
                val: "Linepar, Moradabad, UP 244001",
                href: "#",
              },
            ].map((c, i) => (
              <ContactCard key={i} {...c} />
            ))}
          </div>

          {/* RIGHT */}
          <div className="reveal-right">
            <div
              style={{
                background: "#fff",
                border: "1px solid #E5DDD0",
                padding: "3.5rem",
                boxShadow:
                  "0 24px 60px rgba(28,25,23,0.07)",
              }}
            >
              {[
                {
                  ph: "Your Full Name",
                  k: "name",
                  t: "text",
                },
                {
                  ph: "Email Address",
                  k: "email",
                  t: "email",
                },
                {
                  ph: "Subject",
                  k: "subject",
                  t: "text",
                },
              ].map((f) => (
                <input
                  key={f.k}
                  type={f.t}
                  placeholder={f.ph}
                  value={form[f.k]}
                  onChange={set(f.k)}
                  className="hs-inp"
                  style={{
                    width: "100%",
                    background: "#F8F5EF",
                    border: "1px solid #E5DDD0",
                    color: "#1C1917",
                    padding: "1rem 1.4rem",
                    fontSize: "0.95rem",
                    marginBottom: "1rem",
                  }}
                />
              ))}

              <textarea
                placeholder="Your Message"
                rows={6}
                value={form.message}
                onChange={set("message")}
                className="hs-inp"
                style={{
                  width: "100%",
                  background: "#F8F5EF",
                  border: "1px solid #E5DDD0",
                  color: "#1C1917",
                  padding: "1rem 1.4rem",
                  fontSize: "0.95rem",
                  marginBottom: "1.5rem",
                  resize: "none",
                }}
              />

              {/* CHECKBOX */}

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.8rem",
                  marginBottom: "1.5rem",
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) =>
                    setChecked(e.target.checked)
                  }
                  style={{
                    width: "18px",
                    height: "18px",
                    marginTop: "4px",
                    accentColor: "#B8892A",
                  }}
                />

                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#7A6F66",
                    lineHeight: 1.7,
                  }}
                >
                  I agree to the{" "}
                  <Link
                    to="/privacy-policy"
                    style={{
                      color: "#B8892A",
                      textDecoration: "none",
                      fontWeight: 700,
                    }}
                  >
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/terms-condition"
                    style={{
                      color: "#B8892A",
                      textDecoration: "none",
                      fontWeight: 700,
                    }}
                  >
                    Terms & Conditions
                  </Link>
                </p>
              </div>

              {/* BUTTON */}

              <button
                data-hover
                onClick={submit}
                style={{
                  width: "100%",
                  padding: "1.2rem",
                  background: sent
                    ? "#2D7A3A"
                    : "#1C1917",
                  color: "#fff",
                  border: "none",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  transition: "all 0.4s",
                }}
              >
                {sent
                  ? "✓ Message Sent Successfully!"
                  : "Send Message →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   Privacy Policy
═══════════════════════════════════════════════════ */
function PrivacyPolicy() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "8rem 2rem",
        background: "#F8F5EF",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* HEADING */}

        <div style={{ marginBottom: "4rem" }}>
          <div
            style={{
              fontSize: "0.75rem",
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "#B8892A",
              marginBottom: "1rem",
              fontWeight: 700,
            }}
          >
            HS SERVICES
          </div>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: "4rem",
              lineHeight: 1.1,
              color: "#1C1917",
              marginBottom: "1.5rem",
            }}
          >
            Privacy <span className="gold">Policy</span>
          </h1>

          <p
            style={{
              fontSize: "1.05rem",
              color: "#7A6F66",
              lineHeight: 2,
              maxWidth: "800px",
            }}
          >
            At HS Services, we value your trust and are committed
            to protecting your personal information and privacy.
          </p>
        </div>

        {/* CONTENT */}

        <div
          style={{
            background: "#fff",
            padding: "4rem",
            border: "1px solid #E5DDD0",
            boxShadow: "0 20px 60px rgba(28,25,23,0.06)",
          }}
        >
          {/* SECTION */}

          <div style={{ marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "1.6rem",
                color: "#1C1917",
                marginBottom: "1rem",
                fontWeight: 700,
              }}
            >
              1. Information We Collect
            </h2>

            <p
              style={{
                color: "#7A6F66",
                lineHeight: 2,
                fontSize: "1rem",
              }}
            >
              We may collect your name, email address, phone
              number, business information and any details you
              provide through our contact forms or services.
            </p>
          </div>

          {/* SECTION */}

          <div style={{ marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "1.6rem",
                color: "#1C1917",
                marginBottom: "1rem",
                fontWeight: 700,
              }}
            >
              2. How We Use Your Information
            </h2>

            <p
              style={{
                color: "#7A6F66",
                lineHeight: 2,
                fontSize: "1rem",
              }}
            >
              Your information is used only for communication,
              service improvement, customer support and business
              operations. We never misuse or sell your data.
            </p>
          </div>

          {/* SECTION */}

          <div style={{ marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "1.6rem",
                color: "#1C1917",
                marginBottom: "1rem",
                fontWeight: 700,
              }}
            >
              3. Data Protection
            </h2>

            <p
              style={{
                color: "#7A6F66",
                lineHeight: 2,
                fontSize: "1rem",
              }}
            >
              HS Services implements appropriate security measures
              to protect your personal data against unauthorized
              access, disclosure or misuse.
            </p>
          </div>

          {/* SECTION */}

          <div style={{ marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "1.6rem",
                color: "#1C1917",
                marginBottom: "1rem",
                fontWeight: 700,
              }}
            >
              4. Third-Party Services
            </h2>

            <p
              style={{
                color: "#7A6F66",
                lineHeight: 2,
                fontSize: "1rem",
              }}
            >
              We do not share your information with third parties
              except where required for legal compliance or service
              delivery purposes.
            </p>
          </div>

          {/* SECTION */}

          <div style={{ marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "1.6rem",
                color: "#1C1917",
                marginBottom: "1rem",
                fontWeight: 700,
              }}
            >
              5. Cookies & Analytics
            </h2>

            <p
              style={{
                color: "#7A6F66",
                lineHeight: 2,
                fontSize: "1rem",
              }}
            >
              Our website may use cookies and analytics tools to
              improve user experience and website performance.
            </p>
          </div>

          {/* SECTION */}

          <div style={{ marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "1.6rem",
                color: "#1C1917",
                marginBottom: "1rem",
                fontWeight: 700,
              }}
            >
              6. User Rights
            </h2>

            <p
              style={{
                color: "#7A6F66",
                lineHeight: 2,
                fontSize: "1rem",
              }}
            >
              You have the right to request access, correction or
              deletion of your personal information at any time.
            </p>
          </div>

          {/* SECTION */}

          <div style={{ marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "1.6rem",
                color: "#1C1917",
                marginBottom: "1rem",
                fontWeight: 700,
              }}
            >
              7. Policy Updates
            </h2>

            <p
              style={{
                color: "#7A6F66",
                lineHeight: 2,
                fontSize: "1rem",
              }}
            >
              HS Services reserves the right to update or modify
              this privacy policy at any time without prior notice.
            </p>
          </div>

          {/* CONTACT */}

          <div
            style={{
              marginTop: "4rem",
              padding: "2rem",
              background: "#F8F5EF",
              border: "1px solid #E5DDD0",
            }}
          >
            <h3
              style={{
                fontSize: "1.3rem",
                marginBottom: "1rem",
                color: "#1C1917",
              }}
            >
              Contact Us
            </h3>

            <p
              style={{
                color: "#7A6F66",
                lineHeight: 2,
                marginBottom: "0.6rem",
              }}
            >
              HS Services
            </p>

            <p
              style={{
                color: "#7A6F66",
                lineHeight: 2,
                marginBottom: "0.6rem",
              }}
            >
              Moradabad, Uttar Pradesh, India
            </p>

            <p
              style={{
                color: "#7A6F66",
                lineHeight: 2,
                marginBottom: "0.6rem",
              }}
            >
              Email: hsservices899@gmail.com
            </p>

            <p
              style={{
                color: "#7A6F66",
                lineHeight: 2,
              }}
            >
              Phone: +91 9758290120
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Terms And Condition
═══════════════════════════════════════════════════ */

function TermsCondition() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "8rem 2rem",
        background: "#F8F5EF",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* HEADER */}

        <div style={{ marginBottom: "4rem" }}>
          <div
            style={{
              fontSize: "0.75rem",
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "#B8892A",
              marginBottom: "1rem",
              fontWeight: 700,
            }}
          >
            HS SERVICES
          </div>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: "4rem",
              lineHeight: 1.1,
              color: "#1C1917",
              marginBottom: "1.5rem",
            }}
          >
            Terms & <span className="gold">Conditions</span>
          </h1>

          <p
            style={{
              fontSize: "1.05rem",
              color: "#7A6F66",
              lineHeight: 2,
              maxWidth: "800px",
            }}
          >
            Please read these terms and conditions carefully before
            using HS Services and our website.
          </p>
        </div>

        {/* MAIN CONTENT */}

        <div
          style={{
            background: "#fff",
            padding: "4rem",
            border: "1px solid #E5DDD0",
            boxShadow: "0 20px 60px rgba(28,25,23,0.06)",
          }}
        >
          {/* SECTION */}

          <div style={{ marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "1.6rem",
                color: "#1C1917",
                marginBottom: "1rem",
                fontWeight: 700,
              }}
            >
              1. Acceptance of Terms
            </h2>

            <p
              style={{
                color: "#7A6F66",
                lineHeight: 2,
                fontSize: "1rem",
              }}
            >
              By accessing or using HS Services, you agree to comply
              with these terms and conditions, company policies and
              all applicable laws and regulations.
            </p>
          </div>

          {/* SECTION */}

          <div style={{ marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "1.6rem",
                color: "#1C1917",
                marginBottom: "1rem",
                fontWeight: 700,
              }}
            >
              2. Services
            </h2>

            <p
              style={{
                color: "#7A6F66",
                lineHeight: 2,
                fontSize: "1rem",
              }}
            >
              HS Services provides telecommunications, trading and
              related business services. All services are subject to
              availability and may be modified or discontinued at
              any time.
            </p>
          </div>

          {/* SECTION */}

          <div style={{ marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "1.6rem",
                color: "#1C1917",
                marginBottom: "1rem",
                fontWeight: 700,
              }}
            >
              3. User Responsibilities
            </h2>

            <p
              style={{
                color: "#7A6F66",
                lineHeight: 2,
                fontSize: "1rem",
              }}
            >
              Users agree not to misuse the website, attempt
              unauthorized access, distribute harmful content or
              engage in any unlawful activity while using our
              services.
            </p>
          </div>

          {/* SECTION */}

          <div style={{ marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "1.6rem",
                color: "#1C1917",
                marginBottom: "1rem",
                fontWeight: 700,
              }}
            >
              4. Payments & Transactions
            </h2>

            <p
              style={{
                color: "#7A6F66",
                lineHeight: 2,
                fontSize: "1rem",
              }}
            >
              All payments and transactions must be completed in
              accordance with agreed business terms. HS Services
              reserves the right to refuse or cancel any order or
              transaction if necessary.
            </p>
          </div>

          {/* SECTION */}

          <div style={{ marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "1.6rem",
                color: "#1C1917",
                marginBottom: "1rem",
                fontWeight: 700,
              }}
            >
              5. Intellectual Property
            </h2>

            <p
              style={{
                color: "#7A6F66",
                lineHeight: 2,
                fontSize: "1rem",
              }}
            >
              All content, branding, graphics, logos and materials
              on this website are the property of HS Services and
              may not be copied or reused without permission.
            </p>
          </div>

          {/* SECTION */}

          <div style={{ marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "1.6rem",
                color: "#1C1917",
                marginBottom: "1rem",
                fontWeight: 700,
              }}
            >
              6. Limitation of Liability
            </h2>

            <p
              style={{
                color: "#7A6F66",
                lineHeight: 2,
                fontSize: "1rem",
              }}
            >
              HS Services shall not be held responsible for any
              direct, indirect or incidental damages arising from
              the use or inability to use our website or services.
            </p>
          </div>

          {/* SECTION */}

          <div style={{ marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "1.6rem",
                color: "#1C1917",
                marginBottom: "1rem",
                fontWeight: 700,
              }}
            >
              7. Privacy & Security
            </h2>

            <p
              style={{
                color: "#7A6F66",
                lineHeight: 2,
                fontSize: "1rem",
              }}
            >
              We are committed to protecting your personal
              information and maintaining data security in
              accordance with our Privacy Policy.
            </p>
          </div>

          {/* SECTION */}

          <div style={{ marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "1.6rem",
                color: "#1C1917",
                marginBottom: "1rem",
                fontWeight: 700,
              }}
            >
              8. Changes to Terms
            </h2>

            <p
              style={{
                color: "#7A6F66",
                lineHeight: 2,
                fontSize: "1rem",
              }}
            >
              HS Services reserves the right to update or modify
              these terms and conditions at any time without prior
              notice.
            </p>
          </div>

          {/* SECTION */}

          <div style={{ marginBottom: "0rem" }}>
            <h2
              style={{
                fontSize: "1.6rem",
                color: "#1C1917",
                marginBottom: "1rem",
                fontWeight: 700,
              }}
            >
              9. Contact Information
            </h2>

            <p
              style={{
                color: "#7A6F66",
                lineHeight: 2,
                fontSize: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              HS Services
            </p>

            <p
              style={{
                color: "#7A6F66",
                lineHeight: 2,
                fontSize: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              Moradabad, Uttar Pradesh, India
            </p>

            <p
              style={{
                color: "#7A6F66",
                lineHeight: 2,
                fontSize: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              Email: hsservices899@gmail.com
            </p>

            <p
              style={{
                color: "#7A6F66",
                lineHeight: 2,
                fontSize: "1rem",
              }}
            >
              Phone: +91 9758290120
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════ */
function Badge({ children, center, dark }) {
  return (
    <div style={{ fontSize: "0.68rem", letterSpacing: "5px", textTransform: "uppercase", color: "#B8892A", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "1rem", justifyContent: center ? "center" : "flex-start" }}>
      <span style={{ width: 36, height: 1, background: "#B8892A", display: "inline-block" }} />
      {children}
      {center && <span style={{ width: 36, height: 1, background: "#B8892A", display: "inline-block" }} />}
    </div>
  );
}
function Title({ children, center, dark }) {
  return (
    <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2.8rem,5.5vw,4.5rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-1.5px", color: dark ? "#F8F5EF" : "#1C1917", marginBottom: "1.6rem", textAlign: center ? "center" : "left" }}>
      {children}
    </h2>
  );
}
function Gold({ children }) { return <span className="gold">{children}</span>; }

/* ═══════════════════════════════════════════════════
   APP
═══════════════════════════════════════════════════ */
function HSServicesApp() {
  const [loading, setLoading] = useState(true);

  const done = useCallback(() => {
    const el = document.getElementById("hs-loader");

    if (el) {
      el.style.opacity = "0";
      el.style.visibility = "hidden";
    }

    setTimeout(() => setLoading(false), 900);
  }, []);

  useReveal();

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <div id="hs-dot" />
      <div id="hs-ring" />
      <div id="hs-trail" />

      <Cursor />

      {loading && <Loader onDone={done} />}

      <Ticker />
      <Navbar />
      <Hero />
      <Stats />
      <About />
      <HeroSlider />
      <Services />
      <Portfolio />
      <Company />
      <MapSection />
      <Certificate />
      <FAQ />
      <Contact />
      <Footer />
    </>
  );
}



/* =========================
   MAIN APP EXPORT
========================= */

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HSServicesApp />} />

        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy />}
        />

        <Route
          path="/terms-condition"
          element={<TermsCondition />}
        />
      </Routes>
    </BrowserRouter>
  );
}