import React, { useState } from 'react';
import { ScrollText } from 'lucide-react';
import { PalmLeafText } from './ArtifactGallery.jsx';
import { languageOf, pick, tri, useI18n } from '../i18n/index.js';

/**
 * A wing's exhibition panels: short texts on its themes, each written on a palm leaf, in
 * Tamil or the visitor's language — English, or the museum's chosen language (one switch
 * for all). The first panel introduces the room and spans the full width; the rest sit two to
 * a row on wider screens.
 */
export default function ExhibitionPanels({ panels }) {
  const { T, cl } = useI18n();
  // 'ta', or 'other' for the companion language (English or the chosen one, following the museum).
  const [choice, setChoice] = useState('ta');
  if (!panels?.length) return null;
  const languages = [
    ['ta', 'தமிழ்', 'ta'],
    ['other', languageOf(cl).label, cl],
  ];
  const index = choice === 'ta' ? 0 : 1;
  const language = choice === 'ta' ? 'ta' : cl;
  const text = (texts) => pick(texts, language);
  const tamil = language === 'ta';

  return (
    <section aria-labelledby="exhibition-panels-title">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        <h2 id="exhibition-panels-title" lang={language} className="inline-flex items-center gap-2 font-serif text-xl font-bold tracking-wide text-temple-gold-light">
          <ScrollText size={18} /> {tri('About this Gallery', 'காட்சிக் குறிப்புகள்', 'इस दीर्घा के बारे में', language)}
        </h2>
        <div className="relative grid auto-cols-fr grid-flow-col rounded-full border border-[#8e6e35] bg-black/40 p-1" role="group" aria-label={T('Panel language', 'குறிப்பு மொழி', 'पैनल की भाषा')}>
          <span
            className="absolute inset-y-1 left-1 rounded-full bg-gradient-to-br from-[#f5dc98] to-[#c89a4d] shadow-[0_0_14px_#dfb65866] transition-transform duration-500 ease-spring"
            style={{ width: `calc((100% - 0.5rem) / ${languages.length})`, transform: `translateX(${index * 100}%)` }}
            aria-hidden="true"
          />
          {languages.map(([code, label, labelLang]) => (
            <button
              key={code}
              type="button"
              lang={labelLang}
              onClick={() => setChoice(code)}
              aria-pressed={code === choice}
              className={`relative z-10 min-w-20 cursor-pointer rounded-full px-3 py-1.5 text-xs font-bold transition-colors duration-300 ${code === choice ? 'text-[#21170b]' : 'text-[#e8d6ad] hover:text-[#fff0d0]'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {panels.map((panel, i) => (
          <PalmLeafText key={panel.id} className={i === 0 ? 'lg:col-span-2' : ''}>
            <article lang={language} aria-labelledby={`panel-${panel.id}`} className="flex flex-col gap-2">
              <h3 id={`panel-${panel.id}`} className={`text-center font-bold text-terracotta-deep ${tamil ? 'text-[17px] leading-[1.7]' : 'font-serif text-lg leading-snug'}`}>
                {text(panel.title)}
              </h3>
              {/* The title in the other language, small, beneath. */}
              {tamil ? (
                <p lang={cl} className="text-center font-serif text-xs leading-relaxed text-[#6a3a1a]/80 italic">{pick(panel.title, cl)}</p>
              ) : (
                <p lang="ta" className="text-center text-xs leading-[1.8] text-[#6a3a1a]/80">{panel.title.ta}</p>
              )}
              <p className={`mt-3 ${tamil ? 'text-[15px] leading-[1.95]' : 'font-serif text-base leading-[1.75]'}`}>{text(panel.body)}</p>
            </article>
          </PalmLeafText>
        ))}
      </div>
    </section>
  );
}
