import { useCallback, useRef } from 'react';

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSequence(notes) {
  try {
    const ctx = getAudioContext();
    let time = ctx.currentTime;

    notes.forEach(({ freq, dur, type = 'sine', vol = 0.2 }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.value = freq;
      osc.type = type;

      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

      osc.start(time);
      osc.stop(time + dur);

      time += dur * 0.85;
    });
  } catch (e) {}
}

export function useSound() {
  const lastTime = useRef(0);

  const throttledPlay = useCallback((fn) => {
    const now = Date.now();
    if (now - lastTime.current < 200) return;
    lastTime.current = now;
    fn();
  }, []);

  const playBark = useCallback(() => {
    throttledPlay(() => {
      playSequence([
        { freq: 350, dur: 0.08, type: 'square', vol: 0.15 },
        { freq: 550, dur: 0.12, type: 'square', vol: 0.2 },
        { freq: 450, dur: 0.1, type: 'square', vol: 0.15 },
      ]);
    });
  }, [throttledPlay]);

  const playEat = useCallback(() => {
    playSequence([
      { freq: 180, dur: 0.04, type: 'sawtooth', vol: 0.1 },
      { freq: 220, dur: 0.04, type: 'sawtooth', vol: 0.1 },
      { freq: 160, dur: 0.04, type: 'sawtooth', vol: 0.1 },
      { freq: 200, dur: 0.06, type: 'sawtooth', vol: 0.1 },
    ]);
  }, []);

  const playPurr = useCallback(() => {
    playSequence([
      { freq: 140, dur: 0.15, type: 'sine', vol: 0.08 },
      { freq: 155, dur: 0.15, type: 'sine', vol: 0.08 },
      { freq: 145, dur: 0.15, type: 'sine', vol: 0.08 },
      { freq: 160, dur: 0.15, type: 'sine', vol: 0.08 },
    ]);
  }, []);

  const playHappy = useCallback(() => {
    playSequence([
      { freq: 523, dur: 0.1, type: 'sine', vol: 0.15 },
      { freq: 659, dur: 0.1, type: 'sine', vol: 0.15 },
      { freq: 784, dur: 0.15, type: 'sine', vol: 0.2 },
    ]);
  }, []);

  const playSad = useCallback(() => {
    playSequence([
      { freq: 400, dur: 0.2, type: 'sine', vol: 0.1 },
      { freq: 350, dur: 0.2, type: 'sine', vol: 0.1 },
      { freq: 300, dur: 0.25, type: 'sine', vol: 0.08 },
    ]);
  }, []);

  const playSplash = useCallback(() => {
    playSequence([
      { freq: 700, dur: 0.04, type: 'sawtooth', vol: 0.08 },
      { freq: 500, dur: 0.06, type: 'sawtooth', vol: 0.08 },
      { freq: 350, dur: 0.08, type: 'sawtooth', vol: 0.06 },
    ]);
  }, []);

  const playSnore = useCallback(() => {
    playSequence([
      { freq: 90, dur: 0.3, type: 'sine', vol: 0.06 },
      { freq: 110, dur: 0.35, type: 'sine', vol: 0.05 },
    ]);
  }, []);

  const playTrick = useCallback(() => {
    playSequence([
      { freq: 523, dur: 0.08, type: 'sine', vol: 0.15 },
      { freq: 659, dur: 0.08, type: 'sine', vol: 0.15 },
      { freq: 784, dur: 0.08, type: 'sine', vol: 0.15 },
      { freq: 1047, dur: 0.15, type: 'sine', vol: 0.2 },
    ]);
  }, []);

  const playCoin = useCallback(() => {
    playSequence([
      { freq: 988, dur: 0.08, type: 'sine', vol: 0.12 },
      { freq: 1319, dur: 0.12, type: 'sine', vol: 0.15 },
    ]);
  }, []);

  const playClick = useCallback(() => {
    playSequence([
      { freq: 800, dur: 0.03, type: 'sine', vol: 0.08 },
    ]);
  }, []);

  const playWhoosh = useCallback(() => {
    playSequence([
      { freq: 300, dur: 0.15, type: 'sawtooth', vol: 0.05 },
      { freq: 150, dur: 0.2, type: 'sawtooth', vol: 0.03 },
    ]);
  }, []);

  const playPop = useCallback(() => {
    playSequence([
      { freq: 600, dur: 0.02, type: 'sine', vol: 0.1 },
      { freq: 400, dur: 0.03, type: 'sine', vol: 0.08 },
    ]);
  }, []);

  return {
    playBark,
    playEat,
    playPurr,
    playHappy,
    playSad,
    playSplash,
    playSnore,
    playTrick,
    playCoin,
    playClick,
    playWhoosh,
    playPop,
  };
}
