import { artifactsIn } from './artifacts.js';
import { named, photoNumber } from './albums.js';

/**
 * The Weaving Culture room of the Ancient Artistic Values Wing: three photobooks on its
 * shelf, filled from public/Weaving culture ancient-present —
 *
 *   How Cloth Was Made        "Ancient Tamil weaving — how was cloth made 1–9.jpeg"
 *   From Fibre to Fabric      "Step 1 — Fibre preparation.jpeg" … "Step 5 — Dyeing and finishing.jpeg"
 *   Weaving Through the Ages  one photograph per period ("sangam period.jpeg", "Contemporary Tamil Nadu.jpeg", …)
 *
 * The English follows the curators' research guide in that folder
 * (Tamil_Weaving_Historical_Research_Guide.pdf), keeping its cautions: dates are approximate,
 * and the general process is not offered as proof of any one ancient workshop's practice.
 */
export const WEAVING_FOLDER = 'Weaving culture ancient-present';

const MATERIALS = {
  name: 'How Cloth Was Made',
  tamil: 'துணி எவ்வாறு நெய்யப்பட்டது',
  place: 'Ancient Tamil weaving · Materials',
  en: 'Weaving is more than a craft: it connects everyday clothing, agriculture, technology, trade, skilled labour, cultural identity and the livelihoods of Tamil communities across centuries. Its raw materials were paruthi (cotton), a major fibre spun into yarn and woven into cloth; pattu (silk), known in early South Asian textile traditions, though the fibres used varied by time and place; plant dyes such as indigo, discussed in early Tamil textile references; and nool (yarn), fibre spun or twisted into a continuous thread ready for the loom.',
  ta: 'நெசவு வெறும் கைவினை அன்று: அன்றாட உடை, வேளாண்மை, தொழில்நுட்பம், வணிகம், திறன்மிகு உழைப்பு, பண்பாட்டு அடையாளம், தமிழ்ச் சமூகங்களின் வாழ்வாதாரம் ஆகியவற்றைப் பல நூற்றாண்டுகளாக இணைப்பது அது. அதன் மூலப்பொருட்கள்: நூலாக நூற்று நெய்யப்பட்ட முதன்மை இழையான பருத்தி; தொடக்ககாலத் தெற்காசிய நெசவு மரபுகளில் அறியப்பட்ட பட்டு — பயன்பட்ட இழைகள் காலத்துக்கும் இடத்துக்கும் ஏற்ப மாறின; தொடக்ககாலத் தமிழ்க் குறிப்புகளில் பேசப்படும் அவுரி (நீலம்) போன்ற தாவரச் சாயங்கள்; தறிக்கு ஏற்ற தொடர் இழையாக நூற்கப்பட்ட நூல்.',
};

const STEPS = [
  { match: /^step 1/i, title: 'Fibre Preparation', tamil: 'இழை தயாரித்தல்', en: 'Cotton fibres are separated from their seeds and cleaned.', ta: 'பருத்தி இழைகள் விதைகளிலிருந்து பிரிக்கப்பட்டுத் தூய்மை செய்யப்படுகின்றன.' },
  { match: /^step 2/i, title: 'Spinning', tamil: 'நூற்றல்', en: 'The fibres are twisted into yarn with a spindle or other spinning equipment.', ta: 'கதிர் அல்லது பிற நூற்புக் கருவிகளால் இழைகள் முறுக்கப்பட்டு நூலாகின்றன.' },
  { match: /^step 3/i, title: 'Preparing the Warp', tamil: 'பாவு அமைத்தல்', en: 'The lengthwise threads, the warp, are set out under tension on the loom.', ta: 'நீளவாட்டு நூல்களான பாவு, தறியில் இழுவிசையுடன் அமைக்கப்படுகின்றன.' },
  { match: /^step 4/i, title: 'Weaving', tamil: 'நெய்தல்', en: 'Crosswise weft threads are interlaced with the warp, and the fabric grows.', ta: 'குறுக்குவாட்டு ஊடை நூல்கள் பாவுடன் பின்னப்பட, துணி உருவாகிறது.' },
  { match: /^step 5/i, title: 'Dyeing and Finishing', tamil: 'சாயமிடுதலும் முடித்தலும்', en: 'Depending on the textile and the period, yarn or cloth may be dyed, washed and finished for use or sale.', ta: 'துணியின் வகைக்கும் காலத்துக்கும் ஏற்ப, நூலோ துணியோ சாயமிடப்பட்டு, கழுவப்பட்டு, பயன்பாட்டுக்கோ விற்பனைக்கோ முடிக்கப்படுகிறது.' },
];

const PROCESS = {
  name: 'From Fibre to Fabric',
  tamil: 'இழையிலிருந்து துணிவரை',
  place: 'The textile-making sequence · Five steps',
  en: 'A simplified sequence of how cloth is made. It explains the general process; it is not proof that every ancient Tamil workshop followed exactly these steps in this order — tools, and the order of dyeing and weaving, could vary.',
  ta: 'துணி உருவாகும் எளிமைப்படுத்தப்பட்ட வரிசை. இது பொதுவான செயல்முறையை விளக்குகிறது; ஒவ்வொரு பழந்தமிழ் நெசவுக் கூடமும் இதே வரிசையைப் பின்பற்றியது என்பதற்கான சான்று அன்று — கருவிகளும் சாயமிடுதல், நெசவு ஆகியவற்றின் வரிசையும் மாறுபடலாம்.',
};

const PERIODS = [
  {
    match: /^early evidence/i,
    title: 'Early Evidence and Ancient Tamilakam',
    tamil: 'தொடக்கச் சான்றுகளும் பண்டைத் தமிழகமும்',
    dates: 'Prehistoric background to c. 300 BCE',
    en: 'Textile production in this age must be reconstructed from tools, fibres, archaeological context and wider South Asian evidence: actual ancient cloth rarely survives.',
    ta: 'இக்காலத் துணி உற்பத்தியைக் கருவிகள், இழைகள், அகழாய்வுச் சூழல், பரந்த தெற்காசியச் சான்றுகள் வழியாகவே மீட்டுருவாக்க வேண்டும்: பழந்துணி அரிதாகவே எஞ்சியுள்ளது.',
  },
  {
    match: /^sangam period/i,
    title: 'The Sangam Period',
    tamil: 'சங்க காலம்',
    dates: 'About 300 BCE – 300 CE (scholars’ ranges vary)',
    en: 'Tamil literature describes fine garments, cotton textiles, skilled textile workers and trade. Porunaratrupadai compares fine cloth to things of great delicacy; Purananuru is cited for nilikachchai, a cloth associated with indigo colouring. Brick dyeing vats reported at Arikamedu and Uraiyur are associated with the first and second centuries CE.',
    ta: 'நுண்ணிய ஆடைகள், பருத்தித் துணிகள், திறன்மிகு நெசவாளர்கள், வணிகம் ஆகியவற்றைத் தமிழ் இலக்கியம் விவரிக்கிறது. பொருநராற்றுப்படை நுண்ணிய துணியை மிக மென்மையான பொருட்களுடன் ஒப்பிடுகிறது; அவுரி நிறத்துடன் தொடர்புடைய நீலிக்கச்சைக்குப் புறநானூறு சுட்டப்படுகிறது. அரிக்கமேடு, உறையூரில் கண்டறியப்பட்ட செங்கல் சாயத்தொட்டிகள் கி.பி. முதல், இரண்டாம் நூற்றாண்டுகளைச் சேர்ந்தவை.',
  },
  {
    match: /^early medieval/i,
    title: 'Early Medieval and Imperial Periods',
    tamil: 'முற்கால இடைக்காலமும் பேரரசுக் காலமும்',
    dates: 'About the 4th – 13th centuries CE',
    en: 'Inscriptions, temple records, merchant networks, taxation and royal patronage show how crafts and textile livelihoods were organised. Weaving, spinning and dyeing sustained households; temples and courts were great markets; centres grew their own specialities, and Coromandel cloth gained importance in trade.',
    ta: 'கல்வெட்டுகள், கோயில் ஆவணங்கள், வணிகர் வலைப்பின்னல்கள், வரிவிதிப்பு, அரச ஆதரவு ஆகியவை கைவினைகளும் நெசவு வாழ்வாதாரமும் எவ்வாறு அமைந்திருந்தன எனக் காட்டுகின்றன. நெசவும் நூற்பும் சாயமிடுதலும் குடும்பங்களைத் தாங்கின; கோயில்களும் அரசவைகளும் பெரும் சந்தைகளாயின; ஒவ்வொரு மையமும் தனிச்சிறப்பை வளர்த்தது; வணிகத்தில் சோழமண்டலத் துணி முக்கியத்துவம் பெற்றது.',
  },
  {
    match: /^late medieval/i,
    title: 'Late Medieval and Early Modern Periods',
    tamil: 'பிற்கால இடைக்காலமும் தொடக்க நவீன காலமும்',
    dates: 'About the 14th – 18th centuries',
    en: 'Regional weaving centres, dyed and painted cottons, and commercial networks shaped production and export. Cotton cloth was made for local use and for trade, and merchants and European trading companies influenced the kinds, quantities and designs of cloth woven.',
    ta: 'வட்டார நெசவு மையங்கள், சாயமிட்ட, ஓவியம் தீட்டிய பருத்தித் துணிகள், வணிக வலைப்பின்னல்கள் உற்பத்தியையும் ஏற்றுமதியையும் வடிவமைத்தன. உள்ளூர்ப் பயன்பாட்டுக்கும் வணிகத்துக்கும் பருத்தித் துணி நெய்யப்பட்டது; வணிகர்களும் ஐரோப்பிய வணிக நிறுவனங்களும் நெய்யப்பட்ட துணியின் வகை, அளவு, வடிவமைப்பை மாற்றின.',
  },
  {
    match: /^colonial rule/i,
    title: 'Colonial Rule and the Transformation of Weaving',
    tamil: 'காலனி ஆட்சியும் நெசவின் மாற்றமும்',
    dates: '18th – 19th centuries',
    en: 'Not simply a story of a craft disappearing: European commercial networks shaped procurement and exports, industrial cloth brought new competition, and some weaving communities adapted their products and markets while others faced hardship. The effects varied by region, period, fabric and market.',
    ta: 'இது ஒரு கைவினை மறைந்த கதை மட்டும் அன்று: ஐரோப்பிய வணிக வலைப்பின்னல்கள் கொள்முதலையும் ஏற்றுமதியையும் வடிவமைத்தன; ஆலைத் துணி புதிய போட்டியைக் கொணர்ந்தது; சில நெசவுச் சமூகங்கள் தம் பொருட்களையும் சந்தைகளையும் மாற்றிக்கொண்டன, சில நெருக்கடியைச் சந்தித்தன. விளைவுகள் வட்டாரம், காலம், துணி, சந்தைக்கு ஏற்ப மாறுபட்டன.',
  },
  {
    match: /^colonial and post-independence/i,
    title: 'Colonial and Post-Independence Periods',
    tamil: 'காலனி, விடுதலைக்குப் பிந்தைய காலங்கள்',
    dates: '18th – 20th centuries',
    en: 'Industrial imports, changing markets, power looms, cooperative societies and handloom policies transformed the working lives of weavers.',
    ta: 'ஆலை இறக்குமதிகள், மாறும் சந்தைகள், விசைத்தறிகள், கூட்டுறவுச் சங்கங்கள், கைத்தறிக் கொள்கைகள் ஆகியவை நெசவாளர்களின் உழைப்பு வாழ்வை மாற்றியமைத்தன.',
  },
  {
    match: /^contemporary/i,
    title: 'Contemporary Tamil Nadu',
    tamil: 'இன்றைய தமிழ்நாடு',
    dates: '21st century to today',
    en: 'Handlooms work alongside power looms, contemporary design, digital marketing and heritage revival, with challenges of income and of passing skills on. Kanchipuram and Arani silks, the Jamakkalam floor coverings of Bhavani and the cotton lungis of Cuddalore carry the tradition on. A traditional-looking textile is not necessarily handwoven.',
    ta: 'விசைத்தறிகள், நவீன வடிவமைப்பு, இணைய வணிகம், மரபு மீட்பு ஆகியவற்றுடன் கைத்தறிகள் இணைந்து இயங்குகின்றன; வருமானமும் திறனைக் கடத்துவதும் சவால்களாக உள்ளன. காஞ்சிபுரம், ஆரணிப் பட்டுகள், பவானி ஜமக்காளம், கடலூர்ப் பருத்தி லுங்கிகள் இம்மரபைத் தொடர்கின்றன. பாரம்பரியத் தோற்றமுடைய துணி கைத்தறியில் நெய்யப்பட்டது என்பது உறுதியில்லை.',
  },
];

const AGES = {
  name: 'Weaving Through the Ages',
  tamil: 'காலந்தோறும் நெசவு',
  place: 'From ancient Tamilakam to today',
};

/** One page per photograph, each with its own texts; `info` names the book. */
const album = (id, info, pages) => ({
  id: `${id}-album`,
  title: info.name,
  tamil: info.tamil,
  detail: info.place,
  layout: 'photobook',
  artifacts: pages.map(({ artifact, ...text }, i) => ({
    ...artifact,
    site: id,
    title: text.title ?? info.name,
    tamil: text.tamil ?? info.tamil,
    detail: text.detail ?? info.place,
    note: text.en ?? info.en,
    tamilNote: text.ta ?? info.ta,
    caption: text.caption ?? null,
    plate: i + 1,
    plates: pages.length,
  })),
});

/** The room's three photobooks, in the order a visitor would read them. */
export const weavingAlbums = () => {
  const photos = artifactsIn(WEAVING_FOLDER);
  const find = (pattern) => photos.find(named(pattern));
  const materials = photos.filter(named(/how was cloth made/i)).sort((a, b) => photoNumber(a) - photoNumber(b)).map((artifact) => ({ artifact }));
  const steps = STEPS.map((step, i) => ({
    artifact: find(step.match),
    detail: `Step ${i + 1} of ${STEPS.length}`,
    caption: { en: `Step ${i + 1} — ${step.title}: ${step.en}`, ta: `படி ${i + 1} — ${step.tamil}: ${step.ta}` },
  })).filter((page) => page.artifact);
  const ages = PERIODS.map((period) => ({ artifact: find(period.match), title: period.title, tamil: period.tamil, detail: period.dates, en: period.en, ta: period.ta })).filter((page) => page.artifact);
  return [
    album('weaving-materials', MATERIALS, materials),
    album('weaving-process', PROCESS, steps),
    album('weaving-ages', { ...AGES, en: PERIODS[0].en, ta: PERIODS[0].ta }, ages),
  ].filter((book) => book.artifacts.length);
};
