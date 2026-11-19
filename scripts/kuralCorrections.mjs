/**
 * Corrections to the source dataset's Tamil lines, so every kural keeps the venba's
 * prosody: four cīr (metrical feet) in its first line and three in its second.
 *
 * Most fixes only re-space the line as traditional cīr-divided editions print it — joining
 * a foot the source split with a space ("மற்று அதன்" → "மற்றுஅதன்"), or rejoining a word it
 * broke ("வேண் டற்பாற்" → "வேண்டற்பாற்"). Three also repair corrupted text: a doubled
 * syllable (1117), a stray non-Tamil character (1192), and two feet run together (42).
 *
 * Keyed by kural number; each value replaces line 1 and/or line 2.
 */
export const KURAL_CORRECTIONS = {
  42: { tamilLine1: 'துறந்தார்க்கும் துவ்வா தவர்க்கும் இறந்தார்க்கும்' },
  60: { tamilLine1: 'மங்கலம் என்ப மனைமாட்சி மற்றுஅதன்' },
  70: { tamilLine2: 'என்நோற்றான் கொல்எனும் சொல்.' },
  74: { tamilLine2: 'நண்புஎன்னும் நாடாச் சிறப்பு.' },
  82: { tamilLine2: 'மருந்தெனினும் வேண்டற்பாற் றன்று.' },
  143: { tamilLine2: 'தீமை புரிந்துஒழுகு வார்.' },
  211: { tamilLine2: 'என்ஆற்றுங் கொல்லோ உலகு.' },
  347: { tamilLine2: 'பற்றி விடாஅ தவர்க்கு.' },
  408: { tamilLine2: 'கல்லார்கண் பட்ட திரு.' },
  530: { tamilLine2: 'இழைத்திருந்து எண்ணிக் கொளல்.' },
  532: { tamilLine2: 'நிச்ச நிரப்புக்கொன் றாங்கு.' },
  542: { tamilLine2: 'கோல்நோக்கி வாழுங் குடி.' },
  689: { tamilLine2: 'வாய்சேரா வன்க ணவன்.' },
  908: { tamilLine2: 'பெட்டாங்கு ஒழுகு பவர்.' },
  950: { tamilLine2: 'அப்பால்நாற் கூற்றே மருந்து.' },
  956: { tamilLine2: 'குலம்பற்றி வாழ்தும் என்பார்.' },
  976: { tamilLine2: 'பேணிக்கொள் வேம்என்னும் நோக்கு.' },
  988: { tamilLine2: 'திண்மைஉண் டாகப் பெறின்.' },
  1081: { tamilLine2: 'மாதர்கொல் மாலும்என் நெஞ்சு.' },
  1117: { tamilLine1: 'அறுவாய் நிறைந்த அவிர்மதிக்குப் போல' },
  1129: { tamilLine2: 'ஏதிலர் என்னுமிவ் வூர்.' },
  1130: { tamilLine2: 'ஏதிலர் என்னுமிவ் வூர்.' },
  1192: { tamilLine2: 'வீழ்வார் அளிக்கும் அளி.' },
  1284: { tamilLine2: 'கூடற்கண் சென்றது என்னெஞ்சு.' },
  1307: { tamilLine2: 'நீடுவ தன்றுகொல் என்று.' },
};

/**
 * Spelling fixes for the source dataset's English (Pope's translation, the 1886 explanations
 * and the chapter names). Only typos are corrected here (archaic words are modernised
 * separately, by modernizeEnglish). Applied as plain substring replacements, in order.
 */
export const ENGLISH_CORRECTIONS = [
  ['Truth-Conciousness', 'Truth-Consciousness'],
  ['abtain', 'obtain'],
  ['celestail', 'celestial'],
  ['crafiily', 'craftily'],
  ['depise', 'despise'],
  ['devide', 'divide'],
  ['disire', 'desire'],
  ['dislipline', 'discipline'],
  ['dtsease', 'disease'],
  ['enlightned', 'enlightened'],
  ['enshared', 'ensnared'],
  ['excellance', 'excellence'],
  ['excercise', 'exercise'],
  ['heve learned', 'have learned'],
  ['immeasureable', 'immeasurable'],
  ['importent', 'impotent'],
  ['kingly brith', 'kingly birth'],
  ['weigh these- than to', 'weigh these- then to'],
  ["Though know'st", "Thou know'st"],
  ["love 'its water", "love 'tis water"],
  ["love 's sea", "love's sea"],
  ['who has there four things', 'who has these four things'],
  ['if hidden hath arise', 'if hidden hate arise'],
  ['the heaven grows day', 'the heaven grows dry'],
  ["that he 's estranged", "that he's estranged"],
  ['aim there darts', 'aim their darts'],
  ['there is to be so season', 'there is to be no season'],
  ['Imtimate', 'Intimate'],
  ['immoveably', 'immovably'],
  ['indead', 'indeed'],
  ['inspite', 'in spite'],
  ['intrique', 'intrigue'],
  ['ivades', 'invades'],
  ['liaberality', 'liberality'],
  ['loftly', 'lofty'],
  ['mainfold', 'manifold'],
  ['profferred', 'proffered'],
  ['ragards', 'regards'],
  ['rainment', 'raiment'],
  ['reveive', 'receive'],
  ['without to saking', 'without forsaking'],
  ['seasame', 'sesame'],
  ['speach', 'speech'],
  ['staughter', 'slaughter'],
  ['sticken', 'stricken'],
  ['sujects', 'subjects'],
  ['therfore', 'therefore'],
  ['towords', 'towards'],
  ['trffling', 'trifling'],
  ["triflel'", "trifle!'"],
  ['undestructible', 'indestructible'],
  ['wonderous', 'wondrous'],
  ['onloving', 'unloving'],
  ['companing', 'companion'],
  ['asha med', 'ashamed'],
  ['the yark', 'the yak'],
  ['etty tree', 'etti tree'],
  ['freed from from', 'freed from'],
  ['without it it', 'without it, it'],
  ['abegging', 'a-begging'],
  ['everincreasing', 'ever-increasing'],
  ['gamblingplace', 'gambling place'],
  ['standingfriends', 'standing friends'],
  ['thereforehave', 'therefore have'],
  ['welladorned', 'well-adorned'],
  ['inarms', 'in arms'],
  ['incontest', 'in contest'],
  ['soft speeched', 'soft-spoken'],
  [' Tis beck', " 'Tis beck"],
  ["I 'ill", "I'll"],
  ["'T was", "'Twas"],
  ['can ISee', 'can I See'],
  // Closing quotes the source ran into the next line (opening quotes are handled below).
  ["lore,'Far", "lore,' Far"],
  ["deed?'Of", "deed?' Of"],
  ["mind'Externe", "mind' Externe"],
  ["enroll,'Is", "enroll,' Is"],
  ["forgot,'She", "forgot,' She"],
  ["there,'These", "there,' These"],
];

/**
 * Corrects spelling, then restores the space the source dropped where it joined a couplet's
 * two lines ("who gainIn bliss" → "who gain In bliss", "know.Men" → "know. Men").
 */
export function fixEnglish(text, { rejoinLines = false } = {}) {
  let fixed = ENGLISH_CORRECTIONS.reduce((t, [from, to]) => t.replaceAll(from, to), text);
  if (!rejoinLines) return fixed;
  fixed = fixed
    .replace(/(\w) '(ll|ve|re)\b/g, "$1'$2")
    .replace(/([a-z.,;:!?-])'(Tis|Twas|Twill|Twere|Twould|Gainst|Mid|Neath)\b/g, "$1 '$2")
    .replace(/([a-z.,;:!?])'([A-Z])/g, "$1 '$2")
    .replace(/([.,;:!?-])([A-Z])/g, '$1 $2')
    .replace(/([a-z])([A-Z])/g, '$1 $2');
  return fixed;
}

/**
 * Modern vocabulary for Pope's 1886 English: "thou art" → "you are", "dwelleth" → "dwells",
 * "'tis" → "it is", "nought" → "nothing". Only words change; Pope's line order is kept.
 * Phrases come first so context-dependent words ("meet" = fitting, "list" = wish) are handled
 * before the single-word rules. Each match keeps the capital of the word it replaces.
 */
export const MODERN_WORDS = [
  // Context-dependent phrases.
  ['help - meet is she', 'a fitting helpmate is she'],
  ['makes him meet', 'makes him fit'],
  ["'Twere meet man sold", 'It would be right that man sold'],
  ['obedience meet', 'fitting obedience'],
  ['An envoy meet is he', 'A fitting envoy is he'],
  ['occasion meet', 'a fitting occasion'],
  ['honour meet', 'fitting honour'],
  ["'tis meet to ask", 'it is right to ask'],
  ["Better 'twere said", 'Better it would be said'],
  ['wrought me', 'caused me'],
  ['wrought this pain', 'caused this pain'],
  ['who list', 'who please'],
  ['they list to ruin', 'they wish to ruin'],
  ['what they list to do', 'what they like to do'],
  ['aye endures', 'endures forever'],
  ['aye, whatever', 'yes, whatever'],
  ['what, aye, from', 'what, yes, from'],
  ['for aye', 'forever'],
  ['riches thine', 'riches yours'],
  ['of thine', 'of yours'],
  ['(?:mine)(?= eyes?\\b)', 'my'],
  ['boots nought', 'it matters nothing'],
  ['say ought of glory wilt thou gain', 'say, will you gain any glory'],
  ["'Behold, we", "'Look, we"],
  ['I pray you see', 'I ask you to see'],
  ["'ware of", 'beware of'],
  ['hath past', 'has passed'],
  ['never say them nay', 'never refuse them'],
  ["'Tis rain works", 'It is rain that works'],
  ["'Tis energy gives", 'It is energy that gives'],
  ["Say not, 'Tis hard'", "Say not, 'It is hard'"],
  ["'tis knife'", "it is a 'knife'"],
  ['In midst the plan', 'Midway, the plan'],
  ['weigh ere to the war he goes', 'weigh before he goes to the war'],
  ['and seemly live', 'and live properly'],
  ["'twere better hide", 'it would be better to hide'],
  ['when foemen hurls', 'when the enemy hurls'],
  ['Let leech', 'Let the doctor'],
  ['no deed Do thou, that', 'do no deed That'],
  ['Spotless be thou', 'Be spotless'],
  ['Forsake thou never', 'Never forsake'],
  ['In action be thou,', 'Be active,'],
  ['Guard thou', 'Guard'], ['guard thou', 'guard'], ['Cling thou', 'Cling'],
  ['Know thou', 'Know'], ['give thou', 'give'], ['fare thee well', 'farewell'],
  ['thou yearning criest', 'you, yearning, cry'],
  ['thou shalt smitten be', 'you shall be struck'],
  ['thou canst not', 'you cannot'],
  ['thou dost', 'you'],
  ['I pray', 'I ask'],
  ["'Pray, for", "'Tell me, for"],
  ['woman, pray,', 'woman, tell me,'],
  ['for help to pray', 'to plead for help'],
  ['for relief to pray', 'to plead for relief'],
  ['yonder happy plains', 'those happy plains'],
  ['yonder shore', 'the far shore'],
  ["in you world", 'in the next world'],
  ['the wont of', 'the habit of'],
  ['are wont to prize', 'usually prize'],
  ['whose draweth near', 'whoever draws near'],
  ['hither cometh not', 'does not come here'],
  ['spring thereout', 'spring from it'],
  ['Know ye', 'Know'],
  ['quoth she', 'said she'],
  ['I ween', 'I think'],
  ['recks not of', 'cares not about'],
  ['misbeseems', 'does not befit'],
  ['that I mine see', 'that I may see'],
  ["Seek'st thou", 'Do you seek'],
  ["Thou hid'st", 'You hide'],
  ['(?<!the )midst', 'amid'],
  // "thou" and its verbs.
  ['thou art', 'you are'], ['art thou', 'are you'],
  ['thou hast', 'you have'], ['hast thou', 'have you'],
  ['thou wilt', 'you will'], ['wilt thou', 'will you'],
  ['thou shalt', 'you shall'], ['shalt thou', 'shall you'],
  ['thou canst', 'you can'], ['canst thou', 'can you'],
  ['dost thou', 'do you'],
  ["thou would'st", 'you would'], ['thou wouldst', 'you would'],
  ['thou shouldst', 'you should'],
  ["thou may'st", 'you may'], ["may'st thou", 'may you'],
  ["thou know'st", 'you know'], ["thou see'st", 'you see'], ["thou bring'st", 'you bring'],
  ['thou diest', 'you die'], ['thou criest', 'you cry'], ['thou followest', 'you follow'],
  ['thou behold', 'you see'], ['thy love behold', 'see your love'], ["may'st", 'may'],
  ['thou', 'you'], ['thee', 'you'], ['thyself', 'yourself'], ['thy', 'your'],
  ['thine', 'your'], ['ye', 'you'],
  // Verb endings.
  ['hath', 'has'], ['doth', 'does'], ['beseem', 'befit'],
  ['availeth', 'avails'], ['broodeth', 'broods'], ['cometh', 'comes'], ['delighteth', 'delights'],
  ['draweth', 'draws'], ['dwelleth', 'dwells'], ['floweth', 'flows'], ['guardeth', 'guards'],
  ['hateth', 'hates'], ['healeth', 'heals'], ['increaseth', 'increases'], ['loveth', 'loves'],
  ['offendeth', 'offends'], ['prompteth', 'prompts'], ['ruleth', 'rules'], ['slayeth', 'slays'],
  ['waneth', 'wanes'], ['yieldeth', 'yields'],
  // Elisions.
  ["'tis", 'it is'], ["'twas", 'it was'], ["'twill", 'it will'], ["'twere", 'it would be'],
  ["'twould", 'it would'], ["'gainst", 'against'], ["'mid", 'amid'], ["'mongst", 'among'],
  ["'neath", 'beneath'], ['mid', 'amid'], ["'scape", 'escape'], ["'scapes", 'escapes'],
  ["o'er-whelmed", 'overwhelmed'], ["o'ercome", 'overcome'], ["o'erflow", 'overflow'], ["o'ergrown", 'overgrown'],
  ["o'ermatched", 'overmatched'], ["o'erpowered", 'overpowered'], ["o'erweening", 'overweening'],
  ["o'erwhelming", 'overwhelming'], ["o'er", 'over'],
  ["howe'er", 'however'], ["whate'er", 'whatever'], ["whene'er", 'whenever'], ["where'er", 'wherever'],
  ["How great soe'er they be", 'However great they be'],
  ["e'en", 'even'], ["ev'n", 'even'], ["ev'ry", 'every'], ["ne'er", 'never'], ["heav'n", 'heaven'],
  ["giv'n", 'given'], ["fall'n", 'fallen'], ["sev'n", 'seven'], ["sev'rance", 'severance'],
  ["diff'rence", 'difference'], ["rev'rence", 'reverence'], ["fav'rite", 'favourite'],
  ["flow'rs", 'flowers'], ["glad'ning", 'gladdening'], ["beck'ning", 'beckoning'],
  ["threat'ning", 'threatening'], ["wand'ring", 'wandering'], ["hung'ring", 'hungering'],
  ["jav'lin", 'javelin'], ["med'cine", 'medicine'], ["mem'ry", 'memory'],
  ["fulfill'd", 'fulfilled'], ["play'd", 'played'], ["unlearn'd", 'unlearned'], ["learn'd", 'learned'],
  ["straight'way", 'at once'], ["th'unlearned", 'the unlearned'], ["th'", 'the'],
  ['to-morrow', 'tomorrow'], ['to-night', 'tonight'], ['to-day', 'today'],
  // Old words.
  ['nought', 'nothing'], ['aught', 'anything'], ['ere', 'before'], ['erewhile', 'once'],
  ['oft', 'often'], ['alway', 'always'], ['anigh', 'near'], ['nigh', 'near'], ['whence', 'where'],
  ['from thence', 'from there'], ['thence', 'from there'], ['unto', 'to'], ['blest', 'blessed'],
  ['wonted', 'usual'], ['wrought', 'done'], ['behold', 'see'], ['twain', 'two'], ['sire', 'father'],
  ['kine', 'cattle'], ['leech', 'doctor'], ['foemen', 'enemies'], ['foeman', 'enemy'],
  ['burthen', 'burden'], ['burthens', 'burdens'], ['ire', 'anger'], ['weal', 'welfare'],
  ['mien', 'appearance'], ['fray', 'fight'], ['begirt', 'surrounded'], ['apace', 'quickly'],
  ['athwart', 'across'], ['soothly', 'truly'], ['waxes', 'grows'], ['bides', 'stays'],
  ['behests', 'commands'], ['chiefest', 'greatest'], ['straightway', 'at once'],
  ['seemly', 'proper'], ['unseemly', 'improper'], ['goodly', 'good'], ['doat', 'dote'],
  ['eyne', 'eyes'], ['unweeting', 'unknowing'], ['drie', 'endure'], ['demiss', 'humble'],
  ['wildered', 'bewildered'], ['wildering', 'bewildering'], ['moveless', 'unmoving'],
  ['subtilty', 'subtlety'], ['externe', 'external'], ['lonelihood', 'loneliness'],
  ['mislikes', 'dislikes'], ['concentred', 'concentrated'],
].map(([from, to]) => [new RegExp(`(?<!\\w)(?<!\\w')${from.startsWith('(') ? from : from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?!\\w)(?!'(?!s\\b)\\w)`, 'gi'), to]);

const matchCase = (match, to) => (/^'?[A-Z]/.test(match) ? to[0].toUpperCase() + to.slice(1) : to);

/** Replaces Pope's archaic words with modern ones (see MODERN_WORDS). */
export function modernizeEnglish(text) {
  return MODERN_WORDS.reduce((t, [pattern, to]) => t.replace(pattern, (m) => matchCase(m, to)), text);
}

/** Words in a line, split on whitespace. */
export const kuralWords = (line) => line.trim().split(/\s+/).filter(Boolean);

/** Throws unless every kural has four feet in line 1 and three in line 2. */
export function assertVenbaLines(kurals) {
  const wrong = kurals.filter((k) => kuralWords(k.tamilLine1).length !== 4 || kuralWords(k.tamilLine2).length !== 3);
  if (wrong.length) {
    throw new Error(`Kurals not in 4 + 3 feet: ${wrong.map((k) => k.number).join(', ')} — add them to scripts/kuralCorrections.mjs`);
  }
}
