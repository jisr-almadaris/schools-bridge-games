import { useEffect, useState } from "react";
import { cn } from "../utils/cn";
import { sfx } from "../audio";
import type { TravelKind } from "../scene";
import Girl, { type Pose, type Prop } from "./Girl";

const DEST: Record<string, { icon: string; en: string; ar: string; prop: Prop; door?: boolean; tone: string }> = {
  coaster: { icon: "🎢", en: "ROLLER COASTER", ar: "👧 تمشي نحو الأفعوانية…", prop: "ticket", tone: "from-pink-500 to-fuchsia-700" },
  wheel: { icon: "🎡", en: "FERRIS WHEEL", ar: "🎟️ تحمل تذكرتها وتتجه إلى عجلة الملاهي…", prop: "ticket", tone: "from-teal-400 to-cyan-700" },
  balloon: { icon: "🎈", en: "BALLOON POP", ar: "🎈 إلى كشك البالونات!", prop: "balloon", tone: "from-amber-400 to-orange-600" },
  cinema: { icon: "🍿", en: "MINI CINEMA", ar: "🍿 تدخل باب السينما…", prop: "popcorn", door: true, tone: "from-violet-500 to-indigo-700" },
  gate: { icon: "🏰", en: "FINAL NIGHT ZONE", ar: "🌌 إلى آخر المدينة…", prop: "ticket", tone: "from-indigo-500 to-purple-800" },
  final: { icon: "🎆", en: "FINAL NIGHT", ar: "🎆 تعبر البوابة المضيئة…", prop: "ticket", door: true, tone: "from-amber-400 to-pink-600" },
};

export const TRAVEL_MS: Record<TravelKind, number> = { enter: 4800, toGame: 3000, toHub: 2400, toFinalGate: 3200, toFinal: 2600 };

export default function TravelOverlay({ kind, target, onPhase }: { kind: TravelKind; target?: string; onPhase?: (p: number) => void }) {
  const [x, setX] = useState(88);
  const [arrived, setArrived] = useState(false);
  const [train, setTrain] = useState(false);
  const [title, setTitle] = useState(kind !== "enter");
  const [pose, setPose] = useState<Pose>("walk");
  const [inside, setInside] = useState(false);
  const dest = kind === "toGame" ? DEST[target || "coaster"] : kind === "toFinalGate" ? DEST.gate : kind === "toFinal" ? DEST.final : null;

  useEffect(() => {
    const T: number[] = [];
    const at = (ms: number, fn: () => void) => T.push(window.setTimeout(fn, ms));
    const walkMs = kind === "enter" ? 2000 : kind === "toHub" ? 1700 : 2100;
    at(40, () => setX(kind === "enter" ? 56 : dest ? 36 : 50));
    at(walkMs, () => {
      setArrived(true);
      setPose(kind === "enter" ? "look" : dest?.door ? "walk" : kind === "toHub" ? "wave" : "point");
      if (dest?.door) {
        setInside(true);
        sfx.clunk();
      }
    });
    if (kind === "enter") {
      onPhase?.(1);
      at(800, () => {
        setTrain(true);
        sfx.whoosh();
      });
      at(2500, () => {
        onPhase?.(2);
        sfx.chime();
      });
      at(3100, () => {
        setTitle(true);
        setPose("wave");
      });
    }
    return () => T.forEach((t) => window.clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const heading =
    kind === "enter" ? "🔐 بوابة الأسرار" : kind === "toHub" ? "🎢 منطقة الألعاب" : kind === "toFinalGate" ? "🔒 FINAL NIGHT ZONE" : kind === "toFinal" ? "🎆 ليلة التحدي الكبير" : "";
  const sub = kind === "enter" ? "مرحبًا بكِ داخل مدينة الألعاب ✨" : kind === "toHub" ? "👧 تحمل تذكرتها وتعود إلى الألعاب…" : dest?.ar;

  return (
    <div className="fixed inset-0 z-30 pointer-events-none fade-up no-print" style={{ animationDuration: "0.35s" }}>
      <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-b from-transparent via-navy/60 to-navy/95" />

      {/* passing coaster train behind the girl */}
      {train && (
        <div className="absolute left-0 bottom-[34%] train-pass flex items-end gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={cn("relative w-20 h-10 sm:w-28 sm:h-14 rounded-xl border-2 border-white/70", ["bg-pinky", "bg-turq", "bg-gold", "bg-lav"][i])}>
              <span className="absolute -top-5 left-3 text-xl">🙌</span>
              <span className="absolute -bottom-2 left-2 w-4 h-4 rounded-full bg-navy border-2 border-lav" />
              <span className="absolute -bottom-2 right-2 w-4 h-4 rounded-full bg-navy border-2 border-lav" />
            </div>
          ))}
          <span className="en text-4xl sm:text-6xl font-bold text-gold neon-gold ms-4 mb-4 whitespace-nowrap">WHOOSH! 🎢</span>
        </div>
      )}

      {/* path + lamps */}
      <div className="absolute inset-x-0 bottom-[10%] h-3 bg-gradient-to-l from-transparent via-lav/40 to-transparent rounded-full" />
      <div className="absolute inset-x-[-200px] bottom-[11%] h-40 overflow-visible">
        <div className={cn("flex gap-[120px] lamps-scroll", arrived && "lamps-stop")} dir="ltr">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="relative w-10 h-40 shrink-0">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-32 bg-[#2e2378]" />
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-gold shadow-[0_0_20px_#ffcf4a] bulb" />
            </div>
          ))}
        </div>
      </div>

      {/* destination */}
      {dest && (
        <div className="absolute bottom-[10%] left-[6%] sm:left-[12%] flex flex-col items-center">
          <div className={cn("en rounded-xl px-3 py-1 text-sm sm:text-lg font-bold bg-gradient-to-l text-white shadow-[0_0_24px_rgba(255,111,181,0.6)] border-2 border-gold", dest.tone)}>{dest.en}</div>
          <div className="bulb-row flex gap-2 my-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <span key={i} className="w-2 h-2 rounded-full bg-gold" />
            ))}
          </div>
          <div className={cn("relative w-32 h-40 sm:w-44 sm:h-52 rounded-t-[60px] border-4 border-gold/80 bg-gradient-to-b overflow-hidden flex items-center justify-center", dest.tone)}>
            <span className="text-6xl sm:text-7xl float">{dest.icon}</span>
            {dest.door && (
              <div
                className="absolute inset-x-6 bottom-0 h-3/5 rounded-t-3xl bg-navy border-2 border-gold transition-all duration-700"
                style={{ background: inside ? "radial-gradient(circle at 50% 80%, #fff6c9, #ffcf4a 40%, #ff6fb5)" : undefined }}
              />
            )}
          </div>
        </div>
      )}

      {/* the girl */}
      <div
        className="absolute bottom-[9%]"
        style={{
          left: `${x}%`,
          transform: `translateX(-50%) scale(${inside ? 0.55 : 1})`,
          opacity: inside ? 0 : 1,
          transition: `left ${kind === "enter" ? 2 : kind === "toHub" ? 1.7 : 2.1}s linear, transform .8s ease-in, opacity .8s ease-in`,
        }}
      >
        <Girl pose={pose} prop={dest?.prop || (kind === "toHub" ? "ticket" : undefined)} size={130} />
      </div>

      {/* zone title */}
      {title && (
        <div className="absolute top-[18%] inset-x-0 flex flex-col items-center text-center px-4 pop-in">
          {heading && <p className="display text-4xl sm:text-6xl text-gold neon-gold">{heading}</p>}
          {sub && <p className="mt-2 text-lg sm:text-2xl font-bold text-lav bg-navy/50 rounded-full px-5 py-1">{sub}</p>}
        </div>
      )}
    </div>
  );
}
