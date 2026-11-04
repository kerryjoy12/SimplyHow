// Central site configuration.
// IMPORTANT: replace `url` with your real domain before deploying
// (canonical URLs, sitemap and RSS all derive from it).
module.exports = {
  siteName: 'SimplyHow',
  tagline: 'Practical Guides for Everyday Life',
  description:
    'SimplyHow publishes 80+ step-by-step how-to guides on technology, home & garden, cooking, DIY crafts and productivity. Clear instructions, real troubleshooting, no fluff.',
  url: 'https://www.simplyhow.example', // TODO: replace with your real domain (no trailing slash)
  language: 'en',
  author: {
    name: 'The SimplyHow Editorial Team',
    jobTitle: 'Senior Editors & Practitioners',
    sameAs: []
  },
  // TODO: paste your AdSense publisher ID (ca-pub-xxxxxxxxxxxxxxxx) to enable ad slots.
  adsenseClient: '',
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Technology', href: '/category/technology/' },
    { label: 'Home & Garden', href: '/category/home-garden/' },
    { label: 'Food & Cooking', href: '/category/food-cooking/' },
    { label: 'DIY & Crafts', href: '/category/diy-crafts/' },
    { label: 'Productivity', href: '/category/productivity/' }
  ],
  categories: [
    {
      slug: 'technology',
      name: 'Technology',
      description:
        'Step-by-step guides for laptops, phones, Wi-Fi, privacy and everyday software - explained for real people, not sysadmins.'
    },
    {
      slug: 'home-garden',
      name: 'Home & Garden',
      description:
        'Repairs, cleaning, organizing and gardening tutorials that help you look after your home without hiring a professional.'
    },
    {
      slug: 'food-cooking',
      name: 'Food & Cooking',
      description:
        'Reliable cooking techniques, kitchen skills and meal-planning systems you can use on a busy weeknight.'
    },
    {
      slug: 'diy-crafts',
      name: 'DIY & Crafts',
      description:
        'Beginner-friendly craft projects, creative hobbies and hands-on skills with clear lists of tools and materials.'
    },
    {
      slug: 'productivity',
      name: 'Productivity',
      description:
        'Planning, study and career guides that help you get more done with less stress - backed by simple, repeatable systems.'
    }
  ],
  footerLegal: [
    { label: 'Privacy Policy', href: '/privacy-policy/' },
    { label: 'Terms of Service', href: '/terms/' },
    { label: 'Disclaimer', href: '/disclaimer/' },
    { label: 'Cookie Policy', href: '/cookie-policy/' },
    { label: 'Editorial Policy', href: '/editorial-policy/' }
  ]
};
