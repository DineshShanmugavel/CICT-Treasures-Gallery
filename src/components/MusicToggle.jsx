import React, { useEffect, useState } from 'react';
import { Music, VolumeX } from 'lucide-react';
import { isMusicOn, onMusicChange, setMusicOn } from '../audio/ambience.js';
import { useI18n } from '../i18n/index.js';

const springy = 'transition-[scale,translate,border-color,background-color,box-shadow] duration-300 ease-spring hover:scale-110 active:scale-95';

/**
 * Turns the background flute music on and off; the choice is kept (ambience.js) through
 * every hall and room, and on the next visit. `variant` 'bar' is a pill in the hallway's
 * navigation bar; 'tab' a small tab on the right edge, under the guide's, for the views
 * that cover the bar (a room, Then & Now, the map of Tamilakam).
 */
export default function MusicToggle({ variant = 'bar', className = '' }) {
  const [on, setOn] = useState(isMusicOn);
  useEffect(() => onMusicChange(setOn), []);
  const { T } = useI18n();
  const label = on ? T('Music on', 'இசை இயக்கத்தில்', 'संगीत चालू') : T('Music off', 'இசை அணைப்பில்', 'संगीत बंद');
  const toggleLabel = on ? T('Turn the music off', 'இசையை நிறுத்து', 'संगीत बंद करें') : T('Turn the music on', 'இசையை இயக்கு', 'संगीत चालू करें');
  const icon = on ? <Music size={15} className="animate-pulse [animation-duration:3s]" /> : <VolumeX size={15} className="opacity-75" />;

  if (variant === 'tab') {
    return (
      <button
        type="button"
        onClick={() => setMusicOn(!on)}
        aria-pressed={on}
        aria-label={toggleLabel}
        className={`group fixed top-[calc(50%+46px)] right-0 z-[1500] flex -translate-y-1/2 cursor-pointer items-center gap-1.5 rounded-l-full border border-r-0 border-temple-gold/70 bg-[#140d07]/85 py-2 pr-2 pl-2.5 text-temple-gold-light shadow-[0_8px_24px_#000a] backdrop-blur transition-[padding] duration-300 hover:pr-3 ${className}`}
      >
        {icon}
        <span className="max-w-0 overflow-hidden text-xs font-semibold whitespace-nowrap transition-[max-width] duration-300 group-hover:max-w-24 group-focus-visible:max-w-24">{label}</span>
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={() => setMusicOn(!on)}
      aria-pressed={on}
      aria-label={toggleLabel}
      title={on ? T('Background music: on', 'பின்னணி இசை: இயக்கத்தில்', 'पृष्ठभूमि संगीत: चालू') : T('Background music: off', 'பின்னணி இசை: அணைப்பில்', 'पृष्ठभूमि संगीत: बंद')}
      className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-xs backdrop-blur sm:px-4 ${springy} ${
        on ? 'border-[#8e6e35] bg-[#241b10]/90 text-[#ead8ad] hover:border-[#f4d792]' : 'border-[#5a4526] bg-[#1a130b]/90 text-[#a8956e] hover:border-[#f4d792]'
      } ${className}`}
    >
      {icon} <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
