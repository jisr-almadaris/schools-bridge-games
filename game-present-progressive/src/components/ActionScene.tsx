import type { ReactNode } from "react";
import type { SceneKind } from "../game/data";
import Diver from "./Diver";
import { SandFloor, Seaweed } from "./sea/Corals";
import { Fish, Turtle } from "./sea/Creatures";

export function BeachBall({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} style={{ overflow: "visible" }} aria-hidden>
      <g style={{ transformBox: "view-box", transformOrigin: "20px 20px", animation: "k-spin 1.4s linear infinite" }}>
        <circle cx="20" cy="20" r="18" fill="#fff" stroke="#1e3a8a" strokeWidth="1.5" />
        <path d="M20 2 A18 18 0 0 1 38 20 L20 20 Z" fill="#ef4444" />
        <path d="M20 38 A18 18 0 0 1 2 20 L20 20 Z" fill="#3b82f6" />
        <path d="M38 20 A18 18 0 0 1 20 38 L20 20 Z" fill="#facc15" />
        <circle cx="20" cy="20" r="4" fill="#fff" />
      </g>
      <ellipse cx="13" cy="11" rx="5" ry="3" fill="#fff" opacity="0.75" />
    </svg>
  );
}

function Food({ from, count = 4 }: { from: number[]; count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${from[i % from.length]}%`,
            top: "30%",
            width: 7,
            height: 7,
            background: "#fde68a",
            boxShadow: "0 0 8px #fde68a",
            animation: `k-food 2s ease-in ${i * 0.5}s infinite`,
          }}
        />
      ))}
    </>
  );
}

function content(kind: SceneKind): ReactNode {
  switch (kind) {
    case "they-play":
      return (
        <>
          <div className="absolute" style={{ left: "4%", top: "44%", width: "38%", animation: "k-nudge-a 2.4s ease-in-out infinite" }}>
            <Fish c1="#fde047" c2="#f97316" fin="#fb7185" className="block w-full" />
          </div>
          <div className="absolute" style={{ left: "58%", top: "44%", width: "38%", animation: "k-nudge-b 2.4s ease-in-out infinite" }}>
            <Fish c1="#a5f3fc" c2="#6366f1" fin="#f0abfc" flip className="block w-full" />
          </div>
          <div className="absolute" style={{ width: "15%", aspectRatio: "1", animation: "k-ball-lr 2.4s ease-in-out infinite" }}>
            <BeachBall className="block h-full w-full" />
          </div>
        </>
      );
    case "they-eat":
      return (
        <>
          <div className="absolute" style={{ left: "2%", top: "30%", width: "40%", animation: "k-chomp .9s ease-in-out infinite" }}>
            <Fish c1="#fde047" c2="#f97316" fin="#fb7185" chomp className="block w-full" />
          </div>
          <div className="absolute" style={{ left: "58%", top: "48%", width: "40%", animation: "k-chomp .9s ease-in-out -.45s infinite reverse" }}>
            <Fish c1="#a5f3fc" c2="#6366f1" fin="#f0abfc" chomp flip className="block w-full" />
          </div>
          <Food from={[40, 50, 58, 46]} count={5} />
        </>
      );
    case "he-eat":
      return (
        <>
          <div className="anim-sway absolute" style={{ left: "72%", bottom: "12%", height: "44%", aspectRatio: "70/260" }}>
            <Seaweed c1="#22c55e" c2="#bbf7d0" className="block h-full w-full" />
          </div>
          <div className="absolute" style={{ left: "8%", top: "34%", width: "66%" }}>
            <Turtle eating className="block w-full" />
          </div>
        </>
      );
    case "he-swim":
      return (
        <div className="absolute" style={{ left: "18%", top: "30%", width: "64%", animation: "k-patrol 6s ease-in-out infinite" }}>
          <Turtle className="block w-full" />
        </div>
      );
    case "it-eat":
      return (
        <>
          <div className="absolute" style={{ left: "10%", top: "40%", width: "50%", animation: "k-chomp .9s ease-in-out infinite" }}>
            <Fish c1="#fbcfe8" c2="#ec4899" fin="#fde68a" chomp className="block w-full" />
          </div>
          <Food from={[58, 62, 56, 64]} />
        </>
      );
    case "she-read":
    case "i-read":
      return (
        <div className="absolute" style={{ left: "27%", top: "8%", width: "46%" }}>
          <Diver pose="read" className="w-full" />
        </div>
      );
    case "she-swim":
    case "i-swim":
      return (
        <div className="absolute" style={{ left: "30%", top: "10%", width: "40%" }}>
          <Diver pose="swim" bubbles className="w-full" />
        </div>
      );
    case "she-play":
    case "we-play":
      return (
        <div className="absolute" style={{ left: "24%", top: "8%", width: "46%" }}>
          <Diver pose="play" className="w-full" />
        </div>
      );
    default:
      return null;
  }
}

export default function ActionScene({
  kind,
  size = "clamp(150px, 27vmin, 290px)",
  tag,
  className,
}: {
  kind: SceneKind;
  size?: string;
  tag?: string;
  className?: string;
}) {
  return (
    <div className={`relative shrink-0 ${className ?? ""}`} style={{ width: size, height: size }}>
      <div className="scene-window absolute inset-0 overflow-hidden rounded-full">
        <SandFloor className="absolute bottom-0 left-0 h-[20%] w-full" />
        <div className="anim-sway absolute" style={{ left: "5%", bottom: "8%", height: "44%", aspectRatio: "70/260" }}>
          <Seaweed className="block h-full w-full" />
        </div>
        {content(kind)}
        {[18, 46, 80].map((l, i) => (
          <span
            key={i}
            className="amb-bubble"
            style={{ left: `${l}%`, bottom: "10%", width: 8 + i * 3, height: 8 + i * 3, animation: `k-rise-short ${2.6 + i * 0.5}s ease-out ${i * 0.8}s infinite` }}
          />
        ))}
      </div>
      <div
        className="pointer-events-none absolute"
        style={{ top: "9%", left: "17%", width: "22%", height: "9%", borderRadius: "50%", background: "rgba(255,255,255,.55)", transform: "rotate(-32deg)" }}
      />
      {tag && (
        <span
          className="chunk chunk-subj font-en absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3 font-bold"
          style={{ fontSize: "clamp(18px, 3.4vmin, 32px)" }}
        >
          {tag}
        </span>
      )}
    </div>
  );
}
