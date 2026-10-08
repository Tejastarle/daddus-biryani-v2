"""
Builds data/menu.json from the owner's master pricing workbook.

Only the customer-facing "Daddu's Biryani Table Rates" columns (G/H/I of Sheet6)
are read. Aggregator rates, commission maths and every other sheet are ignored,
so nothing internal can leak onto the website.

Each dish is tagged with its region (Lucknowi / Hyderabadi / Kolkata / Mumbai)
and its cut (Drumstick / Curry Cut / Boneless), and the retail row is merged
with the matching bulk row so one line shows Half, Full and Per kg together,
with "NA" where a size is not offered.

Usage:  python scripts/extract_menu.py path/to/Menu.xlsx
"""
import json, math, re, sys, openpyxl

SRC = sys.argv[1] if len(sys.argv) > 1 else 'Menu.xlsx'
ws = openpyxl.load_workbook(SRC)['Sheet6']

# --- spelling the website uses -------------------------------------------------
RENAME = [
    ('Hydrabadi', 'Hyderabadi'), ('Lakhnavi', 'Lucknowi'), ('Biryanii', 'Biryani'),
    ('Lollypop', 'Lollipop'), ('Kolkatai', 'Kolkata'), ('Smal)l', 'Small'),
    ('Kabab', 'Kebab'), ('Soyabean', 'Soya'),
]


def clean(s):
    s = str(s)
    for a, b in RENAME:
        s = s.replace(a, b)
    return re.sub(r'\s{2,}', ' ', s).strip()


# --- resolve the few simple formulas in the table-rate columns -----------------
def num(val, row):
    if val is None or val == '--':
        return None
    if isinstance(val, (int, float)):
        return int(val)
    f = str(val)
    m = re.fullmatch(r'=CEILING\(H(\d+)\*([\d.]+),(\d+)\)', f)
    if m:
        base = num(ws.cell(int(m.group(1)), 8).value, int(m.group(1)))
        step = int(m.group(3))
        return int(math.ceil(base * float(m.group(2)) / step) * step)
    m = re.fullmatch(r'=H(\d+)\*(\d+)', f)
    if m:
        return num(ws.cell(int(m.group(1)), 8).value, int(m.group(1))) * int(m.group(2))
    m = re.fullmatch(r'=([\d+]+)', f)
    if m:
        return sum(int(x) for x in m.group(1).split('+'))
    raise ValueError(f'Unhandled formula {f} at row {row}')


def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


# --- classification ------------------------------------------------------------
REGIONS = [('Lucknowi', 'lucknowi'), ('Hyderabadi', 'hyderabadi'),
           ('Kolkata', 'kolkata'), ('Mumbai', 'mumbai')]


def region_of(name):
    for label, key in REGIONS:
        if label in name:
            return key
    if 'Yakhni' in name or 'Awadhi' in name:
        return 'lucknowi'          # both are Awadhi / Lucknow-tradition pulaos
    return None


def cut_of(name):
    for label in ('Drum Stick', 'Curry Cut', 'Boneless'):
        if label in name:
            return 'Drumstick' if label == 'Drum Stick' else label
    return None


def protein_of(name, veg):
    for word, key in [('Prawn', 'prawns'), ('Mutton', 'mutton'), ('Paneer', 'paneer'),
                      ('Soya', 'soya'), ('Egg', 'egg'), ('Anda', 'egg'), ('Chicken', 'chicken')]:
        if word in name:
            return key
    return 'veg' if veg else 'chicken'


# Photos we actually have, keyed by the merged dish id.
IMAGES = {
    'chicken-dum-biryani-lucknowi-drumstick': 'chicken-lucknowi-biryani',
    'chicken-dum-biryani-hyderabadi-drumstick': 'chicken-hyderabadi-biryani',
    'chicken-dum-biryani-kolkata-drumstick': 'kolkata-biryani',
    'chicken-dum-biryani-mumbai-curry-cut': 'mumbai-biryani',
    'mutton-yakhni-pulao-lucknowi': 'mutton-yakhni-pulao',
    'mutton-awadhi-pulao-lucknowi': 'mutton-awadhi-pulao',
    'veg-dum-biryani-hyderabadi': 'veg-hyderabadi-biryani',
    'veg-dum-biryani-lucknowi': 'veg-lucknowi-biryani',
    'soya-dum-biryani': 'soya-chunks-biryani',
    'shami-kebab-chicken': 'chicken-shami-kebab',
    'seekh-kebab-chicken': 'chicken-seekh-kebab',
}

# Portion facts supplied by the owner. Only dishes confirmed by the owner appear here.
PORTIONS = {
    'Drumstick': {
        'half': '350–375 g · 450 ml container · 1 drumstick',
        'full': '550–575 g · 750 ml container · 2 drumsticks',
        'perKg': '10 drumsticks · about 2.8–3.0 kg cooked · serves about 5–7',
    },
    'Curry Cut': {'perKg': '18–20 pieces · no neck, no rib cage'},
}

rows = {}
for r in range(5, ws.max_row + 1):
    v = [ws.cell(r, c).value for c in range(2, 10)]   # B..I
    if v[4] is not None:
        rows[r] = v

items, by_key = [], {}

for r, (typ, chan, l2, grp, name, g, h, i) in rows.items():
    raw = clean(name)
    veg = typ == 'Veg'
    beverage = typ == 'Beverages'
    grp_c = clean(grp)

    # ---- which part of the menu does this belong to? -------------------------
    if beverage:
        category = 'drinks'
    elif l2 == 'Combos':
        category = 'combos'
    elif l2 == 'Rolls':
        category = 'rolls'
    elif l2 == 'Starters':
        category = 'kebabs'
    elif l2 == 'Tawa Pulao' or 'Tawa' in grp_c or 'Anda' in raw:
        category = 'tawa'
    elif 'Pulao' in raw and 'Tawa' not in raw:
        category = 'pulao'
    else:
        category = 'biryani'

    small, large = num(g, r), num(h, r)
    per_kg = num(i, r)
    note, includes, serves = None, None, None
    display = raw

    # ---- combos -------------------------------------------------------------
    if category == 'combos':
        lines = [clean(x) for x in str(name).split('\n') if x.strip()]
        serves = re.search(r'Sufficient for ([^)]+)', str(grp)).group(1)
        size = 'Large' if str(grp).split('\n')[0].strip().endswith('-L') else 'Small'
        styles = []
        for b in [x for x in lines if 'Biryani' in x]:
            m = re.search(r'(Lucknowi|Hyderabadi|Kolkata|Mumbai Twist|Mumbai|Yakhni|Awadhi|Soya)', b)
            styles.append(m.group(1) if m else 'Soya')
        kind = ('Paneer' if 'Paneer' in raw else 'Mutton' if 'Mutton' in raw
                else 'Chicken' if 'Chicken' in raw else 'Veg')
        display = f"{kind} {' + '.join(dict.fromkeys(styles))} Combo ({size})"
        includes = lines
        large = per_kg = None
    else:
        # kebab rows read "6 pc (L) / 3 pc (S)" with the large price first
        m = re.search(r'(\d+) pc \(L\) / (\d+) pc \(S\)', raw)
        if m:
            note = f"Half {m.group(2)} pc · Full {m.group(1)} pc"
            small, large = large, small
            display = raw[:m.start()].strip()
        elif category == 'kebabs' and small and large and small > large:
            small, large = large, small
            display = re.sub(r'\s*\(?\d+\s*pc\.?\)?', '', raw).strip()
        pm = re.search(r'\((Desi Ghee Preparation[^)]*|Made with 200 g Paneer)\)', display)
        if pm:
            note = pm.group(1).replace('Boiled Egg', 'boiled egg').replace('Aalu', 'aloo')
            note = note[0] + note[1:].lower() if 'pc' not in note else note
            display = display.replace(f'({pm.group(1)})', '').strip()
        display = re.sub(r'\s{2,}', ' ', display).strip()

    region = region_of(display) if category in ('biryani', 'pulao', 'tawa') else None
    cut = cut_of(display)
    protein = protein_of(display, veg)

    # ---- canonical name: region and cut become tags, not part of the name ----
    if category in ('biryani', 'pulao'):
        double = bool(re.match(r'^Double\b', display))
        if 'Yakhni Pulao' in display:
            display = 'Mutton Yakhni Pulao'
        elif 'Awadhi Pulao' in display:
            display = 'Mutton Awadhi Pulao'
        elif 'Malai Seekh' in display:
            display = 'Chicken Malai Seekh Biryani'
        elif protein == 'mutton':
            display = 'Mutton Dum Biryani'
        elif protein == 'chicken' and 'Dum' in display:
            display = 'Chicken Dum Biryani'
        elif protein == 'egg':
            display = 'Egg Biryani'
        elif protein == 'paneer':
            display = 'Paneer Dum Biryani'
        elif protein == 'veg':
            display = 'Veg Dum Biryani'
        elif protein == 'soya':
            display = 'Soya Dum Biryani'
        elif protein == 'prawns':
            display = 'Prawns Biryani'
        if double:
            display = f'Double {display}'
        # "Mumbai" and "Mumbai Twist" rows carry identical prices, so they merge.
        key = slug(f"{display}-{region or ''}-{cut or ''}")
    elif category == 'tawa' and region:
        # Tawa Pulao keeps its own identity; the region is only the flavour it is built on.
        base = ('Paneer Tawa Pulao' if 'Paneer' in display
                else 'Veg Tawa Pulao' if veg else 'Chicken Tawa Pulao (Boneless)')
        display = base
        key = slug(f'{display}-{region}')
    else:
        display = re.sub(r'\s*\(\d+\s*pc\.?\)', '', display).strip()
        display = display.replace(' - ', ' – ')
        key = slug(display)

    if key in by_key:
        it = by_key[key]
        for k, v in (('half', small), ('full', large), ('perKg', per_kg)):
            if v and not it['prices'].get(k):
                it['prices'][k] = v
        if note and not it.get('note'):
            it['note'] = note
        continue

    item = {
        'id': key,
        'name': display,
        'category': category,
        'group': grp_c if category != 'combos' else ('Veg' if veg else 'Non-veg'),
        'prices': {k: v for k, v in (('half', small), ('full', large), ('perKg', per_kg)) if v},
    }
    if region:
        item['region'] = region
    if cut:
        item['cut'] = cut
    if not beverage:
        item['veg'] = veg
        item['protein'] = protein
    if note:
        item['note'] = note
    if includes:
        item['includes'] = includes
    if serves:
        item['serves'] = serves
    if cut in PORTIONS:
        item['portion'] = PORTIONS[cut]
    photo = IMAGES.get(key) or IMAGES.get(slug(display))
    if photo:
        item['image'] = f'/images/dishes/{photo}.webp'

    by_key[key] = item
    items.append(item)

# Single-price items read better as one number
FIX = {'7 up': '7Up', 'Thums up': 'Thums Up'}
for it in items:
    it['name'] = FIX.get(it['name'], it['name'])
    p = it['prices']
    if set(p) == {'half'}:
        it['prices'] = {'price': p['half']}

json.dump(items, open('data/menu.json', 'w'), indent=2, ensure_ascii=False)

from collections import Counter
print(len(items), 'items')
print(Counter(i['category'] for i in items))
print(Counter(i.get('region', '—') for i in items))
