import React from 'react';

/*
 * The admin portal's building blocks, in the 3D museum's design language: dark glass over warm
 * teak, royal-gold rules and accents, ivory text, Cormorant Garamond headings.
 */

export const glass = 'rounded-2xl border border-temple-gold/35 bg-[#140d07]/70 shadow-[0_18px_40px_#0009,inset_0_1px_0_#f2d38b1f] backdrop-blur-md';

export function Panel({ title, tamil, actions, children, className = '' }) {
  return (
    <section className={`${glass} p-4 sm:p-5 ${className}`}>
      {(title || actions) && (
        <header className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-temple-gold/20 pb-3">
          <div className="min-w-0">
            {tamil && <p lang="ta" className="m-0 text-xs font-bold text-[#e9a27a]">{tamil}</p>}
            {title && <h2 className="m-0 font-serif text-xl leading-tight font-bold text-temple-gold-light sm:text-2xl">{title}</h2>}
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

const BUTTONS = {
  gold: 'border-temple-gold bg-[radial-gradient(circle_at_35%_30%,#f7dc95,#c4913f_60%,#8a5a22)] text-[#2a1408] shadow-[0_4px_12px_#0007,inset_0_1px_#fff6] hover:brightness-110',
  ghost: 'border-temple-gold/50 bg-[#1c120a]/60 text-temple-gold-light hover:bg-temple-gold/15',
  danger: 'border-[#d36a4a]/70 bg-[#3a140a]/70 text-[#ffb59e] hover:bg-[#5a1e10]',
};

export function Button({ variant = 'ghost', className = '', children, ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-[filter,background-color,scale] duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:text-[13px] ${BUTTONS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

const inputClass =
  'w-full rounded-lg border border-temple-gold/30 bg-[#0e0905]/80 px-3 py-2 font-sans text-sm text-[#f6ead0] placeholder:text-[#a8916a]/70 outline-none transition-[border-color,box-shadow] focus:border-temple-gold-light focus:shadow-[0_0_0_3px_#d4a64a33]';

export function Field({ label, hint, lang, multiline, rows = 4, className = '', ...props }) {
  const Input = multiline ? 'textarea' : 'input';
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-[11px] font-bold tracking-[0.12em] text-temple-gold uppercase">{label}</span>
      <Input lang={lang} rows={multiline ? rows : undefined} className={`${inputClass} ${multiline ? 'resize-y leading-relaxed' : ''} ${lang === 'ta' ? 'leading-[1.8]' : ''}`} {...props} />
      {hint && <span className="text-[11px] text-[#c9b48c]/80">{hint}</span>}
    </label>
  );
}

export function Select({ label, options, className = '', ...props }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-[11px] font-bold tracking-[0.12em] text-temple-gold uppercase">{label}</span>
      <select className={`${inputClass} cursor-pointer`} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-[#1c120a]">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Toggle({ label, checked, onChange, hint }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 select-none">
      <span className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border transition-colors ${checked ? 'border-temple-gold bg-[#8a5a22]' : 'border-temple-gold/40 bg-[#0e0905]'}`}>
        <input type="checkbox" className="peer sr-only" checked={checked} onChange={(event) => onChange(event.target.checked)} />
        <span className={`absolute top-0.5 size-[18px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff3cc,#d4a64a)] shadow transition-[left] duration-200 ${checked ? 'left-[22px]' : 'left-0.5'}`} />
      </span>
      <span className="flex flex-col">
        <span className="text-sm font-semibold text-[#f3e6c8]">{label}</span>
        {hint && <span className="text-[11px] text-[#c9b48c]/80">{hint}</span>}
      </span>
    </label>
  );
}

const BADGES = {
  default: 'border-temple-gold/30 text-[#c9b48c]',
  edited: 'border-sky-400/60 text-sky-300',
  added: 'border-emerald-400/60 text-emerald-300',
  hidden: 'border-amber-400/60 text-amber-300',
  deleted: 'border-[#d36a4a]/70 text-[#ffb59e]',
};

export function Badge({ status, children }) {
  return <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-[0.12em] uppercase ${BADGES[status] ?? BADGES.default}`}>{children ?? status}</span>;
}

export function Kpi({ label, tamil, value, sub, icon: Icon, accent = 'text-temple-gold-light' }) {
  return (
    <div className={`${glass} flex items-start gap-4 p-4`}>
      {Icon && (
        <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-temple-gold/40 bg-[#2a1408]/80 text-temple-gold">
          <Icon size={20} />
        </span>
      )}
      <div className="min-w-0">
        <p className="m-0 text-[11px] font-bold tracking-[0.14em] text-temple-gold uppercase">{label}</p>
        {tamil && <p lang="ta" className="m-0 text-[11px] text-[#e9a27a]">{tamil}</p>}
        <p className={`m-0 mt-1 truncate font-serif text-3xl leading-none font-bold lining-nums tabular-nums ${accent}`}>{value}</p>
        {sub && <p className="m-0 mt-1 truncate text-xs text-[#c9b48c]">{sub}</p>}
      </div>
    </div>
  );
}
