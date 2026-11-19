import { useCallback, useEffect, useRef, useState } from 'react';
import { announcePlay, useSoloAudio } from './soloAudio.js';

/**
 * Plays one narration (`src`, or null when none is recorded) on a single audio element,
 * for the RecitationButton: `state` is { playing, progress: 0–1 } and `toggle()` plays,
 * pauses, or — once it has finished — plays it again.
 *
 * A new `src` stops the previous narration — or, with `continueOnChange`, carries on
 * playing the new one from its start if the old one was playing (as when a story's
 * narration switches language). Starting one pauses any other museum recording, and it
 * stops on unmount.
 */
export default function useNarration(src, { continueOnChange = false } = {}) {
  const audioRef = useRef(null);
  if (!audioRef.current && typeof Audio !== 'undefined') audioRef.current = new Audio();
  const [state, setState] = useState({ playing: false, progress: 0 });
  useSoloAudio(audioRef);

  useEffect(() => {
    const audio = audioRef.current;
    const onPlay = () => {
      announcePlay(audio);
      setState((current) => ({ ...current, playing: true }));
    };
    const onPause = () => setState((current) => ({ ...current, playing: false }));
    const onTime = () => setState((current) => ({ ...current, progress: audio.duration ? audio.currentTime / audio.duration : 0 }));
    const onEnded = () => setState({ playing: false, progress: 1 });
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onPause);
    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onPause);
      audio.pause();
    };
  }, []);

  // A new recording: stop, and load it (if there is one) — playing it straight away only
  // when asked to carry on and the previous one was playing.
  useEffect(() => {
    const audio = audioRef.current;
    const carryOn = continueOnChange && !audio.paused && !audio.ended;
    audio.pause();
    if (src) audio.src = src;
    else audio.removeAttribute('src');
    audio.load();
    setState({ playing: false, progress: 0 });
    if (carryOn && src) audio.play().catch(() => setState((current) => ({ ...current, playing: false })));
  }, [src]); // eslint-disable-line react-hooks/exhaustive-deps -- `continueOnChange` is fixed per use

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!src) return;
    if (audio.paused) {
      if (audio.ended) audio.currentTime = 0;
      audio.play().catch(() => setState((current) => ({ ...current, playing: false })));
    } else {
      audio.pause();
    }
  }, [src]);

  return { state, toggle };
}
