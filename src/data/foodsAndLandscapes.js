/**
 * Texts for the food rooms and the Ainthinai hall, in English and Tamil, drawn from the
 * curators' notes beside the photographs:
 * - public/Tamil foods (tamil food eng.pdf, tamil food tamil.pdf) — the Household room's Tamil
 *   Kitchen and the Trade & Ports hall's Foods room;
 * - public/5 lanscapes food (Five Landscapes FOOD ENGLISH.pdf / tamil.pdf) — the Native Foods
 *   of the Five Landscapes room in the Ainthinai hall.
 *
 * FOOD_TEXTS is keyed by the English part of each photograph's file name ("Rice — அரிசி.jpeg"
 * → 'Rice'), so a re-saved file whose Tamil is encoded differently still finds its text.
 * FOOD_PANELS are the rooms' exhibition panels (merged into ROOM_PANELS, exhibitionTexts.js).
 *
 * Pure data: no imports, so exhibitionTexts.js can merge it without an import cycle.
 */

export const FOOD_TEXTS = {
  'Tamil foods': {
    Rice: {
      title: 'Rice',
      ta: 'அரிசி',
      detail: 'Staple grain · Marutham fields',
      en: 'Rice was an important staple in fertile agricultural regions, particularly the Marutham landscape associated with farming. It was cooked and eaten with lentils, vegetables, meat, fish and other accompaniments. Rice cultivation and its place in meals reflected the importance of agriculture in Tamil society.',
      taText: 'வேளாண்மைக்கு ஏற்ற வளமான பகுதிகளில், குறிப்பாக மருதநிலத்தில், அரிசி முக்கிய உணவாக விளங்கியது. அரிசி சமைக்கப்பட்டு பருப்பு, காய்கறிகள், இறைச்சி, மீன் மற்றும் பிற உணவுகளுடன் சேர்த்து உண்ணப்பட்டது. நெல் சாகுபடியும் உணவில் அரிசி பெற்றிருந்த முக்கிய இடமும் பண்டைய தமிழ்ச் சமூகத்தில் வேளாண்மையின் சிறப்பை எடுத்துக்காட்டுகின்றன.',
    },
    Millets: {
      title: 'Millets — Thinai, Varagu and Kambu',
      ta: 'சிறுதானியங்கள் — தினை, வரகு, கம்பு',
      detail: 'Grains of the drier lands',
      en: 'Millets were important grains, particularly in regions where rainfall and soil conditions favoured their cultivation. Thinai (foxtail millet), varagu (kodo millet) and kambu (pearl millet) could be cooked as grains, made into porridge or prepared in other forms. Their importance illustrates how food habits adapted to local environments.',
      taText: 'மழைப்பொழிவு மற்றும் மண்ணின் தன்மை சிறுதானியச் சாகுபடிக்கு ஏற்ற பகுதிகளில், சிறுதானியங்கள் முக்கிய உணவாகப் பயன்பட்டன. தினை, வரகு மற்றும் கம்பு போன்ற தானியங்கள் வேகவைத்து உண்ணப்பட்டன; அவற்றைக் கொண்டு கூழ் உள்ளிட்ட உணவு வகைகளும் தயாரிக்கப்பட்டன. உள்ளூர் இயற்கைச் சூழலுக்கு ஏற்ப தமிழர்களின் உணவுப் பழக்கவழக்கங்கள் அமைந்திருந்ததை இவை எடுத்துக்காட்டுகின்றன.',
    },
    Porridge: {
      title: 'Porridge — Koozh',
      ta: 'கூழ்',
      detail: 'Everyday grain porridge',
      en: 'Koozh is a traditional porridge prepared using grains such as millet, and some versions use fermented grain mixtures. It provides a practical way to prepare a filling meal from locally available ingredients. Grain porridges have long been associated with everyday food traditions in Tamil regions, although specific recipes and ingredients vary.',
      taText: 'கூழ் என்பது சிறுதானியங்கள் உள்ளிட்ட தானியங்களைக் கொண்டு தயாரிக்கப்படும் பாரம்பரிய உணவாகும். சில வகைக் கூழ்கள் புளிக்கவைக்கப்பட்ட தானியக் கலவைகளிலிருந்தும் தயாரிக்கப்படுகின்றன. உள்ளூரில் கிடைக்கும் தானியங்களைக் கொண்டு வயிறு நிறைவான உணவைத் தயாரிக்க இம்முறை உதவியது. கூழ் தமிழர்களின் அன்றாட உணவுப் பாரம்பரியத்துடன் தொடர்புடையது; இருப்பினும், அதன் தயாரிப்பு முறையும் பொருட்களும் பகுதிக்கு ஏற்ப மாறுபடுகின்றன.',
    },
    'Lentils and Pulses': {
      title: 'Lentils and Pulses — Paruppu',
      ta: 'பருப்பு வகைகள்',
      detail: 'Household provisions',
      en: 'Pulses, including pigeon peas and black gram, contributed protein and variety to traditional meals. They could be boiled, mashed or combined with grains and spices. Pulses were useful ingredients because they could be stored dry and prepared when needed, making them valuable household provisions.',
      taText: 'துவரம் பருப்பு, உளுந்து உள்ளிட்ட பருப்பு வகைகள் பாரம்பரிய உணவுகளில் புரதச்சத்தையும் உணவு வகைகளில் பல்வகைத் தன்மையையும் வழங்கின. இவை வேகவைக்கப்பட்டும், மசிக்கப்பட்டும், தானியங்கள் மற்றும் மசாலாப் பொருட்களுடன் சேர்த்தும் தயாரிக்கப்பட்டன. உலர்ந்த பருப்பு வகைகளைச் சேமித்து, தேவையானபோது பயன்படுத்த முடிந்ததால் அவை வீடுகளில் முக்கிய உணவுப் பொருட்களாக விளங்கின.',
    },
    'Sesame and Sesame Oil': {
      title: 'Sesame and Sesame Oil — Ellu and Nallennai',
      ta: 'எள் மற்றும் நல்லெண்ணெய்',
      detail: 'Seed and pressed oil',
      en: 'Sesame was cultivated and used as a food ingredient. Sesame seeds could be incorporated into preparations, while sesame oil served as a cooking ingredient and had other traditional uses. Oil production also demonstrates the knowledge of processing seeds to obtain useful household products.',
      taText: 'எள் பாரம்பரியமாகப் பயிரிடப்பட்டு உணவுத் தயாரிப்பில் பயன்படுத்தப்பட்டது. எள் விதைகள் பல்வேறு உணவு வகைகளில் சேர்க்கப்பட்டன. எள்ளிலிருந்து பெறப்படும் நல்லெண்ணெய் சமையலுக்கும் பிற பாரம்பரியப் பயன்பாடுகளுக்கும் உதவியது. விதைகளிலிருந்து எண்ணெயைப் பிரித்தெடுக்கும் முறைகள், இயற்கைப் பொருட்களைப் பயனுள்ள வீட்டு உபயோகப் பொருட்களாக மாற்றிய அறிவையும் திறனையும் எடுத்துக்காட்டுகின்றன.',
    },
    'Spices and Seasonings': {
      title: 'Spices and Seasonings — Masala Porutkal',
      ta: 'மசாலாப் பொருட்களும் சுவையூட்டிகளும்',
      detail: 'Pepper · Ginger · Turmeric',
      en: 'Black pepper, ginger, turmeric and other aromatic ingredients were used in food preparation in different periods and regions. They added flavour and helped create varied dishes. Pepper was also an important trade commodity in the wider Indian Ocean trading world, connecting parts of southern India with overseas markets.',
      taText: 'மிளகு, இஞ்சி, மஞ்சள் மற்றும் பிற நறுமணமிக்க பொருட்கள் பல்வேறு காலகட்டங்களிலும் பகுதிகளிலும் உணவுத் தயாரிப்பில் பயன்படுத்தப்பட்டன. இவை உணவுகளுக்குச் சுவையையும் மணத்தையும் வழங்கின. மிளகு, இந்தியப் பெருங்கடல் வழியாக நடைபெற்ற வணிகத்தில் முக்கியப் பொருளாக விளங்கியது. இதன் மூலம் தென்னிந்தியாவின் சில பகுதிகள் வெளிநாட்டு வணிகச் சந்தைகளுடன் தொடர்புகொண்டன.',
    },
    Honey: {
      title: 'Honey — Then',
      ta: 'தேன்',
      detail: 'Gathered from the hills',
      en: 'Honey was collected from natural sources and used as a sweetener and food ingredient. References to honey and honey gathering appear in Tamil literary traditions, particularly in descriptions of landscapes and their natural resources. Its availability depended on local ecology and gathering practices.',
      taText: 'இயற்கையான தேன்கூடுகளிலிருந்து தேன் சேகரிக்கப்பட்டு, இனிப்பூட்டியாகவும் உணவுப் பொருளாகவும் பயன்படுத்தப்பட்டது. தமிழ் இலக்கிய மரபுகளில், குறிப்பாக நிலப்பரப்புகள் மற்றும் அவற்றின் இயற்கை வளங்களை விவரிக்கும் பாடல்களில், தேன் மற்றும் தேன் சேகரித்தல் தொடர்பான குறிப்புகள் காணப்படுகின்றன. தேனின் கிடைப்புத்தன்மை உள்ளூர் இயற்கைச் சூழல் மற்றும் சேகரிக்கும் முறைகளைப் பொறுத்து மாறுபட்டது.',
    },
    'Palm Products': {
      title: 'Palm Products — Panai Porutkal',
      ta: 'பனைப் பொருட்கள்',
      detail: 'Palmyra sap, sugar and jaggery',
      en: 'The palmyra palm provided several useful products. Palm sap could be consumed fresh or processed, while palm sugar and palm jaggery were used as sweeteners. Palm products were especially valuable in regions where the tree was abundant and formed part of local livelihoods.',
      taText: 'பனைமரம் பல்வேறு பயனுள்ள பொருட்களை வழங்கியது. பனைமரத்திலிருந்து பெறப்படும் பதநீர் புதிதாகப் பருகப்பட்டது அல்லது பிற முறைகளில் பதப்படுத்தப்பட்டது. பனை வெல்லம் மற்றும் பனங்கற்கண்டு போன்ற பொருட்கள் இனிப்பூட்டிகளாகப் பயன்படுத்தப்பட்டன. பனைமரம் அதிகமாகக் காணப்பட்ட பகுதிகளில், அதன் விளைபொருட்கள் உணவுப் பழக்கங்களிலும் மக்களின் வாழ்வாதாரத்திலும் முக்கியப் பங்கு வகித்தன.',
    },
    'Traditional Beverages': {
      title: 'Traditional Beverages',
      ta: 'பாரம்பரியப் பானங்கள்',
      detail: 'Buttermilk · Padaneer',
      en: 'Traditional beverages included buttermilk and drinks prepared from locally available ingredients. In palmyra-growing regions, fresh palm sap, known as padaneer, was also consumed. Fermented beverages existed in some historical contexts, but their ingredients and use differed according to community and period.',
      taText: 'பாரம்பரியப் பானங்களில் மோர் மற்றும் உள்ளூரில் கிடைக்கும் பொருட்களைக் கொண்டு தயாரிக்கப்பட்ட பானங்கள் இடம்பெற்றன. பனைமரங்கள் அதிகமாகக் காணப்பட்ட பகுதிகளில், பனைமரத்திலிருந்து பெறப்படும் புதிய பதநீரும் பருகப்பட்டது. சில வரலாற்றுக் காலகட்டங்களில் நொதிக்கவைக்கப்பட்ட பானங்களும் பயன்பாட்டில் இருந்தன. அவற்றின் தயாரிப்பு முறைகளும் பயன்பாடுகளும் சமூகத்திற்கும் காலகட்டத்திற்கும் ஏற்ப மாறுபட்டன.',
    },
    'Banana-Leaf Meals': {
      title: 'Meals Served on Banana Leaves',
      ta: 'வாழை இலையில் பரிமாறப்பட்ட உணவுகள்',
      detail: 'Serving tradition',
      en: 'Banana leaves provided a convenient surface for serving food in regions where the plant was available. Rice or millet could be served alongside vegetables, pulses, fish, meat and other accompaniments. Leaf-based serving traditions remain visible in Tamil food culture today, although their historical forms varied.',
      taText: 'வாழைமரம் கிடைக்கும் பகுதிகளில், அதன் இலை உணவைப் பரிமாறுவதற்கான எளிய தளமாகப் பயன்படுத்தப்பட்டது. அரிசி அல்லது சிறுதானியங்களுடன் காய்கறிகள், பருப்பு வகைகள், மீன், இறைச்சி மற்றும் பிற உணவுகள் பரிமாறப்பட்டன. வாழை இலையில் உணவு பரிமாறும் பாரம்பரியம் இன்றும் தமிழர் உணவுப் பண்பாட்டில் காணப்படுகிறது. இருப்பினும், அதன் வரலாற்றுப் பயன்பாட்டு முறைகள் காலத்திற்கும் பகுதிக்கும் ஏற்ப மாறுபட்டன.',
    },
  },

  '5 lanscapes food': {
    Kurinji: {
      title: 'Kurinji — Mountain Landscape',
      ta: 'குறிஞ்சி — மலைநிலம்',
      detail: 'Mountains, forests, hunting and gathering',
      en: 'Kurinji represents mountainous regions where hunting, gathering forest produce and cultivating suitable crops were important ways of obtaining food. Classical Tamil descriptions associate this landscape with millet, honey, wild fruits and foods obtained from hunting. Foods associated with Kurinji: thinai (foxtail millet), honey, wild fruits, bamboo rice where the bamboo flowered, forest tubers and roots, meat from hunting, and edible greens and nuts. Typical food picture: millet with honey, gathered fruits and roots, alongside meat obtained through hunting.',
      taText: 'குறிஞ்சி என்பது மலைப்பகுதிகளைக் குறிக்கும். இப்பகுதிகளில் வாழ்ந்த மக்கள் வேட்டையாடுதல், காடுகளில் கிடைக்கும் உணவுப் பொருட்களைச் சேகரித்தல், நிலத்திற்கேற்ற பயிர்களைப் பயிரிடுதல் போன்ற வழிகளில் உணவைப் பெற்றனர். சங்க இலக்கியங்களில் குறிஞ்சி நிலத்துடன் தினை, தேன், காட்டுப் பழங்கள், வேட்டையின் மூலம் கிடைத்த உணவுகள் தொடர்புபடுத்தப்படுகின்றன. தொடர்புடைய உணவுகள்: தினை, தேன், காட்டுப் பழங்கள், மூங்கில் அரிசி, கிழங்குகளும் வேர்களும், வேட்டையில் கிடைத்த இறைச்சி, உண்ணக்கூடிய கீரைகளும் கொட்டைகளும். வழக்கமான உணவுக் காட்சி: தேனுடன் தினை, காட்டுப் பழங்கள், கிழங்குகள், வேட்டையின் மூலம் கிடைத்த இறைச்சி.',
    },
    Mullai: {
      title: 'Mullai — Pastoral Landscape',
      ta: 'முல்லை — மேய்ச்சல் நிலம்',
      detail: 'Woodlands, grazing lands and cattle herding',
      en: 'Mullai represents pastoral and woodland areas associated with cattle herding and the lives of herders. Milk and dairy products were important food resources, while grains and other ingredients were obtained through cultivation, exchange and local gathering. Foods associated with Mullai: milk (paal), curd (thayir), buttermilk (mor), butter (vennai), thinai and varagu millets, rice and other grains acquired by farming or exchange, and in some communities meat. Typical food picture: millet or rice accompanied by curd or buttermilk, with milk and other dairy products as important foods.',
      taText: 'முல்லை என்பது காடுகளையும் மேய்ச்சல் நிலங்களையும் சார்ந்த பகுதிகளைக் குறிக்கிறது. இந்நிலத்துடன் கால்நடை வளர்ப்பும் ஆயர்களின் வாழ்க்கை முறையும் தொடர்புடையவை. பால் மற்றும் பால் சார்ந்த பொருட்கள் முக்கிய உணவு வளங்களாக விளங்கின; தானியங்கள் பயிரிடுதல், பரிமாற்றம், உள்ளூரில் சேகரித்தல் வழியாகக் கிடைத்தன. தொடர்புடைய உணவுகள்: பால், தயிர், மோர், வெண்ணெய், தினை, வரகு, அரிசி மற்றும் பிற தானியங்கள், சில சமூகங்களில் இறைச்சி. வழக்கமான உணவுக் காட்சி: தினை அல்லது அரிசியுடன் தயிர் அல்லது மோர்; பாலும் பால் பொருட்களும் முக்கிய இடம் பெற்ற உணவுமுறை.',
    },
    Marutham: {
      title: 'Marutham — Agricultural Plains',
      ta: 'மருதம் — வேளாண்மை நிலம்',
      detail: 'Fertile fields, rivers, farming and settled villages',
      en: 'Marutham represents fertile agricultural plains, particularly areas suited to rice cultivation. Farming supported settled communities, and the availability of cultivated crops allowed for a varied diet. Foods associated with Marutham: rice, pulses, seasonal vegetables and greens, sugarcane juice and sweets, fish from rivers and ponds, meat according to the community, fruits, and sesame and its oil. Typical food picture: cooked rice served with pulses, vegetables and, where available, fish or meat.',
      taText: 'மருதம் என்பது குறிப்பாக நெல் சாகுபடிக்கு ஏற்ற வளமான சமவெளிப் பகுதிகளைக் குறிக்கிறது. வேளாண்மை இப்பகுதி மக்களின் வாழ்க்கைக்கு ஆதாரமாக இருந்தது; பயிரிடப்பட்ட உணவுப் பொருட்கள் கிடைத்ததால் பல்வேறு உணவுகளைத் தயாரிக்க முடிந்தது. தொடர்புடைய உணவுகள்: அரிசி, பருப்பு வகைகள், பருவகாலக் காய்கறிகளும் கீரைகளும், கரும்புச் சாறும் இனிப்புகளும், ஆறுகளிலும் குளங்களிலும் கிடைத்த மீன், சமூகத்தைப் பொறுத்து இறைச்சி, பழங்கள், எள்ளும் எண்ணெயும். வழக்கமான உணவுக் காட்சி: பருப்பு, காய்கறிகள், கிடைப்புத்தன்மைக்கு ஏற்ப மீன் அல்லது இறைச்சியுடன் சமைத்த அரிசி.',
    },
    Neithal: {
      title: 'Neithal — Coastal Landscape',
      ta: 'நெய்தல் — கடற்கரை நிலம்',
      detail: 'Seashores, fishing communities and maritime trade',
      en: 'Neithal represents coastal regions where fishing, salt production and maritime activities were important. Fish and other seafood were major local resources, and coastal communities traded with inland settlements for grains and other agricultural products. Foods associated with Neithal: fresh fish, dried fish (karuvadu), prawns, crabs and shellfish, salt from the coastal salt pans, rice by cultivation or trade, coconut, and seafood cooked with local spices. Typical food picture: fish or dried fish served with rice, with other seafood and local ingredients.',
      taText: 'நெய்தல் என்பது கடற்கரைப் பகுதிகளைக் குறிக்கிறது. இங்கு மீன்பிடித்தல், உப்பு தயாரித்தல், கடல் சார்ந்த தொழில்கள் முக்கியப் பங்கு வகித்தன. மீன்களும் பிற கடல் உணவுகளும் முக்கிய உணவு வளங்கள்; கடற்கரை மக்கள் உள்நாட்டுப் பகுதிகளுடன் வணிகம் செய்து தானியங்களைப் பெற்றனர். தொடர்புடைய உணவுகள்: மீன், கருவாடு, இறால், நண்டு, சிப்பி வகைகள், உப்பளங்களில் தயாரான உப்பு, பயிரிடுதல் அல்லது வணிகம் மூலம் கிடைத்த அரிசி, தேங்காய், மசாலாப் பொருட்களுடன் சமைத்த கடல் உணவுகள். வழக்கமான உணவுக் காட்சி: அரிசியுடன் மீன் அல்லது கருவாடு, மேலும் பிற கடல் உணவுகள்.',
    },
    Palai: {
      title: 'Palai — Arid and Drought-Affected Landscape',
      ta: 'பாலை — வறண்ட நிலம்',
      detail: 'Dry conditions, travel and survival',
      en: 'Classical Tamil tradition describes Palai as a landscape formed when other regions, particularly Kurinji or Mullai, suffer severe heat and drought — not simply a permanently separate desert. It is associated with difficult journeys, limited water and the challenge of finding food. Provisions associated with Palai: hardy millets such as kambu and varagu, dry grains carried on journeys, dried meat where such preparation was practised, dried fruits and gathered foods, roots and tubers, and above all water. Sangam poems describe the hardships of travellers but give no single menu, so these are possible provisions rather than a fixed diet.',
      taText: 'சங்க இலக்கிய மரபின்படி, குறிஞ்சி அல்லது முல்லை போன்ற நிலங்கள் கடுமையான வெப்பத்தாலும் வறட்சியாலும் பாதிக்கப்படும்போது பாலை நிலத்தின் தன்மையைப் பெறுகின்றன; பாலை எப்போதும் தனியாக இருந்த நிரந்தரப் பாலைவனம் அன்று. கடினமான பயணங்கள், குறைந்த நீர்வளம், உணவைப் பெறுவதில் உள்ள சவால்கள் இந்நிலத்துடன் தொடர்புடையவை. தொடர்புடைய உணவுகள்: கம்பு, வரகு போன்ற சிறுதானியங்கள், பயணத்தில் எடுத்துச் செல்லக்கூடிய உலர் தானியங்கள், உலர்த்தப்பட்ட இறைச்சி, உலர்ந்த பழங்கள், கிழங்குகள், இன்றியமையாத நீர். சங்க இலக்கியங்கள் ஒரே நிலையான உணவுப் பட்டியலைத் தருவதில்லை; எனவே இவை கிடைப்புத்தன்மைக்கு ஏற்பப் பயன்பட்டிருக்கக்கூடிய உணவுகளே.',
    },
  },
};

/** The order the five landscapes are shown in, as the Tamil tradition lists them. */
export const LANDSCAPE_ORDER = ['Kurinji', 'Mullai', 'Marutham', 'Neithal', 'Palai'];

const historicalNote = {
  id: 'food-historical-note',
  title: { en: 'A Note on the Evidence', ta: 'வரலாற்றுக் குறிப்பு' },
  body: {
    en: 'These are food traditions associated with the landscapes and communities of Sangam literature, not fixed menus followed by every person. What people ate varied by period, community, season and trade. The photographs are modern illustrative reconstructions of the foods the texts describe, not ancient dishes.',
    ta: 'இங்கு குறிப்பிடப்படும் உணவுகள் சங்க இலக்கியங்கள் விவரிக்கும் நிலப்பகுதிகளுடனும் சமூகங்களுடனும் தொடர்புடைய உணவுப் பாரம்பரியங்களாகும்; ஒவ்வொருவரும் உண்ட நிலையான உணவுப் பட்டியல் அல்ல. உணவுப் பழக்கவழக்கங்கள் காலம், சமூகம், பருவநிலை, வணிகத் தொடர்புகளுக்கு ஏற்ப மாறுபட்டன. இங்குள்ள படங்கள், நூல்கள் விவரிக்கும் உணவுகளின் இன்றைய விளக்க மீளுருவாக்கங்களே; பண்டைய உணவுகள் அல்ல.',
  },
};

export const FOOD_PANELS = {
  'ainthinai-foods': [
    {
      id: 'five-landscapes-food',
      title: { en: 'Foods of the Five Landscapes of Ancient Tamilakam', ta: 'பண்டைய தமிழகம் — ஐவகை நிலங்களின் உணவுப் பண்பாடு' },
      body: {
        en: 'In classical Tamil literature the five tinai landscapes — Kurinji, Mullai, Marutham, Neithal and Palai — describe not only geography but also people’s occupations, natural resources, emotions and ways of life. Their food traditions were shaped by what each landscape could provide: honey and millet in the hills, milk and curd in the pastures, rice in the river plains, fish and salt on the shore, and carried provisions on the dry roads of Palai.',
        ta: 'பண்டைய தமிழ் இலக்கியங்களில் குறிப்பிடப்படும் ஐவகைத் திணைகள் — குறிஞ்சி, முல்லை, மருதம், நெய்தல், பாலை — நில அமைப்பை மட்டுமல்லாமல், மக்களின் தொழில்கள், இயற்கை வளங்கள், உணர்வுகள், வாழ்க்கை முறைகளையும் எடுத்துரைக்கின்றன. ஒவ்வொரு நிலமும் தந்ததற்கு ஏற்ப உணவுப் பழக்கங்கள் அமைந்தன: மலையில் தேனும் தினையும், மேய்ச்சல் நிலத்தில் பாலும் தயிரும், ஆற்றுச் சமவெளியில் அரிசி, கடற்கரையில் மீனும் உப்பும், பாலையின் வறண்ட வழிகளில் எடுத்துச் சென்ற உணவுகள்.',
      },
    },
    historicalNote,
  ],

  household: [
    {
      id: 'food-of-the-home',
      title: { en: 'Food in the Tamil Home', ta: 'தமிழர் இல்லத்தின் உணவு' },
      body: {
        en: 'Ancient Tamil food habits were shaped by the land, climate, occupation and the seasonal availability of ingredients. In the home, grains were pounded in the ural and ground on the ammi, pulses were stored dry in earthen jars, and meals of rice or millet, porridge and buttermilk were cooked in clay pots and served on banana leaves. The objects in this room were made for exactly this work.',
        ta: 'பண்டைய தமிழர்களின் உணவுப் பழக்கவழக்கங்கள் அவர்கள் வாழ்ந்த நிலப்பரப்பு, காலநிலை, தொழில், பருவகாலங்களில் கிடைத்த உணவுப் பொருட்கள் ஆகியவற்றின் அடிப்படையில் அமைந்திருந்தன. இல்லத்தில் தானியங்கள் உரலில் இடிக்கப்பட்டு அம்மியில் அரைக்கப்பட்டன; பருப்பு வகைகள் மண்குடங்களில் உலர வைத்துச் சேமிக்கப்பட்டன; அரிசி அல்லது சிறுதானிய உணவும் கூழும் மோரும் மண்பானைகளில் சமைக்கப்பட்டு வாழை இலையில் பரிமாறப்பட்டன. இவ்வறையின் கருவிகள் இப்பணிக்கே உருவானவை.',
      },
    },
    historicalNote,
  ],

  'trade-foods': [
    {
      id: 'food-and-trade',
      title: { en: 'Foods that Travelled', ta: 'பயணித்த உணவுப் பொருட்கள்' },
      body: {
        en: 'Food moved along the same roads and sea lanes as cloth, beads and coins. Coastal communities exchanged fish and salt for the grain of the inland villages, and pepper, ginger and turmeric from the Tamil country reached markets across the Indian Ocean — pepper above all, one of the most sought-after goods carried from the ports of southern India. Sesame oil, palm jaggery and honey were valued household goods that also changed hands in markets.',
        ta: 'துணி, மணிகள், காசுகள் பயணித்த அதே சாலைகளிலும் கடல் வழிகளிலும் உணவுப் பொருட்களும் பயணித்தன. கடற்கரை மக்கள் மீனையும் உப்பையும் உள்நாட்டு ஊர்களின் தானியங்களுக்குப் பரிமாறிக்கொண்டனர்; தமிழகத்தின் மிளகு, இஞ்சி, மஞ்சள் இந்தியப் பெருங்கடலெங்கும் உள்ள சந்தைகளை அடைந்தன — அவற்றுள் தென்னிந்தியத் துறைமுகங்களிலிருந்து மிகவும் தேடப்பட்ட பொருள் மிளகு. நல்லெண்ணெய், பனை வெல்லம், தேன் ஆகியவையும் சந்தைகளில் கைமாறிய மதிப்புமிக்க பொருட்கள்.',
      },
    },
    historicalNote,
  ],

  /* The five tinai of Tamil poetics, as the Tolkappiyam's Porulathikaram sets them out. */
  'ainthinai-landscapes': [
    {
      id: 'tinai-poetics',
      title: { en: 'Ainthinai — The Five Landscapes of Love', ta: 'ஐந்திணை — அகத்தின் ஐந்து நிலங்கள்' },
      body: {
        en: 'Tamil poetics gives each mood of love a landscape. The Tolkappiyam names the land (nilam) and the time (pozhuthu) of each tinai as its first elements (mutharporul), its gods, people, food, birds, flowers and music as its native elements (karupporul), and the phase of love it carries as its theme (uripporul). A single flower or bird in a Sangam poem is enough to set the whole scene — and the listener knows at once whether the lovers meet, wait, quarrel, pine or part.',
        ta: 'தமிழ் இலக்கணம் அகத்தின் ஒவ்வோர் உணர்வுக்கும் ஒரு நிலத்தை வகுக்கிறது. தொல்காப்பியம், ஒவ்வொரு திணைக்கும் நிலமும் பொழுதும் ஆகிய முதற்பொருளையும், தெய்வம், மக்கள், உணவு, பறவை, பூ, இசை முதலிய கருப்பொருளையும், அது சுட்டும் காதல் நிலையாகிய உரிப்பொருளையும் வகுத்துரைக்கிறது. சங்கப் பாடலில் ஒரு பூவோ ஒரு பறவையோ போதும் — தலைவனும் தலைவியும் கூடுகிறார்களா, காத்திருக்கிறார்களா, ஊடுகிறார்களா, இரங்குகிறார்களா, பிரிகிறார்களா என்பது உடனே புலனாகும்.',
      },
    },
    {
      id: 'tinai-kurinji',
      title: { en: 'Kurinji — Mountains · Union', ta: 'குறிஞ்சி — மலை · புணர்தல்' },
      body: {
        en: 'The mountains and the land around them, at midnight in the cool season. Its god is Murugan (Seyon), and its flower the kurinji, which blooms once in twelve years. Its theme is punarthal, the lovers’ secret meeting. Its people gather honey, guard the millet fields from parrots and hunt in the forest.',
        ta: 'மலையும் மலை சார்ந்த இடமும்; கூதிர்க் கால யாமம். தெய்வம் சேயோன் (முருகன்); பூ — பன்னிரண்டு ஆண்டுகளுக்கு ஒருமுறை பூக்கும் குறிஞ்சி. உரிப்பொருள் — புணர்தல். மக்கள் தேன் எடுத்தும், தினைப்புனம் காத்தும், வேட்டையாடியும் வாழ்ந்தனர்.',
      },
    },
    {
      id: 'tinai-mullai',
      title: { en: 'Mullai — Forest and Pasture · Waiting', ta: 'முல்லை — காடு · இருத்தல்' },
      body: {
        en: 'The woodland and pastures, in the evening of the rainy season. Its god is Mayon (Thirumal), and its flower the jasmine (mullai). Its theme is iruthal — patient waiting, as the heroine waits for her husband to return before the rains. Its people are herders who tend cattle and churn curd and butter.',
        ta: 'காடும் காடு சார்ந்த இடமும்; கார் காலத்து மாலை. தெய்வம் மாயோன்; பூ — முல்லை. உரிப்பொருள் — இருத்தல்: கார் காலத்துக்குள் திரும்புவேன் என்று சென்ற தலைவனுக்காகத் தலைவி ஆற்றியிருத்தல். மக்கள் ஆநிரை மேய்க்கும் ஆயர்; தயிர் கடைந்து வெண்ணெய் எடுத்தனர்.',
      },
    },
    {
      id: 'tinai-marutham',
      title: { en: 'Marutham — Fields · Lovers’ Quarrels', ta: 'மருதம் — வயல் · ஊடல்' },
      body: {
        en: 'The cultivated fields and river plains, at dawn in every season. Its god is Vendhan (Indra), and its tree the marutham. Its theme is oodal, the sulking quarrel of a wife with a husband who has strayed. Its people are farmers of the rich paddy lands, the source of the kings’ wealth.',
        ta: 'வயலும் வயல் சார்ந்த இடமும்; எல்லாப் பருவத்தின் வைகறை. தெய்வம் வேந்தன்; மரம் — மருதம். உரிப்பொருள் — ஊடல்: பரத்தையிற் பிரிந்த தலைவனுடன் தலைவி கொள்ளும் ஊடல். மக்கள் வளமான நெல்வயல்களின் உழவர்; அரசுகளின் செல்வத்தின் ஊற்று இந்நிலமே.',
      },
    },
    {
      id: 'tinai-neithal',
      title: { en: 'Neithal — Seashore · Pining', ta: 'நெய்தல் — கடல் · இரங்கல்' },
      body: {
        en: 'The sea and the shore, at dusk in every season. Its god is Varunan, lord of the waters, and its flower the blue water-lily (neithal). Its theme is irangal — anxious pining as the heroine watches the sea for her lover’s boat. Its people fish, dry their catch and make salt in the coastal pans.',
        ta: 'கடலும் கடல் சார்ந்த இடமும்; எல்லாப் பருவத்தின் எற்பாடு (மாலை). தெய்வம் வருணன்; பூ — நெய்தல். உரிப்பொருள் — இரங்கல்: தலைவனின் வருகைக்காகக் கடலை நோக்கித் தலைவி வருந்துதல். மக்கள் மீன் பிடித்தும், கருவாடு உலர்த்தியும், உப்பு விளைவித்தும் வாழ்ந்தனர்.',
      },
    },
    {
      id: 'tinai-palai',
      title: { en: 'Palai — The Parched Land · Separation', ta: 'பாலை — சுரம் · பிரிதல்' },
      body: {
        en: 'Not a land of its own: Kurinji or Mullai, when the summer burns them dry, at midday. Its goddess is Kotravai, and its tree the palai. Its theme is pirithal — separation, as the hero crosses the wasteland in search of wealth or learning, or the lovers elope across it. Its poems are of hard roads, little water and the dangers of the journey.',
        ta: 'தனி நிலம் அன்று: முல்லையும் குறிஞ்சியும் முறைமையில் திரிந்து, கோடையில் வறண்டு உருவாவது பாலை; பொழுது நண்பகல். தெய்வம் கொற்றவை; மரம் — பாலை. உரிப்பொருள் — பிரிதல்: பொருள் தேடவோ கல்வி பெறவோ தலைவன் சுரம் கடந்து செல்லுதல், அல்லது தலைவனும் தலைவியும் உடன்போக்கு மேற்கொள்ளுதல். கடினமான பாதைகளும் நீரின்மையும் பயணத்தின் இடர்களுமே இதன் பாடல்கள்.',
      },
    },
  ],

  'ainthinai-manuscripts': [
    {
      id: 'tinai-on-leaves',
      title: { en: 'Thinai on Palm Leaves', ta: 'ஓலையில் திணைப் பாடல்கள்' },
      body: {
        en: 'Several works of the Eighteen Minor Classics (Pathinenkilkanakku) arrange their verses landscape by landscape: Aintinai Aimpathu and Tinaimozhi Aimpathu give ten verses to each tinai, Aintinai Ezhupathu fourteen, and Tinaimalai Nurraimpathu about thirty; Kainnilai too follows the five lands. Among the Sangam anthologies, Ainkurunuru gives a hundred short poems to each. Here they are in the palm-leaf bundles in which they were copied and kept — untie a bundle to turn its leaves.',
        ta: 'பதினெண் கீழ்க்கணக்கு நூல்களில் சில தம் பாடல்களைத் திணை திணையாக அமைக்கின்றன: ஐந்திணை ஐம்பதும் திணைமொழி ஐம்பதும் ஒவ்வொரு திணைக்கும் பத்துப் பாடல்கள், ஐந்திணை எழுபது பதினான்கு, திணைமாலை நூற்றைம்பது ஏறத்தாழ முப்பது; கைந்நிலையும் ஐந்து நிலங்களையே பின்பற்றுகிறது. சங்கத் தொகைகளுள் ஐங்குறுநூறு ஒவ்வொரு திணைக்கும் நூறு சிறு பாடல்களைத் தருகிறது. அவை படியெடுக்கப்பட்டுக் காக்கப்பட்ட ஓலைச்சுவடிகளிலேயே இங்கே உள்ளன — ஒரு கட்டை அவிழ்த்து ஏடுகளைப் புரட்டுங்கள்.',
      },
    },
  ],
};
