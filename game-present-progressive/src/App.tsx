import { reportCertificate } from "./bridge";
import { useCallback, useEffect, useState } from "react";
import { Guide, HUD, SecretCard, SwimTransition } from "./components/Overlays";
import OceanScene from "./components/sea/OceanScene";
import { SECRETS, ZONE_LABEL } from "./game/data";
import type { Zone } from "./game/data";
import { sfx } from "./game/sfx";
import { flyPearl, rectCenter } from "./game/utils";
import CertificateScreen from "./screens/CertificateScreen";
import CoralGarden from "./screens/CoralGarden";
import GlowingDepths from "./screens/GlowingDepths";
import Intro from "./screens/Intro";
import PearlBay from "./screens/PearlBay";

type Phase = "intro" | Zone | "certificate";

export default function App() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [name, setName] = useState("");
  const [diving, setDiving] = useState(false);
  const [pearls, setPearls] = useState(0);
  const [bump, setBump] = useState(0);
  const [muted, setMuted] = useState(false);
  const [guide, setGuide] = useState(false);
  const [secret, setSecret] = useState<string | null>(null);
  const [found, setFound] = useState<string[]>([]);
  const [transition, setTransition] = useState<"bay" | "depths" | null>(null);
  const [score, setScore] = useState(0);
  const [runId, setRunId] = useState(0);

  // first tap anywhere → start the calm sea ambience
  useEffect(() => {
    const h = () => {
      sfx.init();
      sfx.startAmbient();
    };
    window.addEventListener("pointerdown", h, { once: true });
    window.addEventListener("keydown", h, { once: true });
    return () => {
      window.removeEventListener("pointerdown", h);
      window.removeEventListener("keydown", h);
    };
  }, []);

  useEffect(() => sfx.onMuteChange(setMuted), []);

  const award = useCallback((origin: DOMRect | null, done: () => void) => {
    sfx.pearl();
    flyPearl(rectCenter(origin), null, () => {
      setPearls((p) => Math.min(5, p + 1));
      setBump((b) => b + 1);
      sfx.sparkle();
      done();
    });
  }, []);

  const openSecret = (id: string) => {
    sfx.sparkle();
    setSecret(id);
    setFound((f) => (f.includes(id) ? f : [...f, id]));
  };

  const restart = () => {
    setPhase("intro");
    setPearls(0);
    setBump(0);
    setFound([]);
    setScore(0);
    setDiving(false);
    setName("");
    setRunId((r) => r + 1);
  };

  const zone: Zone | null = phase === "garden" || phase === "bay" || phase === "depths" ? phase : null;
  const secretText = secret ? SECRETS.find((s) => s.id === secret)?.text ?? "" : "";

  return (
    <div className="app" dir="rtl">
      {zone && <OceanScene key={zone} zone={zone} />}
      {phase === "certificate" && <OceanScene zone="depths" />}

      {phase === "intro" && (
        <Intro
          key={runId}
          onDiveStart={() => setDiving(true)}
          onDone={(n) => {
            setName(n);
            setPhase("garden");
          }}
        />
      )}

      {phase === "garden" && (
        <div key={`g${runId}`} className="anim-fade-in">
          <CoralGarden found={found} onSecret={openSecret} onFinish={() => setTransition("bay")} />
        </div>
      )}
      {phase === "bay" && (
        <div key={`b${runId}`}>
          <PearlBay award={award} found={found} onSecret={openSecret} onFinish={() => setTransition("depths")} />
        </div>
      )}
      {phase === "depths" && (
        <div key={`d${runId}`}>
          <GlowingDepths
            name={name}
            award={award}
            onScore={setScore}
            found={found}
            onSecret={openSecret}
            onCertificate={() => { reportCertificate(score, 5, "مغامرة أعماق البحر"); setPhase("certificate"); }}
          />
        </div>
      )}
      {phase === "certificate" && (
        <div className="anim-fade-in">
          <CertificateScreen name={name} score={score} onRestart={restart} />
        </div>
      )}

      {(
        <HUD
          pearls={pearls}
          zoneLabel={zone ? ZONE_LABEL[zone] : undefined}
          game={phase !== "intro"}
          showBadge={phase !== "intro" || diving}
          muted={muted}
          onToggleMute={() => {
            sfx.init();
            sfx.toggle();
          }}
          onGuide={() => {
            sfx.bubble(0.14);
            setGuide(true);
          }}
          bump={bump}
        />
      )}

      {transition && (
        <SwimTransition
          key={transition}
          to={transition}
          onMid={() => setPhase(transition)}
          onDone={() => setTransition(null)}
        />
      )}

      {secret && <SecretCard text={secretText} onClose={() => setSecret(null)} />}
      {guide && (
        <Guide
          onClose={() => {
            sfx.bubble(0.14);
            setGuide(false);
          }}
        />
      )}
    </div>
  );
}
