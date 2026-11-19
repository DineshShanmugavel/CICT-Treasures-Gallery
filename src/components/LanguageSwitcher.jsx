import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, Globe2, Search } from 'lucide-react';
import { INDIAN_LANGUAGES, LANGUAGES, MORE_LANGUAGES, PRIMARY_CODES, WORLD_LANGUAGES, languageOf, useI18n } from '../i18n/index.js';

const PRIMARY = LANGUAGES.filter(({ code }) => PRIMARY_CODES.includes(code));
const MENU_WIDTH = 300;
const MORE_COUNT = MORE_LANGUAGES.length;
/** The menu's sections, in order; the search filters within each. */
const SECTIONS = [
  { id: 'india', languages: INDIAN_LANGUAGES },
  { id: 'world', languages: WORLD_LANGUAGES },
];

/**
 * The museum's language toggle: English · தமிழ் · हिन्दी, then a "+N ▾" button that opens a
 * searchable menu of every other language — the other twenty of the Eighth Schedule, then the
 * world's languages — each in its own script and in English. A gold thumb slides to the chosen
 * language; when that is in the menu, the thumb sits on the menu button, which then shows its name. Switches the whole museum at
 * once (remembered in localStorage by the i18n store). `compact` shows short forms on phones.
 *
 * The menu is drawn in a portal, fixed beneath the button, so no header can clip it.
 */
export default function LanguageSwitcher({ className = '', compact = false }) {
  const { lang, setLang, T } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [position, setPosition] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const slotsRef = useRef(null);
  const [thumb, setThumb] = useState(null);
  const listId = useId();

  const inMore = !PRIMARY_CODES.includes(lang);
  const index = inMore ? PRIMARY.length : PRIMARY.findIndex(({ code }) => code === lang);
  const chosen = languageOf(lang);

  // The thumb follows the chosen slot; the slots are as wide as their labels, so it is measured.
  useLayoutEffect(() => {
    const slots = slotsRef.current;
    if (!slots) return undefined;
    const measure = () => {
      const button = slots.querySelectorAll('[data-slot]')[index];
      if (button) setThumb({ left: button.offsetLeft, width: button.offsetWidth });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(slots);
    document.fonts?.ready?.then(measure);
    return () => observer.disconnect();
  }, [index, lang]);

  const term = query.trim().toLocaleLowerCase();
  // The matches, section by section; `results` is them all in order, for the arrow keys.
  const sections = useMemo(() => {
    const matches = ({ label, name, code }) =>
      !term || name.toLocaleLowerCase().includes(term) || label.toLocaleLowerCase().includes(term) || code.toLocaleLowerCase().startsWith(term);
    let offset = 0;
    return SECTIONS.map((section) => {
      const languages = section.languages.filter(matches);
      const start = offset;
      offset += languages.length;
      return { ...section, languages, start };
    }).filter(({ languages }) => languages.length);
  }, [term]);
  const results = useMemo(() => sections.flatMap(({ languages }) => languages), [sections]);

  const place = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const left = Math.min(Math.max(8, rect.right - MENU_WIDTH), window.innerWidth - MENU_WIDTH - 8);
    const below = window.innerHeight - rect.bottom - 16;
    setPosition({ top: rect.bottom + 8, left, maxHeight: Math.max(220, Math.min(460, below)) });
  };

  useLayoutEffect(() => {
    if (!open) return undefined;
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    setQuery('');
    setActiveIndex(Math.max(0, SECTIONS.flatMap(({ languages }) => languages).findIndex(({ code }) => code === lang)));
    const frame = requestAnimationFrame(() => searchRef.current?.focus());
    const onPointerDown = (event) => {
      if (!menuRef.current?.contains(event.target) && !triggerRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      // Caught first, so Escape closes this menu and not a room or view beneath it.
      event.stopPropagation();
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('keydown', onKeyDown, true);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('keydown', onKeyDown, true);
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the highlighted language in view as the arrow keys move it.
  useEffect(() => {
    if (open) menuRef.current?.querySelector(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const choose = (code) => {
    setLang(code);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onSearchKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((i) => Math.min(results.length - 1, i + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (event.key === 'Enter' && results[activeIndex]) {
      event.preventDefault();
      choose(results[activeIndex].code);
    }
  };

  const slot = `relative z-10 cursor-pointer rounded-full px-2 py-0.5 text-xs leading-[1.6] font-bold whitespace-nowrap transition-colors duration-300`;
  const slotColour = (on) => (on ? 'text-[#21170b]' : 'text-[#e8d6ad] hover:text-[#fff0d0]');

  return (
    <div
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border border-[#8e6e35] bg-[#241b10]/90 py-1 pr-1 pl-2.5 backdrop-blur ${className}`}
      role="group"
      aria-label={T('Language', 'மொழி', 'भाषा')}
    >
      <Globe2 size={14} className="shrink-0 text-[#c9a660]" aria-hidden="true" />
      <div ref={slotsRef} className="relative flex items-center">
        {thumb && (
          <span
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-br from-[#f5dc98] to-[#c89a4d] shadow-[0_0_12px_#dfb65855] transition-[translate,width] duration-300 ease-spring"
            style={{ width: thumb.width, translate: `${thumb.left}px 0` }}
            aria-hidden="true"
          />
        )}
        {PRIMARY.map(({ code, label, short, name }) => (
          <button
            key={code}
            type="button"
            lang={code}
            data-slot
            onClick={() => setLang(code)}
            aria-pressed={code === lang}
            aria-label={`${label} (${name})`}
            title={name}
            className={`${slot} ${slotColour(code === lang)}`}
          >
            {compact ? <><span className="sm:hidden">{short}</span><span className="max-sm:hidden">{label}</span></> : label}
          </button>
        ))}
        <button
          ref={triggerRef}
          type="button"
          data-slot
          onClick={() => setOpen((value) => !value)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-label={inMore ? `${chosen.label} (${chosen.name}) — ${T('More languages', 'மேலும் மொழிகள்', 'और भाषाएँ')}` : T(`${MORE_COUNT} more languages`, `மேலும் ${MORE_COUNT} மொழிகள்`, `${MORE_COUNT} और भाषाएँ`)}
          title={T('More languages', 'மேலும் மொழிகள்', 'और भाषाएँ')}
          className={`${slot} ${slotColour(inMore)} inline-flex items-center justify-center gap-0.5`}
        >
          {inMore ? (
            <span lang={chosen.code} dir={chosen.dir ?? 'ltr'} className="max-w-[7rem] truncate">
              {compact ? <><span className="sm:hidden">{chosen.short}</span><span className="max-sm:hidden">{chosen.label}</span></> : chosen.label}
            </span>
          ) : (
            <span>+{MORE_COUNT}</span>
          )}
          <ChevronDown size={12} className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
      </div>

      {open && position && createPortal(
        <div
          ref={menuRef}
          className="fixed z-[5000] flex animate-pop-in flex-col overflow-hidden rounded-2xl border border-[#8e6e35] bg-[linear-gradient(160deg,#2c2013f2,#170f08f5)] text-[#f3e3c3] shadow-[0_22px_48px_#000c,inset_0_0_0_1px_#d4a64a22] backdrop-blur-md"
          style={{ top: position.top, left: position.left, width: MENU_WIDTH, maxHeight: position.maxHeight }}
        >
          <div className="border-b border-[#8e6e35]/60 p-2.5">
            <p className="px-1 pb-2 text-[10px] font-bold tracking-[0.18em] text-[#c9a660] uppercase">
              {T(`${MORE_COUNT} more languages`, `மேலும் ${MORE_COUNT} மொழிகள்`, `${MORE_COUNT} और भाषाएँ`)}
            </p>
            <label className="flex items-center gap-2 rounded-full border border-[#8e6e35]/70 bg-black/30 px-3 py-1.5 focus-within:border-[#e8c77a] focus-within:shadow-[0_0_12px_#d4a64a44]">
              <Search size={14} className="shrink-0 text-[#c9a660]" aria-hidden="true" />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={onSearchKeyDown}
                placeholder={T('Search languages…', 'மொழியைத் தேடுக…', 'भाषा खोजें…')}
                aria-label={T('Search languages', 'மொழியைத் தேடுக', 'भाषा खोजें')}
                aria-controls={listId}
                className="min-w-0 flex-1 appearance-none border-none bg-transparent p-0 text-sm text-[#fff3dc] outline-none placeholder:text-[#a8916a]"
              />
            </label>
          </div>
          <ul id={listId} role="listbox" aria-label={T('More languages', 'மேலும் மொழிகள்', 'और भाषाएँ')} className="min-h-0 flex-1 overflow-y-auto p-1.5 [scrollbar-color:#8e6e35_transparent] [scrollbar-width:thin]">
            {sections.map(({ id, languages, start }) => (
              <React.Fragment key={id}>
                <li role="presentation" className="mt-1 border-t border-[#8e6e35]/40 px-3 pt-2.5 pb-1 text-[10px] font-bold tracking-[0.18em] text-[#c9a660] uppercase first:mt-0 first:border-t-0 first:pt-1">
                  {id === 'india' ? T('Languages of India', 'இந்திய மொழிகள்', 'भारत की भाषाएँ') : T('Languages of the world', 'உலக மொழிகள்', 'विश्व की भाषाएँ')}
                  <span className="ml-1.5 font-semibold tracking-normal text-[#a8916a]">{languages.length}</span>
                </li>
                {languages.map(({ code, label, name, dir }, n) => {
                  const i = start + n;
                  return (
              <li key={code} role="option" aria-selected={code === lang} data-index={i}>
                <button
                  type="button"
                  onClick={() => choose(code)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
                    code === lang ? 'bg-gradient-to-br from-[#f5dc98] to-[#c89a4d] text-[#21170b]' : i === activeIndex ? 'bg-[#e8c77a]/15' : 'hover:bg-[#e8c77a]/10'
                  }`}
                >
                  <span lang={code} dir={dir ?? 'ltr'} className="min-w-0 flex-1 truncate text-[15px] leading-[1.7] font-semibold">{label}</span>
                  <span className={`shrink-0 text-xs ${code === lang ? 'text-[#3a2a12]' : 'text-[#bfa982]'}`}>{name}</span>
                  {code === lang && <Check size={15} className="shrink-0" aria-hidden="true" />}
                </button>
              </li>
                  );
                })}
              </React.Fragment>
            ))}
            {!results.length && <li className="px-3 py-3 text-xs text-[#bfa982]">{T('No language matches.', 'பொருந்தும் மொழி இல்லை.', 'कोई भाषा नहीं मिली।')}</li>}
          </ul>
        </div>,
        document.body,
      )}
    </div>
  );
}
