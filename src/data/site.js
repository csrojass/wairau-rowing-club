// Centralised site data. Once Sanity is connected, most of this will move into the CMS.
// For now, this is the single source of truth for placeholder content.

export const site = {
  name: 'Wairau Rowing Club',
  shortName: 'WRC',
  tagline: 'Rowing the Wairau since 1910.',
  description:
    'Wairau Rowing Club has been on the banks of the Wairau River since 1910. A home for club, college, corporate, and high-performance rowing in Marlborough, New Zealand.',
  founded: 1910,
  location: 'Wairau River, Marlborough, New Zealand',
  email: 'secretary@wairaurowingclub.co.nz',
  phone: '',
};

// Programme overview — sourced from WRC's official programme description.
export const programmeIntro = [
  'The Wairau Rowing Club provides comprehensive rowing programmes for athletes of all ages, abilities, and aspirations.',
  'As a grassroots club serving the Marlborough community, we offer opportunities in school, club, and masters rowing, catering for everyone from novice rowers through to pre-elite athletes. We are currently the only rowing club in the Marlborough region providing rowing programmes for secondary school athletes, working alongside Marlborough Boys’ College and Marlborough Girls’ College, and at times Queen Charlotte College.',
  'Our training groups include school programmes and a club squad for school leavers and athletes returning to rowing, with pathways from intermediate through to senior and premier levels. Through experienced coaching and a supportive environment, Wairau Rowing Club aims to provide experiences that challenge, educate, and inspire our members while making the sport accessible to people from all backgrounds.',
];

// The four ways to connect with Wairau Rowing Club.
export const programs = [
  {
    slug: 'club-rowing',
    title: 'Club',
    icon: 'boat',
    tagline: 'Open to all levels.',
    summary:
      'A club squad for school leavers and athletes returning to rowing — with pathways from intermediate through to senior and premier levels.',
    points: [
      'School leavers and returning rowers',
      'Intermediate → Senior → Premier pathway',
      'Regular squad sessions on the Wairau',
      'Club and regional regattas',
    ],
  },
  {
    slug: 'college-rowing',
    title: 'College',
    icon: 'people',
    tagline: 'Marlborough’s school crews.',
    summary:
      'We’re the only club in Marlborough running rowing programmes for secondary school athletes — working alongside Marlborough Boys’ College, Marlborough Girls’ College, and at times Queen Charlotte College.',
    points: [
      { text: 'Marlborough Boys’ College', url: 'https://www.facebook.com/share/1X2BqEg9pr/?mibextid=wwXIfr' },
      { text: 'Marlborough Girls’ College', url: 'https://www.facebook.com/share/18pJssrqRj/?mibextid=wwXIfr' },
      'Queen Charlotte College (selected seasons)',
      'Coached squads with strong pathway development',
    ],
  },
  {
    slug: 'corporate-rowing',
    title: 'Corporate',
    icon: 'cap',
    tagline: 'Get your team on the water.',
    summary:
      'Build a crew from your workplace and race in our flagship Corporate 8 each year — no experience needed, coached crew sessions included.',
    points: [
      'Annual Corporate 8 regatta',
      'Coached crew sessions in the lead-up',
      'No experience needed — we’ll teach you',
    ],
  },
  {
    slug: 'alumni',
    title: 'Alumni',
    icon: 'tree',
    tagline: 'Once a Wairau rower…',
    summary:
      'Since 1910 the Wairau Rowing Club has provided a sporting and social home on the river. All of us have, in our own way, shaped this club — and we’d love to reconnect.',
    points: [
      'Reconnect with old crewmates',
      'Follow the club on Facebook',
      'Register free as a supporter via Rowing Connect',
    ],
  },
];

// Additional pathways — shown as callouts, not in the main 4-card grid.
export const pathways = [
  {
    slug: 'high-performance',
    title: 'High Performance Pathway',
    icon: 'peak',
    summary:
      'Wairau is a hub for the Central Region Performance Centre (CRPC) — the pathway from school and club into U21, U23 and senior New Zealand teams.',
  },
  {
    slug: 'masters',
    title: 'Masters Rowing',
    icon: 'wave',
    summary:
      'Rowing doesn’t stop at 30. Our masters squad caters for older athletes who row for fitness, friendship, and competition at masters regattas around New Zealand.',
  },
];

export const committee = [
  { role: 'Patron', name: 'Ramon Sutherland' },
  { role: 'Patron', name: 'Roger Glover' },
  { role: 'President', name: 'Ivan Sutherland' },
  { role: 'Senior Vice President', name: 'Dave Henry' },
  { role: 'Junior Vice President', name: 'Mike McManaway' },
  { role: 'Secretary', name: 'Kate Vavasour' },
  { role: 'Co-Treasurer', name: 'Catherine Randall' },
  { role: 'Co-Treasurer', name: 'Rosanne Marsden' },
  { role: 'Club Captain', name: 'Kaye Surgenor' },
  { role: 'Vice Club Captain (Men)', name: 'TBC', tbc: true },
  { role: 'Vice Club Captain (Women)', name: 'TBC', tbc: true },
  { role: 'Health & Safety Officer', name: 'Barry Chandler' },
  { role: 'Committee', name: 'Luke Van Velthooven' },
  { role: 'Committee', name: 'Barry Chandler' },
  { role: 'Committee', name: 'Matt Straker' },
  { role: 'Committee', name: 'Ben Glover' },
  { role: 'Girls’ College Delegate', name: 'Phil Bennett' },
  { role: 'Boys’ College Delegate', name: 'Clayton Lindstrom' },
  { role: 'Boys’ College Delegate', name: 'Jared Englefield' },
];

export const contacts = [
  {
    name: 'Kaye Surgenor',
    role: 'Club Captain',
    email: 'Kayesurgenor@gmail.com',
  },
  {
    name: 'Kate Vavasour',
    role: 'Secretary',
    email: 'Wairaurowingsecretary@gmail.com',
  },
  {
    name: 'Clayton Lindstrom',
    role: 'MBC Coach',
    email: 'Clayton.lindstrom@gmail.com',
  },
  {
    name: 'TBC',
    role: 'MGC Coach',
    tbc: true,
  },
];

// Configuration that the committee will eventually edit via Sanity.
// Until WRC has its own Rowing Connect signup URL, point CTAs to the
// Rowing NZ info page so users can register from there.
export const rowingConnect = {
  url: 'https://rowingnz.kiwi/community/rowing-connect/',
  generalInfoUrl: 'https://rowingnz.kiwi/community/rowing-connect/',
  noCost: true,
};

// Social links — the WRC Facebook page (the one with the old green shed
// cover photo). The user will update this when the new webpage goes live.
export const social = {
  facebookUrl: 'https://www.facebook.com/groups/210870995389',
  instagramUrl: '',
};

// Heritage documents the secretary will provide. Drop the PDF into
// /public/docs/ and paste the path here, e.g. '/docs/first-minutes-1910.pdf'.
export const heritage = {
  firstMinutesPdf: '',  // ← paste path to scanned first-meeting minutes (1910)
};

// Corporate rowing enquiries go directly to Barry Chandler.
export const corporateContact = {
  name: 'Barry Chandler',
  email: 'bazzachandler@hotmail.com',
  subject: 'Corporate Rowing Enquiry — Wairau Rowing Club',
  body: 'Hi Barry,\n\nI’m interested in entering a crew in the Corporate 8 / corporate rowing programme.\n\nA bit about us:\n\n- Crew size: \n- Workplace: \n- Rowing experience: \n\nThanks!',
};

// Placeholder announcements — these will come from Sanity once connected.
export const announcements = [
  {
    slug: 'season-2026-launch',
    title: 'Season 2026 — Welcome Back to the Water',
    date: '2026-04-12',
    category: 'Club',
    excerpt:
      'A fresh season is underway. Squad sessions resume Monday, and the Learn-to-Row programme kicks off in May.',
  },
  {
    slug: 'mgc-rowers-china',
    title: 'MGC Rowers Selected for Global Youth Programme',
    date: '2026-03-28',
    category: 'College',
    excerpt:
      'Isla Muir, Maggie Clark and Charlie Bennett travelled to Chengdu for the 2026 Global Youth Rowing & Cultural Exchange Programme.',
  },
  {
    slug: 'corporate-8-2026',
    title: 'Corporate 8 — Entries Now Open',
    date: '2026-03-15',
    category: 'Corporate',
    excerpt:
      'Build a workplace crew and join us on the water. The 2026 Corporate 8 returns this November.',
  },
];

// 2026 NZ rowing calendar — sourced from Rowing NZ (rowingnz.kiwi) and rowIT.
export const events = [
  {
    title: 'Legion of Rowers North Island Masters',
    date: '2026-05-10',
    time: '8:00 AM',
    location: 'Lake Karāpiro',
    category: 'Masters',
    scope: 'national',
  },
  {
    title: 'Squad Training — Monday',
    date: '2026-05-11',
    time: '5:30 AM',
    location: 'Wairau River, Boathouse',
    category: 'Training',
    scope: 'club',
  },
  {
    title: 'Learn-to-Row Intake — Open Day',
    date: '2026-05-18',
    time: '10:00 AM',
    location: 'Wairau Rowing Club',
    category: 'Programme',
    scope: 'club',
  },
  {
    title: 'Winter Training Camp',
    date: '2026-07-04',
    time: 'All weekend',
    location: 'Wairau Rowing Club',
    category: 'Training',
    scope: 'club',
  },
  {
    title: 'Clive Steenson Memorial Regatta',
    date: '2026-10-31',
    time: '8:00 AM',
    location: 'Lake Karāpiro',
    category: 'Regatta',
    scope: 'national',
  },
  {
    title: 'Marlborough Regatta',
    date: '2026-11-21',
    time: '7:30 AM',
    location: 'Lake Argyle',
    category: 'Regatta',
    scope: 'regional',
  },
  {
    title: 'Corporate 8 — Wairau RC',
    date: '2026-11-28',
    time: '10:00 AM',
    location: 'Wairau River',
    category: 'Corporate',
    scope: 'club',
  },
  {
    title: 'Canterbury Championship Regatta',
    date: '2026-12-12',
    time: '7:30 AM',
    location: 'Lake Ruataniwha',
    category: 'Regatta',
    scope: 'regional',
  },
  {
    title: 'S.I. Rowing Championships',
    date: '2027-01-30',
    time: '7:15 AM',
    location: 'Lake Ruataniwha',
    category: 'Championship',
    scope: 'national',
  },
  {
    title: 'NZ Rowing Championships',
    date: '2027-02-18',
    time: '8:00 AM',
    location: 'Lake Karāpiro',
    category: 'Championship',
    scope: 'national',
  },
  {
    title: 'Maadi Regatta — NZ Secondary Schools',
    date: '2027-03-22',
    time: '7:00 AM',
    location: 'Lake Ruataniwha',
    category: 'Schools',
    scope: 'national',
  },
];

export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/programs', label: 'Programs' },
  { href: '/regattas', label: 'Regattas' },
  { href: '/membership', label: 'Membership' },
  { href: '/alumni', label: 'Alumni' },
  { href: '/news', label: 'News' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];
