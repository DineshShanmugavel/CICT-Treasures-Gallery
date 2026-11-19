/**
 * Text catalogues shown in the flip-book viewer for wings that do not yet have
 * scanned PDFs. Each catalogue is a list of pages ({ heading, body }); the viewer
 * adds a cover automatically. Curators can replace any entry with a `pdfUrl` item.
 */

export const sangamGuide = {
  id: 'sangam-guide',
  title: 'A Visitor’s Guide to Sangam Literature',
  tamil: 'சங்க இலக்கிய வழிகாட்டி',
  description: {
    en: 'A short illustrated guide for visitors: what the Sangam poems are, how they are grouped, and how akam and puram poems and the five landscapes work.',
    ta: 'பார்வையாளர்களுக்கான சிறு வழிகாட்டி: சங்க இலக்கியம் என்றால் என்ன, அவை எவ்வாறு தொகுக்கப்பட்டுள்ளன, அகம் – புறம், ஐந்திணை ஆகியவை எவ்வாறு அமைகின்றன என்பதை எளிமையாக விளக்குகிறது.',
  },
  pages: [
    {
      heading: 'The Sangam Corpus',
      body: 'Sangam literature is the earliest body of Tamil poetry. It is traditionally grouped into two great collections: the Eight Anthologies (Ettuthokai) and the Ten Idylls (Pattuppattu). Together they preserve more than two thousand poems by several hundred poets, among them women, kings, and wandering bards.',
    },
    {
      heading: 'Ettuthokai — The Eight Anthologies',
      body: 'Natrinai, Kurunthokai, Ainkurunuru, Pathitrupathu, Paripadal, Kalithokai, Akananuru, and Purananuru. Most are collections of short lyrics, arranged by length, theme, or subject.',
    },
    {
      heading: 'Pattuppattu — The Ten Idylls',
      body: 'Thirumurugatrupadai, Porunaratrupadai, Sirupanatrupadai, Perumpanatrupadai, Mullaippattu, Maduraikkanchi, Nedunalvadai, Kurinjippattu, Pattinappalai, and Malaipadukadam. These longer poems include the “guide poems” (atrupadai), in which one bard directs another to a generous patron.',
    },
    {
      heading: 'Akam and Puram',
      body: 'Sangam poems are classed as akam (the inner world of love) or puram (the outer world of war, kingship, generosity, and ethics). Akam poems never name their lovers; they speak through types — the heroine, the hero, the friend, the foster-mother.',
    },
    {
      heading: 'The Five Landscapes (Tinai)',
      body: 'Kurinji — mountains, union of lovers.\nMullai — forests, patient waiting.\nMarutham — farmland, lovers’ quarrels.\nNeythal — seashore, anxious longing.\nPalai — arid land, separation.\nEach landscape carries its own season, time of day, flowers, birds, and gods, giving the poems a rich shared vocabulary of images.',
    },
    {
      heading: 'Reading in This Wing',
      body: 'The cabinets in this wing hold CICT editions of the Ten Idylls and the Eight Anthologies. Open a glass door, choose a volume, and turn its pages in the reader. Each volume can also be downloaded for study.',
    },
  ],
};

export const coinCatalogs = [
  {
    id: 'sangam-age-coins',
    title: 'Coins of the Sangam Age',
    tamil: 'சங்க காலக் காசுகள்',
    description: {
      en: 'A catalogue of the coins issued by the Chera, Chola, and Pandya kings, with their royal emblems of the bow, the tiger, and the fish.',
      ta: 'சேர, சோழ, பாண்டிய மன்னர்கள் வெளியிட்ட காசுகளையும், அவற்றில் உள்ள வில், புலி, மீன் ஆகிய அரச இலச்சினைகளையும் விளக்கும் அட்டவணை.',
    },
    pages: [
      {
        heading: 'Money of the Three Crowned Kings',
        body: 'The Chera, Chola, and Pandya dynasties each issued coins bearing their royal emblems: the bow (Chera), the tiger (Chola), and the fish (Pandya). Most early Tamil coins were struck in copper, with some in silver and lead.',
      },
      {
        heading: 'Pandya Coins',
        body: 'Early Pandya coins are often square copper pieces. They commonly show the fish emblem, sometimes paired with an elephant, a horse, or other auspicious symbols on the obverse.',
      },
      {
        heading: 'Chera Coins',
        body: 'Chera coins carry the bow-and-arrow emblem. Finds from the Amaravati riverbed near Karur include rare portrait coins with Tamil-Brahmi legends naming Chera rulers, such as “Makkotai” and “Kuttuvan Kotai”.',
      },
      {
        heading: 'Chola Coins',
        body: 'Early Chola issues bear the tiger emblem. Many later Chola copper coins, such as those of Rajaraja I, show a standing king on one side and a seated figure on the other, with the legend “Sri Rajaraja”.',
      },
      {
        heading: 'Collecting Notes',
        body: 'Many coins of this period come from riverbeds and excavation sites, where centuries of wear have softened their designs. Reading them often depends on comparing many specimens of the same type.',
      },
    ],
  },
  {
    id: 'roman-trade-coins',
    title: 'Roman Coins in the Tamil Country',
    tamil: 'தமிழகத்தில் உரோமானியக் காசுகள்',
    description: {
      en: 'How Roman gold and silver coins reached the Tamil country through the ancient sea trade in pepper, pearls, and fine cloth.',
      ta: 'மிளகு, முத்து, நுண்ணிய ஆடைகள் ஆகியவற்றின் பழங்கால கடல் வணிகத்தின் வழியாக உரோமானியப் பொன், வெள்ளிக் காசுகள் தமிழகத்தை வந்தடைந்த வரலாற்றைக் கூறுகிறது.',
    },
    pages: [
      {
        heading: 'Yavana Trade',
        body: 'Sangam poems describe the Yavanas — foreign merchants from the Mediterranean — arriving in Tamil ports with gold and leaving with pepper, pearls, and fine textiles.',
      },
      {
        heading: 'Hoards of Gold and Silver',
        body: 'Hoards of Roman gold aurei and silver denarii, many from the reigns of Augustus and Tiberius, have been found in Tamil Nadu, especially in the Coimbatore and Karur regions along the inland trade routes.',
      },
      {
        heading: 'Arikamedu',
        body: 'The ancient port of Arikamedu near Puducherry yielded Roman amphorae, Arretine pottery, and glass, confirming that trade between the Tamil coast and the Roman world was regular and substantial.',
      },
    ],
  },
  {
    id: 'medieval-dynastic-coins',
    title: 'Coins of the Medieval Dynasties',
    tamil: 'இடைக்கால அரச மரபுக் காசுகள்',
    description: {
      en: 'Coins of the Pallavas, the later Pandyas, and the Vijayanagara and Nayaka rulers, and the symbols they carried.',
      ta: 'பல்லவர், பிற்காலப் பாண்டியர், விஜயநகர, நாயக்க மன்னர்களின் காசுகளையும் அவற்றில் இடம்பெற்ற சின்னங்களையும் விளக்குகிறது.',
    },
    pages: [
      {
        heading: 'Pallava Coins',
        body: 'Pallava coins frequently show a bull or a lion, both closely linked with the dynasty. Many are small copper and lead pieces.',
      },
      {
        heading: 'Later Pandya Coins',
        body: 'The revived Pandya kingdom continued to use the fish emblem, often showing a pair of fish, sometimes with a sceptre or lamp.',
      },
      {
        heading: 'Vijayanagara and After',
        body: 'Under Vijayanagara and the Nayakas, small gold pagodas and fanams circulated widely across the Tamil country, depicting deities, divine couples, and animals.',
      },
    ],
  },
];

export const sculptureCatalogs = [
  {
    id: 'chola-bronzes',
    title: 'Chola Bronzes',
    tamil: 'சோழர் செப்புத் திருமேனிகள்',
    description: {
      en: 'The world-famous Chola bronzes: how they were made by the lost-wax method, the Nataraja image, and the living craft of Swamimalai.',
      ta: 'உலகப் புகழ்பெற்ற சோழர் செப்புத் திருமேனிகள்: மெழுகு வார்ப்பு முறையில் அவை உருவாக்கப்பட்ட விதம், நடராசர் திருவுருவம், இன்றும் தொடரும் சுவாமிமலைக் கலைமரபு ஆகியவற்றை விளக்குகிறது.',
    },
    pages: [
      {
        heading: 'The Art of the Lost-Wax',
        body: 'Chola bronzes were cast using the lost-wax method: a figure is modelled in wax, coated in clay, and heated so that the wax runs out, leaving a mould for molten metal. Each mould is broken to release its casting, so every icon is unique.',
      },
      {
        heading: 'Nataraja',
        body: 'The image of Shiva as Nataraja, Lord of the Dance, dancing within a ring of flames, is the most celebrated Chola bronze form. It expresses the cosmic cycle of creation, preservation, and dissolution.',
      },
      {
        heading: 'Processional Icons',
        body: 'Many bronzes were made as festival icons (utsava murti), carried through temple streets on chariots. Lugs on their pedestals allowed poles to be passed through for carrying.',
      },
      {
        heading: 'A Living Tradition',
        body: 'At Swamimalai near Kumbakonam, families of sthapatis (sculptors) still cast bronzes using the traditional lost-wax technique.',
      },
    ],
  },
  {
    id: 'pallava-stone',
    title: 'Pallava Stone Sculpture',
    tamil: 'பல்லவர் கற்சிற்பங்கள்',
    description: {
      en: 'The rock-cut and structural monuments of Mamallapuram carved under the Pallavas, including the great relief and the Five Rathas.',
      ta: 'பல்லவர் காலத்தில் மாமல்லபுரத்தில் செதுக்கப்பட்ட குடைவரைக் கோயில்கள், பெரும் புடைப்புச் சிற்பம், ஐந்து இரதங்கள் ஆகியவற்றை விளக்குகிறது.',
    },
    pages: [
      {
        heading: 'Mamallapuram',
        body: 'The monuments of Mamallapuram, carved mainly in the 7th and 8th centuries CE, include rock-cut cave temples, monolithic rathas, and the structural Shore Temple. The group is a UNESCO World Heritage Site.',
      },
      {
        heading: 'The Great Relief',
        body: 'A vast open-air relief carved across two boulders, known as Arjuna’s Penance or the Descent of the Ganga, shows gods, sages, animals, and a life-size elephant family converging on a natural cleft.',
      },
      {
        heading: 'The Five Rathas',
        body: 'The Pancha Rathas are monolithic shrines each carved from a single outcrop, displaying a range of temple architectural forms in stone.',
      },
    ],
  },
  {
    id: 'temples-and-hero-stones',
    title: 'Temples & Hero Stones',
    tamil: 'கோயில்களும் நடுகற்களும்',
    description: {
      en: 'Hero stones raised for fallen warriors, and the great Chola temples of Thanjavur and Darasuram.',
      ta: 'போரில் உயிர்நீத்த வீரர்களுக்காக நடப்பட்ட நடுகற்களையும், தஞ்சாவூர், தாராசுரம் ஆகிய இடங்களில் உள்ள சோழர் பெருங்கோயில்களையும் விளக்குகிறது.',
    },
    pages: [
      {
        heading: 'Hero Stones (Nadukal)',
        body: 'Hero stones were raised in memory of warriors who fell in battle or in defending cattle. The Tolkappiyam describes the rites of setting up such a stone, and many carry carved figures and inscriptions.',
      },
      {
        heading: 'Brihadeeswarar Temple, Thanjavur',
        body: 'Completed by Rajaraja Chola I around 1010 CE, the great temple at Thanjavur is crowned by a towering vimana. It forms part of the UNESCO World Heritage Site of the Great Living Chola Temples.',
      },
      {
        heading: 'Airavatesvara Temple, Darasuram',
        body: 'Built in the 12th century under Rajaraja II, this temple is renowned for its finely detailed miniature sculptures and the chariot-shaped mandapa with carved wheels.',
      },
    ],
  },
];

export const epigraphCatalogs = [
  {
    id: 'tamil-brahmi',
    title: 'Tamil-Brahmi Inscriptions',
    tamil: 'தமிழ்-பிராமி கல்வெட்டுகள்',
    description: {
      en: 'The earliest known Tamil writing, carved in caves and scratched on pottery, from Mangulam, Jambai, Pugalur, and Keezhadi.',
      ta: 'மாங்குளம், ஜம்பை, புகளூர், கீழடி முதலிய இடங்களில் குகைகளில் செதுக்கப்பட்டும் பானை ஓடுகளில் கீறப்பட்டும் கிடைத்துள்ள மிகப் பழைய தமிழ் எழுத்துச் சான்றுகள்.',
    },
    pages: [
      {
        heading: 'The Earliest Tamil Writing',
        body: 'Tamil-Brahmi is the script of the earliest known Tamil inscriptions. Many are short donative records carved on the drip-ledges and stone beds of natural caverns given to ascetics.',
      },
      {
        heading: 'Mangulam',
        body: 'The cave inscriptions at Mangulam near Madurai are among the oldest Tamil-Brahmi records. They mention the Pandya ruler Nedunchezhiyan and gifts made to monks.',
      },
      {
        heading: 'Jambai',
        body: 'The Jambai inscription in Villupuram district names “Satiyaputo Atiyan Netuman Anci”, connecting the Atiyaman chiefs with the Satiyaputa mentioned in Ashoka’s edicts.',
      },
      {
        heading: 'Pugalur',
        body: 'Inscriptions at Pugalur near Karur record three generations of Chera rulers, offering valuable confirmation of kings also known from Sangam poetry.',
      },
      {
        heading: 'Keezhadi',
        body: 'Excavations at Keezhadi near Madurai have yielded many potsherds bearing Tamil-Brahmi graffiti, pointing to everyday writing in an urban settlement.',
      },
    ],
  },
  {
    id: 'chola-records',
    title: 'Chola Temple Inscriptions',
    tamil: 'சோழர் கோயில் கல்வெட்டுகள்',
    description: {
      en: 'Chola temple inscriptions, from the Uttaramerur village-assembly records to the gifts recorded on the walls of the Thanjavur temple.',
      ta: 'உத்தரமேரூர் ஊர்ச்சபைத் தேர்தல் கல்வெட்டுகள் முதல், தஞ்சைப் பெருங்கோயில் சுவர்களில் பதிவான கொடைகள் வரையிலான சோழர் கோயில் கல்வெட்டுகள்.',
    },
    pages: [
      {
        heading: 'Uttaramerur',
        body: 'Inscriptions of Parantaka I at Uttaramerur describe in detail how the village assembly was chosen by the kudavolai system, in which names were written on palm leaves, placed in a pot, and drawn by lot.',
      },
      {
        heading: 'Thanjavur',
        body: 'The walls of the Brihadeeswarar temple carry long inscriptions of Rajaraja I listing endowments, temple staff, jewels, and gifts — a remarkable record of the temple as an institution.',
      },
      {
        heading: 'Meykkirti',
        body: 'Chola royal inscriptions often begin with a meykkirti, a poetic preamble in Tamil celebrating the king’s conquests and virtues.',
      },
    ],
  },
  {
    id: 'copper-plates',
    title: 'Copper-Plate Grants',
    tamil: 'செப்பேடுகள்',
    description: {
      en: 'Royal land grants engraved on copper plates, including the Leiden, Tiruvalangadu, and Anbil plates of the Cholas.',
      ta: 'செப்புத் தகடுகளில் பொறிக்கப்பட்ட அரச நிலக்கொடை ஆவணங்கள்; சோழர்களின் லெய்டன், திருவாலங்காடு, அன்பில் செப்பேடுகள் உட்பட.',
    },
    pages: [
      {
        heading: 'Records on Copper',
        body: 'Royal grants of land were engraved on sets of copper plates strung on a ring sealed with the royal emblem. They usually contain a genealogy of the dynasty followed by the details of the gift.',
      },
      {
        heading: 'The Leiden Plates',
        body: 'The Leiden plates record a Chola grant of a village to a Buddhist vihara at Nagapattinam, ordered by Rajaraja I and issued under Rajendra I. They are now kept in Leiden, in the Netherlands.',
      },
      {
        heading: 'Tiruvalangadu and Anbil',
        body: 'The Tiruvalangadu plates of Rajendra I and the Anbil plates of Sundara Chola are major sources for the genealogy and history of the Chola dynasty.',
      },
    ],
  },
];
