import manifest from 'virtual:museum-manuscripts';
import recordings from 'virtual:museum-audio';
import { mediaUrl } from '../mediaUrl.js';
import { generatedNarration } from '../narration/generated.js';

/**
 * The palm-leaf manuscripts in public/Manuscripts: one folder per bundle, its leaf
 * photographs listed at build time (the `museum-manifests` plugin, vite.config.js).
 *
 * CATALOGUE names each bundle's folder and gives the work's Tamil and English names, the
 * shelf it stands on, and a short note in both languages. A folder can be narrowed to some
 * of its leaves (`leaves`: 'top' for the folder's own files only, or a sub-folder's path),
 * or set aside as a copy of another bundle (`copyOf`), so the same leaves are never shelved
 * twice. A new folder dropped into public/Manuscripts without an entry still joins the
 * library, on the last shelf, under its folder name.
 *
 * Narration: a recording in public/Audio/Manuscripts/ named after the bundle's folder
 * ("Natrinai.mp3", or "…-Tamil.mp3" / "…-English.mp3"; Tamil first).
 */

export const SHELVES = [
  { id: 'ettuthokai', title: 'Ettuthokai — The Eight Anthologies', tamil: 'எட்டுத்தொகை' },
  { id: 'pattuppattu', title: 'Pattuppattu — The Ten Idylls', tamil: 'பத்துப்பாட்டு' },
  { id: 'kilkanakku', title: 'Pathinenkilkanakku — The Eighteen Minor Classics', tamil: 'பதினெண் கீழ்க்கணக்கு' },
  { id: 'epics-grammar', title: 'Epics, Grammar & Later Works', tamil: 'காப்பியங்கள், இலக்கணம், பிற நூல்கள்' },
];

const CATALOGUE = [
  // Ettuthokai
  {
    folder: 'Natrinai', shelf: 'ettuthokai', tamil: 'நற்றிணை', title: 'Natrinai',
    en: 'Four hundred akam poems of nine to twelve lines on the five landscapes of love — the first of the Eight Anthologies.',
    ta: 'ஒன்பது முதல் பன்னிரண்டு அடிகளால் ஆன நானூறு அகப்பாடல்கள்; ஐந்திணைக் காதல் வாழ்வைப் பாடும் எட்டுத்தொகையின் முதல் நூல்.',
  },
  {
    folder: 'Kuruntokai', shelf: 'ettuthokai', tamil: 'குறுந்தொகை', title: 'Kurunthokai',
    en: 'About four hundred short akam poems of four to eight lines, among the most quoted verses of Sangam love poetry.',
    ta: 'நான்கு முதல் எட்டு அடிகளால் ஆன ஏறத்தாழ நானூறு சிறு அகப்பாடல்கள்; சங்கக் காதல் கவிதைகளில் மிகுதியாக மேற்கோள் காட்டப்படுபவை.',
  },
  {
    folder: 'Ainkuru nooru tal suvadi 105', shelf: 'ettuthokai', tamil: 'ஐங்குறுநூறு', title: 'Ainkurunuru', number: '105',
    en: 'Five hundred very short akam poems, a hundred for each of the five tinai, each hundred by a single poet.',
    ta: 'ஐந்து திணைகளுக்கும் திணைக்கு நூறாக ஐந்நூறு சிறு அகப்பாடல்கள்; ஒவ்வொரு நூறும் ஒரு புலவரால் பாடப்பட்டது.',
  },
  {
    folder: 'Pathirrupattu-1 no 1075A single', shelf: 'ettuthokai', tamil: 'பதிற்றுப்பத்து', title: 'Pathitrupathu', number: '1075 A',
    en: 'Ten decads of puram poems in praise of the Chera kings, each decad on one king; the first and last decads are lost.',
    ta: 'சேர மன்னர்களைப் புகழும் பத்துப் பத்துப் புறப்பாடல்கள், ஒவ்வொரு பத்தும் ஒரு மன்னனைப் பற்றியது; முதல் பத்தும் இறுதிப் பத்தும் கிடைக்கவில்லை.',
  },
  {
    folder: 'Paripadal MSS No 175 but DVD 247', shelf: 'ettuthokai', tamil: 'பரிபாடல்', title: 'Paripadal', number: '175',
    en: 'Hymns set to music in the paripadal metre, to Thirumal and Murugan and on the river Vaigai at Madurai; twenty-four of seventy survive.',
    ta: 'திருமால், முருகன், மதுரை வையை ஆறு ஆகியவற்றைப் பாடும், இசையோடு பாடப்பட்ட பரிபாடல்கள்; எழுபதில் இருபத்து நான்கே கிடைத்துள்ளன.',
  },
  {
    folder: 'Agananuru-1no 28single', shelf: 'ettuthokai', tamil: 'அகநானூறு', title: 'Akananuru', number: '28',
    en: 'Four hundred longer akam poems of thirteen to thirty-one lines, arranged by number so that each tinai has its own places in the sequence.',
    ta: 'பதின்மூன்று முதல் முப்பத்தொரு அடிகளால் ஆன நானூறு நெடிய அகப்பாடல்கள்; ஒவ்வொரு திணைக்கும் வரிசையில் தனி எண்கள் அமையுமாறு தொகுக்கப்பட்டவை.',
  },
  {
    folder: 'purananuru  no 35', shelf: 'ettuthokai', tamil: 'புறநானூறு', title: 'Purananuru', number: '35',
    en: 'Four hundred puram poems on kings and chieftains, war, generosity and death — the richest source for the history of the Sangam age.',
    ta: 'மன்னர்கள், வள்ளல்கள், போர், கொடை, இறப்பு பற்றிய நானூறு புறப்பாடல்கள்; சங்க கால வரலாற்றுக்கு மிக வளமான சான்று.',
  },

  // Pattuppattu
  {
    folder: 'Thirumurukathrupadai Nachinaku Urai-416 Single', shelf: 'pattuppattu', tamil: 'திருமுருகாற்றுப்படை — நச்சினார்க்கினியர் உரை', title: 'Thirumurugatrupadai with Nachinarkkiniyar’s Commentary', number: '416',
    en: 'Nakkeerar’s guide-poem directing a devotee to Murugan’s six shrines, copied with the commentary of Nachinarkkiniyar.',
    ta: 'முருகனின் ஆறு படைவீடுகளுக்கு அடியவரை ஆற்றுப்படுத்தும் நக்கீரரின் பாட்டு, நச்சினார்க்கினியர் உரையுடன்.',
  },
  {
    folder: 'Porunarruppatai-3 no 231 A SINGLE', shelf: 'pattuppattu', tamil: 'பொருநராற்றுப்படை', title: 'Porunaratrupadai', number: '231 A',
    en: 'Mudathamakkanniyar’s guide-poem sending a bard to the generous Chola king Karikalan.',
    ta: 'கொடைவள்ளல் சோழன் கரிகாலனிடம் பொருநனை ஆற்றுப்படுத்தும் முடத்தாமக்கண்ணியாரின் பாட்டு.',
  },
  {
    folder: 'Sirupanarruppatai-2 no 461 (Paper)', leaves: 'top', shelf: 'pattuppattu', tamil: 'சிறுபாணாற்றுப்படை', title: 'Sirupanatrupadai', number: '461', material: 'Paper manuscript',
    en: 'Nallur Nathathanar’s guide-poem sending a poor bard to the chieftain Nalliyakkodan. This copy is written on paper rather than palm leaf.',
    ta: 'சிறுபாணனை நல்லியக்கோடனிடம் ஆற்றுப்படுத்தும் நல்லூர் நத்தத்தனாரின் பாட்டு. இப்படி ஓலையில் அன்றித் தாளில் எழுதப்பட்டது.',
  },
  // The same leaves photographed again: shelved once, as no. 461 above.
  { folder: 'sirupanantrupadai', copyOf: 'Sirupanarruppatai-2 no 461 (Paper)' },
  { folder: 'SIRUPANARTUPADAI 2  no 461', copyOf: 'Sirupanarruppatai-2 no 461 (Paper)' },
  {
    folder: 'Perubanatrupadai-166 Original', shelf: 'pattuppattu', tamil: 'பெரும்பாணாற்றுப்படை', title: 'Perumpanatrupadai', number: '166',
    en: 'Kadiyalur Uruthirankannanar’s guide-poem to Thondaiman Ilanthiraiyan of Kanchi, rich in pictures of the people of each landscape on the way.',
    ta: 'காஞ்சித் தொண்டைமான் இளந்திரையனிடம் ஆற்றுப்படுத்தும் கடியலூர் உருத்திரங்கண்ணனாரின் பாட்டு; வழியிலுள்ள ஒவ்வொரு நில மக்களையும் விரிவாகக் காட்டுவது.',
  },
  {
    folder: 'mullaipattu 184 C', shelf: 'pattuppattu', tamil: 'முல்லைப்பாட்டு', title: 'Mullaippattu', number: '184 C',
    en: 'Napputhanar’s 103-line poem of a queen waiting through the rains for her king, away at his war camp — the shortest of the Ten Idylls.',
    ta: 'போர்ப்பாசறையிலுள்ள மன்னனுக்காகக் கார் காலத்தில் ஆற்றியிருக்கும் அரசியைப் பாடும் நப்பூதனாரின் 103 அடிப் பாட்டு; பத்துப்பாட்டில் மிகச் சிறியது.',
  },
  {
    folder: 'Maduraikangi 579 D', shelf: 'pattuppattu', tamil: 'மதுரைக்காஞ்சி', title: 'Maduraikkanchi', number: '579 D',
    en: 'Mangudi Maruthanar’s counsel to the Pandya king Nedunchezhiyan on the passing of all things, with a long portrait of Madurai by day and night — the longest of the Ten Idylls.',
    ta: 'நிலையாமையைப் பாண்டியன் நெடுஞ்செழியனுக்கு உணர்த்தும் மாங்குடி மருதனாரின் பாட்டு; மதுரையின் பகலையும் இரவையும் விரிவாகக் காட்டுவது; பத்துப்பாட்டில் மிக நீண்டது.',
  },
  {
    folder: 'Maduraikkanchi-1 no 579D single', shelf: 'pattuppattu', tamil: 'மதுரைக்காஞ்சி', title: 'Maduraikkanchi — Single Leaves', number: '579 D',
    en: 'A separate photographing of the opening leaves of bundle 579 D, the Maduraikkanchi.',
    ta: '579 D சுவடியாகிய மதுரைக்காஞ்சியின் தொடக்க ஏடுகளின் தனிப் படப்பிடிப்பு.',
  },
  {
    folder: 'Neadunal Vaazhai-579e Single', shelf: 'pattuppattu', tamil: 'நெடுநல்வாடை', title: 'Nedunalvadai', number: '579 E',
    en: 'Nakkeerar’s poem of the long, cold north wind: a queen sleepless in her palace while the king is away at war.',
    ta: 'நீண்ட குளிர் வாடைக் காலத்தில், போருக்குச் சென்ற மன்னனை நினைத்து அரண்மனையில் உறக்கமின்றி இருக்கும் அரசியைப் பாடும் நக்கீரரின் பாட்டு.',
  },
  {
    folder: 'Kurunchi Paatu-579e1 Single', shelf: 'pattuppattu', tamil: 'குறிஞ்சிப்பாட்டு', title: 'Kurinjippattu', number: '579 E1',
    en: 'Kapilar’s Kurinji poem, said to have been sung to teach an Aryan king Tamil love poetry; it names ninety-nine flowers of the hills.',
    ta: 'ஆரிய அரசனுக்குத் தமிழ் அகத்தை உணர்த்தப் பாடப்பட்டதாகச் சொல்லப்படும் கபிலரின் குறிஞ்சிப் பாட்டு; தொண்ணூற்றொன்பது மலர்களைப் பட்டியலிடுவது.',
  },
  {
    folder: 'Pattinnapallai 579 F', shelf: 'pattuppattu', tamil: 'பட்டினப்பாலை', title: 'Pattinappalai', number: '579 F',
    en: 'Kadiyalur Uruthirankannanar’s poem on the Chola port of Kaveripoompattinam (Puhar) and its sea trade, framed as a lover refusing to leave.',
    ta: 'சோழர் துறைமுகமான காவிரிப்பூம்பட்டினத்தையும் அதன் கடல் வணிகத்தையும் பாடும் கடியலூர் உருத்திரங்கண்ணனாரின் பாட்டு.',
  },
  {
    folder: 'malaipadukaddam 579 G', shelf: 'pattuppattu', tamil: 'மலைபடுகடாம்', title: 'Malaipadukadam', number: '579 G',
    en: 'Perunkousikanar’s guide-poem leading a troupe of musicians through the hills to the chieftain Nannan, full of the sounds of the mountain.',
    ta: 'கூத்தர் குழுவை மலைவழியே நன்னனிடம் ஆற்றுப்படுத்தும் பெருங்கௌசிகனாரின் பாட்டு; மலையின் ஓசைகள் நிறைந்தது.',
  },

  // Pathinenkilkanakku
  {
    folder: 'Tirukkural Parimelazhar Urai 66-94', shelf: 'kilkanakku', tamil: 'திருக்குறள் — பரிமேலழகர் உரை', title: 'Tirukkural with Parimelazhagar’s Commentary', number: '66–94',
    en: 'Thiruvalluvar’s 1330 couplets on virtue, wealth and love, copied with the thirteenth-century commentary of Parimelazhagar, the most studied of the classical commentaries.',
    ta: 'அறம், பொருள், இன்பம் பற்றிய திருவள்ளுவரின் 1330 குறட்பாக்கள், பதின்மூன்றாம் நூற்றாண்டுப் பரிமேலழகர் உரையுடன் — பழைய உரைகளுள் மிகுதியாகப் பயிலப்படுவது.',
  },
  {
    folder: 'nanmanikadugai TR 2365', shelf: 'kilkanakku', tamil: 'நான்மணிக்கடிகை', title: 'Nanmanikkadigai', number: 'TR 2365',
    en: 'Vilambi Naganar’s hundred verses, each setting four gems of moral teaching side by side.',
    ta: 'ஒவ்வொரு பாடலிலும் நான்கு அறக்கருத்துகளை மணிகளாகக் கோக்கும் விளம்பி நாகனாரின் நூறு பாடல்கள்.',
  },
  {
    folder: 'Iniyavainarpathu 524 A', shelf: 'kilkanakku', tamil: 'இனியவை நாற்பது', title: 'Iniyavai Narpathu', number: '524 A',
    en: 'Forty verses by Pudhanchendhanar on the things that are sweet in life.',
    ta: 'வாழ்வில் இனியவற்றை எடுத்துரைக்கும் பூதஞ்சேந்தனாரின் நாற்பது பாடல்கள்.',
  },
  {
    folder: 'Innanarpadhu 3 no 698 A', shelf: 'kilkanakku', tamil: 'இன்னா நாற்பது', title: 'Inna Narpathu', number: '698 A',
    en: 'Kapilar’s forty verses on the things that bring sorrow — the companion of Iniyavai Narpathu.',
    ta: 'துன்பம் தருவனவற்றை எடுத்துரைக்கும் கபிலரின் நாற்பது பாடல்கள்; இனியவை நாற்பதின் இணை நூல்.',
  },
  {
    folder: 'Kaarnarpathu-603 D', shelf: 'kilkanakku', tamil: 'கார் நாற்பது', title: 'Kar Narpathu', number: '603 D',
    en: 'Forty Mullai verses by Kannan Koothanar on the coming of the rains, when the waiting heroine looks for her lover’s return.',
    ta: 'கார் காலத்தின் வருகையையும், தலைவனின் வரவை எதிர்நோக்கும் தலைவியையும் பாடும் கண்ணங்கூத்தனாரின் நாற்பது முல்லைப் பாடல்கள்.',
  },
  // Its sub-folder repeats the Kaarnarpathu-603 D leaves above; only the bundle's own leaves are shelved here.
  {
    folder: 'Karnarpadu 603 D', leaves: 'top', shelf: 'kilkanakku', tamil: 'கார் நாற்பது — சுவடிக் கட்டு', title: 'Kar Narpathu — Bundle 603 D', number: '603 D',
    en: 'The larger digitisation catalogued under the same number, 603 D: more than six hundred leaf images of the bundle in which the Kar Narpathu is kept.',
    ta: 'அதே 603 D எண்ணில் பதிவான பெரிய எண்ணிமத் தொகுப்பு: கார் நாற்பது உள்ள சுவடிக் கட்டின் அறுநூற்றுக்கும் மேற்பட்ட ஏட்டுப் படங்கள்.',
  },
  {
    folder: 'Kalavali Naarpathu-603 E', shelf: 'kilkanakku', tamil: 'களவழி நாற்பது', title: 'Kalavazhi Narpathu', number: '603 E',
    en: 'Poigaiyar’s forty verses on the battlefield of Kazhumalam, sung — tradition says — to win the release of the Chera king from the Chola Senganan.',
    ta: 'கழுமலப் போர்க்களத்தைப் பாடும் பொய்கையாரின் நாற்பது பாடல்கள்; சோழன் செங்கணானிடமிருந்து சேரனை விடுவிக்கப் பாடப்பட்டதாக மரபு.',
  },
  {
    folder: 'Aintinai aiyambathu 698 E', shelf: 'kilkanakku', tamil: 'ஐந்திணை ஐம்பது', title: 'Aintinai Aimpathu', number: '698 E', tinai: true,
    en: 'Fifty akam verses by Maran Poraiyanar, ten for each of the five landscapes.',
    ta: 'ஐந்து திணைகளுக்கும் திணைக்குப் பத்தாக மாறன் பொறையனார் பாடிய ஐம்பது அகப்பாடல்கள்.',
  },
  {
    folder: 'AITINAI YALUPADHU tal vsuvdi 1 no 99 A', shelf: 'kilkanakku', tamil: 'ஐந்திணை எழுபது', title: 'Aintinai Ezhupathu', number: '99 A', tinai: true,
    en: 'Seventy akam verses by Moovathiyar, fourteen for each of the five landscapes; a few verses are lost.',
    ta: 'ஐந்து திணைகளுக்கும் திணைக்குப் பதினான்காக மூவாதியார் பாடிய எழுபது அகப்பாடல்கள்; சில பாடல்கள் கிடைக்கவில்லை.',
  },
  {
    folder: 'tinaimoziaimpathu 1 no 698 F', shelf: 'kilkanakku', tamil: 'திணைமொழி ஐம்பது', title: 'Tinaimozhi Aimpathu', number: '698 F', tinai: true,
    en: 'Fifty akam verses by Kannan Chendhanar, ten for each landscape.',
    ta: 'ஒவ்வொரு திணைக்கும் பத்தாகக் கண்ணன் சேந்தனார் பாடிய ஐம்பது அகப்பாடல்கள்.',
  },
  {
    folder: 'Thinai Malai Noorraimpathu-1078 M', shelf: 'kilkanakku', tamil: 'திணைமாலை நூற்றைம்பது', title: 'Tinaimalai Nurraimpathu', number: '1078 M', tinai: true,
    en: 'A garland of about a hundred and fifty akam verses by Kanimethaviyar, some thirty for each of the five landscapes.',
    ta: 'ஐந்து திணைகளுக்கும் ஏறத்தாழ முப்பது முப்பதாகக் கணிமேதாவியார் பாடிய நூற்றைம்பது அகப்பாடல்களின் மாலை.',
  },
  {
    folder: 'Kainilai 524 J', shelf: 'kilkanakku', tamil: 'கைந்நிலை', title: 'Kainnilai', number: '524 J', tinai: true,
    en: 'Sixty akam verses by Pullankadanar, twelve for each landscape; many survive only in part.',
    ta: 'ஒவ்வொரு திணைக்கும் பன்னிரண்டாகப் புல்லங்காடனார் பாடிய அறுபது அகப்பாடல்கள்; பல பாடல்கள் சிதைந்த நிலையிலேயே கிடைத்துள்ளன.',
  },
  {
    folder: 'Tirikadugam TR 2306', shelf: 'kilkanakku', tamil: 'திரிகடுகம்', title: 'Tirikadugam', number: 'TR 2306',
    en: 'Nallathanar’s hundred verses, each naming three things that heal the mind as dry ginger, pepper and long pepper heal the body.',
    ta: 'சுக்கு, மிளகு, திப்பிலி உடலுக்கு மருந்தாவது போல, மனத்துக்கு மருந்தாகும் மூன்று கருத்துகளை ஒவ்வொரு பாடலிலும் கூறும் நல்லாதனாரின் நூறு பாடல்கள்.',
  },
  {
    folder: 'Asarakovai tal suvadi 4 no 53', shelf: 'kilkanakku', tamil: 'ஆசாரக்கோவை', title: 'Acharakkovai', number: '53',
    en: 'Peruvayin Mulliyar’s verses on right conduct in daily life — eating, bathing, speaking and keeping company.',
    ta: 'உண்ணல், நீராடல், பேசுதல், பழகுதல் முதலிய அன்றாட ஒழுக்கங்களைக் கூறும் பெருவாயின் முள்ளியாரின் பாடல்கள்.',
  },
  {
    folder: 'Pazamoli 589', shelf: 'kilkanakku', tamil: 'பழமொழி நானூறு', title: 'Pazhamozhi Nanuru', number: '589',
    en: 'Munrurai Araiyanar’s four hundred verses, each closing on a proverb.',
    ta: 'ஒவ்வொரு பாடலும் ஒரு பழமொழியுடன் முடியும் முன்றுறை அரையனாரின் நானூறு பாடல்கள்.',
  },
  {
    folder: 'Sirupanchamoolam tal suvadi 5 no 247', shelf: 'kilkanakku', tamil: 'சிறுபஞ்சமூலம்', title: 'Sirupanchamulam', number: '247',
    en: 'Kariyasan’s verses, each naming five teachings, as the five small roots of a classical medicine are combined.',
    ta: 'ஐந்து சிறு வேர்கள் சேர்ந்த மருந்தைப் போல, ஒவ்வொரு பாடலிலும் ஐந்து கருத்துகளைக் கூறும் காரியாசானின் பாடல்கள்.',
  },
  {
    folder: 'mudhumozhikanchi 1998 - 3', shelf: 'kilkanakku', tamil: 'முதுமொழிக்காஞ்சி', title: 'Mudumozhikkanchi', number: '1998-3',
    en: 'Kudalur Kizhar’s hundred one-line maxims, in ten sections of ten.',
    ta: 'பத்துப் பத்தாக அமைந்த, கூடலூர் கிழாரின் நூறு ஓரடி முதுமொழிகள்.',
  },
  {
    folder: 'Elathi-1048 T', shelf: 'kilkanakku', tamil: 'ஏலாதி', title: 'Elathi', number: '1048 T',
    en: 'Kanimethaviyar’s verses, each with six teachings, named after a medicine of cardamom and five other spices.',
    ta: 'ஏலம் முதலிய ஆறு பொருள்களால் ஆன மருந்தின் பெயர் கொண்டு, ஒவ்வொரு பாடலிலும் ஆறு கருத்துகளைக் கூறும் கணிமேதாவியாரின் பாடல்கள்.',
  },

  // Epics, grammar and later works
  {
    folder: 'Silapathikaram Mulam 1090', shelf: 'epics-grammar', tamil: 'சிலப்பதிகாரம் — மூலம்', title: 'Silappathikaram — Text', number: '1090',
    en: 'Ilango Adigal’s epic of the anklet: Kannagi, Kovalan and the burning of Madurai, told across the Chola, Pandya and Chera lands.',
    ta: 'கண்ணகி, கோவலன், மதுரை எரிந்த கதையைச் சோழ, பாண்டிய, சேர நாடுகளினூடே கூறும் இளங்கோவடிகளின் சிலம்புக் காப்பியம், மூலம்.',
  },
  {
    folder: 'Manimehalai-78', shelf: 'epics-grammar', tamil: 'மணிமேகலை', title: 'Manimekalai', number: '78',
    en: 'Seethalai Sathanar’s Buddhist epic of Manimekalai, daughter of Kovalan and Madhavi, who renounces the world — the sequel to the Silappathikaram.',
    ta: 'கோவலன்-மாதவியின் மகள் மணிமேகலை துறவு பூண்ட கதையைக் கூறும் சீத்தலைச் சாத்தனாரின் பௌத்தக் காப்பியம்; சிலப்பதிகாரத்தின் தொடர்ச்சி.',
  },
  {
    folder: 'Tolkappiyam-20 no 07 single images', shelf: 'epics-grammar', tamil: 'தொல்காப்பியம்', title: 'Tolkappiyam', number: '07',
    en: 'The oldest surviving Tamil grammar, in three books — of letters, of words, and of subject matter (porul), where the five tinai of poetry are set out.',
    ta: 'கிடைத்துள்ள மிகப் பழைய தமிழ் இலக்கண நூல்; எழுத்து, சொல், பொருள் என மூன்று அதிகாரங்கள் — ஐந்திணை இலக்கணம் பொருளதிகாரத்தில் வகுக்கப்படுகிறது.',
  },
  {
    folder: 'Iraiyanar Agaporul Mulamum Uraiyum 129', shelf: 'epics-grammar', tamil: 'இறையனார் அகப்பொருள் — மூலமும் உரையும்', title: 'Iraiyanar Akapporul with Commentary', number: '129',
    en: 'Sixty sutras on the grammar of love poetry, with the commentary attributed to Nakkeerar that tells the legend of the three Sangams.',
    ta: 'அகப்பொருள் இலக்கணம் கூறும் அறுபது நூற்பாக்கள், முச்சங்க வரலாற்றைக் கூறும் நக்கீரர் உரையுடன்.',
  },
  {
    folder: 'Muttholiram 73 C', shelf: 'epics-grammar', tamil: 'முத்தொள்ளாயிரம்', title: 'Muttollayiram', number: '73 C',
    en: 'Verses in praise of the three crowned kings — Chera, Chola and Pandya; of the nine hundred the title promises, about a hundred survive.',
    ta: 'சேர, சோழ, பாண்டியர் ஆகிய மூவேந்தரைப் புகழும் பாடல்கள்; பெயர் சுட்டும் தொள்ளாயிரத்தில் ஏறத்தாழ நூறே கிடைத்துள்ளன.',
  },
];

const BY_FOLDER = new Map(CATALOGUE.map((entry) => [entry.folder, entry]));

/** Compares names loosely, as artifacts.js does for narrations. */
const nameKey = (text) => text.normalize('NFC').toLocaleLowerCase().replace(/\s+/g, ' ').trim();

function narrationFor(folder) {
  const files = recordings.Manuscripts ?? [];
  const wanted = nameKey(folder);
  const file = ['-tamil', '', '-english']
    .map((suffix) => files.find((candidate) => nameKey(candidate.replace(/\.[^.]+$/, '')) === `${wanted}${suffix}`))
    .find(Boolean);
  return file ? mediaUrl(`/Audio/Manuscripts/${file}`) : null;
}

/**
 * Orders leaf photographs by the numbers in their names, part by part, so the board shot
 * "0000" comes before "0_1", "0_1" before its reverse "0_1a", and "2" before "10".
 */
const leafParts = (path) => (path.replace(/\.[^.]+$/, '').toLowerCase().match(/\d+|[a-z]+/g) ?? []).map((part) => (/^\d/.test(part) ? Number(part) : part));
function byLeaf(a, b) {
  const [x, y] = [leafParts(a), leafParts(b)];
  for (let i = 0; i < Math.min(x.length, y.length); i += 1) {
    if (x[i] === y[i]) continue;
    if (typeof x[i] !== typeof y[i]) return typeof x[i] === 'number' ? -1 : 1; // numbers before words
    return x[i] < y[i] ? -1 : 1;
  }
  return x.length - y.length;
}

/** The leaves of a bundle, as narrowed by its entry, in reading order. */
function leavesOf(folder, which) {
  let all = manifest[folder] ?? [];
  if (which === 'top') all = all.filter((path) => !path.includes('/'));
  else if (which) all = all.filter((path) => path.startsWith(`${which}/`));
  return [...all].sort(byLeaf);
}

/** Every bundle in public/Manuscripts, in catalogue order; folders without an entry follow. */
const BUNDLES = [...CATALOGUE.map((entry) => entry.folder), ...Object.keys(manifest).filter((folder) => !BY_FOLDER.has(folder))]
  .map((folder) => {
    const entry = BY_FOLDER.get(folder) ?? { folder, shelf: 'epics-grammar', title: folder, tamil: 'ஓலைச்சுவடி' };
    if (entry.copyOf) return null;
    const leaves = leavesOf(folder, entry.leaves).map((path) => ({
      url: mediaUrl(`/Manuscripts/${folder}/${path}`),
      label: path.replace(/\.[^.]+$/, '').split('/').pop(),
    }));
    if (!leaves.length) return null;
    return {
      id: `olai-${nameKey(folder).replace(/[^a-z0-9]+/g, '-')}`,
      folder,
      shelf: entry.shelf,
      title: entry.title,
      tamil: entry.tamil,
      number: entry.number ?? null,
      material: entry.material ?? 'Palm leaf',
      tinai: Boolean(entry.tinai),
      description: entry.en ? { en: entry.en, ta: entry.ta } : null,
      // A recorded narration if there is one, else the generated reading of its Tamil note.
      narration: narrationFor(folder) ?? generatedNarration(entry.ta),
      leaves,
    };
  })
  .filter(Boolean);

/** The shelves of the Manuscripts Library, each with its bundles: [{ ...shelf, bundles }]. */
export const manuscriptShelves = (filter = () => true) =>
  SHELVES.map((shelf) => ({ ...shelf, bundles: BUNDLES.filter((bundle) => bundle.shelf === shelf.id && filter(bundle)) })).filter((shelf) => shelf.bundles.length);

/** The bundles of the works arranged by the five tinai, plus the Ainkurunuru, on one shelf. */
export const tinaiShelves = () => [
  {
    id: 'tinai-bundles',
    title: 'The Five Landscapes in Verse',
    tamil: 'ஐந்திணைப் பாடல்கள்',
    bundles: BUNDLES.filter((bundle) => bundle.tinai || bundle.folder === 'Ainkuru nooru tal suvadi 105'),
  },
];
