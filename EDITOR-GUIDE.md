# Editing the Piano Compass website — a guide for the editor

You can update the website yourself — the wording and photos on the main
pages, the pianos, articles, videos, and more — all from one simple editor.
**No coding, and nothing can go permanently wrong.**

---

## 1. Signing in (one-time)

1. Go to **https://piano-compass.netlify.app/admin/**
2. Click **Login with GitHub** and approve it the first time.

> You'll have been given a GitHub account and access beforehand. If the login
> doesn't let you in, tell David — it's a one-time access setting on his side.

---

## 2. Making a change

1. On the left, choose what to edit:
   - **Home page**, **About page**, **Services page** — the wording and main images on those pages
   - **Pianos** — the instruments the Finder recommends (and that show under *New & Interesting* and *The Feurich range*)
   - **Insights & Advice** — articles
   - **Videos** — YouTube/Vimeo links or uploaded clips
   - **Settings** — social-media links and which piano is *Piano of the Week*
2. Change the text in the boxes, or click an image field to choose a photo.
3. Click **Publish → Publish now** (top right).
4. Wait **1–2 minutes**, then refresh the live site to see it.

> **Important:** always click **Publish**. *Save* on its own only keeps a
> draft — it won't appear on the website.

---

## 3. Photos and video

- **Choose a photo:** click the image field → **Choose an image** → pick one
  from the picture library. Type part of a name to search (e.g. `V123`,
  `179`, `villa`).
- **Add a new photo:** in the same picture library, drag a new file in, then
  select it.
- **Long videos:** don't upload them — put them on **YouTube** or **Vimeo**
  and paste the link into a **Video** entry.
- **iPhone photos:** set **Settings → Camera → Formats → Most Compatible** so
  they save as JPEG and display everywhere.

---

## 4. Getting the Finder right (the Pianos section)

When you add or edit a piano, filling these in helps the best-fit Finder
recommend it correctly:

- **Type** (Upright / Grand) and **Size** (e.g. `123 cm`)
- **Self-playing capable** (tick if it is)
- **Suits which players / which spaces / strengths** — tick the ones that fit

A photo and a short summary make the Finder card look good.

---

## 5. Good habits

- Always **Publish**, not just Save.
- Changes go live on the **real website** — have a look after publishing.
- If something looks wrong, tell David — any change can be undone.

---

## Getting into Cloudinary (the photo library)

You don't make your own Cloudinary account — the owner **invites you into the
shared one**:

1. The owner goes to Cloudinary → **Settings → Users → Invite** and adds your
   email.
2. You get an email invite. Click it and set up your login — your own email
   and password, or **Continue with GitHub**.
3. You now see the same photo library as the owner, and can upload and replace
   photos.

---

## Replacing a photo so the site updates automatically

Some photos are wired to **fixed slots** in Cloudinary. If you replace the
image in a slot, the website updates on its own — **no editor, no publishing
needed.**

These photos are wired to the site. The easy, reliable way to change one is
to **replace it in place** so its name stays the same:

**To change one of these photos:**

1. In Cloudinary's **Media Library**, open the photo you want to change
   (use the table below to find the right one).
2. Click **Replace** / **Upload new version** and choose your new file.
3. Tick **Invalidate** if offered (clears the old cached copy so the new one
   shows quickly).
4. The website picks up the new photo within a few minutes — **no editor, no
   publishing needed.**

> Using **Replace / Upload new version** keeps the name automatically, so you
> never have to type anything — this is the safe way to do it.

| This photo on the site | Is this image in Cloudinary |
|---|---|
| Homepage big photo (hero) | `Feurich_162_-_classic_piano_in_villa_setting` |
| Feurich 115 Premiere | `Mod._115_-_Premiere_10black_chrome_web` |
| Feurich 122 Universal | `Mod._122_-_Universal_18walnut_satin_web` |
| Feurich 123 Vienna | `FEURICH_123_-_Vienna_2_walnut_satin` |
| Feurich 125 Design | `Mod._125_-_Design_10black_chrome_web` |
| Feurich 133 Concert | `Mod._133_-_Concert_10CHblack_chrome_LED_web` |
| Feurich 162 Dynamic I | `Mod._162_-_Dynamic_I_18walnut_satin_web` |
| Feurich 179 Dynamic II | `Mod._179_-_Dynamic_II_18_walnut_satin` |
| Feurich 218 Concert I | `Mod._218_-_Concert_I_10CH_black_chrome` |

(The piano photos also feed the **Finder**, the **Brands** page and **New &
Interesting**, so replacing one updates it everywhere.)

Everything *else* (choosing which photo goes in a brand-new spot, and all
text) is done in the `/admin` editor as above.

---

## Where things live (for reference)

- **The editor:** `/admin` on the website
- **Login:** GitHub
- **Photos & video:** Cloudinary (the picture library inside the editor)
- Full Cloudinary tips are in `CLOUDINARY.md`.
