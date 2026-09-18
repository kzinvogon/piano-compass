# Content Manager + Cloudinary media library — one-time setup

This sets up the **new content manager** at `https://piano-compass.netlify.app/admin/`
(Sveltia CMS). It gives the site admin **one media library over all images and
video** — a "Choose image / video" button that opens a grid, pick or drag-drop,
no URLs, no repository size limits. Media is stored on **Cloudinary**; long
videos can still use YouTube/Vimeo (paste a link).

It only needs to be done **once**. After that, editing is: open
`/admin/`, log in with GitHub, edit, **Save** → the site rebuilds.

There are three short jobs, all done by the repo owner (David).

---

## 1. Register a GitHub OAuth app (lets the admin log in)

1. GitHub → your avatar → **Settings** → **Developer settings** →
   **OAuth Apps** → **New OAuth App**.
2. Fill in:
   - **Application name:** `Piano Compass CMS`
   - **Homepage URL:** `https://piano-compass.netlify.app`
   - **Authorization callback URL:** `https://api.netlify.com/auth/done`
3. **Register**, then **Generate a new client secret**.
4. Copy the **Client ID** and the **Client secret** (you'll paste them in step 2).

## 2. Add that app to Netlify

1. Netlify → the **piano-compass** site → **Site configuration** →
   **Access & security** → **OAuth** → **Install provider**.
2. Choose **GitHub**, paste the **Client ID** and **Client secret** from step 1,
   **Install**.

That's the login wired up — no server code, no Netlify Identity (which is
deprecated).

## 3. Add your Cloudinary API key (lets the picker open your library)

1. Cloudinary → **Settings (gear)** → **API Keys** (or the dashboard home).
2. Copy your **API Key** — the short public number, e.g. `123456789012345`.
   > This is the **public** key, safe to store in the site. **Never** copy the
   > **API Secret** — that stays private and is not needed here.
3. Edit **`admin/config.yml`** in the repo and replace
   `REPLACE_WITH_CLOUDINARY_API_KEY` with that number. (You can do this in the
   CMS once logged in, or on GitHub directly.)
   - The cloud name (`m4t0vj8h`) is already filled in.

---

## Done — how to use it

1. Go to **https://piano-compass.netlify.app/admin/** and **Log in with GitHub**.
2. Edit **Home / About / Services**, **Pianos**, **Insights**, **Videos**,
   or **Settings**.
3. For any picture or video, click the field's **Choose** button → the
   **Cloudinary library** opens → pick an existing file or drag a new one in.
4. **Save.** Netlify rebuilds and the change is live in a minute or two.

### Video
- Short clips: upload straight into the Cloudinary picker on a **Video** entry
  (no size limit).
- Long videos: paste a **YouTube** or **Vimeo** link on the Video entry — free
  and unlimited, and it streams.

### Notes
- **HEIC photos** (from iPhone) are converted automatically by Cloudinary, so
  they display everywhere. To avoid it entirely, set the iPhone to
  **Settings → Camera → Formats → Most Compatible** (saves as JPEG).
- The old Pages CMS (`app.pagescms.org`) still works as a fallback until you've
  finished the steps above; both edit the same content.
- Free Cloudinary tier is ~**25 GB storage + 25 GB/month delivery** — ample for
  this site; it only costs anything at large scale.
