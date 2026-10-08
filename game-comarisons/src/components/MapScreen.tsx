import { useEffect, useState } from "react";
import { IslandGraphic, Ship, StarIcon } from "../graphics";
import { ISLANDS } from "../data";
import { sound } from "../sound";

/* Positions on the map (percent). Index 0 = starting dock, 1..5 = islands */
const POS = [
  { x: 86, y: 76 }, // dock
  { x: 68, y: 26 },
  { x: 50, y: 62 },
  { x: 33, y: 22 },
  { x: 17, y: 60 },
  { x: 3, y: 24 },
];

export default function MapScreen({
  completed,
  shipIdx,
  onShipArrive,
  onEnter,
  name,
}: {
  completed: number; // islands finished (0..5)
  shipIdx: number; // current ship POS index
  onShipArrive: (idx: number) => void;
  onEnter: (islandIdx: number) => void;
  name: string;
}) {
  const target = Math.min(completed + 1, 5);
  const [pos, setPos] = useState(POS[shipIdx]);
  const [moving, setMoving] = useState(shipIdx !== target);

  useEffect(() => {
    if (shipIdx !== target) {
      const t1 = setTimeout(() => {
        sound.ship();
        setPos(POS[target]);
      }, 700);
      const t2 = setTimeout(() => {
        setMoving(false);
        onShipArrive(target);
      }, 3400);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-6xl px-3 pb-8">
      <div className="animate-slide-up mt-2 rounded-2xl bg-white/20 px-4 py-3 text-center backdrop-blur-sm ring-2 ring-white/30">
        <h2 className="font-display text-2xl font-extrabold text-white drop-shadow sm:text-3xl">
          خريطة الرحلة 🗺️
        </h2>
        <p className="mt-1 text-sm font-bold text-sky-100 sm:text-base">
          {completed < 5
            ? `يا ${name}، اضغطي على الجزيرة المضيئة للنزول إليها! ⚓`
            : "أكملتِ جميع الجزر! 🎉"}
        </p>
      </div>

      {/* Sea map */}
      <div className="relative mt-4 h-[520px] overflow-hidden rounded-[2rem] bg-gradient-to-b from-sky-300 via-cyan-400 to-blue-600 shadow-2xl ring-4 ring-white/40 sm:h-[560px]">
        {/* decorative waves */}
        {[18, 42, 68, 88].map((t, i) => (
          <svg key={i} viewBox="0 0 200 12" className="absolute w-40 opacity-30" style={{ top: `${t}%`, left: `${(i * 27 + 8) % 70}%` }}>
            <path d="M0 8 Q12 0 25 8 T50 8 T75 8 T100 8 T125 8 T150 8 T175 8 T200 8" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        ))}
        {/* dashed route */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <path
            d={`M ${POS[0].x + 6} ${POS[0].y + 10} ${POS.slice(1)
              .map((p) => `L ${p.x + 6} ${p.y + 10}`)
              .join(" ")}`}
            stroke="#fff"
            strokeWidth="0.9"
            strokeDasharray="2.5 2.5"
            fill="none"
            opacity="0.75"
            strokeLinecap="round"
          />
        </svg>

        {/* dock */}
        <div className="absolute flex flex-col items-center" style={{ left: `${POS[0].x}%`, top: `${POS[0].y + 6}%`, width: "12%" }}>
          <div className="text-3xl">⚓</div>
          <span className="rounded-full bg-blue-900/60 px-2 py-0.5 text-xs font-bold text-white">الميناء</span>
        </div>

        {/* islands */}
        {ISLANDS.map((isl, i) => {
          const p = POS[i + 1];
          const state = i < completed ? "done" : i === completed ? "current" : "locked";
          return (
            <button
              key={i}
              disabled={state === "locked" || moving}
              onClick={() => {
                sound.click();
                onEnter(i);
              }}
              className={`absolute flex flex-col items-center transition ${
                state === "locked" ? "opacity-60 grayscale" : "cursor-pointer hover:scale-105"
              }`}
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: "13%", minWidth: "92px" }}
            >
              <div className={`relative ${state === "current" && !moving ? "animate-floaty" : ""}`}>
                <IslandGraphic tint={isl.tint} className="w-full drop-shadow-lg" />
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl">{isl.emoji}</span>
                {state === "done" && <StarIcon className="absolute -top-5 right-0 h-7 w-7 animate-pop" />}
                {state === "locked" && <span className="absolute -top-4 right-1 text-xl">🔒</span>}
              </div>
              <span
                className={`mt-1 rounded-full px-2.5 py-1 text-[11px] font-extrabold leading-tight sm:text-xs ${
                  state === "current"
                    ? "animate-pulse-glow bg-yellow-300 text-purple-900 ring-2 ring-yellow-500"
                    : state === "done"
                      ? "bg-emerald-500 text-white"
                      : "bg-blue-900/60 text-white"
                }`}
              >
                {isl.name}
              </span>
            </button>
          );
        })}

        {/* ship */}
        <div
          className="ship-transition absolute z-20"
          style={{ left: `${pos.x + 1}%`, top: `${pos.y + 9}%`, width: "11%", minWidth: "76px" }}
        >
          <div className="animate-bob">
            <Ship className="w-full drop-shadow-xl" />
          </div>
        </div>
      </div>

      {completed < 5 && !moving && (
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              sound.click();
              onEnter(completed);
            }}
            className="animate-pop rounded-2xl bg-gradient-to-l from-amber-400 to-yellow-500 px-8 py-4 text-xl font-extrabold text-purple-900 shadow-lg shadow-amber-500/40 transition hover:scale-105 active:scale-95"
          >
            النزول إلى {ISLANDS[completed].name} {ISLANDS[completed].emoji}
          </button>
        </div>
      )}
      {moving && (
        <p className="mt-4 animate-pulse text-center text-xl font-extrabold text-white drop-shadow">
          🚢 السفينة تبحر نحو الجزيرة التالية...
        </p>
      )}
    </div>
  );
}
