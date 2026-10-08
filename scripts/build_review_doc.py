"""
Builds a review document for the owner:

  review/daddus-biryani-content-review.pdf

NOT written into public/, because this document contains internal notes and
open questions. Anything in public/ is downloadable by anyone who guesses
the URL.

Everything in it is read from the live source, so it always matches the website:
  - menu and prices  -> data/menu.json
  - website copy     -> lib/brand.ts (compiled to /tmp/brand.json first)
  - open questions   -> the OPEN list below

Usage:
  npx tsc lib/brand.ts --outDir /tmp/brandjs --module commonjs --target es2020 --skipLibCheck
  node -e "const b=require('/tmp/brandjs/brand.js');require('fs').writeFileSync('/tmp/brand.json',JSON.stringify({BRAND:b.BRAND,NEEDS:b.NEEDS_OWNER_INPUT}))"
  python scripts/build_review_doc.py
"""
import json, os, datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, Frame, PageTemplate, Paragraph, Table,
                                TableStyle, Spacer, KeepTogether, NextPageTemplate,
                                CondPageBreak, PageBreak)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.path.join(ROOT, 'scripts', 'fonts')
OUT = os.path.join(ROOT, 'review')   # deliberately outside public/
os.makedirs(OUT, exist_ok=True)

items = json.load(open(os.path.join(ROOT, 'data', 'menu.json')))
brand = json.load(open('/tmp/brand.json'))
B, NEEDS = brand['BRAND'], brand['NEEDS']

GREEN = HexColor('#0E3B2F')
BRASS = HexColor('#C9A24B')
BRASS_DK = HexColor('#9A7A2E')
IVORY = HexColor('#FBF5E9')
IVORY_DIM = HexColor('#F1E7D2')
INK = HexColor('#1F2A24')
MUTED = HexColor('#6B7A71')
FAINT = HexColor('#AEB8B1')
RULE = HexColor('#E0D4BA')
CHILLI = HexColor('#B3261E')

for n, f in [('Rozha', 'RozhaOne-Regular.ttf'), ('Mukta', 'Mukta-Regular.ttf'),
             ('Mukta-SB', 'Mukta-SemiBold.ttf'), ('Mukta-B', 'Mukta-Bold.ttf')]:
    pdfmetrics.registerFont(TTFont(n, os.path.join(FONTS, f)))

W, H = A4
M = 18 * mm
CW = W - 2 * M
TODAY = datetime.date.today().strftime('%d %B %Y')

h1 = ParagraphStyle('h1', fontName='Rozha', fontSize=22, leading=26, textColor=GREEN)
h2 = ParagraphStyle('h2', fontName='Mukta-B', fontSize=11.5, leading=15, textColor=GREEN, spaceBefore=2)
lbl = ParagraphStyle('lbl', fontName='Mukta-SB', fontSize=8.5, leading=11, textColor=BRASS_DK)
body = ParagraphStyle('body', fontName='Mukta', fontSize=9.5, leading=13, textColor=INK)
quote = ParagraphStyle('q', fontName='Mukta', fontSize=9.5, leading=13.5, textColor=INK)
small = ParagraphStyle('sm', fontName='Mukta', fontSize=8.5, leading=11.5, textColor=MUTED)
price = ParagraphStyle('p', fontName='Mukta-SB', fontSize=9.5, leading=13, textColor=GREEN, alignment=TA_RIGHT)
na = ParagraphStyle('na', fontName='Mukta', fontSize=9, leading=13, textColor=FAINT, alignment=TA_RIGHT)

rs = lambda v: f'₹{v:,}'
SIZES = [('half', 'Half'), ('full', 'Full'), ('perKg', 'Per kg'), ('price', 'Price')]

SECTION_TITLES = [
    ('kolkata', 'Kolkata'), ('lucknowi', 'Lucknowi'), ('hyderabadi', 'Hyderabadi'),
    ('mumbai', 'Mumbai'), ('other-biryani', 'More biryani'), ('tawa', 'Tawa Pulao & Anda Rice'),
    ('kebabs', 'Kebabs & Starters'), ('rolls', 'Rolls'), ('combos', 'Combos'), ('drinks', 'Drinks'),
]


def section_of(it):
    if it['category'] in ('biryani', 'pulao'):
        return it.get('region') or 'other-biryani'
    if it['category'] == 'tawa':
        return 'tawa'
    return it['category']


def variant_labels(variants):
    if len(variants) < 2:
        return None
    cuts = [v.get('cut') or '' for v in variants]
    if len(set(cuts)) > 1:
        return [c or 'Standard' for c in cuts]
    regions = [v.get('region') or '' for v in variants]
    if len(set(regions)) > 1:
        t = dict(SECTION_TITLES)
        return [t.get(r, 'Standard') for r in regions]
    return cuts if cuts[0] else None


# ---------------------------------------------------------------- open questions
OPEN = [
    ('Opening hours',
     'The site says "11 AM – 11 PM, every day". The previous contact page said Sunday 12–10. '
     'Which is right?',
     'Shown in the header, footer, contact page, every style page and in the Google listing data.'),
    ('The story behind the name "Daddu"',
     'You asked for this on the About page but have not sent the wording. Nothing is published in its place — '
     'the section simply does not appear.',
     'Send a paragraph and it will slot into the founder story automatically.'),
    ('Customer reviews and the star rating',
     'The old site claimed "4.8 from 242 reviews" and showed four testimonials. None of it could be verified, '
     'so all of it was removed, including from the Google search data.',
     'Send real reviews (ideally ones that mention the difference between styles) and the section returns.'),
    ('"Mumbai" and "Mumbai Twist"',
     'The price sheet lists both, at identical prices (curry cut ₹1,000/kg, boneless ₹1,400/kg). '
     'They are currently shown as one Mumbai style.',
     'If they are genuinely different dishes, say so and they will be split.'),
    ('Kebab portions',
     'The sheet labels Mutton Shami Kebab "2 pc" but gives two prices (₹195 / ₹390), and Veg Shami '
     '"6 pc" at ₹100 / ₹200. Both are shown as Half and Full.',
     'Confirm how many pieces are in a half and a full.'),
    ('Tagline spelling',
     'The logo reads "Zayqo ki Kahani". Your notes used "Zaiko Ki Kahani" and "Zaaykon Ki Kahani". '
     'The logo spelling is used for the brand, and "Zaaykon Ki Kahani" for the podcast.',
     'Pick one and it will be made consistent everywhere.'),
    ('Order of the four styles',
     'The running order is Kolkata, Lucknowi, Hyderabadi, Mumbai, as you asked. Note it is not ascending by '
     'spice: Hyderabadi (medium to hot) comes before Mumbai (medium).',
     'If you wanted customers walked up the heat scale, Mumbai should come before Hyderabadi.'),
    ('Photographs',
     'The Google Drive folder could not be opened by the connected account, so the 14 photos you sent '
     'directly are the ones in use.',
     'Share the folder, or send any extra photos, and they will be added.'),
    ('Bulk serving figure',
     'The order calculator works from "1 kg Lucknowi serves about 5–7": 1 kg per 5 people when biryani is '
     'the main dish, per 7 when there are other dishes.',
     'Confirm, or give a different figure, and the calculator follows it.'),
]


# ---------------------------------------------------------------- page furniture
def cover(c, doc):
    c.saveState()
    c.setFillColor(GREEN); c.rect(0, 0, W, H, stroke=0, fill=1)
    c.drawImage(os.path.join(ROOT, 'public', 'logo.png'), W / 2 - 20 * mm, H - 78 * mm, 40 * mm, 40 * mm, mask='auto')
    c.setFillColor(IVORY); c.setFont('Rozha', 34)
    c.drawCentredString(W / 2, H - 96 * mm, "Daddu's Biryani")
    c.setFillColor(BRASS); c.setFont('Mukta-SB', 12)
    c.drawCentredString(W / 2, H - 104 * mm, 'Zayqo ki Kahani')

    c.setStrokeColor(BRASS); c.setLineWidth(0.8)
    c.line(W / 2 - 28 * mm, H - 114 * mm, W / 2 + 28 * mm, H - 114 * mm)

    c.setFillColor(IVORY); c.setFont('Rozha', 26)
    c.drawCentredString(W / 2, H - 132 * mm, 'Menu and content review')
    c.setFillColor(BRASS); c.setFont('Mukta', 11)
    c.drawCentredString(W / 2, H - 142 * mm, f'Everything on the website, in one place  ·  {TODAY}')

    c.setFillColor(IVORY); c.setFont('Mukta', 10)
    for i, line in enumerate([
        'Part 1  What still needs your decision',
        'Part 2  Every word on the website, page by page',
        'Part 3  Every dish and every price',
    ]):
        c.drawCentredString(W / 2, H - 168 * mm - i * 7 * mm, line)

    c.setFillColor(BRASS); c.setFont('Mukta', 9)
    c.drawCentredString(W / 2, 28 * mm, 'Nothing in this document was invented. Every claim came from you.')
    c.drawCentredString(W / 2, 22 * mm, 'Anything not confirmed is listed in Part 1 and is not published.')
    c.restoreState()


def inner(c, doc):
    c.saveState()
    c.setFillColor(IVORY); c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(GREEN); c.rect(0, H - 14 * mm, W, 14 * mm, stroke=0, fill=1)
    c.setFillColor(IVORY); c.setFont('Rozha', 12)
    c.drawString(M, H - 9.5 * mm, "Daddu's Biryani  ·  Menu and content review")
    c.setFillColor(BRASS); c.setFont('Mukta', 9)
    c.drawRightString(W - M, H - 9.5 * mm, TODAY)

    c.setStrokeColor(RULE); c.setLineWidth(0.6)
    c.line(M, 13 * mm, W - M, 13 * mm)
    c.setFillColor(MUTED); c.setFont('Mukta', 8)
    c.drawString(M, 8.5 * mm, 'Generated from the live website source')
    c.drawRightString(W - M, 8.5 * mm, f'Page {doc.page - 1}')
    c.restoreState()


def part_title(n, title, sub):
    t = Table([[Paragraph(f'Part {n}', lbl)], [Paragraph(title, h1)], [Paragraph(sub, small)]], colWidths=[CW])
    t.setStyle(TableStyle([
        ('LINEABOVE', (0, 0), (-1, 0), 1.2, GREEN),
        ('TOPPADDING', (0, 0), (-1, 0), 8), ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
        ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ]))
    return KeepTogether([CondPageBreak(60 * mm), t, Spacer(1, 6 * mm)])


def block(title, rows, note=None):
    """A labelled block: left column says where it appears, right column is the copy."""
    data = []
    for where, what in rows:
        data.append([Paragraph(where, lbl), Paragraph(what, quote)])
    t = Table(data, colWidths=[36 * mm, CW - 36 * mm])
    t.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LINEABOVE', (0, 0), (-1, -1), 0.4, RULE),
        ('TOPPADDING', (0, 0), (-1, -1), 5), ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    parts = [CondPageBreak(34 * mm), Paragraph(title, h2), Spacer(1, 2 * mm), t]
    if note:
        parts += [Spacer(1, 1.5 * mm), Paragraph(note, small)]
    parts.append(Spacer(1, 5 * mm))
    return KeepTogether(parts)


story = [NextPageTemplate('inner'), PageBreak()]

# ---------------------------------------------------------------- Part 1
story.append(part_title(1, 'What still needs your decision',
                        'Nine open points. Until each is settled, the website either leaves the item out or uses what you '
                        'last confirmed. Tick a box when you have given an answer.'))

for i, (title, what, effect) in enumerate(OPEN, 1):
    rows = [[Paragraph('❑', ParagraphStyle('box', fontName='Mukta', fontSize=14, textColor=BRASS)),
             Paragraph(f'<font name="Mukta-B" color="#0E3B2F">{i}. {title}</font><br/>'
                       f'<font name="Mukta" color="#1F2A24">{what}</font><br/>'
                       f'<font name="Mukta" color="#6B7A71">{effect}</font>', body)]]
    t = Table(rows, colWidths=[9 * mm, CW - 9 * mm])
    t.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BACKGROUND', (0, 0), (-1, -1), IVORY_DIM),
        ('LEFTPADDING', (0, 0), (0, -1), 7), ('RIGHTPADDING', (-1, 0), (-1, -1), 9),
        ('TOPPADDING', (0, 0), (-1, -1), 7), ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
    ]))
    story += [KeepTogether([CondPageBreak(26 * mm), t, Spacer(1, 3 * mm)])]

story.append(Spacer(1, 4 * mm))

# ---------------------------------------------------------------- Part 2
story.append(part_title(2, 'Every word on the website',
                        'Page by page, in the order a visitor meets it. Mark anything you want changed.'))

cities = '  ·  '.join(B['hero']['cities'])
story.append(block('Home · opening screen', [
    ('Headline', B['hero']['kicker']),
    ('Under it', cities),
    ('Line', B['hero']['line']),
    ('Promise', B['hero']['promise']),
    ('Support', B['hero']['support']),
    ('Buttons', 'Experience the tasting  ·  Order on WhatsApp  ·  View menu'),
]))

story.append(block('Home · your taste, your choice', [
    ('Heading', B['tasteFirst']['title']),
    ('Question', B['tasteFirst']['question']),
    ('Body', B['tasteFirst']['body']),
    ('Closing', B['tasteFirst']['close']),
]))

senses = '<br/>'.join(f'<b>{s["label"]}</b> — {s["body"]}' for s in B['senses']['items'])
story.append(block('Home · taste before you choose', [
    ('Heading', B['senses']['title']),
    ('Intro', B['senses']['intro']),
    ('The five', senses),
    ('Character', B['senses']['character']),
    ('Why', B['senses']['cannotTell']),
    ('The offer', '<b>' + B['senses']['offer'] + '</b>'),
    ('Invitation', B['senses']['invitation']),
    ('In Hindi', B['senses']['hindi']),
], note='Taste buds are marked "the decider". The free-tasting offer sits in a dark panel with the WhatsApp button beside it.'))

story.append(block('Home · discover India through biryani', [
    ('Heading', B['discover']['title']),
    ('Sub', B['discover']['sub']),
]))

for r in B['regions']:
    story.append(block(f'Style · {r["style"]}', [
        ('City', f'{r["city"]}  ({r["hindi"]})'),
        ('Short', r['short']),
        ('Description', r['body']),
        ('Taste', r['taste']),
        ('Spice level', r['spice']),
        ('Character', r['character']),
        ('Ideal for', r['idealFor']),
    ], note=f'Also used on its own page at /biryani/{r["key"]} and in the comparison table.'))

story.append(block('Home · still deciding', [
    ('Heading', B['undecided']['title']),
    ('Line', B['undecided']['line']),
]))

pillars = '<br/>'.join(f'<b>{p["title"]}</b> — {p["body"]}' for p in B['engineering']['pillars'])
story.append(block('Home · BIRYANIEGINEERING', [
    ('Name', B['engineering']['name']),
    ('Question', B['engineering']['question']),
    ('Body', B['engineering']['body']),
    ('The four', pillars),
]))

grain = [('Heading', B['everyGrain']['title'])]
grain += [(f'Para {i + 1}', p) for i, p in enumerate(B['everyGrain']['paragraphs'])]
grain.append(('Closing', B['everyGrain']['close']))
story.append(block('Home · eating biryani is an art too', grain,
                   note='Written in Hindi, as supplied. Shown beside a photograph of biryani being eaten '
                        'and the diagram of flavour reaching every grain.'))

sizes = '<br/>'.join(f'<b>{s["name"]}</b> — ' + ', '.join(s['lines']) + (f' ({s["note"]})' if s.get('note') else '')
                    for s in B['portions']['sizes'])
story.append(block('Home · what you actually get', [
    ('Heading', B['portions']['title']),
    ('Body', B['portions']['body']),
    ('Sizes', sizes),
    ('Curry cut', B['portions']['curryCut']),
], note='These are your figures. They also appear on the menu page behind "What you get", and in the PDF menu.'))

salan = '<br/>'.join(f'<b>{p["title"]}</b> — {p["body"]}' for p in B['salan']['points'])
story.append(block('Home and menu · add-ons', [
    ('Heading', B['salan']['title']),
    ('Body', B['salan']['body']),
    ('Principle', B['salan']['principle']),
    ('The three', salan),
], note='No prices are shown for these, because none appear in the price sheet.'))

story.append(block('Home · bulk and party orders', [
    ('Heading', B['bulk']['title']),
    ('Body', B['bulk']['body']),
    ('Events', '  ·  '.join(B['bulk']['events'])),
    ('Calculator', 'Asks: how many guests, veg / mixed / non-veg, which biryani, and whether biryani is the '
                   'main dish or served with other food.'),
], note='The estimate is labelled a starting point, not a quote.'))

steps = '<br/>'.join(f'<b>{s["title"]}</b> — {s["body"]}' for s in B['challenge']['steps'])
story.append(block('Home · the Discovery Challenge', [
    ('Heading', B['challenge']['title']),
    ('Body', B['challenge']['body']),
    ('Steps', steps),
    ('Button', B['challenge']['cta']),
], note='No terms are stated — free or paid, portion size, conditions. Every button opens a WhatsApp conversation instead.'))

story.append(block('Home · closing', [
    ('Heading', B['finalCta']['title']),
    ('Line', B['finalCta']['line']),
]))

chapters = '<br/><br/>'.join(f'<b>{c["heading"]}</b><br/>{c["body"]}' for c in B['founder']['story'])
story.append(block('Our Story page', [
    ('Headline', B['founder']['headline']),
    ('Founder', f'{B["founder"]["name"]}, {B["founder"]["role"]}'),
    ('The story', chapters),
], note='The "Daddu" name chapter is not published — see Part 1, item 2.'))

story.append(block('Stories page', [
    ('Heading', B['stories']['title']),
    ('Sub', B['stories']['sub']),
    ('Planned articles', '<br/>'.join(B['stories']['ideas'])),
    ('Podcast', f'{B["podcast"]["title"]} — {B["podcast"]["sub"]}. {B["podcast"]["body"]}'),
]))

story.append(block('Gallery page', [
    ('Heading', 'What you see is what we serve.'),
    ('Intro', 'Real food, real portions, photographed in our own kitchen. No stock pictures anywhere on this '
              'site. Tap any photo to see it larger.'),
]))

story.append(block('Contact page', [
    ('Heading', 'Order, ask, or plan for a crowd.'),
    ('Intro', 'The fastest way to reach us is WhatsApp. For office lunches, society events and bulk orders, '
              'leave your details and we will call you back.'),
    ('Enquiry types', 'Order for today  ·  Tasting / Discovery Challenge  ·  Office lunch or corporate event  ·  '
                      'Society event or family gathering  ·  Birthday or celebration  ·  Feedback  ·  Something else'),
]))

story.append(block('Search engine wording', [
    ('Site title', "Daddu's Biryani | Not one biryani. Many traditions. Malad East, Mumbai"),
    ('Site description', 'Lucknowi, Hyderabadi, Kolkata and Mumbai-style dum biryani in Malad East, Mumbai. '
                         'Every palate is different — taste the styles before you choose. Kebabs, rolls, combos '
                         'and party orders by the kilo.'),
    ('Style pages', 'Each of the four styles has its own page and its own wording, '
                    'for example "Kolkata Biryani in Malad East".'),
], note='No star rating is published in the search data, because none has been verified.'))

# ---------------------------------------------------------------- Part 3
story.append(PageBreak())
story.append(part_title(3, 'Every dish and every price',
                        f'All {len(items)} lines from your price sheet, in the order they appear on the website and in '
                        'the menu. "NA" means that size is not offered.'))

for key, title in SECTION_TITLES:
    rows_in = [i for i in items if section_of(i) == key]
    if not rows_in:
        continue
    groups = []
    for it in rows_in:
        g = next((x for x in groups if x[0] == it['name']), None)
        if g:
            g[1].append(it)
        else:
            groups.append((it['name'], [it]))

    cols = [(k, l) for k, l in SIZES if any(v['prices'].get(k) for _, vs in groups for v in vs)]
    pw = 19 * mm
    widths = [CW - pw * len(cols)] + [pw] * len(cols)
    data = [[Paragraph(title, h2)] + [Paragraph(l, lbl) for _, l in cols]]
    styles = [
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LINEBELOW', (0, 0), (-1, 0), 0.8, GREEN),
        ('TOPPADDING', (0, 0), (-1, -1), 4), ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
    ]
    for name, variants in groups:
        lead = variants[0]
        labels = variant_labels(variants)
        r = len(data)
        veg = '' if 'veg' not in lead else ('<font color="#2E8B3E">■</font> ' if lead['veg'] else '<font color="#B3261E">■</font> ')
        if not labels:
            cells = [Paragraph(rs(lead['prices'][k]), price) if lead['prices'].get(k) else Paragraph('NA', na)
                     for k, _ in cols]
        else:
            cells = [''] * len(cols)
        data.append([Paragraph(veg + name, body)] + cells)
        styles.append(('LINEABOVE', (0, r), (-1, r), 0.4, RULE))

        extra = lead.get('note') or ''
        if lead.get('includes'):
            extra = ', '.join(lead['includes'])
            if lead.get('serves'):
                extra += f' (serves {lead["serves"]})'
        if extra:
            data.append([Paragraph(extra, small)] + [''] * len(cols))
            styles.append(('TOPPADDING', (0, len(data) - 1), (-1, len(data) - 1), 0))

        if labels:
            for v, l in zip(variants, labels):
                cells = [Paragraph(rs(v['prices'][k]), price) if v['prices'].get(k) else Paragraph('NA', na)
                         for k, _ in cols]
                data.append([Paragraph(f'&nbsp;&nbsp;&nbsp;{l}', small)] + cells)

    t = Table(data, colWidths=widths, repeatRows=1)
    t.setStyle(TableStyle(styles))
    story += [KeepTogether([CondPageBreak(40 * mm), t, Spacer(1, 6 * mm)])]

sign = Table([[Paragraph(
    '<font name="Mukta-B" color="#0E3B2F" size="11">Approved by</font><br/><br/>'
    '<font name="Mukta" color="#6B7A71" size="9.5">Name ______________________________    '
    'Signature ______________________________    Date ____________</font>',
    ParagraphStyle('s', leading=15))]], colWidths=[CW])
sign.setStyle(TableStyle([
    ('LINEABOVE', (0, 0), (-1, 0), 1.1, BRASS),
    ('TOPPADDING', (0, 0), (-1, -1), 10),
    ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 0),
]))
story += [Spacer(1, 6 * mm), sign]

path = os.path.join(OUT, 'daddus-biryani-content-review.pdf')
doc = BaseDocTemplate(path, pagesize=A4, title="Daddu's Biryani — Menu and content review",
                      author="Daddu's Biryani")
doc.addPageTemplates([
    PageTemplate('cover', [Frame(M, 18 * mm, CW, H - 40 * mm, id='cv')], onPage=cover),
    PageTemplate('inner', [Frame(M, 17 * mm, CW, H - 14 * mm - 24 * mm, id='in')], onPage=inner),
])
doc.build(story)
print('wrote', path, os.path.getsize(path) // 1024, 'KB')
