import { useEffect } from 'react';

/*
 * One voice at a time: whenever a museum recording starts (the Thiruvalluvar narration,
 * a kural's recitation, …), every other one pauses.
 */
const PLAY_EVENT = 'museum:audio-play';

/** Call when `audio` starts playing, so the museum's other recordings pause. */
export function announcePlay(audio) {
  window.dispatchEvent(new CustomEvent(PLAY_EVENT, { detail: audio }));
}

/** Pauses the audio element in `audioRef` whenever another museum recording starts. */
export function useSoloAudio(audioRef) {
  useEffect(() => {
    const onOtherPlay = (event) => {
      if (event.detail !== audioRef.current) audioRef.current?.pause();
    };
    window.addEventListener(PLAY_EVENT, onOtherPlay);
    return () => window.removeEventListener(PLAY_EVENT, onOtherPlay);
  }, [audioRef]);
}
