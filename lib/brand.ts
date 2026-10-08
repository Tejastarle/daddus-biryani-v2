/**
 * All brand copy lives here so it can be edited without touching components.
 *
 * RULE: nothing in this file may be invented. Every claim, number, name and
 * story beat below came from the owner. If something is not confirmed yet it
 * sits in NEEDS_OWNER_INPUT and the website simply does not show it.
 */

export const BRAND = {
  hero: {
    kicker: 'Not one biryani. Many traditions.',
    // Same order as `regions` below.
    cities: ['Kolkata', 'Lucknow', 'Hyderabad', 'Mumbai'],
    line: 'Every palate is different. Discover which biryani is yours.',
    promise: 'Taste before you choose.',
    support: 'Visit us. Taste the different styles. Order only what you love.',
  },

  tasteFirst: {
    title: 'Your taste. Your choice.',
    question: 'Why order first and discover later?',
    body:
      'People like different things. Biryani from different regions tastes different. So instead of telling you which biryani you should like, we would rather you experience the differences and decide for yourself.',
    close: 'Taste before you choose.',
  },

  discover: {
    title: 'Discover India through biryani',
    sub: 'Four cities. Four traditions. Four completely different biryani experiences.',
  },

  /** The comparison table. Wording supplied by the owner. */
  /**
   * The four styles, in the order the owner wants them shown everywhere:
   * Kolkata, Lucknowi, Hyderabadi, Mumbai. Changing this array reorders the
   * homepage journey, the comparison, the menu, the footer and the sitemap.
   * Wording and spice levels supplied by the owner.
   */
  regions: [
    {
      key: 'kolkata',
      city: 'Kolkata',
      style: 'Kolkata',
      hindi: 'कोलकाता',
      short: 'Delicate • Aromatic • Aloo & egg tradition',
      taste: 'Delicate and distinctive',
      spice: 'Mild',
      spiceLevel: 1,
      character: 'Aloo and egg tradition',
      idealFor: 'People wanting a different regional experience',
      body:
        'Lighter on spice, and it carries a potato and a boiled egg in the handi — a tradition Kolkata made its own. Ours is made in desi ghee.',
      photo: 'kolkata',
    },
    {
      key: 'lucknowi',
      city: 'Lucknow',
      style: 'Lucknowi',
      hindi: 'लखनऊ',
      short: 'Subtle • Aromatic • Yakhni-led',
      taste: 'Subtle and aromatic',
      spice: 'Mild',
      spiceLevel: 1,
      character: 'Yakhni-led',
      idealFor: 'People who enjoy aroma and balanced flavours',
      body:
        'Meat is first cooked into a fragrant stock — the yakhni — and the rice is layered over it and sealed on dum. The flavour comes from aroma rather than heat, which is why a good Lucknowi is not supposed to be fiery.',
      photo: 'lucknowi',
    },
    {
      key: 'hyderabadi',
      city: 'Hyderabad',
      style: 'Hyderabadi',
      hindi: 'हैदराबाद',
      short: 'Bold • Spicy • Masala-led marinade',
      taste: 'Bold and masaledar',
      spice: 'Medium',
      spiceLevel: 2,
      character: 'Masala-led marinade',
      idealFor: 'People who enjoy stronger spice and masala',
      body:
        'Built on a spiced marinade that goes under the rice before the dum. More heat, deeper colour and a stronger masala character. This is the biryani most people picture first.',
      photo: 'hyderabadi',
    },
    {
      key: 'mumbai',
      city: 'Mumbai',
      style: 'Mumbai',
      hindi: 'मुंबई',
      short: 'Masaledar • Familiar • Masala cooked in the dum',
      taste: 'Familiar and masaledar',
      spice: 'Hot',
      spiceLevel: 3,
      character: 'Masala-led, cooked in the dum',
      idealFor: 'People who want the most heat, in a flavour they already know',
      body:
        'Curry-cut chicken in a masala this city grew up on, cooked into the rice during the dum rather than sitting on top of it. The hottest of the four, in a flavour Mumbai already knows.',
      photo: 'mumbai',
    },
  ],

  undecided: {
    title: "Still can't decide?",
    line: "Don't guess. Taste before you choose.",
  },

  engineering: {
    name: 'BIRYANIEGINEERING',
    question: 'What happens when an engineer starts engineering biryani?',
    pillars: [
      { title: 'Right ingredients', body: 'Antibiotic-free chicken, rice good enough to hold its shape through the dum, and export-quality spices.' },
      { title: 'Right process', body: 'Heat management — proper control of the heat at every stage of the cooking.' },
      { title: 'Right proportion', body: 'Everything measured to an accuracy of 1 gram. No andaza.' },
      { title: 'Consistent results', body: 'The same biryani this week as the one you liked last week.' },
    ],
    body:
      'Engineering teaches you that a good result should not happen by accident. We apply the same thinking to food — ingredients, process, proportions, dum and consistency — so the experience can be repeated every time.',
  },

  everyGrain: {
    title: 'बिरयानी बनाना अगर एक कला है, तो उसे खाना भी एक कला है।',
    paragraphs: [
      'कुछ बिरयानियों में सादा चावल होता है, मसाले वाला चावल होता है और चिकन या मटन के आसपास गाढ़ा मसाला भी होता है। उनका पूरा स्वाद लेने के लिए आपको हर कौर में इन सबका सही संतुलन बनाना पड़ता है — थोड़ा सादा चावल, थोड़ा मसाले वाला चावल, थोड़ा मसाला और साथ में चिकन या मटन।',
      'यह संतुलन बन जाए, तो हर कौर का आनंद अलग ही होता है!',
      'लेकिन हर कोई ऐसा कौर बनाने का अभ्यस्त नहीं होता। कई बार शुरुआत में सादा चावल ज़्यादा खा लिया जाता है और आखिर में मसाला बच जाता है। पहले स्वाद हल्का लगता है, फिर बहुत तेज़। बिरयानी अच्छी बनी होने के बावजूद उसका पूरा आनंद नहीं मिल पाता।',
      'Daddu\u2019s Biryani में हमने इसी बात का ध्यान रखा है। हमारा प्रयास है कि बिरयानी का स्वाद चावल के हर दाने में बसे, ताकि आपको हर बार सही अनुपात मिलाने में ध्यान न लगाना पड़े।',
      'चिकन या मटन के साथ खाइए, या सिर्फ़ चावल का एक कौर लीजिए — उसमें भी उस बिरयानी की अपनी पहचान महसूस हो: लखनवी की नज़ाकत, हैदराबादी का मसालेदार स्वाद, मुंबई का अपना अंदाज़ या कोलकाता की खुशबू।',
      'यहाँ तक कि एक छोटा बच्चा भी अपनी पसंद की बिरयानी का पूरा आनंद ले सके — बिना यह सीखे कि चावल और मसाले को मिलाकर सही कौर कैसे बनाना है।',
    ],
    close: 'हर कौर बनाने की मेहनत हमारी रसोई में हो, ताकि आपकी थाली में हर कौर का आनंद मिले।',
  },

  senses: {
    title: 'Taste Before You Choose',
    intro:
      'Your eyes can admire it. Your nose can enjoy its aroma. But will you love its taste? Take a bite and discover.',
    items: [
      { icon: 'eye', label: 'Eyes', body: 'See the rice, colours and presentation.' },
      { icon: 'wind', label: 'Nose', body: 'Smells the aroma.' },
      { icon: 'ear', label: 'Ears', body: 'Hear stories, descriptions and recommendations.' },
      { icon: 'hand', label: 'Skin', body: 'Feels warmth and texture.' },
      { icon: 'taste', label: 'Taste buds', body: 'Discover the taste.' },
    ],
    character:
      'Each of our biryanis has its own character — from the delicate flavours of Lucknow to the bold spices of Hyderabad and the distinctive taste of Kolkata.',
    cannotTell:
      'A photograph cannot tell you which one you will enjoy. Neither can someone else\u2019s favourite.',
    offer:
      'That is why, at Daddu\u2019s Biryani, we offer free tasting before you order.',
    invitation: 'Try the different flavours. Discover your favourite. Order only what you love.',
    hindi: 'पहले चखें, फिर चुनें।',
  },

  challenge: {
    title: "The Daddu's Biryani Discovery Challenge",
    body:
      'Come in, try the styles side by side, and see which one your palate picks. Most people are surprised — the biryani they order out of habit is not always the one they like most.',
    steps: [
      { title: 'Taste the styles', body: 'Compare Lucknowi, Hyderabadi, Kolkata and Mumbai side by side.' },
      { title: 'Notice the difference', body: 'Aroma, heat, and how the flavour sits in the rice.' },
      { title: 'Order what you love', body: 'Then order the one your taste chose, not the one you assumed.' },
    ],
    cta: 'Ask about the tasting experience',
  },

  /** Portion facts, exactly as supplied by the owner. */
  portions: {
    title: 'What you actually get',
    body: 'Most places tell you it "serves 4". We would rather show you exactly what arrives.',
    sizes: [
      { name: 'Half', lines: ['350–375 g served', '450 ml container', '1 drumstick'] },
      { name: 'Full', lines: ['550–575 g served', '750 ml container', '2 drumsticks'] },
      {
        name: '1 kg (Lucknowi)',
        lines: ['10 drumsticks', 'About 2.8–3.0 kg cooked', 'Serves about 5–7'],
        note: 'Depending on appetite and what else is being served.',
      },
    ],
    curryCut: '1 kg curry cut: 18–20 pieces. No neck, no rib cage.',
  },

  salan: {
    title: 'Mirchi ka Salan',
    body:
      'Someone may love the aroma and character of a Lucknowi but still want more heat. Rather than turning the Lucknowi into something it is not, add Mirchi ka Salan and set the heat yourself.',
    principle: 'Keep the biryani honest. Let you control the heat.',
    points: [
      { title: 'Mirchi ka Salan', body: 'Available with every biryani style.' },
      { title: 'Extra masala', body: 'Available for Hyderabadi Biryani on selected 1 kg bulk orders, prepared with additional onion and tomato masala.' },
      { title: 'Bulk additions', body: 'Kaju, mushroom and bell pepper on selected bulk orders. Ask us while ordering.' },
    ],
  },

  bulk: {
    title: 'Biryani for 10 or 100?',
    body: 'Office lunches, team celebrations, society gatherings, birthdays and family orders. Tell us the headcount and we will work out the quantity with you.',
    events: ['Office lunches', 'Corporate events', 'Birthdays', 'Society events', 'Family gatherings', 'Celebrations', 'Parties'],
  },

  founder: {
    name: 'Kailash Gaekwad',
    role: "Founder, Daddu's Biryani",
    headline: 'What happens when an engineer starts engineering biryani?',
    story: [
      {
        heading: 'Kanpur, and a taste you carry with you',
        body: 'I grew up in Kanpur, where the biryani around me had a particular character — more aroma than fire, and a flavour that sat inside the rice rather than on top of it. You do not think of it as a style when you are young. It is simply what biryani tastes like.',
      },
      {
        heading: 'Mumbai, and a flavour that had gone missing',
        body: 'Then I moved to Mumbai. There is plenty of good biryani here, but the one I grew up on was not on any menu I could find. That became an itch. Not a complaint — a question. Why does biryani taste so different in different places?',
      },
      {
        heading: 'Travelling and tasting, with a notebook',
        body: 'So I started eating my way through it, and writing things down. Hyderabad was the big one — tasting it where it belongs is not the same as tasting it anywhere else. I kept notes on what changed: the marinade, the spice, the way the rice behaved, what the ghee did, what the dum did.',
      },
      {
        heading: 'Experimenting instead of copying',
        body: 'Recipes are easy to find and easy to follow. They are also easy to get wrong, because they tell you the steps but not the reasons. I would rather understand why something works, so I cooked the same thing many times over, changing one thing at a time, until each regional style tasted like itself and not like the others.',
      },
      {
        heading: 'Where the engineering comes in',
        body: 'I am an engineer by training, and engineering leaves you with one stubborn habit: a good result should not be an accident. If it is good today it should be good next Tuesday. That thinking is what turned a hobby into Daddu’s Biryani, and it is what we mean by BIRYANIEGINEERING.',
      },
    ],
  },

  stories: {
    title: 'Biryani Stories',
    sub: 'The things people ask us across the counter, answered properly.',
    ideas: [
      'Why does Kolkata biryani have aloo?',
      'What exactly is yakhni?',
      "Lucknowi vs Hyderabadi — what actually changes?",
      "Why isn't Lucknowi biryani supposed to be fiery?",
      'What does dum actually do?',
      'Why does everyone experience biryani differently?',
      'What is BIRYANIEGINEERING?',
      'Why does the rice matter so much in biryani?',
    ],
  },

  podcast: {
    title: 'Zaaykon Ki Kahani',
    sub: "The Daddu's Biryani podcast",
    body: 'Conversations about regional food, how it travels, and why it changes along the way. Episodes coming soon.',
  },

  finalCta: {
    title: "Don't just order biryani. Discover your biryani.",
    line: 'Taste before you choose.',
  },
};

/**
 * NOT PUBLISHED until the owner supplies it.
 * Set `ready: true` and fill `body` to make the section appear.
 */
export const NEEDS_OWNER_INPUT = {
  /** The owner asked for the story behind the name "Daddu" but has not supplied it yet. */
  nameStory: {
    ready: false,
    heading: 'Where the name comes from',
    body: '',
  },
  /** Google rating and review count. Only show verified, current numbers. */
  rating: {
    ready: false,
    value: '',
    count: '',
    url: '',
  },
  /** Real customer reviews. Prefer ones that talk about the difference between styles. */
  reviews: {
    ready: false,
    items: [] as { name: string; text: string; style?: string }[],
  },
};

export type Region = (typeof BRAND.regions)[number];
