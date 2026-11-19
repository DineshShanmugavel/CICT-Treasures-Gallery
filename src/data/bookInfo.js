/**
 * Bilingual descriptions and narration paths for every book and artifact.
 *
 * Each shelf item either carries its own `description: { en, ta }` or names a `work`
 * below; describeBook() adds an edition note (printed year, CICT edition) so every
 * item gets a full Tamil and English text. For narration, record a native voiceover and
 * add it to public/Audio/Rare Books as "<book title>-Tamil" / "<book title>-English"
 * (see bookAudio below).
 */

import recordings from 'virtual:museum-audio';
import { BOOK_AUDIO_FOLDER } from './kuralAudio.js';
import { mediaUrl } from '../mediaUrl.js';
import { englishNarration, englishTitle, generatedNarration, hindiNarration } from '../narration/generated.js';
import { getLang, lookup, tri } from '../i18n/index.js';

export const works = {
  thirumurugatrupadai: {
    en: 'The first of the Ten Idylls (Pattuppattu), composed by Nakkeerar. In this “guide poem” a devotee blessed by Lord Murugan directs another seeker to him, describing his six sacred abodes, the Arupadai Veedu.',
    ta: 'பத்துப்பாட்டின் முதல் நூல்; நக்கீரர் இயற்றியது. முருகனின் அருள் பெற்ற ஒருவர், அருள் வேண்டும் மற்றொருவரை முருகனிடம் ஆற்றுப்படுத்துவதாக அமைந்த ஆற்றுப்படை நூல். முருகனின் ஆறுபடை வீடுகளை இது விரிவாகப் பாடுகிறது.',
  },
  porunaratrupadai: {
    en: 'A guide poem of the Ten Idylls by Mudathama Kanniyar. A drum-playing bard (porunar) who has been richly rewarded guides a fellow bard to the generous Chola king Karikal Valavan.',
    ta: 'முடத்தாமக் கண்ணியார் இயற்றிய ஆற்றுப்படை நூல். பரிசு பெற்ற பொருநன் ஒருவன், மற்றொரு பொருநனைச் சோழன் கரிகால் வளவனிடம் ஆற்றுப்படுத்துகிறான். கரிகாலனின் கொடைச் சிறப்பை இது போற்றுகிறது.',
  },
  sirupanatrupadai: {
    en: 'A guide poem of the Ten Idylls by Nallur Nathathanar. A bard who plays the small yazh (harp) leads another to the chieftain Nalliyakkodan, describing the hardships of poor bards and the warmth of a generous patron.',
    ta: 'நல்லூர் நத்தத்தனார் இயற்றிய ஆற்றுப்படை நூல். சிறிய யாழை இசைக்கும் பாணன், மற்றொரு பாணனை வள்ளல் நல்லியக்கோடனிடம் ஆற்றுப்படுத்துகிறான். வறுமையில் வாடும் பாணர்களின் நிலையையும் வள்ளலின் கொடையையும் இது காட்டுகிறது.',
  },
  perumpanatrupadai: {
    en: 'A guide poem of the Ten Idylls by Kadiyalur Uruthirankannanar. A bard with the large yazh is guided to Thondaiman Ilanthiraiyan of Kanchi; along the way the poem paints vivid scenes of villages, ports, and people.',
    ta: 'கடியலூர் உருத்திரங்கண்ணனார் இயற்றியது. பேரியாழ் இசைக்கும் பாணன் காஞ்சியை ஆண்ட தொண்டைமான் இளந்திரையனிடம் ஆற்றுப்படுத்தப்படுகிறான். வழியில் காணும் ஊர்கள், துறைமுகங்கள், மக்கள் வாழ்க்கை ஆகியவற்றை இந்நூல் அழகாக விவரிக்கிறது.',
  },
  mullaippattu: {
    en: 'The shortest of the Ten Idylls, by Napputhanar. Set in the forest (mullai) landscape during the rainy season, it portrays a wife patiently waiting for her husband to return from war.',
    ta: 'பத்துப்பாட்டில் மிகச் சிறிய நூல்; நப்பூதனார் இயற்றியது. முல்லை நிலத்தின் கார்காலப் பின்னணியில், போருக்குச் சென்ற தலைவன் திரும்பி வரும்வரை பொறுமையுடன் காத்திருக்கும் தலைவியின் நிலையைப் பாடுகிறது.',
  },
  maduraikkanchi: {
    en: 'The longest of the Ten Idylls, by Mangudi Maruthanar, addressed to the Pandya king Nedunchezhiyan. It describes the great city of Madurai from dawn to night and gently reminds the king that all worldly glory passes.',
    ta: 'பத்துப்பாட்டில் மிக நீண்ட நூல்; மாங்குடி மருதனார் பாண்டியன் நெடுஞ்செழியனுக்குப் பாடியது. மதுரை மாநகரின் காலை முதல் இரவு வரையிலான வாழ்க்கையை விவரித்து, உலகச் செல்வங்கள் நிலையற்றவை என்பதை அரசனுக்கு உணர்த்துகிறது.',
  },
  nedunalvadai: {
    en: 'A poem of the Ten Idylls by Nakkeerar. During the long, cold north wind of winter, a queen longs for her husband while the king tends his wounded soldiers in a war camp.',
    ta: 'நக்கீரர் இயற்றிய பத்துப்பாட்டு நூல். நீண்ட குளிர்ந்த வாடைக் காற்று வீசும் காலத்தில், அரண்மனையில் தலைவனைப் பிரிந்து வருந்தும் அரசியையும், பாசறையில் புண்பட்ட வீரர்களைக் காணும் அரசனையும் இது சித்திரிக்கிறது.',
  },
  kurinjippattu: {
    en: 'A love poem of the Ten Idylls by Kapilar, set in the mountain (kurinji) landscape. Tradition says it was written to teach a northern king the beauty of Tamil love poetry; it famously names ninety-nine flowers.',
    ta: 'கபிலர் இயற்றிய குறிஞ்சித் திணை நூல். ஆரிய அரசன் பிரகத்தனுக்குத் தமிழ் அகப்பொருள் மரபை உணர்த்தப் பாடப்பட்டது என்பர். தொண்ணூற்றொன்பது மலர்களின் பெயர்களை அடுக்கிக் கூறுவது இதன் தனிச்சிறப்பு.',
  },
  pattinappalai: {
    en: 'A poem of the Ten Idylls by Kadiyalur Uruthirankannanar, praising the Chola king Karikal Valavan and his bustling port city of Kaveripoompattinam (Puhar), with its ships, markets, and festivals.',
    ta: 'கடியலூர் உருத்திரங்கண்ணனார் இயற்றியது. சோழன் கரிகால் வளவனையும், கப்பல்கள், அங்காடிகள், விழாக்கள் நிறைந்த காவிரிப்பூம்பட்டினத்தின் (புகார்) செழிப்பையும் இது போற்றுகிறது.',
  },
  malaipadukadam: {
    en: 'A guide poem of the Ten Idylls by Perunkausikanar. Wandering performers (koothar) are guided to the chieftain Nannan; the poem is celebrated for capturing the many sounds of the mountains.',
    ta: 'பெருங்கௌசிகனார் இயற்றிய ஆற்றுப்படை நூல். கூத்தர்களை நன்னன் என்னும் வள்ளலிடம் ஆற்றுப்படுத்துகிறது. மலையில் எழும் பல்வேறு ஓசைகளை வருணிப்பது இதன் சிறப்பு; அதனாலேயே "மலைபடுகடாம்" எனப் பெயர் பெற்றது.',
  },
  natrinai: {
    en: 'One of the Eight Anthologies: 400 love (akam) poems of 9 to 12 lines each, by many poets. The poems capture moments of love set in the five Tamil landscapes.',
    ta: 'எட்டுத்தொகை நூல்களுள் ஒன்று. ஒன்பது முதல் பன்னிரண்டு அடிகள் கொண்ட நானூறு அகப்பாடல்களின் தொகுப்பு. ஐந்திணை நிலப் பின்னணியில் காதல் வாழ்வின் பல நிலைகளைப் பாடுகிறது.',
  },
  kurunthokai: {
    en: 'One of the Eight Anthologies: about 400 short love poems of 4 to 8 lines. Its compact, vivid images — like “love vaster than the earth” — make it one of the most loved Sangam collections.',
    ta: 'எட்டுத்தொகை நூல்களுள் ஒன்று. நான்கு முதல் எட்டு அடிகள் கொண்ட சுமார் நானூறு சிறிய அகப்பாடல்களின் தொகுப்பு. "நிலத்தினும் பெரிதே" போன்ற சுருக்கமான, அழகிய உவமைகளால் மிகவும் புகழ்பெற்றது.',
  },
  ainkurunuru: {
    en: 'One of the Eight Anthologies: 500 very short love poems, a hundred for each of the five landscapes, each hundred composed by a different poet.',
    ta: 'எட்டுத்தொகை நூல்களுள் ஒன்று. ஐந்து திணைகளுக்கும் தலா நூறு பாடல்களாக, ஐந்து புலவர்கள் பாடிய ஐந்நூறு சிறிய அகப்பாடல்களின் தொகுப்பு.',
  },
  pathitrupathu: {
    en: 'One of the Eight Anthologies: ten decades of poems, each by a different poet, praising the kings of the Chera dynasty. The first and last decades have been lost.',
    ta: 'எட்டுத்தொகை நூல்களுள் ஒன்று. சேர மன்னர்களைப் புகழ்ந்து, பத்துப் புலவர்கள் தலா பத்துப் பாடல்கள் பாடிய புறநூல். இதன் முதல் பத்தும் இறுதிப் பத்தும் கிடைக்கவில்லை.',
  },
  paripadal: {
    en: 'One of the Eight Anthologies: musical hymns to Thirumal (Vishnu) and Murugan and songs about the river Vaigai and Madurai. Of the original seventy poems, only about twenty-four survive.',
    ta: 'எட்டுத்தொகை நூல்களுள் ஒன்று. திருமால், முருகன் ஆகியோரைப் போற்றும் பாடல்களும் வையை ஆறு, மதுரை பற்றிய பாடல்களும் கொண்ட இசைப்பாடல் நூல். முதலில் எழுபது பாடல்கள் இருந்தன; இன்று சுமார் இருபத்து நான்கு மட்டுமே கிடைக்கின்றன.',
  },
  kalithokai: {
    en: 'One of the Eight Anthologies: 150 love poems in the lively kali metre. Many are written as dramatic conversations between the lovers and their friends.',
    ta: 'எட்டுத்தொகை நூல்களுள் ஒன்று. கலிப்பா வகையில் அமைந்த நூற்றைம்பது அகப்பாடல்களின் தொகுப்பு. பல பாடல்கள் தலைவன், தலைவி, தோழி ஆகியோரின் உரையாடல் வடிவில் நாடகப் பாங்குடன் அமைந்துள்ளன.',
  },
  akananuru: {
    en: 'One of the Eight Anthologies: 400 longer love (akam) poems of 13 to 31 lines. Alongside love, the poems preserve precious details of history, kings, and everyday life.',
    ta: 'எட்டுத்தொகை நூல்களுள் ஒன்று. பதின்மூன்று முதல் முப்பத்தோர் அடிகள் கொண்ட நானூறு நெடிய அகப்பாடல்களின் தொகுப்பு. காதலோடு, வரலாறு, மன்னர்கள், மக்கள் வாழ்க்கை பற்றிய அரிய செய்திகளையும் தருகிறது.',
  },
  purananuru: {
    en: 'One of the Eight Anthologies: 400 “outer world” (puram) poems about kings, war, generosity, and ethics. It includes the famous line “Yaadhum oore yaavarum kelir” — every town is our town, everyone our kin.',
    ta: 'எட்டுத்தொகை நூல்களுள் ஒன்று. மன்னர், போர், கொடை, அறம் பற்றிய நானூறு புறப்பாடல்களின் தொகுப்பு. "யாதும் ஊரே யாவரும் கேளிர்" என்னும் புகழ்பெற்ற வரி இந்நூலில் உள்ளது.',
  },
  maduraiSangam: {
    en: 'A volume connected with the Madurai Tamil Sangam, the literary academy founded in Madurai in 1901 by Pandithurai Thevar and often called the “Fourth Tamil Sangam”.',
    ta: 'பாண்டித்துரைத் தேவர் 1901-ஆம் ஆண்டு மதுரையில் நிறுவிய மதுரைத் தமிழ்ச் சங்கத்துடன் தொடர்புடைய நூல். இச்சங்கம் "நான்காம் தமிழ்ச் சங்கம்" என்றும் அழைக்கப்படுகிறது.',
  },
  tirukkural: {
    en: 'The Thirukkural by Thiruvalluvar: 1,330 two-line couplets in 133 chapters, divided into three books — Virtue (Aram), Wealth (Porul), and Love (Inbam). It has been translated into many of the world’s languages.',
    ta: 'திருவள்ளுவர் இயற்றிய திருக்குறள்: 133 அதிகாரங்களில் 1330 குறட்பாக்கள்; அறம், பொருள், இன்பம் என மூன்று பால்களாகப் பகுக்கப்பட்டது. உலகின் பல மொழிகளில் மொழிபெயர்க்கப்பட்ட பெருமை உடையது.',
  },
  arathuppal: {
    en: 'Arathuppal, the Book of Virtue: the first 38 chapters of the Thirukkural, on prayer, family life, kindness, truthfulness, and self-discipline.',
    ta: 'அறத்துப்பால்: திருக்குறளின் முதல் 38 அதிகாரங்கள். கடவுள் வாழ்த்து, இல்வாழ்க்கை, அன்பு, வாய்மை, அடக்கம் முதலிய அறநெறிகளைக் கூறுகிறது.',
  },
  kamathuppal: {
    en: 'Kamathuppal (Inbathuppal), the Book of Love: the last 25 chapters of the Thirukkural, tenderly describing love before and after marriage.',
    ta: 'காமத்துப்பால் (இன்பத்துப்பால்): திருக்குறளின் இறுதி 25 அதிகாரங்கள். களவு, கற்பு ஆகிய இருநிலைகளிலும் காதல் வாழ்வை நுட்பமாகப் பாடுகிறது.',
  },
  kuralSelection: {
    en: 'A selection drawn from the Thirukkural, gathering memorable couplets for readers.',
    ta: 'திருக்குறளிலிருந்து தேர்ந்தெடுக்கப்பட்ட குறள்களின் தொகுப்பு.',
  },
  kuralTranslation: {
    en: 'A volume from the shrine’s collection of Thirukkural translations. The Kural’s message of virtue has reached readers in many Indian and world languages.',
    ta: 'திருவள்ளுவர் திருத்தலத்தின் மொழிபெயர்ப்புத் தொகுப்பைச் சேர்ந்த நூல். திருக்குறளின் அறச்செய்தி இந்திய மொழிகளிலும் உலக மொழிகளிலும் பல வாசகர்களைச் சென்றடைந்துள்ளது.',
  },
  naladiyar: {
    en: 'Naladiyar: 400 four-line verses on ethics, traditionally attributed to Jain monks. It is so highly valued that a Tamil proverb pairs it with the Thirukkural: “Naalum irandum sollukku urudhi.”',
    ta: 'நாலடியார்: சமண முனிவர்கள் பாடியதாகக் கருதப்படும் நானூறு நான்கடிப் பாடல்களைக் கொண்ட அறநூல். "நாலும் இரண்டும் சொல்லுக்கு உறுதி" என்று திருக்குறளோடு சேர்த்துப் போற்றப்படுகிறது.',
  },
  silapathikaram: {
    en: 'Silapathikaram, “the tale of the anklet”, by Ilango Adigal — one of the Five Great Epics of Tamil. It tells the story of Kannagi and Kovalan across Puhar, Madurai, and the Chera land.',
    ta: 'இளங்கோவடிகள் இயற்றிய சிலப்பதிகாரம், தமிழின் ஐம்பெருங்காப்பியங்களுள் ஒன்று. புகார், மதுரை, வஞ்சி ஆகிய மூன்று காண்டங்களில் கண்ணகி – கோவலன் வரலாற்றைக் கூறுகிறது.',
  },
  manimegalai: {
    en: 'Manimegalai by Seethalai Sathanar, one of the Five Great Epics and a sequel to Silapathikaram. It follows Manimegalai, daughter of Kovalan and Madhavi, on her path to becoming a Buddhist nun.',
    ta: 'சீத்தலைச் சாத்தனார் இயற்றிய மணிமேகலை, ஐம்பெருங்காப்பியங்களுள் ஒன்று; சிலப்பதிகாரத்தின் தொடர்ச்சி. கோவலன் – மாதவியின் மகள் மணிமேகலை பௌத்தத் துறவியான வரலாற்றைக் கூறுகிறது.',
  },
  kambar: {
    en: 'A volume on the poetry of Kambar, the great poet of the Kamba Ramayanam (Ramavataram), whose mastery of Tamil earned him the title “Kavichakravarthi”, emperor of poets.',
    ta: 'கம்பராமாயணம் (இராமாவதாரம்) இயற்றிய கவிச்சக்கரவர்த்தி கம்பரின் கவிதைச் சிறப்பைப் பற்றிய நூல்.',
  },
  tolkappiyam: {
    en: 'The Tolkappiyam by Tolkappiyar is the oldest surviving Tamil grammar. Its three books cover letters and sounds (Ezhuthu), words (Sol), and the subject matter of life and poetry (Porul).',
    ta: 'தொல்காப்பியர் இயற்றிய தொல்காப்பியம், இன்று கிடைக்கும் மிகப் பழைய தமிழ் இலக்கண நூல். எழுத்து, சொல், பொருள் என்னும் மூன்று அதிகாரங்களைக் கொண்டது.',
  },
  tolkappiyamEzhuthu: {
    en: 'Ezhuthathikaram, the first book of the Tolkappiyam: the grammar of Tamil letters, sounds, and how they combine.',
    ta: 'எழுத்ததிகாரம்: தொல்காப்பியத்தின் முதல் அதிகாரம். தமிழ் எழுத்துகள், ஒலிகள், புணர்ச்சி விதிகள் பற்றிய இலக்கணத்தைக் கூறுகிறது.',
  },
  tolkappiyamSol: {
    en: 'Sollathikaram, the second book of the Tolkappiyam: the grammar of Tamil words, their classes, and their usage.',
    ta: 'சொல்லதிகாரம்: தொல்காப்பியத்தின் இரண்டாம் அதிகாரம். தமிழ்ச் சொற்களின் வகைகள், அவற்றின் பயன்பாடு பற்றிய இலக்கணத்தைக் கூறுகிறது.',
  },
  aintinaiEzhupathu: {
    en: 'One of the Eighteen Minor Classics (Pathinenkilkanakku), by Muvathiyar: seventy love poems, fourteen for each of the five landscapes.',
    ta: 'பதினெண் கீழ்க்கணக்கு நூல்களுள் ஒன்று; மூவாதியார் இயற்றியது. ஐந்து திணைகளுக்கும் திணைக்குப் பதினான்காக எழுபது அகப் பாடல்கள்.',
  },
  tinaimozhiAimpathu: {
    en: 'One of the Eighteen Minor Classics, by Kannan Senthanar: fifty love poems, ten for each of the five landscapes.',
    ta: 'பதினெண் கீழ்க்கணக்கு நூல்களுள் ஒன்று; கண்ணன் சேந்தனார் இயற்றியது. திணைக்குப் பத்தாக ஐம்பது அகப் பாடல்கள்.',
  },
  tinaimalaiNurraimpathu: {
    en: 'One of the Eighteen Minor Classics, by Kanimethaviyar: about a hundred and fifty love poems, some thirty for each of the five landscapes.',
    ta: 'பதினெண் கீழ்க்கணக்கு நூல்களுள் ஒன்று; கணிமேதாவியார் இயற்றியது. திணைக்கு ஏறத்தாழ முப்பதாக நூற்றைம்பது அகப் பாடல்கள்.',
  },
  tolkappiyamPorul: {
    en: 'Porulathikaram, the third book of the Tolkappiyam: the themes of Tamil life and poetry — love (akam), the outer world (puram), and poetic convention.',
    ta: 'பொருளதிகாரம்: தொல்காப்பியத்தின் மூன்றாம் அதிகாரம். அகம், புறம் உள்ளிட்ட தமிழர் வாழ்வியலையும் செய்யுள் மரபுகளையும் விளக்குகிறது.',
  },
  sangamPolity: {
    en: 'A scholarly study of government, administration, and social life in the Tamil country of the Sangam age.',
    ta: 'சங்க காலத் தமிழகத்தின் அரசியல், ஆட்சி முறை, சமூக வாழ்க்கை ஆகியவற்றை ஆராயும் ஆய்வு நூல்.',
  },
  commentaryEdition: {
    en: 'Its title means “original text with explanatory commentary”: a classic Tamil work printed together with notes that help readers understand it.',
    ta: '"மூலமும் கருத்துரையும்" என்னும் தலைப்பின்படி, ஒரு தமிழ்ச் செவ்வியல் நூலின் மூலபாடமும், அதைப் புரிந்துகொள்ள உதவும் கருத்துரையும் சேர்த்து அச்சிடப்பட்ட பதிப்பு.',
  },
  earlyPrint: {
    en: 'A rare book from the first decades of Tamil printing, when classic texts preserved on palm leaves were being set in type for the first time.',
    ta: 'பனையோலைச் சுவடிகளில் இருந்த செவ்வியல் நூல்கள் முதன்முதலில் அச்சேறத் தொடங்கிய காலத்தைச் சேர்ந்த அரிய அச்சு நூல்.',
  },
  rareArchive: {
    en: 'A rare volume digitised from CICT’s archive and preserved for study. Full catalogue details will be added by the museum’s curators.',
    ta: 'செம்மொழித் தமிழாய்வு மத்திய நிறுவனத்தின் காப்பகத்திலிருந்து எண்ணிமமாக்கப்பட்டு, ஆய்வுக்காகப் பாதுகாக்கப்படும் அரிய நூல். முழுமையான விவர அட்டவணையை அருங்காட்சியகக் காப்பாளர்கள் விரைவில் சேர்ப்பர்.',
  },
};

/**
 * Builds the full description for a shelf item: in Tamil and English, and in the museum's
 * chosen language when that is another (its base text from the language pack, falling back to
 * English, as `translate` does), under that language's code.
 */
export function describeBook(book, lang = getLang()) {
  const base = book.description ?? works[book.work] ?? works.rareArchive;
  const notes = (language) => [
    book.year && tri(`This edition was printed in ${book.year}.`, `இப்பதிப்பு ${book.year}-ஆம் ஆண்டு அச்சிடப்பட்டது.`, `यह संस्करण ${book.year} में छपा था।`, language),
    book.edition === 'cict' && tri('Published by the Central Institute of Classical Tamil (CICT).', 'செம்மொழித் தமிழாய்வு மத்திய நிறுவனம் வெளியிட்ட பதிப்பு.', 'केंद्रीय शास्त्रीय तमिल संस्थान (CICT) द्वारा प्रकाशित।', language),
  ].filter(Boolean);
  const description = {
    en: [base.en, ...notes('en')].join(' '),
    ta: [base.ta, ...notes('ta')].join(' '),
  };
  if (lang !== 'en' && lang !== 'ta') description[lang] = [base[lang] ?? lookup(base.en, lang) ?? base.en, ...notes(lang)].join(' ');
  return description;
}

/** Compares names loosely: case, spacing, and spaces round the dash don't matter. */
const nameKey = (text) => text.toLocaleLowerCase().replace(/\s*-\s*/g, '-').replace(/\s+/g, ' ').trim();

/** A recording in public/Audio/Rare Books named "<book title>-<Tamil|English>", or null. */
function rareBookRecording(book, language) {
  const wanted = nameKey(`${book.title}-${language}`);
  const file = (recordings[BOOK_AUDIO_FOLDER] ?? []).find((name) => nameKey(name.replace(/\.[^.]+$/, '')) === wanted);
  return file ? mediaUrl(`/Audio/${BOOK_AUDIO_FOLDER}/${file}`) : null;
}

/**
 * Narration for a shelf item: a recording in public/Audio/Rare Books named after the
 * book's title ("Tirukkural on Virtues-Tamil.mpeg", "Tirukkural on Virtues-English.mpeg"),
 * or else the generated reading of its description in Tamil, English or Hindi
 * (public/narration/ta|en|hi). A language with no recording gets no tab.
 */
export function bookAudio(book) {
  // Only languages that really have a recording get a tab (a tab with no file behind it would
  // show a button that never plays).
  const tracks = {};
  const tamil = rareBookRecording(book, 'Tamil') ?? generatedNarration(describeBook(book, 'ta').ta);
  if (tamil) tracks.ta = { label: 'தமிழ்', src: tamil, title: book.tamil ?? book.title };
  const english = rareBookRecording(book, 'English') ?? englishNarration(englishTitle(book), describeBook(book, 'en').en);
  if (english) tracks.en = { label: 'English', src: english, title: book.title };
  // A Hindi tab where the book has a Hindi narration (public/narration/hi) and no recording of its own.
  const hindi = rareBookRecording(book, 'Tamil') ? null : hindiNarration(englishTitle(book), describeBook(book, 'en').en);
  if (hindi) tracks.hi = { label: 'हिन्दी', src: hindi, title: book.title };
  return tracks;
}
