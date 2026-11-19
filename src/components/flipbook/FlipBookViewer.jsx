import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, BookOpen, Download, ExternalLink, FileText, Info, Loader2, X } from 'lucide-react';
import FlipBook from './FlipBook.jsx';
import { usePdfDocument, usePdfPages } from './usePdfPages.js';
import AudioPlayer from '../AudioPlayer.jsx';
import { KolamCorner, KolamDivider, KolamFrame, TempleBand } from '../HeritageMotifs.jsx';
import { bookAudio, describeBook } from '../../data/bookInfo.js';
import CICT_LOGO from '../../assets/cict-logo.jpg';
import { tri, useI18n } from '../../i18n/index.js';

const TEXT_PAGE_ASPECT = 0.72;

function Spinner({ label }) {
  return (
    <div className="grid size-full place-items-center text-[#8a6a3c]">
      <span className="flex flex-col items-center gap-2 text-xs">
        <Loader2 size={22} className="animate-spin" />
        {label}
      </span>
    </div>
  );
}

function PdfPage({ pages, index }) {
  const url = pages.get(index);
  const { ensure } = pages;
  useEffect(() => {
    ensure(index);
  }, [ensure, index]);
  return url ? (
    <img src={url} alt={`Page ${index + 1}`} draggable={false} decoding="async" className="size-full bg-white object-contain" />
  ) : (
    <Spinner label={tri(`Page ${index + 1}`, `பக்கம் ${index + 1}`, `पृष्ठ ${index + 1}`)} />
  );
}

/** Leather cover generated for text catalogues. */
function CoverPage({ book }) {
  const { L, T, cl } = useI18n();
  return (
    <div className="@container relative flex size-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_40%_30%,#8a2a20,#4a120d_70%,#2e0a07)] p-[10%] text-center">
      <KolamFrame className="text-[#d8b56b]/80" size="size-[18cqw]" />
      <img src={CICT_LOGO} alt="" className="size-[22cqw] rounded-full bg-white object-cover shadow-[0_0_0_2px_#d8b56b,0_6px_18px_#000a]" />
      <p className="mt-[6cqw] text-[clamp(10px,4.4cqw,18px)] font-bold text-[#f0cf82]">{book.tamil}</p>
      <h3 lang={cl} className="mt-[1.5cqw] font-serif text-[clamp(16px,8cqw,34px)] leading-tight font-semibold text-[#fbe7b5]">{L(book.title)}</h3>
      <span className="mt-[5cqw] h-px w-1/3 bg-[#d8b56b]" />
      <p className="mt-[4cqw] text-[clamp(7px,2.6cqw,11px)] tracking-[0.25em] text-[#e8c77a]/80">{T('CICT CLASSICAL TAMIL TREASURES GALLERY', 'செம்மொழித் தமிழ்க் கருவூலக் காட்சியகம்', 'CICT शास्त्रीय तमिल निधि दीर्घा')}</p>
    </div>
  );
}

/** A parchment page for text catalogues. */
function TextPage({ page, number }) {
  return (
    <div className="@container relative flex size-full flex-col bg-[radial-gradient(ellipse_at_50%_40%,#f8eed6,#ecdcb6_85%)] px-[9%] pt-[8%] pb-[6%] text-[#3b2510]">
      <TempleBand className="absolute inset-x-0 top-[2.5%] text-[#a07a3c]/55" />
      <h3 className="mt-[4cqw] font-serif text-[clamp(14px,6.6cqw,30px)] leading-tight font-bold text-[#5a2a10]">{page.heading}</h3>
      <span className="mt-[3cqw] mb-[4cqw] h-px w-1/4 bg-[#a07a3c]" />
      <div className="min-h-0 flex-1 space-y-[2.5cqw] overflow-hidden text-[clamp(10px,4cqw,17px)] leading-relaxed">
        {page.body.split('\n').map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <p className="text-center font-serif text-[clamp(9px,3.4cqw,14px)] text-[#8a6a3c]">— {number} —</p>
    </div>
  );
}

function downloadText(book) {
  const text = [book.title, book.tamil, '', ...book.pages.flatMap((page) => [page.heading, '', page.body, ''])].filter((line) => line !== undefined).join('\n');
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${book.id}.txt`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * "About this book": the bilingual description and the per-book narration. A side
 * column on wide screens; a sliding panel over the pages on phones.
 */
function AboutPanel({ book, open, onClose }) {
  const { L, T, cl, lang } = useI18n();
  const description = describeBook(book);
  return (
    <aside
      id="book-about"
      aria-label={T('About this book', 'நூல் அறிமுகம்', 'पुस्तक परिचय')}
      className={`bg-teak absolute inset-y-0 right-0 z-10 w-[min(100%,24rem)] overflow-y-auto border-l-2 border-temple-gold/50 p-5 shadow-[-12px_0_30px_#000a] transition-transform duration-500 ease-spring lg:static lg:shrink-0 lg:shadow-none ${
        open ? 'translate-x-0' : 'pointer-events-none translate-x-full lg:hidden'
      }`}
    >
      <KolamCorner className="pointer-events-none absolute top-2 right-2 size-12 -scale-x-100 text-temple-gold/50" />
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] font-bold tracking-[0.25em] text-temple-gold"><span lang={cl}>{L('ABOUT THIS BOOK', 'पुस्तक परिचय')}</span> · <span lang="ta">நூல் அறிமுகம்</span></p>
        <button type="button" onClick={onClose} aria-label={T('Close about panel', 'அறிமுகத்தை மூடு', 'परिचय बंद करें')} className="cursor-pointer rounded-full p-1 text-temple-gold-light transition hover:bg-white/10 lg:hidden">
          <X size={16} />
        </button>
      </div>
      {book.tamil && <h3 className="mt-3 text-lg leading-snug font-bold text-[#e9a27a]">{book.tamil}</h3>}
      <p lang={cl} className="font-serif text-xl leading-tight font-semibold text-temple-gold-light">{L(book.title)}</p>
      {book.year && <span className="mt-2 inline-block rounded-full border border-temple-gold/60 px-2.5 py-0.5 text-[10px] font-semibold text-temple-gold-light">{book.year}</span>}

      <section lang="ta" className="mt-4">
        <p className="text-[10px] font-bold tracking-[0.2em] text-[#e9a27a]">தமிழில்</p>
        <p className="mt-1 text-sm leading-relaxed text-[#f3e3c3]">{description.ta}</p>
      </section>
      <KolamDivider className="my-4 block text-temple-gold/50" />
      <section lang={cl}>
        <p className="text-[10px] font-bold tracking-[0.2em] text-[#e9a27a]">{L('IN ENGLISH', 'हिन्दी में')}</p>
        <p className="mt-1 font-serif text-base leading-relaxed text-[#f3e3c3]">{L(description)}</p>
      </section>

      <div className="mt-5">
        {Object.keys(bookAudio(book)).length > 0 && <AudioPlayer key={`${book.id}-${lang}`} tracks={bookAudio(book)} defaultLanguage={bookAudio(book)[lang] ? lang : Object.keys(bookAudio(book))[0]} />}
      </div>
    </aside>
  );
}

/**
 * Modal reader with page-turn animation for rare PDFs (rendered with pdf.js) and
 * for text catalogues (`book.pages`), with an "About" panel in Tamil and English,
 * per-book narration, and download / open-original actions. PDFs can also be read in
 * the browser's own viewer, embedded with an <iframe>. `initialPage` (0-based) opens a
 * PDF at a given page in either view.
 */
export default function FlipBookViewer({ book, onClose, initialPage = 0 }) {
  const { L, T, cl } = useI18n();
  const [aboutOpen, setAboutOpen] = useState(() => window.innerWidth >= 1024);
  const isPdf = Boolean(book.pdfUrl);
  // 'flip' renders pages with pdf.js; 'embed' hands the file to the browser's PDF viewer.
  const [view, setView] = useState('flip');
  const embedded = isPdf && view === 'embed';
  const { doc, aspect: pdfAspect, error } = usePdfDocument(isPdf && !embedded ? book.pdfUrl : null);
  const [pageWidth, setPageWidth] = useState(400);
  const pdfPages = usePdfPages(doc, pageWidth);
  const closeButtonRef = useRef(null);
  const fileName = isPdf ? decodeURI(book.pdfUrl.split('/').pop()) : `${book.id}.txt`;

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeButtonRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  const { ensure } = pdfPages;
  const preload = useCallback((indices) => indices.forEach(ensure), [ensure]);

  const pageCount = isPdf ? doc?.numPages ?? 0 : book.pages.length + 1;
  const renderPage = isPdf
    ? (index) => <PdfPage pages={pdfPages} index={index} />
    : (index) => (index === 0 ? <CoverPage book={book} /> : <TextPage page={book.pages[index - 1]} number={index} />);

  const actionClass = 'inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold no-underline transition sm:px-4';

  return (
    <div
      className="fixed inset-0 z-[1300] grid place-items-center bg-black/85 p-2 backdrop-blur-sm sm:p-5"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="flipbook-title"
        className="flex h-[95dvh] w-full animate-pop-in max-w-7xl flex-col overflow-hidden rounded-xl border border-[#b9904a] bg-[radial-gradient(ellipse_at_50%_40%,#2e1f12,#120c07_75%)] shadow-[0_30px_90px_#000]"
      >
        <header className="bg-teak relative flex items-center gap-2 border-b-2 border-temple-gold/50 px-3 py-2.5 sm:gap-3 sm:px-4">
          <div className="min-w-0 flex-1">
            <h2 id="flipbook-title" lang={cl} className="truncate font-serif text-lg font-bold tracking-wide text-temple-gold-light sm:text-xl">{L(book.title)}</h2>
            <p className="truncate text-[11px] font-semibold text-[#e9a27a]">{[book.tamil, book.year].filter(Boolean).join(' · ') || fileName}</p>
          </div>
          <button
            type="button"
            onClick={() => setAboutOpen((open) => !open)}
            aria-expanded={aboutOpen}
            aria-controls="book-about"
            className={`${actionClass} ${aboutOpen ? 'border-temple-gold-light bg-temple-gold/20 text-temple-gold-light' : 'border-[#70552d] bg-[#1b130b] text-[#dfc89c]'} hover:scale-105 active:scale-95`}
          >
            <Info size={15} /> <span className="hidden md:inline"><span lang={cl}>{L('About', 'परिचय')}</span> · <span lang="ta">அறிமுகம்</span></span>
          </button>
          {isPdf && (
            <div className="flex shrink-0 rounded-full border border-temple-gold/60 bg-teak-dark/85 p-1" role="group" aria-label={T('Reading view', 'படிக்கும் முறை', 'पढ़ने का दृश्य')}>
              {[
                ['flip', BookOpen, T('Flip-book', 'புரட்டும் நூல்', 'फ़्लिप-बुक')],
                ['embed', FileText, T('PDF viewer', 'PDF பார்வையாளர்', 'PDF व्यूअर')],
              ].map(([key, Icon, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setView(key)}
                  aria-pressed={view === key}
                  aria-label={label}
                  className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition duration-300 ease-spring active:scale-95 ${
                    view === key ? 'bg-gradient-to-br from-temple-gold-light to-temple-gold text-teak-dark' : 'text-[#ead8ad] hover:text-temple-gold-light'
                  }`}
                >
                  <Icon size={14} /> <span className="hidden lg:inline">{label}</span>
                </button>
              ))}
            </div>
          )}
          {isPdf && (
            <a href={book.pdfUrl} target="_blank" rel="noreferrer" aria-label={T('Open original PDF in a new tab', 'மூல PDF-ஐப் புதிய தாவலில் திற', 'मूल PDF नए टैब में खोलें')} className={`${actionClass} border-[#70552d] bg-[#1b130b] text-[#dfc89c] hover:border-[#d8b56b]`}>
              <ExternalLink size={15} /> <span className="hidden md:inline">{T('Original', 'மூலம்', 'मूल')}</span>
            </a>
          )}
          {isPdf ? (
            <a href={book.pdfUrl} download={fileName} className={`${actionClass} border-[#e4c274] bg-gradient-to-br from-[#f1d58d] to-[#c89b4d] text-[#211609] hover:shadow-[0_0_18px_#dfb65866]`}>
              <Download size={15} /> <span className="hidden sm:inline">{T('Download', 'பதிவிறக்கு', 'डाउनलोड')}</span>
            </a>
          ) : (
            <button type="button" onClick={() => downloadText(book)} className={`${actionClass} border-[#e4c274] bg-gradient-to-br from-[#f1d58d] to-[#c89b4d] text-[#211609] hover:shadow-[0_0_18px_#dfb65866]`}>
              <Download size={15} /> <span className="hidden sm:inline">{T('Download', 'பதிவிறக்கு', 'डाउनलोड')}</span>
            </button>
          )}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={T('Close reader', 'வாசிப்பியை மூடு', 'रीडर बंद करें')}
            className="touch-target grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border border-[#70552d] bg-[#1b130b] text-[#dfc89c] transition duration-300 ease-spring hover:scale-105 active:scale-95 hover:border-[#d8b56b] hover:text-[#f4d792]"
          >
            <X size={18} />
          </button>
        </header>

        <div className="relative flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col">
        {embedded ? (
          <iframe
            key={book.pdfUrl}
            src={`${book.pdfUrl}#page=${initialPage + 1}`}
            title={`${L(book.title)} (PDF)`}
            className="min-h-0 w-full flex-1 border-0 bg-[#2b2520]"
          />
        ) : error ? (
          <div className="grid flex-1 place-items-center p-6 text-center">
            <div className="max-w-sm">
              <AlertTriangle className="mx-auto text-[#e8b45a]" size={30} />
              <p className="mt-3 font-serif text-xl text-[#fff0d0]">{T('This volume could not be opened as a flip-book.', 'இந்நூலைப் புரட்டும் நூலாகத் திறக்க இயலவில்லை.', 'यह ग्रंथ फ़्लिप-बुक के रूप में नहीं खुल सका।')}</p>
              <p className="mt-2 text-xs text-[#c9b89b]">{T('You can still read it in your browser’s PDF viewer or download it.', 'உலாவியின் PDF பார்வையாளரில் படிக்கலாம் அல்லது பதிவிறக்கலாம்.', 'आप इसे अपने ब्राउज़र के PDF व्यूअर में पढ़ सकते हैं या डाउनलोड कर सकते हैं।')}</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <button type="button" onClick={() => setView('embed')} className={`${actionClass} border-[#e4c274] bg-gradient-to-br from-[#f1d58d] to-[#c89b4d] text-[#211609]`}>
                  <FileText size={15} /> {T('Read in the PDF viewer', 'PDF பார்வையாளரில் படி', 'PDF व्यूअर में पढ़ें')}
                </button>
                <a href={book.pdfUrl} target="_blank" rel="noreferrer" className={`${actionClass} border-[#e4c274] text-[#f1d58d]`}>
                  <ExternalLink size={15} /> {T('Open in a new tab', 'புதிய தாவலில் திற', 'नए टैब में खोलें')}
                </a>
              </div>
            </div>
          </div>
        ) : pageCount === 0 ? (
          <div className="flex-1">
            <Spinner label={T('Opening the volume… large rare scans can take a moment.', 'நூல் திறக்கிறது… பெரிய அரிய வருடல்களுக்குச் சற்று நேரமாகும்.', 'ग्रंथ खुल रहा है… बड़े दुर्लभ स्कैन में थोड़ा समय लग सकता है।')} />
          </div>
        ) : (
          <FlipBook
            key={book.id}
            pageCount={pageCount}
            aspect={isPdf ? pdfAspect : TEXT_PAGE_ASPECT}
            renderPage={renderPage}
            onNavigate={isPdf ? preload : undefined}
            onLayout={setPageWidth}
            initialPage={initialPage}
          />
        )}
        </div>
        <AboutPanel book={book} open={aboutOpen} onClose={() => setAboutOpen(false)} />
        </div>
      </section>
    </div>
  );
}
