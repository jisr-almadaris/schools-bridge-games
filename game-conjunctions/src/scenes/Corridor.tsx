import { useEffect, useState, type CSSProperties } from "react";
import Hero, { type Pose } from "../components/Hero";
import { Bookshelf, Candle, Chandelier, Dust, Fog, HotelRoomShell, Painting, Runes } from "../components/Scenery";
import { WordBadge } from "../components/UI";
import { sfx } from "../audio";
import { ROOMS, WORD_INFO, type RoomDef } from "../data";
import type { Progress } from "../store";
import { ElevatorDoor, useTimeline } from "./Elevator";

const DOOR_X = [3, 22, 59, 78]; // left % ; width 19%
const DOOR_W = 19;

function Door({ room, state, opening, rattle, onClick }: { room: RoomDef; state: "locked" | "next" | "done"; opening: boolean; rattle: boolean; onClick: () => void }) {
  const radius = { arch: "50% 50% 6px 6px / 28% 28% 6px 6px", tall: "40% 40% 4px 4px / 14% 14% 4px 4px", round: "999px 999px 8px 8px", gear: "20px 20px 6px 6px" }[room.door.shape];
  const glowC = WORD_INFO[room.word].color;
  return (
    <button onClick={onClick} className={`relative w-full h-full ${rattle ? "anim-rattle" : ""}`} style={{ filter: state === "locked" ? "brightness(.6) saturate(.7)" : undefined }}>
      {/* plaque */}
      <div className="absolute -top-[16%] left-1/2 -translate-x-1/2 w-[80%] rounded-lg py-0.5 text-center" style={{ background: "linear-gradient(180deg,#f2c95c,#8a5b12)", border: "2px solid #fff0b3", zIndex: 3 }}>
        <div className="text-lg sm:text-2xl leading-none">{room.icon}</div>
        <div className="text-[9px] sm:text-xs font-extrabold text-[#3b1f6e] leading-tight">{room.nameAr}</div>
      </div>
      {/* frame */}
      <div className="absolute inset-0" style={{ borderRadius: radius, background: `linear-gradient(90deg, ${room.door.frame}, #fff8e0 50%, ${room.door.frame})`, boxShadow: state === "next" ? `0 0 34px ${glowC}, 0 0 0 3px ${glowC}` : state === "done" ? `0 0 18px ${glowC}` : "0 10px 20px rgba(0,0,0,.5)", animation: state === "next" ? "glowPulse 1.8s infinite" : undefined }} />
      <div className="absolute inset-[7%] overflow-hidden" style={{ borderRadius: radius, background: `radial-gradient(ellipse at 50% 60%, #fff3c4, ${glowC} 50%, #140c2e)` }}>
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${room.door.color}, #140c2e)`, transformOrigin: "0% 50%", transition: "transform 1.3s ease-in-out", transform: opening ? "perspective(700px) rotateY(-80deg)" : state === "done" ? "perspective(700px) rotateY(-14deg)" : "none", borderRadius: radius, boxShadow: "inset 0 0 20px rgba(0,0,0,.6)" }}>
          <div className="absolute inset-[12%] rounded-md" style={{ border: "2px solid rgba(242,201,92,.5)", borderRadius: radius }} />
          {room.door.shape === "round" && <div className="absolute left-1/2 -translate-x-1/2 top-[18%] w-[40%] aspect-square rounded-full" style={{ background: "radial-gradient(circle,#ff9fd0,#3b1f6e)", boxShadow: "0 0 14px #ff9fd0" }} />}
          {room.door.shape === "gear" && <div className="absolute left-1/2 -translate-x-1/2 top-[16%] text-2xl sm:text-4xl anim-spin">⚙️</div>}
          {room.door.shape === "tall" && <div className="absolute left-1/2 -translate-x-1/2 top-[18%] text-2xl sm:text-3xl" style={{ animation: "twinkle 1.4s infinite" }}>⚡</div>}
          {room.door.shape === "arch" && <div className="absolute left-1/2 -translate-x-1/2 top-[16%] w-[46%] aspect-[3/4] rounded-t-full shimmer" style={{ background: "linear-gradient(135deg,#b9e8ff88,#3b1f6e)", border: "2px solid #c8952e" }} />}
          <div className="absolute right-[14%] top-[55%] w-[10%] aspect-square rounded-full bg-amber-300" style={{ boxShadow: "0 0 8px #f2c95c" }} />
          <div className="absolute right-[12%] top-[62%] text-[10px] sm:text-sm">{state === "done" ? "" : "🔒"}</div>
        </div>
      </div>
      {state === "done" && (
        <div className="absolute -bottom-[9%] left-1/2 -translate-x-1/2 z-10 scale-[.7] sm:scale-100 whitespace-nowrap"><WordBadge w={room.word} /></div>
      )}
      {state === "next" && <div className="absolute -bottom-[10%] left-1/2 -translate-x-1/2 text-xl anim-float">✨</div>}
    </button>
  );
}

type Evt = "eyes" | "candles" | "book" | "shadow" | "key";

export default function Corridor({ p, onEnter, onSecret }: { p: Progress; onEnter: (i: number) => void; onSecret: () => void }) {
  const at = useTimeline();
  const next = p.done.findIndex((d) => !d);
  const allDone = next === -1;
  const doneCount = p.done.filter(Boolean).length;
  const [x, setX] = useState(50);
  const [pose, setPose] = useState<Pose>("walk");
  const [facing, setFacing] = useState<1 | -1>(1);
  const [opening, setOpening] = useState<number | null>(null);
  const [rattle, setRattle] = useState<number | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [evt, setEvt] = useState<Evt | null>(null);
  const [purple, setPurple] = useState(false);
  const [dark, setDark] = useState(false);
  const [flash, setFlash] = useState(false);
  const [busy, setBusy] = useState(false);
  const [elevOpen, setElevOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    at(100, () => { setPose("idle"); });
    const order: Evt[] = ["eyes", "shadow", "candles", "book", "eyes"];
    const e = order[doneCount % order.length];
    at(1100, () => {
      setEvt(e);
      if (e === "eyes") { setPose("look"); setFacing(-1); sfx("mirror"); }
      if (e === "shadow") { sfx("steps"); at(500, () => { setPose("surprise"); }); }
      if (e === "candles") { setDark(true); sfx("whoosh"); at(600, () => { setDark(false); setPurple(true); sfx("sparkle"); setPose("surprise"); }); }
      if (e === "book") { sfx("book"); setPose("look"); }
    });
    at(3600, () => { setPose("idle"); setFacing(1); });
    if (!allDone) at(4200, () => { setEvt("key"); sfx("whoosh"); at(1500, () => { sfx("key"); setRattle(next); at(700, () => setRattle(null)); }); });
    else at(3000, () => sfx("chime"));
  }, []);

  const walkTo = (tx: number, then: () => void) => {
    setFacing(tx < x ? -1 : 1); setPose("walk"); setX(tx);
    at(1850, () => { setPose("idle"); then(); });
  };

  const clickDoor = (i: number) => {
    if (busy) return;
    const r = ROOMS[i];
    if (p.done[i]) { sfx("chime"); setMsg(`اكتشفتِ سر ${r.nameAr}: ${r.word} ${WORD_INFO[r.word].icon} = ${WORD_INFO[r.word].ar}`); return; }
    if (i !== next) { sfx("thump"); setRattle(i); at(700, () => setRattle(null)); setMsg("هذا الباب ما زال نائمًا… جربي الباب المتوهج ✨"); return; }
    setMsg(null); setBusy(true);
    walkTo(DOOR_X[i] + DOOR_W / 2, () => {
      setPose("reach"); sfx("keyLock");
      at(500, () => {
        setOpening(i);
        if (r.id === "storm") { sfx("thunder"); setFlash(true); at(700, () => setFlash(false)); } else sfx("creak");
        setPose("surprise");
      });
      at(1900, () => { setPose("walk"); setHidden(true); });
      at(2700, () => onEnter(i));
    });
  };

  const goElevator = () => {
    if (busy) return;
    setBusy(true);
    walkTo(50, () => {
      setPose("reach"); sfx("beep");
      at(600, () => { sfx("elevator"); setElevOpen(true); setPose("happy"); });
      at(2200, () => { setPose("walk"); setHidden(true); });
      at(3000, () => onSecret());
    });
  };

  return (
    <HotelRoomShell wall="#2c1656">
      {/* far corridor */}
      <div className="absolute left-[41%] w-[18%] bottom-[26%] h-[58%] overflow-hidden" style={{ background: "linear-gradient(180deg,#140c2e,#2a1452)", borderRadius: "999px 999px 0 0", border: "6px solid #c8952e", zIndex: 2 }}>
        <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,.25) 0 2px, transparent 2px 22px)" }} />
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[70%] h-[30%]" style={{ background: "linear-gradient(0deg,#6e1a3d,transparent)", clipPath: "polygon(10% 100%, 90% 100%, 60% 0, 40% 0)" }} />
        <ElevatorDoor className="left-1/2 -translate-x-1/2 bottom-[6%] w-[52%] h-[46%]" open={elevOpen} lit={allDone} />
        {evt === "shadow" && <div className="absolute bottom-[8%] left-0 w-[18%] h-[40%] rounded-t-full" style={{ background: "radial-gradient(ellipse at 50% 30%, #0b0620, rgba(11,6,32,.6))", animation: "shadowPass 1.6s ease-in-out forwards" }}>
          <div className="absolute top-[18%] left-[25%] w-[14%] aspect-square rounded-full bg-amber-200" /><div className="absolute top-[18%] right-[25%] w-[14%] aspect-square rounded-full bg-amber-200" />
        </div>}
      </div>
      {/* ceiling runner and chandeliers */}
      <Chandelier className="left-[8%] top-0 w-[min(22vw,180px)] h-[14vh]" />
      <Chandelier className="right-[8%] top-0 w-[min(22vw,180px)] h-[14vh]" />
      {/* header plaque */}
      <div className="absolute top-[11%] md:top-[9%] left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-2xl text-center w-[min(92vw,620px)]" style={{ background: "linear-gradient(180deg,rgba(110,26,61,.92),rgba(59,31,110,.92))", border: "2px solid #f2c95c" }}>
        <div className="text-base sm:text-2xl font-extrabold text-amber-100">«أربعة أبواب… وراء كل باب سر من أسرار اللغة.»</div>
      </div>
      <Painting className="left-[16%] top-[18%] w-[5%] min-w-[40px] aspect-[4/5] hidden sm:block" kind="owl" follow={evt === "eyes"} />
      <Painting className="right-[16%] top-[18%] w-[5%] min-w-[40px] aspect-[4/5] hidden sm:block" kind="cat" follow={evt === "eyes"} />
      {evt === "eyes" && <Painting className="left-1/2 -translate-x-1/2 top-[23%] w-[12vw] max-w-[70px] aspect-[4/5] sm:hidden z-[9] anim-fadeIn" kind="lady" follow />}
      {evt === "book" && <Bookshelf className="left-[1%] top-[28%] w-[10%] h-[18%] hidden sm:block" flying />}
      <Candle style={{ left: "36%", top: "32%" }} purple={purple} />
      <Candle style={{ right: "36%", top: "28%", animationDelay: "-2s" }} purple={purple} />
      <Candle style={{ left: "50%", top: "22%", animationDelay: "-1s" }} purple={purple} />
      <Runes count={6} area={{ top: 20, bottom: 50 }} />
      {/* doors */}
      {ROOMS.map((r, i) => (
        <div key={r.id} className="absolute" style={{ left: `${DOOR_X[i]}%`, width: `${DOOR_W}%`, bottom: "26%", height: "37%", zIndex: 8 }}>
          <Door room={r} state={p.done[i] ? "done" : i === next ? "next" : "locked"} opening={opening === i} rattle={rattle === i} onClick={() => clickDoor(i)} />
        </div>
      ))}
      {/* carpet */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[26%]" style={{ background: "linear-gradient(0deg,#6e1a3d,#3d0f24)", clipPath: "polygon(0 100%, 100% 100%, 70% 0, 30% 0)", zIndex: 1, borderTop: "2px solid #c8952e" }} />
      {evt === "key" && next >= 0 && (
        <span className="absolute text-3xl z-30" style={{ left: "46%", bottom: "30%", animation: "keyFly 1.6s ease-in forwards", ["--kx" as string]: `${(DOOR_X[next] + DOOR_W / 2 - 48) * (typeof window !== "undefined" ? window.innerWidth / 100 : 8)}px`, ["--ky" as string]: "-14vh", filter: "drop-shadow(0 0 10px #f2c95c)" } as CSSProperties}>🗝️</span>
      )}
      <Hero x={x} bottom="3%" size="clamp(120px,27vh,270px)" pose={pose} facing={facing} hidden={hidden} holding={doneCount > 0 ? "key" : "card"} />
      {msg && (
        <div className="absolute bottom-[3%] left-1/2 -translate-x-1/2 z-40 glass rounded-2xl px-4 py-2 text-center anim-fadeUp w-[min(92vw,520px)]" onClick={() => setMsg(null)}>
          <span className="text-base sm:text-lg font-bold">{msg}</span>
        </div>
      )}
      {!msg && !busy && !allDone && (
        <div className="absolute bottom-[3%] left-1/2 -translate-x-1/2 z-30 glass rounded-full px-4 py-1.5 text-sm sm:text-base anim-fadeUp whitespace-nowrap">اضغطي الباب المتوهج ✨ لتدخلي</div>
      )}
      {allDone && !busy && (
        <div className="absolute bottom-[3%] left-1/2 -translate-x-1/2 z-40 glass rounded-3xl px-5 py-3 text-center anim-pop w-[min(92vw,520px)]">
          <div className="font-extrabold text-lg sm:text-xl text-amber-100">جمعتِ المفاتيح الأربعة 🗝️🗝️🗝️🗝️ والرمز 7351!</div>
          <div className="text-violet-100 text-sm sm:text-base mb-2">المصعد في آخر الممر يتوهج… 👀</div>
          <button onClick={goElevator} className="btn-gold rounded-2xl px-6 py-2.5 text-lg">عودي إلى المصعد 🛗</button>
        </div>
      )}
      {dark && <div className="absolute inset-0 z-50 bg-black/90 pointer-events-none" />}
      {flash && <div className="absolute inset-0 z-50 pointer-events-none lightning-flash" style={{ animation: "lightning 1s linear" }} />}
      <Fog /><Dust count={20} />
    </HotelRoomShell>
  );
}
