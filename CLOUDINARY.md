# Adding images with Cloudinary

Page images (the Home hero and the About portrait) are set by **pasting an
image URL** into the CMS. The easiest place to host those images is a free
[Cloudinary](https://cloudinary.com) media library — a proper cloud gallery,
so images don't bloat the repository and there are no upload size limits.

No API keys or secrets are ever stored in this repository. A Cloudinary
**delivery URL** is a public link to a picture — that's all the site needs.

## One-time setup

1. Create a free account at <https://cloudinary.com> (the free tier is ~25 GB).
2. That's it — you now have a **Media Library** where you can upload and
   organise photos.

## Each time you want to change a page image

1. Open your Cloudinary **Media Library** and upload the photo (or pick an
   existing one).
2. Click the image, then **Copy URL** (choose the "secure" `https://…` link).
   It looks like:
   `https://res.cloudinary.com/your-cloud/image/upload/v1699999999/hero.jpg`
3. Go to **Pages CMS** (<https://app.pagescms.org>), open the **Home page** or
   **About page** entry, and paste that link into the **image URL** field.
4. **Save.** Netlify rebuilds and the new image appears on the site.

Leave the field blank to keep the current image.

## Tips

- You can resize/optimise on the fly by editing the URL, e.g. add
  `w_1200,q_auto,f_auto/` after `upload/` for a width-1200, auto-quality,
  auto-format version:
  `…/image/upload/w_1200,q_auto,f_auto/v1699999999/hero.jpg`
- Prefer landscape images for the Home hero and a portrait/tall crop for the
  About picture.
- You can also paste any other public image URL, or an uploaded repo path such
  as `images/uploads/photo.jpg`, into the same field.

## Where the text lives

The editable **text** for Home, About and Services is in Pages CMS too — under
the **Home page**, **About page** and **Services page** entries. These edit
`content/pages/*.json`; the build overlays that copy onto the English site
copy, so other languages keep working and simply fall back to English for any
wording you change.
