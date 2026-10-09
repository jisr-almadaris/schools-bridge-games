import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Clam from "../components/Clam";
import { SecretCoral } from "../components/Overlays";
import { Pearl } from "../components/sea/Creatures";
import { BubbleBurst, NextButton, RuleRow, SparkleBurst, Stage } from "../components/ui";
import type { Speech } from "../components/ui";
import { FINAL_ARRANGE, FINAL_BUBBLES, FINAL_OCTOPUS, FINAL_SCENE, FINAL_SHELLS } from "../game/data";
import { sfx } from "../game/sfx";
import { flyPearl, pearlTargetPoint, rectCenter, useTimeouts } from "../game/utils";
import { ArrangeBubbles, BubbleChoice, OctopusChallenge, SceneChoice, ShellChoice } from "../games/Games";

type StageName = "intro" | "play" | "offer" | "open" | "celebrate";

const ORBS = [200, 235, 270, 305, 340].map((a) => {
  const r = (a * Math.PI) / 180;
  return { x: 50 + 56 * Math.cos(r), y: 56 + 56 * Math.sin(r) };
});

function GiantShell({ lit, open, glow, size }: { lit: number; open: boolean; glow: number; size: string }) {
  return (
    <div className="relative" style={{ width: size, transition: "width .8s ease" }}>
      <div
        className="anim-glow pointer-events-none absolute"
        style={{
          inset: "-22% -20% -8%",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(253,230,138,${0.35 + Math.min(glow, 5) * 0.11}), rgba(192,132,252,.38) 45%, transparent 70%)`,
        }}
      />
      {open && (
        <div className="pointer-events-none absolute" style={{ left: "50%", top: "8%", width: "190%", aspectRatio: "1", transform: "translate(-50%,-50%)" }}>
          <div
            className="anim-spin h-full w-full rounded-full"
            style={{
              background: "repeating-conic-gradient(from 0deg, rgba(253,230,138,.7) 0deg 9deg, rgba(253,230,138,0) 9deg 24deg)",
              WebkitMaskImage: "radial-gradient(circle, #000 14%, transparent 60%)",
              maskImage: "radial-gradient(circle, #000 14%, transparent 60%)",
            }}
          />
        </div>
      )}
      <Clam open={open} color="pearl" pearl="none" className="relative w-full" />
      {open && (
        <div className="pointer-events-none absolute" style={{ left: "31%", top: "-26%", width: "38%", animation: "k-golden-rise 1.4s cubic-bezier(.2,.9,.3,1.1) .3s both" }}>
          <div className="anim-bob">
            <Pearl golden className="block w-full" />
          </div>
        </div>
      )}
      {ORBS.map((o, i) => (
        <span
          key={i}
          className={`pearl-dot absolute ${i < lit ? "on" : ""}`}
          style={{
            left: `${o.x}%`,
            top: `${o.y}%`,
            transform: "translate(-50%,-50%)",
            fontSize: "clamp(14px, 3vmin, 30px)",
          }}
        />
      ))}
      {open && (
        <>
          <SparkleBurst count={22} seed={70} />
          <BubbleBurst count={16} seed={71} />
        </>
      )}
    </div>
  );
}

function FinalProgress({ idx, lit }: { idx: number; lit: number }) {
  return (
    <div className="hud-pill anim-float-in">
      <span>🐚</span>
      <span className="flex items-center gap-1" style={{ fontSize: 14 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className={`pearl-dot ${i < lit ? "on" : ""}`} />
        ))}
      </span>
      <span className="font-bold">التحدي {idx + 1} من 5</span>
    </div>
  );
}

export default function GlowingDepths({
  name,
  award,
  onScore,
  onCertificate,
  found,
  onSecret,
}: {
  name: string;
  award: (origin: DOMRect | null, done: () => void) => void;
  onScore: (n: number) => void;
  onCertificate: () => void;
  found: string[];
  onSecret: (id: string) => void;
}) {
  const schedule = useTimeouts();
  const [stage, setStage] = useState<StageName>("intro");
  const [idx, setIdx] = useState(0);
  const [lit, setLit] = useState(0);
  const [canNext, setCanNext] = useState(false);
  const [open, setOpen] = useState(false);
  const [glow, setGlow] = useState(0);
  const firstTries = useRef(0);
  const shellRef = useRef<HTMLDivElement>(null);

  const solved = (origin: DOMRect | null, first: boolean) => {
    if (first) firstTries.current += 1;
    setLit((l) => Math.min(5, l + 1));
    if (idx === 4) {
      onScore(firstTries.current);
      award(origin, () => setCanNext(true));
    } else {
      sfx.sparkle();
      schedule(() => setCanNext(true), 700);
    }
  };

  const next = () => {
    sfx.bubble(0.14);
    setCanNext(false);
    if (idx < 4) setIdx(idx + 1);
    else setStage("offer");
  };

  useEffect(() => {
    if (stage === "offer") {
      schedule(() => {
        const to = rectCenter(shellRef.current?.getBoundingClientRect());
        const from = pearlTargetPoint();
        sfx.pearl();
        for (let i = 0; i < 5; i++) {
          flyPearl(
            from,
            to,
            () => {
              sfx.bubble(0.15);
              setGlow((g) => g + 1);
              if (i === 4) schedule(() => setStage("open"), 450);
            },
            { delay: i * 300, size: 42 }
          );
        }
      }, 1000);
    }
    if (stage === "open") {
      setOpen(true);
      sfx.shellOpen();
      schedule(() => sfx.magic(), 350);
      schedule(() => setStage("celebrate"), 2300);
    }
  }, [stage, schedule]);

  const badge = <FinalProgress idx={idx} lit={lit} />;
  const nextLabel = idx < 4 ? "التحدي التالي ⬅" : "✨ ضعي اللآلئ في الصدفة الكبيرة";
  const common = { onSolved: solved, canNext, onNext: next, nextLabel, badge };

  let content: ReactNode = null;
  if (stage === "play") {
    content = (
      <>
        {idx === 0 && <BubbleChoice key="f1" q={FINAL_BUBBLES} {...common} />}
        {idx === 1 && <ShellChoice key="f2" q={FINAL_SHELLS} {...common} />}
        {idx === 2 && <ArrangeBubbles key="f3" items={FINAL_ARRANGE} {...common} />}
        {idx === 3 && <OctopusChallenge key="f4" q={FINAL_OCTOPUS} {...common} />}
        {idx === 4 && <SceneChoice key="f5" scene={FINAL_SCENE.scene} options={FINAL_SCENE.options} answer={FINAL_SCENE.answer} {...common} />}
      </>
    );
  } else {
    const celebrate = stage === "celebrate";
    const speech: Speech =
      stage === "intro"
        ? { text: "ما أجمل الأعماق! ✨", id: "i" }
        : stage === "offer"
          ? { text: "هيا يا لآلئ! 💎", id: "o" }
          : { text: "واااو! لؤلؤة ذهبية! 🌟", tone: "good", id: "g" };
    content = (
      <Stage pose={stage === "intro" || stage === "offer" ? "float" : "cheer"} mood={stage === "intro" || stage === "offer" ? "wow" : "joy"} speech={speech}>
        {stage === "intro" && (
          <>
            <div className="chip anim-float-in">✨ الأعماق المضيئة</div>
            <div className="bubble-panel anim-float-in px-[4.5vmin] py-[2vmin] text-center">
              <div className="font-extrabold" style={{ fontSize: "clamp(24px, 5vmin, 50px)" }}>
                صدفة لؤلؤية كبيرة جدًا! 🐚✨
              </div>
              <div className="font-bold" style={{ fontSize: "clamp(17px, 3.2vmin, 30px)" }}>
                أكملي 5 تحديات قصيرة لتفتحيها
              </div>
            </div>
          </>
        )}
        {stage === "offer" && <div className="chip anim-float-in">💎 اللآلئ الخمس تتجه إلى الصدفة الكبيرة…</div>}
        <div ref={shellRef} className={celebrate ? "" : "mt-[4vmin]"}>
          <GiantShell lit={stage === "intro" ? 0 : 5} open={open} glow={glow} size={celebrate ? "clamp(120px, 21vmin, 230px)" : "clamp(190px, 38vmin, 390px)"} />
        </div>
        {stage === "intro" && (
          <NextButton
            label="ابدئي التحديات! 🫧"
            onClick={() => {
              sfx.bubble(0.15);
              setStage("play");
            }}
            attention
          />
        )}
        {celebrate && (
          <div className="flex flex-col items-center gap-[1.6vmin]">
            <div className="bubble-panel anim-pop-in relative px-[4vmin] py-[1.8vmin] text-center">
              <SparkleBurst count={16} seed={81} />
              <div className="font-extrabold" style={{ fontSize: "clamp(26px, 5.4vmin, 56px)" }}>
                أحسنتِ يا <span className="gold-text">{name}</span>! 🪸✨
              </div>
              <div className="font-bold" style={{ fontSize: "clamp(16px, 3vmin, 28px)" }}>
                أكملتِ مغامرة أعماق البحر وتعلمتِ <span className="font-en ltr">Present Progressive</span>!
              </div>
            </div>
            <div className="anim-float-in flex flex-wrap items-stretch justify-center gap-[1.6vmin]" style={{ animationDelay: ".5s" }}>
              <div className="review-card">
                <span className="font-en font-bold" style={{ fontSize: "1.5em" }}>
                  NOW 🫧
                </span>
              </div>
              <div className="review-card flex-col" style={{ fontSize: "clamp(15px, 2.7vmin, 26px)" }}>
                <RuleRow subjects={["I"]} be="am" />
                <RuleRow subjects={["He", "She", "It"]} be="is" />
                <RuleRow subjects={["You", "We", "They"]} be="are" />
              </div>
              <div className="review-card">
                <span className="sentence" style={{ fontSize: "1.4em" }}>
                  <span className="chunk chunk-ing">
                    verb + <span className="ing-mark">ing</span>
                  </span>
                </span>
              </div>
            </div>
            <NextButton
              label="شهادتي 🏆"
              onClick={() => {
                sfx.bubble(0.15);
                onCertificate();
              }}
              attention
            />
          </div>
        )}
      </Stage>
    );
  }

  return (
    <>
      {content}
      {(stage === "intro" || stage === "play") && (
        <SecretCoral className="secret-a" found={found.includes("s5")} onOpen={() => onSecret("s5")} />
      )}
    </>
  );
}
