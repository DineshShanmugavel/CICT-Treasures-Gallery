const text = 'Sangam poems speak of such urns — the முதுமக்கள் தாழி — and even address the potter who made them: கலம்செய் கோவே, “O king among potters”.';
const TA = /[஀-௿]+(?:[\s,]*[஀-௿]+)*/g;
const html = text.replace(TA, (m) => `<span translate="no">${m}</span>`);
for (const tl of ['fr', 'ja', 'bn', 'ru', 'sw', 'ar']) {
  const r = await fetch(`https://translate.googleapis.com/translate_a/t?client=gtx&sl=en&tl=${tl}&format=html`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }, body: `q=${encodeURIComponent(html)}` });
  const d = await r.json(); const out = Array.isArray(d[0]) ? d[0][0] : d[0];
  const runs = text.match(TA); const back = out.replace(/<span translate="no">([\s\S]*?)<\/span>/g, '$1');
  console.log(tl, runs.every((x) => back.includes(x)), back.slice(0, 160));
}
