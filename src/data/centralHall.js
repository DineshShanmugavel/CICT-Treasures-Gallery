/*
 * The monolith at the centre of the Central Hall: four inscribed faces, read in this order
 * walking round it. The 3D hall carves them into the stone (createHallwayScene.js) and the
 * monument panel (Monolith.jsx) sets them out to read.
 *
 * People are given as { name, nameTa, designation }; `nameTa` (the name in Tamil script)
 * is shown above the English when it is filled in.
 */
const DIRECTOR = { name: 'Prof. R. Chandrasekaran', nameTa: '', designation: 'Director, CICT' };
const REGISTRAR = { name: 'Dr. R. Bhuvaneshwari', nameTa: '', designation: 'Registrar, CICT' };

export const MONUMENT = {
  title: 'The CICT Monolith',
  tamil: 'செம்மொழி நினைவுத் தூண்',
  faces: [
    {
      id: 'front',
      side: 'Front',
      sideTa: 'முகப்பு',
      heading: 'Central Institute of Classical Tamil',
      headingTa: 'செம்மொழித் தமிழாய்வு மத்திய நிறுவனம்',
      emblem: true,
      sections: [
        {
          title: 'The Institute',
          titleTa: 'நிறுவனம்',
          en: 'An institution of the Ministry of Education, Government of India, in Chennai, devoted to the study and promotion of Classical Tamil — the language of the forty-one ancient works, from Tolkappiyam to Muttollayiram.',
          ta: 'இந்திய அரசின் கல்வி அமைச்சகத்தின் கீழ்ச் சென்னையில் இயங்கும் இந்நிறுவனம், தொல்காப்பியம் முதல் முத்தொள்ளாயிரம் வரையிலான நாற்பத்தொரு செவ்வியல் நூல்களின் ஆய்வுக்கும் பரப்புதலுக்கும் தன்னை அர்ப்பணித்துள்ளது.',
        },
      ],
    },
    {
      id: 'left',
      side: 'Left side',
      sideTa: 'இடப்புறம்',
      heading: 'Leadership',
      headingTa: 'தலைமை',
      credits: [
        { role: 'Director', roleTa: 'இயக்குநர்', people: [DIRECTOR] },
        { role: 'Registrar', roleTa: 'பதிவாளர்', people: [REGISTRAR] },
      ],
    },
    {
      id: 'right',
      side: 'Right side',
      sideTa: 'வலப்புறம்',
      heading: 'Vision & Mission',
      headingTa: 'தொலைநோக்கும் பணி இலக்கும்',
      // TODO: replace with CICT's official Vision and Mission wording; this draft follows the Institute's published objectives.
      sections: [
        {
          title: 'Vision',
          titleTa: 'தொலைநோக்கு',
          en: 'To establish the antiquity, uniqueness and enduring worth of Classical Tamil, and to carry its language, literature and culture to scholars and readers across the world.',
          ta: 'செம்மொழித் தமிழின் தொன்மையையும் தனித்தன்மையையும் நிலைத்த பெருமையையும் நிறுவி, அதன் மொழி, இலக்கியம், பண்பாடு ஆகியவற்றை உலகெங்கும் உள்ள அறிஞர்களுக்கும் வாசகர்களுக்கும் கொண்டு சேர்த்தல்.',
        },
        {
          title: 'Mission',
          titleTa: 'பணி இலக்கு',
          items: [
            { en: 'To prepare definitive editions of the forty-one classical Tamil texts.', ta: 'நாற்பத்தொரு செவ்வியல் தமிழ் நூல்களுக்குச் செம்பதிப்புகளை உருவாக்குதல்.' },
            { en: 'To translate them into English and other Indian and world languages.', ta: 'அவற்றை ஆங்கிலம் உள்ளிட்ட இந்திய, உலக மொழிகளில் மொழிபெயர்த்தல்.' },
            { en: 'To advance research in Classical Tamil, including a historical grammar of Tamil.', ta: 'தமிழின் வரலாற்றிலக்கணம் உள்ளிட்ட செம்மொழித் தமிழ் ஆய்வுகளை முன்னெடுத்தல்.' },
            { en: 'To support scholars through fellowships, seminars and training programmes.', ta: 'ஆய்வுநல்கைகள், கருத்தரங்குகள், பயிற்சித் திட்டங்கள் வழியாக ஆய்வாளர்களை ஊக்குவித்தல்.' },
          ],
        },
      ],
    },
    {
      id: 'back',
      side: 'Back',
      sideTa: 'பின்புறம்',
      heading: 'Project Team',
      headingTa: 'திட்டக் குழு',
      credits: [
        { role: 'Director', roleTa: 'இயக்குநர்', people: [DIRECTOR] },
        { role: 'Registrar', roleTa: 'பதிவாளர்', people: [REGISTRAR] },
        { role: 'Coordinator', roleTa: 'ஒருங்கிணைப்பாளர்', people: [{ name: 'D.Senthil Kumar', designation: 'Programmer, CICT' }] },
        { role: 'Associate Coordinator', roleTa: 'இணை ஒருங்கிணைப்பாளர்', people: [{ name: 'Murugaswaminathan', designation: 'Programmer, CICT' }] },
        { role: 'Developers', roleTa: 'உருவாக்குநர்கள்', people: [{ name: 'Dinesh Shanmugavel' }, { name: 'Hariyanka D' }] },
      ],
    },
  ],
};
