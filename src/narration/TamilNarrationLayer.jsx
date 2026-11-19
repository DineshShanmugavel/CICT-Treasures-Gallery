import { useEffect } from 'react';
import { announcePlay } from '../audio/soloAudio.js';
import { mediaUrl } from '../mediaUrl.js';
import { ENGLISH_KEYS, HINDI_KEYS, NARRATION_KEYS, PLAYER_KEYS } from './generated.js';
import { tamilKey } from './tamilKey.js';

/*
 * Puts a small 🔊 button after every Tamil passage on screen that has a recording
 * in public/narration/ta/ (scripts/generateTamilNarration.mjs). A recording is named after the
 * key of the exact text it speaks, so its button appears only beside that passage — wherever
 * the museum shows it (panels, cards, palm leaves, the map, the tutorial …) — and nowhere else.
 *
 * Items with a narration player of their own (artefact close-ups, palm-leaf bundles, books —
 * see generated.js) play their passage there instead, so they get no button here.
 *
 * It watches the page rather than being wired into each component: when an element's text is a
 * recorded passage, an icon-only button (no text, so the passage's own text is unchanged) is
 * appended to it. One shared audio element plays; starting it pauses the museum's other
 * recordings and another recording starting pauses it. The website and the app both use it
 * (the app streams the recordings from the website, like its other media).
 */

const KEYS = NARRATION_KEYS;
const TAMIL = /[஀-௿]/;
const LATIN = /[A-Za-z]{3}/;
const DEVANAGARI = /[ऀ-ॿ]/;
const CANDIDATES = 'p, li, blockquote, figcaption, dd, td, h1, h2, h3, h4, h5, h6, span, div';
const BUTTON = 'data-tamil-narration';
const ICON_PLAY =
  '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4.7a.7.7 0 0 0-1.2-.5L6.4 7.6A1.4 1.4 0 0 1 5.4 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.4a1.4 1.4 0 0 1 1 .4l3.4 3.4a.7.7 0 0 0 1.2-.5z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.4 18.4a9 9 0 0 0 0-12.8"/></svg>';
const ICON_PAUSE =
  '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';
const LABEL_PLAY = 'ஒலியைக் கேட்க (Listen)';
const LABEL_PAUSE = 'நிறுத்து (Pause)';

// A button's id is "ta/<key>" (a Tamil passage), or "en/<key>" / "hi/<key>" (a room's English / Hindi description).
const url = (id) => mediaUrl(`/narration/${id}.mp3`);

let audio = null;
let playingKey = null;

function paint() {
  for (const button of document.querySelectorAll(`[${BUTTON}]`)) {
    const on = button.getAttribute(BUTTON) === playingKey && audio && !audio.paused;
    if (button.dataset.state === (on ? 'on' : 'off')) continue;
    button.dataset.state = on ? 'on' : 'off';
    button.innerHTML = on ? ICON_PAUSE : ICON_PLAY;
    button.setAttribute('aria-pressed', String(on));
    const voice = button.getAttribute(BUTTON).slice(0, 2);
    const label = { en: on ? 'Pause' : 'Listen (English)', hi: on ? 'रोकें (Pause)' : 'सुनें (Listen)' }[voice] ?? (on ? LABEL_PAUSE : LABEL_PLAY);
    button.setAttribute('aria-label', label);
    button.title = label;
  }
}

function player() {
  if (audio) return audio;
  audio = new Audio();
  audio.preload = 'none';
  audio.addEventListener('play', () => {
    announcePlay(audio);
    paint();
  });
  for (const type of ['pause', 'ended', 'error']) audio.addEventListener(type, paint);
  window.addEventListener('museum:audio-play', (event) => {
    if (event.detail !== audio) audio.pause();
  });
  return audio;
}

function toggle(key) {
  const a = player();
  if (playingKey === key && a.getAttribute('src') && !a.ended) {
    if (a.paused) a.play().catch(() => {});
    else a.pause();
    return;
  }
  a.pause();
  playingKey = key;
  a.src = url(key);
  a.play().catch(paint);
  paint();
}

function makeButton(key) {
  const button = document.createElement('span');
  button.setAttribute(BUTTON, key);
  button.setAttribute('role', 'button');
  button.tabIndex = 0;
  button.className = 'tamil-narration-button';
  const activate = (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggle(key);
  };
  button.addEventListener('click', activate);
  button.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') activate(event);
    else event.stopPropagation();
  });
  // Keep a press on the button from starting drags, swipes or page turns underneath it.
  for (const type of ['pointerdown', 'mousedown', 'touchstart']) button.addEventListener(type, (event) => event.stopPropagation(), { passive: true });
  return button;
}

/** Finds the recorded passages on screen and gives each (and only each) its button. */
function scan() {
  // Start from the Tamil (and longer English) text on the page and try the few elements around each piece.
  const seen = new Set();
  const matches = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) =>
      TAMIL.test(node.data) ||
      (ENGLISH_KEYS.size && node.data.length >= 20 && LATIN.test(node.data)) ||
      (HINDI_KEYS.size && node.data.length >= 20 && DEVANAGARI.test(node.data)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
  });
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    let element = node.parentElement;
    for (let depth = 0; element && element !== document.body && depth < 4; depth++, element = element.parentElement) {
      if (seen.has(element)) break;
      seen.add(element);
      if (!element.matches(CANDIDATES) || element.closest(`[${BUTTON}]`)) continue;
      const text = element.textContent;
      if (text.length > 8000) break;
      if (text.length < 40) continue;
      // Text cut short to fit (one-line rows, clamped cards) would clip the button out of reach.
      if (isClipped(element)) continue;
      const key = tamilKey(text);
      // A passage an item's own player reads (artefact, palm-leaf bundle, book) gets no second button.
      if (KEYS.has(key) && !PLAYER_KEYS.has(key)) matches.set(element, `ta/${key}`);
      // A room's English description: its English narration (the room's title, then the description).
      else if (ENGLISH_KEYS.has(key)) matches.set(element, `en/${key}`);
      // …and a room's Hindi description: its Hindi narration.
      else if (HINDI_KEYS.has(key)) matches.set(element, `hi/${key}`);
    }
  }
  // The innermost element holding the passage gets the button (a wrapper has the same text).
  const targets = new Map();
  for (const [element, key] of matches) {
    let inner = false;
    for (const [other, otherKey] of matches) {
      if (other !== element && otherKey === key && element.contains(other)) {
        inner = true;
        break;
      }
    }
    if (!inner) targets.set(element, key);
  }
  // Remove buttons whose passage has changed or gone.
  for (const button of document.querySelectorAll(`[${BUTTON}]`)) {
    if (targets.get(button.parentElement) !== button.getAttribute(BUTTON)) button.remove();
  }
  for (const [element, key] of targets) {
    const existing = [...element.children].find((child) => child.getAttribute(BUTTON) === key);
    if (!existing) element.appendChild(makeButton(key));
  }
  hideCovered();
  paint();
}

/** Whether an element's text is truncated with an ellipsis or a line clamp. */
function isClipped(element) {
  const style = window.getComputedStyle(element);
  return style.textOverflow === 'ellipsis' || (style.webkitLineClamp && style.webkitLineClamp !== 'none');
}

/**
 * A button something else covers on screen (a cabinet's closed glass door, a card stacked on
 * top) cannot be pressed — a click would open the thing above instead — so it is hidden until
 * it is uncovered (checked again whenever the page changes or scrolls).
 */
function hideCovered() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  for (const button of document.querySelectorAll(`[${BUTTON}]`)) {
    button.style.visibility = '';
    const r = button.getBoundingClientRect();
    if (!r.width || r.bottom < 0 || r.right < 0 || r.top > height || r.left > width) continue; // off screen: decided when it comes into view
    const top = document.elementFromPoint(Math.min(width - 1, r.left + r.width / 2), Math.min(height - 1, r.top + r.height / 2));
    const covered = top && top !== button && !button.contains(top);
    if (covered) button.style.visibility = 'hidden';
  }
}

export default function TamilNarrationLayer() {
  useEffect(() => {
    if (!KEYS.size && !ENGLISH_KEYS.size && !HINDI_KEYS.size) return undefined;
    let timer = 0;
    const schedule = () => {
      if (timer) return;
      timer = window.setTimeout(() => {
        timer = 0;
        scan();
      }, 250);
    };
    const observer = new MutationObserver((records) => {
      // Ignore the layer's own changes (adding a button, swapping its icon).
      if (records.every((record) => (record.target.closest?.(`[${BUTTON}]`) || [...record.addedNodes, ...record.removedNodes].every((node) => node.nodeType === 1 && node.hasAttribute(BUTTON))) && record.type !== 'characterData')) return;
      schedule();
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    // Covering changes as panels scroll, open and animate: check again after they settle.
    let coverTimer = 0;
    const recheck = () => {
      window.clearTimeout(coverTimer);
      coverTimer = window.setTimeout(hideCovered, 200);
    };
    window.addEventListener('scroll', recheck, { capture: true, passive: true });
    window.addEventListener('resize', recheck);
    document.addEventListener('transitionend', recheck, true);
    document.addEventListener('animationend', recheck, true);
    // Overlays that slide in by script (the glass doors) fire no event: a light check meanwhile.
    const poll = window.setInterval(() => {
      if (document.querySelector(`[${BUTTON}]`)) hideCovered();
    }, 1500);
    schedule();
    return () => {
      observer.disconnect();
      window.clearTimeout(coverTimer);
      window.clearInterval(poll);
      window.removeEventListener('scroll', recheck, { capture: true });
      window.removeEventListener('resize', recheck);
      document.removeEventListener('transitionend', recheck, true);
      document.removeEventListener('animationend', recheck, true);
      window.clearTimeout(timer);
      audio?.pause();
    };
  }, []);
  return null;
}
