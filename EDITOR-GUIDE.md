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

The slots are:

| Slot name in Cloudinary | Where it shows on the site |
|---|---|
| `site/hero` | The big photo on the homepage |
| `site/piano/feurich-115-premiere` | Feurich 115 Premiere (Finder, Brands, New & Interesting) |
| `site/piano/feurich-122-universal` | Feurich 122 Universal |
| `site/piano/feurich-vienna-123` | Feurich 123 Vienna |
| `site/piano/feurich-125-design` | Feurich 125 Design |
| `site/piano/feurich-133-concert` | Feurich 133 Concert |
| `site/piano/feurich-162-dynamic-i` | Feurich 162 Dynamic I |
| `site/piano/feurich-179-dynamic-ii` | Feurich 179 Dynamic II |
| `site/piano/feurich-218-concert-i` | Feurich 218 Concert I |

**To change one of these photos:**

1. In Cloudinary, open the **Upload** dialog.
2. Upload your new photo and set its name (public ID) to **exactly** the slot
   name above — e.g. `site/hero` — into the same place.
3. When Cloudinary asks, choose **Overwrite**, and tick **Invalidate** (this
   clears the old cached copy so the new one shows quickly).
4. The website picks up the new photo within a few minutes — nothing else to do.

> The simplest way to not get the name wrong: in the Media Library, open the
> existing slot image, use **Replace / Upload new version**, and pick your new
> file — the name stays the same automatically.

Everything *else* (choosing which photo goes in a brand-new spot, and all
text) is done in the `/admin` editor as above.

---

## Where things live (for reference)

- **The editor:** `/admin` on the website
- **Login:** GitHub
- **Photos & video:** Cloudinary (the picture library inside the editor)
- Full Cloudinary tips are in `CLOUDINARY.md`.
