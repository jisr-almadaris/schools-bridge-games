import { useState } from "react";
import { SecretCoral } from "../components/Overlays";
import { StepDots } from "../components/ui";
import { BAY_ARRANGE, BAY_BUBBLES, BAY_OCTOPUS, BAY_SHELLS } from "../game/data";
import { sfx } from "../game/sfx";
import { ArrangeBubbles, BubbleChoice, OctopusChallenge, ShellChoice } from "../games/Games";

export default function PearlBay({
  award,
  onFinish,
  found,
  onSecret,
}: {
  award: (origin: DOMRect | null, done: () => void) => void;
  onFinish: () => void;
  found: string[];
  onSecret: (id: string) => void;
}) {
  const [step, setStep] = useState(0);
  const [canNext, setCanNext] = useState(false);

  const solved = (origin: DOMRect | null) => award(origin, () => setCanNext(true));
  const next = () => {
    sfx.bubble(0.14);
    setCanNext(false);
    if (step < 3) setStep(step + 1);
    else onFinish();
  };
  const common = {
    onSolved: solved,
    canNext,
    onNext: next,
    badge: <StepDots icons={["🫧", "🐚", "🔤", "🐙"]} current={step} />,
  };

  return (
    <>
      {step === 0 && <BubbleChoice key="b" q={BAY_BUBBLES} nextLabel="التالي ⬅" {...common} />}
      {step === 1 && <ShellChoice key="s" q={BAY_SHELLS} nextLabel="التالي ⬅" {...common} />}
      {step === 2 && <ArrangeBubbles key="a" items={BAY_ARRANGE} nextLabel="التالي ⬅" {...common} />}
      {step === 3 && <OctopusChallenge key="o" q={BAY_OCTOPUS} nextLabel="إلى الأعماق المضيئة ✨" {...common} />}
      <SecretCoral className="secret-a" found={found.includes("s3")} onOpen={() => onSecret("s3")} />
      <SecretCoral className="secret-b" found={found.includes("s4")} onOpen={() => onSecret("s4")} />
    </>
  );
}
