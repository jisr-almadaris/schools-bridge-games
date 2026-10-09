import { reportCompleted, reportCertificate, bridgeStudentName } from "./bridge";
import { useCallback, useEffect, useState } from 'react';
import { STATIONS } from './data/content';
import { loadProgress, newProgress, saveProgress, type Progress } from './lib/progress';
import { sound } from './lib/sound';
import { CertificateScreen } from './components/Certificate';
import { ChallengeScreen } from './components/ChallengeScreen';
import { EndingScreen } from './components/EndingScreen';
import { GuideModal } from './components/GuideModal';
import { LaunchScene } from './components/LaunchScene';
import { MapScreen } from './components/MapScreen';
import { StartScreen } from './components/StartScreen';
import { StationScreen } from './components/StationScreen';
import { TopBar } from './components/ui';

type Screen = 'start' | 'launch' | 'map' | 'station' | 'challenge' | 'ending' | 'certificate';

export default function App() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress() ?? newProgress(bridgeStudentName()));
  const [screen, setScreen] = useState<Screen>('start');
  const [stationIdx, setStationIdx] = useState(0);
  const [mapFrom, setMapFrom] = useState(-1);
  const [guide, setGuide] = useState(false);
  const [muted, setMuted] = useState(sound.muted);
  const [factIdx, setFactIdx] = useState(0);
  const [endingIntro, setEndingIntro] = useState(true);

  // persist: name, current station, stars, score
  useEffect(() => {
    if (progress.name) saveProgress(progress);
  }, [progress]);

  // sound starts only after the first interaction
  useEffect(() => {
    const unlock = () => {
      sound.unlock();
      sound.startMusic();
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  const toggleMute = () => {
    const m = !muted;
    setMuted(m);
    sound.setMuted(m);
    if (!m) sound.play('click');
  };

  const openGuide = () => {
    sound.play('pop');
    setGuide(true);
  };
  const closeGuide = useCallback(() => {
    sound.play('click');
    setGuide(false);
  }, []);

  const startNew = (name: string) => {
    sound.unlock();
    sound.startMusic();
    sound.play('click');
    setProgress(newProgress(name));
    setScreen('launch');
  };

  const continueJourney = () => {
    sound.play('click');
    if (progress.challengeDone) {
      setScreen('certificate');
      return;
    }
    setMapFrom(Math.min(progress.current, 6) - 1);
    setScreen('map');
  };

  const launchDone = useCallback(() => {
    setMapFrom(-1);
    setScreen('map');
  }, []);

  const land = () => {
    sound.play('click');
    if (progress.current >= 6) {
      setScreen('challenge');
    } else {
      setStationIdx(progress.current);
      setScreen('station');
    }
  };

  const earnStar = () => {
    setProgress((p) => {
      const stars = Math.max(p.stars, stationIdx + 1);
      return {
        ...p,
        current: Math.max(p.current, stationIdx + 1),
        stars,
        score: stars * 10 + (p.challengeDone ? 40 : 0),
      };
    });
  };

  const nextPlanet = () => {
    sound.play('click');
    setMapFrom(stationIdx);
    setScreen('map');
  };

  const challengeDone = () => {
    reportCompleted(Math.min(100, progress.stars * 10 + 40), 100);
    setProgress((p) => ({
      ...p,
      challengeDone: true,
      score: Math.min(100, p.stars * 10 + 40),
      finishedAt: new Date().toISOString(),
    }));
    setEndingIntro(true);
    setScreen('ending');
  };

  const restart = () => {
    sound.play('click');
    setProgress((p) => newProgress(p.name));
    setScreen('start');
  };

  const topBar = <TopBar stars={progress.stars} muted={muted} onToggleMute={toggleMute} onGuide={openGuide} />;

  return (
    <div className="app-root">
      {screen === 'start' && (
        <StartScreen
          progress={progress}
          muted={muted}
          onToggleMute={toggleMute}
          onStart={startNew}
          onContinue={continueJourney}
        />
      )}
      {screen === 'launch' && <LaunchScene topBar={topBar} onDone={launchDone} />}
      {screen === 'map' && (
        <MapScreen
          key={`map-${mapFrom}-${progress.current}`}
          topBar={topBar}
          from={mapFrom}
          to={Math.min(progress.current, 6)}
          done={progress.current}
          factIndex={factIdx}
          onFactSeen={() => setFactIdx((f) => f + 1)}
          onLand={land}
        />
      )}
      {screen === 'station' && (
        <StationScreen
          key={`station-${stationIdx}`}
          topBar={topBar}
          station={STATIONS[stationIdx]}
          index={stationIdx}
          name={progress.name}
          onEarn={earnStar}
          onNext={nextPlanet}
        />
      )}
      {screen === 'challenge' && <ChallengeScreen topBar={topBar} onDone={challengeDone} />}
      {screen === 'ending' && (
        <EndingScreen
          topBar={topBar}
          name={progress.name}
          skipIntro={!endingIntro}
          onCertificate={() => {
            sound.play('click');
            reportCertificate(progress.score, 100, 'الفضاء – WH Questions');
            setScreen('certificate');
          }}
        />
      )}
      {screen === 'certificate' && (
        <CertificateScreen
          topBar={topBar}
          name={progress.name}
          score={progress.score || 100}
          date={progress.finishedAt ? new Date(progress.finishedAt) : new Date()}
          onBack={() => {
            sound.play('click');
            setEndingIntro(false);
            setScreen('ending');
          }}
          onRestart={restart}
        />
      )}
      {guide && <GuideModal onClose={closeGuide} />}
    </div>
  );
}
