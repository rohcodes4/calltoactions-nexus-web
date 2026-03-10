import { useState, useEffect, useRef } from "react";
import {
  ArrowDown, ArrowRight, TrendingUp, BarChart2, RefreshCw,
  Gauge, Layout, Target, Smartphone, ShoppingCart, Link2,
  Layers, Bell, LineChart, Eye, FlaskConical, FileText,
  Calendar, CheckCircle2, Mail, Phone, Globe, Star,
  ChevronDown, ChevronUp, Package, Sparkles, Zap,
  Activity, Crosshair, MousePointer2
} from "lucide-react";

// ─── CDN IMAGES ───────────────────────────────────────────────────────────────
const CDN = "https://onsethomes.com/cdn/shop";
const IMGS = {
  tyger1:   `${CDN}/files/DSC2107_7672755c-aa04-402b-924b-a5d2acc27dae.jpg?v=1749130851&width=800`,
  tyger2:   `${CDN}/files/DSC1682.jpg?v=1750242826&width=800`,
  tyger3:   `${CDN}/files/DSC2108_921bef12-fd1e-4de2-a0a4-2441b7731632.jpg?v=1750242826&width=800`,
  blogHero: `${CDN}/articles/DSC02647_1.webp?v=1747111321&width=1100`,
  logo:     `${CDN}/files/onserhomes_logo_70x.png?v=1647079313`,
};

// ─── COLOURS ──────────────────────────────────────────────────────────────────
const C = {
  cream:     "#faf8f5",
  white:     "#ffffff",
  rose:      "#e8c5b8",
  terra:     "#c87860",
  deep:      "#a05540",
  sage:      "#b8c9b0",
  sand:      "#ede7dc",
  charcoal:  "#2c2420",
  mid:       "#6b5c55",
  light:     "#a89890",
  gold:      "#c9a96e",
  goldLight: "#e8d4a8",
  border:    "rgba(44,36,32,0.10)",
  green:     "#5a7a50",
};

// ─── FONT + GLOBAL STYLES ────────────────────────────────────────────────────
(() => {
  const link = document.createElement("link");
  link.rel  = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap";
  document.head.appendChild(link);
  const s = document.createElement("style");
  s.textContent = `
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{font-family:'DM Sans',sans-serif;background:${C.cream};color:${C.charcoal};overflow-x:hidden;line-height:1.7}
    .serif{font-family:'Cormorant Garamond',serif}
    img{display:block;max-width:100%}
    a{text-decoration:none;color:inherit}
    ::selection{background:${C.rose}}
    ::-webkit-scrollbar{width:4px}
    ::-webkit-scrollbar-track{background:${C.cream}}
    ::-webkit-scrollbar-thumb{background:${C.rose};border-radius:2px}
    @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
    @keyframes spinRing{to{transform:rotate(360deg)}}
  `;
  document.head.appendChild(s);
})();

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref  = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

function useMobile(bp = 768) {
  const [mob, setMob] = useState(() => typeof window !== "undefined" && window.innerWidth < bp);
  useEffect(() => {
    const fn = () => setMob(window.innerWidth < bp);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, [bp]);
  return mob;
}

// ─── SHARED TOKENS ────────────────────────────────────────────────────────────
const Eyebrow = ({ children }) => (
  <span style={{
    display:"inline-block", fontSize:"0.6rem", fontWeight:600,
    letterSpacing:"0.22em", textTransform:"uppercase", color:C.terra,
    background:"rgba(200,120,96,.07)", border:"1px solid rgba(200,120,96,.18)",
    padding:"0.32rem 0.9rem", borderRadius:100, marginBottom:"1rem",
  }}>
    {children}
  </span>
);

const Em = ({ children }) => (
  <em style={{ fontStyle:"italic", color:C.terra }}>{children}</em>
);

const SectionTitle = ({ children, center, style: extra = {} }) => (
  <h2 className="serif" style={{
    fontSize:"clamp(1.75rem,4.5vw,3.2rem)", fontWeight:300, lineHeight:1.12,
    color:C.charcoal, marginBottom:"1.1rem",
    textAlign: center ? "center" : undefined,
    ...extra,
  }}>
    {children}
  </h2>
);

const fadeStyle = (vis, delay = 0, dir = "up") => ({
  opacity:   vis ? 1 : 0,
  transform: vis ? "none"
    : dir === "left"  ? "translateX(-20px)"
    : dir === "right" ? "translateX(20px)"
    : "translateY(20px)",
  transition:`opacity .65s ease ${delay}s, transform .65s ease ${delay}s`,
});

function BtnPrimary({ children, href }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display:"inline-flex", alignItems:"center", gap:"0.4rem",
        background: hov ? C.deep : C.terra, color:"#fff",
        padding:"0.8rem 1.8rem", borderRadius:100,
        fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem",
        fontWeight:500, letterSpacing:"0.06em", textTransform:"uppercase",
        boxShadow: hov ? "0 10px 32px rgba(200,120,96,.4)" : "0 6px 24px rgba(200,120,96,.28)",
        transform: hov ? "translateY(-2px)" : "none",
        transition:"all .3s ease",
      }}>
      {children}
    </a>
  );
}

function BtnOutline({ children, href }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display:"inline-flex", alignItems:"center", gap:"0.4rem",
        background:"transparent", color: hov ? C.terra : C.charcoal,
        border:`1px solid ${hov ? C.terra : C.border}`,
        padding:"0.8rem 1.8rem", borderRadius:100,
        fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem",
        fontWeight:500, letterSpacing:"0.06em", textTransform:"uppercase",
        transform: hov ? "translateY(-2px)" : "none",
        transition:"all .3s ease",
      }}>
      {children}
    </a>
  );
}

function ContactPill({ icon, label, href }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display:"inline-flex", alignItems:"center", gap:"0.35rem",
        fontSize:"0.78rem", fontWeight:500,
        color: hov ? C.terra : C.charcoal,
        background:C.cream, border:`1px solid ${hov ? C.terra : C.border}`,
        padding:"0.45rem 0.9rem", borderRadius:100, transition:"all .3s ease",
      }}>
      {icon} {label}
    </a>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const mob = useMobile(640);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  function NavPill({ children, href }) {
    const [hov, setHov] = useState(false);
    return (
      <a href={href}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
          fontSize:"0.67rem", fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase",
          color: hov ? "#fff" : C.terra,
          border:`1px solid ${C.terra}`, background: hov ? C.terra : "transparent",
          padding:"0.38rem 0.9rem", borderRadius:100, transition:"all .3s ease",
        }}>
        {children}
      </a>
    );
  }

  return (
    <div style={{
      position:"fixed", top:0, left:0, right:0, zIndex:200,
      display:"flex", justifyContent:"space-between", alignItems:"center",
      padding: mob ? "0.85rem 1.25rem" : scrolled ? "0.8rem 2.5rem" : "1.1rem 2.5rem",
      background: scrolled ? "rgba(250,248,245,.96)" : "rgba(250,248,245,.78)",
      backdropFilter:"blur(18px)", WebkitBackdropFilter:"blur(18px)",
      borderBottom:`1px solid ${scrolled ? C.border : "transparent"}`,
      boxShadow: scrolled ? "0 2px 20px rgba(44,36,32,.06)" : "none",
      transition:"all .35s ease",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
        <div style={{ width:26, height:26, borderRadius:"50%", background:C.terra, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Sparkles size={12} color="#fff" />
        </div>
        <span className="serif" style={{ fontSize:"1.1rem", fontWeight:600, color:C.charcoal }}>
          Rohcodes<span style={{ color:C.terra }}>.</span>
        </span>
      </div>
      <NavPill href="#packages">Choose Package</NavPill>
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const mob = useMobile();
  return (
    <section style={{
      minHeight:"100vh", display:"grid", placeItems:"center",
      padding: mob ? "6rem 1.25rem 3.5rem" : "7rem 2rem 4rem",
      textAlign:"center", position:"relative", overflow:"hidden",
    }}>
      <div style={{
        position:"absolute", inset:0, zIndex:0,
        background:`radial-gradient(ellipse 80% 55% at 50% 0%,rgba(232,197,184,.4) 0%,transparent 60%),
          radial-gradient(ellipse 55% 40% at 15% 100%,rgba(184,201,176,.25) 0%,transparent 55%),
          radial-gradient(ellipse 50% 50% at 85% 80%,rgba(201,169,110,.15) 0%,transparent 55%),
          ${C.cream}`,
      }} />

      {/* Floating orbs – desktop only */}
      {!mob && (
        <>
          <div style={{ position:"absolute", top:"12%", right:"5%", width:160, height:160, borderRadius:"50%", overflow:"hidden", border:"3px solid rgba(232,197,184,.5)", boxShadow:"0 16px 50px rgba(200,120,96,.15)", animation:"floatY 7s ease-in-out infinite", zIndex:1, opacity:.85 }}>
            <img src={IMGS.tyger1} alt="Onset Homes cushion" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          </div>
          <div style={{ position:"absolute", bottom:"20%", left:"4%", width:110, height:110, borderRadius:"50%", overflow:"hidden", border:"2px solid rgba(184,201,176,.5)", boxShadow:"0 10px 36px rgba(184,201,176,.2)", animation:"floatY 9s ease-in-out .8s infinite", zIndex:1, opacity:.75 }}>
            <img src={IMGS.tyger2} alt="Onset Homes cushion" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          </div>
          <div style={{ position:"absolute", top:"52%", left:"2%", width:72, height:72, borderRadius:"50%", overflow:"hidden", border:"2px solid rgba(201,169,110,.4)", animation:"floatY 11s ease-in-out 1.5s infinite", zIndex:1, opacity:.55 }}>
            <img src={IMGS.tyger3} alt="Onset Homes cushion" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          </div>
        </>
      )}

      <div style={{ position:"relative", zIndex:2, maxWidth:820, margin:"0 auto", width:"100%" }}>
        <div style={{ animation:"fadeUp .8s ease .15s both" }}>
          <Eyebrow>A personalised proposal for Onset Homes</Eyebrow>
        </div>
        <h1 className="serif" style={{
          fontSize: mob ? "clamp(2.2rem,9vw,3rem)" : "clamp(2.8rem,7vw,5.6rem)",
          fontWeight:300, lineHeight:1.08, letterSpacing:"-0.02em", color:C.charcoal,
          marginBottom:"1.25rem", animation:"fadeUp .9s ease .35s both",
        }}>
          Neha, let&apos;s{" "}
          <em style={{ fontStyle:"italic", color:C.terra }}>reignite</em>
          <br />Onset Homes online.
        </h1>
        <p style={{
          fontSize: mob ? "0.93rem" : "1.05rem", fontWeight:300, color:C.mid,
          maxWidth:560, margin:"0 auto 2.5rem", lineHeight:1.8,
          animation:"fadeUp .9s ease .55s both",
        }}>
          Your handcrafted textiles deserve an ecommerce experience as beautiful as they are.
          A three-tier relaunch plan built specifically for Onset Homes &mdash; focused on
          conversion rate, average order value, and real revenue.
        </p>
        <div style={{
          display:"flex", gap:"0.75rem", justifyContent:"center",
          flexWrap:"wrap", animation:"fadeUp .9s ease .75s both",
        }}>
          <BtnPrimary href="#packages"><Package size={13} /> See the Packages</BtnPrimary>
          <BtnOutline href="#challenge"><ArrowDown size={13} /> Read the Story</BtnOutline>
        </div>
      </div>

      <div style={{ position:"absolute", bottom:"2rem", left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:"0.35rem", opacity:.35, animation:"fadeIn 1s ease 1.5s both", zIndex:2 }}>
        <span style={{ fontSize:"0.55rem", letterSpacing:"0.2em", textTransform:"uppercase", color:C.mid }}>Scroll</span>
        <div style={{ width:1, height:32, background:`linear-gradient(to bottom,${C.terra},transparent)` }} />
      </div>
    </section>
  );
}

// ─── REVENUE STRIP ────────────────────────────────────────────────────────────
function RevenueStrip() {
  const [ref, vis] = useInView(0.15);
  const mob = useMobile();
  const stats = [
    { icon:<TrendingUp size={18}/>, value:"10\u201330%", label:"Typical AOV lift from upsells & cross-sells" },
    { icon:<Gauge size={18}/>,      value:"1 sec",       label:"Faster load time, significant conversion gain" },
    { icon:<Smartphone size={18}/>, value:">60%",        label:"Ecommerce traffic now from mobile" },
    { icon:<Target size={18}/>,     value:"~1\u20132x",  label:"ROI on optimisation vs. ad spend" },
    { icon:<BarChart2 size={18}/>,  value:"5 days",      label:"Implementation to launch-ready store" },
  ];
  return (
    <div ref={ref} style={{
      background:C.white, borderTop:`1px solid ${C.border}`,
      borderBottom:`1px solid ${C.border}`,
      padding: mob ? "2.5rem 1.25rem" : "3.5rem 2rem",
    }}>
      <p style={{ textAlign:"center", fontSize:"0.6rem", letterSpacing:"0.22em", textTransform:"uppercase", color:C.light, marginBottom:"2rem" }}>
        Why this relaunch pays for itself
      </p>
      <div style={{
        display:"grid",
        gridTemplateColumns: mob ? "repeat(2,1fr)" : "repeat(5,1fr)",
        gap:"1px", background:C.border, borderRadius:16, overflow:"hidden",
        maxWidth:1100, margin:"0 auto",
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background:C.white, padding: mob ? "1.4rem 0.9rem" : "1.75rem 1.25rem", textAlign:"center", ...fadeStyle(vis, i * .1) }}>
            <div style={{ width:40, height:40, borderRadius:"50%", background:"rgba(200,120,96,.08)", border:"1px solid rgba(200,120,96,.15)", display:"flex", alignItems:"center", justifyContent:"center", color:C.terra, margin:"0 auto 0.8rem" }}>
              {s.icon}
            </div>
            <div className="serif" style={{ fontSize: mob ? "1.5rem" : "1.7rem", fontWeight:600, color:C.charcoal, lineHeight:1, marginBottom:"0.3rem" }}>
              {s.value}
            </div>
            <div style={{ fontSize:"0.72rem", color:C.mid, fontWeight:300, lineHeight:1.5 }}>
              {s.label}
            </div>
          </div>
        ))}
        {/* 6th cell on mobile to complete the grid */}
        {mob && (
          <div style={{ background:C.white, padding:"1.4rem 0.9rem", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <p style={{ fontSize:"0.7rem", color:C.light, fontWeight:300, lineHeight:1.5, textAlign:"center" }}>
              Built around your growth, not just a launch.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CHALLENGE ────────────────────────────────────────────────────────────────
function Challenge() {
  const [ref, vis] = useInView();
  const mob = useMobile();

  const objectives = [
    { icon:<Zap size={15}/>,        title:"Fast, Stable Ecommerce Relaunch",           desc:"A clean, trustworthy shopping experience supporting both existing and new marketing efforts." },
    { icon:<TrendingUp size={15}/>, title:"Higher Conversion Rate & AOV",               desc:"Product page, collection, and cart-level optimisations \u2014 including upsells and cross-sells." },
    { icon:<BarChart2 size={15}/>,  title:"Accurate Tracking Foundation",               desc:"Real data driving marketing and business decisions instead of guesswork." },
    { icon:<RefreshCw size={15}/>,  title:"Iterative Post-Deployment Support",          desc:"Support calibrated to your chosen package so early data translates into continuous improvement." },
  ];

  const issues = [
    { icon:<Gauge size={16}/>,        title:"Page Speed & Core Web Vitals",   desc:"Heavy images and unused scripts slowing load times \u2014 killing mobile conversions." },
    { icon:<Layout size={16}/>,       title:"Layout Inconsistency",           desc:"Slider misalignment, header gaps, irregular spacing across homepage sections." },
    { icon:<Smartphone size={16}/>,   title:"Mobile Purchase Friction",       desc:"Custom Size button issues, popup interruptions, tap targets too small for checkout." },
    { icon:<Crosshair size={16}/>,    title:"Tracking Gaps",                  desc:"GA4 and Meta Pixel missing key ecommerce events \u2014 ad spend decisions made blind." },
    { icon:<ShoppingCart size={16}/>, title:"No Upsells or Cross-Sells",      desc:"Every transaction is single-product \u2014 leaving significant AOV on the table." },
  ];

  return (
    <section id="challenge" style={{ padding: mob ? "4rem 1.25rem" : "7rem 2rem", maxWidth:1100, margin:"0 auto" }}>
      <div ref={ref} style={fadeStyle(vis)}>
        <Eyebrow>The Opportunity</Eyebrow>
        <SectionTitle>
          Your products deserve an online<br />experience as <Em>beautiful</Em> as they are.
        </SectionTitle>
      </div>

      {/* Lifestyle banner */}
      <div style={{ borderRadius: mob ? 14 : 22, overflow:"hidden", marginBottom: mob ? "2.5rem" : "4rem", height: mob ? 190 : 320, position:"relative", ...fadeStyle(vis, .2) }}>
        <img src={IMGS.blogHero} alt="Onset Homes lifestyle" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,rgba(44,36,32,.55) 0%,transparent 65%)" }} />
        <div style={{ position:"absolute", bottom: mob ? "1rem" : "2rem", left: mob ? "1.1rem" : "2.5rem" }}>
          <p style={{ fontSize:"0.58rem", letterSpacing:"0.16em", textTransform:"uppercase", color:"rgba(255,255,255,.7)", marginBottom:"0.3rem" }}>
            The store behind the craft
          </p>
          <p className="serif" style={{ fontSize: mob ? "1.15rem" : "1.55rem", fontWeight:300, color:"#fff", lineHeight:1.2 }}>
            Onset Homes &mdash; handcrafted<br />textiles, made in India.
          </p>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: mob ? "2.5rem" : "4rem", alignItems:"start" }}>
        {/* Objectives */}
        <div>
          <p style={{ fontSize:"0.93rem", color:C.mid, fontWeight:300, marginBottom:"1.4rem", lineHeight:1.8 }}>
            This relaunch is built around four clear objectives &mdash; every line of work traces back to one of them.
          </p>
          {objectives.map((o, i) => (
            <div key={i} style={{ display:"flex", gap:"0.85rem", padding:"0.95rem 0", borderBottom:`1px solid ${C.border}`, alignItems:"flex-start", ...fadeStyle(vis, .3 + i * .1, "left") }}>
              <div style={{ width:34, height:34, borderRadius:"50%", background:"rgba(200,120,96,.08)", border:"1px solid rgba(200,120,96,.18)", display:"flex", alignItems:"center", justifyContent:"center", color:C.terra, flexShrink:0, marginTop:2 }}>
                {o.icon}
              </div>
              <div>
                <strong style={{ display:"block", fontSize:"0.86rem", fontWeight:500, color:C.charcoal, marginBottom:"0.12rem" }}>{o.title}</strong>
                <span style={{ fontSize:"0.79rem", color:C.mid, fontWeight:300 }}>{o.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Issues */}
        <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
          {issues.map((iss, i) => (
            <div key={i} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"0.9rem 1rem", display:"flex", gap:"0.8rem", alignItems:"center", ...fadeStyle(vis, .2 + i * .1, "right") }}>
              <div style={{ width:36, height:36, borderRadius:9, background:C.cream, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", color:C.terra, flexShrink:0 }}>
                {iss.icon}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <strong style={{ display:"block", fontSize:"0.81rem", fontWeight:500, color:C.charcoal, marginBottom:"0.1rem" }}>{iss.title}</strong>
                <span style={{ fontSize:"0.75rem", color:C.mid, fontWeight:300 }}>{iss.desc}</span>
              </div>
              <div style={{ flexShrink:0, display:"flex", alignItems:"center", gap:"0.22rem", fontSize:"0.6rem", fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:C.green, background:"rgba(90,122,80,.08)", border:"1px solid rgba(90,122,80,.18)", padding:"0.22rem 0.5rem", borderRadius:100, whiteSpace:"nowrap" }}>
                <CheckCircle2 size={9} /> Fixed
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ROHCODES INTRO ───────────────────────────────────────────────────────────
function RohcodesIntro() {
  const [ref, vis] = useInView();
  const mob = useMobile();
  const contacts = [
    { icon:<Globe size={12}/>,  label:"rohcodes.com",           href:"https://rohcodes.com" },
    { icon:<Mail size={12}/>,   label:"rohitparakh4@gmail.com", href:"mailto:rohitparakh4@gmail.com" },
    { icon:<Phone size={12}/>,  label:"+91 98409 89414",        href:"tel:+919840989414" },
  ];
  return (
    <section style={{ background:C.white, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding: mob ? "4rem 1.25rem" : "7rem 2rem" }}>
      <div ref={ref} style={{ maxWidth:900, margin:"0 auto", display:"grid", gridTemplateColumns: mob ? "1fr" : "180px 1fr", gap: mob ? "2rem" : "4rem", alignItems:"center" }}>

        {/* Avatar */}
        <div style={{ display:"flex", justifyContent: mob ? "center" : "flex-start", ...fadeStyle(vis, 0, "left") }}>
          <div style={{ position:"relative", width:130, height:130, flexShrink:0 }}>
            <div style={{ width:130, height:130, borderRadius:"50%", background:`linear-gradient(135deg,${C.rose},${C.goldLight})`, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", zIndex:1 }}>
              <span className="serif" style={{ fontSize:"2.8rem", fontWeight:300, color:C.deep }}>R</span>
            </div>
            <div style={{ position:"absolute", inset:-4, borderRadius:"50%", background:`conic-gradient(from 0deg,${C.terra},${C.gold},${C.sage},${C.terra})`, zIndex:0, animation:"spinRing 8s linear infinite" }} />
            <div style={{ position:"absolute", inset:2, borderRadius:"50%", background:C.white, zIndex:0 }} />
          </div>
        </div>

        {/* Bio */}
        <div style={{ textAlign: mob ? "center" : "left", ...fadeStyle(vis, .2, "right") }}>
          <Eyebrow>Who&apos;s proposing this</Eyebrow>
          <SectionTitle style={{ marginBottom:"0.7rem" }}>Rohit Parakh<br />at Rohcodes</SectionTitle>
          <p style={{ fontSize:"0.92rem", color:C.mid, fontWeight:300, lineHeight:1.85, marginBottom:"0.85rem" }}>
            I&apos;m a Shopify and ecommerce optimisation specialist focused on one thing: turning well-crafted stores
            into well-converting ones. Every project I take on is built around measurable outcomes &mdash; conversion
            rate, average order value, and real revenue &mdash; not just aesthetic changes.
          </p>
          <p style={{ fontSize:"0.92rem", color:C.mid, fontWeight:300, lineHeight:1.85, marginBottom:"1.5rem" }}>
            I&apos;ve put this proposal together specifically for Onset Homes because your products are exceptional and
            your ecommerce experience should match. Every item below traces directly to a gap or opportunity I&apos;ve
            identified on onsethomes.com.
          </p>
          <div style={{ display:"flex", gap:"0.55rem", flexWrap:"wrap", justifyContent: mob ? "center" : "flex-start" }}>
            {contacts.map((c, i) => <ContactPill key={i} {...c} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PACKAGES ─────────────────────────────────────────────────────────────────
const PKG_DATA = [
  {
    name:"Starter", price:"\u20b940,000",
    support:"2 weeks post-deployment support",
    tagline:"Technical uplift & relaunch essentials",
    bestFor:"Brands wanting a clean, fast, reliable store relaunch.",
    features:[
      "Image optimisation & compression across banners and products",
      "Lazy loading & improved asset loading for Core Web Vitals",
      "Homepage, header, nav & footer visual clean-up",
      "Custom Size button fix & popup trigger corrections",
      "Mobile tap targets & product image scaling",
      "GA4 + Meta Pixel integration & event validation",
      "14-day bug fix & tweak support (4\u20135 hours cap)",
    ],
    recommended:false,
  },
  {
    name:"Growth", price:"\u20b970,000",
    support:"2 weeks CRO-focused post-deployment support",
    tagline:"Conversion & AOV uplift focus",
    bestFor:"Brands aiming for clear, near-term uplift in conversion rate and AOV.",
    features:[
      "Everything in Starter",
      "Sticky Add-to-Cart on product pages",
      "Product info hierarchy rework & mobile CTA optimisation",
      "Frequently Bought Together & cross-sell modules",
      "Upsell recommendations near key purchase actions",
      "Collection bestseller logic, badges & discovery paths",
      "Exit-intent (desktop) & scroll/time-based (mobile) popups",
      "Enhanced GA4 & Meta event parameters",
      "14-day support: upsell iteration + popup tweaks + analytics review (8\u201310 hrs)",
    ],
    recommended:true,
  },
  {
    name:"Scale", price:"\u20b91,05,000",
    support:"30 days of structured optimisation & support",
    tagline:"30-day optimisation sprint",
    bestFor:"Brands treating ecommerce as a key channel with appetite for data-driven optimisation.",
    features:[
      "Everything in Growth",
      "Hotjar / Microsoft Clarity heatmap & session recording setup",
      "GA4 conversion goals & funnel monitoring (product view \u2192 purchase)",
      "1\u20132 A/B or split tests (product pages, upsells, popups)",
      "Weekly experiment reviews & incremental changes",
      "Weekly performance summaries + end-of-month CRO report",
      "30-day priority bug fixes, layout & upsell tweaks (18\u201320 hours)",
    ],
    recommended:false,
  },
];

function Packages() {
  const [ref, vis] = useInView(0.08);
  const mob = useMobile();
  return (
    <section id="packages" style={{ padding: mob ? "4rem 1.25rem" : "7rem 2rem", maxWidth:1200, margin:"0 auto" }}>
      <div ref={ref} style={{ textAlign:"center", marginBottom: mob ? "2.5rem" : "3.5rem", ...fadeStyle(vis) }}>
        <Eyebrow>Choose Your Path</Eyebrow>
        <SectionTitle center>Three packages.<br /><Em>One goal: growth.</Em></SectionTitle>
        <p style={{ fontSize:"0.92rem", color:C.mid, fontWeight:300, maxWidth:520, margin:"0.5rem auto 0", lineHeight:1.8 }}>
          Structured to suit different levels of investment and growth ambition. Every package builds on the same technical foundation.
        </p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns: mob ? "1fr" : "repeat(3,1fr)", gap: mob ? "1.1rem" : "1.5rem", alignItems:"start" }}>
        {PKG_DATA.map((pkg, i) => <PkgCard key={i} pkg={pkg} delay={i * .1} vis={vis} mob={mob} />)}
      </div>
    </section>
  );
}

function PkgCard({ pkg, delay, vis, mob }) {
  const [hov, setHov] = useState(false);
  const isRec = pkg.recommended;
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: mob ? 16 : 22, overflow:"hidden",
        background: isRec ? C.white : C.cream,
        border: isRec ? `1.5px solid ${C.terra}` : `1px solid ${C.border}`,
        boxShadow: isRec ? `0 0 0 1px ${C.terra}, 0 14px 50px rgba(200,120,96,.15)` : hov ? "0 14px 50px rgba(44,36,32,.1)" : "none",
        transform: !mob && hov ? "translateY(-7px)" : "none",
        transition:"all .45s cubic-bezier(.23,1,.32,1)",
        position:"relative",
        marginTop: !mob && isRec ? "-10px" : 0,
        opacity: vis ? 1 : 0,
        transitionDelay:`${delay}s`,
      }}>
      {isRec && (
        <div style={{ position:"absolute", top:-1, left:"50%", transform:"translateX(-50%)", background:C.terra, color:"#fff", fontSize:"0.56rem", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", padding:"0.26rem 0.9rem", borderRadius:"0 0 9px 9px", zIndex:2, whiteSpace:"nowrap" }}>
          Recommended
        </div>
      )}
      <div style={{ padding: mob ? (isRec ? "2rem 1.15rem 1.15rem" : "1.4rem 1.15rem") : (isRec ? "2.6rem 1.75rem 1.4rem" : "2rem 1.75rem 1.4rem"), borderBottom:`1px solid ${C.border}`, background: isRec ? "linear-gradient(135deg,rgba(200,120,96,.04),rgba(201,169,110,.04))" : "transparent" }}>
        <p className="serif" style={{ fontSize: mob ? "1.5rem" : "1.65rem", fontWeight:300, color:C.charcoal, marginBottom:"0.18rem" }}>{pkg.name}</p>
        <p style={{ fontSize:"0.75rem", color:C.mid, fontWeight:300, marginBottom:"1rem" }}>{pkg.tagline}</p>
        <span className="serif" style={{ fontSize: mob ? "1.9rem" : "2.1rem", fontWeight:600, color: isRec ? C.terra : C.charcoal }}>{pkg.price}</span>
        <p style={{ fontSize:"0.67rem", color:C.light, marginTop:"0.2rem", letterSpacing:"0.03em" }}>{pkg.support}</p>
      </div>
      <div style={{ padding: mob ? "1.15rem" : "1.4rem 1.75rem 1.75rem" }}>
        <p style={{ fontSize:"0.62rem", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color:C.light, marginBottom:"0.3rem" }}>Best for</p>
        <p style={{ fontSize:"0.8rem", color:C.charcoal, fontWeight:300, marginBottom:"1.1rem", paddingBottom:"1.1rem", borderBottom:`1px solid ${C.border}` }}>{pkg.bestFor}</p>
        <ul style={{ listStyle:"none", marginBottom:"1.5rem" }}>
          {pkg.features.map((f, i) => (
            <li key={i} style={{ display:"flex", gap:"0.5rem", padding:"0.35rem 0", fontSize:"0.79rem", color:C.mid, fontWeight:300, alignItems:"flex-start" }}>
              <ArrowRight size={11} color={C.terra} style={{ flexShrink:0, marginTop:4 }} />
              {f}
            </li>
          ))}
        </ul>
        <PkgCTA href="#choose" featured={isRec}>Select {pkg.name}</PkgCTA>
      </div>
    </div>
  );
}

function PkgCTA({ children, href, featured }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display:"block", textAlign:"center", padding:"0.82rem", borderRadius:100, fontSize:"0.72rem", fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", transition:"all .3s ease", background: featured ? (hov ? C.deep : C.terra) : "transparent", color: featured ? "#fff" : (hov ? C.terra : C.charcoal), border: featured ? "none" : `1px solid ${hov ? C.terra : C.border}`, boxShadow: featured ? "0 5px 20px rgba(200,120,96,.28)" : "none" }}>
      {children}
    </a>
  );
}

// ─── SCOPE DETAIL ─────────────────────────────────────────────────────────────
const TABS = ["Common to All", "Starter", "Growth", "Scale"];

const COMMON_PILLARS = [
  {
    icon:<Gauge size={15}/>, name:"Performance Optimisation",
    items:[
      "Image optimisation and compression across banners, product images, and key content sections to reduce page weight.",
      "Lazy loading where appropriate to defer off-screen assets and reduce initial load time.",
      "Reduction of unused CSS and JavaScript and improved asset loading strategy to support better Core Web Vitals.",
    ],
    result:"Faster load times are strongly correlated with higher conversion rates and lower bounce rates, particularly on mobile. Even a one-second improvement in load time can significantly improve conversions in ecommerce contexts.",
  },
  {
    icon:<Layout size={15}/>, name:"UI & Layout Consistency",
    items:[
      "Homepage slider alignment and spacing corrections to avoid awkward cropping or layout shifts.",
      "Alignment and spacing corrections in the \u201cFeatured In\u201d section.",
      "Header scroll behaviour fixes to remove unwanted transparent spacing and ensure a consistent navigation experience.",
      "Standardised spacing and margins across homepage sections to create a coherent visual rhythm.",
    ],
    result:"A clean, predictable interface builds trust and reduces friction, making it easier for visitors to browse and eventually purchase.",
  },
  {
    icon:<BarChart2 size={15}/>, name:"Tracking & Analytics Foundation",
    items:[
      "Google Analytics 4 (GA4) integration on the live theme.",
      "Meta Pixel integration for performance marketing and remarketing.",
      "Tracking of key conversion events: page views, product views, add-to-cart, initiate checkout (where applicable), purchase.",
    ],
    result:"With robust tracking in place, it becomes possible to identify which products, pages, and traffic sources contribute most to revenue \u2014 and which parts of the funnel need optimisation.",
  },
  {
    icon:<Smartphone size={15}/>, name:"Functional & Mobile Experience",
    items:[
      "Fixing the Custom Size button behaviour so that it is intuitive and non-blocking for the purchase journey.",
      "Correcting popup trigger logic so that popups support, rather than interrupt, the user journey.",
      "Ensuring that forms load correctly and submit reliably.",
      "Improving button sizing and spacing for mobile tap targets.",
      "Ensuring product images scale correctly and remain clear across mobile devices.",
    ],
    result:"Removing friction points and mobile usability issues directly supports higher conversion rates, as a large share of ecommerce traffic now comes from mobile devices.",
  },
];

const GROWTH_PILLARS = [
  {
    icon:<ShoppingCart size={15}/>, name:"Product Page Conversion Optimisation",
    items:[
      "Implementation of sticky Add-to-Cart on supported devices to keep the purchase action constantly visible.",
      "Reworking product information hierarchy to surface the details that matter most to buyers (benefits, specifications, delivery, returns) in a clear, scannable order.",
      "Optimising mobile purchase interactions so that key call-to-action areas remain easily accessible.",
      "Clarifying product detail sections to remove ambiguity and support quicker decisions.",
    ],
    result:"Well-structured product pages typically see a meaningful uplift in add-to-cart rate and completed purchases compared to cluttered or confusing layouts, particularly on mobile.",
  },
  {
    icon:<Link2 size={15}/>, name:"Upsell & Cross-Sell Implementation",
    items:[
      "\u201cFrequently Bought Together\u201d or similar complementary product modules on product pages.",
      "Cross-sell blocks for related or bundle-suitable products on product and possibly cart pages.",
      "Upsell recommendations for premium or higher-value alternatives aligned with the shopper\u2019s current interest.",
      "Strategic placement of recommendations near key purchase actions (around Add-to-Cart and in the cart experience).",
    ],
    result:"Upsells and cross-sells are proven levers for increasing AOV, with typical improvements in the 10\u201330% range when implemented thoughtfully on ecommerce stores.",
  },
  {
    icon:<Layers size={15}/>, name:"Collection Page Optimisation",
    items:[
      "Setup of bestseller logic using tags, sales indicators, or manual curation.",
      "More consistent and informative product cards in collections (e.g., badges for bestseller or new arrivals).",
      "Improved filtering, sorting, and discovery patterns where the current theme allows.",
      "Highlighting of related collections and complementary product groups.",
    ],
    result:"Better collection discovery paths help more visitors find products relevant to them, supporting higher session value and increased likelihood of multi-product purchases.",
  },
  {
    icon:<Bell size={15}/>, name:"Marketing & Engagement Features",
    items:[
      "Exit-intent popups on desktop to capture abandoning users or present last-minute offers.",
      "Time or scroll-based popups on mobile tuned to avoid immediate annoyance.",
      "Popups to drive email capture and highlight promotional offers, bundles, or key bestsellers.",
    ],
    result:"Well-timed, relevant popups can increase list growth and recover abandoning sessions without significantly harming user experience when configured correctly.",
  },
  {
    icon:<LineChart size={15}/>, name:"Enhanced Tracking & Analytics",
    items:[
      "Validation and refinement of event configurations so that key ecommerce actions are consistently captured.",
      "Where feasible, passing additional parameters (e.g., product category, content groups) to support more granular analysis in GA4 and Meta.",
    ],
    result:null,
  },
];

const SCALE_PILLARS = [
  {
    icon:<Eye size={15}/>, name:"Advanced Tracking & Behaviour Insights",
    items:[
      "Setup of a heatmap and session recording tool such as Hotjar or Microsoft Clarity (tool subscription, if any, to be handled by the client).",
      "Definition of key funnels (product view \u2192 add-to-cart \u2192 checkout \u2192 purchase) for ongoing monitoring.",
      "Configuration and verification of GA4 goals or conversions specifically targeted to ecommerce performance.",
    ],
    result:"Qualitative and quantitative behavioural data surfaces hidden friction points and helps prioritise changes that have the strongest impact on results.",
  },
  {
    icon:<FlaskConical size={15}/>, name:"Experimentation & Iteration",
    items:[
      "Design and implementation of 1\u20132 simple A/B or split tests, aligned with traffic levels, focusing on: product page layouts (e.g., benefit blocks, image order, sticky ATC variations); upsell and cross-sell placements or copy; popup timing and offer framing.",
      "Weekly review of experiment performance and incremental changes to fine-tune winning variants.",
    ],
    result:"Experimentation turns opinions into data-backed decisions, making it clearer which changes materially improve revenue.",
  },
  {
    icon:<FileText size={15}/>, name:"Strategic Reporting",
    items:[
      "Short weekly summaries outlining the key changes made, insights from tracking and heatmaps, and early performance trends.",
      "A concise end-of-month report highlighting: the most impactful improvements made during the sprint; recommended next steps for further CRO, marketing, or development.",
    ],
    result:null,
  },
];

function Accordion({ pillar }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border:`1px solid ${C.border}`, borderRadius:12, marginBottom:"0.6rem", overflow:"hidden" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width:"100%", background: open ? C.sand : C.cream, padding:"1rem 1.15rem", display:"flex", justifyContent:"space-between", alignItems:"center", border:"none", cursor:"pointer", textAlign:"left", fontFamily:"'DM Sans',sans-serif", transition:"background .3s ease" }}>
        <span style={{ display:"flex", alignItems:"center", gap:"0.55rem", fontSize:"0.84rem", fontWeight:500, color:C.charcoal }}>
          <span style={{ color:C.terra }}>{pillar.icon}</span>
          {pillar.name}
        </span>
        {open ? <ChevronUp size={14} color={C.mid} /> : <ChevronDown size={14} color={C.mid} />}
      </button>
      {open && (
        <div style={{ padding:"0 1.15rem 1.15rem", background:C.white }}>
          <ul style={{ listStyle:"none", marginTop:"0.65rem" }}>
            {pillar.items.map((item, i) => (
              <li key={i} style={{ display:"flex", gap:"0.55rem", padding:"0.32rem 0", fontSize:"0.81rem", color:C.mid, fontWeight:300, lineHeight:1.65, alignItems:"flex-start" }}>
                <ArrowRight size={10} color={C.terra} style={{ flexShrink:0, marginTop:5 }} />
                {item}
              </li>
            ))}
          </ul>
          {pillar.result && (
            <div style={{ marginTop:"0.85rem", padding:"0.75rem 0.95rem", background:"rgba(200,120,96,.05)", borderLeft:`2px solid ${C.terra}`, borderRadius:"0 8px 8px 0" }}>
              <p style={{ fontSize:"0.57rem", fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:C.terra, marginBottom:"0.22rem" }}>Result Focus</p>
              <p style={{ fontSize:"0.79rem", color:C.mid, fontWeight:300, lineHeight:1.65 }}>{pillar.result}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SupportBox({ support }) {
  return (
    <div style={{ background:C.cream, border:`1px solid ${C.border}`, borderRadius:13, padding:"1.15rem", marginTop:"1.15rem" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"0.45rem", marginBottom:"0.7rem" }}>
        <Calendar size={13} color={C.terra} />
        <h4 className="serif" style={{ fontSize:"1.1rem", fontWeight:400, color:C.charcoal }}>Post-Deployment Support</h4>
      </div>
      <div style={{ fontSize:"0.8rem", color:C.mid, fontWeight:300, lineHeight:1.75 }}>
        <p><strong style={{ color:C.charcoal, fontWeight:500 }}>Duration:</strong> {support.duration}</p>
        <p style={{ marginTop:"0.35rem" }}><strong style={{ color:C.charcoal, fontWeight:500 }}>Scope:</strong> {support.scope}</p>
        <p style={{ marginTop:"0.35rem" }}><strong style={{ color:C.charcoal, fontWeight:500 }}>Time cap:</strong> {support.cap}</p>
      </div>
    </div>
  );
}

function RoiBox({ text }) {
  return (
    <div style={{ background:"linear-gradient(135deg,rgba(200,120,96,.05),rgba(201,169,110,.05))", border:"1px solid rgba(200,120,96,.15)", borderRadius:13, padding:"1.15rem", marginTop:"0.6rem" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", marginBottom:"0.4rem" }}>
        <Star size={12} color={C.gold} fill={C.gold} />
        <p style={{ fontSize:"0.58rem", fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:C.gold }}>ROI Angle</p>
      </div>
      <p style={{ fontSize:"0.8rem", color:C.mid, fontWeight:300, lineHeight:1.75 }}>{text}</p>
    </div>
  );
}

function ScopeDetail() {
  const [active, setActive] = useState(0);
  const [ref, vis] = useInView();
  const mob = useMobile();
  return (
    <section id="scope" style={{ padding: mob ? "4rem 1.25rem" : "7rem 2rem", background:C.white, borderTop:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:960, margin:"0 auto" }}>
        <div ref={ref} style={{ textAlign:"center", marginBottom:"2rem", ...fadeStyle(vis) }}>
          <Eyebrow>Full Scope Detail</Eyebrow>
          <SectionTitle center>Every deliverable,<br /><Em>nothing left out.</Em></SectionTitle>
        </div>

        {/* Tab bar */}
        <div style={{ display:"flex", gap:"0.2rem", borderBottom:`1px solid ${C.border}`, marginBottom:"2rem", overflowX:"auto", overflowY:"hidden", WebkitOverflowScrolling:"touch", scrollbarWidth:"none" }}>
          {TABS.map((t, i) => (
            <button key={i} onClick={() => setActive(i)} style={{ fontFamily:"'DM Sans',sans-serif", fontSize: mob ? "0.68rem" : "0.73rem", fontWeight:500, letterSpacing:"0.06em", textTransform:"uppercase", color: active === i ? C.terra : C.light, padding: mob ? "0.6rem 0.85rem" : "0.7rem 1.1rem", border:"none", background:"none", borderBottom: active === i ? `2px solid ${C.terra}` : "2px solid transparent", marginBottom:"-1px", cursor:"pointer", whiteSpace:"nowrap", transition:"all .3s ease" }}>
              {t}
            </button>
          ))}
        </div>

        {active === 0 && (
          <div>
            <p style={{ fontSize:"0.86rem", color:C.mid, fontWeight:300, marginBottom:"1.6rem", lineHeight:1.8, maxWidth:700 }}>
              All three packages are built on the same core pillars. These are the non-negotiable foundations every good ecommerce store needs.
            </p>
            {COMMON_PILLARS.map((p, i) => <Accordion key={i} pillar={p} />)}
          </div>
        )}

        {active === 1 && (
          <div>
            <p style={{ fontSize:"0.86rem", color:C.mid, fontWeight:300, marginBottom:"1.6rem", lineHeight:1.8, maxWidth:700 }}>
              Provide a fast, stable, and clean ecommerce experience so Onset Homes can restart online sales on a solid technical and UX foundation. Includes everything in Common Scope plus:
            </p>
            <Accordion pillar={{ icon:<Package size={15}/>, name:"Starter-Specific Scope", result:null, items:[
              "Focused performance optimisation on the home page, core collection pages, and key product templates.",
              "Visual and structural clean-up of critical templates (homepage, header, navigation, footer) without deep CRO restructuring.",
              "Basic validation of GA4 and Meta Pixel events, ensuring essential ecommerce interactions are captured.",
            ]}} />
            <SupportBox support={{ duration:"14 days from deployment of the updated theme.", scope:"Bug fixes related to implemented changes. Minor visual and usability tweaks based on early user feedback. High-level validation that tracking is reporting correctly in GA4 and Meta Pixel.", cap:"Up to 4\u20135 hours of support in this period to preserve focus and predictability." }} />
            <RoiBox text="The Starter package is designed as a quick, lower-risk way to relaunch ecommerce with improved performance, cleanliness, and tracking. It aims to reduce wasted ad spend caused by technical issues and drop-offs on slow or confusing pages, paving the way for further growth-focused work." />
          </div>
        )}

        {active === 2 && (
          <div>
            <p style={{ fontSize:"0.86rem", color:C.mid, fontWeight:300, marginBottom:"1.6rem", lineHeight:1.8, maxWidth:700 }}>
              Deliver a clear improvement in conversion rate and AOV by restructuring product and collection experiences, implementing targeted upsells and cross-sells, and enhancing engagement and data quality. Includes everything in Common Scope plus:
            </p>
            {GROWTH_PILLARS.map((p, i) => <Accordion key={i} pillar={p} />)}
            <SupportBox support={{ duration:"14 days from deployment.", scope:"Everything in Starter support. One iteration on upsell and cross-sell modules (e.g., number of products shown, placement adjustments). One round of tweaks to popup timing, targeting, or messaging based on initial data. A light review of early analytics to identify obvious quick wins or necessary adjustments.", cap:"Up to 8\u201310 hours of support and optimisation within the support window." }} />
            <RoiBox text="The Growth package seeks to increase the percentage of visitors who add items to cart and complete checkout; lift average order value by encouraging complementary and higher-value purchases; and build a better data layer for more efficient future marketing. Even modest improvements in conversion and AOV can multiply monthly ecommerce revenue over time, making a one-time optimisation project in this range economically attractive compared with ongoing ad spend landing on an under-optimised store." />
          </div>
        )}

        {active === 3 && (
          <div>
            <p style={{ fontSize:"0.86rem", color:C.mid, fontWeight:300, marginBottom:"1.6rem", lineHeight:1.8, maxWidth:700 }}>
              Treat the ecommerce relaunch as the start of a focused 30-day optimisation sprint, using real visitor data to test, refine, and lock in improvements to conversion rate and AOV. Includes everything in Growth Scope plus:
            </p>
            {SCALE_PILLARS.map((p, i) => <Accordion key={i} pillar={p} />)}
            <SupportBox support={{ duration:"30 days of active optimisation and support after the initial deployment.", scope:"Priority bug fixes related to the new implementation. Ongoing tweaks to layouts, upsell blocks, and popups based on live data. Test implementation and reading of results for the agreed experiments.", cap:"Approximately 18\u201320 hours of optimisation and support across the 30-day period, balanced over weekly cycles." }} />
            <RoiBox text="The Scale package is designed for brands that want to treat ecommerce as a meaningful, data-driven revenue channel. Rather than a one-time launch, it establishes a feedback loop in which user behaviour directly informs continuous improvement, increasing the chances of achieving sustained lifts in conversion and AOV over the medium term." />
          </div>
        )}
      </div>
    </section>
  );
}

// ─── TIMELINE ─────────────────────────────────────────────────────────────────
const TL_ITEMS = [
  { days:"Days 1\u20132", title:"Performance & Visual Foundation",       icon:<Gauge size={13}/>,       desc:"Performance optimisation across key templates. UI and layout fixes across homepage, header, navigation, and spacing \u2014 establishing the core visual rhythm." },
  { days:"Day 3",         title:"Product Page & Upsell Implementation",  icon:<ShoppingCart size={13}/>, desc:"Product page conversion optimisation (sticky ATC, info hierarchy, mobile CTA). Initial upsell and cross-sell modules implemented and tested." },
  { days:"Day 4",         title:"Collection Pages & Tracking Setup",     icon:<BarChart2 size={13}/>,    desc:"Collection page optimisation \u2014 bestseller logic, product card improvements, and discovery patterns. Full tracking setup with event validation in GA4 and Meta Pixel." },
  { days:"Day 5",         title:"Popups, Mobile Polish & Deployment",    icon:<Bell size={13}/>,         desc:"Marketing and engagement popups implemented. Mobile refinements and all functional bug fixes applied. Quality assurance, final review, and deployment to the live theme." },
  { days:"Post Day 5",    title:"Post-Deployment Support Begins",        icon:<Activity size={13}/>,     desc:"For Scale: 30-day structured optimisation sprint begins. For Starter and Growth: 14-day support window opens. Real data starts flowing.", faded:true },
];

function Timeline() {
  const [ref, vis] = useInView(0.08);
  const mob = useMobile();
  return (
    <section style={{ padding: mob ? "4rem 1.25rem" : "7rem 2rem", maxWidth:720, margin:"0 auto" }}>
      <div ref={ref} style={{ textAlign:"center", marginBottom: mob ? "2.5rem" : "3.5rem", ...fadeStyle(vis) }}>
        <Eyebrow>Implementation Timeline</Eyebrow>
        <SectionTitle center>Five days to <Em>launch-ready.</Em></SectionTitle>
        <p style={{ fontSize:"0.88rem", color:C.mid, fontWeight:300, maxWidth:440, margin:"0.5rem auto 0", lineHeight:1.8 }}>
          The implementation phase up to initial deployment. Post-deployment support begins immediately after.
        </p>
      </div>
      <div style={{ position:"relative", paddingLeft:"2.4rem" }}>
        <div style={{ position:"absolute", left:"0.82rem", top:0, bottom:0, width:1, background:`linear-gradient(to bottom,transparent,${C.terra},${C.gold},transparent)` }} />
        {TL_ITEMS.map((item, i) => (
          <div key={i} style={{ position:"relative", marginBottom:"2rem", opacity: vis ? (item.faded ? .5 : 1) : 0, transform: vis ? "none" : "translateX(-18px)", transition:`opacity .6s ease ${.15 + i * .12}s, transform .6s ease ${.15 + i * .12}s` }}>
            <div style={{ position:"absolute", left:"-2.4rem", top:"0.1rem", width:24, height:24, borderRadius:"50%", background:C.white, border:`2px solid ${C.terra}`, display:"flex", alignItems:"center", justifyContent:"center", color:C.terra, zIndex:1 }}>
              {item.icon}
            </div>
            <p style={{ fontSize:"0.6rem", fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:C.terra, marginBottom:"0.22rem" }}>{item.days}</p>
            <p className="serif" style={{ fontSize: mob ? "1.1rem" : "1.2rem", fontWeight:400, color:C.charcoal, marginBottom:"0.3rem" }}>{item.title}</p>
            <p style={{ fontSize:"0.82rem", color:C.mid, fontWeight:300, lineHeight:1.75 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── INVESTMENT ───────────────────────────────────────────────────────────────
function Investment() {
  const [ref, vis] = useInView();
  const mob = useMobile();
  const rows = [
    { label:"Starter", sub:"2 weeks post-deployment support",              price:"\u20b940,000",   rec:false },
    { label:"Growth",  sub:"2 weeks CRO-focused support \u00b7 Recommended", price:"\u20b970,000",   rec:true  },
    { label:"Scale",   sub:"30 days structured optimisation & support",    price:"\u20b91,05,000", rec:false },
  ];
  return (
    <section id="investment" style={{ padding: mob ? "4rem 1.25rem" : "7rem 2rem", background:C.white, borderTop:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:860, margin:"0 auto" }} ref={ref}>
        <div style={{ textAlign:"center", marginBottom: mob ? "2.25rem" : "3rem", ...fadeStyle(vis) }}>
          <Eyebrow>Investment & Payment</Eyebrow>
          <SectionTitle center>Transparent pricing.<br /><Em>Simple terms.</Em></SectionTitle>
        </div>
        <div style={{ display:"grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: mob ? "1.1rem" : "2rem" }}>

          {/* Pricing table */}
          <div style={{ background:C.cream, border:`1px solid ${C.border}`, borderRadius:17, overflow:"hidden", ...fadeStyle(vis, .1, "left") }}>
            {rows.map((r, i) => {
              const [hov, setHov] = useState(false);
              return (
                <div key={i} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
                  style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"1.1rem 1.35rem", borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : "none", background: hov ? C.sand : r.rec ? "rgba(200,120,96,.05)" : "transparent", transition:"background .3s ease" }}>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:"0.38rem", fontSize:"0.85rem", fontWeight: r.rec ? 500 : 400, color:C.charcoal }}>
                      {r.label}
                      {r.rec && <span style={{ fontSize:"0.56rem", background:C.terra, color:"#fff", padding:"0.1rem 0.42rem", borderRadius:100, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase" }}>Best</span>}
                    </div>
                    <div style={{ fontSize:"0.69rem", color:C.light, fontWeight:300, marginTop:"0.07rem" }}>{r.sub}</div>
                  </div>
                  <span className="serif" style={{ fontSize:"1.3rem", fontWeight:600, color:C.terra }}>{r.price}</span>
                </div>
              );
            })}
            <div style={{ padding:"0.85rem 1.35rem" }}>
              <p style={{ fontSize:"0.72rem", color:C.light, fontWeight:300 }}>One-time investments. No retainers, no hidden costs.</p>
            </div>
          </div>

          {/* Payment terms */}
          <div style={{ background:C.cream, border:`1px solid ${C.border}`, borderRadius:17, padding: mob ? "1.35rem" : "1.65rem", ...fadeStyle(vis, .2, "right") }}>
            <p className="serif" style={{ fontSize:"1.25rem", fontWeight:400, color:C.charcoal, marginBottom:"1.2rem" }}>Payment Schedule</p>
            {[
              { n:1, title:"50% Upfront",        desc:"To confirm the engagement and schedule implementation. Work begins upon receipt." },
              { n:2, title:"50% on Completion",  desc:"Upon completion of the initial implementation and deployment, prior to the start of the post-deployment support period." },
            ].map((step, i) => (
              <div key={i} style={{ display:"flex", gap:"0.8rem", marginBottom:"1rem" }}>
                <div style={{ width:28, height:28, borderRadius:"50%", background:C.terra, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.7rem", fontWeight:600, flexShrink:0 }}>{step.n}</div>
                <div>
                  <strong style={{ display:"block", fontSize:"0.84rem", fontWeight:500, color:C.charcoal, marginBottom:"0.1rem" }}>{step.title}</strong>
                  <span style={{ fontSize:"0.77rem", color:C.mid, fontWeight:300 }}>{step.desc}</span>
                </div>
              </div>
            ))}
            <div style={{ marginTop:"1.15rem", paddingTop:"1.15rem", borderTop:`1px solid ${C.border}` }}>
              <p style={{ fontSize:"0.77rem", color:C.mid, fontWeight:300, lineHeight:1.75 }}>
                These investment levels are chosen so that even modest uplifts in ecommerce performance can reasonably be expected to recoup the project cost over a suitable time horizon, especially when combined with ongoing marketing efforts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA CLOSE ────────────────────────────────────────────────────────────────
function CTAClose() {
  const [ref, vis] = useInView(0.12);
  const mob = useMobile();
  const pkgs = [
    { label:"Option 1",                       name:"Starter", price:"\u20b940,000 \u00b7 2 wks support",     featured:false },
    { label:"Recommended \u00b7 Option 2",    name:"Growth",  price:"\u20b970,000 \u00b7 2 wks CRO support", featured:true  },
    { label:"Option 3",                       name:"Scale",   price:"\u20b91,05,000 \u00b7 30 days",         featured:false },
  ];
  return (
    <section id="choose" style={{ padding: mob ? "5rem 1.25rem" : "8rem 2rem", textAlign:"center", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, zIndex:0, background:`radial-gradient(ellipse 70% 70% at 50% 50%,rgba(232,197,184,.28) 0%,transparent 70%),${C.cream}` }} />
      <div ref={ref} style={{ position:"relative", zIndex:1, ...fadeStyle(vis) }}>
        <Eyebrow>Make Your Decision</Eyebrow>
        <h2 className="serif" style={{ fontSize:"clamp(2rem,5vw,3.8rem)", fontWeight:300, color:C.charcoal, marginBottom:"1rem", lineHeight:1.12 }}>
          Neha, <Em>choose your path.</Em>
        </h2>
        <p style={{ fontSize:"0.93rem", color:C.mid, fontWeight:300, maxWidth:500, margin:"0 auto 2.5rem", lineHeight:1.8 }}>
          Confirm the package, provide access to the Shopify store, and agree on a start date.
          Implementation begins after the upfront payment.
        </p>

        <div style={{
          display:"flex", gap:"0.9rem", justifyContent:"center", flexWrap:"wrap",
          marginBottom:"2.5rem",
          flexDirection: mob ? "column" : "row",
          alignItems: mob ? "stretch" : "flex-start",
          maxWidth: mob ? 360 : "none",
          margin: mob ? "0 auto 2.5rem" : "0 0 2.5rem",
        }}>
          {pkgs.map((p, i) => <ChoiceCard key={i} p={p} mob={mob} />)}
        </div>

        <div style={{ display:"flex", gap: mob ? "1rem" : "1.75rem", justifyContent:"center", flexWrap:"wrap", flexDirection: mob ? "column" : "row", alignItems:"center" }}>
          <ContactPill icon={<Mail size={12}/>}  label="rohitparakh4@gmail.com" href="mailto:rohitparakh4@gmail.com" />
          <ContactPill icon={<Phone size={12}/>} label="+91 98409 89414"        href="tel:+919840989414" />
          <ContactPill icon={<Globe size={12}/>} label="rohcodes.com"           href="https://rohcodes.com" />
        </div>
      </div>
    </section>
  );
}

function ChoiceCard({ p, mob }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={`mailto:rohitparakh4@gmail.com?subject=Onset%20Homes%20%E2%80%93%20${encodeURIComponent(p.name)}%20Package`}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display:"flex", flexDirection: mob ? "row" : "column",
        alignItems:"center", justifyContent: mob ? "space-between" : "center",
        gap:"0.2rem", padding: mob ? "0.95rem 1.15rem" : "1.1rem 1.65rem",
        borderRadius:15, cursor:"pointer", textDecoration:"none",
        background: p.featured ? (hov ? C.deep : C.terra) : (hov ? C.sand : C.white),
        border: p.featured ? "none" : `1px solid ${hov ? C.terra : C.border}`,
        boxShadow: p.featured ? "0 8px 28px rgba(200,120,96,.3)" : hov ? "0 6px 22px rgba(44,36,32,.09)" : "none",
        transform: !mob && hov ? "translateY(-4px)" : "none",
        transition:"all .35s ease",
      }}>
      <div style={{ textAlign: mob ? "left" : "center" }}>
        <span style={{ display:"block", fontSize:"0.57rem", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color: p.featured ? "rgba(255,255,255,.7)" : C.mid, marginBottom: mob ? 0 : "0.12rem" }}>
          {p.label}
        </span>
        <span className="serif" style={{ display:"block", fontSize: mob ? "1.2rem" : "1.4rem", fontWeight:400, color: p.featured ? "#fff" : C.charcoal }}>
          {p.name}
        </span>
      </div>
      <span style={{ fontSize:"0.78rem", fontWeight:300, color: p.featured ? "rgba(255,255,255,.8)" : C.mid }}>
        {p.price}
      </span>
    </a>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  const mob = useMobile();
  const collections = ["Cushion Covers","Throws","Table Linens","Bedsheets","Gift Boxes","Wall Art"];
  return (
    <footer style={{ borderTop:`1px solid ${C.border}`, padding: mob ? "2.5rem 1.25rem" : "3rem 2rem", background:C.white }}>
      <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns: mob ? "1fr" : "1fr auto 1fr", gap:"2rem", alignItems:"start" }}>

        <div>
          <img src={IMGS.logo} alt="Onset Homes" style={{ height:24, opacity:.8, marginBottom:"0.45rem" }} />
          <p style={{ fontSize:"0.72rem", color:C.light, fontWeight:300 }}>Handcrafted textiles, made in India.</p>
          <p style={{ fontSize:"0.69rem", color:C.light, fontWeight:300, marginTop:"0.38rem" }}>
            Prepared for Neha Jhunjhumwala &middot;{" "}
            <a href="https://onsethomes.com" target="_blank" rel="noreferrer" style={{ color:C.terra }}>onsethomes.com</a>
          </p>
        </div>

        <div style={{ textAlign: mob ? "left" : "center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", justifyContent: mob ? "flex-start" : "center", marginBottom:"0.3rem" }}>
            <div style={{ width:19, height:19, borderRadius:"50%", background:C.terra, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Sparkles size={9} color="#fff" />
            </div>
            <span className="serif" style={{ fontSize:"0.95rem", fontWeight:600, color:C.charcoal }}>
              Rohcodes<span style={{ color:C.terra }}>.</span>
            </span>
          </div>
          <p style={{ fontSize:"0.69rem", color:C.light, fontWeight:300 }}>Shopify & Ecommerce Optimisation</p>
          <p style={{ fontSize:"0.65rem", color:C.light, fontWeight:300, marginTop:"0.3rem" }}>&copy; 2026 Rohcodes &middot;{" "}
          <a href="https://rohcodes.com" target="_blank" rel="noreferrer" style={{ color:C.terra }}>rohcodes.com</a>
          </p>
        </div>

        {/* <div style={{ textAlign: mob ? "left" : "right" }}>
          <p style={{ fontSize:"0.6rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.light, marginBottom:"0.6rem" }}>Collections</p>
          <div style={{ display:"flex", gap:"0.4rem", flexWrap:"wrap", justifyContent: mob ? "flex-start" : "flex-end" }}>
            {collections.map((c, i) => (
              <span key={i} style={{ fontSize:"0.67rem", color:C.mid, background:C.cream, border:`1px solid ${C.border}`, padding:"0.2rem 0.55rem", borderRadius:100, fontWeight:300 }}>{c}</span>
            ))}
          </div>
        </div> */}
      </div>
    </footer>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div>
      <Nav />
      <Hero />
      <RevenueStrip />
      <Challenge />
      <RohcodesIntro />
      <Packages />
      <ScopeDetail />
      <Timeline />
      <Investment />
      <CTAClose />
      <Footer />
    </div>
  );
}