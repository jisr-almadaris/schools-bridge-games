import { useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { Zone } from "../../game/data";
import { seeded } from "../../game/utils";
import {
  Anemone,
  BrainCoral,
  BranchCoral,
  FanCoral,
  FarReef,
  OpenOyster,
  Rock,
  RockCave,
  SandFloor,
  Scallop,
  SeaGrass,
  Seaweed,
  TubeCoral,
} from "./Corals";
import { Fish, FishSchool, Jellyfish, Pearl, SmallOctopus, Starfish, Turtle } from "./Creatures";

export const ZONE_GRADIENT: Record<Zone, string> = {
  garden: "linear-gradient(180deg, #22a8d0 0%, #1b8cc4 38%, #2170b8 70%, #3553a8 100%)",
  bay: "linear-gradient(180deg, #3cc3dc 0%, #22a0cf 35%, #1f7fc0 70%, #3060ad 100%)",
  depths: "linear-gradient(180deg, #1f4592 0%, #283583 35%, #2f2476 65%, #22185c 100%)",
};

/* ---------- shared ambient layers ---------- */
export function Bubbles({ count = 16, seed = 7 }: { count?: number; seed?: number }) {
  const items = useMemo(() => {
    const r = seeded(seed);
    return Array.from({ length: count }, () => ({
      left: r() * 100,
      size: 6 + r() * 22,
      dur: 7 + r() * 9,
      delay: -r() * 16,
      sx: (r() - 0.5) * 60,
    }));
  }, [count, seed]);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((b, i) => (
        <span
          key={i}
          className="amb-bubble"
          style={
            {
              left: `${b.left}%`,
              width: b.size,
              height: b.size,
              animationDuration: `${b.dur}s`,
              animationDelay: `${b.delay}s`,
              "--sx": `${b.sx}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function LightRays({ tint = "255,255,255", strength = 1 }: { tint?: string; strength?: number }) {
  const rays = [
    { left: "4%", w: "14vw", r: 18, d: 0 },
    { left: "22%", w: "10vw", r: 10, d: -2 },
    { left: "40%", w: "16vw", r: 4, d: -4 },
    { left: "60%", w: "11vw", r: -6, d: -1 },
    { left: "78%", w: "15vw", r: -14, d: -3 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {rays.map((ray, i) => (
        <div
          key={i}
          className="ray"
          style={
            {
              left: ray.left,
              width: ray.w,
              "--r": `${ray.r}deg`,
              animationDelay: `${ray.d}s`,
              background: `linear-gradient(180deg, rgba(${tint},${0.5 * strength}), rgba(${tint},${0.12 * strength}) 55%, rgba(${tint},0))`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function Plankton({ count = 34, seed = 3, color = "#f5d0fe" }: { count?: number; seed?: number; color?: string }) {
  const items = useMemo(() => {
    const r = seeded(seed);
    return Array.from({ length: count }, () => ({
      left: r() * 100,
      top: r() * 90,
      size: 2 + r() * 4,
      dur: 2 + r() * 3,
      delay: -r() * 5,
    }));
  }, [count, seed]);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((p, i) => (
        <span
          key={i}
          className="anim-twinkle absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: i % 3 === 0 ? "#a5f3fc" : color,
            boxShadow: `0 0 ${p.size * 3}px ${i % 3 === 0 ? "#67e8f9" : color}`,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export function Swimmer({
  top,
  dur,
  delay = 0,
  dir = "r",
  width,
  children,
  opacity,
}: {
  top: string;
  dur: number;
  delay?: number;
  dir?: "r" | "l";
  width: string;
  children: ReactNode;
  opacity?: number;
}) {
  return (
    <div
      className={`swimmer pointer-events-none ${dir === "l" ? "to-left" : ""}`}
      style={{ top, width, animationDuration: `${dur}s`, animationDelay: `${delay}s`, opacity }}
    >
      <div className="undulate" style={{ animationDuration: `${1.8 + (dur % 3) * 0.5}s` }}>
        {children}
      </div>
    </div>
  );
}

function P({
  l,
  b,
  h,
  ar,
  sway,
  dur,
  delay,
  children,
  className,
}: {
  l: string;
  b: string;
  h: string;
  ar: string;
  sway?: boolean;
  dur?: number;
  delay?: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute ${sway ? "anim-sway" : ""} ${className ?? ""}`}
      style={{
        left: l,
        bottom: b,
        height: h,
        aspectRatio: ar,
        animationDuration: dur ? `${dur}s` : undefined,
        animationDelay: delay ? `${delay}s` : undefined,
      }}
    >
      {children}
    </div>
  );
}

const F = "block h-full w-full";
const FISH_W = "clamp(46px, 6.5vw, 104px)";

/* ---------- Coral Garden ---------- */
function Garden() {
  return (
    <>
      <FarReef className="absolute bottom-[9%] left-0 h-[34%] w-full" color="rgba(40,80,180,.35)" />
      <FarReef className="absolute bottom-[5%] left-[-12%] h-[25%] w-[124%]" color="rgba(90,70,180,.28)" />
      <Swimmer top="16%" dur={40} delay={-12} dir="l" width="clamp(80px, 11vw, 170px)" opacity={0.55}>
        <FishSchool color="#cffafe" className="w-full" style={{ transform: "scaleX(-1)" }} />
      </Swimmer>
      <Swimmer top="36%" dur={50} delay={-30} dir="r" width="clamp(70px, 9vw, 140px)" opacity={0.4}>
        <FishSchool color="#e0e7ff" className="w-full" />
      </Swimmer>
      <div className="pointer-events-none absolute" style={{ left: "10%", top: "14%", width: "clamp(38px, 4.8vw, 76px)", animation: "k-jelly 5s ease-in-out infinite" }}>
        <Jellyfish className="w-full" />
      </div>
      <div className="pointer-events-none absolute" style={{ left: "64%", top: "9%", width: "clamp(32px, 4vw, 64px)", animation: "k-jelly 6s ease-in-out -2s infinite" }}>
        <Jellyfish c1="#a5f3fc" c2="#818cf8" className="w-full" />
      </div>

      {/* midground */}
      <P l="-3%" b="6%" h="36%" ar="320/240">
        <RockCave className={F} />
        <div className="anim-bob absolute" style={{ left: "35%", top: "48%", width: "30%" }}>
          <SmallOctopus className="w-full" />
        </div>
      </P>
      <P l="15%" b="5%" h="42%" ar="70/260" sway dur={4.6}>
        <Seaweed className={F} />
      </P>
      <P l="19%" b="7%" h="30%" ar="1/1">
        <FanCoral className={F} />
      </P>
      <P l="33%" b="4%" h="34%" ar="70/260" sway dur={5.2} delay={-1}>
        <Seaweed c1="#2dd4bf" c2="#ccfbf1" className={F} />
      </P>
      <P l="39%" b="5%" h="13%" ar="200/120">
        <BrainCoral className={F} />
      </P>
      <P l="50%" b="3%" h="30%" ar="70/260" sway dur={4.2} delay={-2}>
        <Seaweed c1="#4ade80" className={F} />
      </P>
      <P l="55%" b="6%" h="24%" ar="160/200">
        <TubeCoral className={F} />
      </P>
      <P l="64%" b="3%" h="12%" ar="220/130">
        <Rock className={F} />
      </P>
      <P l="70%" b="11%" h="6%" ar="1/1">
        <Starfish c="#fb7185" face className={F} />
      </P>
      <P l="75%" b="6%" h="17%" ar="180/150">
        <Anemone className={F} />
      </P>
      <div className="anim-bob pointer-events-none absolute" style={{ left: "80%", bottom: "17%", width: "clamp(30px, 3.6vw, 56px)" }}>
        <Fish c1="#fdba74" c2="#f97316" fin="#fb923c" stripe="#ffffff" className="w-full" />
      </div>
      <P l="86%" b="5%" h="30%" ar="200/220">
        <BranchCoral c1="#fbbf24" c2="#fef3c7" className={F} />
      </P>
      <P l="94%" b="4%" h="40%" ar="70/260" sway dur={4.8} delay={-3}>
        <Seaweed c1="#34d399" className={F} />
      </P>

      <SandFloor className="absolute bottom-0 left-0 h-[13%] w-full" />

      {/* foreground */}
      <P l="-5%" b="-3%" h="36%" ar="200/220">
        <BranchCoral className={F} />
      </P>
      <P l="7%" b="-2%" h="28%" ar="70/260" sway dur={3.8}>
        <Seaweed c1="#059669" c2="#6ee7b7" className={F} />
      </P>
      <P l="28%" b="1.5%" h="6%" ar="100/96">
        <Scallop className={F} />
      </P>
      <P l="36%" b="0%" h="9%" ar="1/1" sway dur={3.4}>
        <SeaGrass className={F} />
      </P>
      <P l="45%" b="1%" h="7%" ar="1/1">
        <Starfish c="#fbbf24" face className={F} />
      </P>
      <P l="60%" b="1%" h="7%" ar="120/90">
        <OpenOyster glow className={F} />
      </P>
      <P l="70%" b="0%" h="8%" ar="1/1" sway dur={3.6} delay={-1}>
        <SeaGrass c="#5eead4" className={F} />
      </P>
      <P l="88%" b="-4%" h="30%" ar="1/1">
        <FanCoral c1="#fb7185" c2="#ffe4e6" className={F} />
      </P>

      {/* swimmers */}
      <Swimmer top="27%" dur={26} delay={-4} dir="r" width={FISH_W}>
        <Fish className="w-full" />
      </Swimmer>
      <Swimmer top="45%" dur={32} delay={-18} dir="l" width={FISH_W}>
        <Fish c1="#7dd3fc" c2="#6366f1" fin="#c4b5fd" flip className="w-full" />
      </Swimmer>
      <Swimmer top="60%" dur={22} delay={-10} dir="r" width="clamp(38px, 5vw, 80px)">
        <Fish c1="#fdba74" c2="#f97316" fin="#fb923c" stripe="#ffffff" className="w-full" />
      </Swimmer>
      <Swimmer top="19%" dur={36} delay={-25} dir="l" width="clamp(40px, 5.4vw, 88px)">
        <Fish c1="#fbcfe8" c2="#ec4899" fin="#fde68a" flip className="w-full" />
      </Swimmer>
      <Swimmer top="52%" dur={28} delay={-2} dir="l" width="clamp(42px, 5.8vw, 92px)">
        <Fish c1="#99f6e4" c2="#14b8a6" fin="#fcd34d" flip className="w-full" />
      </Swimmer>
      <Swimmer top="31%" dur={55} delay={-30} dir="r" width="clamp(90px, 12vw, 180px)">
        <Turtle className="w-full" />
      </Swimmer>
      <Bubbles count={16} seed={11} />
    </>
  );
}

/* ---------- Pearl Bay ---------- */
function Bay() {
  return (
    <>
      <FarReef className="absolute bottom-[12%] left-0 h-[30%] w-full" color="rgba(30,90,170,.32)" />
      <FarReef className="absolute bottom-[8%] left-[-14%] h-[22%] w-[128%]" color="rgba(110,80,190,.24)" />
      <Swimmer top="14%" dur={44} delay={-8} dir="r" width="clamp(80px, 11vw, 170px)" opacity={0.5}>
        <FishSchool color="#e0f2fe" className="w-full" />
      </Swimmer>
      <div className="pointer-events-none absolute" style={{ left: "70%", top: "12%", width: "clamp(36px, 4.6vw, 72px)", animation: "k-jelly 5.5s ease-in-out infinite" }}>
        <Jellyfish c1="#fbcfe8" c2="#f472b6" className="w-full" />
      </div>
      <div className="pointer-events-none absolute" style={{ left: "7%", top: "22%", width: "clamp(30px, 3.8vw, 60px)", animation: "k-jelly 6.5s ease-in-out -3s infinite" }}>
        <Jellyfish c1="#ddd6fe" c2="#8b5cf6" className="w-full" />
      </div>

      <P l="-4%" b="7%" h="30%" ar="200/220">
        <BranchCoral c1="#c084fc" c2="#f3e8ff" className={F} />
      </P>
      <P l="2%" b="9%" h="16%" ar="220/130">
        <Rock c1="#9aa0e0" c2="#5a5fa6" className={F} />
      </P>
      <P l="12%" b="8%" h="34%" ar="70/260" sway dur={4.4}>
        <Seaweed c1="#2dd4bf" c2="#ccfbf1" className={F} />
      </P>
      <P l="26%" b="9%" h="10%" ar="200/120">
        <BrainCoral c1="#f9a8d4" c2="#db2777" className={F} />
      </P>
      <P l="78%" b="11%" h="14%" ar="220/130">
        <Rock c1="#9aa0e0" c2="#5a5fa6" className={F} />
      </P>
      <P l="83%" b="7%" h="38%" ar="70/260" sway dur={5} delay={-2}>
        <Seaweed c1="#34d399" className={F} />
      </P>
      <P l="87%" b="9%" h="22%" ar="160/200">
        <TubeCoral colors={["#fda4af", "#fcd34d", "#67e8f9"]} className={F} />
      </P>
      <P l="92%" b="4%" h="30%" ar="1/1">
        <FanCoral c1="#f472b6" c2="#fce7f3" className={F} />
      </P>

      <SandFloor className="absolute bottom-0 left-0 h-[18%] w-full" c1="#f8e3c0" c2="#dcae94" />

      {[10, 24, 40, 58, 74].map((l, i) => (
        <P key={l} l={`${l}%`} b="1%" h={`${10 + (i % 2) * 3}%`} ar="1/1" sway dur={3.2 + i * 0.3} delay={-i}>
          <SeaGrass c={i % 2 ? "#5eead4" : "#2dd4bf"} className={F} />
        </P>
      ))}
      <P l="18%" b="4%" h="8%" ar="120/90">
        <OpenOyster glow className={F} />
      </P>
      <P l="47%" b="2%" h="9%" ar="120/90">
        <OpenOyster glow className={F} />
      </P>
      <P l="67%" b="5%" h="7%" ar="120/90">
        <OpenOyster glow className={F} />
      </P>
      <P l="34%" b="3%" h="6%" ar="100/96">
        <Scallop c1="#fde68a" c2="#f59e0b" className={F} />
      </P>
      <P l="83%" b="2%" h="7%" ar="100/96">
        <Scallop className={F} />
      </P>
      <P l="5%" b="2%" h="7%" ar="1/1">
        <Starfish c="#fb923c" face className={F} />
      </P>
      <P l="57%" b="1%" h="6%" ar="1/1">
        <Starfish c="#f472b6" className={F} />
      </P>

      <Swimmer top="25%" dur={48} delay={-20} dir="l" width="clamp(90px, 12vw, 180px)">
        <Turtle flip className="w-full" />
      </Swimmer>
      <Swimmer top="40%" dur={27} delay={-6} dir="r" width={FISH_W}>
        <Fish c1="#fde68a" c2="#f59e0b" fin="#f472b6" className="w-full" />
      </Swimmer>
      <Swimmer top="57%" dur={31} delay={-15} dir="l" width={FISH_W}>
        <Fish c1="#a5f3fc" c2="#0ea5e9" fin="#fde047" flip className="w-full" />
      </Swimmer>
      <Swimmer top="20%" dur={34} delay={-3} dir="r" width="clamp(38px, 5vw, 80px)">
        <Fish c1="#fbcfe8" c2="#a855f7" fin="#f9a8d4" className="w-full" />
      </Swimmer>
      <Bubbles count={14} seed={23} />
    </>
  );
}

/* ---------- Glowing Depths ---------- */
function Depths() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 14% 72%, rgba(45,212,191,.3), transparent 38%), radial-gradient(circle at 86% 62%, rgba(236,72,153,.26), transparent 38%), radial-gradient(ellipse at 50% -5%, rgba(167,139,250,.5), transparent 58%)",
        }}
      />
      <Plankton />
      <FarReef className="absolute bottom-[9%] left-0 h-[32%] w-full" color="rgba(120,80,220,.3)" />
      <FarReef className="absolute bottom-[5%] left-[-10%] h-[22%] w-[120%]" color="rgba(40,160,200,.2)" />

      {[
        { l: "7%", t: "13%", w: "clamp(40px, 5vw, 80px)", c1: "#f9a8d4", c2: "#e879f9", d: 0 },
        { l: "27%", t: "30%", w: "clamp(30px, 3.6vw, 58px)", c1: "#a5f3fc", c2: "#22d3ee", d: -2 },
        { l: "73%", t: "10%", w: "clamp(42px, 5.2vw, 84px)", c1: "#ddd6fe", c2: "#a78bfa", d: -1 },
        { l: "89%", t: "33%", w: "clamp(30px, 3.4vw, 54px)", c1: "#fde68a", c2: "#f472b6", d: -3 },
      ].map((j, i) => (
        <div
          key={i}
          className="pointer-events-none absolute"
          style={{ left: j.l, top: j.t, width: j.w, animation: `k-jelly ${5 + i}s ease-in-out ${j.d}s infinite` }}
        >
          <Jellyfish c1={j.c1} c2={j.c2} glow className="w-full" />
        </div>
      ))}

      <P l="10%" b="4%" h="44%" ar="70/260" sway dur={5}>
        <Seaweed c1="#2dd4bf" c2="#ccfbf1" glow className={F} />
      </P>
      <P l="16%" b="6%" h="28%" ar="1/1">
        <FanCoral c1="#818cf8" c2="#e0e7ff" glow className={F} />
      </P>
      <P l="30%" b="5%" h="16%" ar="180/150">
        <Anemone c1="#22d3ee" c2="#cffafe" className={F} />
      </P>
      <P l="50%" b="4%" h="11%" ar="220/130">
        <Rock c1="#5b4bb0" c2="#2e2466" className={F} />
      </P>
      <P l="58%" b="3%" h="30%" ar="70/260" sway dur={4.4} delay={-2}>
        <Seaweed c1="#c084fc" c2="#fae8ff" glow className={F} />
      </P>
      <P l="70%" b="6%" h="22%" ar="160/200">
        <TubeCoral colors={["#f0abfc", "#5eead4", "#fde047"]} glow className={F} />
      </P>
      <P l="94%" b="3%" h="40%" ar="70/260" sway dur={4.8} delay={-1}>
        <Seaweed c1="#a78bfa" c2="#f5d0fe" glow className={F} />
      </P>

      <SandFloor className="absolute bottom-0 left-0 h-[13%] w-full" c1="#4c3a8f" c2="#261c5c" dots="#f0abfc" />

      <P l="-3%" b="-2%" h="34%" ar="200/220">
        <BranchCoral c1="#f0abfc" c2="#fdf4ff" glow className={F} />
      </P>
      <P l="86%" b="-2%" h="32%" ar="200/220">
        <BranchCoral c1="#5eead4" c2="#ccfbf1" glow className={F} />
      </P>
      <P l="42%" b="1%" h="8%" ar="120/90">
        <OpenOyster glow className={F} />
      </P>
      <P l="24%" b="2%" h="5%" ar="1/1" className="anim-glow">
        <Pearl className={F} />
      </P>
      <P l="66%" b="1.5%" h="5%" ar="1/1" className="anim-glow">
        <Pearl className={F} />
      </P>
      <P l="78%" b="1%" h="6%" ar="1/1">
        <Starfish c="#f472b6" face className={F} />
      </P>

      <Swimmer top="24%" dur={30} delay={-9} dir="r" width={FISH_W}>
        <Fish c1="#a5f3fc" c2="#06b6d4" fin="#f0abfc" glow className="w-full" />
      </Swimmer>
      <Swimmer top="48%" dur={36} delay={-20} dir="l" width={FISH_W}>
        <Fish c1="#fbcfe8" c2="#d946ef" fin="#fde047" glow flip className="w-full" />
      </Swimmer>
      <Swimmer top="62%" dur={26} delay={-4} dir="r" width="clamp(38px, 5vw, 80px)">
        <Fish c1="#fef08a" c2="#f59e0b" fin="#5eead4" glow className="w-full" />
      </Swimmer>
      <Bubbles count={12} seed={5} />
    </>
  );
}

export default function OceanScene({ zone }: { zone: Zone }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${zone === "depths" ? "depths" : ""}`} style={{ background: ZONE_GRADIENT[zone] }}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-2/5"
        style={{ background: "radial-gradient(ellipse at 50% -12%, rgba(255,255,255,.42), rgba(255,255,255,0) 68%)" }}
      />
      <LightRays tint={zone === "depths" ? "233,213,255" : "255,255,255"} strength={zone === "depths" ? 0.7 : 1} />
      {zone === "garden" && <Garden />}
      {zone === "bay" && <Bay />}
      {zone === "depths" && <Depths />}
    </div>
  );
}
