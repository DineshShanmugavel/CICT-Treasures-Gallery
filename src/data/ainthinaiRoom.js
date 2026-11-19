/**
 * The Five Landscapes room as a 3D gallery (components/ainthinai/): what each of its five
 * glass cases shows, and the Ainthinai chart painted on its wall. The texts come from
 * foodsAndLandscapes.js (the tinai panels and the curators' food notes); the chart's short
 * entries are the Tolkappiyam's first and native elements of each tinai, as those panels
 * set them out.
 */

import { FOOD_PANELS, FOOD_TEXTS, LANDSCAPE_ORDER } from './foodsAndLandscapes.js';
import { mediaUrl } from '../mediaUrl.js';

/**
 * Web copy of public/5 lanscapes food/kurinji.glb: welded, simplified to ~240k triangles,
 * textures resized to 2048 px WebP, and meshopt-compressed (127 MB → 3.1 MB). The original
 * model is kept alongside.
 */
export const KURINJI_MODEL_URL = mediaUrl('/5 lanscapes food/kurinji.web.glb');

/**
 * Web copies of the other four landscapes' models (public/5 lanscapes food/Mullai, Marutham 2,
 * Neithal and Paalai — glTF files without an extension), made the same way as Kurinji's
 * (model-sources/optimize.sh). Each case shows its diorama while its model loads, or if it cannot.
 */
const webModel = (name) => mediaUrl(`/5 lanscapes food/${name}.web.glb`);
export const LANDSCAPE_MODEL_URLS = {
  Kurinji: KURINJI_MODEL_URL,
  Mullai: webModel('mullai'),
  Marutham: webModel('marutham'),
  Neithal: webModel('neithal'),
  Palai: webModel('palai'),
};

/**
 * Per landscape: the chart's entries (English, Tamil), the colour its case's spotlight is
 * tinted (the landscape's flower or light), and the model in its case — a file, or a
 * diorama built in code (LandscapeModels.jsx).
 */
const TINAI = {
  Kurinji: {
    tamil: 'குறிஞ்சி',
    land: ['Mountains', 'மலை'],
    god: ['Murugan (Seyon)', 'சேயோன்'],
    flower: ['Kurinji', 'குறிஞ்சி'],
    time: ['Cool season · midnight', 'கூதிர் · யாமம்'],
    theme: ['Union', 'புணர்தல்'],
    light: '#cfc4ff',
    model: { url: KURINJI_MODEL_URL },
  },
  Mullai: {
    tamil: 'முல்லை',
    land: ['Forest and pasture', 'காடு'],
    god: ['Mayon (Thirumal)', 'மாயோன்'],
    flower: ['Jasmine', 'முல்லை'],
    time: ['Rains · evening', 'கார் · மாலை'],
    theme: ['Waiting', 'இருத்தல்'],
    light: '#e8ffd8',
    model: { url: LANDSCAPE_MODEL_URLS.Mullai, diorama: 'mullai' },
  },
  Marutham: {
    tamil: 'மருதம்',
    land: ['Fields', 'வயல்'],
    god: ['Vendhan (Indra)', 'வேந்தன்'],
    flower: ['Marutham tree', 'மருதம்'],
    time: ['Every season · dawn', 'வைகறை'],
    theme: ['Lovers’ quarrels', 'ஊடல்'],
    light: '#fff1c8',
    model: { url: LANDSCAPE_MODEL_URLS.Marutham, diorama: 'marutham' },
  },
  Neithal: {
    tamil: 'நெய்தல்',
    land: ['Seashore', 'கடல்'],
    god: ['Varunan', 'வருணன்'],
    flower: ['Blue water-lily', 'நெய்தல்'],
    time: ['Every season · dusk', 'எற்பாடு'],
    theme: ['Pining', 'இரங்கல்'],
    light: '#d6ecff',
    model: { url: LANDSCAPE_MODEL_URLS.Neithal, diorama: 'neithal' },
  },
  Palai: {
    tamil: 'பாலை',
    land: ['Parched land', 'சுரம்'],
    god: ['Kotravai', 'கொற்றவை'],
    flower: ['Palai tree', 'பாலை'],
    time: ['Summer · midday', 'நண்பகல்'],
    theme: ['Separation', 'பிரிதல்'],
    light: '#ffd2a0',
    model: { url: LANDSCAPE_MODEL_URLS.Palai, diorama: 'palai' },
  },
};

const poetics = FOOD_PANELS['ainthinai-landscapes'];

/** The five landscapes in the tradition's order, each with its tinai panel and its food note. */
export const LANDSCAPES = LANDSCAPE_ORDER.map((key) => ({
  key,
  ...TINAI[key],
  panel: poetics.find((panel) => panel.id === `tinai-${key.toLowerCase()}`),
  food: FOOD_TEXTS['5 lanscapes food'][key],
}));

/** The chart's rows, top to bottom: [English heading, Tamil heading, field]. */
export const CHART_ROWS = [
  ['Land', 'நிலம்', 'land'],
  ['God', 'தெய்வம்', 'god'],
  ['Flower', 'பூ', 'flower'],
  ['Season · hour', 'பொழுது', 'time'],
  ['Theme', 'உரிப்பொருள்', 'theme'],
];
