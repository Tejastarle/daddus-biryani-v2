/**
 * Business details used across the site. Edit here, and every page follows.
 * Nothing in this file may be a guess — see NEEDS_OWNER_INPUT in lib/brand.ts
 * for anything still awaiting confirmation.
 */
export const SITE = {
  name: "Daddu's Biryani",
  // Spelling taken from the approved logo artwork.
  tagline: 'Zayqo ki Kahani',
  taglineHindi: 'ज़ायक़ों की कहानी',
  url: 'https://daddus-biryani-complete.vercel.app',
  phoneDisplay: '+91 96196 11561',
  phoneTel: '+919619611561',
  whatsapp: '919619611561',
  email: 'info@daddusbiryani.com',
  addressLines: ['Second Floor, A-Wing, Express Zone', 'Malad East, Mumbai 400097'],
  mapsLink:
    'https://www.google.com/maps/search/?api=1&query=Daddus+Biryani+Express+Zone+Malad+East+Mumbai',
  mapsEmbed:
    'https://maps.google.com/maps?q=Express%20Zone%2C%20Malad%20East%2C%20Mumbai%20400097&z=16&output=embed',
  // CONFIRM before publishing — the previous site showed different Sunday hours.
  hours: '11 AM – 11 PM, every day',
  hoursSchema: 'Mo-Su 11:00-23:00',
  menuPdf: '/downloads/daddus-biryani-menu.pdf',
  menuXlsx: '/downloads/daddus-biryani-menu.xlsx',
  heroVideo: '/video/hero-video.mp4',
  heroPoster: '/images/hero-poster.webp',
};

/** Pre-filled WhatsApp messages, one per decision point. */
export const WA = {
  general: "Hi Daddu's Biryani, I'd like to place an order.",
  tasting: "Hi Daddu's, I would like to know about the Biryani Discovery / Tasting Experience.",
  bulk: (guests?: string, date?: string) =>
    `Hi Daddu's, I am planning an order for ${guests || '___'} people on ${date || '___'} date.`,
  dish: (name: string) => `Hi Daddu's, I'd like to order ${name}.`,
  style: (style: string) => `Hi Daddu's, I'd like to try your ${style} biryani.`,
  salan: "Hi Daddu's, I'd like to add Mirchi ka Salan to my order.",
};

export function waLink(text: string = WA.general) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}

/**
 * Turn a Google Drive share link or file ID into a direct image URL.
 * The file must be shared as "Anyone with the link".
 * Example: driveImage('https://drive.google.com/file/d/FILE_ID/view')
 */
export function driveImage(linkOrId: string, width = 1600) {
  const match =
    linkOrId.match(/\/d\/([a-zA-Z0-9_-]{20,})/) || linkOrId.match(/[?&]id=([a-zA-Z0-9_-]{20,})/);
  const id = match ? match[1] : linkOrId;
  return `https://lh3.googleusercontent.com/d/${id}=w${width}`;
}

/** Studio photographs of our own dishes. No stock imagery anywhere on this site. */
export const PHOTOS = {
  kolkata: { src: '/images/dishes/kolkata-biryani.webp', alt: 'Kolkata chicken biryani with aloo and boiled egg', w: 1200, h: 900 },
  kolkataTall: { src: '/images/dishes/kolkata-biryani-tall.webp', alt: 'Kolkata chicken biryani in a brass thali', w: 900, h: 1200 },
  lucknowi: { src: '/images/dishes/chicken-lucknowi-biryani.webp', alt: 'Chicken Lucknowi biryani with onion rings and raita', w: 1200, h: 900 },
  lucknowiTall: { src: '/images/dishes/chicken-lucknowi-biryani-tall.webp', alt: 'Chicken Lucknowi biryani in a brass thali', w: 900, h: 1200 },
  hyderabadi: { src: '/images/dishes/chicken-hyderabadi-biryani.webp', alt: 'Chicken Hyderabadi biryani with raita and salan', w: 1200, h: 900 },
  hyderabadiTall: { src: '/images/dishes/chicken-hyderabadi-biryani-tall.webp', alt: 'Chicken Hyderabadi biryani served in a brass thali', w: 900, h: 1200 },
  mumbai: { src: '/images/dishes/mumbai-biryani.webp', alt: 'Mumbai-style chicken biryani with raita', w: 1200, h: 900 },
  mumbaiTall: { src: '/images/dishes/mumbai-biryani-tall.webp', alt: 'Mumbai-style chicken biryani served in a brass thali', w: 900, h: 1200 },
  muttonYakhni: { src: '/images/dishes/mutton-yakhni-pulao.webp', alt: 'Mutton yakhni pulao with bone-in mutton pieces', w: 1200, h: 900 },
  muttonYakhniTall: { src: '/images/dishes/mutton-yakhni-pulao-tall.webp', alt: 'Mutton yakhni pulao served in a brass thali', w: 900, h: 1200 },
  muttonAwadhi: { src: '/images/dishes/mutton-awadhi-pulao.webp', alt: 'Mutton Awadhi pulao cooked in desi ghee', w: 1200, h: 900 },
  muttonAwadhiTall: { src: '/images/dishes/mutton-awadhi-pulao-tall.webp', alt: 'Mutton Awadhi pulao served in a brass thali', w: 900, h: 1200 },
  vegHyderabadi: { src: '/images/dishes/veg-hyderabadi-biryani.webp', alt: 'Veg Hyderabadi biryani with carrots, beans and peas', w: 1200, h: 900 },
  vegHyderabadiTall: { src: '/images/dishes/veg-hyderabadi-biryani-tall.webp', alt: 'Veg Hyderabadi biryani in a brass thali', w: 900, h: 1200 },
  vegLucknowi: { src: '/images/dishes/veg-lucknowi-biryani.webp', alt: 'Veg Lucknowi biryani with mixed vegetables', w: 1200, h: 900 },
  vegLucknowiTall: { src: '/images/dishes/veg-lucknowi-biryani-tall.webp', alt: 'Veg Lucknowi biryani served in a brass thali', w: 900, h: 1200 },
  soya: { src: '/images/dishes/soya-chunks-biryani.webp', alt: 'Soya chunks biryani with fried onions', w: 1200, h: 900 },
  soyaTall: { src: '/images/dishes/soya-chunks-biryani-tall.webp', alt: 'Soya chunks biryani in a brass thali', w: 900, h: 1200 },
  shami: { src: '/images/dishes/chicken-shami-kebab.webp', alt: 'Chicken shami kebabs with green chutney', w: 1200, h: 900 },
  shamiTall: { src: '/images/dishes/chicken-shami-kebab-tall.webp', alt: 'Chicken shami kebabs plated with chutney and onion', w: 900, h: 1200 },
  seekh: { src: '/images/dishes/chicken-seekh-kebab.webp', alt: 'Chicken seekh kebabs with green chutney', w: 1200, h: 900 },
  seekhTall: { src: '/images/dishes/chicken-seekh-kebab-tall.webp', alt: 'Chicken seekh kebabs plated with lime and onion', w: 900, h: 1200 },
} as const;

export type PhotoKey = keyof typeof PHOTOS;
