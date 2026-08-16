import fs from 'fs';
import path from 'path';

export type TravelPackage = {
  slug: string;
  title: string;
  badge?: string;
  price: number;
  duration?: string;
  rating?: number;
  image?: string;
  summary?: string;
  description?: string;
  features?: string[];
  itinerary?: Array<{ day: string; title: string; description: string }>;
};

const STORE_DIR = path.join(process.cwd(), 'tmp');
const STORE_FILE = path.join(STORE_DIR, 'packages.json');

const DEFAULT_PACKAGES: TravelPackage[] = [
  {
    slug: "sundarbans-wilderness-retreat",
    title: "Sundarbans Wilderness Retreat",
    badge: "Best seller",
    price: 2499,
    duration: "4 days / 3 nights",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
    summary: "A short, immersive stay exploring mangrove creeks, wildlife spotting, and riverside eco-lodges.",
    description: "Ideal for nature lovers: guided river safaris in search of the Royal Bengal tiger, mangrove walks, and evenings at a quiet eco-lodge.",
  },
  {
    slug: "mangrove-mystic-cruise",
    title: "Mystic Mangrove Cruise",
    badge: "Couples escape",
    price: 2999,
    duration: "5 days / 4 nights",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1200&q=80",
    summary: "A romantic, slow-paced cruise through winding creeks with private dinners and quiet nights by the river.",
    description: "Perfect for couples seeking intimacy and nature: private boat cruises, candlelit riverside dinners, and guided night safaris.",
  },
  {
    slug: "sundarbans-adventure-expedition",
    title: "Sundarbans Adventure Expedition",
    badge: "Active",
    price: 3499,
    duration: "7 days / 6 nights",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=1200&q=80",
    summary: "An active exploration combining early-morning safaris, longer creek expeditions, and guided nature treks.",
    description: "For adventurous travelers: extended boat safaris, guided mangrove treks, and intensive wildlife and birding experiences.",
  },
  {
    slug: "luxury-wellness-soulscape",
    title: "Luxury Wellness Soulscape",
    badge: "Slow living",
    price: 4999,
    duration: "7 days / 6 nights",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    summary: "A restorative wellness stay with mindful rituals, gourmet dining, and peaceful villa living.",
    description: "For travelers seeking deep rest, grounding rituals, and thoughtful luxury inside Sundarban’s serene countryside.",
  }
];

function ensureStore() {
  try {
    if (!fs.existsSync(STORE_DIR)) fs.mkdirSync(STORE_DIR, { recursive: true });
    if (!fs.existsSync(STORE_FILE)) {
      fs.writeFileSync(STORE_FILE, JSON.stringify(DEFAULT_PACKAGES, null, 2), 'utf-8');
    }
  } catch (e) {
    console.error('Unable to ensure package store:', e);
  }
}

export function getPackages(): TravelPackage[] {
  ensureStore();
  try {
    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    return JSON.parse(raw) as TravelPackage[];
  } catch (e) {
    return DEFAULT_PACKAGES;
  }
}

export function savePackages(pkgs: TravelPackage[]) {
  ensureStore();
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(pkgs, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('Unable to save packages:', e);
    return false;
  }
}

export function getPackageBySlug(slug: string) {
  const list = getPackages();
  return list.find((item) => item.slug === slug);
}
