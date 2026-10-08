# Daddu's Biryani — website v4

Built against the owner's master revision instructions. The admin panel, Supabase
setup and lead flow still work as before. No new npm packages.

**The one rule followed throughout: nothing is published that the owner did not
supply.** Anything still unconfirmed sits in `NEEDS_OWNER_INPUT` in `lib/brand.ts`
and simply does not render.

---

## 1. What was removed (instruction 31)

All of this was invented by the previous build and is now gone:

| Removed | Where it was |
|---|---|
| "Since 2015" | About page, footer |
| "Chef Daddu", grandmother in Hyderabad | About page, admin blog default author |
| "50,000+ / 5000+ happy customers" | About, home stats, admin dashboard |
| Team members "Sarah Khan", "Raj Patel" | About page |
| "4.8 ★ from 242 reviews" | Header, hero, home, about, admin dashboard, schema.org markup |
| Testimonials from Rajesh Kumar, Priya Singh, Ahmed Khan, Neha Patel | Home page, admin messages, `DATABASE_SCHEMA.sql` |
| Sample blog posts ("Full article content here…") | `DATABASE_SCHEMA.sql` — these would have appeared on the public blog |
| Every Unsplash stock photo | All pages |

The reviews section is **deliberately absent from the homepage**. To bring it back,
fill `NEEDS_OWNER_INPUT.reviews` and `NEEDS_OWNER_INPUT.rating` in `lib/brand.ts`.

## 2. Homepage flow (instruction 36)

Rebuilt in the order requested:

1. **Not one biryani. Many traditions.** — hero over the storefront video
2. **Taste before you choose** — the philosophy, not an offer
3. **Discover India through biryani** — four cities, each holding still while you read
4. **Which one is yours?** — the comparison (taste / heat / character / ideal for)
5. **BIRYANIEGINEERING** — right ingredients, process, proportion, consistent results
6. **You shouldn't have to search for the perfect bite** — flavour in every grain
7. **Five senses** — ending on "your taste decides"
8. **Menu highlights**
9. **What you actually get** — real portions
10. **Mirchi ka Salan & customisation**
11. **Biryani for 10 or 100?** — the bulk planner
12. **The Discovery Challenge**
13. **Founder** — Kailash Gaekwad
14. **Straight from our kitchen**
15. **Biryani Stories** + podcast slot
16. **Visit us**
17. **Don't just order biryani. Discover your biryani.**

## 3. Menu (instructions 9–13)

- Grouped by **Lucknowi / Hyderabadi / Kolkata / Mumbai**, then More biryani,
  Tawa Pulao, Kebabs, Rolls, Combos, Drinks.
- Each dish shows a row per cut with **NA** where a size isn't offered, exactly as asked:

  | Cut | Half | Full | 1 kg |
  |---|---|---|---|
  | Drumstick | ₹140 | ₹240 | ₹1,200 |
  | Curry Cut | NA | NA | ₹1,000 |
  | Boneless | NA | NA | ₹1,400 |

- **"What you get"** on each biryani opens the portion detail (350–375 g / 1 drumstick,
  550–575 g / 2 drumsticks, 1 kg = 10 drumsticks ≈ 2.8–3.0 kg cooked, serves ~5–7,
  curry cut 18–20 pieces, no neck, no rib cage).
- Tawa Pulao (including the Lucknowi-flavoured one) has its own section and is not
  presented as a regional biryani.
- Mutton is visible in every relevant region section rather than buried.

## 4. Salan and customisation (instructions 14–16)

Shown on the homepage and at the bottom of the menu:
- Mirchi ka Salan — available with every biryani style
- Extra masala — **Hyderabadi only, on selected 1 kg bulk orders**
- Kaju / mushroom / bell pepper — selected bulk orders, "ask us while ordering"

No prices are shown for these, because none exist in the pricing workbook.

## 5. Bulk planner (instructions 17–19)

Now asks all four inputs: **guests, veg / mixed / non-veg (with a split), which
biryani, and whether biryani is the main dish or served with other food.**

The serving basis is a single named constant at the top of
`components/home/PartyEstimator.tsx`:

```ts
const PER_KG = { main: 5, side: 7 };   // from "1 kg Lucknowi serves about 5–7"
```

Change those two numbers once the final figure is confirmed; nothing else needs editing.
The result is labelled a starting point, not a quote, and the assumption is printed
on screen. Event wording is now universal — the religious-event list is gone.

## 6. Founder (instruction 8)

`/about` now tells the real story: Kanpur → Mumbai → the missing flavour → travelling
and tasting → Hyderabad → notebook and repetition → regional styles → engineering →
BIRYANIEGINEERING, signed **Kailash Gaekwad, Founder**.

**Still needed from you:** the story behind the name "Daddu". It is stubbed at
`NEEDS_OWNER_INPUT.nameStory` — set `ready: true` and write the `body`, and a new
chapter appears automatically.

## 7. SEO (instructions 33–34)

- Dedicated pages: `/biryani/lucknowi`, `/biryani/hyderabadi`, `/biryani/kolkata`,
  `/biryani/mumbai` — each with its own title, description, canonical, prices,
  portions and `MenuSection` structured data.
- `Restaurant` structured data site-wide, **without** a rating.
- `sitemap.xml`, `robots.txt` (admin disallowed), proper 404 page.
- Unique titles and descriptions per page, Open Graph images, alt text on every image,
  one H1 per page, WebP images, lazy loading below the fold.

## 8. Conversion tracking (instruction 35)

Every action calls `track()` in `lib/analytics.ts`:
`whatsapp_click`, `call_click`, `menu_download`, `menu_view`, `directions_click`,
`tasting_enquiry`, `bulk_enquiry`, `lead_submitted`, `style_view`.

To switch on Google Analytics, add one line to `.env.local`:

```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Nothing else to change. Without it the site works exactly as now and events are
logged to the browser console in development.

## 9. WhatsApp (instruction 26)

Buttons sit at decision points only — hero, menu, each dish, tasting, salan, bulk,
location, footer — and each opens with a message that fits the action. Bulk includes
the guest count, date and chosen dishes. All message text lives in `WA` in `lib/site.ts`.

## 10. Where leads go

Unchanged: every form writes to the existing `leads` table and appears in `/admin/leads`.
The **Service** column now records the source: `Menu download`, `Bulk order`,
`Tasting / Discovery Challenge`, `Office lunch or corporate event`,
`Society event or family gathering`, `Birthday or celebration`, `Feedback`, `Something else`.

---

## Updating prices

```bash
pip install openpyxl reportlab
python scripts/extract_menu.py "path/to/Menu.xlsx"   # rebuilds data/menu.json
python scripts/build_menu_files.py                    # rebuilds the PDF + Excel
```

The website, the PDF and the Excel all read the same `data/menu.json`, so they cannot
disagree. Only the customer "Table Rates" columns are read — aggregator prices,
commission maths and the other sheets are never touched.

## Editing the words

Almost all copy is in **`lib/brand.ts`** — hero, the four regions, BIRYANIEGINEERING,
five senses, portions, salan, founder story, story ideas, final CTA. Business details
(phone, address, hours, WhatsApp text) are in **`lib/site.ts`**.

---

## Still to confirm before promoting the site

1. **Opening hours** — set to "11 AM – 11 PM, every day". The old contact page said
   Sunday 12–10. Fix in `lib/site.ts` if wrong.
2. **The "Daddu" name story** — see above.
3. **Reviews and rating** — nothing is shown until you supply genuine ones.
4. **"Mumbai" vs "Mumbai Twist"** — the workbook lists both at identical prices
   (curry cut ₹1,000/kg, boneless ₹1,400/kg). They are merged into one Mumbai style.
   If they are genuinely different dishes, tell us and we will split them.
5. **Kebab portions** — the sheet labels Mutton Shami "2 pc" but gives two prices
   (₹195 / ₹390), and Veg Shami "6 pc" at ₹100 / ₹200. Shown as Half / Full.
6. **Tagline spelling** — the logo reads "Zayqo ki Kahani"; your notes used
   "Zaiko Ki Kahani" and "Zaaykon Ki Kahani". The logo spelling is used for the brand
   and "Zaaykon Ki Kahani" for the podcast. Pick one and we will make it consistent.
7. **Photos** — the Google Drive folder could not be opened by the connected account,
   so the 14 photos supplied directly are used. Share the folder (or send the files)
   if it holds more.

---

# v5 — changes on 7 Oct 2026

**1. Menu prices — no change needed.**
The spreadsheet sent on 7 Oct is byte-for-byte identical to the one already in the
site (same MD5). Re-running the extractor produced an identical `data/menu.json`,
so every price on the website, the PDF and the Excel was already current.

**2. Style order is now Kolkata → Lucknowi → Hyderabadi → Mumbai.**
Set once in `BRAND.regions` (`lib/brand.ts`). That one array drives the homepage
journey, the comparison, the footer links, the "compare other styles" row and the
sitemap. The menu page order lives in `MENU_SECTIONS` (`lib/menu.ts`) and the
PDF/Excel order in `SECTIONS` (`scripts/build_menu_files.py`) — all three updated.

**3. "Heat" is now "Spice level",** shown the same way everywhere through one
component, `components/SpiceLevel.tsx`: filled chillies for the level, then the
words. It appears on the homepage journey, the comparison, each menu section, and
each style page. The levels themselves are unchanged and still the owner's:
Kolkata mild (1), Lucknowi mild (1), Hyderabadi medium to hot (3), Mumbai medium (2).

**4. The five senses moved into "Your taste. Your choice."**
The senses used to sit in a separate section further down the page. They now run
directly under the approved paragraph, building to "But ultimately, your taste
decides → Taste before you choose." Taste is marked as "the decider". The
standalone `FiveSenses` section was removed so nothing is said twice.

The paragraph circled and marked "yes" on the markup is unchanged, word for word.

**Still open:** the ChatGPT chat link mentioned in the request did not come through,
so this uses the five-senses wording from the master instruction document. Send the
link if there is newer copy in it.


---

# v6 — security and code quality, 7 Oct 2026

## Vulnerabilities: 17 → 0 in production

| | Before | After |
|---|---|---|
| Critical | 1 | 0 |
| High | 14 | 0 in production |
| Moderate | 2 | 0 in production |

`npm audit --omit=dev` now reports **found 0 vulnerabilities**.

**Removed 7 packages that were never imported anywhere:** `axios`, `date-fns`,
`next-seo`, `react-hook-form`, `react-markdown`, `remark-gfm`, `slugify`.
`axios` alone accounted for 12 of the 17 advisories. The site imports only
`next`, `react`, `react-dom`, `framer-motion`, `lucide-react` and
`@supabase/supabase-js`.

**Upgraded** Next.js to 15.5.27, which closes the critical unauthenticated remote
code execution advisory (GHSA-p293-qw3h-jr36) and the AVIF image-optimiser RCE.

**Patched transitive packages** through `overrides` in package.json: nanoid,
js-yaml, source-map-js, brace-expansion, sharp, postcss, postcss-selector-parser,
braces. Build tooling moved to `devDependencies` where it belongs.

### The 7 that remain, and why

They are all in Tailwind 3's file-scanning chain (`braces` / `micromatch` /
`fast-glob`) and in `eslint-config-next`. Three things about them:

1. They are **build-time only**. Nothing in that chain is sent to the browser or
   runs on the production server, which is why `--omit=dev` is clean.
2. There is **no patched version** — the advisory covers every release of
   `braces`. Tailwind 4 fixed it by dropping the dependency entirely.
3. `npm audit fix --force` would install **tailwindcss@4**, a rewrite that would
   require redoing the whole config and CSS layer system. Not worth breaking a
   working site for a build-machine denial-of-service risk.

**Do not run `npm audit fix --force`.**

## Code quality

- **TypeScript: 0 errors.** Replaced every `any` in the admin panel with real
  types, via a new `lib/errors.ts` helper for caught errors.
- **ESLint: 0 errors, 0 warnings.** Fixed unescaped apostrophes, a missing React
  hook dependency in the leads page, and documented why the admin image preview
  uses a plain `<img>`.
- **No external font requests.** Playfair Display (admin only) is now self-hosted
  alongside Rozha One and Mukta. The public blog post page now uses the site's own
  display font instead of the admin's.
- **The admin login no longer prints the password on screen.** It previously
  displayed "Default password: admin123" to anyone who opened the page.
- **Hero city list reordered** to Kolkata, Lucknow, Hyderabad, Mumbai — it was the
  one place still in the old order.

## A missing key no longer takes the site down

`lib/supabase.ts` used to throw `supabaseUrl is required`, which returned a 500 for
every page including the homepage. It now warns and carries on: all pages render,
and only the database features are unavailable. It also detects when `.env.local`
still holds the example values rather than real keys, and says so.


---

# v7 — menu and content presentation, 7 Oct 2026

Three deliverables, all built from the same source so they cannot disagree.

## 1. The menu page, rebuilt as a menu

It read like a spreadsheet: prices floated far from dish names across a wide
page, the section blurb was printed twice, and "—" in the cut column looked
like an error.

- **Dotted leader rules** run from each dish name to its price, as on a printed
  menu, and the whole list sits on one narrower measure so name and price stay
  close.
- **Single-price sections** (rolls, combos, drinks) print in two columns.
- **Sized sections** keep the aligned Half / Full / 1 kg grid, with NA where a
  size is not offered, and column headings once per section.
- **Phones get a stacked layout** — "Half ₹180 · Full ₹320 · 1 kg ₹1,600"
  inline — because three fixed columns squeezed the dish names.
- Section heads now carry spice level, character and ideal-for on one line, with
  a small dish photo, and the duplicated blurb is gone.
- One "Order on WhatsApp" per section instead of one per dish.

**The page is 10,800px instead of 26,300px** — the same dishes, 60% less scrolling.

### Two data bugs this surfaced

- **Tawa Pulao printed "Boneless" three times.** Those dishes differ by regional
  flavour, not by cut. Variant rows are now labelled by whatever actually differs
  — the cut, or the style — via `variantLabels()` in `lib/menu.ts`.
- **Four kebabs showed "NA NA" and no price at all.** A single-variant dish with
  a cut was rendering an empty variant row and hiding its own price. Those names
  already contain the cut, so the label is dropped. Fixed on the website, in the
  PDF and in the Excel.

## 2. The printable menu, redesigned as a menu card

`public/downloads/daddus-biryani-menu.pdf`

- **A proper cover**: logo, "Not one biryani. Many traditions.", the four cities,
  "Taste before you choose.", and the address and hours — on a jaali lattice.
- Inner pages follow the website: section heads carry taste, character and spice
  level; prices align in columns; single-price sections print in two columns.
- Closing bands for portions and add-ons, then a sign-off line.
- The Excel sheet now has a Variant column, so cuts and styles are explicit.

## 3. A review document for sign-off

`review/daddus-biryani-content-review.pdf` — 17 pages, in three parts:

1. **What still needs your decision** — nine open points, each with a tick box.
2. **Every word on the website**, page by page, with where each line appears.
3. **Every dish and every price**, all 126 lines, grouped as on the menu.

It is generated from the live source (`data/menu.json` and `lib/brand.ts`), so it
always matches what is published.

**It is deliberately NOT in `public/`.** It contains internal notes and open
questions; anything in `public/` can be downloaded by anyone who guesses the URL.

### Rebuilding it

```bash
npx tsc lib/brand.ts --outDir /tmp/brandjs --module commonjs --target es2020 --skipLibCheck
node -e "const b=require('/tmp/brandjs/brand.js');require('fs').writeFileSync('/tmp/brand.json',JSON.stringify({BRAND:b.BRAND,NEEDS:b.NEEDS_OWNER_INPUT}))"
python scripts/build_review_doc.py
```

---

# v8 — new photography and content changes, 8 Oct 2026

Your seven numbered instructions, one by one.

## 1. All images replaced

Every dish photograph on the website now comes from the `Resize` set you sent.
The 36 originals became 22 web images — 11 dishes, each in a wide version and a
tall version, so the same photograph can fill both a landscape card and an
upright gallery tile without being stretched.

```
public/images/dishes/
  chicken-lucknowi-biryani.webp      chicken-lucknowi-biryani-tall.webp
  chicken-hyderabadi-biryani.webp    chicken-hyderabadi-biryani-tall.webp
  kolkata-biryani.webp               kolkata-biryani-tall.webp
  mumbai-biryani.webp                mumbai-biryani-tall.webp
  veg-lucknowi-biryani.webp          veg-lucknowi-biryani-tall.webp
  veg-hyderabadi-biryani.webp        veg-hyderabadi-biryani-tall.webp
  soya-chunks-biryani.webp           soya-chunks-biryani-tall.webp
  mutton-yakhni-pulao.webp           mutton-yakhni-pulao-tall.webp
  mutton-awadhi-pulao.webp           mutton-awadhi-pulao-tall.webp
  chicken-shami-kebab.webp           chicken-shami-kebab-tall.webp
  chicken-seekh-kebab.webp           chicken-seekh-kebab-tall.webp
```

**Every old photograph is gone.** The share image that appears when someone sends
the website link on WhatsApp (`public/images/og-image.jpg`) was rebuilt from the
new Lucknowi photograph as well.

Two files are deliberately not from this set:

- `public/images/hero-poster.webp` — the still frame shown while the hero video
  loads. It has to match the video, not the photographs.
- `public/logo.png` — unchanged. See "What we still need from you" below.

The old set had an egg biryani photograph and the new one does not, so the egg
tile on the homepage now shows **Mutton Awadhi Pulao** instead. Nothing on the
site shows a photograph of a dish it is not. Send photographs of egg biryani,
paneer or paratha and they slot straight in — `scripts/extract_menu.py` has an
`IMAGES` list that maps a dish to its picture.

## 2. Mirchi ka Salan

The heading is now simply **"Mirchi ka Salan"**, with "Set your own heat" as the
small label above it. The section is otherwise unchanged.

## 3. "Taste Before You Choose"

The five-senses section has been rewritten with your words.

- **Heading** — Taste Before You Choose
- **Opening** — Your eyes can admire it. Your nose can enjoy its aroma. But will
  you love its taste? Take a bite and discover.
- **The five** — Eyes (see the rice, colours and presentation) · Nose (smells the
  aroma) · Ears (hear stories, descriptions and recommendations) · Skin (feels
  warmth and texture) · Taste buds (discover the taste). Taste buds are marked
  **the decider** and shown in dark green so the eye lands there last.
- **Then** — the character paragraph, and "A photograph cannot tell you which one
  you will enjoy. Neither can someone else's favourite."
- **The offer**, in its own dark panel — *That is why, at Daddu's Biryani, we
  offer free tasting before you order.* Under it: "Try the different flavours.
  Discover your favourite. Order only what you love.", then **पहले चखें, फिर चुनें।**
  and a WhatsApp button that opens with a tasting enquiry.

## 4. Mumbai is now the hottest

| Style | Spice | Character |
|---|---|---|
| Kolkata | Mild | Aloo and egg tradition |
| Lucknowi | Mild | Yakhni-led |
| Hyderabadi | **Medium** | Masala-led marinade |
| Mumbai | **Hot** | Masala-led, cooked in the dum |

Mumbai now carries three chillies and Hyderabadi two, everywhere the spice
indicator appears — the city journey, the comparison table, the menu section
heads and each style's own page.

**Please check this.** To put Mumbai above Hyderabadi, Hyderabadi had to come
down from Hot to Medium. If Hyderabadi should stay Hot and Mumbai go higher
still, say so and we will add a fourth level.

## 5. BIRYANIEGINEERING

| | Heading | Now reads |
|---|---|---|
| 1 | Right ingredients | Antibiotic-free chicken, rice good enough to hold its shape through the dum, and export-quality spices. |
| 2 | Right process | Heat management — proper control of the heat at every stage of the cooking. |
| 3 | Right proportion | Everything measured to an accuracy of 1 gram. No andaza. |
| 4 | Consistent results | The same biryani this week as the one you liked last week. |

Your three new lines are all here. They have been matched to the heading each one
actually describes — the 1-gram line is about *proportion*, the ingredients line
about *ingredients*, the heat line about *process* — so the four headings still
read "Right Ingredients. Right Process. Right Proportion. Consistent Results.",
which is the line used on the About page and in the menu card.

## 6. "Eating biryani is an art too"

The old English section is gone. In its place, your Hindi passage in full, from
**बिरयानी बनाना अगर एक कला है, तो उसे खाना भी एक कला है।** through to
**हर कौर बनाने की मेहनत हमारी रसोई में हो, ताकि आपकी थाली में हर कौर का आनंद मिले।**

Beside it: a photograph, and the diagram of flavour spreading into every grain of
rice. The About page carries the first three paragraphs of the same passage.

**The photograph is a placeholder.** You asked for a picture of someone taking a
bite of biryani, and there is no such photograph in the set — all 36 are plated
dishes with nobody in frame. A plated dish stands in for now. The file marks the
exact spot:

```
components/home/EveryGrain.tsx   — search for "SWAP ME"
```

Send a bite photograph and it is a two-line change.

## 7. The bulk estimator, reordered

"Biryani for 10 or 100?" now asks in this order:

1. **Veg or non-veg?**
2. *(mixed groups only)* Roughly how does the group split?
3. **Which biryani?**
4. How many guests? — the slider
5. How is it being served?
6. Date (optional)

Veg-or-non-veg and the dish choice now come **before** the slider, so the weight
and the price animate with the actual dish already chosen. The step numbers count
themselves, so a non-veg order reads 1-2-3-4-5 with no gap where the "split"
question would have been.

Your instruction stopped mid-sentence — *"after the sliding animation add"* —
so nothing has been added after the slider beyond what was already there (the
estimate card, the per-kg working, and the WhatsApp quote button). Tell us what
should follow and it goes in.

## What we still need from you

| | |
|---|---|
| **Bite photograph** | One picture of biryani being eaten, for instruction 6. |
| **Logo file** | The logo you sent came through as an image in the chat, not as a file. The website still uses the logo already in the project. If the one you sent is different, send the PNG or SVG. |
| **Hyderabadi spice** | Confirm Medium is right (see 4 above). |
| **End of instruction 7** | What should come after the sliding animation? |
| **Missing dish photographs** | Egg biryani, paneer, paratha. |

## Rebuilt in this version

- `public/downloads/daddus-biryani-menu.pdf` and `.xlsx`
- `review/daddus-biryani-content-review.pdf` — now 18 pages, carrying all the new
  wording above, including the Hindi passage, for you to read and sign off

Checked: TypeScript clean, no lint warnings, production build with no environment
variables at all, all 22 routes returning 200, and the review PDF still returning
404 from the public site.
