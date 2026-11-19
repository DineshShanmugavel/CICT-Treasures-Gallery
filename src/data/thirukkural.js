/**
 * Student favourites: couplets with a plain-language meaning written for school students,
 * in English (`meaning`) and Tamil (`meaningTa`). scripts/build-thirukkural.mjs copies
 * these into the `studentMeaning` field of src/data/thirukkural.json, which the scroll
 * reads — add a meaning here, then run `npm run build:kural`.
 * `lines` is the original Tamil couplet; `translation` is G. U. Pope's English rendering
 * (1886, public domain) with modern vocabulary.
 */
export const studentFavourites = [
  {
    number: 1,
    chapter: { tamil: 'கடவுள் வாழ்த்து', english: 'In Praise of God' },
    lines: ['அகர முதல எழுத்தெல்லாம் ஆதி', 'பகவன் முதற்றே உலகு.'],
    translation: '‘A’, as its first of letters, every speech maintains; The ‘Primal Deity’ is first through all the world’s domains.',
    meaning: 'Just as the letter “அ” (A) comes first in the alphabet, everything in the world has a beginning. Valluvar opens his book by honouring that first source of all things.',
    meaningTa: '‘அ’ என்னும் எழுத்து எல்லா எழுத்துகளுக்கும் முதலாக இருப்பது போல, உலகத்திற்கு முதலாக இறைவன் இருக்கிறான். அதனால்தான் வள்ளுவர் தம் நூலை இறைவனை வணங்கித் தொடங்குகிறார்.',
  },
  {
    number: 391,
    chapter: { tamil: 'கல்வி', english: 'Learning' },
    lines: ['கற்க கசடறக் கற்பவை கற்றபின்', 'நிற்க அதற்குத் தக.'],
    translation: 'So learn that you may full and faultless learning gain, Then in fitting obedience to lessons learnt remain.',
    meaning: 'Learn things properly and completely — then actually live by what you have learnt. Knowing is only half the job; doing is the other half.',
    meaningTa: 'கற்க வேண்டியவற்றைப் பிழையில்லாமல் முழுமையாகக் கற்க வேண்டும்; கற்ற பிறகு அதன்படி நடக்க வேண்டும். அறிவது பாதி வேலை; அதன்படி வாழ்வதே மீதி.',
  },
  {
    number: 396,
    chapter: { tamil: 'கல்வி', english: 'Learning' },
    lines: ['தொட்டனைத் தூறும் மணற்கேணி மாந்தர்க்குக்', 'கற்றனைத் தூறும் அறிவு.'],
    translation: 'In sandy soil, when deep you delve, you reach the springs below; The more you learn, the freer streams of wisdom flow.',
    meaning: 'The deeper you dig a well in sand, the more water flows in. In the same way, the more you study, the more your understanding grows.',
    meaningTa: 'மணலில் தோண்டும் கிணற்றில், தோண்டும் அளவுக்கு நீர் ஊறும். அதுபோல, நாம் கற்கும் அளவுக்கு அறிவு பெருகும்.',
  },
  {
    number: 100,
    chapter: { tamil: 'இனியவை கூறல்', english: 'Pleasant Words' },
    lines: ['இனிய உளவாக இன்னாத கூறல்', 'கனியிருப்பக் காய்கவர்ந் தற்று.'],
    translation: 'When pleasant words are easy, bitter words to use, Is, leaving sweet ripe fruit, the sour unripe to choose.',
    meaning: 'Using harsh words when kind ones are available is like picking a sour, unripe fruit when a sweet ripe one is right there. Choose kind words!',
    meaningTa: 'இனிய சொற்கள் இருக்கும்போது கடுஞ்சொல் பேசுவது, கனி இருக்கக் காயைப் பறித்து உண்பது போன்றது. எப்போதும் இனிமையாகப் பேசுவோம்!',
  },
  {
    number: 72,
    chapter: { tamil: 'அன்புடைமை', english: 'The Possession of Love' },
    lines: ['அன்பிலார் எல்லாம் தமக்குரியர் அன்புடையார்', 'என்பும் உரியர் பிறர்க்கு.'],
    translation: 'The loveless to themselves belong alone; The loving men are others’ to the very bone.',
    meaning: 'People without love keep everything for themselves. Loving people share everything — even their whole selves — to help others.',
    meaningTa: 'அன்பில்லாதவர்கள் எல்லாவற்றையும் தமக்கே வைத்துக்கொள்வார்கள். அன்புடையவர்கள் தம் எலும்பையும் பிறருக்கு உரியதாகக் கருதி, தம்மையே பிறருக்காகக் கொடுப்பார்கள்.',
  },
  {
    number: 314,
    chapter: { tamil: 'இன்னா செய்யாமை', english: 'Not Doing Evil' },
    lines: ['இன்னாசெய் தாரை ஒறுத்தல் அவர்நாண', 'நன்னயஞ் செய்து விடல்.'],
    translation: 'To punish wrong, with kindly benefits the doers ply; Thus shame their souls; but pass the ill unheeded by.',
    meaning: 'The best answer to someone who hurts you is to do something kind for them. Your kindness will make them feel sorry — and then let it go.',
    meaningTa: 'நமக்குத் தீங்கு செய்தவருக்கும் நன்மை செய்வதே சிறந்த தண்டனை. அதனால் அவர் வெட்கப்பட்டுத் திருந்துவார்; பிறகு நடந்ததை மறந்துவிட வேண்டும்.',
  },
  {
    number: 619,
    chapter: { tamil: 'ஆள்வினை உடைமை', english: 'Manly Effort' },
    lines: ['தெய்வத்தான் ஆகா தெனினும் முயற்சிதன்', 'மெய்வருத்தக் கூலி தரும்.'],
    translation: 'Though fate-divine should make your labour vain; Effort its labour’s sure reward will gain.',
    meaning: 'Even if luck is not on your side, hard work always pays you back. Never stop trying.',
    meaningTa: 'விதி துணை செய்யாவிட்டாலும், உடலை வருத்தி உழைக்கும் உழைப்பு அதற்கேற்ற பலனைத் தந்தே தீரும். முயற்சியை ஒருபோதும் கைவிடக் கூடாது.',
  },
  {
    number: 664,
    chapter: { tamil: 'வினைத்திட்பம்', english: 'Power in Action' },
    lines: ['சொல்லுதல் யார்க்கும் எளிய அரியவாம்', 'சொல்லிய வண்ணம் செயல்.'],
    translation: 'Easy to every man the speech that shows the way; Hard thing to shape one’s life by words they say!',
    meaning: 'Anyone can say what should be done; the hard (and important) part is actually doing what you said.',
    meaningTa: 'எதையும் சொல்வது எல்லோருக்கும் எளிது; சொன்னபடி செய்வதுதான் கடினம். சொன்னதைச் செய்து காட்டுவோம்!',
  },
];
