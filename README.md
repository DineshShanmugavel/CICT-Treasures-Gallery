# CICT Tamil Treasures Gallery — Enhanced Frontend

A responsive React/Vite landing page for a premium Tamil heritage museum experience. The visual direction combines detailed museum artwork with restrained motion, gold-accented interface elements, and a guided-tour layer.

## Immersive museum flow

1. **Loading screen** (`src/components/LoadingScreen.jsx`) — the CICT building and emblem in gold-on-stone with kolam ornaments; the progress bar tracks image preloading, fonts, and the 3D hallway, then shows **Enter Museum**.
2. **360° hallways** (`src/components/hallway/`) — two Three.js rotundas with one arch per wing: the **Literature Hall** (Sangam Literature, Epigraphs, Rare Books, Manuscripts Library) round the Thiruvalluvar statue, and, down the corridor behind the statue, the **Ancient Artistic Values Wing** (Pottery, Ancient Statues, Ancient Coins, Ancient Tamil Paintings) round a great brass Nilavilakku. Drag/swipe to look around, pinch or scroll to zoom, arrow keys to turn. Choosing a wing walks the camera to its arch. **Gallery overview** switches to the classic landing page below; its **360° Hallway** button returns.
3. **Glass doors** (`GlassDoorTransition.jsx`) swing open into the wing's room of **glass cabinets** (`GlassCabinet.jsx`, `MuseumRoom.jsx`).
4. **Flip-book reader** (`src/components/flipbook/`) — page-turn viewer for PDFs (rendered on demand with pdf.js) and for text catalogues, with download.

5. **Thiruvalluvar monument** (`src/components/hallway/hallStatue.js`) — the statue stands at the centre of the Literature Hall as part of the 3D building itself, with a golden aura and spotlights, so it stays in place through every camera move and can be seen down the corridor from the other hall. (The arched view's stage uses the React Three Fiber version, `ThiruvalluvarStatue.jsx`.) Visitors orbit it as they look around; tapping it opens the **Thirukkural scroll** (`ThiruvalluvarScroll.jsx`) with couplets in Tamil, G. U. Pope's English translation, and a simple moral (`src/data/thirukkural.js`).
6. **Narration** — the scroll's **Thiruvalluvar story** (`src/data/valluvarStory.js`) has a தமிழ் / English toggle that switches both its text and its narration — `public/Audio/Thiruvalluvar story/…-Tamil.mp3` and `…-English.mp3` — played with a single Play / Pause control, as the Olai Suvadi does (`RecitationButton.jsx`, `src/audio/useNarration.js`). Books use the Tamil/English player (`AudioPlayer.jsx`).
7. **Book descriptions & narration** (`src/data/bookInfo.js`) — every book and artifact has a Tamil and English description, shown on the label plaque under each cabinet and in the reader's About panel. Per-book narration follows the convention `public/audio/books/<book id>-ta.mp3` and `-en.mp3`.
8. **Firefly lighting** (`src/components/Lighting.jsx`) — slow, softly pulsing fireflies in the 360° hall (shader) and in the rooms (2D canvas).

### All 1330 Thirukkural couplets

The scroll reads `src/data/thirukkural.json` (bundled as its own lazily loaded chunk). Each entry has `number`, `section`, `chapter`, `tamilLine1`, `tamilLine2`, `transliteration`, `translation` (G. U. Pope, 1886, in modern vocabulary), `explanation` (1886 English edition), and `studentMeaning` (`{ en, ta }`, written by the museum, or `null`).

Regenerate it with `npm run build:kural`. Add new student meanings to `studentFavourites` in `src/data/thirukkural.js` first.
### Statue model

The hall loads `public/models/Thiruvalluvarstatue.web.glb` (0.5 MB), an optimised copy of the original 173 MB scan `Thiruvalluvarstatue.glb` (welded, simplified to ~170k triangles, meshopt-compressed). If the source scan changes, regenerate the web copy with [glTF-Transform](https://gltf-transform.dev/): drop the flat normals, then `weld`, `simplify` (ratio ≈ 0.07), and `meshopt`.

Wings, books, and catalogue text live in `src/data/roomBooks.js` and `src/data/catalogs.js`. PDFs are served from the workspace-level `../public` folder (see `publicDir` in `vite.config.js`).

## What is improved in this version

- High-detail, locally bundled museum artwork with a rich carved-wood interior, bronze Thiruvalluvar statue, warm light, exhibits, and a reflective floor.
- Subtle Three.js ambient particles, pointer-controlled parallax, and landmark-specific spotlight emphasis during the tour.
- Full-screen immersive guided-tour mode with four highlighted landmarks, progress indicator, previous/next controls, and an exit shortcut (Escape).
- Working gallery search across the four museum modules and collection cards.
- Refined gold detailing, translucent panels, hover states, keyboard Escape handling, focus indicators, and reduced-motion support.
- Responsive desktop, tablet, and mobile layouts.
- Module entry points for Rare Books Wing, Manuscripts Library, Thiruvalluvar Shrine, and About Thiruvalluvar.

## Run locally

Requirements: Node.js 18+ recommended.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Build for deployment

```bash
npm run build
npm run preview
```

## Connect your existing module pages

The route paths are configured near the top of `src/main.jsx` in the `sections` array:

- Rare Books Wing: `/rare-books`
- Manuscripts Library: `/manuscripts`
- Thiruvalluvar Shrine: `/thiruvalluvar-shrine`
- About Thiruvalluvar: `/thiruvalluvar`

Change these four `href` values to match your main application's routes. The “Explore” action navigates to that configured path. This ZIP is the museum landing-page frontend; the real module pages/router need to be present in the parent application. If this folder is run by itself, Vite's history fallback may serve the landing page at those paths because their page components are not included here.

## Assets and implementation

The hero art is bundled from `src/assets/tamil-museum-hero.webp`, so both the large background and the Explore thumbnail use the same local asset. Three.js supplies the ambient particles; the museum architecture itself is a detailed environment image with parallax, rather than a free-roam 3D model. A truly navigable 3D museum would require a prepared GLB/GLTF scene plus camera controls and collision/navigation logic.
