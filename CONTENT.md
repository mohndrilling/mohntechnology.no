# Editing content and images

This guide explains where to edit text and replace images so the site updates without changing code.

---

## Text content: Markdown file

Homepage copy is split by language:

- **`src/content/pages/home.no.md`** (Norwegian, `/no/`)
- **`src/content/pages/home.en.md`** (English, `/`)

The **History** page is edited in:

- **`src/content/history/history.no.md`** → `/no/history`
- **`src/content/history/history.en.md`** → `/history`

Open each file and edit the **YAML frontmatter** (the block at the top between the `---` lines) and, for History, the Markdown body below it.

| Section   | Fields to edit |
|-----------|----------------|
| **Page**  | `title`, `description` (browser tab and meta) |
| **Nav** | `navFeatures`, `navProduct`, `navFaq`, `navContact`, `navHistory`, `navPortal` |
| **Hero**  | `hero.badge`, `hero.titleBefore`, `hero.titleHighlight`, `hero.lead`, `hero.ctaPrimary`, `hero.ctaSecondary` |
| **Features** | `featuresTitle`, `featuresLead`, and each item under `features`: `icon`, `title`, `description` |
| **Product** | `productTitle`, `productLead`, `productTechnical`, `productPerformanceTitle`, `productPerformance` (list), `productSpecsTitle`, `productSpecs` (`label` / `value` pairs), `productBenefitsTitle`, `productBenefits` (list), `productHistoryCta`, `productSlideshow` (list of `image` + optional `alt` — files in `public/images/product/slideshow/`) |
| **Q&A (tabs)** | `faqTitle`, optional `faqLead`, and `faqTabs`: list of `{ label, items: [{ question, answer }] }` — at least one tab, each with at least one Q&A pair. Multi-line answers use YAML `\|` blocks. |
| **Contact** | `contactTitle`, `contactLead`, `contactPortalText`, `contactPortalLink`, `portalUrl` |
| **Footer** | `footerBrand`, `footerTagline`, `footerCopy` |

- Use quotes around values that contain colons or special characters.
- After saving, the dev server will reload and show your changes.

### Contact form API

The form submits via JavaScript to **`PUBLIC_CONTACT_API_URL`** (set in `.env` — see `.env.example`). Run the Go service in `backend/` (see `backend/README.md`) and restart `npm run dev` after changing the env var.

---

## Images: replace the placeholders

Images live under **`public/images/`**. The site uses paths like `/images/hero/hero.svg` (no `public/` in the path).

### Folder structure

| Folder | Purpose | Example files |
|--------|---------|----------------|
| `public/images/hero/` | Main hero image | `hero.svg` → replace with `hero.jpg` or `hero.png` |
| `public/images/features/` | Feature card images (optional) | `feature1.svg`, `feature2.svg`, `feature3.svg` |
| `public/images/product/` | Video poster or product image | `video-poster.svg` |

### How to use your own images

**Option A – Replace in place**  
Put your file in the same folder with the **same filename** (e.g. replace `public/images/hero/hero.svg` with your `hero.jpg`). Then in `home.md` set:

```yaml
hero:
  image: /images/hero/hero.jpg
```

**Option B – New filename**  
Add your image (e.g. `public/images/hero/wellboat.jpg`) and in `home.md` set:

```yaml
hero:
  image: /images/hero/wellboat.jpg
```

- Supported formats: JPG, PNG, WebP, SVG.
- Hero: landscape works best (e.g. 800×500 or 16:9).
- Feature images: optional; if you remove the `image` line from a feature, the card shows the icon and text only.
- Product slideshow: add images under `public/images/product/slideshow/` and list them in `productSlideshow` in `home.no.md` / `home.en.md` (at least one slide).

---

## Quick reference: image paths in `home.*.md`

```yaml
hero:
  image: /images/hero/hero.svg    # or your image path

features:
  - image: /images/features/feature1.svg
  - image: /images/features/feature2.svg
  - image: /images/features/feature3.svg

productSlideshow:
  - image: /images/product/slideshow/your-photo.jpg
    alt: Beskrivelse
```

All paths start with `/images/` and match files under `public/images/`.

---

## History page body

Below the frontmatter in `history.no.md` / `history.en.md`, use normal Markdown (`#` headings, lists, links). Link to the product section with `/no/#product` or `/#product` depending on language.
