/**
 * The 3D models standing on the centre pedestals of the halls (hallFigure.js), keyed by
 * the hall's `centrepiece` (roomBooks.js), with the card shown when one is chosen.
 *
 * Each `model.url` is a web copy of the scan beside it in the public folder (the originals
 * are 23–66 MB, without a file extension): simplified, meshopt-compressed and with WebP
 * textures, made with
 *   npx @gltf-transform/cli optimize <original> <original>.web.glb --compress meshopt
 *     --simplify-ratio <ratio> --texture-compress webp --texture-size 2048
 * (ratio 0.5 for Tolkappiar, 0.14 for Raja Raja Chozhan, 0.1 for the Yaazh and the paddy
 * field, 0.09 for the ship). Regenerate a copy if its original changes.
 *
 * `model.height` is the model's height in metres from its base; a wide one is made smaller
 * to fit the pedestal. The texts reuse the curators' notes where the museum already has
 * them (the Historical Figures portraits, the instruments wing).
 *
 * The Thiruvalluvar statue ('statue') and the CICT monolith ('monolith') have their own
 * centrepieces and panels; they are not listed here.
 */

import { mediaUrl } from '../mediaUrl.js';
import { ARTIFACT_TEXTS } from './exhibitionTexts.js';
import { FIGURE_TEXTS, KINGS_FOLDER, POETS_FOLDER } from './historicalFigures.js';

const text = ({ title, ta, detail, en, taText }) => ({ title, ta, detail, en, taText });

export const HALL_EXHIBITS = {
  tolkappiar: {
    ...text(FIGURE_TEXTS[POETS_FOLDER].tholkappiyar),
    model: { url: mediaUrl('/Tamizh Poets n Thinkers/Tolkappiar.web.glb'), height: 2.0 },
  },
  yaazh: {
    ...text(ARTIFACT_TEXTS['Tamil Instruments'].yazh),
    model: { url: mediaUrl('/Tamil Instruments/Yaazh.web.glb'), height: 2.2 },
  },
  'paddy-fields': {
    title: 'Paddy Fields',
    ta: 'நெல் வயல்',
    detail: 'Wet-field farming · the marutham landscape',
    en: 'Paddy was the great crop of the river valleys. In the Sangam scheme of landscapes, marutham — farmland watered by rivers — is the land of paddy fields, and its poems are full of transplanting, harvest and the festivals that followed. Transplanting seedlings by hand, as the figure here does, was long the work of women in groups, often singing nadavu paattu (transplanting songs) as they worked. The Kaveri delta, watered by the Kallanai (Grand Anicut) attributed to Karikala Chola, became the rice bowl of Tamil Nadu.',
    taText: 'ஆற்றுப் பள்ளத்தாக்குகளின் முதன்மைப் பயிர் நெல். சங்க இலக்கியத்தின் திணைப் பகுப்பில், ஆற்று நீர் பாயும் வயல் நிலமான மருதமே நெல் வயல்களின் நிலம்; அதன் பாடல்களில் நடவும் அறுவடையும் அவற்றைத் தொடர்ந்த விழாக்களும் நிறைந்துள்ளன. இங்குள்ள உருவம் செய்வதைப் போல, நாற்றுகளைக் கையால் நடுவதை நெடுங்காலமாகப் பெண்கள் குழுவாக, பெரும்பாலும் நடவுப் பாட்டுப் பாடிக்கொண்டே செய்தனர். கரிகால் சோழன் கட்டியதாகக் கருதப்படும் கல்லணையால் நீர் பெறும் காவிரிப் படுகை தமிழ்நாட்டின் நெற்களஞ்சியமாயிற்று.',
    model: { url: mediaUrl('/Tamil Agriculture/paddy fields.web.glb'), height: 1.3 },
  },
  'raja-raja-chozhan': {
    ...text(FIGURE_TEXTS[`${KINGS_FOLDER}/Rajaraja cholan`]['Rajaraja Cholan pic']),
    model: { url: mediaUrl('/Tamilnadu places- then vs now/thanjavur/raja raja chozhan.web.glb'), height: 2.6 },
  },
  'ancient-tamil-ship': {
    title: 'Ancient Tamil Ship',
    ta: 'பண்டைத் தமிழ்க் கப்பல்',
    detail: 'Maritime trade · Sangam age to the Cholas',
    en: 'Tamil seafarers sailed with the monsoon winds from before the common era. Sangam poems describe the ships (kalam) of the Yavanas arriving at Muziris laden with gold and leaving with pepper, and the Pattinappalai pictures the busy harbour of Kaveripattinam (Puhar). Under the Cholas, fleets crossed the Bay of Bengal: Rajendra I’s expedition against Srivijaya, around 1025 CE, is recorded in his inscriptions. No ancient Tamil hull survives whole, so this model is an artist’s interpretation, not the reconstruction of a known vessel.',
    taText: 'பொது ஊழிக்கு முன்பிருந்தே தமிழ்க் கடலோடிகள் பருவக்காற்றைப் பயன்படுத்திக் கடல் கடந்தனர். பொன் சுமந்து முசிறிக்கு வந்து மிளகு ஏற்றிச் சென்ற யவனர் கலங்களைச் சங்கப் பாடல்கள் விவரிக்கின்றன; காவிரிப்பூம்பட்டினத்தின் (புகார்) ஆரவாரமான துறைமுகத்தைப் பட்டினப்பாலை சித்திரிக்கிறது. சோழர் காலத்தில் கடற்படைகள் வங்கக் கடலைக் கடந்தன: கி.பி. 1025 அளவில் முதலாம் இராஜேந்திரன் ஸ்ரீவிஜயத்தின் மீது மேற்கொண்ட படையெடுப்பை அவர் கல்வெட்டுகள் பதிவு செய்கின்றன. பண்டைத் தமிழ்க் கப்பல் எதுவும் முழுமையாகக் கிடைக்கவில்லை; எனவே இந்த மாதிரி ஒரு கலைஞரின் கற்பனைப் படைப்பே, அறியப்பட்ட ஒரு கலத்தின் மீட்டுருவாக்கம் அன்று.',
    model: { url: mediaUrl('/Maritime trade n ports/Ancient Tamil Ship.web.glb'), height: 1.9 },
  },
};
