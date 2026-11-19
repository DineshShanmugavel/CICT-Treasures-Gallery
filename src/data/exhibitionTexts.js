/**
 * Exhibition texts for the artefact wings, in Tamil and English.
 *
 * - ROOM_PANELS: short exhibition panels on each wing's themes, shown as palm-leaf cards
 *   at the top of the room (keyed by room id).
 * - ARTIFACT_TEXTS: for each photograph (keyed by folder, then file name without its
 *   extension): its Tamil title (`ta`) and a description (`en`, `taText`), shown on the
 *   palm leaf in the artefact's closer view.
 *
 * The texts summarise established scholarship. They describe what each object is and the
 * tradition it belongs to, not the provenance of the particular piece photographed — add
 * that (findspot, collection, accession number) where the museum has it.
 *
 * The food rooms' and the Ainthinai hall's panels are kept in foodsAndLandscapes.js; the
 * Historical Figures hall's portraits and panels in historicalFigures.js; the Then vs Now
 * hall's pictures in thenAndNow.js (whose rooms show their texts on comparison cards instead).
 */

import { FOOD_PANELS } from './foodsAndLandscapes.js';
import { FIGURE_PANELS, FIGURE_TEXTS } from './historicalFigures.js';
import { PLACE_IMAGE_TEXTS } from './thenAndNow.js';

export const ROOM_PANELS = {
  ...FOOD_PANELS,
  ...FIGURE_PANELS,
  pottery: [
    {
      id: 'fired-clay',
      title: { en: 'Memory in Fired Clay', ta: 'சுட்ட மண்ணில் பதிந்த நினைவுகள்' },
      body: {
        en: 'Pottery is the archaeologist’s most faithful witness. Pots break, but their sherds survive for thousands of years, and their clay, shape, colour and firing reveal when and how people lived. From cooking pots and water jars to grain stores and great burial urns, the pottery of the Tamil land traces daily life, belief and trade across more than two and a half thousand years.',
        ta: 'அகழ்வாய்வாளருக்கு மட்பாண்டமே மிக நம்பகமான சாட்சி. பானை உடைந்தாலும் அதன் ஓடுகள் ஆயிரக்கணக்கான ஆண்டுகள் நிலைத்திருக்கின்றன; அவற்றின் மண், வடிவம், நிறம், சுடும் முறை ஆகியவை மக்கள் எப்போது, எப்படி வாழ்ந்தனர் என்பதைச் சொல்கின்றன. சமையல் பானைகள், நீர்க்குடங்கள் முதல் தானியச் சாடிகள், பெரும் முதுமக்கள் தாழிகள் வரை — தமிழ் நிலத்தின் மட்பாண்டங்கள் இரண்டாயிரத்து ஐந்நூறு ஆண்டுகளுக்கும் மேலான அன்றாட வாழ்வையும் நம்பிக்கைகளையும் வணிகத்தையும் வரைந்து காட்டுகின்றன.',
      },
    },
    {
      id: 'keeladi',
      title: { en: 'Keeladi — A Sangam-Age Town on the Vaigai', ta: 'கீழடி — வைகைக் கரையின் சங்ககால நகரம்' },
      body: {
        en: 'At Keeladi in Sivaganga district, about 12 km south-east of Madurai, excavations begun in 2014 uncovered an urban settlement on the banks of the Vaigai: brick buildings, ring wells, drains, spindle whorls, dice, ornaments and tens of thousands of potsherds. Radiocarbon dates from the site reach back to around the 6th century BCE. Among the finds are sherds scratched with personal names in Tamil-Brahmi — evidence that ordinary townspeople could read and write.',
        ta: 'மதுரைக்குத் தென்கிழக்கே ஏறத்தாழ 12 கி.மீ. தொலைவில், சிவகங்கை மாவட்டத்தில் உள்ள கீழடியில் 2014 முதல் நடைபெற்ற அகழாய்வுகள், வைகைக் கரையில் அமைந்த ஒரு நகரக் குடியிருப்பை வெளிக்கொணர்ந்தன: செங்கல் கட்டடங்கள், உறைகிணறுகள், வடிகால்கள், தக்கிளிகள், தாயக்கட்டைகள், அணிகலன்கள், பல்லாயிரக்கணக்கான மட்கல ஓடுகள். இங்கிருந்து பெற்ற கதிரியக்கக் கரிமக் காலக்கணிப்புகள் ஏறத்தாழ கி.மு. 6-ஆம் நூற்றாண்டு வரை செல்கின்றன. தமிழ்-பிராமியில் ஆட்பெயர்கள் கீறப்பட்ட ஓடுகளும் கிடைத்துள்ளன — சாதாரண நகர மக்களும் எழுதப் படிக்கத் தெரிந்திருந்தனர் என்பதற்கான சான்று இது.',
      },
    },
    {
      id: 'adichanallur',
      title: { en: 'Adichanallur — Urn Burials on the Thamirabarani', ta: 'ஆதிச்சநல்லூர் — தாமிரபரணிக் கரையின் தாழிப் புதைவிடம்' },
      body: {
        en: 'On the banks of the Thamirabarani in Thoothukudi district lies one of India’s great Iron Age burial grounds. First dug in 1876 and excavated by Alexander Rea between 1899 and 1905, and again by the Archaeological Survey of India from 2004, Adichanallur has yielded large urns holding human remains, laid with iron tools and weapons, bronze vessels, ornaments and gold mouth-bands. Sangam poems speak of such urns — the முதுமக்கள் தாழி — and even address the potter who made them: கலம்செய் கோவே, “O king among potters”.',
        ta: 'தூத்துக்குடி மாவட்டத்தில் தாமிரபரணிக் கரையில் இந்தியாவின் மிகச் சிறந்த இரும்புக் காலப் புதைவிடங்களுள் ஒன்று அமைந்துள்ளது. 1876-இல் முதன்முதலில் தோண்டப்பட்டு, 1899–1905 இல் அலெக்சாண்டர் ரீயாலும், 2004 முதல் இந்தியத் தொல்லியல் துறையாலும் அகழாய்வு செய்யப்பட்ட ஆதிச்சநல்லூரில், மனித எலும்புகள் கொண்ட பெரும் தாழிகளும், அவற்றுடன் வைக்கப்பட்ட இரும்புக் கருவிகள், ஆயுதங்கள், வெண்கலக் கலங்கள், அணிகலன்கள், பொன் நெற்றிப்பட்டங்களும் கிடைத்துள்ளன. சங்க இலக்கியம் இத்தகைய முதுமக்கள் தாழிகளைக் குறிப்பிடுவதுடன், அவற்றைச் செய்த குயவனையே “கலம்செய் கோவே” என்று விளிக்கிறது.',
      },
    },
    {
      id: 'arikamedu',
      title: { en: 'Arikamedu — Where Rome Came to Trade', ta: 'அரிக்கமேடு — உரோமானியர் வணிகம் செய்த துறை' },
      body: {
        en: 'South of Puducherry, on the Ariyankuppam river, Arikamedu was a busy port around the turn of the Common Era, widely identified with “Poduke” of the Greek sailing guide, the Periplus of the Erythraean Sea. Excavated by Mortimer Wheeler in 1945 and by later teams, it yielded Roman amphorae that carried wine and olive oil, red-gloss Arretine tableware stamped with its Italian makers’ names, rouletted ware, glass and bead-making debris — clear evidence that Tamil merchants traded with the Mediterranean world.',
        ta: 'புதுச்சேரிக்குத் தெற்கே, அரியாங்குப்பம் ஆற்றின் கரையில் உள்ள அரிக்கமேடு, பொது ஊழியின் தொடக்கக் காலத்தில் சுறுசுறுப்பான துறைமுகமாக விளங்கியது; கிரேக்கக் கடற்பயண வழிகாட்டியான “எரித்ரேயக் கடலின் பெரிப்ளஸ்” குறிப்பிடும் “பொதுகே” இதுவே எனப் பரவலாகக் கருதப்படுகிறது. 1945-இல் மார்ட்டிமர் வீலரும் பின்னர் பிற குழுக்களும் நடத்திய அகழாய்வுகளில், மதுவும் ஒலிவ எண்ணெயும் கொண்டுவந்த உரோமானியச் சாடிகள் (ஆம்ஃபோரா), இத்தாலியத் தயாரிப்பாளர் முத்திரையிட்ட சிவப்புப் பளபளப்பு ஆரெட்டைன் கலங்கள், உருள்வரிக் கலங்கள், கண்ணாடி, மணி செய்யும் எச்சங்கள் கிடைத்தன — தமிழ் வணிகர்கள் நடுநிலக் கடல் உலகுடன் வணிகம் செய்ததற்கான தெளிவான சான்று.',
      },
    },
    {
      id: 'black-and-red',
      title: { en: 'Black-and-Red Ware, and Letters on Clay', ta: 'கருப்பு-சிவப்பு மட்கலமும் மண்ணில் எழுத்தும்' },
      body: {
        en: 'The signature pottery of the Tamil Iron Age is black-and-red ware: red on the outside, glossy black inside and at the rim. Potters achieved it by firing the vessels upside down, so that the part shielded from the air turned black. Many such pots carry marks or graffiti scratched into the clay, and from the early historic period onwards, names written in Tamil-Brahmi — the oldest Tamil script — at Keeladi, Kodumanal, Arikamedu and as far away as Sri Lanka, Thailand and the Red Sea coast of Egypt.',
        ta: 'தமிழக இரும்புக் காலத்தின் அடையாள மட்கலம் கருப்பு-சிவப்பு மட்கலம்: வெளியே சிவப்பு, உள்ளேயும் விளிம்பிலும் பளபளக்கும் கருப்பு. கலங்களைத் தலைகீழாக வைத்துச் சுடுவதால், காற்றுப் படாத பகுதி கருப்பாக மாறியது. இத்தகைய கலங்கள் பலவற்றில் குறியீடுகளும் கீறல்களும் உள்ளன; தொடக்க வரலாற்றுக் காலம் முதல் தமிழின் மிகப் பழைய எழுத்தான தமிழ்-பிராமியில் எழுதப்பட்ட பெயர்களும் காணப்படுகின்றன — கீழடி, கொடுமணல், அரிக்கமேடு மட்டுமன்றி இலங்கை, தாய்லாந்து, எகிப்தின் செங்கடல் கரை வரை.',
      },
    },
  ],

  sculptures: [
    {
      id: 'stone-and-bronze',
      title: { en: 'Stone and Bronze: The Tamil Sculptural Tradition', ta: 'கல்லும் செம்பும்: தமிழ்ச் சிற்ப மரபு' },
      body: {
        en: 'For more than a thousand years, Tamil sculptors gave form to devotion. In granite they carved temple walls, pillars and towering gateways; in bronze they cast the processional images — utsava murti — carried through the streets at festivals. Guided by the canons of the Silpa Sastras, which fix the proportions and attributes of every deity, they nonetheless gave each figure its own grace, so that these works stand among the finest sculpture in the world.',
        ta: 'ஆயிரம் ஆண்டுகளுக்கும் மேலாகத் தமிழ்ச் சிற்பிகள் பக்திக்கு வடிவம் தந்தனர். கருங்கல்லில் கோயில் சுவர்களையும் தூண்களையும் உயர்ந்த கோபுரங்களையும் செதுக்கினர்; செம்பில் திருவிழாக்களில் வீதியுலா வரும் உற்சவ மூர்த்திகளை வார்த்தனர். ஒவ்வொரு தெய்வத்தின் அளவுகளையும் அடையாளங்களையும் வரையறுக்கும் சிற்ப சாத்திரங்களைப் பின்பற்றியபோதும், ஒவ்வொரு உருவத்திற்கும் தனி எழிலைத் தந்தனர்; அதனால் இப்படைப்புகள் உலகின் தலைசிறந்த சிற்பங்களுள் இடம் பெறுகின்றன.',
      },
    },
    {
      id: 'pallava',
      title: { en: 'The Pallavas: Poetry in Granite', ta: 'பல்லவர்: கருங்கல்லில் கவிதை' },
      body: {
        en: 'From their capital at Kanchipuram, the Pallava kings of the 7th–9th centuries turned Tamil architecture from timber and brick to stone. At Mamallapuram, named after Narasimhavarman I “Mamalla”, sculptors cut cave temples, monolithic rathas and the vast open-air relief of the Descent of the Ganges out of the living rock. Under Rajasimha (Narasimhavarman II) came the structural Shore Temple and the Kailasanathar temple of Kanchipuram, whose pillars rise from rearing lions and yalis — horned mythical beasts that became a hallmark of Pallava art.',
        ta: 'காஞ்சிபுரத்தைத் தலைநகராகக் கொண்டு 7–9-ஆம் நூற்றாண்டுகளில் ஆண்ட பல்லவ மன்னர்கள், தமிழகக் கட்டடக்கலையை மரத்திலிருந்தும் செங்கல்லிலிருந்தும் கல்லுக்கு மாற்றினர். முதலாம் நரசிம்மவர்மன் “மாமல்லன்” பெயரால் அமைந்த மாமல்லபுரத்தில், குடைவரைக் கோயில்களையும் ஒற்றைக்கல் இரதங்களையும் “கங்கை இறங்குதல்” எனும் பெரும் திறந்தவெளிப் புடைப்புச் சிற்பத்தையும் பாறையிலேயே செதுக்கினர். இராஜசிம்மன் (இரண்டாம் நரசிம்மவர்மன்) காலத்தில் கடற்கரைக் கோயிலும் காஞ்சி கைலாசநாதர் கோயிலும் எழுந்தன; அவற்றின் தூண்கள் எழுந்து நிற்கும் சிங்கங்கள், யாளிகள் மீது அமைந்துள்ளன — கொம்புடைய இந்தப் புராண விலங்கு பல்லவக் கலையின் அடையாளமாயிற்று.',
      },
    },
    {
      id: 'pandya',
      title: { en: 'The Pandyas: Temples from the Living Rock', ta: 'பாண்டியர்: பாறையில் எழுந்த கோயில்கள்' },
      body: {
        en: 'In the far south, the early Pandyas of Madurai (7th–10th centuries) hollowed shrines out of granite hills, as at Thirupparankundram, and at Kalugumalai carved the Vettuvan Koil — an entire temple cut downwards from a single rock, left unfinished — beside rows of finely carved Jain figures. Their sculpture is restrained and serene, and in the later Pandya revival of the 13th century the great temple complexes of the south grew their soaring gopurams.',
        ta: 'தெற்கே, மதுரையின் முற்காலப் பாண்டியர் (7–10-ஆம் நூற்றாண்டுகள்) திருப்பரங்குன்றம் போன்ற இடங்களில் கருங்கல் குன்றுகளைக் குடைந்து கோயில்கள் அமைத்தனர்; கழுகுமலையில், ஒரே பாறையை மேலிருந்து கீழாகச் செதுக்கி உருவாக்கிய — முற்றுப்பெறாத — வெட்டுவான் கோயிலையும், அதன் அருகே நுட்பமாகச் செதுக்கிய சமணச் சிற்ப வரிசைகளையும் படைத்தனர். அவர்களின் சிற்பங்கள் அடக்கமும் அமைதியும் கொண்டவை; 13-ஆம் நூற்றாண்டுப் பிற்காலப் பாண்டியர் எழுச்சியில் தென்னகத்தின் பெரும் கோயில்களில் உயர்ந்த கோபுரங்கள் எழுந்தன.',
      },
    },
    {
      id: 'chola',
      title: { en: 'The Cholas: The Golden Age of Bronze', ta: 'சோழர்: செப்புத் திருமேனிகளின் பொற்காலம்' },
      body: {
        en: 'Between the 9th and 13th centuries the Cholas of the Kaveri delta raised Tamil art to its height. Rajaraja I completed the Brihadeeswarar temple at Thanjavur around 1010 CE, and his son Rajendra I built Gangaikonda Cholapuram. Royal patrons such as Queen Sembiyan Mahadevi endowed temples with bronze images of breathtaking refinement — Nataraja dancing in a ring of fire, Shiva with Uma, the child-saint Sambandar, Rama and Sita. At Nagapattinam, where Rajaraja endowed a Buddhist monastery for the king of Srivijaya, hundreds of Buddhist bronzes were cast as well.',
        ta: '9 முதல் 13-ஆம் நூற்றாண்டு வரை, காவிரிச் சமவெளியின் சோழர்கள் தமிழ்க் கலையை உச்சத்திற்கு உயர்த்தினர். முதலாம் இராசராசன் ஏறத்தாழ கி.பி. 1010-இல் தஞ்சைப் பெருவுடையார் கோயிலை நிறைவு செய்தான்; அவன் மகன் முதலாம் இராசேந்திரன் கங்கைகொண்ட சோழபுரத்தை எழுப்பினான். செம்பியன் மாதேவி போன்ற அரச ஆதரவாளர்கள், நெருப்பு வளையத்துள் ஆடும் நடராசர், உமையுடன் சிவன், குழந்தை அடியார் சம்பந்தர், இராமன், சீதை போன்ற வியக்கத்தக்க நுண்மை கொண்ட செப்புத் திருமேனிகளைக் கோயில்களுக்கு அளித்தனர். ஸ்ரீவிஜய மன்னனுக்காக இராசராசன் பௌத்த விகாரத்திற்குக் கொடை அளித்த நாகப்பட்டினத்தில் நூற்றுக்கணக்கான பௌத்தச் செப்புச் சிலைகளும் வார்க்கப்பட்டன.',
      },
    },
    {
      id: 'lost-wax',
      title: { en: 'Lost-Wax Casting — மெழுகு வார்ப்பு', ta: 'மெழுகு வார்ப்பு — இழந்த மெழுகு முறை' },
      body: {
        en: 'Every Chola bronze is unique, because its mould is destroyed to release it. The sculptor first models the figure in wax — beeswax mixed with resin (kungiliyam) — and covers it with layers of fine alluvial clay. When the clay has dried, the mould is heated: the wax melts and runs out, leaving a hollow in its exact shape. Molten metal — chiefly copper, with tin, lead and other metals, traditionally called ஐம்பொன் — is poured in. Once cool, the clay is broken away and the image is finished by chasing and polishing. The craft lives on at Swamimalai near Kumbakonam, whose bronze icons carry a Geographical Indication.',
        ta: 'ஒவ்வொரு சோழர் செப்புத் திருமேனியும் தனித்துவமானது; ஏனெனில் உருவை வெளியே எடுக்க அதன் அச்சு உடைக்கப்படுகிறது. சிற்பி முதலில் தேன்மெழுகும் குங்கிலியமும் கலந்த மெழுகில் உருவத்தைச் செய்து, அதன்மேல் நுண்ணிய வண்டல் மண்ணை அடுக்கடுக்காகப் பூசுகிறார். மண் உலர்ந்ததும் அச்சைச் சூடேற்ற, மெழுகு உருகி வெளியேறி, அதே வடிவில் வெற்றிடம் உருவாகிறது. அதில் உருக்கிய உலோகம் — பெரும்பாலும் செம்பு, உடன் வெள்ளீயம், ஈயம் முதலியவை; மரபாக “ஐம்பொன்” — ஊற்றப்படுகிறது. குளிர்ந்ததும் மண் உடைக்கப்பட்டு, உருவம் செதுக்கியும் மெருகேற்றியும் நிறைவு செய்யப்படுகிறது. இக்கலை கும்பகோணம் அருகே உள்ள சுவாமிமலையில் இன்றும் வாழ்கிறது; சுவாமிமலைச் செப்புத் திருமேனிகள் புவிசார் குறியீடு பெற்றவை.',
      },
    },
  ],

  coins: [
    {
      id: 'emblems',
      title: { en: 'Kings Who Signed in Symbols', ta: 'சின்னங்களில் கையொப்பமிட்ட மன்னர்கள்' },
      body: {
        en: 'The three crowned kings of the Tamil land each had an emblem, and their coins carry them: the tiger of the Cholas, the fish of the Pandyas, and the bow of the Cheras. Read together, these symbols tell political history — when a Chola coin shows the tiger flanked by the Pandya fish and the Chera bow, it proclaims the Chola king’s mastery over his rivals.',
        ta: 'தமிழ் நிலத்தின் மூவேந்தர்களுக்கும் தனித்தனிச் சின்னங்கள் இருந்தன; அவர்களின் காசுகள் அவற்றைத் தாங்கியுள்ளன: சோழருக்குப் புலி, பாண்டியருக்கு மீன், சேரருக்கு வில். இச்சின்னங்களைச் சேர்த்துப் படித்தால் அரசியல் வரலாறு தெரிகிறது — சோழர் காசில் புலியின் இருபுறமும் பாண்டிய மீனும் சேர வில்லும் இருந்தால், அது போட்டி அரசர்கள் மீது சோழ மன்னனின் மேலாண்மையை அறிவிக்கிறது.',
      },
    },
    {
      id: 'sangam-coins',
      title: { en: 'Coins of the Sangam Age', ta: 'சங்ககாலக் காசுகள்' },
      body: {
        en: 'The earliest Tamil dynastic coins, from around the last centuries BCE, are mostly small square or round pieces of copper and lead. Pandya coins pair an elephant with a stylised fish; Chola coins show a tiger, often with an elephant or horse; Chera coins bear the bow and arrow. Some name their issuers in Tamil-Brahmi, such as the Pandya coins reading பெருவழுதி (Peruvazhuthi) and the silver portrait coins of the Chera kings Makkotai and Kuttuvan Kotai. Many have been recovered from the bed of the Amaravathi river at Karur, the ancient Chera centre.',
        ta: 'ஏறத்தாழ கி.மு. இறுதி நூற்றாண்டுகளைச் சேர்ந்த தொடக்ககாலத் தமிழ் அரசமரபுக் காசுகள் பெரும்பாலும் செம்பாலும் ஈயத்தாலுமான சிறிய சதுர அல்லது வட்டக் காசுகள். பாண்டியர் காசுகளில் யானையும் உருவகமான மீனும்; சோழர் காசுகளில் புலி, பெரும்பாலும் யானை அல்லது குதிரையுடன்; சேரர் காசுகளில் வில்லும் அம்பும். சில காசுகள் வெளியிட்டவர் பெயரைத் தமிழ்-பிராமியில் தாங்கியுள்ளன — “பெருவழுதி” என்று எழுதப்பட்ட பாண்டியர் காசுகள், மாக்கோதை, குட்டுவன் கோதை எனும் சேர மன்னர்களின் வெள்ளி உருவக் காசுகள் போல. பழைய சேரர் மையமான கரூரில் அமராவதி ஆற்றுப் படுகையிலிருந்து இவற்றுள் பல கிடைத்துள்ளன.',
      },
    },
    {
      id: 'punch-marked',
      title: { en: 'Punch-Marked Coins', ta: 'முத்திரைக் குத்திய காசுகள்' },
      body: {
        en: 'Before kings put their names on coins, the subcontinent used punch-marked coins: small pieces of silver stamped with symbols — the sun, a six-armed sign, animals, hills, trees — one punch at a time. Issued from around the 6th–5th century BCE in the kingdoms of the Gangetic plain and later by the Mauryas, they circulated far and wide, and have been found at Tamil sites such as Keeladi and Kodumanal: evidence that the Tamil country was woven into networks of exchange reaching across India.',
        ta: 'மன்னர்கள் காசுகளில் தம் பெயரைப் பொறிப்பதற்கு முன்பே, இந்தியத் துணைக்கண்டத்தில் முத்திரைக் குத்திய காசுகள் புழங்கின: கதிரவன், ஆறு கைச் சின்னம், விலங்குகள், மலைகள், மரங்கள் போன்ற குறியீடுகள் ஒவ்வொன்றாகக் குத்தப்பட்ட சிறு வெள்ளித் துண்டுகள். ஏறத்தாழ கி.மு. 6–5-ஆம் நூற்றாண்டு முதல் கங்கைச் சமவெளி அரசுகளும் பின்னர் மௌரியர்களும் வெளியிட்ட இக்காசுகள் பரந்த அளவில் புழங்கின; கீழடி, கொடுமணல் போன்ற தமிழகத் தளங்களிலும் கிடைத்துள்ளன — இந்தியா முழுவதும் பரவிய பரிமாற்ற வலையமைப்பில் தமிழ் நாடும் பிணைந்திருந்ததற்கான சான்று.',
      },
    },
    {
      id: 'roman',
      title: { en: 'Roman Gold and the Yavana Ships', ta: 'உரோமானியப் பொன்னும் யவனர் கலங்களும்' },
      body: {
        en: 'In the first centuries CE, Roman ships rode the monsoon winds to the Tamil coast for pepper, pearls, gems and fine cloth, paying in gold and silver. Hoards of Roman aurei and denarii — many of Augustus and Tiberius — have been found in the Coimbatore region, at Karur and near Madurai. The Sangam poem Akananuru 149 describes the port of Muziris, where the ships of the Yavanas came bearing gold and left laden with pepper: “யவனர் தந்த வினைமாண் நன்கலம் / பொன்னொடு வந்து கறியொடு பெயரும்”. Pattinappalai sings of the bustle of Kaveripoompattinam, the Chola port at the mouth of the Kaveri, and in Rome Pliny the Elder complained of the gold that India drew away each year.',
        ta: 'பொது ஊழியின் தொடக்க நூற்றாண்டுகளில், உரோமானியக் கப்பல்கள் பருவக்காற்றைப் பயன்படுத்தி மிளகு, முத்து, மணிக்கற்கள், மெல்லிய ஆடைகளுக்காகத் தமிழகக் கரைக்கு வந்து, பொன்னிலும் வெள்ளியிலும் விலை தந்தன. பெரும்பாலும் அகஸ்டஸ், டைபீரியஸ் காலத்து உரோமானியப் பொற்காசுகளும் வெள்ளிக்காசுகளும் கொண்ட புதையல்கள் கோயம்புத்தூர்ப் பகுதியிலும் கரூரிலும் மதுரை அருகிலும் கிடைத்துள்ளன. அகநானூறு 149, யவனர் கலங்கள் பொன்னுடன் வந்து மிளகுடன் திரும்பிய முசிறித் துறையைப் பாடுகிறது: “யவனர் தந்த வினைமாண் நன்கலம் / பொன்னொடு வந்து கறியொடு பெயரும்”. காவிரி கடலொடு கலக்கும் இடத்திலிருந்த சோழர் துறைமுகமான காவிரிப்பூம்பட்டினத்தின் ஆரவாரத்தைப் பட்டினப்பாலை பாடுகிறது; ஆண்டுதோறும் இந்தியா ஈர்த்துச் சென்ற பொன்னைப் பற்றி உரோமில் மூத்த பிளினி வருந்தி எழுதினார்.',
      },
    },
    {
      id: 'imperial-chola',
      title: { en: 'The Coins of the Chola Empire', ta: 'சோழப் பேரரசின் காசுகள்' },
      body: {
        en: 'With the imperial Cholas came a confident coinage in gold, silver and copper. Coins of Uttama Chola in the late 10th century carry his name, and from Rajaraja I onwards the royal emblem shows the seated Chola tiger flanked by two Pandya fish beneath a parasol, with the king’s name in Nagari script. After the Chola conquest of Sri Lanka, a copper type showing a standing king on one side and a seated figure on the other spread across South India and the island. Values were reckoned in kalanju and kasu — the word that gave English its “cash”.',
        ta: 'பேரரசுச் சோழர் காலத்தில் பொன், வெள்ளி, செம்பு ஆகியவற்றில் உறுதியான காசுமுறை உருவானது. 10-ஆம் நூற்றாண்டின் பிற்பகுதியில் ஆண்ட உத்தம சோழனின் காசுகள் அவன் பெயரைத் தாங்கியுள்ளன; முதலாம் இராசராசன் முதல், அரசச் சின்னத்தில் குடையின் கீழ் அமர்ந்த சோழப் புலியின் இருபுறமும் இரு பாண்டிய மீன்கள் காணப்படுகின்றன; மன்னன் பெயர் நாகரி எழுத்தில் உள்ளது. சோழர் இலங்கையை வென்ற பிறகு, ஒருபுறம் நின்ற மன்னனும் மறுபுறம் அமர்ந்த உருவமும் கொண்ட செப்புக் காசு வகை தென்னிந்தியாவிலும் இலங்கையிலும் பரவியது. மதிப்பு கழஞ்சு, காசு என்ற அளவுகளில் கணக்கிடப்பட்டது — ஆங்கிலச் சொல்லான “cash” “காசு” என்பதிலிருந்தே வந்தது.',
      },
    },
  ],

  manuscripts: [
    {
      id: 'olai-suvadi',
      title: { en: 'The Olai Suvadi — A Book of Leaves', ta: 'ஓலைச்சுவடி — இலைகளால் ஆன நூல்' },
      body: {
        en: 'For two thousand years Tamil was written on the leaves of the palmyra palm. Young leaves were cut, dried, boiled and smoothed, then trimmed into long strips and pierced with holes for a binding cord. The scribe did not use ink: he incised the letters with an iron stylus, the எழுத்தாணி, and then rubbed the leaf with lampblack mixed with oil, so the dark powder settled into the grooves and the writing appeared. The leaves were strung on cords between two wooden boards — a bundle called an ஏடு or சுவடி. It is often said that the rounded shapes of Tamil letters owe something to the leaf, which a long straight cut along its grain would split.',
        ta: 'இரண்டாயிரம் ஆண்டுகளாகத் தமிழ் பனையோலைகளில் எழுதப்பட்டது. இளம் ஓலைகள் வெட்டப்பட்டு, உலர்த்தி, வேகவைத்து, மெருகேற்றப்பட்டு, நீண்ட கீற்றுகளாக நறுக்கப்பட்டு, கயிறு கோக்கத் துளையிடப்பட்டன. எழுதுபவர் மை பயன்படுத்தவில்லை: இரும்பு எழுத்தாணியால் எழுத்துகளைக் கீறி, பின்னர் எண்ணெய் கலந்த விளக்குக் கரியை ஓலையில் தேய்த்தார்; கருந்தூள் கீறல்களில் படிய, எழுத்து வெளிப்பட்டது. ஓலைகள் இரு மரச் சட்டங்களுக்கு இடையே கயிற்றில் கோக்கப்பட்டன — இக்கட்டே “ஏடு” அல்லது “சுவடி”. ஓலையின் இழையோட்டத்தில் நீண்ட நேர்க்கோடு கீறினால் அது கிழிந்துவிடும் என்பதால், தமிழ் எழுத்துகளின் வளைந்த வடிவங்கள் ஓலைக்குக் கடன்பட்டவை என்று பெரும்பாலும் சொல்லப்படுகிறது.',
      },
    },
    {
      id: 'copied-to-survive',
      title: { en: 'Copied to Survive', ta: 'படியெடுப்பால் பிழைத்த நூல்கள்' },
      body: {
        en: 'In the warm, humid Tamil country a palm leaf lasts a few centuries at most; insects, damp and handling wear it away. A text survived only if it was copied onto fresh leaves again and again, by scribes in temples, monasteries and learned families. Each copy could add errors, and a scribe’s closing note — the colophon — often records his name, his patron and the date. Worn-out bundles were sometimes given up to the river or the fire, and with them, more than once, the last copy of a work.',
        ta: 'வெப்பமும் ஈரப்பதமும் மிக்க தமிழ் நிலத்தில் ஒரு பனையோலை சில நூற்றாண்டுகளுக்கு மேல் நிலைப்பதில்லை; பூச்சிகளும் ஈரமும் கையாளுதலும் அதைத் தேய்த்துவிடுகின்றன. கோயில்களிலும் மடங்களிலும் புலமைக் குடும்பங்களிலும் இருந்த எழுத்தர்கள் மீண்டும் மீண்டும் புதிய ஓலைகளில் படியெடுத்ததால் மட்டுமே ஒரு நூல் பிழைத்தது. ஒவ்வொரு படியிலும் பிழைகள் சேரலாம்; எழுத்தரின் இறுதிக் குறிப்பு அவர் பெயரையும் புரவலரையும் நாளையும் பெரும்பாலும் பதிவு செய்கிறது. பழுதடைந்த கட்டுகள் சில வேளைகளில் ஆற்றிலோ நெருப்பிலோ இடப்பட்டன; அவற்றுடன் ஒரு நூலின் கடைசிப் படியும் பலமுறை அழிந்தது.',
      },
    },
    {
      id: 'recovering-the-classics',
      title: { en: 'Recovering the Sangam Classics', ta: 'சங்கச் செவ்வியல் நூல்களின் மீட்பு' },
      body: {
        en: 'By the nineteenth century many of the oldest Tamil works survived only in a handful of decaying bundles. C. W. Thamotharam Pillai brought out editions of grammar and of Kalithokai from the 1860s to the 1880s, and U. V. Swaminatha Iyer (1855–1942), remembered as தமிழ்த் தாத்தா, travelled from village to village for half a century, searching houses and monasteries for leaves. Comparing copy against copy, he published Seevaka Chinthamani (1887), Pattuppattu (1889), Silappathikaram (1892), Purananuru (1894) and Manimekalai (1898) — texts that might otherwise have been lost.',
        ta: 'பத்தொன்பதாம் நூற்றாண்டளவில் மிகப் பழைய தமிழ் நூல்கள் பல, அழிந்துவரும் சில ஓலைக்கட்டுகளில் மட்டுமே எஞ்சியிருந்தன. சி. வை. தாமோதரம்பிள்ளை 1860கள் முதல் 1880கள் வரை இலக்கண நூல்களையும் கலித்தொகையையும் பதிப்பித்தார்; “தமிழ்த் தாத்தா” என்று போற்றப்படும் உ. வே. சாமிநாதையர் (1855–1942) அரை நூற்றாண்டு காலம் ஊர் ஊராகச் சென்று, வீடுகளிலும் மடங்களிலும் ஓலைகளைத் தேடினார். படிகளை ஒப்பிட்டு ஆராய்ந்து, சீவகசிந்தாமணி (1887), பத்துப்பாட்டு (1889), சிலப்பதிகாரம் (1892), புறநானூறு (1894), மணிமேகலை (1898) ஆகியவற்றைப் பதிப்பித்தார் — இல்லையெனில் இழக்கப்பட்டிருக்கக்கூடிய நூல்கள் இவை.',
      },
    },
    {
      id: 'repositories',
      title: { en: 'Where the Leaves Are Kept', ta: 'ஓலைகள் காக்கப்படும் இடங்கள்' },
      body: {
        en: 'Tens of thousands of Tamil palm-leaf manuscripts — literature and grammar, temple ritual, Siddha medicine, astronomy, astrology, music and accounts — are kept in public collections. Among the greatest are the Government Oriental Manuscripts Library in Chennai; the Saraswathi Mahal Library at Thanjavur, begun under the Nayaks and enriched by the Maratha king Serfoji II; the U. V. Swaminatha Iyer Library in Chennai; Tamil University, Thanjavur; and the French Institute of Pondicherry, whose collection of Shaiva manuscripts was inscribed in UNESCO’s Memory of the World Register in 2005. Many more remain in temples, monasteries and family homes.',
        ta: 'இலக்கியம், இலக்கணம், கோயில் வழிபாட்டு முறை, சித்த மருத்துவம், வானியல், சோதிடம், இசை, கணக்குகள் — பல்லாயிரக்கணக்கான தமிழ்ப் பனையோலைச் சுவடிகள் பொதுத் தொகுப்புகளில் காக்கப்படுகின்றன. அவற்றுள் தலையாயவை: சென்னை அரசு கீழ்த்திசைச் சுவடிகள் நூலகம்; நாயக்கர் காலத்தில் தொடங்கி மராட்டிய மன்னர் இரண்டாம் சரபோஜியால் வளம்பெற்ற தஞ்சை சரசுவதி மகால் நூலகம்; சென்னை உ. வே. சா. நூலகம்; தஞ்சைத் தமிழ்ப் பல்கலைக்கழகம்; 2005-இல் யுனெஸ்கோவின் “உலக நினைவகப் பதிவேட்டில்” இடம்பெற்ற சைவச் சுவடித் தொகுப்பைக் கொண்ட புதுச்சேரி பிரெஞ்சு நிறுவனம். இன்னும் பல சுவடிகள் கோயில்களிலும் மடங்களிலும் குடும்பங்களிலும் உள்ளன.',
      },
    },
    {
      id: 'caring-for-leaves',
      title: { en: 'Caring for Fragile Leaves', ta: 'நொய்மையான ஓலைகளைப் பேணுதல்' },
      body: {
        en: 'Conservators clean each leaf with soft brushes, ease brittle leaves supple again with a little lemongrass oil — which also keeps insects away — and darken faded writing with lampblack, as the scribes once did. Bundles are wrapped in cloth, kept between boards, and stored away from damp and light. Because even well-kept leaves age, the surest protection is now the copy once more: India’s National Mission for Manuscripts, begun in 2003, and libraries across Tamil Nadu are cataloguing and digitising collections so that the texts can be read without the leaves being handled.',
        ta: 'பாதுகாப்பாளர்கள் ஒவ்வோர் ஓலையையும் மென்தூரிகையால் சுத்தம் செய்து, உடையக்கூடிய ஓலைகளைச் சிறிது எலுமிச்சைப்புல் எண்ணெயால் மீண்டும் நெகிழ்வாக்குகின்றனர் — அது பூச்சிகளையும் விரட்டுகிறது; மங்கிய எழுத்துகளை, எழுத்தர்கள் செய்தது போலவே, விளக்குக் கரியால் மீண்டும் கருமையாக்குகின்றனர். கட்டுகள் துணியில் சுற்றப்பட்டு, சட்டங்களுக்கு இடையே, ஈரத்துக்கும் ஒளிக்கும் அப்பால் வைக்கப்படுகின்றன. நன்கு பேணப்பட்ட ஓலைகளும் மூப்படைவதால், இன்று மிக உறுதியான காப்பு மீண்டும் படியெடுப்பே: 2003-இல் தொடங்கிய இந்தியத் தேசியச் சுவடிகள் இயக்கமும் தமிழகமெங்கும் உள்ள நூலகங்களும், ஓலைகளைத் தொடாமலேயே நூல்களைப் படிக்கும்படி தொகுப்புகளை அட்டவணைப்படுத்தி எண்ணிமமாக்கி வருகின்றன.',
      },
    },
  ],

  paintings: [
    {
      id: 'painted-word',
      title: { en: 'Painting in the Tamil Land', ta: 'தமிழ் நிலத்தில் ஓவியக் கலை' },
      body: {
        en: 'Sangam poems already speak of painters and painted halls: the ஓவியர் who drew with fine lines, and the ஓவியச் செந்நூல், the treatise on painting. What survives on walls begins in the 7th–9th centuries — in Pallava temples and the Jain cave at Sittanavasal — and runs through the great Chola frescoes of Thanjavur to the bright Nayak murals and the gilded Tanjore panels of the 17th–19th centuries. Mineral and plant colours — red and yellow ochre, lamp-black, lime white, green earth — were laid on lime plaster in a tradition that lasted more than a thousand years.',
        ta: 'ஓவியரையும் ஓவியம் தீட்டிய மாடங்களையும் சங்க இலக்கியமே குறிப்பிடுகிறது; நுண்ணிய கோடுகளால் வரைந்த ஓவியர்களும், ஓவியக் கலை நூலான “ஓவியச் செந்நூலும்” பேசப்படுகின்றன. சுவர்களில் எஞ்சியுள்ள ஓவியங்கள் 7–9-ஆம் நூற்றாண்டுகளில் — பல்லவர் கோயில்களிலும் சித்தன்னவாசல் சமணக் குடைவரையிலும் — தொடங்கி, தஞ்சைச் சோழர் சுவரோவியங்கள் வழியாக, 17–19-ஆம் நூற்றாண்டுகளின் ஒளிமிக்க நாயக்கர் ஓவியங்களும் பொன் வேய்ந்த தஞ்சாவூர் ஓவியங்களும் வரை தொடர்கின்றன. செம்மண், மஞ்சள் மண், விளக்குக் கரி, சுண்ணாம்பு வெண்மை, பச்சை மண் போன்ற கனிம, தாவர நிறங்கள் சுண்ணச் சாந்தின் மேல் தீட்டப்பட்டன — ஆயிரம் ஆண்டுகளுக்கும் மேல் நிலைத்த மரபு இது.',
      },
    },
    {
      id: 'sittanavasal-panamalai',
      title: { en: 'Sittanavasal and Panamalai — The Earliest Murals', ta: 'சித்தன்னவாசலும் பனைமலையும் — மிகப் பழைய சுவரோவியங்கள்' },
      body: {
        en: 'At Sittanavasal in Pudukkottai district, the ceiling of a Jain rock-cut shrine, the Arivar Koil, is painted as a lotus pool: lotuses and lily pads, fish, geese, elephants and buffaloes, and devotees gathering flowers. An inscription records the shrine’s renewal under the Pandya king Srimara Srivallabha, and the paintings are generally dated to the 9th century. At Panamalai, in the Talagirisvara temple built by the Pallava king Rajasimha around 700 CE, a graceful figure of the goddess beneath a royal parasol is among the finest early paintings in South India.',
        ta: 'புதுக்கோட்டை மாவட்டம் சித்தன்னவாசலில் உள்ள “அறிவர் கோயில்” என்னும் சமணக் குடைவரையின் கூரை ஒரு தாமரைக் குளமாக வரையப்பட்டுள்ளது: தாமரைகளும் இலைகளும், மீன்கள், அன்னங்கள், யானைகள், எருமைகள், மலர் கொய்யும் அடியார்கள். பாண்டிய மன்னன் சீமாறன் சீவல்லபன் காலத்தில் இக்கோயில் புதுப்பிக்கப்பட்டதைக் கல்வெட்டு கூறுகிறது; ஓவியங்கள் பொதுவாக 9-ஆம் நூற்றாண்டைச் சேர்ந்தவையாகக் கருதப்படுகின்றன. ஏறத்தாழ கி.பி. 700-இல் பல்லவ மன்னன் இராசசிம்மன் கட்டிய பனைமலைத் தாளகிரீசுவரர் கோயிலில், அரசக் குடையின் கீழ் நிற்கும் தேவியின் எழில்மிகு உருவம், தென்னிந்தியாவின் மிகச் சிறந்த தொடக்ககால ஓவியங்களுள் ஒன்று.',
      },
    },
    {
      id: 'chola-frescoes',
      title: { en: 'The Chola Frescoes of the Big Temple', ta: 'பெரிய கோயிலின் சோழர் சுவரோவியங்கள்' },
      body: {
        en: 'Rajaraja I completed the Brihadisvara temple at Thanjavur around 1010 CE. In the dark passage that runs around its sanctum, Chola painters worked in true fresco, laying colour on wet lime plaster: Shiva as Tripurantaka riding his chariot against the three flying cities, the saint Sundarar’s journey to Kailasa, dancers, and a portrait long identified as Rajaraja with his guru Karuvur Thevar. In the 17th century these walls were plastered and painted over in the Nayak style; the Chola layer beneath was recognised only in 1931, by S. K. Govindasamy of Annamalai University.',
        ta: 'முதலாம் இராசராசன் ஏறத்தாழ கி.பி. 1010-இல் தஞ்சைப் பெரிய கோயிலைக் கட்டி முடித்தான். கருவறையைச் சுற்றிச் செல்லும் இருண்ட சுற்றுப்பாதையில், ஈரச் சுண்ணச் சாந்தின் மேல் நிறம் தீட்டும் உண்மையான ஃப்ரெஸ்கோ முறையில் சோழ ஓவியர்கள் வரைந்தனர்: பறக்கும் முப்புரங்களுக்கு எதிராகத் தேரில் செல்லும் திரிபுராந்தகர், சுந்தரரின் கயிலைப் பயணம், நடன மங்கையர், இராசராசனும் அவன் குருவான கருவூர்த்தேவரும் எனக் கருதப்படும் உருவம் ஆகியவை. 17-ஆம் நூற்றாண்டில் இச்சுவர்கள் மீது சாந்து பூசி நாயக்கர் பாணியில் புதிய ஓவியங்கள் வரையப்பட்டன; அடியிலிருந்த சோழர் ஓவியங்கள் 1931-இல் தான் அண்ணாமலைப் பல்கலைக்கழகத்தின் எஸ். கே. கோவிந்தசாமியால் அடையாளம் காணப்பட்டன.',
      },
    },
    {
      id: 'nayak-and-tanjore',
      title: { en: 'Nayak Murals and the Tanjore Painting', ta: 'நாயக்கர் சுவரோவியங்களும் தஞ்சாவூர் ஓவியமும்' },
      body: {
        en: 'Under the Nayaks of Thanjavur and Madurai (16th–18th centuries), temple walls and ceilings blazed with yellow, red and blue: gods framed by painted curtains and garlands, epics told in long bands. From this court culture, continued by the Maratha rulers of Thanjavur, came the Tanjore painting — a panel of wood and cloth, its figures raised in a relief of chalk and gum, covered in gold leaf and set with glass or semi-precious stones. Gods sit enthroned beneath arches, with round faces and large eyes; the gold catches lamplight in a shrine room. The art is still practised in Thanjavur today.',
        ta: 'தஞ்சை, மதுரை நாயக்கர் காலத்தில் (16–18-ஆம் நூற்றாண்டுகள்) கோயில் சுவர்களும் கூரைகளும் மஞ்சள், சிவப்பு, நீல நிறங்களில் ஒளிர்ந்தன: வரையப்பட்ட திரைச்சீலைகளும் மாலைகளும் சூழ்ந்த தெய்வங்கள், நீண்ட பட்டைகளில் சொல்லப்பட்ட இதிகாசக் கதைகள். தஞ்சை மராட்டிய மன்னர்களும் தொடர்ந்து போற்றிய இந்த அரசவைப் பண்பாட்டிலிருந்து தஞ்சாவூர் ஓவியம் பிறந்தது — மரப்பலகையும் துணியும் கொண்ட தளத்தில், சுண்ணமும் பசையும் கலந்த புடைப்பில் உருவங்கள் எழுப்பப்பட்டு, பொன் தகடு வேய்ந்து, கண்ணாடிக் கற்களோ மணிக்கற்களோ பதிக்கப்படுகின்றன. வளைவுகளின் கீழ் அமர்ந்த தெய்வங்களுக்கு உருண்ட முகமும் பெரிய கண்களும்; பூசையறை விளக்கொளியில் பொன் மின்னுகிறது. இக்கலை இன்றும் தஞ்சையில் வாழ்கிறது.',
      },
    },
  ],
  /*
   * The Maritime Trade & Ports room: the routes and periods of Tamil trade, condensed from the
   * curators' research guide (public/Maritime trade n ports/Maritime trade n ports.pdf).
   */
  'ports-maritime': [
    {
      id: 'three-witnesses',
      title: { en: 'Three Kinds of Evidence', ta: 'மூவகைச் சான்றுகள்' },
      body: {
        en: 'Ancient Tamilakam traded along rivers, overland and across the Indian Ocean, linking farming villages and craft workshops to coastal ports and markets overseas. We know it from three kinds of witness: Tamil literature such as the Pattinappalai and the Silappatikaram; foreign accounts, above all the Periplus of the Erythraean Sea; and archaeology — pottery, coins, beads, amphorae and the remains of buildings. They complement one another, but they do not always speak of the same period.',
        ta: 'பண்டைத் தமிழகம் ஆறுகள் வழியாகவும் தரை வழியாகவும் இந்தியப் பெருங்கடல் கடந்தும் வணிகம் செய்தது; வேளாண் ஊர்களையும் கைவினைக் கூடங்களையும் கடற்கரைத் துறைமுகங்களுடனும் கடல் கடந்த சந்தைகளுடனும் இணைத்தது. இதனை மூவகைச் சான்றுகள் வழியே அறிகிறோம்: பட்டினப்பாலை, சிலப்பதிகாரம் போன்ற தமிழ் இலக்கியங்கள்; அயலவர் குறிப்புகள், குறிப்பாக எரித்திரியக் கடலின் பெரிப்ளூஸ்; தொல்லியல் — மட்கலங்கள், காசுகள், மணிகள், சாடிகள், கட்டட எச்சங்கள். இவை ஒன்றையொன்று நிறைவு செய்கின்றன; ஆயினும் எப்போதும் ஒரே காலத்தைப் பற்றிப் பேசுவதில்லை.',
      },
    },
    {
      id: 'early-routes',
      title: { en: 'Before 100 BCE — Early Exchange', ta: 'கி.மு. 100-க்கு முன் — தொடக்ககாலப் பரிமாற்றம்' },
      body: {
        en: 'Before about 300 BCE, Iron Age communities across southern India farmed, worked iron, made beads and traded inland; their megalithic burials are among the best evidence for these early societies. Between about 300 and 100 BCE, port settlements and craft centres were drawn into wider regional networks — Arikamedu’s early layers belong to this story, though the first phases of each site are still debated.',
        ta: 'ஏறத்தாழ கி.மு. 300-க்கு முன், தென்னிந்தியாவெங்கும் இரும்புக் காலச் சமூகங்கள் வேளாண்மை செய்தன, இரும்பை வடித்தன, மணிகள் செய்தன, உள்நாட்டில் வணிகம் செய்தன; அவற்றின் பெருங்கற்காலப் புதைவிடங்களே இச்சமூகங்களுக்கான சிறந்த சான்றுகளுள் அடங்கும். ஏறத்தாழ கி.மு. 300–100 காலத்தில் துறைமுகக் குடியிருப்புகளும் கைவினை மையங்களும் பரந்த வட்டார வலைகளில் இணைந்தன — அரிக்கமேட்டின் தொடக்க அடுக்குகள் இக்கதையைச் சேர்ந்தவை; ஆயினும் ஒவ்வொரு களத்தின் தொடக்கக் கட்டமும் இன்னும் விவாதத்தில் உள்ளது.',
      },
    },
    {
      id: 'adichanallur',
      title: { en: 'Adichanallur — Iron Age Burial Ground of the Thamirabarani', ta: 'ஆதிச்சநல்லூர் — தாமிரபரணியின் இரும்புக் காலப் புதைவிடம்' },
      body: {
        en: 'On a low gravel mound on the south bank of the Thamirabarani, about 24 kilometres from Tirunelveli in Thoothukudi district, lies one of the largest proto-historic burial grounds in India, spread over more than a hundred acres. Thousands of urns were buried here, often packed close together, holding human remains with iron tools and weapons, bronze vessels and figurines, gold diadems, beads and black-and-red pottery. Excavation began in 1876, among the earliest in Indian archaeology, and radiocarbon dates now place the burials in the early first millennium BCE and before. A habitation site with a potter’s kiln has been found close by: the people who buried their dead here also lived, farmed and worked metal beside them.',
        ta: 'தூத்துக்குடி மாவட்டத்தில், திருநெல்வேலியிலிருந்து ஏறத்தாழ 24 கிலோமீட்டர் தொலைவில், தாமிரபரணியின் தென்கரையில் உள்ள தாழ்வான சரளை மேட்டில், நூறு ஏக்கருக்கும் மேல் பரந்து கிடக்கிறது இந்தியாவின் மிகப் பெரிய இரும்புக் காலப் புதைவிடங்களில் ஒன்று. இங்கே ஆயிரக்கணக்கான தாழிகள், பெரும்பாலும் நெருக்கமாகப் புதைக்கப்பட்டன; அவற்றுள் மனித எச்சங்களுடன் இரும்புக் கருவிகளும் ஆயுதங்களும், வெண்கலக் கலங்களும் உருவங்களும், பொன் நெற்றிப்பட்டங்களும், மணிகளும், கருப்பு-சிவப்பு மட்கலங்களும் இருந்தன. இந்தியத் தொல்லியலின் தொடக்ககால அகழாய்வுகளில் ஒன்றாக 1876-இல் இங்கு அகழாய்வு தொடங்கியது; கதிரியக்கக் கரிமக் காலக்கணிப்புகள் இப்புதைவுகளைக் கி.மு. முதல் ஆயிரமாண்டின் தொடக்கத்திற்கும் அதற்கு முன்னும் கொண்டு செல்கின்றன. அருகிலேயே குயவர் சூளையுடன் கூடிய வாழ்விடப் பகுதியும் கண்டறியப்பட்டுள்ளது: இங்கே இறந்தவர்களைப் புதைத்த மக்கள் அதன் அருகிலேயே வாழ்ந்து, உழுது, உலோக வேலை செய்தனர்.',
      },
    },
    {
      id: 'thamirabarani-valley',
      title: { en: 'The Thamirabarani Valley and the Sea', ta: 'தாமிரபரணிப் பள்ளத்தாக்கும் கடலும்' },
      body: {
        en: 'Adichanallur did not stand alone. Along the Thamirabarani lie Sivakalai and other early sites, and the river carried people and goods down to the Gulf of Mannar, where Korkai grew into the Pandya port of pearls and chank. The valley had iron, copper and gold to work, fertile rice land, and a river road to the coast. Urn burials of the same tradition are found across the Gulf in Sri Lanka, and beads of distant stones reached the valley — early signs of the exchange that would make the Tamil coast a hub of Indian Ocean trade within a few centuries. Stills and film from the excavations are in the cases below.',
        ta: 'ஆதிச்சநல்லூர் தனித்து நிற்கவில்லை. தாமிரபரணிக் கரையில் சிவகளையும் பிற தொடக்ககாலத் தலங்களும் உள்ளன; ஆறு மக்களையும் பொருட்களையும் மன்னார் வளைகுடாவுக்குக் கொண்டு சென்றது — அங்கே கொற்கை, முத்துக்கும் சங்குக்கும் புகழ்பெற்ற பாண்டியர் துறைமுகமாக வளர்ந்தது. இப்பள்ளத்தாக்கில் இரும்பு, செம்பு, பொன் ஆகிய உலோகங்களும், வளமான நெல் நிலங்களும், கடற்கரைக்கான ஆற்றுவழியும் இருந்தன. இதே மரபைச் சேர்ந்த தாழிப் புதைவுகள் வளைகுடாவுக்கு அப்பால் இலங்கையிலும் காணப்படுகின்றன; தொலைதூரக் கற்களாலான மணிகள் இப்பள்ளத்தாக்கை வந்தடைந்தன — சில நூற்றாண்டுகளிலேயே தமிழ்க் கடற்கரையை இந்தியப் பெருங்கடல் வணிகத்தின் மையமாக்கிய பரிமாற்றத்தின் தொடக்கச் சான்றுகள். அகழாய்வுகளின் படங்களும் ஆவணப்படக் காட்சிகளும் கீழே உள்ள காட்சிப் பேழைகளில் உள்ளன.',
      },
    },
    {
      id: 'indo-roman',
      title: { en: '100 BCE – 200 CE — The Indo-Roman Trade', ta: 'கி.மு. 100 – கி.பி. 200 — இந்திய-உரோமானிய வணிகம்' },
      body: {
        en: 'In these centuries, sailing routes across the Red Sea and the Indian Ocean joined Mediterranean markets to the ports of South India. Roman-era pottery, amphora fragments, beads and coins — some imported, some made locally — trace those links at Arikamedu, Alagankulam, Karur and Pattanam, while Tamil poems describe busy harbours, merchants and their cargoes. Pepper from the western coast, pearls from the Gulf of Mannar, beads and textiles all travelled these routes.',
        ta: 'இந்நூற்றாண்டுகளில் செங்கடல், இந்தியப் பெருங்கடல் கடல்வழிகள் மத்தியதரைக் கடல் சந்தைகளைத் தென்னிந்தியத் துறைமுகங்களுடன் இணைத்தன. உரோமானியக் கால மட்கலங்கள், சாடி ஓடுகள், மணிகள், காசுகள் — சில இறக்குமதியானவை, சில உள்ளூரில் செய்யப்பட்டவை — அரிக்கமேடு, அழகன்குளம், கரூர், பட்டணம் ஆகிய இடங்களில் அத்தொடர்புகளைக் காட்டுகின்றன; தமிழ்க் கவிதைகள் பரபரப்பான துறைமுகங்களையும் வணிகர்களையும் அவர்தம் சரக்குகளையும் பாடுகின்றன. மேற்குக் கடற்கரையின் மிளகு, மன்னார் வளைகுடாவின் முத்து, மணிகள், துணிகள் எல்லாம் இவ்வழிகளில் பயணித்தன.',
      },
    },
    {
      id: 'later-networks',
      title: { en: '200 – 1200 CE — Changing Networks', ta: 'கி.பி. 200 – 1200 — மாறும் வணிக வலைகள்' },
      body: {
        en: 'Trade went on, but its places and partners changed: the decline of one port was never the end of Tamil seafaring. Under the Pallavas and then the imperial Cholas, merchant guilds and east-coast ports such as Nagapattinam carried Tamil commerce across the Bay of Bengal to South-East Asia — a later chapter than the Indo-Roman trade. A caution runs through it all: the date of a poem, the age it describes and the archaeological period of a port are not always the same.',
        ta: 'வணிகம் தொடர்ந்தது; ஆனால் அதன் இடங்களும் கூட்டாளிகளும் மாறின — ஒரு துறைமுகத்தின் வீழ்ச்சி தமிழர் கடலோடலின் முடிவு அன்று. பல்லவர் காலத்திலும் பின்னர் பேரரசுச் சோழர் காலத்திலும், வணிகக் குழுக்களும் நாகப்பட்டினம் போன்ற கிழக்குக் கடற்கரைத் துறைமுகங்களும் தமிழ் வணிகத்தை வங்கக் கடல் கடந்து தென்கிழக்கு ஆசியா வரை கொண்டு சென்றன — இந்திய-உரோமானிய வணிகத்துக்குப் பிந்தைய அத்தியாயம் இது. ஒரு எச்சரிக்கை எங்கும் பொருந்தும்: ஒரு கவிதையின் காலமும், அது விவரிக்கும் காலமும், ஒரு துறைமுகத்தின் தொல்லியல் காலமும் எப்போதும் ஒன்றல்ல.',
      },
    },
  ],
  /*
   * The Irrigation room: Kallanai, with stills and film from the documentary on Kallanai produced
   * by the Central Institute of Classical Tamil (public/Irrigation/Kallanai).
   */
  irrigation: [
    {
      id: 'kallanai-karikala',
      title: { en: 'Kallanai — Karikala Chola’s Grand Anicut', ta: 'கல்லணை — கரிகால் சோழனின் பேரணை' },
      body: {
        en: 'Across the Kaveri, east of Tiruchirappalli, stands Kallanai — “the stone dam” — among the oldest water-regulating works in the world still in use. Tamil tradition credits it to Karikal Chozhan, the early Chola king celebrated in the Pattinappalai, and places it around the second century CE. Swollen by the monsoon, the Kaveri poured into its delta unchecked, breaking its banks and ruining fields; Karikalan’s answer was not to stop the river but to tame and divide it. Later Chola poems, and the inscriptions of dynasties that claimed descent from him, praise him as the king who raised the banks of the Kaveri.',
        ta: 'திருச்சிராப்பள்ளிக்குக் கிழக்கே காவிரியின் குறுக்கே நிற்கிறது கல்லணை — உலகில் இன்றும் பயன்பாட்டில் உள்ள மிகப் பழமையான நீர் ஒழுங்குபடுத்தும் அமைப்புகளில் ஒன்று. பட்டினப்பாலை போற்றும் தொடக்ககாலச் சோழ மன்னன் கரிகால் சோழனுக்கு இதைத் தமிழ் மரபு உரியதாக்கி, ஏறத்தாழ கி.பி. இரண்டாம் நூற்றாண்டைச் சேர்ந்ததாகக் கருதுகிறது. பருவமழையால் பெருகிய காவிரி தடையின்றிக் கழிமுகத்திற்குள் பாய்ந்து, கரைகளை உடைத்து வயல்களை அழித்தது; கரிகாலனின் தீர்வு ஆற்றைத் தடுப்பது அல்ல — அதை அடக்கிப் பிரிப்பது. பிற்காலச் சோழர் இலக்கியங்களும், அவன் வழிவந்தவர்கள் எனக் கூறிக்கொண்ட அரச மரபுகளின் கல்வெட்டுகளும், காவிரிக்குக் கரை கட்டிய மன்னனாக அவனைப் போற்றுகின்றன.',
      },
    },
    {
      id: 'kallanai-engineering',
      title: { en: 'Stone, Clay and the River', ta: 'கல், களிமண், ஆறு' },
      body: {
        en: 'Kallanai was built without mortar, on the river’s own shifting sand. Its builders rolled great unhewn boulders into the Kaveri; as the current scoured the sand from beneath them the stones sank, and more were piled on top until the mass rested on firm ground. Clay and the silt of the floods filled the gaps and bound the stones into a single watertight barrier: a low, broad wall some 330 metres long and about 20 metres wide, laid in a winding line that the documentary likens to a crawling snake. It is an anicut, not a reservoir — it raises the river just enough to send its water into the channels, and lets the rest pass on.',
        ta: 'சுண்ணச் சாந்து இன்றி, ஆற்றின் நகரும் மணல் மீதே கல்லணை கட்டப்பட்டது. கட்டுநர்கள் செதுக்கப்படாத பெரும் பாறைகளைக் காவிரிக்குள் உருட்டினர்; அவற்றின் அடியிலிருந்த மணலை நீரோட்டம் அரித்துச் செல்லச் செல்லக் கற்கள் அமிழ்ந்தன; உறுதியான தரையைத் தொடும்வரை அவற்றின் மேல் மேலும் கற்கள் அடுக்கப்பட்டன. களிமண்ணும் வெள்ள வண்டலும் இடைவெளிகளை நிரப்பி, கற்களை நீர் கசியாத ஒரே தடுப்பாக இணைத்தன: ஏறத்தாழ 330 மீட்டர் நீளமும் 20 மீட்டர் அகலமும் கொண்ட, தாழ்வான அகன்ற சுவர் — ஊர்ந்து செல்லும் பாம்பைப் போல வளைந்து செல்லும் அமைப்பு என ஆவணப்படம் விவரிக்கிறது. இது நீர்த்தேக்கம் அல்ல, அணைக்கட்டு: கால்வாய்களுக்கு நீரைத் திருப்பும் அளவுக்கு மட்டும் ஆற்றை உயர்த்தி, மீதியைக் கடந்து செல்ல விடுகிறது.',
      },
    },
    {
      id: 'kallanai-delta',
      title: { en: 'The Delta Transformed', ta: 'மாற்றம் கண்ட கழிமுகம்' },
      body: {
        en: 'By holding back and dividing the Kaveri, Kallanai turned a flood-prone plain into one of the great rice lands of South India. Its channels fed village tanks and fields across the delta, and the surplus grain sustained towns, temples and, in later centuries, the Chola state — the delta came to be called the rice bowl of the Tamil country. In 1830 Sir Arthur Cotton cleared its silted course with sand escapes and studied its foundations, and in the nineteenth and twentieth centuries a bridge, vents and shutters were built over the ancient weir. Today, the film tells us, the delta it heads has some 12.5 lakh acres under cultivation.',
        ta: 'காவிரியைத் தடுத்துப் பிரித்ததன் மூலம், வெள்ளத்தால் பாதிக்கப்பட்ட சமவெளியைத் தென்னிந்தியாவின் பெரும் நெல் நிலங்களில் ஒன்றாகக் கல்லணை மாற்றியது. அதன் கால்வாய்கள் கழிமுகமெங்கும் ஊர் ஏரிகளுக்கும் வயல்களுக்கும் நீர் அளித்தன; மிகுதியான நெல் நகரங்களையும் கோயில்களையும், பிற்கால நூற்றாண்டுகளில் சோழப் பேரரசையும் தாங்கியது — கழிமுகம் தமிழ் நாட்டின் நெற்களஞ்சியம் எனப் பெயர் பெற்றது. 1830-இல் சர் ஆர்தர் காட்டன் மணல் போக்கிகள் அமைத்து அதன் வண்டல் நிறைந்த வழியைச் சீர்செய்து, அதன் அடித்தளத்தை ஆய்ந்தார்; பத்தொன்பது, இருபதாம் நூற்றாண்டுகளில் பழைய அணையின் மேல் பாலமும் மதகுகளும் கதவுகளும் கட்டப்பட்டன. இன்று அது தலைமை தாங்கும் கழிமுகத்தில் ஏறத்தாழ 12.5 லட்சம் ஏக்கர் சாகுபடியில் உள்ளது என ஆவணப்படம் கூறுகிறது.',
      },
    },
  ],
  /* The Tamil Agriculture room: the curators' notes, in English and Tamil (public/Tamil Agriculture). */
  agriculture: [
    {
      id: 'ancient-agriculture',
      title: { en: 'Ancient Tamil Agriculture', ta: 'பண்டைய தமிழர்களின் வேளாண்மை' },
      body: {
        en: 'Agriculture was an important source of food, livelihood, and economic activity in ancient Tamil society. Sangam literature, generally associated with the period around 300 BCE–300 CE, describes farming communities, cultivated fields, seasonal rainfall, livestock, and agricultural work. Tamil poets connected different landscapes with distinct ways of life. The Marutham landscape represented fertile agricultural lands, where paddy cultivation and other farming activities were prominent. Farmers selected crops according to soil conditions, rainfall, and water availability. Rice, millets, sugarcane, pulses, cotton, and sesame are among the crops discussed in studies of ancient Tamil agriculture. Farming depended on human labour, animal power, and knowledge of local environmental conditions. Literary evidence provides valuable insights into agricultural life, although it must be interpreted alongside archaeological and historical research.',
        ta: 'பண்டைய தமிழ்ச் சமூகத்தில் உணவு உற்பத்தி, வாழ்வாதாரம் மற்றும் பொருளாதார வளர்ச்சிக்கு வேளாண்மை முக்கிய ஆதாரமாக விளங்கியது. பொதுவாகக் கி.மு. 300 முதல் கி.பி. 300 வரையிலான காலப்பகுதியுடன் தொடர்புபடுத்தப்படும் சங்க இலக்கியங்கள், உழவர் சமூகங்கள், சாகுபடி நிலங்கள், பருவகால மழைப்பொழிவு, கால்நடைகள் மற்றும் வேளாண் பணிகள் குறித்த பல்வேறு செய்திகளை எடுத்துரைக்கின்றன. தமிழ்ப் புலவர்கள் நிலப்பரப்புகளையும் அவற்றுடன் தொடர்புடைய மக்களின் வாழ்க்கை முறைகளையும் தனித்துவமாகப் பதிவு செய்துள்ளனர். அவற்றுள், மருதத்திணை வளமான வயல்வெளிகளையும், நெல் சாகுபடி உள்ளிட்ட வேளாண் செயல்பாடுகளையும் குறிக்கிறது. மண்ணின் தன்மை, மழைப்பொழிவு மற்றும் நீரின் இருப்பு ஆகியவற்றுக்கு ஏற்ப உழவர்கள் பயிர்களைத் தேர்ந்தெடுத்தனர். நெல், சிறுதானியங்கள், கரும்பு, பயறு வகைகள், பருத்தி மற்றும் எள் போன்ற பயிர்கள் பண்டைய தமிழர்களின் வேளாண்மை குறித்த ஆய்வுகளில் குறிப்பிடப்படுகின்றன. மனித உழைப்பு, கால்நடைகளின் உதவி மற்றும் உள்ளூர் இயற்கைச் சூழலைப் பற்றிய அறிவு ஆகியவற்றின் அடிப்படையில் வேளாண்மை மேற்கொள்ளப்பட்டது. பண்டைய தமிழர்களின் வேளாண் வாழ்க்கையைப் புரிந்துகொள்ளச் சங்க இலக்கியங்கள் சிறந்த ஆதாரங்களாக விளங்குகின்றன. இருப்பினும், அவற்றில் இடம்பெறும் செய்திகளைத் தொல்லியல் மற்றும் வரலாற்று ஆய்வுகளின் ஆதாரங்களுடன் ஒப்பிட்டுப் புரிந்துகொள்வது அவசியமாகும்.',
      },
    },
    {
      id: 'farming-tools',
      title: { en: 'Traditional Farming Tools', ta: 'பாரம்பரிய வேளாண் கருவிகள்' },
      body: {
        en: 'Traditional Tamil agriculture relied on tools designed for preparing soil, sowing seeds, removing weeds, harvesting crops, and processing grain. The wooden plough, often drawn by cattle or buffaloes, was used to loosen and prepare agricultural land. Hand tools helped farmers carry out planting and maintenance work, while sickles were used for harvesting crops. After harvesting, grain was separated from stalks through threshing and cleaned by winnowing. Traditional water-lifting devices also helped farmers bring water from wells, ponds, and tanks to their fields. The precise tools and techniques varied according to the crop, region, and historical period. These implements demonstrate how farming communities developed practical technologies suited to local conditions and passed agricultural knowledge from one generation to another.',
        ta: 'பண்டைய மற்றும் பாரம்பரியத் தமிழர்களின் வேளாண்மையில் நிலத்தை உழுதல், விதைகளை விதைத்தல், களைகளை அகற்றுதல், பயிர்களை அறுவடை செய்தல் மற்றும் தானியங்களைப் பதப்படுத்துதல் போன்ற பணிகளுக்குப் பல்வேறு கருவிகள் பயன்படுத்தப்பட்டன. மரத்தால் செய்யப்பட்ட ஏர் அல்லது கலப்பை, பெரும்பாலும் மாடுகள் அல்லது எருமைகளின் உதவியுடன் இழுக்கப்பட்டு, நிலத்தை உழுது சாகுபடிக்குத் தயார்படுத்தப் பயன்பட்டது. விதைப்பு மற்றும் பயிர் பராமரிப்புப் பணிகளுக்கு பல்வேறு கைக் கருவிகள் பயன்படுத்தப்பட்டன. பயிர்களை அறுவடை செய்ய அரிவாள் போன்ற கருவிகள் உதவின. அறுவடைக்குப் பிறகு, கதிர்களிலிருந்து தானியங்களைப் பிரித்தெடுக்கப் போரடித்தல் போன்ற முறைகளும், தானியங்களிலிருந்து பதர்களைப் பிரிக்கத் தூற்றுதல் முறையும் பயன்படுத்தப்பட்டன. கிணறுகள், குளங்கள் மற்றும் நீர்த்தேக்கங்களிலிருந்து வயல்களுக்குத் தண்ணீர் கொண்டு செல்ல பாரம்பரிய நீர் இறைக்கும் கருவிகளும் பயன்படுத்தப்பட்டன. இக்கருவிகளின் வடிவங்களும் பயன்பாட்டு முறைகளும் பயிர் வகை, பகுதி மற்றும் காலகட்டத்திற்கு ஏற்ப மாறுபட்டன. உள்ளூர் சூழலுக்கு ஏற்ற நடைமுறைத் தொழில்நுட்பங்களை உருவாக்கி, வேளாண் அறிவைத் தலைமுறை தலைமுறையாகப் பகிர்ந்து கொண்ட தமிழர்களின் திறனை இக்கருவிகள் எடுத்துக்காட்டுகின்றன.',
      },
    },
    {
      id: 'water-management',
      title: { en: 'Irrigation and Water Management', ta: 'நீர்ப்பாசனமும் நீர் மேலாண்மையும்' },
      body: {
        en: 'Water management has played a major role in Tamil Nadu’s agricultural history because rainfall varies across seasons and regions. Traditional farming communities used rivers, wells, ponds, canals, and irrigation tanks to support cultivation. One of the most significant historic irrigation structures is the Kallanai, or Grand Anicut, across the Kaveri River. Traditionally attributed to the Chola king Karikala, it was constructed to regulate and divert river water for irrigation. Tamil agricultural landscapes also developed networks of tanks and channels that collected and distributed seasonal rainwater. These systems supported cultivation in areas where rainfall alone was insufficient. Their maintenance required cooperation among communities and responsible management of water resources. Traditional irrigation remains an important subject for understanding the relationship between agriculture, engineering, settlement, and environmental adaptation in Tamil Nadu.',
        ta: 'மழைப்பொழிவு பருவத்திற்கும் பகுதிக்கும் ஏற்ப மாறுபடுவதால், தமிழகத்தின் வேளாண் வரலாற்றில் நீர் மேலாண்மை மிக முக்கியப் பங்கு வகித்துள்ளது. பாரம்பரிய வேளாண் சமூகங்கள் ஆறுகள், கிணறுகள், குளங்கள், கால்வாய்கள் மற்றும் ஏரிகளைப் பயன்படுத்தி விவசாயத்திற்குத் தேவையான நீரைப் பெற்றன. காவிரி ஆற்றின் குறுக்கே அமைந்துள்ள கல்லணை, தமிழகத்தின் குறிப்பிடத்தக்க வரலாற்றுச் சிறப்புமிக்க நீர்ப்பாசனக் கட்டமைப்புகளில் ஒன்றாகும். மரபுவழிச் செய்திகளின்படி, இது சோழ மன்னன் கரிகாலனுடன் தொடர்புபடுத்தப்படுகிறது. வேளாண்மைக்காக ஆற்று நீரை ஒழுங்குபடுத்தி, தேவையான பகுதிகளுக்குத் திருப்பிவிடும் நோக்கில் இக்கட்டமைப்பு உருவாக்கப்பட்டது. தமிழகத்தின் பல்வேறு பகுதிகளில் மழைநீரைச் சேமித்து, விவசாயத்திற்குப் பயன்படுத்துவதற்காக ஏரிகள், குளங்கள் மற்றும் நீர்வழிக் கால்வாய்கள் அமைக்கப்பட்டன. மழையை மட்டுமே நம்பி விவசாயம் செய்ய இயலாத பகுதிகளிலும் இத்தகைய நீர்ப்பாசன அமைப்புகள் பயிர் சாகுபடிக்கு உதவின. இவற்றைப் பராமரிப்பதற்கும் நீரைச் சீராகப் பகிர்ந்தளிப்பதற்கும் உள்ளூர் மக்களின் ஒத்துழைப்பும் பொறுப்பான நீர் மேலாண்மையும் அவசியமாக இருந்தன. பாரம்பரிய நீர்ப்பாசன முறைகள், வேளாண்மை, பொறியியல் அறிவு, குடியிருப்பு வளர்ச்சி மற்றும் இயற்கைச் சூழலுக்கு ஏற்ப வாழும் முறைகள் ஆகியவற்றுக்கு இடையிலான தொடர்பைப் புரிந்துகொள்ள உதவுகின்றன.',
      },
    },
    {
      id: 'medieval-agriculture',
      title: { en: 'Agriculture During the Medieval Period', ta: 'இடைக்காலத் தமிழகத்தின் வேளாண்மை' },
      body: {
        en: 'During the medieval period, agriculture continued to support Tamil Nadu’s settlements, markets, and political institutions. Fertile river valleys, particularly the Kaveri delta, supported extensive cultivation, including paddy farming. Irrigation tanks, canals, and water-management structures helped expand and sustain agricultural production. Royal authorities, local communities, and religious institutions played varying roles in managing land and water resources. Agricultural produce supplied households and markets, while land revenue contributed to the resources of ruling powers. Farming also supported related occupations, including cattle rearing, grain processing, transport, and trade. The exact organisation of agricultural work differed between regions and periods. Inscriptions, literary works, and archaeological evidence are important for reconstructing these systems, helping researchers understand how agricultural production influenced settlement patterns, social relationships, and economic development in historical Tamil society.',
        ta: 'இடைக்காலத்தில் தமிழகத்தின் குடியிருப்புகள், சந்தைகள் மற்றும் அரசியல் அமைப்புகளின் வளர்ச்சிக்கு வேளாண்மை தொடர்ந்து ஆதாரமாக விளங்கியது. குறிப்பாக, காவிரி ஆற்றுப் படுகையின் வளமான நிலங்கள் நெல் சாகுபடி உள்ளிட்ட பல்வேறு விவசாய நடவடிக்கைகளுக்கு ஏற்றதாக இருந்தன. ஏரிகள், கால்வாய்கள் மற்றும் பிற நீர் மேலாண்மைக் கட்டமைப்புகள் விவசாய உற்பத்தியை விரிவுபடுத்தவும் தொடர்ந்து நிலைநிறுத்தவும் உதவின. நிலம் மற்றும் நீர்வளங்களை நிர்வகிப்பதில் அரச அதிகாரிகள், உள்ளூர் சமூகங்கள் மற்றும் சமய நிறுவனங்கள் வெவ்வேறு காலகட்டங்களில் பல்வேறு பங்குகளை வகித்தன. வேளாண் விளைபொருட்கள் குடும்பங்களின் உணவுத் தேவைகளை நிறைவேற்றியதுடன், சந்தைகளிலும் விற்பனை செய்யப்பட்டன. நிலத்திலிருந்து பெறப்பட்ட வருவாய் ஆட்சியாளர்களின் பொருளாதார வளங்களுக்கும் ஆதாரமாக இருந்தது. கால்நடை வளர்ப்பு, தானியப் பதப்படுத்துதல், போக்குவரத்து மற்றும் வணிகம் போன்ற தொடர்புடைய தொழில்களுக்கும் வேளாண்மை ஆதரவாக அமைந்தது. இடைக்காலத்தில் வேளாண் பணிகள் எவ்வாறு ஒழுங்கமைக்கப்பட்டிருந்தன என்பது பகுதி மற்றும் காலகட்டத்திற்கு ஏற்ப மாறுபட்டது. கல்வெட்டுகள், இலக்கியங்கள் மற்றும் தொல்லியல் சான்றுகள் மூலம் இவ்வமைப்புகளை ஆய்வு செய்ய முடிகிறது.',
      },
    },
    {
      id: 'crops-seasons',
      title: { en: 'Traditional Crops and Farming Seasons', ta: 'பாரம்பரியப் பயிர்களும் பருவகால வேளாண்மையும்' },
      body: {
        en: 'Tamil farmers traditionally cultivated crops suited to different soils, rainfall patterns, and water supplies. Paddy was particularly important in fertile, well-watered areas, while millets such as kambu and varagu were suitable for various drier agricultural environments. Pulses, sesame, cotton, sugarcane, and other crops also formed part of regional farming systems. Agricultural activities followed seasonal conditions: farmers prepared fields, selected seeds, sowed crops, managed water, removed weeds, and harvested according to the requirements of each crop. Knowledge of rainfall, soil fertility, and seasonal changes was essential for planning cultivation. Different regions developed their own crop combinations and agricultural calendars. Historical studies of Sangam literature indicate that ancient Tamil farmers understood the importance of selecting suitable crops and adapting cultivation methods to local environmental conditions.',
        ta: 'தமிழக உழவர்கள் மண்ணின் தன்மை, மழைப்பொழிவு மற்றும் நீர்வளம் ஆகியவற்றுக்கு ஏற்றவாறு பல்வேறு பயிர்களைப் பயிரிட்டனர். நீர்வளம் நிறைந்த வளமான நிலங்களில் நெல் சாகுபடி முக்கியத்துவம் பெற்றிருந்தது. அதேவேளையில், மழை குறைவாகப் பெய்யும் பகுதிகளில் கம்பு, வரகு உள்ளிட்ட சிறுதானியங்கள் பயிரிடப்பட்டன. பயறு வகைகள், எள், பருத்தி, கரும்பு மற்றும் பிற பயிர்களும் தமிழகத்தின் பல்வேறு பகுதிகளில் சாகுபடி செய்யப்பட்டன. வேளாண் பணிகள் பருவநிலைக்கு ஏற்ப மேற்கொள்ளப்பட்டன. நிலத்தைத் தயார்படுத்துதல், விதைகளைத் தேர்ந்தெடுத்தல், விதைத்தல், நீர்ப்பாசனம் செய்தல், களைகளை அகற்றுதல் மற்றும் பயிர்களை அறுவடை செய்தல் ஆகியவை பயிர்களின் தன்மைக்கும் பருவகாலத்திற்கும் ஏற்ப திட்டமிடப்பட்டன. மழைப்பொழிவு, மண்ணின் வளம் மற்றும் பருவநிலை மாற்றங்கள் குறித்த அறிவு விவசாயத் திட்டமிடலில் முக்கியப் பங்கு வகித்தது. ஒவ்வொரு பகுதியிலும் நிலவிய இயற்கைச் சூழலுக்கு ஏற்ப பயிர்த் தேர்வுகளும் சாகுபடி முறைகளும் மாறுபட்டன.',
      },
    },
    {
      id: 'agriculture-today',
      title: { en: 'Agriculture in Tamil Nadu Today', ta: 'இன்றைய தமிழகத்தின் வேளாண்மை' },
      body: {
        en: 'Agriculture remains an important part of Tamil Nadu’s economy and rural life. Major crops include rice, sugarcane, cotton, groundnut, pulses, and millets, with cultivation patterns varying according to soil, rainfall, irrigation, and market demand. Modern farmers use a combination of traditional knowledge and contemporary technologies, including tractors, mechanical harvesters, improved seeds, irrigation pumps, and soil-management practices. Drip irrigation and other water-efficient methods can help manage scarce water resources in suitable farming systems. Farmers also face challenges such as irregular rainfall, drought, rising input costs, labour shortages, and changing market prices. Tamil Nadu’s agricultural heritage therefore represents both a long history of adapting to local environmental conditions and an evolving sector responding to modern economic and climatic pressures.',
        ta: 'தமிழகத்தின் பொருளாதாரத்திலும் கிராமப்புற மக்களின் வாழ்க்கையிலும் வேளாண்மை இன்றும் முக்கியப் பங்கு வகிக்கிறது. நெல், கரும்பு, பருத்தி, நிலக்கடலை, பயறு வகைகள் மற்றும் சிறுதானியங்கள் ஆகியவை தமிழகத்தில் பயிரிடப்படும் முக்கியப் பயிர்களாகும். இன்றைய விவசாயிகள் பாரம்பரிய அறிவுடன் நவீனத் தொழில்நுட்பங்களையும் இணைத்துப் பயன்படுத்துகின்றனர். உழவு இயந்திரங்கள், இயந்திர அறுவடைக் கருவிகள், மேம்படுத்தப்பட்ட விதைகள், நீர்ப்பாசனப் பம்புகள் மற்றும் மண் வள மேலாண்மை முறைகள் ஆகியவை வேளாண்மையில் பயன்படுகின்றன. இருப்பினும், சீரற்ற மழைப்பொழிவு, வறட்சி, உற்பத்திச் செலவு அதிகரிப்பு, தொழிலாளர் பற்றாக்குறை மற்றும் சந்தை விலைகளில் ஏற்படும் மாற்றங்கள் போன்ற பல்வேறு சவால்களை விவசாயிகள் எதிர்கொள்கின்றனர். எனவே, தமிழகத்தின் வேளாண்மை மரபு என்பது இயற்கைச் சூழலுக்கு ஏற்ப வாழவும் உற்பத்தி செய்யவும் தமிழர்கள் பல நூற்றாண்டுகளாக வளர்த்துக்கொண்ட அறிவையும், நவீன பொருளாதார மற்றும் காலநிலைச் சவால்களுக்கு ஏற்ப தொடர்ந்து மாறிவரும் வேளாண் முறைகளையும் ஒருங்கிணைத்த வரலாற்றுச் சிறப்புமிக்க மரபாகும்.',
      },
    },
  ],
};

export const ARTIFACT_TEXTS = {
  ...FIGURE_TEXTS,
  ...PLACE_IMAGE_TEXTS,
  'Ancient Pottery': {
    'Adichanallur burial urn': {
      ta: 'ஆதிச்சநல்லூர் முதுமக்கள் தாழி',
      en: 'A burial urn of the kind that made Adichanallur famous. The dead — or their gathered bones — were placed in such urns with grave goods and buried in the gravelly ground above the Thamirabarani. The urns are a direct link to the முதுமக்கள் தாழி of Sangam poetry.',
      taText: 'ஆதிச்சநல்லூருக்குப் புகழ் தேடித் தந்த வகையைச் சேர்ந்த ஒரு முதுமக்கள் தாழி. இறந்தோரையோ அவர்தம் எலும்புகளையோ இத்தகைய தாழிகளில் படையல் பொருட்களுடன் வைத்து, தாமிரபரணிக் கரையின் சரளை நிலத்தில் புதைத்தனர். சங்க இலக்கியம் கூறும் முதுமக்கள் தாழியுடன் இவை நேரடியாகத் தொடர்புடையவை.',
    },
    'Ancient ceramic vase — Adichanallur': {
      ta: 'பழங்கால மண் குடுவை — ஆதிச்சநல்லூர்',
      en: 'A ceramic vessel from Adichanallur. Smaller pots like this were placed inside or beside the burial urns, perhaps holding food, water or offerings for the dead — a glimpse of Iron Age belief in a journey beyond death.',
      taText: 'ஆதிச்சநல்லூரிலிருந்து ஒரு மட்கலம். இத்தகைய சிறு கலங்கள் தாழிகளுக்குள்ளோ அருகிலோ வைக்கப்பட்டன; இறந்தோருக்கான உணவு, நீர் அல்லது படையலைக் கொண்டிருக்கலாம் — இறப்புக்குப் பின்னும் தொடரும் பயணம் பற்றிய இரும்புக் கால நம்பிக்கையின் ஒரு தோற்றம்.',
    },
    'Ancient pottery cup — Adichanallur': {
      ta: 'பழங்கால மண் கிண்ணம் — ஆதிச்சநல்லூர்',
      en: 'A small pottery cup from the Adichanallur burials. Cups, bowls and lids were among the most common grave goods, and their careful, even shapes show the skill of potters working on the wheel nearly three thousand years ago.',
      taText: 'ஆதிச்சநல்லூர்ப் புதைவிடங்களிலிருந்து ஒரு சிறு மண் கிண்ணம். கிண்ணங்கள், வட்டில்கள், மூடிகள் ஆகியவை மிகப் பொதுவான படையல் பொருட்கள்; அவற்றின் கவனமான, சீரான வடிவங்கள், ஏறத்தாழ மூவாயிரம் ஆண்டுகளுக்கு முன்பே சக்கரத்தில் பணியாற்றிய குயவர்களின் திறனைக் காட்டுகின்றன.',
    },
    'Black-and-red ware from Valapadi, Salem': {
      ta: 'கருப்பு-சிவப்பு மட்கலம் — வாழப்பாடி, சேலம்',
      en: 'Black-and-red ware from Valapadi in Salem district. Fired upside down so that the inside and rim turned black while the outside stayed red, this ware is found at Iron Age burial and habitation sites across the Tamil country.',
      taText: 'சேலம் மாவட்டம் வாழப்பாடியிலிருந்து கருப்பு-சிவப்பு மட்கலம். உள்ளேயும் விளிம்பிலும் கருப்பாகவும் வெளியே சிவப்பாகவும் மாறும்படி தலைகீழாகச் சுடப்பட்ட இவ்வகை மட்கலம், தமிழகம் எங்கும் இரும்புக் காலப் புதைவிடங்களிலும் குடியிருப்புகளிலும் காணப்படுகிறது.',
    },
    'Black-and-red ware pottery fragments': {
      ta: 'கருப்பு-சிவப்பு மட்கல ஓடுகள்',
      en: 'Fragments of black-and-red ware. Even broken sherds are precious to archaeologists: their fabric, colour, shape and surface marks help date the layers they come from and connect sites hundreds of kilometres apart.',
      taText: 'கருப்பு-சிவப்பு மட்கலத்தின் ஓடுகள். உடைந்த ஓடுகளும் அகழ்வாய்வாளருக்கு மதிப்புமிக்கவை: அவற்றின் மண், நிறம், வடிவம், மேற்பரப்புக் குறிகள் ஆகியவை அவை கிடைத்த அடுக்குகளின் காலத்தைக் கணிக்கவும், நூற்றுக்கணக்கான கிலோமீட்டர் இடைவெளியுள்ள தளங்களை இணைத்துப் பார்க்கவும் உதவுகின்றன.',
    },
    'Bulbous funerary urn — Adichanallur': {
      ta: 'பருத்த ஈமத் தாழி — ஆதிச்சநல்லூர்',
      en: 'A large, round-bellied funerary urn from Adichanallur. Urns like this could stand taller than a child, and making them demanded great skill: Sangam poets address the potter who made such urns as கலம்செய் கோவே — “O king among potters”.',
      taText: 'ஆதிச்சநல்லூரிலிருந்து பெரிய, பருத்த வயிறுடைய ஈமத் தாழி. இத்தகைய தாழிகள் ஒரு குழந்தையை விட உயரமாக இருக்கலாம்; அவற்றைச் செய்வதற்குப் பெரும் திறன் தேவைப்பட்டது. அத்தகைய தாழிகளைச் செய்த குயவனைச் சங்கப் புலவர்கள் “கலம்செய் கோவே” என்று விளிக்கின்றனர்.',
    },
    'Engraved grey pottery — Arikamedu': {
      ta: 'கீறல் வேலைப்பாடுடைய சாம்பல் நிற மட்கலம் — அரிக்கமேடு',
      en: 'Grey pottery with engraved decoration from Arikamedu. Alongside imported Mediterranean wares, the port’s workshops and households used a range of local and regional pottery, some of it finely decorated — a reminder that trade brought new styles and tastes to the Tamil coast.',
      taText: 'அரிக்கமேட்டிலிருந்து கீறல் அணிவேலைப்பாடுடைய சாம்பல் நிற மட்கலம். இறக்குமதியான நடுநிலக் கடல் கலங்களுடன், அத்துறைமுகத்தின் பட்டறைகளும் வீடுகளும் பல வகை உள்ளூர், வட்டார மட்கலங்களையும் பயன்படுத்தின; அவற்றுள் சில நுட்பமாக அணிசெய்யப்பட்டவை — வணிகம் தமிழகக் கரைக்குப் புதிய பாணிகளையும் சுவைகளையும் கொண்டுவந்ததை நினைவூட்டுகின்றன.',
    },
    'Keezhadi red pottery collection': {
      ta: 'கீழடி சிவப்பு மட்கலத் தொகுப்பு',
      en: 'Red-slipped pottery from Keeladi (Keezhadi), the Sangam-age town on the Vaigai near Madurai. Everyday vessels like these — for cooking, storing and serving — make up most of the finds, and some sherds from the site carry names written in Tamil-Brahmi.',
      taText: 'மதுரை அருகே வைகைக் கரையிலுள்ள சங்ககால நகரமான கீழடியிலிருந்து சிவப்புப் பூச்சு மட்கலங்கள். சமைக்கவும் சேமிக்கவும் பரிமாறவும் பயன்பட்ட இத்தகைய அன்றாடக் கலங்களே கண்டெடுப்புகளில் பெரும்பகுதி; இத்தளத்தின் சில ஓடுகளில் தமிழ்-பிராமியில் எழுதப்பட்ட பெயர்களும் உள்ளன.',
    },
    'Large storage jar (dolio) — Adichanallur': {
      ta: 'பெரிய சேமிப்புச் சாடி — ஆதிச்சநல்லூர்',
      en: 'A large storage jar associated with Adichanallur. Capacious jars held grain, water and other provisions; in burial grounds, vessels of this size could also serve as urns. The word “dolio” recalls the dolium, the great storage jar of the Roman world.',
      taText: 'ஆதிச்சநல்லூருடன் தொடர்புடைய ஒரு பெரிய சேமிப்புச் சாடி. அகன்ற சாடிகளில் தானியம், நீர், பிற பொருட்கள் சேமிக்கப்பட்டன; புதைவிடங்களில் இத்தகைய பெரிய கலங்கள் தாழிகளாகவும் பயன்பட்டிருக்கலாம். “டோலியோ” என்ற சொல், உரோமானிய உலகின் பெரும் சேமிப்புச் சாடியான “டோலியம்” என்பதை நினைவூட்டுகிறது.',
    },
    'Nilgiri funerary vessel with a figurative lid': {
      ta: 'உருவ மூடியுடைய நீலகிரி ஈமக் கலம்',
      en: 'A funerary vessel from the burial cairns of the Nilgiri hills, its lid crowned with modelled figures. Nineteenth-century excavators of the Nilgiri cairns found many such lids topped with people, animals and riders — small scenes in clay that may show the life and status of the dead.',
      taText: 'நீலகிரி மலைகளின் ஈமச் சின்னங்களிலிருந்து ஒரு ஈமக் கலம்; அதன் மூடியின் மேல் உருவங்கள் வடிக்கப்பட்டுள்ளன. 19-ஆம் நூற்றாண்டில் நீலகிரி ஈமச் சின்னங்களை அகழ்ந்தவர்கள், மனிதர், விலங்குகள், குதிரை வீரர்கள் வடிக்கப்பட்ட இத்தகைய பல மூடிகளைக் கண்டனர் — இறந்தோரின் வாழ்வையும் நிலையையும் காட்டக்கூடிய மண்ணாலான சிறு காட்சிகள்.',
    },
    'Roman red ceramic — Arikamedu': {
      ta: 'உரோமானியச் சிவப்பு மட்கலம் — அரிக்கமேடு',
      en: 'Red-gloss Roman tableware found at Arikamedu. Known as Arretine ware or terra sigillata and made in Italy around the turn of the Common Era, it often bears its maker’s stamp — and its presence on the Tamil coast is among the clearest proofs of direct trade with Rome.',
      taText: 'அரிக்கமேட்டில் கிடைத்த சிவப்புப் பளபளப்பு உரோமானிய உணவுக் கலம். ஆரெட்டைன் கலம் அல்லது டெர்ரா சிஜில்லாட்டா எனப்படும் இது, பொது ஊழியின் தொடக்கத்தில் இத்தாலியில் செய்யப்பட்டது; பெரும்பாலும் தயாரிப்பாளரின் முத்திரையைத் தாங்கியுள்ளது. தமிழகக் கரையில் இது கிடைப்பது, உரோமுடன் நேரடி வணிகம் நடந்ததற்கான தெளிவான சான்றுகளுள் ஒன்று.',
    },
    'Tamil clay kāḷayam (கலயம்)': {
      ta: 'தமிழ் மண் கலயம்',
      en: 'The kalayam, the everyday Tamil clay pot. Its rounded body and narrow neck keep liquids cool and easy to carry, and kalayams are still thrown on the potter’s wheel and fired in village kilns — a living link to the vessels excavated at Tamil sites.',
      taText: 'அன்றாடப் பயன்பாட்டுத் தமிழ் மண்பாண்டமான கலயம். அதன் உருண்ட உடலும் குறுகிய கழுத்தும் நீர்மங்களைக் குளிர்ச்சியாக வைக்கவும் எளிதில் சுமக்கவும் உதவுகின்றன; இன்றும் கலயங்கள் குயவர் சக்கரத்தில் வனையப்பட்டு ஊர்ச் சூளைகளில் சுடப்படுகின்றன — தமிழகத் தளங்களில் அகழ்ந்தெடுத்த கலங்களுடனான வாழும் இணைப்பு.',
    },
    'Tamil-Brahmi inscribed potsherd — Tissamaharama': {
      ta: 'தமிழ்-பிராமி எழுத்துப் பொறித்த மட்கல ஓடு — திஸ்ஸமகாராமா',
      en: 'A potsherd inscribed in Tamil-Brahmi, found at Tissamaharama in southern Sri Lanka and dated to around the 2nd century BCE. Writing in Tamil on pottery far from the Tamil mainland shows Tamil merchants at work across the sea in the early historic period.',
      taText: 'தென் இலங்கையின் திஸ்ஸமகாராமாவில் கிடைத்த, ஏறத்தாழ கி.மு. 2-ஆம் நூற்றாண்டைச் சேர்ந்த தமிழ்-பிராமி எழுத்துப் பொறித்த மட்கல ஓடு. தமிழ் நிலத்திற்கு அப்பால் மட்கலங்களில் தமிழ் எழுத்து காணப்படுவது, தொடக்க வரலாற்றுக் காலத்திலேயே கடல் கடந்து தமிழ் வணிகர்கள் இயங்கியதைக் காட்டுகிறது.',
    },
  },

  'Ancient Statues': {
    'Buddha offering protection- Chola period': {
      ta: 'அபய முத்திரையுடன் புத்தர் — சோழர் காலம்',
      en: 'The Buddha with his hand raised in abhaya mudra, the gesture that says “fear not”. Buddhism flourished at Chola-period Nagapattinam, where Rajaraja I endowed a monastery for the king of Srivijaya, and hundreds of Buddhist bronzes were cast in the Chola style.',
      taText: '“அஞ்சேல்” என்னும் பொருளுடைய அபய முத்திரையில் கையை உயர்த்திய புத்தர். சோழர் காலத்து நாகப்பட்டினத்தில் பௌத்தம் செழித்தது; அங்கு ஸ்ரீவிஜய மன்னனுக்காக முதலாம் இராசராசன் விகாரத்திற்குக் கொடை அளித்தான்; சோழர் பாணியில் நூற்றுக்கணக்கான பௌத்தச் செப்புச் சிலைகள் வார்க்கப்பட்டன.',
    },
    'Horned Lion- Vyala Pallava period': {
      ta: 'கொம்புடைய யாளி — பல்லவர் காலம்',
      en: 'A vyala or yali, the horned, lion-like guardian beast of South Indian temples. The Pallavas made it their signature, setting pillars on rearing lions and yalis at Mamallapuram and Kanchipuram; later builders carried it onto the great temple halls.',
      taText: 'தென்னிந்தியக் கோயில்களின் கொம்புடைய, சிங்கம் போன்ற காவல் விலங்கான யாளி. பல்லவர்கள் இதைத் தம் அடையாளமாக்கி, மாமல்லபுரத்திலும் காஞ்சியிலும் எழுந்து நிற்கும் சிங்கங்கள், யாளிகள் மீது தூண்களை அமைத்தனர்; பின்வந்தோர் இதைப் பெரும் கோயில் மண்டபங்களுக்கும் கொண்டுசென்றனர்.',
    },
    'Jyeshtha, the Goddess of Ill Fortune, Accompanied by Her Children- Chola period': {
      ta: 'மக்களுடன் ஜ்யேஷ்டா தேவி (மூதேவி) — சோழர் காலம்',
      en: 'Jyeshtha, the elder sister of Lakshmi and goddess of misfortune, seated with her two children — a bull-faced son and a daughter. Widely worshipped in Pallava and early Chola times to keep misfortune at bay, she is shown heavy and earthy, often with her crow emblem; her cult later faded.',
      taText: 'இலக்குமியின் மூத்தவளும் இன்னல்களின் தெய்வமுமான ஜ்யேஷ்டா (மூதேவி), காளை முகம் கொண்ட மகனுடனும் மகளுடனும் அமர்ந்துள்ளாள். இன்னல்களை விலக்குவதற்காகப் பல்லவர், முற்காலச் சோழர் காலத்தில் பரவலாக வழிபடப்பட்ட இவள், பருத்த, மண்ணுலகத் தோற்றத்துடன், பெரும்பாலும் காக்கைச் சின்னத்துடன் காட்டப்படுகிறாள்; பிற்காலத்தில் இவள் வழிபாடு மங்கியது.',
    },
    'Sambandar- Chola period': {
      ta: 'திருஞானசம்பந்தர் — சோழர் காலம்',
      en: 'Thirugnanasambandar, the 7th-century child-saint, one of the great Shaiva Nayanmars whose hymns open the Tevaram. Chola bronzes show him as a small boy dancing in ecstasy, his index finger raised towards Shiva, who — the story goes — had given him milk of wisdom from Parvati’s breast.',
      taText: 'தேவாரத்தின் தொடக்கப் பதிகங்களைப் பாடிய, 7-ஆம் நூற்றாண்டின் குழந்தை அடியார் திருஞானசம்பந்தர் — சைவ நாயன்மார்களுள் முதன்மையானவர். சோழர் செப்புத் திருமேனிகள் அவரைப் பரவசத்தில் ஆடும் சிறுவனாக, சிவனை நோக்கிச் சுட்டுவிரலை உயர்த்தியவராகக் காட்டுகின்றன — உமையம்மை அளித்த ஞானப்பாலைப் பருகியவர் என்பது வரலாறு.',
    },
    'Seated Four-Armed Ganesha- Chola period': {
      ta: 'நான்கு கரங்களுடன் அமர்ந்த விநாயகர் — சோழர் காலம்',
      en: 'Ganesha, remover of obstacles, seated with four arms, holding his broken tusk and a sweet modakam among his attributes. Invoked at the start of every undertaking, he has a niche on the walls of Chola temples and was cast in bronze for processions.',
      taText: 'தடைகளை நீக்கும் விநாயகர், நான்கு கரங்களுடன் அமர்ந்து, தம் அடையாளங்களுள் ஒடிந்த தந்தத்தையும் மோதகத்தையும் ஏந்தியுள்ளார். ஒவ்வொரு செயலின் தொடக்கத்திலும் வணங்கப்படும் அவருக்குச் சோழர் கோயில் சுவர்களில் மாடம் உண்டு; வீதியுலாவுக்காகச் செம்பிலும் வார்க்கப்பட்டார்.',
    },
    'Seated Four-Armed Ganesha2': {
      ta: 'நான்கு கரங்களுடன் அமர்ந்த விநாயகர்',
      en: 'A second image of the four-armed, seated Ganesha. Compare its proportions, ornaments and the turn of the trunk with the first: within the shared canon of the Silpa Sastras, every sculptor and workshop left its own touch.',
      taText: 'நான்கு கரங்களுடன் அமர்ந்த விநாயகரின் இரண்டாவது திருவுருவம். முதலாவதுடன் இதன் அளவுகளையும் அணிகலன்களையும் துதிக்கையின் வளைவையும் ஒப்பிட்டுப் பாருங்கள்: பொதுவான சிற்ப சாத்திர நெறிக்குள்ளும் ஒவ்வொரு சிற்பியும் பட்டறையும் தம் தனி முத்திரையைப் பதித்தனர்.',
    },
    'Shaivite saint- Chola period': {
      ta: 'சைவ அடியார் — சோழர் காலம்',
      en: 'A Shaiva saint, hands joined in worship. The Chola kings honoured the sixty-three Nayanmars, whose lives Sekkizhar told in the Periya Puranam, and their bronze images were set up in temples and carried in festival processions.',
      taText: 'கைகூப்பி வழிபடும் ஒரு சைவ அடியார். சேக்கிழார் பெரியபுராணத்தில் பாடிய அறுபத்து மூன்று நாயன்மார்களைச் சோழ மன்னர்கள் போற்றினர்; அவர்களின் செப்புத் திருமேனிகள் கோயில்களில் நிறுவப்பட்டுத் திருவிழாக்களில் வீதியுலா வந்தன.',
    },
    'Shiva as Mahesha- Chola period': {
      ta: 'மகேசராகச் சிவன் — சோழர் காலம்',
      en: 'Shiva as Mahesha, the Great Lord. Chola sculptors portrayed Shiva in dozens of forms — the dancer, the teacher, the destroyer of demons, the loving consort — each with its own posture, weapons and attributes laid down in the Agamas and Silpa Sastras.',
      taText: 'மாபெரும் இறைவனான மகேசராகச் சிவன். சோழர் சிற்பிகள் சிவனை ஆடவல்லானாக, ஆசானாக, அசுரரை அழித்தவனாக, அன்புமிகு துணைவனாக எனப் பல வடிவங்களில் காட்டினர் — ஒவ்வொன்றுக்கும் ஆகமங்களும் சிற்ப சாத்திரங்களும் வகுத்த தனி நிலை, ஆயுதங்கள், அடையாளங்கள் உண்டு.',
    },
    'Shiva as Pashupati- Chola period': {
      ta: 'பசுபதியாகச் சிவன் — சோழர் காலம்',
      en: 'Shiva as Pashupati, Lord of all creatures. In Shaiva thought the soul is the pashu, bound by pasha, the fetters of the world, and Shiva is the pati — the Lord who frees it; the idea lies at the heart of Tamil Shaiva Siddhanta.',
      taText: 'அனைத்து உயிர்களுக்கும் தலைவனான பசுபதியாகச் சிவன். சைவ நெறியில், உயிர் “பசு”; உலகின் தளைகள் “பாசம்”; அதை விடுவிக்கும் இறைவன் “பதி” — இக்கருத்து தமிழ்ச் சைவ சித்தாந்தத்தின் மையமாக உள்ளது.',
    },
    'Shiva as vanquisher of the three cities (Shiva Tripuravijaya)- Chola period': {
      ta: 'முப்புரம் எரித்த திரிபுராந்தகர் — சோழர் காலம்',
      en: 'Shiva as Tripurantaka, destroyer of the three flying cities of the demons, which he burned with a single arrow. Chola bronzes show him in the archer’s stance — the bow itself is now missing — often with his consort Tripurasundari.',
      taText: 'அசுரர்களின் பறக்கும் மூன்று நகரங்களை ஒரே அம்பால் எரித்த திரிபுராந்தகராகச் சிவன். சோழர் செப்புத் திருமேனிகள் அவரை வில்லாளியின் நிலையில் காட்டுகின்றன — வில் இப்போது இல்லை — பெரும்பாலும் திரிபுரசுந்தரியுடன்.',
    },
    'Shiva Dakshinamurti-Chola period': {
      ta: 'தட்சிணாமூர்த்தி — சோழர் காலம்',
      en: 'Shiva as Dakshinamurti, the supreme teacher, seated beneath a banyan tree and facing south, teaching the sages in silence; his foot rests on the dwarf of ignorance. In Chola temples his image occupies the south-facing niche of the sanctum wall.',
      taText: 'ஆலமரத்தின் கீழ் தெற்கு நோக்கி அமர்ந்து, மௌனத்தால் முனிவர்களுக்கு உபதேசிக்கும் பரம ஆசானான தட்சிணாமூர்த்தியாகச் சிவன்; அவர் பாதம் அறியாமையின் உருவான முயலகன் மீது உள்ளது. சோழர் கோயில்களில் கருவறைச் சுவரின் தெற்கு நோக்கிய மாடத்தில் இவர் வீற்றிருக்கிறார்.',
    },
    'Shiva Embracing His Consort, Uma- Chola period': {
      ta: 'உமையைத் தழுவிய சிவன் (ஆலிங்கன மூர்த்தி) — சோழர் காலம்',
      en: 'Shiva tenderly embracing Uma (Parvati) — the Alingana-murti. Such images celebrate the divine couple and the union of Shiva and his energy, Shakti; Chola bronze-casters gave them a warmth and intimacy rarely matched in sacred art.',
      taText: 'உமையை (பார்வதியை) அன்புடன் தழுவும் சிவன் — ஆலிங்கன மூர்த்தி. இத்தகைய திருவுருவங்கள் தெய்வத் தம்பதியையும், சிவனும் அவன் ஆற்றலான சக்தியும் இணைவதையும் போற்றுகின்றன; சோழர் வார்ப்புக் கலைஞர்கள் இவற்றுக்கு அரிதான கனிவையும் நெருக்கத்தையும் தந்தனர்.',
    },
    Sita: {
      ta: 'சீதை',
      en: 'Sita, heroine of the Ramayana. Chola workshops cast bronze sets of Rama, Lakshmana, Sita and Hanuman for Vishnu temples; Sita stands gracefully in the triple-bend (tribhanga) posture, often turned slightly towards Rama.',
      taText: 'இராமாயணத்தின் தலைவி சீதை. திருமால் கோயில்களுக்காகச் சோழர் பட்டறைகள் இராமன், இலக்குவன், சீதை, அனுமன் ஆகியோரின் செப்புத் தொகுதிகளை வார்த்தன; சீதை மூன்று வளைவுகள் கொண்ட திரிபங்க நிலையில், பெரும்பாலும் இராமனை நோக்கிச் சற்றுத் திரும்பி, எழிலுடன் நிற்கிறாள்.',
    },
    'Standing Parvati- Chola period': {
      ta: 'நின்ற கோலத்தில் பார்வதி — சோழர் காலம்',
      en: 'Parvati (Uma), consort of Shiva, standing in the graceful tribhanga pose, one hand raised as if holding a flower. Once she stood beside a bronze Shiva; today such goddess figures are prized as some of the most beautiful of all Chola bronzes.',
      taText: 'சிவனின் துணைவி பார்வதி (உமை), எழில்மிகு திரிபங்க நிலையில், மலர் ஏந்துவது போல் ஒரு கையை உயர்த்தி நிற்கிறாள். ஒருகாலத்தில் செப்புச் சிவனின் அருகே நின்ற இத்தகைய தேவி உருவங்கள், சோழர் செப்புத் திருமேனிகளிலேயே மிக அழகானவையாக இன்று போற்றப்படுகின்றன.',
    },
    'Standing Shiva and Parvati- Chola period': {
      ta: 'நின்ற கோலத்தில் சிவனும் பார்வதியும் — சோழர் காலம்',
      en: 'Shiva and Parvati standing side by side. Pairs like this were processional images: lugs on their bases took the poles on which they were carried through the temple streets at festivals, dressed in silk, flowers and jewels.',
      taText: 'அருகருகே நிற்கும் சிவனும் பார்வதியும். இத்தகைய இணைகள் உற்சவ மூர்த்திகள்: திருவிழாக்களில் பட்டு, மலர், அணிகலன்கள் அணிவித்துக் கோயில் வீதிகளில் தூக்கிச் செல்லும் தண்டுகளைச் செருகுவதற்கான வளையங்கள் அவற்றின் பீடங்களில் உள்ளன.',
    },
    'Standing Vishnu- Pallava period': {
      ta: 'நின்ற கோலத்தில் திருமால் — பல்லவர் காலம்',
      en: 'Vishnu standing, four-armed, holding his discus and conch in his upper hands. The Pallava kings were great builders for both Shiva and Vishnu, and this calm, frontal image reflects the early, monumental style that the Cholas would later refine.',
      taText: 'மேல் கரங்களில் சக்கரமும் சங்கும் ஏந்தி, நான்கு கரங்களுடன் நிற்கும் திருமால். பல்லவ மன்னர்கள் சிவனுக்கும் திருமாலுக்கும் பெருமளவில் கோயில்கள் எழுப்பினர்; இந்த அமைதியான, நேர்முகத் திருவுருவம், பின்னர் சோழர் செம்மைப்படுத்திய முற்காலப் பேரெழில் பாணியைப் பிரதிபலிக்கிறது.',
    },
    Yogini: {
      ta: 'யோகினி',
      en: 'A yogini, one of a circle of powerful goddesses worshipped in tantric traditions. A remarkable group of seated stone yoginis is associated with the Kanchipuram region in the Chola period; examples are now in museums around the world.',
      taText: 'தாந்திரிக மரபுகளில் வழிபடப்பட்ட ஆற்றல்மிகு தேவியர் குழுவில் ஒருவளான யோகினி. சோழர் காலத்தில் காஞ்சிபுரம் பகுதியுடன் தொடர்புடைய, அமர்ந்த நிலையிலான கல் யோகினிகளின் குறிப்பிடத்தக்க தொகுதி ஒன்று உண்டு; அவற்றுள் சில இன்று உலகின் பல அருங்காட்சியகங்களில் உள்ளன.',
    },
  },

  'Ancient Tamil Coins': {
    'Andipatti lead coin — Tamil-Brahmi legend': {
      ta: 'ஆண்டிப்பட்டி ஈயக் காசு — தமிழ்-பிராமி எழுத்துடன்',
      en: 'A lead coin from Andipatti bearing a legend in Tamil-Brahmi. Besides the three crowned kings, local chieftains of the Sangam age issued coins in lead and copper, and the Tamil-Brahmi legends on them help put names to these rulers.',
      taText: 'தமிழ்-பிராமி எழுத்துடைய ஆண்டிப்பட்டி ஈயக் காசு. மூவேந்தர்களுடன், சங்ககால வட்டாரத் தலைவர்களும் ஈயத்திலும் செம்பிலும் காசுகளை வெளியிட்டனர்; அவற்றின் தமிழ்-பிராமி எழுத்துகள் அந்த ஆட்சியாளர்களின் பெயர்களை அறிய உதவுகின்றன.',
    },
    'Chera coin — Napier Museum': {
      ta: 'சேரர் காசு — நேப்பியர் அருங்காட்சியகம்',
      en: 'A Chera coin in the collection of the Napier Museum, Thiruvananthapuram. Chera coins characteristically bear the bow and arrow, the dynasty’s emblem, and many early examples come from Karur, the Chera centre on the Amaravathi.',
      taText: 'திருவனந்தபுரம் நேப்பியர் அருங்காட்சியகத் தொகுப்பில் உள்ள ஒரு சேரர் காசு. சேரர் காசுகள் பெரும்பாலும் அவர்களின் சின்னமான வில்லையும் அம்பையும் தாங்கியுள்ளன; தொடக்ககாலக் காசுகள் பல அமராவதிக் கரையிலுள்ள சேரர் மையமான கரூரிலிருந்து கிடைத்தவை.',
    },
    'Chera Kuttuvan Kothai portrait coin': {
      ta: 'சேரன் குட்டுவன் கோதை உருவக் காசு',
      en: 'A portrait coin of the Chera king Kuttuvan Kotai, naming him in Tamil-Brahmi. With the Makkotai coins, these rare silver issues — perhaps inspired by Roman portrait coins arriving through trade — are among the earliest Indian coins to show a ruler’s face.',
      taText: 'சேர மன்னன் குட்டுவன் கோதையின் பெயரைத் தமிழ்-பிராமியில் தாங்கிய உருவக் காசு. மாக்கோதை காசுகளுடன் சேர்ந்து, வணிகத்தின் வழி வந்த உரோமானிய உருவக் காசுகளால் தூண்டப்பட்டிருக்கக்கூடிய இந்த அரிய வெள்ளிக் காசுகள், ஆட்சியாளரின் முகத்தைக் காட்டும் மிகத் தொடக்ககால இந்தியக் காசுகளுள் அடங்கும்.',
    },
    'Chola coin with Pandya royal insignia': {
      ta: 'பாண்டிய அரசச் சின்னங்களுடன் சோழர் காசு',
      en: 'A Chola coin carrying Pandya royal insignia. When the Cholas brought the Pandya country under their rule, they placed the Pandya fish beside their own tiger — an emblem of conquest struck into metal.',
      taText: 'பாண்டிய அரசச் சின்னங்களைத் தாங்கிய சோழர் காசு. பாண்டிய நாட்டைச் சோழர் தம் ஆட்சியின் கீழ் கொண்டுவந்தபோது, தம் புலியின் அருகே பாண்டிய மீனைப் பொறித்தனர் — உலோகத்தில் பதிந்த வெற்றியின் சின்னம்.',
    },
    'Early historic Chera Coins': {
      ta: 'தொடக்க வரலாற்றுக் காலச் சேரர் காசுகள்',
      en: 'Early historic Chera coins, mostly of copper. Typical designs show the bow and arrow, an elephant, or a hill symbol; vast numbers have been recovered from the riverbed of the Amaravathi at Karur, once the Chera capital Vanji.',
      taText: 'பெரும்பாலும் செம்பாலான, தொடக்க வரலாற்றுக் காலச் சேரர் காசுகள். வில்லும் அம்பும், யானை, மலைச் சின்னம் ஆகியவை வழக்கமான வடிவங்கள்; ஒருகாலத்தில் சேரர் தலைநகர் வஞ்சியாகக் கருதப்படும் கரூரில் அமராவதி ஆற்றுப் படுகையிலிருந்து ஏராளமாகக் கிடைத்துள்ளன.',
    },
    'Jaffna coin — Horse and three fish': {
      ta: 'யாழ்ப்பாணக் காசு — குதிரையும் மூன்று மீன்களும்',
      en: 'A coin of the Jaffna kingdom showing a horse with fish. The Tamil kings of Jaffna (13th–17th centuries) issued coins in a South Indian tradition, a reminder of the close ties across the Palk Strait.',
      taText: 'குதிரையும் மீன்களும் கொண்ட யாழ்ப்பாண அரசின் காசு. யாழ்ப்பாணத் தமிழ் மன்னர்கள் (13–17-ஆம் நூற்றாண்டுகள்) தென்னிந்திய மரபில் காசுகளை வெளியிட்டனர் — பாக் நீரிணைக்கு இருபுறமும் நிலவிய நெருங்கிய உறவை நினைவூட்டுகிறது.',
    },
    'Kongu Chera coin 2': {
      ta: 'கொங்குச் சேரர் காசு',
      en: 'A second coin of the Kongu Cheras. Compare the two: hand-struck coins vary in strike, wear and cut, and such differences help numismatists sort issues and trace how long coins stayed in circulation.',
      taText: 'கொங்குச் சேரரின் இரண்டாவது காசு. இரண்டையும் ஒப்பிட்டுப் பாருங்கள்: கையால் அடிக்கப்பட்ட காசுகள் அச்சு, தேய்மானம், வெட்டு ஆகியவற்றில் வேறுபடுகின்றன; இத்தகைய வேறுபாடுகள் வெளியீடுகளை வகைப்படுத்தவும், காசுகள் எவ்வளவு காலம் புழக்கத்தில் இருந்தன என்பதை அறியவும் நாணயவியலாளருக்கு உதவுகின்றன.',
    },
    'Kongu Chera coin': {
      ta: 'கொங்குச் சேரர் காசு',
      en: 'A coin of the Kongu Cheras, the Chera line that ruled the Kongu country of the western Tamil region (around present-day Coimbatore, Erode and Karur) — the same region that has yielded rich hoards of Roman coins.',
      taText: 'மேற்குத் தமிழகத்தின் கொங்கு நாட்டை (இன்றைய கோயம்புத்தூர், ஈரோடு, கரூர் பகுதிகள்) ஆண்ட சேர மரபான கொங்குச் சேரரின் காசு — உரோமானியக் காசுப் புதையல்கள் நிறைந்த அதே பகுதி.',
    },
    'Kulothunga Chola coin — “Malai Nadu konda Chola”': {
      ta: 'குலோத்துங்க சோழர் காசு — “மலைநாடு கொண்ட சோழன்”',
      en: 'A coin of Kulottunga Chola bearing the title “Malai Nadu konda Chola” — the Chola who took the hill country, that is, the Chera land. Chola kings proclaimed their victories in titles struck onto their coins as well as carved into their inscriptions.',
      taText: '“மலைநாடு கொண்ட சோழன்” — மலைநாடான சேர நாட்டை வென்ற சோழன் — என்ற பட்டத்தைத் தாங்கிய குலோத்துங்க சோழனின் காசு. சோழ மன்னர்கள் தம் வெற்றிகளைக் கல்வெட்டுகளில் மட்டுமன்றிக் காசுகளிலும் பட்டங்களாகப் பொறித்தனர்.',
    },
    'Kulothunga Chola I coin': {
      ta: 'முதலாம் குலோத்துங்க சோழர் காசு',
      en: 'A coin of Kulottunga I (1070–1120 CE), who united the Chola and Eastern Chalukya lines and ruled one of the longest and most prosperous Chola reigns. His coins continue the established Chola types with his name in Nagari.',
      taText: 'சோழ, கீழைச் சாளுக்கிய மரபுகளை இணைத்து, சோழர் ஆட்சிகளுள் மிக நீண்டதும் செழிப்பானதுமான ஆட்சியை நடத்திய முதலாம் குலோத்துங்கனின் (கி.பி. 1070–1120) காசு. அவனது காசுகள், நாகரியில் அவன் பெயருடன், நிலைபெற்ற சோழர் காசு வகைகளைத் தொடர்கின்றன.',
    },
    'Pandya — Standing king and fish': {
      ta: 'பாண்டியர் காசு — நின்ற மன்னனும் மீனும்',
      en: 'A Pandya coin showing a standing king with the fish emblem. The figure of a standing ruler, made familiar by the Chola copper coinage, was taken up by the Pandyas when their power revived in the 13th century.',
      taText: 'நின்ற மன்னனையும் மீன் சின்னத்தையும் காட்டும் பாண்டியர் காசு. சோழர் செப்புக் காசுகளால் பழக்கமான நின்ற ஆட்சியாளர் உருவத்தை, 13-ஆம் நூற்றாண்டில் தம் ஆற்றல் மீண்டும் எழுந்தபோது பாண்டியர் ஏற்றுக்கொண்டனர்.',
    },
    'Pandya coin — pair of fish and bull': {
      ta: 'பாண்டியர் காசு — இரட்டை மீனும் காளையும்',
      en: 'A Pandya coin with the twin fish and a bull. The paired fish became the enduring Pandya emblem, carved on the Madurai banners of the poems and struck on coins for well over a thousand years.',
      taText: 'இரட்டை மீனும் காளையும் கொண்ட பாண்டியர் காசு. இணை மீன்கள் பாண்டியரின் நிலைத்த சின்னமாயின; இலக்கியம் பாடும் மதுரைக் கொடிகளிலும், ஆயிரம் ஆண்டுகளுக்கும் மேலாகக் காசுகளிலும் பொறிக்கப்பட்டன.',
    },
    'Pandya Dynasty — Massa coin': {
      ta: 'பாண்டியர் “மாசா” காசு',
      en: 'A Pandya coin of the “massa” type. Massa is the name given to the medieval copper coins showing a standing figure on one side and a seated figure on the other — a type spread by the Cholas and continued by the Pandyas and the kings of Sri Lanka.',
      taText: '“மாசா” வகையைச் சேர்ந்த பாண்டியர் காசு. ஒருபுறம் நின்ற உருவமும் மறுபுறம் அமர்ந்த உருவமும் கொண்ட இடைக்காலச் செப்புக் காசுகளுக்கு “மாசா” என்று பெயர் — சோழர் பரப்பி, பாண்டியரும் இலங்கை மன்னர்களும் தொடர்ந்த வகை.',
    },
    'Rajaraja Chola I — Gold coin with seated tiger and two fish': {
      ta: 'முதலாம் இராசராச சோழர் பொற்காசு — அமர்ந்த புலியும் இரு மீன்களும்',
      en: 'A gold coin of Rajaraja I (985–1014 CE), builder of the great temple at Thanjavur. It shows the classic Chola royal emblem: the seated tiger flanked by two Pandya fish, beneath a parasol of sovereignty, with the king’s name in Nagari — the Chola claim to rule the south.',
      taText: 'தஞ்சைப் பெருவுடையார் கோயிலை எழுப்பிய முதலாம் இராசராசனின் (கி.பி. 985–1014) பொற்காசு. இது சோழரின் புகழ்பெற்ற அரசச் சின்னத்தைக் காட்டுகிறது: அரசுரிமைக் குடையின் கீழ் அமர்ந்த புலி, இருபுறமும் இரு பாண்டிய மீன்கள், நாகரியில் மன்னன் பெயர் — தென்னகம் முழுவதையும் ஆளும் சோழரின் உரிமை அறிவிப்பு.',
    },
    'Rajaraja Chola I coin': {
      ta: 'முதலாம் இராசராச சோழர் காசு',
      en: 'A coin of Rajaraja I. His copper coins of the standing-king and seated-figure type, introduced after his conquest of northern Sri Lanka, circulated widely on both sides of the sea and were imitated for centuries.',
      taText: 'முதலாம் இராசராசனின் காசு. வட இலங்கையை வென்ற பிறகு அவன் அறிமுகப்படுத்திய, நின்ற மன்னனும் அமர்ந்த உருவமும் கொண்ட செப்புக் காசுகள் கடலின் இருபுறமும் பரவலாகப் புழங்கின; நூற்றாண்டுகளாகப் பின்பற்றப்பட்டன.',
    },
    'Rajendra Chola — Silver kasu with combined royal emblems': {
      ta: 'இராசேந்திர சோழர் வெள்ளிக் காசு — இணைந்த அரசச் சின்னங்கள்',
      en: 'A silver kasu of Rajendra Chola combining royal emblems — the Chola tiger with the Pandya fish and Chera bow. Rajendra I (1014–1044 CE) carried Chola power to the Ganges and across the sea to Southeast Asia, and his coins proclaim his overlordship of all three Tamil crowns.',
      taText: 'சோழப் புலியுடன் பாண்டிய மீனையும் சேர வில்லையும் இணைத்த அரசச் சின்னங்களைக் கொண்ட இராசேந்திர சோழனின் வெள்ளிக் காசு. முதலாம் இராசேந்திரன் (கி.பி. 1014–1044) சோழர் ஆற்றலைக் கங்கை வரையும் கடல் கடந்து தென்கிழக்கு ஆசியா வரையும் கொண்டு சென்றான்; அவனது காசுகள் மூன்று தமிழ் முடிகள் மீதான அவன் மேலாண்மையை அறிவிக்கின்றன.',
    },
    'Rajendra Chola I — silver kasu, “Uttama” type': {
      ta: 'முதலாம் இராசேந்திர சோழர் வெள்ளிக் காசு — “உத்தம” வகை',
      en: 'A silver kasu of the “Uttama” type, attributed here to Rajendra I. The type takes its name from the coins of Uttama Chola, whose design — tiger, fish and bow beneath a parasol — set the pattern for later Chola silver.',
      taText: 'இங்கு முதலாம் இராசேந்திரனுக்கு உரியதாகக் கொள்ளப்படும் “உத்தம” வகை வெள்ளிக் காசு. இவ்வகை, உத்தம சோழனின் காசுகளிலிருந்து பெயர் பெற்றது; குடையின் கீழ் புலி, மீன், வில் கொண்ட அவற்றின் வடிவமைப்பே பிற்காலச் சோழர் வெள்ளிக் காசுகளுக்கு முன்மாதிரியாயிற்று.',
    },
    'Sangam Chola — Tiger and elephant': {
      ta: 'சங்ககாலச் சோழர் காசு — புலியும் யானையும்',
      en: 'A Sangam-age Chola coin with a tiger and an elephant. Early Chola coins, mostly of copper, centre on the tiger — the same emblem the imperial Cholas would carry a thousand years later. Uraiyur and Kaveripoompattinam were their great centres.',
      taText: 'புலியும் யானையும் கொண்ட சங்ககாலச் சோழர் காசு. பெரும்பாலும் செம்பாலான தொடக்ககாலச் சோழர் காசுகள் புலியை மையமாகக் கொண்டவை — ஆயிரம் ஆண்டுகள் கழித்துப் பேரரசுச் சோழர்களும் தாங்கிய அதே சின்னம். உறையூரும் காவிரிப்பூம்பட்டினமும் அவர்களின் பெரும் மையங்கள்.',
    },
    'Sangam Pandya — Elephant and stylised fish': {
      ta: 'சங்ககாலப் பாண்டியர் காசு — யானையும் மீனும்',
      en: 'A Sangam-age Pandya coin, typically a small square of copper with an elephant on one side and a stylised fish on the other. Such coins circulated in and around Madurai, the Pandya capital celebrated in Maduraikkanchi.',
      taText: 'சங்ககாலப் பாண்டியர் காசு; பெரும்பாலும் ஒருபுறம் யானையும் மறுபுறம் உருவகமான மீனும் கொண்ட சிறு சதுரச் செப்புக் காசு. மதுரைக்காஞ்சி போற்றும் பாண்டியர் தலைநகரான மதுரையிலும் அதைச் சுற்றியும் இத்தகைய காசுகள் புழங்கின.',
    },
    'Setu coin — Bull on obverse': {
      ta: 'சேது காசு — முன்புறம் காளை',
      en: 'A “Setu” coin with a bull on the obverse. The word Setu — the bridge to Lanka, at Rameswaram — appears on coins of the late medieval Tamil rulers of the Jaffna kingdom; the couchant bull, Shiva’s Nandi, is their common device.',
      taText: 'முன்புறம் காளை கொண்ட “சேது” காசு. இராமேசுவரத்தில் இலங்கைக்கான அணையைக் குறிக்கும் “சேது” என்ற சொல், யாழ்ப்பாண அரசின் பிற்கால இடைக்காலத் தமிழ் ஆட்சியாளர்களின் காசுகளில் காணப்படுகிறது; சிவனின் வாகனமான படுத்திருக்கும் நந்தி அவற்றின் பொது உருவம்.',
    },
    'Setu coin — Reverse side': {
      ta: 'சேது காசு — பின்புறம்',
      en: 'The reverse of a Setu coin, where the legend “Setu” is written. Reading the inscriptions on both faces of a coin — the obverse and the reverse — is how numismatists identify who issued it and when.',
      taText: '“சேது” என்ற எழுத்து பொறிக்கப்பட்ட சேது காசின் பின்புறம். காசின் இரு முகங்களிலுமுள்ள — முன்புறம், பின்புறம் — எழுத்துகளைப் படிப்பதன் மூலமே, அதை யார், எப்போது வெளியிட்டனர் என்பதை நாணயவியலாளர் கண்டறிகின்றனர்.',
    },
    'Tamil Nadu coin collection — Government Museum, Chennai': {
      ta: 'தமிழகக் காசுத் தொகுப்பு — அரசு அருங்காட்சியகம், சென்னை',
      en: 'Coins from the numismatic collection of the Government Museum, Chennai — one of India’s oldest museums, founded in 1851. Its cabinets hold coins of the Tamil dynasties alongside Roman and other foreign coins found on Tamil soil.',
      taText: 'இந்தியாவின் மிகப் பழைய அருங்காட்சியகங்களுள் ஒன்றான, 1851-இல் தொடங்கப்பட்ட சென்னை அரசு அருங்காட்சியகத்தின் நாணயவியல் தொகுப்பிலிருந்து காசுகள். அதன் பேழைகளில், தமிழ் அரசமரபுகளின் காசுகளுடன் தமிழ் மண்ணில் கிடைத்த உரோமானியக் காசுகளும் பிற அயல்நாட்டுக் காசுகளும் உள்ளன.',
    },
    'Uttama Chola legend — coin reverse': {
      ta: 'உத்தம சோழன் பெயர் பொறித்த காசு — பின்புறம்',
      en: 'The reverse of a coin naming Uttama Chola (c. 970–985 CE), whose silver coins are among the earliest Chola issues to carry a king’s name — here in the Grantha script used for Sanskrit in the Tamil country.',
      taText: 'உத்தம சோழனின் (ஏறத்தாழ கி.பி. 970–985) பெயரைத் தாங்கிய காசின் பின்புறம். அவனது வெள்ளிக் காசுகள், மன்னன் பெயரைத் தாங்கிய மிகத் தொடக்ககாலச் சோழர் காசுகளுள் அடங்கும் — இங்கு, தமிழகத்தில் வடமொழிக்குப் பயன்பட்ட கிரந்த எழுத்தில்.',
    },
    'Virarajendra Chola — Gold half Kahavanu': {
      ta: 'வீரராஜேந்திர சோழர் — அரைக் கஹவணு பொற்காசு',
      en: 'A gold half-kahavanu of Virarajendra Chola (1063–1070 CE). Kahavanu (from kahapana) was a gold denomination of Sri Lanka, and Chola gold struck to this standard reflects the period of Chola rule over the island.',
      taText: 'வீரராஜேந்திர சோழனின் (கி.பி. 1063–1070) அரைக் கஹவணு பொற்காசு. கஹவணு (கஹாபணம்) இலங்கையின் பொற்காசு மதிப்பு அலகு; இந்த அளவுமுறையில் அடிக்கப்பட்ட சோழர் பொற்காசுகள், அத்தீவின் மீதான சோழர் ஆட்சிக் காலத்தைப் பிரதிபலிக்கின்றன.',
    },
  },

  /*
   * Several photographs in this folder are named for a different subject than they show;
   * `title` and `detail` give what each painting actually depicts. One file is a duplicate.
   */
  'Ancient Tamil Paintings': {
    'Chola mural- Shiva as Nataraja': {
      title: 'Shiva’s Dance with the Gods',
      detail: 'Temple mural',
      ta: 'தேவர் சூழ சிவனின் ஊர்த்துவ தாண்டவம்',
      en: 'Shiva dances the Urdhva Tandava, one leg flung up beside his crowned head, his many hands holding the trident, the drum and the leaping deer, while four-faced Brahma and other crowned gods look on. Drawn in firm black outline and laid in yellow and white on a deep red ground. The pose recalls the dance contest at Thiruvalangadu, where Shiva raised his foot to the sky — a step Kali could not match.',
      taText: 'ஒரு காலை மகுடம் அருகே உயர்த்தி, சூலம், உடுக்கை, துள்ளும் மான் ஆகியவற்றைக் கைகளில் ஏந்தி, சிவன் ஊர்த்துவ தாண்டவம் ஆடுகிறார்; நான்முகனான பிரம்மனும் மகுடம் அணிந்த பிற தேவர்களும் கண்டு நிற்கின்றனர். உறுதியான கருங்கோடுகளுடன், அடர் சிவப்புப் பின்னணியில் மஞ்சளும் வெண்மையும் கொண்டு தீட்டப்பட்டது. திருவாலங்காட்டில் காளியுடன் நடந்த நடனப் போட்டியில், சிவன் தம் திருவடியை வானுயர உயர்த்தியதையும், அதைக் காளியால் ஆட முடியாமல் போனதையும் இந்நிலை நினைவூட்டுகிறது.',
    },
    'Chola-era fresco Brihadisvara Temple': {
      title: 'The Painted Cloister of the Big Temple',
      detail: 'Brihadisvara Temple, Thanjavur',
      ta: 'பெரிய கோயில் திருச்சுற்று மாளிகையின் ஓவியங்கள்',
      en: 'The long pillared cloister that encloses the courtyard of the Brihadisvara temple, with a row of lingams set along its floor. Its walls were painted in the Nayak period with lively scenes — here Shiva’s pot-bellied ganas, his playful dwarf attendants — under a band of Tamil captions. Behind such later paintings, in the passage round the sanctum, lie the temple’s original Chola frescoes.',
      taText: 'தஞ்சைப் பெரிய கோயிலின் முற்றத்தைச் சூழ்ந்த நீண்ட தூண் மண்டபமான திருச்சுற்று மாளிகை; அதன் தரையில் வரிசையாக இலிங்கங்கள் அமைந்துள்ளன. நாயக்கர் காலத்தில் இதன் சுவர்களில் உயிர்ப்புள்ள காட்சிகள் வரையப்பட்டன — இங்கு, சிவனின் விளையாட்டுக் குள்ளப் பணியாளர்களான பெருவயிற்றுப் பூதகணங்கள் — அவற்றின் மேலே தமிழ் விளக்க வரிகளின் பட்டை. இத்தகைய பிற்கால ஓவியங்களுக்குப் பின்னால், கருவறைச் சுற்றுப்பாதையில், கோயிலின் மூலச் சோழர் சுவரோவியங்கள் உள்ளன.',
    },
    'Dakshinamurthy chola mural 1': {
      title: 'Saraswati with Narada and Tumburu',
      detail: 'Brihadisvara Temple, Thanjavur · Nayak period',
      ta: 'நாரதர், தும்புருவுடன் கலைமகள்',
      en: 'Saraswati, goddess of learning and music, sits enthroned playing the veena, a rosary and a palm-leaf book in her other hands. On the left stands the sage Narada, on the right the horse-faced celestial musician Tumburu, each with his own veena. Painted curtains and garlands frame the scene above — a hallmark of the Nayak-period murals at Thanjavur.',
      taText: 'கல்வி, இசை ஆகியவற்றின் தெய்வமான கலைமகள் அரியணையில் அமர்ந்து வீணை மீட்டுகிறாள்; பிற கைகளில் அக்கமாலையும் ஓலைச்சுவடியும். இடப்புறம் நாரத முனிவரும், வலப்புறம் குதிரை முகமுடைய வான இசைக்கலைஞர் தும்புருவும் தத்தம் வீணையுடன் நிற்கின்றனர். மேலே வரையப்பட்ட திரைச்சீலைகளும் மாலைகளும் காட்சிக்குச் சட்டமிடுகின்றன — தஞ்சையின் நாயக்கர் காலச் சுவரோவியங்களின் அடையாளம் இது.',
    },
    'Manakula Vinayagar 2 tanjore paitnings': {
      title: 'Manakula Vinayagar',
      detail: 'Tanjore painting',
      ta: 'மணக்குள விநாயகர் — தஞ்சாவூர் ஓவியம்',
      en: 'Vinayaka enthroned beneath a gilded arch, a red halo behind him, his mouse and a dish of sweets at his feet. Manakula Vinayagar is the Ganesha of the celebrated temple in Puducherry. The arch, crown and ornaments are raised in a relief of chalk and gum, covered in gold leaf and set with coloured stones — the signature technique of the Tanjore painting.',
      taText: 'பொன் வேய்ந்த வளைவின் கீழ், சிவப்பு ஒளிவட்டத்தின் முன் அரியணையில் அமர்ந்த விநாயகர்; காலடியில் மூஞ்சுறும் இனிப்புத் தட்டும். மணக்குள விநாயகர், புதுச்சேரியின் புகழ்பெற்ற கோயிலின் விநாயகர். வளைவு, மகுடம், அணிகலன்கள் ஆகியவை சுண்ணமும் பசையும் கலந்த புடைப்பில் எழுப்பப்பட்டு, பொன் தகடு வேய்ந்து, வண்ணக் கற்கள் பதிக்கப்பட்டுள்ளன — தஞ்சாவூர் ஓவியத்தின் தனித்த நுட்பம் இது.',
    },
    'Nataraja with Sivakami tanjore painting': {
      title: 'Nataraja with Sivakami',
      detail: 'Tanjore painting',
      ta: 'சிவகாமியுடன் நடராசர் — தஞ்சாவூர் ஓவியம்',
      en: 'Nataraja, the Lord of the Dance, with Sivakami — Parvati as his consort at Chidambaram, where the dancing Shiva is worshipped in the golden hall. In the Tanjore manner the figures are framed by an arch and enriched with gold leaf and inset stones that glow in lamplight.',
      taText: 'ஆடல்வல்லானான நடராசரும், சிதம்பரத்தில் அவர்தம் துணைவியாக விளங்கும் பார்வதியான சிவகாமி அம்மையும்; ஆடும் சிவன் பொன்னம்பலத்தில் வழிபடப்படும் தலம் சிதம்பரம். தஞ்சாவூர் முறையில் உருவங்கள் வளைவால் சட்டமிடப்பட்டு, விளக்கொளியில் மின்னும் பொன் தகட்டாலும் பதித்த கற்களாலும் அணிசெய்யப்பட்டுள்ளன.',
    },
    'Panamalai Pallava painting ATP': {
      title: 'The Goddess beneath a Parasol',
      detail: 'Talagirisvara Temple, Panamalai · Pallava, c. 700 CE',
      ta: 'அரசக் குடையின் கீழ் தேவி — பனைமலை',
      en: 'In a small shrine of the Talagirisvara temple at Panamalai, in Viluppuram district, built by the Pallava king Rajasimha, a crowned goddess stands beneath a royal parasol, head gently inclined. She is usually identified as Parvati watching Shiva’s dance, a figure now lost. Much of the plaster has flaked away, yet the delicate line and soft modelling make her one of the masterpieces of early South Indian painting.',
      taText: 'பல்லவ மன்னன் இராசசிம்மன் கட்டிய, விழுப்புரம் மாவட்டப் பனைமலைத் தாளகிரீசுவரர் கோயிலின் சிறு சன்னதி ஒன்றில், அரசக் குடையின் கீழ், தலையைச் சற்றே சாய்த்து, மகுடம் அணிந்த தேவி நிற்கிறாள். இன்று அழிந்துவிட்ட சிவனின் நடனத்தைக் காணும் பார்வதியாக இவள் பொதுவாக அடையாளம் காணப்படுகிறாள். சாந்தின் பெரும்பகுதி உதிர்ந்துவிட்டாலும், நுண்ணிய கோடுகளும் மென்மையான நிழலமைப்பும் இவளைத் தொடக்ககாலத் தென்னிந்திய ஓவியத்தின் தலைசிறந்த படைப்புகளுள் ஒன்றாக்குகின்றன.',
    },
    'Rajaraja Chola and Karuvur Thevar ATP': {
      title: 'Rajaraja Chola and Karuvur Thevar',
      detail: 'Brihadisvara Temple, Thanjavur · Chola, c. 1010 CE',
      ta: 'இராசராச சோழனும் கருவூர்த்தேவரும்',
      en: 'The best-known of the Chola frescoes, in the passage round the sanctum of the Big Temple: a bearded, crowned sage and a young man standing close behind him. Since its discovery the pair has been identified as Rajaraja I, the temple’s builder, with his guru Karuvur Thevar, though some scholars read the figures differently. Painted in true fresco on wet lime plaster, the faces show the Chola painters’ calm, assured line.',
      taText: 'பெரிய கோயில் கருவறைச் சுற்றுப்பாதையில் உள்ள சோழர் சுவரோவியங்களுள் மிகவும் புகழ்பெற்றது: தாடியும் மகுடமும் கொண்ட ஒரு முனிவரும், அவருக்குப் பின் நெருக்கமாக நிற்கும் ஓர் இளைஞரும். கண்டறியப்பட்டது முதல், கோயிலைக் கட்டிய முதலாம் இராசராசனும் அவன் குருவான கருவூர்த்தேவரும் என இவ்விருவரும் அடையாளம் காணப்படுகின்றனர்; சில அறிஞர்கள் வேறு விதமாகவும் விளக்குகின்றனர். ஈரச் சுண்ணச் சாந்தின் மேல் வரையப்பட்ட இம்முகங்களில், சோழ ஓவியர்களின் அமைதியும் உறுதியும் கொண்ட கோடுகள் தெரிகின்றன.',
    },
    'Rare Sittanavasal painting- atp': {
      title: 'The Lotus Pool of Sittanavasal',
      detail: 'Arivar Koil, Sittanavasal · c. 9th century',
      ta: 'சித்தன்னவாசல் தாமரைக் குளம்',
      en: 'A detail of the painted ceiling of the Jain cave shrine at Sittanavasal: pink lotuses opening among green pads, an animal wading through the water and a figure gathering flowers. The pool is often read as the lotus moat of the samavasarana, the heavenly assembly where a Jain Tirthankara preaches, with the faithful gathering flowers to offer.',
      taText: 'சித்தன்னவாசல் சமணக் குடைவரையின் ஓவியக் கூரையின் ஒரு பகுதி: பச்சை இலைகளின் நடுவே மலரும் இளஞ்சிவப்புத் தாமரைகள், நீரில் நடக்கும் ஒரு விலங்கு, மலர் கொய்யும் ஓர் உருவம். சமணத் தீர்த்தங்கரர் அறம் உரைக்கும் தெய்வீக அவையான “சமவசரணத்தைச்” சூழ்ந்த தாமரை அகழியாகவும், வழிபாட்டுக்கு மலர் கொய்யும் அடியார்களாகவும் இக்காட்சி பெரும்பாலும் விளக்கப்படுகிறது.',
    },
    'Sittanavasal lotus-pond mural-  ATP': {
      title: 'Flower-Gatherers in the Lotus Pool',
      detail: 'Arivar Koil, Sittanavasal · c. 9th century',
      ta: 'தாமரைக் குளத்தில் மலர் கொய்வோர் — சித்தன்னவாசல்',
      en: 'In the most famous passage of the Sittanavasal ceiling, a young man with curled hair reaches for a lotus while another wades beside him, a buffalo half-hidden among the great red buds. The painters used a limited palette of red, yellow, green and black, yet gave the figures a supple grace that has survived eleven centuries.',
      taText: 'சித்தன்னவாசல் கூரை ஓவியத்தின் மிகப் புகழ்பெற்ற பகுதியில், சுருள் முடியுடைய ஓர் இளைஞன் தாமரையைக் கொய்ய நீள்கிறான்; அருகே மற்றொருவன் நீரில் நடக்கிறான்; பெரிய சிவப்பு மொட்டுகளின் இடையே ஓர் எருமை பாதி மறைந்துள்ளது. சிவப்பு, மஞ்சள், பச்சை, கருப்பு என்ற குறைந்த நிறங்களையே ஓவியர்கள் பயன்படுத்தினாலும், பதினொரு நூற்றாண்டுகளைக் கடந்தும் நிலைத்த நெகிழ்வான எழிலை உருவங்களுக்குத் தந்துள்ளனர்.',
    },
    'Shiva (dakshinamurthy) as Nataraja Chola mural': {
      title: 'Dakshinamurthy beneath the Banyan',
      detail: 'Temple mural',
      ta: 'ஆலமர் செல்வன் — தட்சிணாமூர்த்தி',
      en: 'Shiva as Dakshinamurthy, the teacher who instructs in silence, sits on a rock beneath a vast banyan, a tiger skin across his knees, while four aged sages kneel at his feet. Monkeys, parrots, peacocks and squirrels crowd the branches. Tamil poets have long called this form ஆலமர் செல்வன் — “the lord who dwells beneath the banyan”.',
      taText: 'மௌனத்தால் உபதேசிக்கும் ஆசானான தட்சிணாமூர்த்தியாகச் சிவன், பெரிய ஆலமரத்தின் கீழ்ப் பாறை மீது புலித்தோலுடன் அமர்ந்துள்ளார்; நான்கு முதிய முனிவர்கள் அவர் திருவடியில் பணிந்துள்ளனர். குரங்குகள், கிளிகள், மயில்கள், அணில்கள் கிளைகளை நிறைக்கின்றன. இவ்வடிவைத் தமிழ்ப் புலவர்கள் நெடுங்காலமாக “ஆலமர் செல்வன்” என்று போற்றுகின்றனர்.',
    },
    'Shiva as Nataraja Chola mural 2': {
      title: 'Nataraja in a Ring of Flame',
      detail: 'Brihadisvara Temple, Thanjavur · Nayak period',
      ta: 'திருவாசியுள் நடராசர் — பெரிய கோயில்',
      en: 'Nataraja dances within a circle of flame on a deep blue ground, one foot planted on the dwarf Apasmara — ignorance — the other lifted across his body. Above hang painted curtains and garlands; below, a lingam stands before the wall, as it does in the cloister of the Big Temple, where flowers are still offered.',
      taText: 'அடர் நீலப் பின்னணியில், தீச்சுடர் வளையமான திருவாசியினுள் நடராசர் ஆடுகிறார்; ஒரு திருவடி அறியாமையின் உருவான முயலகன் மீது ஊன்றியுள்ளது; மற்றொன்று உடலின் குறுக்கே உயர்ந்துள்ளது. மேலே வரையப்பட்ட திரைச்சீலைகளும் மாலைகளும்; கீழே, இன்றும் மலர் சாற்றப்படும் பெரிய கோயில் திருச்சுற்று மாளிகையில் உள்ளது போல, சுவரின் முன் ஓர் இலிங்கம்.',
    },
    // The same photograph as 'Tripurantaka — Chola mural' under another name.
    'Shiva as Nataraja Chola mural': { skip: true },
    'Shiva as Tripurantaka 1': {
      title: 'Saraswati with Narada and Tumburu',
      detail: 'Brihadisvara Temple, Thanjavur · Nayak period',
      ta: 'நாரதர், தும்புருவுடன் கலைமகள்',
      en: 'Another view of the Saraswati panel, its colours glowing on the warm yellow ground the Nayak painters favoured. The goddess’s fine white face and tall crown, Narada’s turban and Tumburu’s horse’s head are each drawn with a single confident outline, then filled with flat, bright colour.',
      taText: 'கலைமகள் ஓவியத்தின் மற்றொரு தோற்றம்; நாயக்கர் ஓவியர்கள் விரும்பிய வெதுவெதுப்பான மஞ்சள் பின்னணியில் நிறங்கள் ஒளிர்கின்றன. தேவியின் நுண்ணிய வெண்முகமும் உயர்ந்த மகுடமும், நாரதரின் தலைப்பாகையும், தும்புருவின் குதிரைத் தலையும் ஒவ்வொன்றும் ஒரே உறுதியான கோட்டால் வரையப்பட்டு, தட்டையான ஒளிமிக்க நிறத்தால் நிரப்பப்பட்டுள்ளன.',
    },
    'Shiva as Tripurantaka 2': {
      title: 'A Crowned Figure',
      detail: 'Temple mural',
      ta: 'மகுடம் அணிந்த உருவம்',
      en: 'A crowned, moustached figure in profile, wearing a jewelled jacket and flowing scarves, raises a feather-tipped staff. The face and hands are drawn in fine black line on pale ground and the robes washed in ochre, pink and green — a portrait-like study of courtly dress in a temple painting.',
      taText: 'மகுடமும் மீசையும் கொண்ட ஒருவர் பக்கவாட்டுத் தோற்றத்தில், அணிகலன் பதித்த மேலாடையும் பறக்கும் மேலாடைகளும் அணிந்து, இறகு முனையுடைய கோலை உயர்த்துகிறார். முகமும் கைகளும் வெளிர் பின்னணியில் நுண்ணிய கருங்கோடுகளால் வரையப்பட்டு, ஆடைகள் காவி, இளஞ்சிவப்பு, பச்சை நிறங்களில் தீட்டப்பட்டுள்ளன — கோயில் ஓவியத்தில் அரசவை உடையின் ஓர் உருவப்படம் போன்ற ஆய்வு.',
    },
    'Shiva as Tripurantaka 3': {
      title: 'Durga, Slayer of the Buffalo Demon',
      detail: 'Brihadisvara Temple, Thanjavur · Nayak period',
      ta: 'மகிடாசுரமர்த்தினி — கொற்றவை',
      en: 'The eight-armed goddess, her face painted blue, stands over the head of the buffalo demon Mahisha, bearing sword, bow, arrows, discus and shield, while two women attend her with fly-whisks. In Tamil tradition she is linked with Korravai, the victorious war goddess of Sangam poetry.',
      taText: 'நீல நிற முகமுடைய எண்கைத் தேவி, எருமைத் தலை அசுரனான மகிடனின் தலை மீது நின்று, வாள், வில், அம்புகள், சக்கரம், கேடயம் ஏந்துகிறாள்; இரு பெண்கள் சாமரம் வீசிப் பணிவிடை செய்கின்றனர். தமிழ் மரபில் இவள், சங்க இலக்கியம் போற்றும் வெற்றித் தெய்வமான கொற்றவையுடன் இணைத்துப் பார்க்கப்படுகிறாள்.',
    },
    'Tanjore Painting 1': {
      title: 'Vinayaka',
      detail: 'Tanjore painting',
      ta: 'விநாயகர் — தஞ்சாவூர் ஓவியம்',
      en: 'Vinayaka seated at ease on a gilded throne, his trunk curled towards a sweet, holding the goad and noose, with his mouse and a dish of modakams on the red floor. Against the black ground the raised, gold-leafed arch, ornaments and garlands stand out as if carved — the effect Tanjore painters sought for images meant for worship at home.',
      taText: 'பொன் வேய்ந்த அரியணையில் இனிது அமர்ந்த விநாயகர், துதிக்கையை இனிப்பை நோக்கி வளைத்து, அங்குசமும் பாசமும் ஏந்தியுள்ளார்; சிவப்புத் தரையில் மூஞ்சுறும் மோதகத் தட்டும். கருப்புப் பின்னணியில், புடைப்பாக எழுப்பிப் பொன் தகடு வேய்ந்த வளைவும் அணிகலன்களும் மாலைகளும் செதுக்கியவை போலத் தோன்றுகின்றன — இல்லங்களில் வழிபாட்டுக்கான உருவங்களுக்குத் தஞ்சாவூர் ஓவியர்கள் நாடிய விளைவு இது.',
    },
    'Tanjore Painting 3': {
      title: 'The Coronation of Rama',
      detail: 'Tanjore painting',
      ta: 'இராமர் பட்டாபிஷேகம் — தஞ்சாவூர் ஓவியம்',
      en: 'An old Tanjore painting of Rama’s coronation. Green-skinned Rama sits enthroned with Sita, his brothers attending with fly-whisk and parasol, Hanuman at his feet, and sages and vanaras crowding the court. Nearly every surface is gilded and set with stones; the wear on the gold and paint shows its age and long use in worship.',
      taText: 'இராமர் பட்டாபிஷேகத்தைக் காட்டும் பழைய தஞ்சாவூர் ஓவியம். பச்சை மேனியுடைய இராமர் சீதையுடன் அரியணையில் அமர்ந்துள்ளார்; தம்பியர் சாமரமும் குடையும் ஏந்திப் பணிவிடை செய்கின்றனர்; திருவடியில் அனுமன்; முனிவர்களும் வானரர்களும் அவையை நிறைக்கின்றனர். ஏறத்தாழ எல்லாப் பகுதிகளும் பொன் வேய்ந்து கற்கள் பதிக்கப்பட்டுள்ளன; பொன்னிலும் நிறத்திலும் உள்ள தேய்மானம் அதன் பழமையையும் நீண்ட வழிபாட்டுப் பயன்பாட்டையும் காட்டுகிறது.',
    },
    'Tanjore Painting of Vinayaka 2': {
      title: 'Vinayaka',
      detail: 'Tanjore painting',
      ta: 'விநாயகர் — தஞ்சாவூர் ஓவியம்',
      en: 'Vinayaka, remover of obstacles, who is honoured first before any undertaking. Tanjore painters set him at the centre beneath an arch, with a rounded, child-like face, and built up his crown and jewels in raised gesso covered with gold leaf and coloured stones.',
      taText: 'எச்செயலைத் தொடங்கும் முன்னும் முதலில் வணங்கப்படும் தடைகளைக் களைபவரான விநாயகர். தஞ்சாவூர் ஓவியர்கள் அவரை வளைவின் கீழ் நடுவில் அமைத்து, குழந்தை போன்ற உருண்ட முகம் தந்து, மகுடத்தையும் அணிகலன்களையும் புடைப்பாக எழுப்பிப் பொன் தகடும் வண்ணக் கற்களும் கொண்டு அணிசெய்தனர்.',
    },
    'Tanjore painting wall': {
      title: 'Gajalakshmi',
      detail: 'Tanjore painting',
      ta: 'கஜலட்சுமி — தஞ்சாவூர் ஓவியம்',
      en: 'Lakshmi, goddess of prosperity, seated between two elephants that raise lotuses in their trunks — the form called Gajalakshmi. Under a gilded arch hung with green curtains, her crown, jewels and garlands are raised in relief and covered in gold leaf, with red and green stones set into the frame.',
      taText: 'துதிக்கைகளில் தாமரை ஏந்திய இரு யானைகளின் நடுவே அமர்ந்த செல்வத் திருமகளான இலட்சுமி — கஜலட்சுமி எனப்படும் வடிவம். பச்சைத் திரைச்சீலைகள் தொங்கும் பொன் வளைவின் கீழ், அவளது மகுடமும் அணிகலன்களும் மாலைகளும் புடைப்பாக எழுப்பப்பட்டுப் பொன் தகடு வேயப்பட்டுள்ளன; சட்டத்தில் சிவப்பு, பச்சைக் கற்கள் பதிக்கப்பட்டுள்ளன.',
    },
    'Tanjore painting — Krishna radha': {
      title: 'Radha and Krishna',
      detail: 'Tanjore painting',
      ta: 'ராதையும் கண்ணனும் — தஞ்சாவூர் ஓவியம்',
      en: 'Krishna with Radha, his beloved, a favourite subject of devotional painting. Tanjore artists show the divine pair richly dressed and jewelled beneath an arch, their ornaments raised in gesso and gilded so that they shine in the light of the lamp.',
      taText: 'தம் அன்புக்குரிய ராதையுடன் கண்ணன் — பக்தி ஓவியத்தின் விருப்பமான பொருள். தஞ்சாவூர் ஓவியர்கள் இத்தெய்வ இணையை வளைவின் கீழ் செழித்த ஆடைகளுடனும் அணிகலன்களுடனும் காட்டுகின்றனர்; விளக்கொளியில் மின்னும்படி அணிகலன்கள் புடைப்பாக எழுப்பப்பட்டுப் பொன் வேயப்பட்டுள்ளன.',
    },
    'Tanjore painting — Krishna': {
      title: 'Krishna',
      detail: 'Tanjore painting',
      ta: 'கண்ணன் — தஞ்சாவூர் ஓவியம்',
      en: 'Krishna — often shown in Tanjore paintings as the child who steals butter, or as the cowherd with his flute — was among the most loved subjects of the Thanjavur painters under the Maratha kings. His dark skin, gold ornaments and jewelled crown are set off by the bright, flat colours of the background.',
      taText: 'வெண்ணெய் திருடும் குழந்தையாகவோ, குழலூதும் ஆயனாகவோ தஞ்சாவூர் ஓவியங்களில் பெரும்பாலும் காட்டப்படும் கண்ணன், மராட்டிய மன்னர் காலத் தஞ்சை ஓவியர்களின் மிக விருப்பமான பொருள்களுள் ஒருவன். அவனது கருமேனியும் பொன் அணிகலன்களும் மணிமகுடமும், பின்னணியின் ஒளிமிக்க தட்டையான நிறங்களால் எடுப்பாகத் தெரிகின்றன.',
    },
    'Tanjore painting — Venkateshwara': {
      title: 'Venkateswara',
      detail: 'Tanjore painting',
      ta: 'வேங்கடேசப் பெருமாள் — தஞ்சாவூர் ஓவியம்',
      en: 'Venkateswara, Vishnu as the lord of the Tirumala hills, shown standing as in his famous shrine, covered in jewels and garlands. In Tanjore paintings his image is one of the richest in gold and stones, echoing the splendour with which he is adorned at Tirupati.',
      taText: 'திருமலையின் இறைவனான திருமாலின் வடிவான வேங்கடேசப் பெருமாள், அவரது புகழ்பெற்ற சன்னதியில் உள்ளவாறே அணிகலன்களும் மாலைகளும் நிறைந்து நின்ற கோலத்தில். திருப்பதியில் அவர் அலங்கரிக்கப்படும் சிறப்பை எதிரொலிப்பதுபோல, தஞ்சாவூர் ஓவியங்களில் அவரது உருவம் பொன்னும் கற்களும் மிக நிறைந்த ஒன்றாகும்.',
    },
    'Tanjore paintings — Big Temple 1': {
      title: 'Gajalakshmi',
      detail: 'Brihadisvara Temple, Thanjavur · Nayak period',
      ta: 'கஜலட்சுமி — பெரிய கோயில் சுவரோவியம்',
      en: 'A wall painting of Gajalakshmi from the Big Temple: the goddess sits cross-legged on a lotus throne while two richly caparisoned elephants raise pots and lotuses over her head. Heavy painted curtains above and curling green foliage below show the decorative flourish of the Nayak-period murals.',
      taText: 'பெரிய கோயிலின் கஜலட்சுமி சுவரோவியம்: தேவி தாமரை அரியணையில் சம்மணமிட்டு அமர்ந்துள்ளாள்; செழித்த அலங்காரம் பூண்ட இரு யானைகள் அவள் தலைக்கு மேல் குடங்களையும் தாமரைகளையும் உயர்த்துகின்றன. மேலே கனத்த வரையப்பட்ட திரைச்சீலைகளும், கீழே சுருளும் பச்சை இலைக்கொடிகளும் நாயக்கர் காலச் சுவரோவியங்களின் அணி அழகைக் காட்டுகின்றன.',
    },
    'Tripurantaka — Chola mural': {
      title: 'Shiva as Tripurantaka',
      detail: 'Temple mural',
      ta: 'திரிபுராந்தகர் — முப்புரம் எரித்த சிவன்',
      en: 'Shiva as Tripurantaka, destroyer of the three flying cities of the asuras. Many-armed and fierce, bow drawn, he rides a golden chariot driven by four-headed Brahma, its horses leaping towards the fortified cities. The story — sung in the Tevaram, where Shiva is the one who burned the three cities — is the subject of the greatest of the Chola frescoes in the Big Temple at Thanjavur.',
      taText: 'அசுரர்களின் பறக்கும் மூன்று நகரங்களை அழித்த திரிபுராந்தகராகச் சிவன். பல கைகளுடன், சினத்துடன், வில்லை வளைத்து, நான்முகன் தேரோட்டும் பொற்றேரில் செல்கிறார்; குதிரைகள் அரண் சூழ்ந்த நகரங்களை நோக்கிப் பாய்கின்றன. சிவனை “முப்புரம் எரித்தவன்” எனத் தேவாரம் பாடும் இக்கதையே, தஞ்சைப் பெரிய கோயிலின் சோழர் சுவரோவியங்களுள் மிகப் பெரியதன் பொருள்.',
    },
    'Wall paintings — Big Temple, Thanjavur chola mural': {
      title: 'Shiva and Parvati',
      detail: 'Brihadisvara Temple, Thanjavur · Nayak period',
      ta: 'உமாமகேசுவரர் — பெரிய கோயில் சுவரோவியம்',
      en: 'Shiva and Parvati seated together as Umamaheshvara, beneath a flowering branch. Shiva, crescent moon in his hair, holds the deer and raises a hand in blessing; blue-skinned Parvati leans close against him. The tender pairing of the divine couple was a favourite theme of Nayak-period painters.',
      taText: 'பூத்த கிளையின் கீழ், உமாமகேசுவரராகச் சிவனும் பார்வதியும் இணைந்து அமர்ந்துள்ளனர். சடையில் பிறைநிலவு சூடிய சிவன் மானை ஏந்தி, அருள் கையை உயர்த்துகிறார்; நீல மேனியுடைய பார்வதி அவரருகே நெருங்கிச் சாய்ந்துள்ளாள். தெய்வ இணையின் இந்த அன்புக் காட்சி நாயக்கர் கால ஓவியர்களின் விருப்பமான பொருள்.',
    },
  },

  // From the curators' notes in public/Tamil Instruments/tamil instruments.pdf.
  'Tamil Instruments': {
    yazh: {
      title: 'Yazh',
      detail: 'String instrument · Sangam literature',
      ta: 'யாழ்',
      en: 'The yazh is one of the most distinctive instruments of ancient Tamil literature: a plucked string instrument, broadly like an arched harp. Sangam works such as the Perumpanatrupadai, and the Silappatikaram, describe it, and it belongs with the panar, the bards who joined poetry to music. Scholars name several forms — the periyazh, siriyazh, sakota yazh and vil yazh — whose exact construction the texts do not fully reveal, so any yazh seen today is a reconstruction. It is an instrument in its own right, not simply an early veenai.',
      taText: 'பண்டைத் தமிழ் இலக்கியம் கூறும் இசைக்கருவிகளுள் மிகத் தனித்தன்மை வாய்ந்தது யாழ்: வில் வடிவ ஹார்ப்பை ஒத்த, நரம்புகளை மீட்டி இசைக்கும் கருவி. பெரும்பாணாற்றுப்படை போன்ற சங்க நூல்களும் சிலப்பதிகாரமும் இதனை விவரிக்கின்றன; கவிதையையும் இசையையும் இணைத்த பாணர்களுடன் இது தொடர்புடையது. பேரியாழ், சீறியாழ், சகோட யாழ், வில் யாழ் எனப் பல வகைகள் உண்டு; அவற்றின் துல்லியமான அமைப்பை நூல்கள் முழுமையாகக் காட்டாததால், இன்று காணும் யாழ் ஒரு மீளுருவாக்கமே. இது வீணையின் முந்தைய வடிவம் அன்று; தனிக் கருவி.',
    },
    'பறை — Parai': {
      title: 'Parai',
      detail: 'Frame drum',
      ta: 'பறை',
      en: 'The parai is a Tamil frame drum: a circular frame with a stretched membrane, struck with beaters in patterned rhythms. It has long served for announcements, ritual, festivals and funerals, and today’s parai attam joins drumming to dance. Its history also carries the caste hierarchy that marginalised many hereditary players — and in Tamil culture today the parai is played to assert identity, dignity and equality.',
      taText: 'பறை ஒரு தமிழ்ச் சட்டப் பறை: வட்டச் சட்டத்தில் இழுத்துக் கட்டிய தோல், குச்சிகளால் தாள அமைப்புடன் அடிக்கப்படுகிறது. அறிவிப்புகள், சடங்குகள், விழாக்கள், இறப்பு நிகழ்வுகள் எனப் பலவற்றுக்கும் நெடுங்காலமாகப் பயன்பட்டது; இன்றைய பறையாட்டம் இசையையும் ஆடலையும் இணைக்கிறது. மரபுவழிக் கலைஞர்கள் பலரை ஒதுக்கிய சாதிய அடுக்குமுறையின் வரலாறும் இதில் உண்டு — இன்று பறை, அடையாளம், மாண்பு, சமத்துவம் ஆகியவற்றை உரத்துச் சொல்லும் கருவியாகவும் இசைக்கப்படுகிறது.',
    },
    'நாதஸ்வரம் — Nadaswaram': {
      title: 'Nadaswaram',
      detail: 'Double-reed wind instrument',
      ta: 'நாதஸ்வரம்',
      en: 'The nadaswaram is the great double-reed wind instrument of Tamil temple music, sounding at festivals, weddings and processions. A long wooden body with finger holes ends in a flared bell; the reed and bore give its powerful, carrying tone. Demanding breath control and fine intonation, it plays long classical improvisations, ragas and compositions — usually in partnership with the thavil.',
      taText: 'நாதஸ்வரம் தமிழ்க் கோயில் இசையின் பெரும் இரட்டைச் சீவாளித் துளைக்கருவி; திருவிழாக்கள், திருமணங்கள், ஊர்வலங்களில் ஒலிப்பது. விரல் துளைகள் கொண்ட நீண்ட மரக் குழல் அகன்ற அணசுடன் முடிகிறது; சீவாளியும் குழலின் உள்ளமைப்பும் அதன் வலுவான, தொலைதூரம் கேட்கும் ஒலியைத் தருகின்றன. மூச்சுக் கட்டுப்பாடும் சுருதித் துல்லியமும் வேண்டும் இக்கருவி, நீண்ட ஆலாபனைகளையும் இராகங்களையும் இசைக்கிறது — பெரும்பாலும் தவிலுடன் இணைந்து.',
    },
    'தவில் — Thavil': {
      title: 'Thavil',
      detail: 'Double-headed drum',
      ta: 'தவில்',
      en: 'The thavil, closely tied to the Thanjavur region, is a barrel-shaped drum with a head at each end, played with one hand on one head and a short stick on the other. In the nadaswaram ensemble it does far more than keep time: skilled players answer the melody with rhythmic variation and energy, loud enough for outdoor processions and great temple gatherings.',
      taText: 'தஞ்சை வட்டாரத்துடன் நெருங்கிய தொடர்புடைய தவில், இரு முனைகளிலும் தோல் கொண்ட உருளை வடிவப் பறை; ஒரு பக்கம் கையாலும் மறுபக்கம் சிறு குச்சியாலும் வாசிக்கப்படுகிறது. நாதஸ்வரக் குழுவில் இது தாளம் மட்டும் போடுவதில்லை: திறமையான கலைஞர்கள் தாள வேறுபாடுகளாலும் உற்சாகத்தாலும் மெல்லிசைக்கு மறுமொழி தருகின்றனர்; வெளியிட ஊர்வலங்களுக்கும் பெரும் கோயில் கூட்டங்களுக்கும் ஏற்ற உரத்த ஒலி அதற்கு உண்டு.',
    },
    'உடுக்கை — Udukkai': {
      title: 'Udukkai',
      detail: 'Hourglass drum',
      ta: 'உடுக்கை',
      en: 'The udukkai is a small hourglass-shaped drum, its two heads joined by tension cords; squeezing the cords can change the pitch. Held in one hand and struck with the other, it accompanies devotional songs, folk narratives and ritual performances — a reminder of how closely percussion, devotion and oral performance are bound together.',
      taText: 'உடுக்கை, இடை சுருங்கிய மணல் கடிகார வடிவச் சிறு பறை; அதன் இரு தோல் முகங்களும் இழுவைக் கயிறுகளால் இணைக்கப்பட்டுள்ளன; கயிறுகளை இறுக்கினால் சுருதி மாறும். ஒரு கையில் பிடித்து மறுகையால் அடிக்கப்படும் இது, பக்திப் பாடல்கள், நாட்டுப்புறக் கதைப்பாடல்கள், சடங்கு நிகழ்வுகளுக்குத் துணையாகிறது — தாளமும் பக்தியும் வாய்மொழி நிகழ்த்துகையும் எவ்வளவு நெருங்கியவை என்பதை நினைவூட்டுகிறது.',
    },
    'முரசு — Murasu': {
      title: 'Murasu',
      detail: 'Great drum · Sangam literature',
      ta: 'முரசு',
      en: 'The murasu is the great drum of Sangam literature, sounded for kings, for war, for public announcements and ceremonies — its voice was itself a sign of royal authority. Drums called murasu probably differed in size, material and suspension over time, so no modern drum is an exact replica; reconstructions are interpretations of the texts.',
      taText: 'முரசு சங்க இலக்கியத்தின் பெரும் பறை; அரசர்க்காகவும் போருக்காகவும் அறிவிப்புகளுக்கும் விழாக்களுக்கும் முழங்கியது — அதன் ஒலியே அரசாட்சியின் அடையாளமாக விளங்கியது. காலந்தோறும் முரசுகள் அளவிலும் பொருளிலும் தொங்கவிடும் முறையிலும் வேறுபட்டிருக்கலாம்; எனவே இன்றைய எந்த முரசும் துல்லியமான மாதிரி அன்று — நூல்களின் விளக்கமே.',
    },
    'புல்லாங்குழல் — Pullanguzhal': {
      title: 'Pullanguzhal',
      detail: 'Bamboo flute',
      ta: 'புல்லாங்குழல்',
      en: 'The pullanguzhal, the bamboo flute, is blown across an opening while the fingers cover and uncover its holes. In Sangam poetry the flute belongs to mullai, the pastoral landscape of herders and forests; today it is heard in folk, devotional and classical music alike. The poems’ pastoral flute is a literary theme, though — not proof that every ancient flute was the same instrument.',
      taText: 'புல்லாங்குழல் — மூங்கில் குழல் — ஒரு துளையின் குறுக்கே ஊதி, விரல்களால் துளைகளை மூடித் திறந்து இசைக்கப்படுகிறது. சங்கக் கவிதையில் குழல் முல்லைத் திணையின் — ஆயர்களும் காடும் சார்ந்த நிலத்தின் — கருவி; இன்று நாட்டுப்புற, பக்தி, செவ்வியல் இசை எல்லாவற்றிலும் ஒலிக்கிறது. ஆயினும் கவிதையின் ஆயர் குழல் ஓர் இலக்கியக் கருப்பொருளே; பழங்காலக் குழல்கள் எல்லாம் ஒரே கருவி என்பதற்குச் சான்று அன்று.',
    },
    'வீணை — Veenai': {
      title: 'Veenai',
      detail: 'Plucked string instrument',
      ta: 'வீணை',
      en: 'The veenai (Saraswati veena) is one of the principal string instruments of South Indian classical music: a large wooden resonator, a long fretted neck, strings and tuning pegs, often with a second resonator. Pressing and sliding the strings against the frets gives Carnatic music its fine ornaments. Associated with Saraswati, goddess of learning, it should be distinguished from the ancient yazh — similar in role, but not its direct descendant.',
      taText: 'வீணை (சரசுவதி வீணை) தென்னிந்தியச் செவ்வியல் இசையின் முதன்மை நரம்புக்கருவிகளுள் ஒன்று: பெரிய மரக் குடம், மெட்டுகள் கொண்ட நீண்ட தண்டு, நரம்புகள், முறுக்காணிகள்; பல வீணைகளில் இரண்டாம் சுரைக்குடமும் உண்டு. நரம்புகளை மெட்டுகளில் அழுத்தி இழுத்து வாசிப்பதால் கர்நாடக இசையின் நுண்ணிய கமகங்கள் பிறக்கின்றன. கலைமகளுடன் தொடர்புடைய வீணையைப் பழைய யாழிலிருந்து வேறுபடுத்திக் காண வேண்டும் — பணியில் ஒத்தவை, ஆனால் நேரடி வழித்தோன்றல் அன்று.',
    },
    'பம்பை — Pambai': {
      title: 'Pambai',
      detail: 'Paired drums',
      ta: 'பம்பை',
      en: 'The pambai is a pair of drums played together, their contrasting low and high voices driving folk performances, processions and village festivals across Tamil Nadu. Its living tradition is better documented than its origins, and its repertoire changes from region to region and community to community.',
      taText: 'பம்பை என்பது சேர்த்து வாசிக்கப்படும் இரட்டைப் பறைகள்; அவற்றின் தாழ்ந்த, உயர்ந்த ஒலிகள் தமிழகமெங்கும் நாட்டுப்புற நிகழ்ச்சிகளையும் ஊர்வலங்களையும் ஊர்த் திருவிழாக்களையும் உந்திச் செல்கின்றன. இதன் தோற்றத்தைவிட இன்றைய வாழும் மரபே நன்கு ஆவணப்படுத்தப்பட்டுள்ளது; வட்டாரத்துக்கு வட்டாரம், சமூகத்துக்குச் சமூகம் இதன் இசை மாறுகிறது.',
    },
    'தாளம் — Thalam': {
      title: 'Thalam',
      detail: 'Hand cymbals',
      ta: 'தாளம்',
      en: 'Thalam here means a pair of small brass cymbals, struck together to keep the beat for bhajans, devotional songs and folk ensembles. The same word, talam, also names the rhythmic cycles of South Indian music — kept in classical concerts by a whole system of hand gestures and counting, far more than the striking of cymbals.',
      taText: 'இங்குத் தாளம் என்பது சேர்த்து அடிக்கப்படும் இரு சிறிய பித்தளைக் கைத்தாளங்கள்; பஜனைகள், பக்திப் பாடல்கள், நாட்டுப்புறக் குழுக்கள் ஆகியவற்றுக்குத் தாளம் போடுகின்றன. அதே சொல் தென்னிந்திய இசையின் தாளச் சுழற்சிகளையும் குறிக்கிறது — செவ்வியல் இசையில் கை அசைவுகளும் எண்ணிக்கையும் கொண்ட ஒரு முழு முறையாகப் பேணப்படுவது; வெறும் கைத்தாள அடி அன்று.',
    },
  },

  // The Maritime Trade & Ports room: port architecture and trade finds. Captions describe what each photograph shows.
  'Maritime trade n ports': {
    '3 foot high grain storage, korkai': {
      title: 'Sorting the Finds at Korkai',
      detail: 'Korkai excavation · Thoothukudi district',
      ta: 'கொற்கை அகழாய்வுப் பொருட்களை வகைப்படுத்துதல்',
      en: 'Potsherds from the Korkai excavations laid out on sheets for sorting. Each fragment is washed, counted and grouped by fabric, shape and decoration; among Korkai’s sherds are pieces inscribed in Tamil-Brahmi. Patient work like this turns broken pottery into a record of when a port was busy and whom it traded with.',
      taText: 'கொற்கை அகழாய்வில் கிடைத்த மட்கல ஓடுகள், வகைப்படுத்துவதற்காகத் தாள்களில் பரப்பப்பட்டுள்ளன. ஒவ்வோர் ஓடும் கழுவப்பட்டு, எண்ணப்பட்டு, மண்வகை, வடிவம், அணி வேலை ஆகியவற்றைக் கொண்டு பிரிக்கப்படுகிறது; கொற்கையின் ஓடுகளுள் தமிழ்-பிராமி பொறித்தவையும் உண்டு. இத்தகைய பொறுமையான பணியே உடைந்த மட்கலங்களை, ஒரு துறைமுகம் எப்போது செழித்தது, யாருடன் வணிகம் செய்தது என்பதற்கான பதிவாக மாற்றுகிறது.',
    },
    '4 layer terracotta pipes in korkai excavation': {
      title: 'Terracotta Pipeline',
      detail: 'Korkai excavation · Port architecture',
      ta: 'சுடுமண் குழாய் — கொற்கை',
      en: 'A pipeline of terracotta rings, set one above another in four tiers, exposed in the Korkai excavation. Fired-clay pipes and ring wells like this carried and drained water in the towns of the early historic Tamil country — part of the everyday engineering of a busy port.',
      taText: 'கொற்கை அகழாய்வில் வெளிப்பட்ட, நான்கு அடுக்குகளாக ஒன்றன்மேல் ஒன்று அமைக்கப்பட்ட சுடுமண் உறைகளாலான குழாய். இத்தகைய சுடுமண் குழாய்களும் உறைகிணறுகளும் தொடக்க வரலாற்றுக் காலத் தமிழ் நகரங்களில் நீரைக் கொண்டு செல்லவும் வடிக்கவும் பயன்பட்டன — ஒரு பரபரப்பான துறைமுகத்தின் அன்றாடப் பொறியியலின் பகுதி.',
    },
    "Artifacts reveal Korkai's trade links with Egypt": {
      title: 'Lifting a Great Jar',
      detail: 'Korkai excavation',
      ta: 'பெரிய தாழியைத் தூக்குதல் — கொற்கை',
      en: 'Excavators carefully lift a large earthenware jar from its trench at Korkai, the Pandya port of the pearl fisheries. Big jars stored grain, water and goods; whether a vessel was made locally or came from across the sea is settled by study of its clay, not by its look alone.',
      taText: 'முத்துக்குளிப்பின் பாண்டியர் துறைமுகமான கொற்கையில், ஒரு பெரிய மண் தாழியை அகழாய்வாளர்கள் குழியிலிருந்து கவனமாகத் தூக்குகின்றனர். பெரிய தாழிகள் தானியம், நீர், பொருட்களைச் சேமித்தன; ஒரு கலம் உள்ளூரில் செய்யப்பட்டதா, கடல் கடந்து வந்ததா என்பது அதன் தோற்றத்தால் அன்று, அதன் மண்ணை ஆய்வதாலேயே உறுதியாகிறது.',
    },
    'A guide to poompuhar': {
      title: 'The Coast at Poompuhar',
      detail: 'Kaveri estuary · Today',
      ta: 'இன்றைய பூம்புகார்க் கடற்கரை',
      en: 'The shore at Poompuhar today, near the mouth of the Kaveri, where the early Chola port of Puhar once stood. Underwater surveys have found masonry off this coast; how far the ancient city reached, and how the shoreline changed, are still being studied.',
      taText: 'காவிரி கடலில் கலக்கும் இடத்தருகே, தொடக்ககாலச் சோழர்களின் துறைமுகமான புகார் இருந்த இன்றைய பூம்புகார்க் கடற்கரை. இக்கடற்கரைக்கு அப்பால் கடலடியில் கட்டுமான எச்சங்கள் கண்டறியப்பட்டுள்ளன; பழைய நகரம் எவ்வளவு பரந்திருந்தது, கடற்கரை எவ்வாறு மாறியது என்பவை இன்னும் ஆய்வில் உள்ளன.',
    },
    'Kaveripoompattinam, poompuhar': {
      title: 'Brick Structures at Kaveripoompattinam',
      detail: 'Poompuhar excavation · Port architecture',
      ta: 'காவிரிப்பூம்பட்டினத்தின் செங்கல் கட்டமைப்புகள்',
      en: 'Excavated brick structures at Kaveripoompattinam. Courses of fired brick like these — wharves, platforms, tanks and walls — are what remains of the port city the Pattinappalai describes, with its warehouses, markets and quays.',
      taText: 'காவிரிப்பூம்பட்டினத்தில் அகழ்ந்தெடுக்கப்பட்ட செங்கல் கட்டமைப்புகள். இத்தகைய சுட்ட செங்கல் அடுக்குகள் — துறைகள், மேடைகள், குளங்கள், சுவர்கள் — பட்டினப்பாலை பாடும், பண்டகசாலைகளும் அங்காடிகளும் துறைகளும் நிறைந்த துறைமுக நகரத்தின் எச்சங்கள்.',
    },
    "Arikamedu, puducherry's roman relic": {
      title: 'Amphorae — Mediterranean Transport Jars',
      detail: 'Of the kind found at Arikamedu',
      ta: 'ஆம்போரா — மத்தியதரைக் கடல் சரக்குச் சாடிகள்',
      en: 'Tall two-handled amphorae, the shipping containers of the Roman world, made to carry wine, olive oil and fish sauce by sea. Fragments of such jars at Arikamedu, Alagankulam and Karur are among the clearest evidence of Mediterranean goods reaching the Tamil coast.',
      taText: 'உரோமானிய உலகின் கடல்வழிச் சரக்குக் கொள்கலன்களான இரு கைப்பிடிகள் கொண்ட உயர்ந்த ஆம்போரா சாடிகள்; மது, ஒலிவ எண்ணெய், மீன் சாறு ஆகியவற்றைக் கடல் வழியே கொண்டு செல்லச் செய்யப்பட்டவை. அரிக்கமேடு, அழகன்குளம், கரூர் ஆகிய இடங்களில் கிடைத்த இத்தகைய சாடிகளின் துண்டுகள், மத்தியதரைக் கடல் பொருட்கள் தமிழ்க் கடற்கரையை அடைந்தமைக்கான தெளிவான சான்றுகளுள் அடங்கும்.',
    },
    ariyankuppam: {
      title: 'Rouletted Ware from Arikamedu',
      detail: 'Ariyankuppam, Puducherry · Archaeological Survey of India',
      ta: 'உருளை வரி மட்கலங்கள் — அரிக்கமேடு',
      en: 'Sherds of rouletted ware from Arikamedu, near Ariyankuppam, shown by the Archaeological Survey of India. This fine grey-black pottery, with bands of tiny notches pressed in by a toothed wheel, is found at many early historic sites around the Bay of Bengal; where it was made is still being worked out.',
      taText: 'அரியாங்குப்பம் அருகிலுள்ள அரிக்கமேட்டின் உருளை வரி மட்கல ஓடுகள், இந்தியத் தொல்லியல் துறையின் காட்சிப்படுத்தலில். பல் சக்கரத்தால் அழுத்தப்பட்ட நுண்ணிய வெட்டுப் பட்டைகள் கொண்ட இந்த மெல்லிய சாம்பல்-கருப்பு மட்கலம், வங்கக் கடலைச் சுற்றியுள்ள பல தொடக்க வரலாற்றுக் களங்களில் கிடைக்கிறது; அது எங்கு செய்யப்பட்டது என்பது இன்னும் ஆய்வில் உள்ளது.',
    },
    "The dating of arikamedu and it's bearing on archaeology of early historical tof south india": {
      title: 'Dating Arikamedu',
      detail: 'After Vimala Begley (1983)',
      ta: 'அரிக்கமேட்டின் காலக்கணிப்பு',
      en: 'A sherd illustrated in Vimala Begley’s 1983 study of Arikamedu’s dating. Re-examining the excavated layers, Begley argued that the settlement began around the mid-third century BCE — earlier than Mortimer Wheeler had proposed — with Mediterranean contacts by the late second century BCE. Her dates remain a scholarly interpretation.',
      taText: 'அரிக்கமேட்டின் காலம் பற்றிய விமலா பெக்லியின் 1983 ஆய்வில் இடம்பெற்ற ஓர் ஓடு. அகழ்ந்த அடுக்குகளை மீண்டும் ஆய்ந்த பெக்லி, இக்குடியிருப்பு மார்ட்டிமர் வீலர் கூறியதைவிட முன்னதாக, ஏறத்தாழ கி.மு. 3-ஆம் நூற்றாண்டின் நடுப்பகுதியில் தொடங்கியது என்றும், கி.மு. 2-ஆம் நூற்றாண்டின் இறுதிக்குள் மத்தியதரைக் கடல் தொடர்புகள் ஏற்பட்டன என்றும் வாதிட்டார். இவை ஆய்வாளரின் விளக்கமே.',
    },
  },

  /*
   * The Maritime Trade & Ports room's Adichanallur section: stills and two film excerpts from the
   * documentary on Adichanallur in the museum's collection (public/Maritime trade n ports/
   * Adhichanallur part2.mp4), the subtitle band cropped away. A clip shares its poster's name.
   */
  'Maritime trade n ports/Adichanallur': {
    'Excavating the urn burials (film) — Adichanallur': {
      title: 'Excavating the urn burials',
      detail: 'Adichanallur · film excerpt',
      ta: 'முதுமக்கள் தாழிகளை அகழ்ந்தெடுத்தல் — ஆதிச்சநல்லூர்',
      en: 'Archaeologists at work in the burial ground of Adichanallur: clearing the gravelly soil around great urns, lifting out the small pots and bowls laid inside them, and recording each find where it lies. The urns were buried close together across the low mound beside the Thamirabarani, sometimes several to a single burial. An excerpt from the documentary film on Adichanallur in the museum’s collection.',
      taText: 'ஆதிச்சநல்லூர் புதைவிடத்தில் அகழாய்வாளர்கள்: பெரிய தாழிகளைச் சுற்றியுள்ள சரளை மண்ணை அகற்றுதல், அவற்றுள் வைக்கப்பட்ட சிறு கலயங்களையும் கிண்ணங்களையும் வெளியே எடுத்தல், ஒவ்வொரு பொருளையும் கிடந்த இடத்திலேயே பதிவு செய்தல். தாமிரபரணிக் கரையோரத் தாழ்வான மேட்டில் தாழிகள் நெருக்கமாகப் புதைக்கப்பட்டன; சில இடங்களில் ஒரே புதைவில் பல தாழிகள். காட்சியகத் தொகுப்பில் உள்ள ஆதிச்சநல்லூர் ஆவணப்படத்தின் ஒரு பகுதி.',
    },
    'Grave goods inside a burial urn — Adichanallur': {
      detail: 'Adichanallur · from the film',
      ta: 'தாழிக்குள் ஈமப் பொருட்கள் — ஆதிச்சநல்லூர்',
      en: 'An excavator lifts a small pot from inside a great burial urn. Pots, bowls and lids were placed in and around the urns with the dead, perhaps holding food, water or offerings — a sign that the people of Adichanallur imagined a journey beyond death. In the film an elder explains that the dead were given things to help them on their way: “that is the meaning of the urn”.',
      taText: 'பெரிய முதுமக்கள் தாழி ஒன்றினுள்ளிருந்து சிறு கலயத்தை அகழாய்வாளர் வெளியே எடுக்கிறார். இறந்தவர்களுடன் கலயங்கள், கிண்ணங்கள், மூடிகள் தாழியின் உள்ளேயும் சுற்றிலும் வைக்கப்பட்டன; அவற்றில் உணவோ நீரோ படையலோ இருந்திருக்கலாம் — மரணத்திற்கு அப்பாலான பயணத்தை ஆதிச்சநல்லூர் மக்கள் நம்பியதன் அடையாளம். இறந்தவரின் பயணத்திற்கு உதவும் பொருட்களும் உடன் வைக்கப்பட்டன; “அதுவே தாழியின் பொருள்” என்று ஆவணப்படத்தில் ஒரு பெரியவர் விளக்குகிறார்.',
    },
    'Unearthing a three-foot burial urn — Adichanallur': {
      detail: 'Adichanallur · from the film',
      ta: 'மூன்றடி உயரத் தாழியை அகழ்ந்தெடுத்தல் — ஆதிச்சநல்லூர்',
      en: 'An archaeologist cleans the shoulder of a great urn in the red soil of the burial mound. The excavators of 2004 recovered urns about three feet — nearly a metre — high, large enough to receive the remains of the dead. Vessels of this size called for real skill: a Sangam poet addresses the urn-maker as கலம்செய் கோவே, “O king among potters”.',
      taText: 'புதைமேட்டின் செம்மண்ணில் ஒரு பெரிய தாழியின் தோள்பகுதியை அகழாய்வாளர் சுத்தம் செய்கிறார். 2004 அகழாய்வில் ஏறத்தாழ மூன்றடி — கிட்டத்தட்ட ஒரு மீட்டர் — உயரமுள்ள தாழிகள் கிடைத்தன; இறந்தவர்களின் உடலைத் தாங்கும் அளவுக்குப் பெரியவை. இத்தகைய பெருங்கலங்களைச் செய்யப் பெரும் திறன் வேண்டும்; அதனால்தான் சங்கப் புலவர் தாழி செய்பவரை “கலம்செய் கோவே” என்று விளிக்கிறார்.',
    },
    'Paddy husk inside a burial urn — Adichanallur': {
      detail: 'Adichanallur · from the film',
      ta: 'தாழிக்குள் நெல் உமி — ஆதிச்சநல்லூர்',
      en: 'Husks of paddy found inside an Adichanallur urn. Rice, it seems, was placed with the dead — evidence both of funeral ritual and of rice growing in the Thamirabarani valley in the Iron Age. Grains and husks like these are also what laboratories date by radiocarbon, giving the burials their age.',
      taText: 'ஆதிச்சநல்லூர் தாழி ஒன்றினுள் கிடைத்த நெல் உமி. இறந்தவர்களுடன் நெல்லும் வைக்கப்பட்டது எனத் தெரிகிறது — இது ஈமச் சடங்கிற்கும், இரும்புக் காலத்திலேயே தாமிரபரணிப் பள்ளத்தாக்கில் நெல் பயிரிடப்பட்டதற்கும் சான்று. இத்தகைய நெல்மணிகளும் உமியுமே கதிரியக்கக் கரிமக் காலக்கணிப்புக்கு உட்படுத்தப்பட்டு, புதைவுகளின் காலத்தைக் காட்டுகின்றன.',
    },
    'Mother-goddess figure on an urn — Adichanallur': {
      detail: 'Adichanallur · from the film',
      ta: 'தாழியில் தாய்த் தெய்வ உருவம் — ஆதிச்சநல்லூர்',
      en: 'A sherd of an urn found in 2004, decorated in applied relief with a standing female figure among motifs commonly read as paddy stalks, a deer, a crane and a crocodile. Scholars have seen in her an early mother goddess — some, as the film says, a forerunner of Kotravai, the war goddess of Sangam poetry. It is one of the rare figurative images of Iron Age Tamil Nadu.',
      taText: '2004 அகழாய்வில் கிடைத்த தாழி ஓடு. அதில் புடைப்பு உருவமாக நிற்கும் பெண் உருவமும், அதைச் சுற்றி நெற்கதிர், மான், கொக்கு, முதலை என அடையாளம் காணப்படும் உருவங்களும் உள்ளன. அறிஞர்கள் இதைத் தொடக்ககாலத் தாய்த் தெய்வமாகக் காண்கின்றனர்; சிலர், ஆவணப்படம் சொல்வதுபோல், சங்க இலக்கியத்தின் போர்த் தெய்வமான கொற்றவையின் முன்வடிவமாகக் கருதுகின்றனர். இரும்புக் காலத் தமிழகத்தின் அரிய உருவச் சான்றுகளில் இதுவும் ஒன்று.',
    },
    'Iron swords and spearheads — Adichanallur': {
      detail: 'Adichanallur · from the film',
      ta: 'இரும்பு வாள்களும் ஈட்டி முனைகளும் — ஆதிச்சநல்லூர்',
      en: 'Corroded iron swords, daggers and spearheads from the burials. Iron weapons and tools — axes, knives, sickles, tridents — were laid in the urns in great numbers, making Adichanallur one of the richest Iron Age sites in India. They show a society that smelted and forged iron with confidence, and honoured its dead with the tools of their lives.',
      taText: 'புதைவுகளில் கிடைத்த துருப்பிடித்த இரும்பு வாள்கள், குத்துவாள்கள், ஈட்டி முனைகள். கோடரிகள், கத்திகள், அரிவாள்கள், சூலங்கள் என இரும்புக் கருவிகளும் ஆயுதங்களும் தாழிகளில் பெருமளவில் வைக்கப்பட்டன; அதனால் ஆதிச்சநல்லூர் இந்தியாவின் வளமான இரும்புக் காலத் தலங்களில் ஒன்றாகத் திகழ்கிறது. இரும்பை உருக்கி வார்த்த ஒரு சமூகத்தையும், இறந்தவர்களை அவர்கள் வாழ்வின் கருவிகளோடு போற்றிய மரபையும் இவை காட்டுகின்றன.',
    },
    'Iron knife and blade — Adichanallur': {
      detail: 'Adichanallur · from the film',
      ta: 'இரும்புக் கத்தியும் அலகும் — ஆதிச்சநல்லூர்',
      en: 'An iron blade and a knife, measured against a scale. Studies discussed in the film suggest that Adichanallur’s smiths worked high-carbon iron and hardened it by quenching — plunging the hot metal into oil — a sign of skilled and deliberate metallurgy.',
      taText: 'அளவுகோலுடன் வைக்கப்பட்ட இரும்பு அலகும் கத்தியும். ஆதிச்சநல்லூர்க் கொல்லர்கள் உயர் கரிம இரும்பைப் பயன்படுத்தி, சூடான உலோகத்தை எண்ணெயில் அமிழ்த்திக் கடினப்படுத்தினர் என ஆவணப்படத்தில் இடம்பெறும் ஆய்வுகள் கூறுகின்றன — இது திட்டமிட்ட, திறன்மிக்க உலோகவியலின் அடையாளம்.',
    },
    'Iron and the urn trenches (film) — Adichanallur': {
      title: 'Iron and the urn trenches',
      detail: 'Adichanallur · film excerpt',
      ta: 'இரும்பும் தாழி அகழிகளும் — ஆதிச்சநல்லூர்',
      en: 'From the documentary: an iron bangle and blade from Adichanallur, and the trenches where urns were found side by side. Burials lying next to each other could be centuries apart in age, so the burial ground was in use over a long span of time. An excerpt from the documentary film on Adichanallur in the museum’s collection, with English subtitles.',
      taText: 'ஆவணப்படத்திலிருந்து: ஆதிச்சநல்லூரின் இரும்பு வளையலும் அலகும், தாழிகள் அருகருகே கிடைத்த அகழிகளும். அடுத்தடுத்துப் புதைக்கப்பட்ட தாழிகளுக்கிடையே நூற்றாண்டுகள் இடைவெளி இருக்கலாம்; எனவே இப்புதைவிடம் நெடுங்காலம் பயன்பட்டது. காட்சியகத் தொகுப்பில் உள்ள ஆதிச்சநல்லூர் ஆவணப்படத்தின் ஒரு பகுதி; ஆங்கில வசனங்களுடன்.',
    },
    'Burial urn in the trench — Sivakalai': {
      detail: 'Sivakalai, near Adichanallur · from the film',
      ta: 'அகழியில் முதுமக்கள் தாழி — சிவகளை',
      en: 'An urn exposed in a trench at Sivakalai, about seven kilometres from Adichanallur along the Thamirabarani. Excavated by the Tamil Nadu State Department of Archaeology from 2019, Sivakalai has yielded urns holding paddy and iron objects, and a habitation area nearby; the department has reported radiocarbon dates for its paddy reaching back to the twelfth century BCE. Together the two sites reveal a busy Iron Age landscape along the river.',
      taText: 'தாமிரபரணிக் கரையில், ஆதிச்சநல்லூரிலிருந்து ஏறத்தாழ ஏழு கிலோமீட்டர் தொலைவில் உள்ள சிவகளையில் அகழியில் வெளிப்பட்ட தாழி. 2019 முதல் தமிழ்நாடு அரசுத் தொல்லியல் துறை அகழ்ந்த சிவகளையில் நெல்லும் இரும்புப் பொருட்களும் கொண்ட தாழிகளும், அருகே வாழ்விடப் பகுதியும் கிடைத்தன; இங்குக் கிடைத்த நெல்லுக்குக் கி.மு. பன்னிரண்டாம் நூற்றாண்டு வரை செல்லும் கதிரியக்கக் கரிமக் காலக்கணிப்பை அத்துறை அறிவித்துள்ளது. இரு தலங்களும் சேர்ந்து, ஆற்றங்கரையில் மக்கள் நிறைந்து வாழ்ந்த இரும்புக் கால நிலப்பரப்பைக் காட்டுகின்றன.',
    },
    'Copper bangles from the habitation site — Adichanallur': {
      detail: 'Adichanallur habitation site · from the film',
      ta: 'வாழ்விடப் பகுதியின் செப்பு வளையல்கள் — ஆதிச்சநல்லூர்',
      en: 'Copper bangles from the habitation site of Adichanallur, where people lived near their burial ground. Excavators there also found a potter’s kiln, copper rods, and beads of jasper, quartz and carnelian. Etched carnelian beads, made of a stone found far to the north, point to exchange well beyond the valley.',
      taText: 'ஆதிச்சநல்லூரில் மக்கள் தம் புதைவிடத்தின் அருகே வாழ்ந்த வாழ்விடப் பகுதியில் கிடைத்த செப்பு வளையல்கள். அங்கே குயவர் சூளை, செப்புக் கம்பிகள், சூரியகாந்தக் கல், படிகம், சூதுபவளம் ஆகியவற்றின் மணிகளும் கிடைத்தன. வடக்கே தொலைவில் கிடைக்கும் கல்லால் ஆன பொறிப்புச் சூதுபவள மணிகள், இப்பள்ளத்தாக்கு வெளியுலகத்துடன் கொண்டிருந்த பரிமாற்றத்தைக் காட்டுகின்றன.',
    },
    'Excavation trenches in the coconut grove — Adichanallur': {
      detail: 'Adichanallur · from the film',
      ta: 'தென்னந்தோப்பில் அகழாய்வுக் குழிகள் — ஆதிச்சநல்லூர்',
      en: 'Excavation in progress among coconut palms at Adichanallur. The site has been dug again and again since the nineteenth century: by Fedor Jagor in 1876, whose finds went to Berlin; by Alexander Rea of the Archaeological Survey of India between 1899 and 1905; by the French scholar Louis Lapicque; by the Survey again in 2004–05; and in recent seasons by the Tamil Nadu State Department of Archaeology and the Survey. Each campaign has added to the picture of the ancient Thamirabarani valley.',
      taText: 'ஆதிச்சநல்லூரில் தென்னை மரங்களுக்கிடையே நடைபெறும் அகழாய்வு. பத்தொன்பதாம் நூற்றாண்டு முதல் இத்தலம் மீண்டும் மீண்டும் அகழப்பட்டுள்ளது: 1876-இல் ஜாகர் (அவர் கண்டெடுத்தவை பெர்லினுக்குச் சென்றன); 1899–1905-இல் இந்தியத் தொல்லியல் துறையின் அலெக்சாண்டர் ரீ; பிரெஞ்சு அறிஞர் லூயி லாபிக்; 2004–05-இல் மீண்டும் இந்தியத் தொல்லியல் துறை; அண்மைக் காலங்களில் தமிழ்நாடு அரசுத் தொல்லியல் துறையும் இந்தியத் தொல்லியல் துறையும். ஒவ்வொரு அகழாய்வும் பண்டைத் தாமிரபரணிப் பள்ளத்தாக்கின் சித்திரத்தை மேலும் தெளிவாக்கியுள்ளது.',
    },
    'The Thamirabarani beside the burial ground — Adichanallur': {
      detail: 'Adichanallur · from the film',
      ta: 'புதைவிடத்தின் அருகே தாமிரபரணி — ஆதிச்சநல்லூர்',
      en: 'The Thamirabarani — known in Tamil as the Porunai — flows past the burial mound on its way to the Gulf of Mannar. Downstream lay Korkai, the Pandya port famed for its pearls; as the film notes, the people of this valley could reach the sea, and the routes beyond it, by way of the river. The river gave the valley fertile fields, water and a road to the coast.',
      taText: 'பொருநை என்றும் அழைக்கப்படும் தாமிரபரணி, மன்னார் வளைகுடாவை நோக்கிச் செல்லும் வழியில் புதைமேட்டை ஒட்டி ஓடுகிறது. ஆற்றின் கீழ்ப்பகுதியில் முத்துக்குப் புகழ்பெற்ற பாண்டியரின் துறைமுகமான கொற்கை இருந்தது; ஆவணப்படம் குறிப்பிடுவதுபோல், இப்பள்ளத்தாக்கு மக்கள் ஆற்றின் வழியே கடலையும் அதற்கு அப்பாலான வழிகளையும் அடைய முடிந்தது. வளமான வயல்களையும் நீரையும் கடற்கரைக்கான வழியையும் ஆறு வழங்கியது.',
    },
  },

  /*
   * The Irrigation room's Kallanai section: stills and two film excerpts from the documentary on
   * Kallanai produced by the Central Institute of Classical Tamil (public/Irrigation/Ancient tamil
   * irrigation/kallanai.mp4), the subtitle band cropped away. A clip shares its poster's name.
   */
  'Irrigation/Kallanai': {
    'How Kallanai was built (film) — reconstruction': {
      title: 'How Kallanai was built',
      detail: 'Animated reconstruction · film excerpt',
      ta: 'கல்லணை கட்டப்பட்ட விதம்',
      en: 'An animated reconstruction of the ancient method, from the documentary on Kallanai produced by the Central Institute of Classical Tamil. Huge boulders were hauled to the river by teams of workers and elephants and dropped into the riverbed. As the current scoured away the sand beneath them they sank, and more stones were piled on top until the heap rested on firm ground. Clay and the silt of the floods then filled the gaps, binding the rocks into a natural, watertight barrier.',
      taText: 'செம்மொழித் தமிழாய்வு மத்திய நிறுவனம் தயாரித்த கல்லணை ஆவணப்படத்திலிருந்து, பண்டைய கட்டுமான முறையின் அசைவூட்டு மீளுருவாக்கம். பெரும் பாறைகள் தொழிலாளர் குழுக்களாலும் யானைகளாலும் இழுத்து வரப்பட்டு ஆற்றுப்படுகையில் இடப்பட்டன. அவற்றின் அடியிலிருந்த மணலை நீரோட்டம் அரித்துச் செல்லச் செல்ல அவை கீழே அமிழ்ந்தன; உறுதியான தரையைத் தொடும்வரை அவற்றின் மேல் மேலும் கற்கள் அடுக்கப்பட்டன. பின்னர் களிமண்ணும் வெள்ளம் கொண்டுவந்த வண்டலும் இடைவெளிகளை நிரப்பி, பாறைகளை ஒன்றிணைத்து, நீர் கசியாத இயற்கைத் தடுப்பாக்கின.',
    },
    'Elephants hauling boulders to the riverbed — reconstruction': {
      detail: 'Animated reconstruction · from the film',
      ta: 'யானைகள் பாறைகளை ஆற்றுக்கு இழுத்தல் — மீளுருவாக்கம்',
      en: 'Teams of workers and elephants drag great boulders towards the Kaveri in this reconstruction from the film. No mortar was used at Kallanai: the dam’s strength lay in the size and weight of its unhewn stones. Moving them by muscle alone was a feat of organisation, and Tamil tradition credits it to the will of the Chola king Karikalan.',
      taText: 'இந்த ஆவணப்பட மீளுருவாக்கத்தில், தொழிலாளர் குழுக்களும் யானைகளும் பெரும் பாறைகளைக் காவிரியை நோக்கி இழுக்கின்றன. கல்லணையில் சுண்ணச் சாந்து பயன்படவில்லை; செதுக்கப்படாத கற்களின் பருமனும் எடையுமே அணையின் வலிமை. மனித, விலங்கு வலிமையால் மட்டுமே அவற்றை நகர்த்தியது பெரும் ஒருங்கிணைப்புச் சாதனை; தமிழ் மரபு இதைச் சோழ மன்னன் கரிகாலனின் ஆணைக்கு உரியதாகக் கூறுகிறது.',
    },
    'Boulders heaped on the riverbed — reconstruction': {
      detail: 'Animated reconstruction · from the film',
      ta: 'ஆற்றுப்படுகையில் அடுக்கப்பட்ட பாறைகள் — மீளுருவாக்கம்',
      en: 'Boulders settle into the sandy bed of the Kaveri and are heaped one upon another. A river’s sand never stays still — stand at the water’s edge and the current pulls it from under your feet — so the builders let the stones sink until they found firm footing, then raised the barrier on top of them. Borehole studies at the dam, shown in the film, have traced the layers of sand, stone and weathered rock beneath it.',
      taText: 'காவிரியின் மணல் படுகையில் பாறைகள் அமிழ்ந்து, ஒன்றின் மேல் ஒன்றாக அடுக்கப்படுகின்றன. ஆற்று மணல் ஓயாமல் நகரும் — நீர்க்கரையில் நின்றால் காலடியிலிருந்து மணலை நீரோட்டம் இழுத்துச் செல்லும் — ஆகவே கட்டுநர்கள் கற்களை உறுதியான அடித்தளம் கிடைக்கும்வரை அமிழவிட்டு, அவற்றின் மேல் தடுப்பை உயர்த்தினர். அணையில் மேற்கொள்ளப்பட்ட துளையாய்வுகள், அதன் அடியில் உள்ள மணல், கல், சிதைந்த பாறை அடுக்குகளைக் கண்டறிந்துள்ளன என ஆவணப்படம் காட்டுகிறது.',
    },
    'Clay and silt binding the boulders — reconstruction': {
      detail: 'Animated reconstruction · from the film',
      ta: 'பாறைகளை இணைக்கும் களிமண்ணும் வண்டலும் — மீளுருவாக்கம்',
      en: 'The secret of Kallanai’s endurance: clay and the fine silt carried by floods worked into the spaces between the stones and sealed them. The river helped to build its own dam, and every flood that left fresh silt renewed the seal. By tradition this stone-and-clay barrier has stood in a living river for close to two thousand years.',
      taText: 'கல்லணையின் நீடித்த வலிமையின் இரகசியம்: களிமண்ணும் வெள்ளம் கொண்டுவந்த நுண்ணிய வண்டலும் கற்களுக்கிடையிலான இடைவெளிகளில் படிந்து அவற்றை இறுக்கி அடைத்தன. ஆறே தன் அணையைக் கட்ட உதவியது; புதிய வண்டலைப் படியவைக்கும் ஒவ்வொரு வெள்ளமும் அந்த அடைப்பைப் புதுப்பித்தது. மரபின்படி ஏறத்தாழ இரண்டாயிரம் ஆண்டுகளாக, ஓடும் ஆற்றில் இந்தக் கல்-களிமண் தடுப்பு நிலைத்து நிற்கிறது.',
    },
    'The Grand Anicut across the Kaveri — Kallanai': {
      detail: 'Kallanai · from the film',
      ta: 'காவிரியின் குறுக்கே கல்லணை',
      en: 'Kallanai stands across the Kaveri about fifteen kilometres from Tiruchirappalli, east of Srirangam island, where the river begins to divide for the delta. It is not a storage dam but an anicut: a weir that holds back the river just enough to turn its water into the channels. The ancient core is a low wall of unhewn stone some 330 metres long; the arched bridge and vents seen today were built over it in the nineteenth and twentieth centuries.',
      taText: 'திருச்சிராப்பள்ளியிலிருந்து ஏறத்தாழ பதினைந்து கிலோமீட்டர் தொலைவில், ஸ்ரீரங்கம் தீவுக்குக் கிழக்கே, காவிரி கழிமுகத்திற்காகப் பிரியத் தொடங்கும் இடத்தில் கல்லணை நிற்கிறது. இது நீரைத் தேக்கும் அணை அல்ல; ஆற்றைத் தேவையான அளவுக்கு மட்டும் தடுத்து, அதன் நீரைக் கால்வாய்களுக்குத் திருப்பும் அணைக்கட்டு. அதன் பழமையான மையப்பகுதி, ஏறத்தாழ 330 மீட்டர் நீளமுள்ள, செதுக்கப்படாத கற்களாலான தாழ்வான சுவர்; இன்று காணும் வளைவுப் பாலமும் மதகுகளும் பத்தொன்பது, இருபதாம் நூற்றாண்டுகளில் அதன் மேல் கட்டப்பட்டவை.',
    },
    'The arches of the Grand Anicut — Kallanai': {
      detail: 'Kallanai · from the film',
      ta: 'கல்லணையின் வளைவுகள்',
      en: 'The masonry arches that now crown the ancient weir. British engineers who studied Kallanai in the nineteenth century were impressed by it: Sir Arthur Cotton learned from its foundations before building the Upper Anicut across the Kollidam in 1836, and Richard Baird Smith praised it in the 1850s as a wonderful work that had lasted for many centuries. It was they who named it the “Grand Anicut”.',
      taText: 'பழைய அணைக்கட்டின் மேல் இன்று அமைந்துள்ள கல் வளைவுகள். பத்தொன்பதாம் நூற்றாண்டில் கல்லணையை ஆய்ந்த ஆங்கிலேயப் பொறியாளர்கள் அதைக் கண்டு வியந்தனர்: சர் ஆர்தர் காட்டன் அதன் அடித்தள முறையைக் கற்றுக்கொண்டு, 1836-இல் கொள்ளிடத்தின் குறுக்கே முக்கொம்பு மேலணையைக் கட்டினார்; ரிச்சர்டு பெயர்டு ஸ்மித் 1850-களில் அதைப் பல நூற்றாண்டுகள் நிலைத்த அற்புதப் படைப்பாகப் போற்றினார். அதற்கு “கிராண்ட் அணைக்கட்டு” என்று பெயரிட்டவர்களும் அவர்களே.',
    },
    'The shutters of the anicut — Kallanai': {
      detail: 'Kallanai · from the film',
      ta: 'அணைக்கட்டின் மதகுக் கதவுகள்',
      en: 'Steel shutters between the piers let engineers raise or lower the river and divide its flow. In 1830 Sir Arthur Cotton built sand escapes at the dam’s eastern end to flush away the sand that had begun to choke the river, and later works added the bridge, the vents and their gates — according to the film, fifty-five shutters with gates weighing eight tons. The old weir was adapted, never replaced.',
      taText: 'தூண்களுக்கிடையே அமைந்த எஃகு மதகுக் கதவுகள், ஆற்றின் நீர்மட்டத்தை உயர்த்தவும் தாழ்த்தவும் அதன் ஓட்டத்தைப் பிரிக்கவும் உதவுகின்றன. 1830-இல் அணையின் கிழக்கு முனையில் சர் ஆர்தர் காட்டன் மணல் போக்கிகளை அமைத்து, ஆற்றை அடைக்கத் தொடங்கிய மணலை வெளியேற்றினார்; பின்னர் பாலமும் மதகுகளும் கதவுகளும் சேர்க்கப்பட்டன — ஆவணப்படத்தின்படி, எட்டு டன் எடையுள்ள கதவுகளுடன் ஐம்பத்தைந்து மதகுகள். பழைய அணை ஒருபோதும் மாற்றப்படவில்லை; மேம்படுத்தப்பட்டது.',
    },
    'The Kaveri rushing through the vents — Kallanai': {
      detail: 'Kallanai · from the film',
      ta: 'மதகுகள் வழியே பாயும் காவிரி',
      en: 'Kaveri water pours through the vents of the anicut. At Kallanai the river is divided into the Kaveri, the Vennaru and the Grand Anicut Canal, while surplus floodwater is turned into the Kollidam. Through these and their many branches the water reaches village tanks and fields across the whole delta.',
      taText: 'அணைக்கட்டின் மதகுகள் வழியே காவிரி நீர் பாய்கிறது. கல்லணையில் ஆறு காவிரி, வெண்ணாறு, புது ஆறு (கல்லணைக் கால்வாய்) எனப் பிரிக்கப்படுகிறது; மிகுதியான வெள்ள நீர் கொள்ளிடத்திற்குத் திருப்பப்படுகிறது. இவற்றின் பல கிளைகள் வழியாக நீர் கழிமுகமெங்கும் உள்ள ஊர் ஏரிகளையும் வயல்களையும் சென்றடைகிறது.',
    },
    'Water spilling over the Grand Anicut — Kallanai': {
      detail: 'Kallanai · from the film',
      ta: 'கல்லணையின் மேல் வழியும் நீர்',
      en: 'Water spills over the anicut when the Kaveri runs high. The film recalls why the dam was needed: in flood the river broke its banks and swept away fields and villages, as later Chola inscriptions record. By holding back and dividing the flood, Kallanai protected the delta as well as watering it.',
      taText: 'காவிரியில் நீர் பெருகும்போது அணைக்கட்டின் மேல் நீர் வழிகிறது. அணை ஏன் தேவைப்பட்டது என்பதை ஆவணப்படம் நினைவூட்டுகிறது: வெள்ளக் காலங்களில் ஆறு கரைகளை உடைத்து வயல்களையும் ஊர்களையும் அழித்ததைப் பிற்காலச் சோழர் கல்வெட்டுகள் பதிவு செய்கின்றன. வெள்ளத்தைத் தடுத்துப் பிரித்ததன் மூலம், கல்லணை கழிமுகத்திற்கு நீர் வழங்கியதோடு அதைக் காக்கவும் செய்தது.',
    },
    'The Kaveri in flood at the anicut — Kallanai': {
      detail: 'Kallanai · from the film',
      ta: 'கல்லணையில் பெருக்கெடுக்கும் காவிரி',
      en: 'The Kaveri in spate below the Grand Anicut. Tamil poets praised the Chola country as the land of the Kaveri, whose bounty never failed; the Silappatikaram celebrates it as a land of boundless paddy. The anicut turned that bounty into a managed system, and the delta became the rice bowl of the Tamil country.',
      taText: 'கல்லணைக்குக் கீழே பெருக்கெடுத்து ஓடும் காவிரி. வளம் குன்றாத காவிரி பாயும் சோழ நாட்டைத் தமிழ்ப் புலவர்கள் போற்றினர்; சிலப்பதிகாரம் அதை எல்லையற்ற நெல்விளையும் நாடாகப் புகழ்கிறது. அந்த வளத்தை ஒழுங்குபடுத்திய அமைப்பாக மாற்றியது கல்லணை; அதனால் கழிமுகம் தமிழ் நாட்டின் நெற்களஞ்சியமானது.',
    },
    'Kallanai in full flow (film) — Kaveri': {
      title: 'Kallanai in full flow',
      detail: 'Kaveri · film excerpt',
      ta: 'பெருக்கெடுக்கும் கல்லணை',
      en: 'The Grand Anicut at work: water rushing through its vents, over its spillway and on into the channels of the delta. Footage from the documentary on Kallanai produced by the Central Institute of Classical Tamil.',
      taText: 'செயல்படும் கல்லணை: அதன் மதகுகள் வழியாகவும் வழிவாய் மேலாகவும் பாய்ந்து கழிமுகக் கால்வாய்களுக்குள் செல்லும் நீர். செம்மொழித் தமிழாய்வு மத்திய நிறுவனம் தயாரித்த கல்லணை ஆவணப்படத்தின் காட்சிகள்.',
    },
    'Karikal Chozhan Manimandapam — Kallanai': {
      detail: 'Kallanai · from the film',
      ta: 'கரிகால் சோழன் மணிமண்டபம் — கல்லணை',
      en: 'The memorial hall to Karikal Chozhan at Kallanai, raised by the Government of Tamil Nadu. Karikalan, hero of the Pattinappalai and the Porunararruppadai, is remembered in Tamil tradition as the king who tamed the Kaveri. Later Chola poems such as the Kulothunga Cholan Ula, and the inscriptions of dynasties that claimed descent from him, credit him with raising the Kaveri’s banks.',
      taText: 'தமிழ்நாடு அரசு கல்லணையில் அமைத்த கரிகால் சோழன் மணிமண்டபம். பட்டினப்பாலை, பொருநராற்றுப்படை ஆகியவற்றின் தலைவனான கரிகாலன், காவிரியை அடக்கிய மன்னனாகத் தமிழ் மரபில் நினைக்கப்படுகிறான். குலோத்துங்க சோழன் உலா போன்ற பிற்காலச் சோழர் இலக்கியங்களும், அவன் வழிவந்தவர்கள் எனக் கூறிக்கொண்ட அரச மரபுகளின் கல்வெட்டுகளும், காவிரிக்குக் கரை கட்டியவனாக அவனைப் போற்றுகின்றன.',
    },
  },

  // The Irrigation room: the curators' notes, in English and Tamil (public/Irrigation).
  'Irrigation/Ancient tamil irrigation': {
    'Kallanai — The Ancient Water-Diversion Dam': {
      ta: 'கல்லணை — பழமையான நீரைத் திருப்பிவிடும் அணை',
      en: 'Kallanai, also known as the Grand Anicut, is one of the most remarkable examples of traditional water engineering in Tamil Nadu. It stands across the Kaveri River and is traditionally attributed to Karikala Chola, an early Chola king. The structure was designed primarily to divert river water towards irrigation channels rather than simply store water in a reservoir. The dam helped distribute the Kaveri’s water across the fertile agricultural lands of the delta, where rice cultivation became particularly important. Its low, broad stone structure works with the river’s flow to guide water towards irrigation networks. Unlike a modern high dam, its principal purpose was water diversion and distribution. Kallanai represents the close relationship between river management, agricultural production and settlement in the Tamil region. Its continued role in the irrigation system also demonstrates how traditional engineering structures can remain useful through later maintenance and adaptation. Although its precise original construction date is uncertain, it is widely associated with the early Chola period.',
      taText: 'கல்லணை, கிராண்ட் அணைக்கட்டு (Grand Anicut) என்றும் அழைக்கப்படுகிறது. இது தமிழ்நாட்டின் பாரம்பரிய நீர்ப்பாசனப் பொறியியல் திறனை எடுத்துக்காட்டும் மிகச் சிறப்பான கட்டமைப்புகளில் ஒன்றாகும். காவிரி ஆற்றின் குறுக்கே அமைந்துள்ள இந்த அணை, முற்காலச் சோழ மன்னரான கரிகாலச் சோழனுடன் பாரம்பரியமாகத் தொடர்புபடுத்தப்படுகிறது. நீரை ஒரு பெரிய நீர்த்தேக்கத்தில் சேமிப்பதைவிட, ஆற்று நீரைப் பாசனக் கால்வாய்களுக்குத் திருப்பிவிடுவதே இதன் முதன்மையான நோக்கமாகும். கல்லணை காவிரி ஆற்றின் நீரை வளமான காவிரி டெல்டா பகுதியிலுள்ள விவசாய நிலங்களுக்குப் பகிர்ந்தளிக்க உதவியது. இப்பகுதியில் நெல் சாகுபடி முக்கியத்துவம் பெற்றது. தாழ்வான, அகலமான கல் கட்டமைப்பைக் கொண்ட இந்த அணை, ஆற்றின் நீரோட்டத்தைப் பயன்படுத்தி நீரைப் பாசனக் கால்வாய்களுக்குத் திருப்பிவிடும் வகையில் அமைக்கப்பட்டுள்ளது. நவீன உயரமான அணைகளைப் போலல்லாமல், நீரைத் திருப்பிவிடுவதிலும் பகிர்ந்தளிப்பதிலும் இது முக்கியப் பங்கு வகிக்கிறது. கல்லணை என்பது ஆற்று நீர் மேலாண்மை, வேளாண் உற்பத்தி மற்றும் தமிழர் வாழ்விடங்களுக்கிடையேயான நெருங்கிய தொடர்பை வெளிப்படுத்துகிறது. இதன் துல்லியமான கட்டுமானக் காலம் உறுதியாகத் தெரியவில்லை என்றாலும், இது பொதுவாக முற்காலச் சோழர் காலத்துடன் தொடர்புபடுத்தப்படுகிறது.',
    },
    'Eri System — Traditional Irrigation Tanks': {
      ta: 'ஏரி முறை — பாரம்பரிய நீர்ப்பாசன ஏரிகள்',
      en: 'The eri system was a major part of traditional water management in Tamil Nadu. An eri is an artificial irrigation tank designed to collect and store rainwater and surface runoff. During the monsoon, water accumulated behind an earthen embankment. It could then be released for agriculture when rainfall decreased. These tanks were especially valuable in areas without dependable access to perennial rivers. Stored water supported paddy cultivation and other crops, while tank beds and surrounding land formed part of the village’s agricultural landscape. In some regions, tanks were arranged in connected sequences: overflow from an upper tank could move into a lower tank, helping communities make use of seasonal rainfall across a wider area. The eri was more than a water-storage structure. It was part of a wider village system that required regular desilting, repairs and collective management. When maintained properly, tanks helped reduce water loss through uncontrolled runoff and improved the availability of water during dry periods.',
      taText: 'தமிழகத்தின் பாரம்பரிய நீர் மேலாண்மையில் ஏரி முறை முக்கியமான இடத்தைப் பெற்றிருந்தது. ஏரி என்பது மழைநீரையும் நிலப்பரப்பில் வழிந்தோடும் நீரையும் சேகரித்துச் சேமிப்பதற்காக உருவாக்கப்பட்ட செயற்கையான நீர்நிலையாகும். பருவமழைக் காலத்தில், மண்ணால் அமைக்கப்பட்ட கரைகளுக்குப் பின்னால் நீர் தேக்கப்பட்டது. மழைப்பொழிவு குறைந்த காலங்களில், சேமிக்கப்பட்ட நீர் விவசாயத்திற்குப் பயன்படுத்தப்பட்டது. ஆண்டு முழுவதும் நீர் கிடைக்கும் ஆறுகளைச் சார்ந்திருக்க முடியாத பகுதிகளில் இந்த ஏரிகள் மிகவும் பயனுள்ளதாக இருந்தன. சில பகுதிகளில் ஏரிகள் ஒன்றோடொன்று இணைக்கப்பட்ட வரிசையில் அமைக்கப்பட்டிருந்தன; மேல்நிலை ஏரியில் இருந்து வெளியேறும் உபரி நீர் கீழ்நிலை ஏரிக்குச் சென்றடைந்தது. ஏரி என்பது வெறும் நீரைச் சேமிக்கும் கட்டமைப்பு மட்டுமல்ல; அது கிராமத்தின் வேளாண்மை மற்றும் சமூக வாழ்க்கையுடன் இணைந்திருந்த ஓர் அமைப்பாகும். ஏரிகளில் படிந்த வண்டல் மண்ணை அகற்றுதல், கரைகளைப் பழுதுபார்த்தல் மற்றும் கூட்டாகப் பராமரித்தல் போன்ற பணிகள் அவசியமாக இருந்தன. முறையாகப் பராமரிக்கப்பட்ட ஏரிகள், கட்டுப்பாடின்றி நீர் வெளியேறுவதைக் குறைத்து, வறண்ட காலங்களில் விவசாயத்திற்குத் தேவையான நீர் கிடைப்பதை மேம்படுத்தின.',
    },
    'Kalingu, Madagu and Kumizhi — Traditional Sluice Systems': {
      ta: 'கலிங்கு, மடகு மற்றும் குமிழி — பாரம்பரிய நீர்வெளியேற்ற அமைப்புகள்',
      en: 'Ancient and medieval Tamil irrigation systems used carefully designed outlets to control how water moved from tanks into agricultural channels. These structures were not simply openings in a tank wall; different designs helped regulate water flow and distribute stored water to fields. Several traditional sluice types are documented in Tamil Nadu, including madai, madagu, thumpu and kumizhi. Their precise designs and functions varied. One particularly interesting example is the kumizhi system, a specialised sluice associated with traditional tank-water management. Sluices helped farmers release water when it was needed, rather than allowing the tank to empty uncontrolled, and supported the organised distribution of water through channels serving different agricultural areas. Their construction reflects practical knowledge of water pressure, outlet placement, gravity and the relationship between storage tanks and farmland. Surviving inscriptions are especially valuable evidence of this irrigation technology and its role in transforming agricultural landscapes.',
      taText: 'பண்டைய மற்றும் இடைக்காலத் தமிழகத்தின் நீர்ப்பாசன அமைப்புகளில், ஏரிகளிலிருந்து விவசாயக் கால்வாய்களுக்கு நீர் செல்வதைக் கட்டுப்படுத்துவதற்காகப் பல்வேறு வடிவமைப்புகளைக் கொண்ட நீர்வெளியேற்ற அமைப்புகள் பயன்படுத்தப்பட்டன. இவை ஏரிக்கரையில் அமைக்கப்பட்ட சாதாரண திறப்புகள் மட்டுமல்ல; நீரின் ஓட்டத்தைக் கட்டுப்படுத்தவும், சேமிக்கப்பட்ட நீரை வயல்களுக்குத் தேவைக்கேற்பப் பகிர்ந்தளிக்கவும் உதவும் வகையில் வடிவமைக்கப்பட்டிருந்தன. தமிழகத்தில் மடை, மடகு, தூம்பு மற்றும் குமிழி போன்ற பாரம்பரிய நீர்வெளியேற்ற அமைப்புகள் ஆவணப்படுத்தப்பட்டுள்ளன. இவற்றில் குறிப்பிடத்தக்க ஒன்றான குமிழி, பாரம்பரிய ஏரி நீர் மேலாண்மையுடன் தொடர்புடைய ஒரு சிறப்பு வகை நீர்வெளியேற்ற அமைப்பாகும். ஏரியில் சேமிக்கப்பட்ட நீரைத் தேவையான நேரத்தில் வெளியேற்றுவதற்கு இந்த அமைப்புகள் உதவின. இவற்றின் கட்டமைப்புகள் நீரழுத்தம், நீர்வெளியேற்ற வாயில்களின் அமைவிடம், புவியீர்ப்பு விசை மற்றும் நீர்த்தேக்கங்களுக்கும் விவசாய நிலங்களுக்கும் இடையேயான தொடர்பு பற்றிய நடைமுறை அறிவை வெளிப்படுத்துகின்றன. இன்றும் கிடைக்கக்கூடிய கல்வெட்டுகள், அக்கால நீர்ப்பாசனத் தொழில்நுட்பங்களை அறிந்துகொள்வதற்கான முக்கிய ஆதாரங்களாக விளங்குகின்றன.',
    },
    'Etram and Picottah — Traditional Water-Lifting Devices': {
      ta: 'ஏற்றம் மற்றும் பிக்கோட்டா — பாரம்பரிய நீரேற்றும் கருவிகள்',
      en: 'When water could not flow naturally from a river, tank or well into a field, farmers needed ways to raise it. Traditional Tamil agricultural practices included manual water-lifting devices such as buckets, baskets and lever-operated mechanisms. The picottah, commonly described as a counterbalanced lever system, enabled a person to lift water with less effort than carrying it by hand. A typical lever device uses a long pole supported on a pivot, with a container attached at one end and a counterweight at the other. The operator lowers the container into the water and raises it to empty water into a channel or field. Tamil literary works, including Ahananuru, Maduraikanchi and Silappadikaram, contain references interpreted as evidence of water-lifting practices, and historical inscriptions mention lands irrigated using picottah-type devices. These tools were particularly useful for smaller plots, garden cultivation and fields situated above the water level.',
      taText: 'ஆறு, ஏரி அல்லது கிணற்றிலிருந்து நீர் இயற்கையாகவே வயலுக்குப் பாய முடியாதபோது, நீரை மேலே உயர்த்துவதற்கான கருவிகள் தேவைப்பட்டன. தமிழகத்தின் பாரம்பரிய வேளாண்மையில் வாளிகள், கூடைகள் மற்றும் நெம்புகோல் அடிப்படையில் இயங்கும் நீரேற்றும் கருவிகள் பயன்படுத்தப்பட்டன. இவற்றில் பிக்கோட்டா (Picottah) எனப்படும் எதிரெடையுடன் கூடிய நெம்புகோல் அமைப்பு, கைகளால் நீரைத் தூக்கிச் செல்வதைவிடக் குறைந்த முயற்சியில் நீரை மேலே உயர்த்த உதவியது. பொதுவாக, இத்தகைய கருவியில் ஒரு நீண்ட கம்பம் ஆதாரப் புள்ளியில் பொருத்தப்பட்டிருக்கும்; அதன் ஒரு முனையில் நீரை எடுக்கும் பாத்திரமும் மறுமுனையில் எதிரெடையும் இருக்கும். அகநானூறு, மதுரைக்காஞ்சி மற்றும் சிலப்பதிகாரம் போன்ற தமிழ் இலக்கியங்களில் நீரேற்றும் முறைகளுடன் தொடர்புபடுத்திப் புரிந்துகொள்ளப்படும் குறிப்புகள் காணப்படுகின்றன. பிக்கோட்டா போன்ற கருவிகளைப் பயன்படுத்திப் பாசனம் செய்யப்பட்ட நிலங்கள் குறித்தும் சில வரலாற்றுக் கல்வெட்டுகள் தகவல்களை வழங்குகின்றன. இந்தக் கருவிகள் சிறிய விவசாய நிலங்கள், தோட்டப் பயிர்கள் மற்றும் நீர்மட்டத்தைவிட உயரமான வயல்களுக்குப் பாசனம் செய்வதில் பயனுள்ளதாக இருந்தன.',
    },
    'The Noyyal River Tank Network — Managing Seasonal Water': {
      ta: 'நொய்யல் ஆற்றுப் பகுதியின் ஏரி வலையமைப்பு — பருவகால நீர் மேலாண்மை',
      en: 'The Noyyal River region of Tamil Nadu provides another example of water management through a network of tanks and associated channels. Rather than depending only on direct river flow, communities developed storage systems that helped capture and distribute available water. Tanks in such networks could collect seasonal rainfall and runoff, storing it for later agricultural use. Their usefulness depended on the arrangement of the landscape, the condition of embankments, the capacity of channels and the timing of rainfall. When maintained effectively, a connected network helped spread limited water resources across multiple locations. The Noyyal River system is also recognised in India’s water-heritage documentation. It illustrates why traditional irrigation should be understood as a network of related structures rather than a collection of isolated tanks.',
      taText: 'தமிழகத்தின் நொய்யல் ஆற்றுப் பகுதி, ஏரிகள் மற்றும் அவற்றுடன் தொடர்புடைய கால்வாய்களின் வலையமைப்பின் மூலம் நீர் மேலாண்மை மேற்கொள்ளப்பட்டதற்கான மற்றொரு எடுத்துக்காட்டாகும். ஆற்றின் நேரடி நீரோட்டத்தை மட்டுமே நம்பியிருக்காமல், கிடைக்கும் நீரைச் சேகரித்துச் சேமித்து, பின்னர் பயன்படுத்துவதற்கான அமைப்புகளை இப்பகுதி மக்கள் உருவாக்கினர். இத்தகைய வலையமைப்புகளில் உள்ள ஏரிகள் பருவமழை நீரையும் நிலப்பரப்பில் வழிந்தோடும் நீரையும் சேகரித்து, விவசாயத்திற்காகப் பின்னர் பயன்படுத்த உதவின. இந்த அமைப்புகளின் பயன் நிலத்தின் இயற்கையான அமைப்பு, ஏரிக்கரைகளின் நிலை, கால்வாய்களின் கொள்ளளவு மற்றும் மழைப்பொழிவின் காலம் ஆகியவற்றைப் பொறுத்திருந்தது. நொய்யல் ஆற்றுப் பகுதியின் நீர்ப்பாசன அமைப்புகள் இந்தியாவின் நீர்ப்பாசனப் பாரம்பரியம் தொடர்பான ஆவணங்களிலும் இடம்பெற்றுள்ளன. பாரம்பரிய நீர்ப்பாசனத்தைத் தனித்தனியான ஏரிகளின் தொகுப்பாக மட்டும் பார்க்காமல், ஒன்றோடொன்று தொடர்புடைய கட்டமைப்புகளின் வலையமைப்பாகப் புரிந்துகொள்ள வேண்டியதன் முக்கியத்துவத்தை இவை எடுத்துக்காட்டுகின்றன.',
    },
  },

  // The Tamil Agriculture room: each photograph with notes drawn from the curators' texts (public/Tamil Agriculture).
  'Tamil Agriculture': {
    'Traditional plough — ஏர்': {
      title: 'Traditional Plough',
      detail: 'Preparing the land',
      ta: 'ஏர் — பாரம்பரியக் கலப்பை',
      en: 'The wooden plough, often drawn by cattle or buffaloes, was used to loosen and prepare agricultural land for sowing. With hand tools for planting and weeding, sickles for harvest, and threshing and winnowing to clean the grain, it belonged to a set of tools that farming communities adapted to their own soils and crops and passed down from one generation to another.',
      taText: 'மரத்தால் செய்யப்பட்ட ஏர் அல்லது கலப்பை, பெரும்பாலும் மாடுகள் அல்லது எருமைகளின் உதவியுடன் இழுக்கப்பட்டு, நிலத்தை உழுது சாகுபடிக்குத் தயார்படுத்தப் பயன்பட்டது. விதைப்புக்கும் களையெடுப்புக்கும் கைக் கருவிகள், அறுவடைக்கு அரிவாள், தானியங்களைப் பிரிக்கப் போரடித்தல், தூற்றுதல் — இவற்றுடன் சேர்ந்து, உள்ளூர் மண்ணுக்கும் பயிருக்கும் ஏற்ப உழவர்கள் தலைமுறை தலைமுறையாகப் பகிர்ந்து கொண்ட கருவிகளுள் ஏர் முதன்மையானது.',
    },
    'Rice seedlings — நெல் நாற்றுகள்': {
      title: 'Rice Seedlings',
      detail: 'Paddy · The nursery',
      ta: 'நெல் நாற்றுகள்',
      en: 'Paddy seedlings are first raised close together in a nursery bed, then pulled and carried to the flooded fields for transplanting. Paddy was the crop of the fertile, well-watered lands — the Marutham landscape of Sangam poetry — and above all of the Kaveri delta, fed by the Kallanai and by village tanks.',
      taText: 'நெல் நாற்றுகள் முதலில் நாற்றங்காலில் நெருக்கமாக வளர்க்கப்பட்டு, பின்னர் பறிக்கப்பட்டு நீர் நிறைந்த வயல்களுக்கு நடவுக்காகக் கொண்டு செல்லப்படுகின்றன. நீர்வளம் நிறைந்த வளமான நிலங்களின் — சங்கக் கவிதையின் மருத நிலத்தின் — பயிர் நெல்; குறிப்பாகக் கல்லணையாலும் ஊர் ஏரிகளாலும் நீர் பெற்ற காவிரிப் படுகையின் பயிர்.',
    },
    'Paddy transplantation — நெல் நடவு': {
      title: 'Paddy Transplantation',
      detail: 'Paddy · Planting',
      ta: 'நெல் நடவு',
      en: 'Seedlings are planted by hand, a few at a time, in rows across the flooded field — patient, shared work that follows the season and the water. Farmers planned each stage, from preparing the field and choosing seed to sowing, watering, weeding and harvest, around rainfall, soil and the water they could store.',
      taText: 'நீர் நிறைந்த வயலில், சில சில நாற்றுகளாக வரிசையாகக் கையால் நடப்படுகின்றன — பருவத்தையும் நீரையும் பின்பற்றி நடக்கும், பொறுமையும் கூட்டுழைப்பும் வேண்டும் பணி. நிலத்தைத் தயார்படுத்துதல், விதைத் தேர்வு முதல் விதைத்தல், நீர்ப்பாசனம், களையெடுப்பு, அறுவடை வரை ஒவ்வொரு கட்டத்தையும் மழை, மண், சேமிக்கக்கூடிய நீர் ஆகியவற்றுக்கு ஏற்ப உழவர்கள் திட்டமிட்டனர்.',
    },
    'Traditional paddy harvesting — நெல் அறுவடை': {
      title: 'Traditional Paddy Harvesting',
      detail: 'Paddy · Harvest',
      ta: 'நெல் அறுவடை',
      en: 'The ripe paddy is cut by hand with sickles, then threshed to separate the grain from the stalks and winnowed to clear away the chaff. The harvest fed households and markets, and land revenue from it sustained the ruling powers — agriculture supported cattle rearing, grain processing, transport and trade alongside it.',
      taText: 'முற்றிய நெல் அரிவாளால் கையால் அறுக்கப்பட்டு, கதிர்களிலிருந்து தானியத்தைப் பிரிக்கப் போரடிக்கப்பட்டு, பதர்களை நீக்கத் தூற்றப்படுகிறது. அறுவடை குடும்பங்களுக்கும் சந்தைகளுக்கும் உணவளித்தது; நிலத்திலிருந்து பெற்ற வருவாய் ஆட்சியாளர்களின் வளத்துக்கு ஆதாரமானது. கால்நடை வளர்ப்பு, தானியப் பதப்படுத்துதல், போக்குவரத்து, வணிகம் ஆகிய தொழில்களுக்கும் வேளாண்மை துணைநின்றது.',
    },
    'Millet cultivation — சிறுதானிய வேளாண்மை': {
      title: 'Millet Cultivation',
      detail: 'Millets · Drier lands',
      ta: 'சிறுதானிய வேளாண்மை',
      en: 'Where rain was scarce and the land drier, Tamil farmers grew millets such as kambu and varagu, alongside pulses, sesame and cotton. Choosing crops to suit each soil, rainfall and water supply was knowledge the Sangam poems already show — and millets remain among Tamil Nadu’s major crops today.',
      taText: 'மழை குறைவாகப் பெய்யும் வறண்ட நிலங்களில், தமிழக உழவர்கள் கம்பு, வரகு போன்ற சிறுதானியங்களையும், பயறு வகைகள், எள், பருத்தி ஆகியவற்றையும் பயிரிட்டனர். ஒவ்வொரு மண்ணுக்கும் மழைக்கும் நீர்வளத்துக்கும் ஏற்ற பயிரைத் தேர்ந்தெடுக்கும் அறிவைச் சங்கக் கவிதைகளே காட்டுகின்றன — இன்றும் சிறுதானியங்கள் தமிழகத்தின் முக்கியப் பயிர்களுள் அடங்கும்.',
    },
    'Kallanai — கல்லணை': {
      title: 'Kallanai',
      detail: 'Kaveri river · Grand Anicut',
      ta: 'கல்லணை',
      en: 'The Kallanai, or Grand Anicut, across the Kaveri — traditionally attributed to the Chola king Karikala — was built to regulate and divert the river’s water into channels for irrigation. It made the Kaveri delta one of the great rice-growing lands of Tamil Nadu, and still serves its irrigation system today. (See the Irrigation room for more on Tamil water engineering.)',
      taText: 'காவிரியின் குறுக்கே அமைந்துள்ள கல்லணை — மரபுவழிச் செய்திகளின்படி சோழ மன்னன் கரிகாலனுடன் தொடர்புடையது — ஆற்று நீரை ஒழுங்குபடுத்தி, பாசனக் கால்வாய்களுக்குத் திருப்பிவிடும் நோக்கில் உருவாக்கப்பட்டது. காவிரிப் படுகையைத் தமிழகத்தின் பெரும் நெல் விளைநிலமாக்கிய இது, இன்றும் பாசன அமைப்பில் பங்காற்றுகிறது. (தமிழர் நீர்ப் பொறியியல் பற்றி மேலும் அறிய நீர்ப்பாசன அறையைக் காணுங்கள்.)',
    },
  },
};
