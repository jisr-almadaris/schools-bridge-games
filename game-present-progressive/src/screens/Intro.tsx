import { bridgeStudentName } from "../bridge";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Diver from "../components/Diver";
import type { Mood, Pose } from "../components/Diver";
import { Fish, FishSchool, Jellyfish, Turtle } from "../components/sea/Creatures";
import OceanScene, { Bubbles, LightRays, Swimmer } from "../components/sea/OceanScene";
import { BubbleBurst, SparkleBurst } from "../components/ui";
import { sfx } from "../game/sfx";
import { clamp01, easeInOut, lerp, seeded, useTimeouts } from "../game/utils";

interface Geo {
  S: number; // sea surface (vh)
  D: number; // dock top (vh)
  H: number; // diver height (vh)
  X0: number; // diver x on dock (vw)
  Y0: number; // diver centre y on dock (vh)
  EX: number; // water entry x (vw)
  HX: number; // final host x (vw)
  HY: number; // final host y (vh)
}

function geometry(): Geo {
  const portrait = window.innerHeight > window.innerWidth * 1.05;
  // Y0 = dock top − 0.46·H so the fins rest exactly on the planks
  if (portrait) return { S: 80, D: 73, H: 19, X0: 70, Y0: 73 - 19 * 0.46, EX: 44, HX: 72, HY: 68 };
  return { S: 60, D: 52, H: 28, X0: 75, Y0: 52 - 28 * 0.46, EX: 52, HX: 76, HY: 56 };
}

function frame(t: number, g: Geo) {
  const u1 = easeInOut(clamp01((t - 2.7) / 1.3));
  const u2 = easeInOut(clamp01((t - 4.0) / 2.7));
  const cam = 100 * u1 + 100 * u2;
  let x = g.X0;
  let y = g.Y0;
  let rot = 0;
  let sy = 1;
  if (t < 1.5) {
    y = g.Y0;
  } else if (t < 1.8) {
    const k = Math.sin(((t - 1.5) / 0.3) * Math.PI);
    sy = 1 - 0.1 * k;
    y = g.Y0 + 0.05 * g.H * k;
  } else if (t < 2.7) {
    const u = (t - 1.8) / 0.9;
    x = lerp(g.X0, g.EX, u);
    y = lerp(g.Y0, g.S + 8, u) - 18 * 4 * u * (1 - u);
    rot = 180 * easeInOut(u);
  } else if (t < 6.7) {
    const s = t - 2.7;
    y = t < 4.0 ? g.S + 8 - (g.S + 8 - 52) * u1 : 52;
    x = g.EX + 2.5 * Math.sin(s * 2.2) * clamp01(s / 0.6);
    rot = 180 + 7 * Math.sin(s * 3) * clamp01(s / 0.6);
  } else {
    const s = 4.0;
    const x6 = g.EX + 2.5 * Math.sin(s * 2.2);
    const r6 = 180 + 7 * Math.sin(s * 3);
    const u = easeInOut(clamp01((t - 6.7) / 0.9));
    x = lerp(x6, g.HX, u);
    y = lerp(52, g.HY, u);
    rot = lerp(r6, 360, u);
  }
  return { cam, x, y, rot, sy };
}

function Cloud({ style }: { style: CSSProperties }) {
  return (
    <div className="pointer-events-none absolute" style={{ animation: "k-cloud 14s ease-in-out infinite alternate", ...style }}>
      <svg viewBox="0 0 200 90" className="block w-full" aria-hidden>
        <path
          d="M30 80 Q0 80 8 58 Q14 40 38 44 Q44 16 76 20 Q96 2 122 16 Q150 8 160 34 Q192 32 194 58 Q196 82 168 80 Z"
          fill="#fff"
          opacity="0.95"
        />
        <path d="M30 80 Q60 68 100 75 Q140 68 168 80 Z" fill="#e9d5ff" opacity="0.8" />
      </svg>
    </div>
  );
}

function Splash({ x, y }: { x: number; y: number }) {
  const drops = useMemo(() => {
    const r = seeded(9);
    return Array.from({ length: 18 }, () => ({
      dx: (r() - 0.5) * 300,
      dy: -(90 + r() * 200),
      s: 8 + r() * 14,
      d: r() * 0.15,
    }));
  }, []);
  return (
    <div className="pointer-events-none absolute z-[3]" style={{ left: `${x}vw`, top: `${y}vh` }}>
      {[0, 0.25, 0.5].map((d, i) => (
        <span
          key={i}
          className="absolute rounded-[50%]"
          style={{
            left: 0,
            top: 0,
            width: "26vmin",
            height: "5vmin",
            border: "4px solid rgba(255,255,255,.9)",
            animation: `k-ripple 1.5s ease-out ${d}s both`,
          }}
        />
      ))}
      <svg
        viewBox="0 0 200 120"
        className="absolute"
        style={{ left: 0, bottom: 0, width: "28vmin", transformOrigin: "50% 100%", animation: "k-crown 1.05s ease-out both" }}
        aria-hidden
      >
        <path
          d="M10 120 Q30 60 40 90 Q55 20 70 80 Q85 0 100 70 Q115 0 130 80 Q145 20 160 90 Q170 60 190 120 Z"
          fill="#e0fbff"
          stroke="#fff"
          strokeWidth="3"
        />
      </svg>
      {drops.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={
            {
              left: 0,
              top: 0,
              width: p.s,
              height: p.s,
              background: "radial-gradient(circle at 30% 30%, #fff, #7ee8f5)",
              "--dx": `${p.dx}px`,
              "--dy": `${p.dy}px`,
              animation: `k-splash-drop 1.15s ease-out ${p.d}s both`,
            } as CSSProperties
          }
        />
      ))}
      <span className="splash-text" style={{ animation: "k-splash-text 2s ease-out both" }}>
        SPLASH! 💦
      </span>
      <div className="absolute" style={{ left: "-12vmin", top: "3vmin", width: "24vmin", height: "34vmin" }}>
        <BubbleBurst count={16} seed={3} />
      </div>
    </div>
  );
}

function Waves({ top }: { top: string }) {
  const path = "M0 10 Q25 0 50 10 T100 10 T150 10 T200 10 T250 10 T300 10 T350 10 T400 10 V24 H0 Z";
  return (
    <div className="pointer-events-none absolute inset-x-0 z-[2] overflow-hidden" style={{ top, height: "5vh" }}>
      <div className="absolute left-0 top-0 h-full" style={{ width: "200%", animation: "k-wave-move 11s linear infinite" }}>
        <svg viewBox="0 0 400 24" preserveAspectRatio="none" className="block h-full w-full" aria-hidden>
          <path d={path} fill="#a5f3f4" />
        </svg>
      </div>
      <div className="absolute left-0 top-[28%] h-full" style={{ width: "200%", animation: "k-wave-move 7s linear infinite reverse" }}>
        <svg viewBox="0 0 400 24" preserveAspectRatio="none" className="block h-full w-full" aria-hidden>
          <path d={path} fill="#5fdde0" />
          <path d="M0 10 Q25 0 50 10 T100 10 T150 10 T200 10 T250 10 T300 10 T350 10 T400 10" stroke="#fff" strokeWidth="1.6" fill="none" opacity="0.8" />
        </svg>
      </div>
    </div>
  );
}

function Dock({ g }: { g: Geo }) {
  const left = g.X0 - 7;
  const posts = [left + 2, left + 11, left + 20, left + 29];
  return (
    <>
      {posts.map((p, i) => (
        <div
          key={i}
          className="pointer-events-none absolute z-[1]"
          style={{
            left: `${p}vw`,
            top: `${g.D + 1}vh`,
            width: "1.5vw",
            minWidth: 10,
            height: `${g.S - g.D + 10}vh`,
            borderRadius: "6px",
            background: `linear-gradient(180deg, #8a5530 0%, #6f4224 ${((g.S - g.D) / (g.S - g.D + 10)) * 100}%, rgba(40,90,130,.8) ${
              ((g.S - g.D) / (g.S - g.D + 10)) * 100 + 4
            }%, rgba(30,80,120,.3) 100%)`,
          }}
        />
      ))}
      <div
        className="pointer-events-none absolute z-[1]"
        style={{
          left: `${left}vw`,
          right: 0,
          top: `${g.D}vh`,
          height: "2.6vh",
          borderRadius: "8px 0 0 8px",
          background: "repeating-linear-gradient(90deg, #c68b58 0 5.4vw, #9c6437 5.4vw 5.7vw)",
          boxShadow: "0 1.2vh 0 #7a4a28, 0 1.8vh 14px rgba(0,0,0,.18)",
        }}
      />
      <svg
        viewBox="0 0 60 60"
        className="pointer-events-none absolute z-[1]"
        style={{ left: `${posts[1] - 1.3}vw`, top: `${g.D + 3.4}vh`, width: "4.4vmin" }}
        aria-hidden
      >
        <circle cx="30" cy="30" r="22" fill="none" stroke="#fff" strokeWidth="11" />
        <circle cx="30" cy="30" r="22" fill="none" stroke="#fb7185" strokeWidth="11" strokeDasharray="17.3 17.3" />
        <circle cx="30" cy="30" r="22" fill="none" stroke="rgba(0,0,0,.12)" strokeWidth="1" />
      </svg>
    </>
  );
}

export default function Intro({ onDone, onDiveStart }: { onDone: (name: string) => void; onDiveStart: () => void }) {
  const schedule = useTimeouts();
  const geoRef = useRef<Geo>(geometry());
  const g = geoRef.current;
  const [name, setName] = useState(bridgeStudentName());
  const [error, setError] = useState(0);
  const [started, setStarted] = useState(false);
  const [panelGone, setPanelGone] = useState(false);
  const [pose, setPose] = useState<Pose>("stand");
  const [mood, setMood] = useState<Mood>("smile");
  const [splash, setSplash] = useState(false);
  const [trail, setTrail] = useState(false);
  const [welcome, setWelcome] = useState(false);
  const worldRef = useRef<HTMLDivElement>(null);
  const girlRef = useRef<HTMLDivElement>(null);
  const rotRef = useRef<HTMLDivElement>(null);
  const cleanName = name.trim().replace(/\s+/g, " ");

  const start = () => {
    sfx.init();
    sfx.startAmbient();
    if (started) return;
    if (!cleanName) {
      setError((e) => e + 1);
      sfx.tryAgain();
      return;
    }
    sfx.bubble(0.15);
    setStarted(true);
    onDiveStart();
  };

  useEffect(() => {
    if (!started) return;
    setPose("wave");
    setMood("happy");
    schedule(() => setPanelGone(true), 650);
    schedule(() => setPose("stand"), 1500);
    schedule(() => {
      setPose("dive");
      sfx.whoosh();
    }, 1800);
    schedule(() => {
      setSplash(true);
      setMood("wow");
      sfx.splash();
    }, 2650);
    schedule(() => setTrail(true), 2900);
    schedule(() => setMood("happy"), 3700);
    [4300, 5200, 6000].forEach((ms) => schedule(() => sfx.bubbles(2), ms));
    schedule(() => {
      setPose("float");
      setTrail(false);
    }, 6950);
    schedule(() => {
      setWelcome(true);
      sfx.magic();
    }, 7700);

    const t0 = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      const t = (now - t0) / 1000;
      const f = frame(t, g);
      if (worldRef.current) worldRef.current.style.transform = `translate3d(0, ${-f.cam}vh, 0)`;
      if (girlRef.current) girlRef.current.style.transform = `translate(${f.x}vw, ${f.y}vh)`;
      if (rotRef.current) rotRef.current.style.transform = `translate(-50%, -50%) rotate(${f.rot}deg) scaleY(${f.sy})`;
      if (t < 7.9) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [started, schedule, g]);

  const diverW = `${(g.H * 220) / 320}vh`;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#22a8d0" }}>
      {/* ================= the tall world (camera moves down through it) ================= */}
      <div ref={worldRef} className="absolute left-0 top-0 w-full" style={{ height: "300vh", willChange: "transform" }}>
        {/* A: sky + sea surface + dock */}
        <div className="absolute inset-x-0 top-0 overflow-hidden" style={{ height: "100vh" }}>
          <div
            className="absolute inset-x-0 top-0"
            style={{
              height: `${g.S}vh`,
              background: "linear-gradient(180deg, #6fc3f2 0%, #9fc5ff 30%, #c9b8ff 56%, #f7c6e3 82%, #ffe2bd 100%)",
            }}
          >
            <div
              className="anim-glow absolute rounded-full"
              style={{
                left: "15%",
                top: "16%",
                width: "13vmin",
                height: "13vmin",
                background: "radial-gradient(circle, #fffbe6 0 42%, #fde68a 62%, rgba(253,230,138,0) 72%)",
                boxShadow: "0 0 90px 36px rgba(253,230,138,.45)",
              }}
            />
            <Cloud style={{ left: "30%", top: "10%", width: "15vw" }} />
            <Cloud style={{ left: "58%", top: "20%", width: "10vw", animationDuration: "18s" }} />
            <Cloud style={{ left: "4%", top: "36%", width: "9vw", animationDuration: "16s" }} />
            <svg viewBox="0 0 300 80" className="absolute bottom-0" style={{ left: "2%", width: "30vw" }} aria-hidden>
              <path d="M0 80 Q60 40 120 58 Q180 30 240 56 Q270 64 300 80 Z" fill="#b8a4e0" opacity="0.65" />
              <path d="M150 80 Q182 62 222 66 Q250 70 264 80 Z" fill="#f6d7a7" />
              <path d="M205 70 Q200 50 210 34" stroke="#8a5a36" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M210 34 Q196 26 186 32 M210 34 Q222 24 234 30 M210 34 Q206 22 214 16 M210 34 Q224 36 230 44 M210 34 Q196 38 192 46" stroke="#34d399" strokeWidth="5" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <div
            className="absolute inset-x-0 bottom-0 overflow-hidden"
            style={{ top: `${g.S}vh`, background: "linear-gradient(180deg, #5fdde0 0%, #3cc8dc 45%, #2bb8d4 100%)" }}
          >
            <LightRays />
            <Swimmer top="40%" dur={24} delay={-6} dir="l" width="clamp(60px, 8vw, 120px)" opacity={0.5}>
              <FishSchool color="#ecfeff" className="w-full" style={{ transform: "scaleX(-1)" }} />
            </Swimmer>
            <Bubbles count={8} seed={42} />
          </div>
          {[18, 34, 66, 88].map((l, i) => (
            <span
              key={l}
              className="anim-twinkle absolute z-[3] rounded-full bg-white"
              style={{ left: `${l}%`, top: `${g.S + 0.5}vh`, width: 6, height: 6, boxShadow: "0 0 10px #fff", animationDelay: `${i * 0.6}s` }}
            />
          ))}
          <Dock g={g} />
          <Waves top={`${g.S - 2.5}vh`} />
          {splash && <Splash x={g.EX} y={g.S} />}
        </div>

        {/* B: mid-water */}
        <div
          className="absolute inset-x-0 overflow-hidden"
          style={{ top: "100vh", height: "100vh", background: "linear-gradient(180deg, #2bb8d4 0%, #26b0d2 50%, #22a8d0 100%)" }}
        >
          <LightRays />
          <Swimmer top="22%" dur={16} delay={-4} dir="r" width="clamp(90px, 12vw, 170px)" opacity={0.7}>
            <FishSchool color="#e0f2fe" className="w-full" />
          </Swimmer>
          <Swimmer top="58%" dur={20} delay={-12} dir="l" width="clamp(90px, 12vw, 180px)">
            <Turtle flip className="w-full" />
          </Swimmer>
          <div className="absolute" style={{ left: "14%", top: "30%", width: "clamp(40px, 5vw, 80px)", animation: "k-jelly 5s ease-in-out infinite" }}>
            <Jellyfish className="w-full" />
          </div>
          <div className="absolute" style={{ left: "80%", top: "66%", width: "clamp(34px, 4vw, 64px)", animation: "k-jelly 6s ease-in-out -2s infinite" }}>
            <Jellyfish c1="#a5f3fc" c2="#818cf8" className="w-full" />
          </div>
          <Bubbles count={14} seed={17} />
        </div>

        {/* C: the coral reef (same world as the Coral Garden) */}
        <div className="absolute inset-x-0" style={{ top: "200vh", height: "100vh" }}>
          <OceanScene zone="garden" />
        </div>
      </div>

      {/* fish passing the camera while diving */}
      {started && (
        <div className="pointer-events-none absolute inset-0 z-[5]">
          <div className="absolute left-0" style={{ top: "22vh", width: "clamp(60px, 9vw, 130px)", animation: "k-swim-l 3.2s linear 3.3s 1 both" }}>
            <Fish c1="#fde047" c2="#f97316" fin="#fb7185" flip className="w-full" />
          </div>
          <div className="absolute left-0" style={{ top: "72vh", width: "clamp(56px, 8vw, 120px)", animation: "k-swim-r 3s linear 4.1s 1 both" }}>
            <Fish c1="#a5f3fc" c2="#6366f1" fin="#f0abfc" className="w-full" />
          </div>
          <div className="absolute left-0" style={{ top: "38vh", width: "clamp(50px, 7vw, 110px)", animation: "k-swim-l 3.6s linear 5s 1 both" }}>
            <Fish c1="#fbcfe8" c2="#ec4899" fin="#fde68a" flip className="w-full" />
          </div>
          <div className="absolute left-0" style={{ top: "60vh", width: "clamp(80px, 11vw, 160px)", animation: "k-swim-r 4s linear 3.7s 1 both" }}>
            <FishSchool color="#ecfeff" className="w-full" />
          </div>
        </div>
      )}

      {/* the diver */}
      <div
        ref={girlRef}
        className="pointer-events-none absolute left-0 top-0 z-10"
        style={{ transform: `translate(${g.X0}vw, ${g.Y0}vh)` }}
      >
        {trail && (
          <div className="absolute" style={{ left: "-3vh", top: "0vh", width: "6vh", height: "6vh" }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="amb-bubble"
                style={{
                  left: `${(i * 23) % 80}%`,
                  bottom: 0,
                  width: 8 + (i % 3) * 5,
                  height: 8 + (i % 3) * 5,
                  animation: `k-rise-short ${1.2 + (i % 3) * 0.3}s ease-out ${i * 0.22}s infinite`,
                }}
              />
            ))}
          </div>
        )}
        <div ref={rotRef} style={{ transform: "translate(-50%, -50%)" }}>
          <Diver pose={pose} mood={mood} bob={welcome} style={{ width: diverW }} />
        </div>
      </div>

      {/* ================= start panel ================= */}
      {!panelGone && (
        <div className={`start-panel glass z-20 ${started ? "leaving" : ""}`}>
          <div className="anim-float-in text-center" style={{ animationDelay: ".05s" }}>
            <div className="initiative-title">مبادرة جسر المدارس 🌉</div>
            <div className="initiative-tag">«جسرٌ يربط المعرفة بين المدارس، ويحوّل التعلّم المشترك إلى تجربة ممتعة.»</div>
          </div>
          <div className="anim-float-in my-[1.2vmin] flex items-center justify-center gap-3 opacity-90" style={{ animationDelay: ".45s" }}>
            <span className="h-[3px] w-[16%] rounded-full bg-gradient-to-l from-transparent to-[#fde68a]" />
            <span style={{ fontSize: "clamp(18px, 3vmin, 28px)" }}>🐚 🫧 🪸</span>
            <span className="h-[3px] w-[16%] rounded-full bg-gradient-to-r from-transparent to-[#fde68a]" />
          </div>
          <div className="anim-float-in text-center" style={{ animationDelay: ".75s" }}>
            <h1 className="game-title">
              <span className="ocean-text">مغامرة أعماق البحر</span> 🪸🐚
            </h1>
            <div className="font-en font-semibold text-[#cffafe]" style={{ fontSize: "clamp(15px, 2.6vmin, 24px)" }}>
              Present Progressive Ocean Adventure
            </div>
          </div>
          <div className="anim-float-in mt-[2vmin] flex flex-col items-center gap-[1.6vmin]" style={{ animationDelay: "1.1s" }}>
            <input
              key={error}
              className={`name-input ${error ? "anim-shake" : ""}`}
              value={name}
              maxLength={24}
              placeholder="اكتبي اسمكِ"
              aria-label="اكتبي اسمكِ"
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") start();
              }}
              disabled={started}
            />
            {error > 0 && !cleanName && <div className="speech hint up anim-pop-in">اكتبي اسمكِ أولًا 💡</div>}
            <button type="button" className="btn-primary" style={{ fontSize: "clamp(22px, 4.4vmin, 40px)" }} onClick={start}>
              هيا نغوص! 🤿
            </button>
          </div>
        </div>
      )}

      {/* ================= welcome ================= */}
      {welcome && (
        <div className="intro-welcome z-20">
          <div className="bubble-panel anim-pop-in relative px-[5vmin] py-[3.5vmin] text-center">
            <SparkleBurst count={18} seed={12} />
            <div className="font-extrabold leading-snug" style={{ fontSize: "clamp(28px, 6vmin, 62px)" }}>
              مرحبًا يا <span className="gold-text">{cleanName}</span>
              <br />
              في عالم الأعماق! 🪸✨
            </div>
            <button
              type="button"
              className="btn-primary anim-attention mt-[2.4vmin]"
              style={{ fontSize: "clamp(20px, 3.8vmin, 34px)" }}
              onClick={() => {
                sfx.bubble(0.15);
                onDone(cleanName);
              }}
            >
              هيا نستكشف! 🪸
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
