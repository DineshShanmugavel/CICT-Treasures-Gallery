import { readFileSync } from 'node:fs';
import type { CapacitorConfig } from '@capacitor/cli';

/*
 * Packages the museum as an Android and iOS app (Capacitor), so the web app, `npm run dev`
 * and `npm run build` (into `dist`) are unchanged.
 *
 * The app bundles `dist-mobile` (npm run build:mobile), not `dist`: `dist` also holds the
 * workspace's public media (e-books, manuscripts, rare PDFs, models: tens of gigabytes),
 * far beyond what an app store accepts, so the app's build leaves it out and streams it
 * from the website (VITE_MEDIA_BASE_URL in .env.mobile).
 */

/**
 * Whether the media comes over plain http, as from the development server on this PC
 * (http://192.168.0.28:5173). Android then has to allow cleartext and mixed content, and
 * the app itself is served as http://localhost: the WebView blocks http audio and video on
 * an https page even with mixed content allowed (only fetch and images get through).
 * http://localhost still counts as a secure context. An https address keeps all of this off.
 */
const mediaOverHttp = (() => {
  try {
    return /^\s*VITE_MEDIA_BASE_URL\s*=\s*http:/m.test(readFileSync('.env.mobile', 'utf8'));
  } catch {
    return false;
  }
})();

const config: CapacitorConfig = {
  appId: 'in.cict.tamilmuseum',
  appName: 'CICT Tamil Museum',
  webDir: 'dist-mobile',
  backgroundColor: '#0c0906',
  server: mediaOverHttp ? { cleartext: true, androidScheme: 'http' } : undefined,
  android: {
    allowMixedContent: mediaOverHttp,
  },
  ios: {
    contentInset: 'never',
  },
  plugins: {
    // The page uses no safe-area CSS, so Android keeps the web view clear of the system bars
    // itself ('native'), with light icons over the museum's dark (styles.xml) behind them.
    SystemBars: {
      insetsHandling: 'native',
      style: 'DARK',
    },
  },
};

export default config;
