# CICT Tamil Treasures Gallery: Deployment Guide

The built museum is the **`dist/`** folder: a self-contained static website. Copy it onto any web
server, at the domain's root (`https://museum.example.org/`) or in a sub-folder
(`http://192.168.1.10/tamil-museum/`). No database, no server-side code, no settings to edit:
every path inside is relative.

`dist/` already contains:

| File | For |
| --- | --- |
| `.htaccess` | Apache / cPanel (file types, compression, caching, page fallback) |
| `web.config` | Windows IIS (file types, caching, page fallback) |
| `nginx.conf.example` | nginx: a ready server block to copy |
| `start-local-server.bat` / `.sh` + `serve-museum.mjs` | Any office PC, with no web server installed |
| `museum-analytics.mjs` | Visitor analytics and the admin API, run by `serve-museum.mjs` (optional on a web server) |
| `site-data.json` | The admin portal's published edits (empty until you publish) |

**Size:** about 4.6 GB (10,752 media files, plus code). Copy the whole folder,
including the hidden `.htaccess`.

---

## Building `dist/` (only when the content changes)

On the development PC, in the project folder (`cict-tamil-museum 3`):

```
npm install
npm run build
```

The build copies the media from the workspace's `public/` folder, keeping only the files the site
uses, and re-encodes oversized photos (the originals in `public/` are never changed). It also
writes pre-compressed `.br` / `.gz` copies of the code. `media-report.json` lists what it
left out and why. The first build takes several minutes; later builds reuse the optimised photos.

To check the built site before copying it, run `npm run preview` and open http://localhost:4173/.

---

## 1. Local office server

### Option A: no web server (any Windows, Linux or Mac PC)
1. Copy `dist/` to the PC (e.g. `D:\tamil-museum`).
2. Double-click **`start-local-server.bat`** (Windows) or run `sh start-local-server.sh` (Linux/Mac).
   It uses Node.js if installed (recommended: https://nodejs.org, LTS), otherwise Python.
3. Visitors open the address it prints: `http://<that-PC's-IP>:8080/`.
   If other PCs cannot connect, allow port 8080 through the PC's firewall.
   For another port: `start-local-server.bat 9000`.

### Option B: Windows IIS
1. Install the IIS role and, for the page fallback, the **URL Rewrite** module
   (https://www.iis.net/downloads/microsoft/url-rewrite). In Windows Features, also enable
   *Static Content Compression*.
2. Copy the contents of `dist/` to `C:\inetpub\wwwroot\tamil-museum` (or any folder).
3. In IIS Manager, right-click the site and choose **Add Application** (alias `tamil-museum`, the
   physical path from step 2), or point a whole site at that folder. Browse
   `http://<server>/tamil-museum/`. The included `web.config` applies itself.

### Option C: Apache (XAMPP, Linux)
1. Enable `mod_rewrite` and `mod_headers` (`sudo a2enmod rewrite headers`), and allow
   `.htaccess` for the folder (`AllowOverride All`).
2. Copy the contents of `dist/` (including `.htaccess`) to e.g. `/var/www/html/tamil-museum/`.
3. Browse `http://<server>/tamil-museum/`.

---

## 2. Remote web server

### Option A: cPanel / shared hosting
1. Zip the **contents** of `dist/` and upload the zip in **File Manager** to `public_html/`
   (or `public_html/tamil-museum/` for a sub-folder), then **Extract** it there.
   For a large upload, FTP (FileZilla) is more reliable than the browser.
2. In File Manager, use *Settings → Show Hidden Files* to confirm that `.htaccess` is present.
3. Browse your domain. Turn on HTTPS (cPanel → SSL/TLS Status → AutoSSL).

### Option B: Linux VPS with nginx
1. Upload the contents of `dist/`:
   `rsync -avz --delete dist/ user@server:/var/www/tamil-museum/`
2. Copy `nginx.conf.example` to `/etc/nginx/sites-available/tamil-museum`, set `server_name` and
   `root`, then link it into `sites-enabled` and run `sudo nginx -t && sudo systemctl reload nginx`.
3. Add HTTPS with `sudo certbot --nginx -d museum.example.org`.

### Option C: Linux VPS with Apache
Same as **1C** above, then add HTTPS with `sudo certbot --apache`.

---

## Admin Portal and visitor analytics

**Admin Portal:** open `<museum address>/#/admin`, or click the small lock beside
"Powered by: CICT Digital Library" under the hallway mini-map. Sign in as `CICTAdmin` with the
museum's admin password. The portal is 2D and loads none of the 3D museum.

- **Exhibits:** pick a hall and a room, then add, edit, hide or delete exhibits. A live preview
  shows each change. Saved edits appear at once in the 3D museum in that browser.
- **Making edits permanent:**
  - With the museum's Node server (the office launcher, or `node serve-museum.mjs` on a VPS),
    click **Publish to server**.
  - On a static host (cPanel, IIS or nginx without Node), click **Export Site Data (JSON)** and
    upload the downloaded `site-data.json` into the museum folder, replacing the old one.
  - To keep the edits in future builds too, copy that file to the workspace's
    `public/site-data.json` before running `npm run build`.
- **Import Site Data (JSON)** loads an exported file. **Reset to Default** clears all edits.
  After either, publish or export the result to apply it to the site.

**Visitor analytics (website only, never in the mobile app):**
- **What's shown:** live users (from a heartbeat every 30 seconds), total unique views by IP, and
  a city-wise table. Visitors on the office network show as "Local Office Network".
- **When it runs:** whenever the museum is served by `serve-museum.mjs`, which the office
  launcher already uses.
- **Where counts are kept:** `data/analytics.json` in the museum folder. Keep the `data/` folder
  when updating, for example `rsync -avz --delete --exclude data/ dist/ user@server:/var/www/tamil-museum/`.
- **On a VPS:** run `node serve-museum.mjs 8080` in the museum folder (with systemd or pm2), and
  either send the whole site to it or only `/api/`. The `location /api/` block is in
  `nginx.conf.example`, and a commented rule is in `.htaccess`.
- **Without Node:** the analytics simply stay off. The site shows no counters and logs no errors.
- **Privacy:** IP addresses are stored only as salted hashes. Each address's city is looked up
  once, from ipwho.is (or ip-api.com), and cached. Set `MUSEUM_GEOIP=off` to turn lookups off.
- **Changing the admin credentials on the server:** set `MUSEUM_ADMIN_USER` and
  `MUSEUM_ADMIN_PASSWORD` before starting `serve-museum.mjs`.

**Security note:** on a purely static host, the sign-in is checked in the browser against a
stored hash. That keeps casual visitors out, but it is not real protection. It can't change the
site for anyone else, though: edits stay in that browser until someone uploads a file. Publishing
and the visitor table always need the server to accept the credentials.

---

## Updating

Run `npm run build` again and replace the folder on the server (with `rsync --delete`, or by
deleting the old files first). The page always checks for new code (`index.html` is never cached),
and file names under `assets/` change with their content, so visitors get the new version on
their next visit.

## Good to know
- **Internet features.** The museum works fully on an office network without internet, except
  three things: the Tamilakam map's background tiles (OpenStreetMap), the fonts of less common
  scripts (fetched from Google Fonts on demand; until then the system's fonts are used), and the
  live machine translation used for text missing from a language pack. All 141 language packs
  ship inside `dist/`.
- **Secrets.** `dist/` contains no API keys. The ElevenLabs key lives only in `.env.local` on the
  development PC and is used by the audio generator scripts, never by the website.
- **Mobile app.** The Capacitor app (`npm run cap:sync`) streams its media from the website.
  After the public site is live, set `VITE_MEDIA_BASE_URL` in `.env.mobile` to its HTTPS
  address and rebuild the app. The included server configs already send the CORS header the
  app needs (`Access-Control-Allow-Origin: *` on the media files).
