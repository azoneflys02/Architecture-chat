import { Period, Building, Architect } from "./types";

export const PERIODS: Period[] = [
  {
    id: 'ancient',
    name: 'Ancient World',
    years: '3000 BC – 500 AD',
    description: 'Pyramids, Ziggurats, and the birth of the Classical Orders in Greece and Rome.',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'gothic',
    name: 'Gothic',
    years: '1150 – 1450',
    description: 'Pointed arches, flying buttresses, and stained glass reaching for the heavens.',
    image: 'https://images.unsplash.com/photo-1549429158-947702f2323e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'renaissance',
    name: 'Renaissance',
    years: '1420 – 1600',
    description: 'A return to symmetry, proportion, and classical harmony led by Brunelleschi and Palladio.',
    image: 'https://images.unsplash.com/photo-1520106212299-d99c443e4568?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'modernism',
    name: 'Modernism',
    years: '1900 – 1970',
    description: 'Form follows function. Steel, glass, and concrete redefining the urban skyline.',
    image: 'https://images.unsplash.com/photo-1503387762-592dea58ef21?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'contemporary',
    name: 'Contemporary',
    years: '1980 – Present',
    description: 'Parametric design, sustainable materials, and bold sculptural forms.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'
  }
];

export const FAMOUS_BUILDINGS: Building[] = [
  {
    id: 'parthenon',
    name: 'Parthenon',
    location: 'Athens, Greece',
    year: '438 BC',
    yearNum: -438,
    style: 'Ancient Greek',
    description: 'The pinnacle of the Doric order, dedicated to the goddess Athena.',
    image: 'https://images.unsplash.com/photo-1555992828-ca4dbe893e55?auto=format&fit=crop&q=80&w=800',
    periodId: 'ancient',
    historicalContext: 'Built at the height of the Athenian Empire, the Parthenon symbolized the power of democracy and the cultural dominance of Athens in the 5th century BC.',
    styleCharacteristics: ['Doric columns', 'Symmetry and proportion', 'Decorative friezes', 'Optical refinements'],
    styleTimeline: '900 BC – 31 BC',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    galleryImages: [
      'https://images.unsplash.com/photo-1603566114820-22c7ed326f9a?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1516159239826-66993ca60333?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1552643564-927ea3499427?auto=format&fit=crop&q=80&w=600'
    ],
    hotspots: [
      { slot: 'hotspot-1', position: '0m 1.75m 0.35m', normal: '0m 0m 1m', data: 'The Doric Frieze: Originally featured intricate carvings of the Panathenaic procession.' },
      { slot: 'hotspot-2', position: '-0.3m 1.5m 0.4m', normal: '-0.5m 0m 1m', data: 'Optical Refinement: The columns lean slightly inward to create a more stable appearance.' },
      { slot: 'hotspot-3', position: '0.3m 1.2m 0.2m', normal: '1m 0m 0m', data: 'The Entasis: A subtle swelling of the columns ensures they don\'t appear concave.' }
    ]
  },
  {
    id: 'fallingwater',
    name: 'Fallingwater',
    location: 'Pennsylvania, USA',
    year: '1935',
    yearNum: 1935,
    style: 'Modernism',
    description: 'Frank Lloyd Wright’s masterpiece that integrates architecture with a waterfall.',
    image: 'https://images.unsplash.com/photo-1518173946687-a4c8a9833d8e?auto=format&fit=crop&q=80&w=800',
    periodId: 'modernism',
    historicalContext: 'Commissioned during the Great Depression, Fallingwater redefined the relationship between humanity, architecture, and nature through organic design.',
    styleCharacteristics: ['Cantilevered floors', 'Integration with nature', 'Use of local stone', 'Horizontal emphasis'],
    styleTimeline: '1880s – 1980s',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb',
    galleryImages: [
      'https://images.unsplash.com/photo-1518173946687-a4c8a9833d8e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600'
    ],
    hotspots: [
      { slot: 'hotspot-cantilever', position: '0m 1.5m 0.2m', normal: '0m 0m 1m', data: 'Cantilevered Balconies: These dramatic overhangs were technically daring for the 1930s.' },
      { slot: 'hotspot-stone', position: '-0.3m 1.2m 0.1m', normal: '-1m 0m 0m', data: 'Native Stone: The structure uses Pottsville Sandstone quarried directly from the site.' }
    ]
  },
  {
    id: 'sydney-opera-house',
    name: 'Sydney Opera House',
    location: 'Sydney, Australia',
    year: '1973',
    yearNum: 1973,
    style: 'Expressionist',
    description: 'Jørn Utzon’s iconic shells redefining the 20th-century silhouette.',
    image: 'https://images.unsplash.com/photo-1523413363574-c3c444a1183d?auto=format&fit=crop&q=80&w=800',
    periodId: 'contemporary',
    historicalContext: 'Representing post-WWII optimism and the emergence of Australia as a modern global player, its complex geometry pushed the limits of mid-century engineering.',
    styleCharacteristics: ['Curvilinear forms', 'Symbolic meaning', 'Innovative materials', 'Dramatic shadows'],
    styleTimeline: '1910 – 1930 (Revival in mid-century)',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    galleryImages: [
      'https://images.unsplash.com/photo-1549180030-482071271100?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1523413363574-c3c444a1183d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1574791320478-f7481262cb5e?auto=format&fit=crop&q=80&w=600'
    ],
    hotspots: [
      { slot: 'hotspot-shells', position: '0m 1.8m 0.2m', normal: '0m 0m 1m', data: 'Precast Concrete Shells: Over 1 million Swedish ceramic tiles cover these iconic "sails".' },
      { slot: 'hotspot-glass', position: '-0.2m 1.6m 0.3m', normal: '-1m 0m 0m', data: 'Topaz Glass: Specially made in France, the glass walls offer stunning views while maintaining thermal efficiency.' }
    ]
  },
  {
    id: 'pantheon',
    name: 'Pantheon',
    location: 'Rome, Italy',
    year: '126 AD',
    yearNum: 126,
    style: 'Ancient Roman',
    description: 'Featuring the world’s largest unreinforced concrete dome.',
    image: 'https://images.unsplash.com/photo-1533050487297-09b450131914?auto=format&fit=crop&q=80&w=800',
    periodId: 'ancient',
    historicalContext: 'Constructed during the reign of Hadrian, it was a temple to all gods, showcasing Roman mastery of concrete and vaulted spaces that influenced architecture for millennia.',
    styleCharacteristics: ['Corinthian columns', 'Massive concrete dome', 'Oculus for light', 'Perfect proportions'],
    styleTimeline: '753 BC – 476 AD',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb',
    galleryImages: [
      'https://images.unsplash.com/photo-1533050487297-09b450131914?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&q=80&w=600'
    ],
    hotspots: [
      { slot: 'hotspot-oculus', position: '0m 1.9m 0m', normal: '0m 1m 0m', data: 'The Oculus: A 27-foot wide opening that provides the only source of natural light.' },
      { slot: 'hotspot-dome', position: '0.4m 1.7m 0.1m', normal: '1m 0m 0m', data: 'Unreinforced Concrete: Still the largest dome of its kind, nearly 2,000 years after completion.' }
    ]
  }
];

export const HISTORICAL_EVENTS = [
  { year: -508, name: 'Athenian Democracy', type: 'event' },
  { year: -490, name: 'Greco-Persian Wars', type: 'event' },
  { year: -323, name: 'Death of Alexander the Great', type: 'event' },
  { year: 117, name: 'Roman Empire Peak', type: 'event' },
  { year: 313, name: 'Edict of Milan', type: 'event' },
  { year: 476, name: 'Fall of Western Rome', type: 'event' },
  { year: 1163, name: 'Notre Dame Construction', type: 'movement' },
  { year: 1420, name: 'Renaissance Begins', type: 'movement' },
  { year: 1760, name: 'Industrial Revolution', type: 'movement' },
  { year: 1884, name: 'First Skyscraper (Chicago)', type: 'event' },
  { year: 1914, name: 'World War I', type: 'event' },
  { year: 1929, name: 'Great Depression', type: 'event' },
  { year: 1939, name: 'World War II', type: 'event' },
  { year: 1969, name: 'Moon Landing', type: 'event' },
  { year: 1991, name: 'Soviet Union Dissolution', type: 'event' },
  { year: 2000, name: 'Digital Age', type: 'movement' }
];

export const ARCHITECTS: Architect[] = [
  {
    id: 'le-corbusier',
    name: 'Le Corbusier',
    bio: 'Charles-Édouard Jeanneret, known as Le Corbusier, was a Swiss-French architect, designer, painter, urban planner, writer, and one of the pioneers of what is now regarded as modern architecture.',
    notableWorks: ['Villa Savoye', 'Unité d\'Habitation', 'Notre-Dame du Haut'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'zahahadid',
    name: 'Zaha Hadid',
    bio: 'The "Queen of the Curve," Zaha Hadid was an Iraqi-British architect, artist and designer, recognized as a major figure in architecture of the late 20th and early 21st centuries.',
    notableWorks: ['Heydar Aliyev Center', 'Guangzhou Opera House', 'MAXXI'],
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'frank-lloyd-wright',
    name: 'Frank Lloyd Wright',
    bio: 'An American architect, designer, writer, and educator. He designed more than 1,000 structures over a creative period of 70 years, pioneering the organic architecture philosophy.',
    notableWorks: ['Fallingwater', 'Guggenheim Museum', 'Taliesin West'],
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800'
  }
];

export const ARCHITECTURAL_FACTS = [
  "The Eiffel Tower was originally intended to be a temporary structure for the 1889 World's Fair and was almost demolished in 1909.",
  "Frank Lloyd Wright designed over 1,100 works, of which 532 were completed.",
  "The Great Pyramid of Giza was the tallest man-made structure in the world for over 3,800 years.",
  "The Leaning Tower of Pisa took nearly 200 years to build, starting in 1173.",
  "The Empire State Building has its own ZIP code (10118).",
  "The ancient Romans used a form of concrete that could set underwater, which is why many of their harbors still exist today.",
  "Antoni Gaudí's Sagrada Família has been under construction for over 140 years and is still not finished.",
  "The Pentagon is so large that the Capitol building could fit into any one of its five wedges.",
  "Fallingwater was built over a waterfall because the clients wanted to live with the falls, not just look at them.",
  "The Burj Khalifa is so tall that you can watch the sunset twice in one day—once from the ground and once from the top."
];
