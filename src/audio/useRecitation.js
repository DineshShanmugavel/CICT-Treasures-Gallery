import { useCallback, useEffect, useRef, useState } from 'react';
import { announcePlay, useSoloAudio } from './soloAudio.js';
import { chapterOf } from '../data/kuralData.js';
import { chapterIntroRecording, kuralRecording } from '../data/kuralAudio.js';

/**
 * Recites kurals from public/Audio on a single audio element.
 *
 * - `recite(number, withIntro)` plays that kural, preceded by its chapter's recorded
 *   introduction when `withIntro` is set (and the chapter has one).
 * - `toggle(number)` pauses or resumes; once a recitation has finished, it plays the
 *   kural again (without the introduction).
 * - `state` is { playing, part: 'intro' | 'kural' | null, progress: 0–1 } for the controls.
 *
 * Starting a recitation pauses any other museum recording, and it stops on unmount.
 */
export default function useRecitation() {
  const audioRef = useRef(null);
  if (!audioRef.current && typeof Audio !== 'undefined') audioRef.current = new Audio();
  const queue = useRef([]);
  const [state, setState] = useState({ playing: false, part: null, progress: 0 });
  useSoloAudio(audioRef);

  const playNext = useCallback(() => {
    const audio = audioRef.current;
    const next = queue.current.shift();
    if (!next) {
      setState((current) => ({ ...current, playing: false, progress: current.part ? 1 : 0 }));
      return;
    }
    audio.src = next.src;
    setState({ playing: false, part: next.part, progress: 0 });
    audio.play().catch(() => setState((current) => ({ ...current, playing: false })));
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    const onPlay = () => {
      announcePlay(audio);
      setState((current) => ({ ...current, playing: true }));
    };
    const onPause = () => setState((current) => ({ ...current, playing: false }));
    const onTime = () => setState((current) => ({ ...current, progress: audio.duration ? audio.currentTime / audio.duration : 0 }));
    // A recording that ends — or cannot be played — hands over to the next in the queue.
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', playNext);
    audio.addEventListener('error', playNext);
    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', playNext);
      audio.removeEventListener('error', playNext);
      audio.pause();
    };
  }, [playNext]);

  const recite = useCallback((number, withIntro = false) => {
    const audio = audioRef.current;
    audio.pause();
    queue.current = [
      withIntro && { src: chapterIntroRecording(chapterOf(number).number), part: 'intro' },
      { src: kuralRecording(number), part: 'kural' },
    ].filter((part) => part && part.src);
    if (queue.current.length) {
      playNext();
      return;
    }
    // Not recorded yet: unload the previous kural so it cannot be resumed by mistake.
    audio.removeAttribute('src');
    audio.load();
    setState({ playing: false, part: null, progress: 0 });
  }, [playNext]);

  const toggle = useCallback((number) => {
    const audio = audioRef.current;
    const finished = !audio.getAttribute('src') || (audio.ended && !queue.current.length);
    if (finished) recite(number);
    else if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }, [recite]);

  return { state, recite, toggle };
}

/** Whether a kural has a recitation to play. */
export const hasRecitation = (number) => Boolean(kuralRecording(number));
