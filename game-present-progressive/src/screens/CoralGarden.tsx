import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import ActionScene from "../components/ActionScene";
import Clam from "../components/Clam";
import type { ClamColor } from "../components/Clam";
import type { Mood, Pose } from "../components/Diver";
import { SecretCoral } from "../components/Overlays";
import { BubbleBurst, NextButton, PopBurst, RuleRow, Sentence, SparkleBurst, Stage } from "../components/ui";
import type { Speech } from "../components/ui";
import { sfx } from "../game/sfx";
import { useTimeouts } from "../game/utils";

const SHELL_COLORS: ClamColor[] = ["pink", "lavender", "aqua"];
const NEXT = "التالي ⬅";

function NowChip() {
  return (
    <div className="chip anim-float-in">
      <span className="font-en">NOW ✨</span>
      <span>«الآن»</span>
    </div>
  );
}

function ShellInfo({ i }: { i: number }) {
  return (
    <div className="bubble-panel anim-float-in relative px-[4.5vmin] py-[2.2vmin] text-center">
      <SparkleBurst count={10} seed={60 + i} />
      {i === 0 && (
        <div className="flex flex-col items-center gap-[1vmin]">
          <div className="font-en font-bold" style={{ fontSize: "clamp(38px, 8vmin, 80px)", textShadow: "0 0 22px rgba(255,255,255,.6)" }}>
            🫧 NOW
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-3 font-extrabold" style={{ fontSize: "clamp(20px, 4vmin, 40px)" }}>
            <span className="gold-text font-en ltr">Present Progressive</span>
            <span>=</span>
            <span>شيء يحدث الآن.</span>
          </div>
        </div>
      )}
      {i === 1 && (
        <div className="flex flex-col items-center gap-[1.4vmin]" style={{ fontSize: "clamp(24px, 4.8vmin, 48px)" }}>
          <RuleRow subjects={["I"]} be="am" />
          <RuleRow subjects={["He", "She", "It"]} be="is" />
          <RuleRow subjects={["You", "We", "They"]} be="are" />
        </div>
      )}
      {i === 2 && (
        <div className="flex flex-col items-center gap-[1vmin]">
          <div className="sentence" style={{ fontSize: "clamp(30px, 6vmin, 60px)" }}>
            <span className="chunk chunk-ing">
              verb + <span className="ing-mark">ing</span>
            </span>
          </div>
          <div dir="ltr" className="flex flex-wrap justify-center gap-x-[3.5vmin] gap-y-1" style={{ fontSize: "clamp(20px, 3.8vmin, 38px)" }}>
            {["play", "read", "eat"].map((v) => (
              <span key={v} className="sentence">
                <span className="w-verb">{v}</span>
                <span className="text-[#fde68a]">→</span>
                <span className="w-verb">
                  {v}
                  <span className="ing-mark">ing</span>
                </span>
              </span>
            ))}
          </div>
          <Sentence subject="She" be="is" verb="playing" style={{ fontSize: "clamp(28px, 5.4vmin, 54px)" }} />
        </div>
      )}
    </div>
  );
}

export default function CoralGarden({
  onFinish,
  found,
  onSecret,
}: {
  onFinish: () => void;
  found: string[];
  onSecret: (id: string) => void;
}) {
  const schedule = useTimeouts();
  const [step, setStep] = useState(0);
  const [popping, setPopping] = useState(false);
  const [shellOpen, setShellOpen] = useState(false);
  const [info, setInfo] = useState(false);
  const [ex, setEx] = useState(0);
  const [rules, setRules] = useState(0);
  const [opened, setOpened] = useState<number[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [nudge, setNudge] = useState(0);

  useEffect(() => {
    if (step === 0) [300, 650, 1000].forEach((ms) => schedule(() => sfx.bubble(0.12), ms));
    if (step === 2 || step === 3) {
      schedule(() => {
        setEx(1);
        sfx.sparkle();
      }, 1500);
      schedule(() => {
        setEx(2);
        sfx.pop();
      }, 3400);
    }
    if (step === 4) {
      [600, 1500, 2400, 3400].forEach((ms, i) =>
        schedule(() => {
          setRules(i + 1);
          if (i === 3) sfx.sparkle();
          else sfx.pop();
        }, ms)
      );
    }
  }, [step, schedule]);

  const next = () => {
    sfx.bubble(0.14);
    setEx(0);
    setRules(0);
    setStep((s) => s + 1);
  };

  const popNow = () => {
    if (popping) return;
    setPopping(true);
    sfx.pop();
    sfx.bubbles(4);
    schedule(() => setStep(1), 950);
  };

  const openShell = () => {
    if (shellOpen) return;
    setShellOpen(true);
    sfx.shellOpen();
    schedule(() => {
      setInfo(true);
      sfx.sparkle();
    }, 800);
  };

  const nextShell = opened.length;
  const openLearning = (i: number) => {
    if (opened.includes(i)) {
      setActive(i);
      sfx.bubble(0.12);
      return;
    }
    if (i !== nextShell) {
      setNudge((n) => n + 1);
      sfx.tryAgain();
      return;
    }
    setOpened([...opened, i]);
    setActive(i);
    setNudge(0);
    sfx.shellOpen();
    schedule(() => sfx.sparkle(), 550);
  };

  /* host behaviour */
  let pose: Pose = "float";
  let mood: Mood = "happy";
  let speech: Speech = null;
  if (step === 0) {
    mood = "wow";
    speech = { text: "انظري! فقاعة سحرية 🫧", id: "s0" };
  } else if (step === 1) {
    speech = info ? { text: "NOW = الآن ✨", id: "s1b" } : { text: "صدفة جميلة! افتحيها 🐚", id: "s1" };
  } else if (step === 2) {
    pose = "swim";
    speech = { text: "أنا أسبح الآن! 🌊", id: "s2" };
  } else if (step === 3) {
    mood = "wow";
    speech = { text: "انظري إلى السمكتين! ⚽", id: "s3" };
  } else if (step === 4) {
    pose = rules >= 4 ? "cheer" : "float";
    mood = rules >= 4 ? "joy" : "smile";
    speech = { text: "هذه هي القاعدة ✨", id: "s4" };
  } else {
    pose = active === 2 ? "play" : "float";
    speech =
      opened.length === 3
        ? { text: "رائع! هيا إلى خليج اللؤلؤ 💎", tone: "good", id: "s5d" }
        : nudge
          ? { text: "ابدئي بالصدفة المتوهجة ✨", tone: "hint", id: `n${nudge}` }
          : { text: "افتحي الأصداف واحدة واحدة 🐚", id: "s5" };
  }

  return (
    <>
      <Stage pose={pose} mood={mood} speech={speech}>
        {step === 0 && (
          <>
            <div className="chip anim-float-in">🫧 اضغطي على الفقاعة السحرية!</div>
            <div className="anim-rise-in" style={{ animationDelay: ".2s" }}>
              <div className="anim-bob">
                {popping ? (
                  <PopBurst size="clamp(210px, 44vmin, 400px)" text="POP! 🫧✨" />
                ) : (
                  <button
                    type="button"
                    className="choice-bubble"
                    style={{ "--bs": "clamp(210px, 44vmin, 400px)" } as CSSProperties}
                    onClick={popNow}
                    aria-label="NOW"
                  >
                    <span className="flex flex-col items-center leading-none">
                      <span className="font-en" style={{ fontSize: "clamp(54px, 11.5vmin, 116px)" }}>
                        NOW ✨
                      </span>
                      <span className="mt-[1vmin]" style={{ fontFamily: "var(--font-ar)", fontSize: "clamp(28px, 6vmin, 60px)" }}>
                        «الآن»
                      </span>
                    </span>
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <NowChip />
            {info ? (
              <div className="bubble-panel anim-float-in relative px-[5vmin] py-[2.4vmin] text-center">
                <SparkleBurst count={12} seed={31} />
                <div className="gold-text font-en font-bold" style={{ fontSize: "clamp(34px, 7vmin, 74px)" }}>
                  Present Progressive
                </div>
                <div className="font-extrabold" style={{ fontSize: "clamp(20px, 4.2vmin, 42px)" }}>
                  «نستخدمه عندما يحدث الشيء الآن.»
                </div>
              </div>
            ) : (
              <div className="chip anim-float-in">🐚 اضغطي على الصدفة لتفتحيها!</div>
            )}
            <div className="anim-pop-in relative">
              <Clam
                open={shellOpen}
                color="pink"
                glow={!shellOpen}
                onClick={shellOpen ? undefined : openShell}
                ariaLabel="صدفة"
                className="w-[clamp(170px,32vmin,320px)]"
              />
              {shellOpen && (
                <>
                  <SparkleBurst count={14} seed={2} />
                  <BubbleBurst count={12} seed={4} />
                </>
              )}
            </div>
            {info && <NextButton label={NEXT} onClick={next} />}
          </>
        )}

        {step === 2 && (
          <>
            <NowChip />
            <div className="chip anim-float-in">👀 انظري… ماذا تفعل الغواصة الآن؟</div>
            {ex >= 1 && (
              <div className="bubble-panel anim-float-in relative px-[4.5vmin] py-[2.2vmin] text-center">
                {ex === 1 ? (
                  <Sentence subject="She" be="is" verb="swimming" style={{ fontSize: "clamp(34px, 7vmin, 72px)" }} />
                ) : (
                  <Sentence split labels subject="She" be="is" verb="swimming" style={{ fontSize: "clamp(32px, 6.6vmin, 68px)" }} />
                )}
                <div className="mt-[1vmin] font-bold" style={{ fontSize: "clamp(17px, 3.2vmin, 30px)" }}>
                  هي تسبح الآن 🌊
                </div>
              </div>
            )}
            {ex >= 2 && <NextButton label={NEXT} onClick={next} />}
          </>
        )}

        {step === 3 && (
          <>
            <NowChip />
            <div className="chip anim-float-in">👀 انظري… ماذا تفعل السمكتان الآن؟</div>
            <ActionScene kind="they-play" size="clamp(150px, 28vmin, 300px)" className="anim-pop-in" />
            {ex >= 1 && (
              <div className="bubble-panel anim-float-in relative px-[4.5vmin] py-[2vmin] text-center">
                {ex === 1 ? (
                  <Sentence subject="They" be="are" verb="playing" style={{ fontSize: "clamp(32px, 6.6vmin, 68px)" }} />
                ) : (
                  <Sentence split labels subject="They" be="are" verb="playing" style={{ fontSize: "clamp(30px, 6.2vmin, 64px)" }} />
                )}
                <div className="mt-[1vmin] font-bold" style={{ fontSize: "clamp(17px, 3.2vmin, 30px)" }}>
                  السمكتان تلعبان الآن ⚽
                </div>
              </div>
            )}
            {ex >= 2 && <NextButton label={NEXT} onClick={next} />}
          </>
        )}

        {step === 4 && (
          <>
            <NowChip />
            <div className="chip anim-float-in">✨ القاعدة</div>
            <div
              className="bubble-panel relative flex flex-col items-center gap-[2vmin] px-[5vmin] py-[3vmin]"
              style={{ fontSize: "clamp(26px, 5.4vmin, 54px)", minWidth: "min(80%, 560px)" }}
            >
              {rules === 0 && <div style={{ height: "1.4em" }} />}
              {rules >= 1 && <RuleRow className="anim-pop-in" subjects={["I"]} be="AM" />}
              {rules >= 2 && <RuleRow className="anim-pop-in" subjects={["He", "She", "It"]} be="IS" />}
              {rules >= 3 && <RuleRow className="anim-pop-in" subjects={["You", "We", "They"]} be="ARE" />}
              {rules >= 4 && (
                <div className="sentence anim-pop-in relative mt-[0.5vmin]">
                  <span className="chunk chunk-ing">
                    verb + <span className="ing-mark">ing</span>
                  </span>
                  <span>✨</span>
                  <SparkleBurst count={10} seed={33} />
                </div>
              )}
            </div>
            {rules >= 4 && <NextButton label={NEXT} onClick={next} />}
          </>
        )}

        {step === 5 && (
          <>
            <div className="chip anim-float-in">🐚 أصداف التعلّم — افتحيها واحدة واحدة</div>
            <div className="flex w-full items-center justify-center" style={{ minHeight: "clamp(140px, 28vmin, 290px)" }}>
              {active !== null ? (
                <ShellInfo key={active} i={active} />
              ) : (
                <div className="anim-hint-float text-center font-extrabold" style={{ fontSize: "clamp(18px, 3.4vmin, 32px)" }}>
                  ✨ ابدئي بالصدفة المتوهجة ✨
                </div>
              )}
            </div>
            <div className="flex items-end justify-center gap-[5vmin]">
              {[0, 1, 2].map((i) => (
                <div key={i} className="anim-pop-in relative" style={{ animationDelay: `${i * 0.15}s` }}>
                  <div key={i === nextShell ? `n${nudge}` : "x"} className={i === nextShell && nudge ? "anim-shake" : ""}>
                    <Clam
                      open={opened.includes(i)}
                      color={SHELL_COLORS[i]}
                      label={String(i + 1)}
                      labelSize={52}
                      glow={i === nextShell}
                      onClick={() => openLearning(i)}
                      className="w-[clamp(100px,18vmin,196px)]"
                    />
                  </div>
                  {opened.includes(i) && active === i && (
                    <>
                      <SparkleBurst count={12} seed={i + 40} />
                      <BubbleBurst count={8} seed={i + 50} />
                    </>
                  )}
                </div>
              ))}
            </div>
            {opened.length === 3 && (
              <NextButton
                label="إلى خليج اللؤلؤ 🐚"
                onClick={() => {
                  sfx.bubble(0.15);
                  onFinish();
                }}
                attention
              />
            )}
          </>
        )}
      </Stage>
      <SecretCoral
        className="secret-a"
        found={found.includes("s1")}
        onOpen={() => onSecret("s1")}
        hint={step >= 1 && found.length === 0 ? "اضغطي على المرجان اللامع! 💡" : undefined}
      />
      <SecretCoral className="secret-b" found={found.includes("s2")} onOpen={() => onSecret("s2")} />
    </>
  );
}
