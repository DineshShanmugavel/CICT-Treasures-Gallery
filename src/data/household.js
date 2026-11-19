import { artifactsIn } from './artifacts.js';

/**
 * The Household room: the objects of a traditional Tamil home.
 *
 * public/Household holds a single poster of twelve objects ("Ancient tamil household
 * objects.png"); each object's picture was cut from it into src/assets/household (one image
 * per object, named by its key below), so every object has its own display case. The poster
 * itself opens the gallery. The texts are the curators' own, in English and Tamil
 * (public/Household/tamil household obj- eng n tamil.pdf).
 */
const pictures = import.meta.glob('../assets/household/*.jpg', { eager: true, query: '?url', import: 'default' });
const pictureOf = (key) => pictures[`../assets/household/${key}.jpg`];

const OBJECTS = [
  {
    key: 'manpaanai',
    title: 'Manpaanai — Clay Cooking Pot',
    ta: 'மண்பானை',
    detail: 'Earthenware · Kitchen',
    en: 'Clay pots were widely used in traditional Tamil homes for cooking rice, millet, lentils, curries and other dishes. Made from locally available clay, these pots were shaped by skilled potters and fired to make them suitable for everyday use. Different sizes served different purposes, from cooking meals to storing ingredients. Earthenware was an important part of household life because it was accessible and could be produced locally.',
    taText: 'பாரம்பரியத் தமிழ் வீடுகளில் அரிசி, சிறுதானியங்கள், பருப்பு, குழம்பு போன்ற உணவுகளைச் சமைக்க மண்பானைகள் பயன்படுத்தப்பட்டன. உள்ளூரில் கிடைக்கும் களிமண்ணால் திறமையான மண்பாண்டத் தொழிலாளர்கள் இவற்றை உருவாக்கினர். வெவ்வேறு அளவுகளில் தயாரிக்கப்பட்ட பானைகள் சமையலுக்கும் உணவுப் பொருட்களைச் சேமிப்பதற்கும் பயன்பட்டன.',
  },
  {
    key: 'thaaniya-kudam',
    title: 'Thaaniya Kudam — Grain Storage Jar',
    ta: 'தானியக் குடம்',
    detail: 'Earthenware · Storage',
    en: 'Large storage jars and earthen containers were used to keep rice, millet, pulses and other dry food supplies. They helped households organise their provisions and protect stored grains from moisture when properly sealed and kept in suitable conditions. The size and number of containers depended on the family’s needs and available storage space.',
    taText: 'அரிசி, சிறுதானியங்கள், பருப்பு வகைகள் மற்றும் பிற உலர் உணவுப் பொருட்களைச் சேமிக்கப் பெரிய மண்குடங்களும் சேமிப்புப் பாத்திரங்களும் பயன்படுத்தப்பட்டன. இவை குடும்பங்களின் உணவுப் பொருட்களை ஒழுங்காக வைத்திருக்க உதவின. பொருத்தமான முறையில் மூடி, உலர்ந்த இடத்தில் வைத்தால் ஈரப்பதத்தால் ஏற்படும் பாதிப்புகளைக் குறைக்க முடிந்தது.',
  },
  {
    key: 'ammikkal',
    title: 'Ammikkal — Grinding Stone',
    ta: 'அம்மிக்கல்',
    detail: 'Stone · Kitchen',
    en: 'The ammi was a traditional stone tool used to grind spices, chillies, coconut and other ingredients. Ingredients were placed on the flat stone and rubbed with a smaller handstone until they became a paste. It was especially useful for preparing chutneys, spice mixtures and cooking pastes. The ammi remains a familiar symbol of traditional Tamil cooking.',
    taText: 'மிளகாய், மசாலாப் பொருட்கள், தேங்காய் மற்றும் பிற உணவுப் பொருட்களை அரைக்க அம்மிக்கல் பயன்படுத்தப்பட்டது. தட்டையான கல்லின் மீது பொருட்களை வைத்து, சிறிய கல்லால் அழுத்தித் தேய்த்து அரைத்தனர். சட்னி, மசாலா கலவைகள் மற்றும் சமையலுக்குத் தேவையான விழுதுகளைத் தயாரிக்க இது உதவியது.',
  },
  {
    key: 'aattukkal',
    title: 'Aattukkal — Hand Grinding Stone',
    ta: 'ஆட்டுக்கல்',
    detail: 'Stone · Kitchen',
    en: 'The aattukkal was used to grind grains and other ingredients by hand. Depending on its design, it could help prepare flour, batter and other food mixtures. It was an important kitchen tool in households where food was prepared from raw ingredients rather than purchased ready-made.',
    taText: 'தானியங்கள் மற்றும் பிற உணவுப் பொருட்களை அரைப்பதற்கு ஆட்டுக்கல் பயன்படுத்தப்பட்டது. அதன் வடிவமைப்பைப் பொறுத்து மாவு, தோசை மாவு போன்ற கலவைகள் மற்றும் பிற உணவுப் பொருட்களைத் தயாரிக்க இது உதவியது. வீட்டிலேயே மூலப்பொருட்களிலிருந்து உணவு தயாரித்த பாரம்பரியக் குடும்பங்களில் ஆட்டுக்கல் முக்கியமான கருவியாக இருந்தது.',
  },
  {
    key: 'ural-ulakkai',
    title: 'Ural and Ulakkai — Mortar and Pestle',
    ta: 'உரல் மற்றும் உலக்கை',
    detail: 'Wood or stone · Kitchen',
    en: 'The ural and ulakkai were used to pound rice, millet, grains and spices. The ural was a sturdy vessel, often made from wood or stone, while the ulakkai was a long pounding tool. Together, they helped remove husks, break grains and prepare ingredients for cooking. The tools also reflect the physical effort and shared work involved in traditional food preparation.',
    taText: 'அரிசி, சிறுதானியங்கள் மற்றும் மசாலாப் பொருட்களை இடிப்பதற்கு உரலும் உலக்கையும் பயன்படுத்தப்பட்டன. உரல் மரத்தாலோ கல்லாலோ செய்யப்பட்டிருக்கும்; உலக்கை நீளமான இடிக்கும் கருவியாகும். நெல் மற்றும் தானியங்களின் உமியை நீக்கவும், தானியங்களை உடைக்கவும், சமையலுக்குத் தேவையான பொருட்களைத் தயாரிக்கவும் இவை உதவின.',
  },
  {
    key: 'kudam',
    title: 'Kudam — Water Pot',
    ta: 'தண்ணீர்க் குடம்',
    detail: 'Clay or metal · Water',
    en: 'Water pots made from clay or metal were used to collect, carry and store drinking water. Families carried water from wells, ponds and other water sources in suitable vessels. Earthen pots were valued in many households because water stored in porous clay can become cooler through evaporation. Their use depended on local materials, customs and access to water.',
    taText: 'குடிநீரை எடுத்துச் செல்லவும் சேமிக்கவும் மண் அல்லது உலோகத்தால் செய்யப்பட்ட குடங்கள் பயன்படுத்தப்பட்டன. குடும்பத்தினர் கிணறு, குளம் போன்ற நீராதாரங்களிலிருந்து நீரை எடுத்துவந்து குடங்களில் சேமித்தனர். மண் குடத்தின் நுண்துளைகள் வழியாக நீர் ஆவியாவதால், அதில் வைக்கப்படும் நீர் குளிர்ச்சியாக இருக்கக்கூடும். குடங்களின் வகைகள் உள்ளூர் பொருட்கள் மற்றும் பழக்கவழக்கங்களுக்கு ஏற்ப மாறுபட்டன.',
  },
  {
    key: 'agal-vilakku',
    title: 'Agal Vilakku — Oil Lamp',
    ta: 'அகல் விளக்கு',
    detail: 'Clay or metal · Light',
    en: 'The agal vilakku was a small lamp, commonly made from clay or metal, used to provide light inside homes. It held oil and a wick, which was lit to produce a flame. Oil lamps were used for ordinary household lighting and also played a role in religious observances and traditional ceremonies. Their simple design made them practical household objects.',
    taText: 'அகல் விளக்கு என்பது வீடுகளில் வெளிச்சம் தரப் பயன்படுத்தப்பட்ட சிறிய விளக்காகும். இது பொதுவாக மண்ணாலோ உலோகத்தாலோ செய்யப்பட்டது. இதில் எண்ணெய் ஊற்றி, திரியை வைத்து ஏற்றினர். அன்றாட வீட்டு வெளிச்சத்திற்குப் பயன்பட்டதுடன், வழிபாடுகள் மற்றும் பாரம்பரியச் சடங்குகளிலும் அகல் விளக்கு முக்கிய இடம் பெற்றது.',
  },
  {
    key: 'paai',
    title: 'Paai — Woven Mat',
    ta: 'பாய்',
    detail: 'Palm leaf, reed or grass · Living',
    en: 'Mats were woven from materials such as palm leaves, reeds and grasses. They were used for sitting, sleeping, resting and hosting visitors. Depending on the material and weaving technique, mats varied in texture, size and durability. They could be rolled up and stored when not in use, making them practical for everyday living.',
    taText: 'பனை ஓலை, கோரைப்புல் மற்றும் பிற இயற்கைப் பொருட்களைக் கொண்டு பாய்கள் நெய்யப்பட்டன. அமர்வதற்கும், உறங்குவதற்கும், ஓய்வெடுப்பதற்கும் விருந்தினர்களை அமர வைப்பதற்கும் இவை பயன்பட்டன. பயன்படுத்தாதபோது பாய்களைச் சுருட்டி வைக்க முடிந்ததால், அவை அன்றாட வாழ்க்கைக்கு ஏற்ற பொருட்களாக விளங்கின.',
  },
  {
    key: 'visiri',
    title: 'Visiri — Hand Fan',
    ta: 'விசிறி',
    detail: 'Palm leaf or fibre · Living',
    en: 'Hand fans were made from palm leaves, woven fibres and other lightweight materials. They were moved by hand to create airflow and provide relief in hot weather. Their construction required knowledge of weaving and shaping natural materials. They were simple, reusable objects that did not require electricity or mechanical equipment.',
    taText: 'பனை ஓலைகள், நெய்யப்பட்ட நார்கள் மற்றும் எடை குறைந்த இயற்கைப் பொருட்களைக் கொண்டு கைவிசிறிகள் தயாரிக்கப்பட்டன. கையால் வீசி காற்றைப் பெறவும் வெப்பமான காலநிலையில் உடலைக் குளிர்விக்கவும் இவை பயன்பட்டன. இயற்கைப் பொருட்களை நெய்து வடிவமைக்கும் திறனை இவற்றின் தயாரிப்பு வெளிப்படுத்துகிறது.',
  },
  {
    key: 'marak-kattil',
    title: 'Marak Kattil — Wooden Cot',
    ta: 'மரக்கட்டில்',
    detail: 'Wood and rope · Living',
    en: 'Wooden cots were used for sleeping and resting. Some were designed with ropes or woven fibres stretched across a wooden frame to form a supportive surface. Their designs varied according to local craftsmanship and the materials available. Cots were practical household furniture, while mats were another common option for sleeping on the floor.',
    taText: 'உறங்குவதற்கும் ஓய்வெடுப்பதற்கும் மரக்கட்டில்கள் பயன்படுத்தப்பட்டன. சில கட்டில்களில் மரச்சட்டகத்தின் குறுக்கே கயிறுகள் அல்லது நெய்யப்பட்ட நார்கள் இணைக்கப்பட்டு படுக்கும் தளம் உருவாக்கப்பட்டது. உள்ளூர் கைவினைத் திறனுக்கும் கிடைக்கும் பொருட்களுக்கும் ஏற்ப அவற்றின் வடிவமைப்புகள் மாறுபட்டன. தரையில் பாய் விரித்துப் படுப்பதும் பாரம்பரிய வீடுகளில் வழக்கமாக இருந்தது.',
  },
  {
    key: 'koodai',
    title: 'Koodai — Basket',
    ta: 'கூடை',
    detail: 'Bamboo, palm leaf or reed · Carrying',
    en: 'Baskets were made by weaving bamboo, palm leaves, reeds and other plant materials. They were used to carry vegetables, fruits, grains, firewood and household items. Different shapes and sizes suited different tasks, including collecting harvested crops and transporting goods. Basket-making reflects traditional knowledge of plant fibres, weaving patterns and durable construction.',
    taText: 'மூங்கில், பனை ஓலை, கோரை மற்றும் பிற தாவரப் பொருட்களைப் பின்னிக் கூடைகள் தயாரிக்கப்பட்டன. காய்கறிகள், பழங்கள், தானியங்கள், விறகுகள் மற்றும் வீட்டுப் பொருட்களை எடுத்துச் செல்ல இவை பயன்பட்டன. அறுவடை செய்த விளைபொருட்களைச் சேகரித்தல் மற்றும் பொருட்களை ஓரிடத்திலிருந்து மற்றொரு இடத்திற்குக் கொண்டு செல்லுதல் போன்ற பணிகளுக்கு வெவ்வேறு அளவிலான கூடைகள் பயன்படுத்தப்பட்டன.',
  },
  {
    key: 'karandi',
    title: 'Karandi and Serving Vessels — Ladles and Utensils',
    ta: 'கரண்டி மற்றும் பரிமாறும் பாத்திரங்கள்',
    detail: 'Wood, clay, bronze or brass · Dining',
    en: 'Cooking and serving utensils were made from materials such as wood, clay, bronze, brass and other metals. Ladles helped stir food and serve curries, while bowls and plates were used for eating and serving meals. The materials and designs varied across households, communities and periods. These everyday objects provide insight into traditional food preparation, dining practices and craft production.',
    taText: 'சமையல் செய்வதற்கும் உணவைப் பரிமாறுவதற்கும் மரம், மண், வெண்கலம், பித்தளை மற்றும் பிற உலோகங்களால் செய்யப்பட்ட பாத்திரங்கள் பயன்படுத்தப்பட்டன. குழம்பைக் கிளறவும் உணவைப் பரிமாறவும் கரண்டிகள் உதவின. உண்பதற்கும் உணவைப் பரிமாறுவதற்கும் கிண்ணங்களும் தட்டுகளும் பயன்பட்டன. இப்பொருட்களின் வடிவங்களும் தயாரிப்புப் பொருட்களும் காலம், பகுதி மற்றும் குடும்ப வழக்கங்களுக்கு ஏற்ப மாறுபட்டன.',
  },
];

/** The poster that opens the gallery, then the twelve objects cut from it. */
export function householdObjects() {
  const poster = artifactsIn('Household').map((artifact) => ({
    ...artifact,
    title: 'Ancient Tamil Household Objects',
    detail: 'The twelve objects together',
    tamil: 'பண்டைய தமிழர்களின் இல்லப் பயன்பாட்டுப் பொருட்கள்',
    note: 'Ancient Tamil households used objects made from clay, stone, wood, iron, bronze, copper, palm leaves and other natural materials. These objects were closely connected to everyday activities such as cooking, storing food, drawing water, grinding grains, lighting homes and preserving traditional knowledge. Together they make a journey through a traditional Tamil home, showing how people lived and how their household tools reflected their skills, environment and way of life.',
    tamilNote: 'பண்டைய தமிழர்களின் இல்லங்களில் மண், கல், மரம், இரும்பு, வெண்கலம், செம்பு, பனை ஓலை மற்றும் பிற இயற்கைப் பொருட்களால் செய்யப்பட்ட பொருட்கள் பயன்படுத்தப்பட்டன. சமைத்தல், உணவைச் சேமித்தல், நீர் எடுத்தல், தானியங்களை அரைத்தல், வீட்டிற்கு ஒளியூட்டுதல், மரபறிவைப் பேணுதல் போன்ற அன்றாடச் செயல்களுடன் இவை நெருங்கிய தொடர்புடையவை. ஒரு பாரம்பரியத் தமிழ் இல்லத்தின் வழியே செல்லும் பயணமாக, மக்கள் எவ்வாறு வாழ்ந்தனர், அவர்களின் கருவிகள் அவர்தம் திறனையும் சூழலையும் வாழ்க்கை முறையையும் எவ்வாறு பிரதிபலித்தன என்பதை இவை காட்டுகின்றன.',
  }));
  const objects = OBJECTS.filter(({ key }) => pictureOf(key)).map(({ key, title, ta, detail, en, taText }) => ({
    id: `household/${key}`,
    url: pictureOf(key),
    title,
    detail,
    tamil: ta,
    note: en,
    tamilNote: taText,
    narration: null,
    skip: false,
  }));
  return [...poster, ...objects];
}
