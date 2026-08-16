import fs from 'fs';
import path from 'path';
import { packages } from './travel-data';

export type TravelPackage = {
  slug: string;
  title: string;
  badge: string;
  price: number;
  duration: string;
  rating: number;
  image: string;
  summary: string;
  description: string;
  features: string[];
  itinerary: Array<{ day: string; title: string; description: string }>;
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
    features: ["Guided river safari", "Eco-lodge stay", "All transfers", "Local boat excursions"],
    itinerary: [
      { day: "Day 1", title: "Arrival & river transfer", description: "Meet at the gateway town and transfer by boat into the Sundarbans; evening wildlife talk at the lodge." },
      { day: "Day 2", title: "Morning safari & mangrove walk", description: "Early river safari for birdwatching and a guided mangrove walk with a naturalist." },
      { day: "Day 3", title: "Creek exploration", description: "Full-day boat exploration of creeks with picnic lunch and local village visit." },
      { day: "Day 4", title: "Departure", description: "Final morning boat ride and return to the gateway town for onward travel." }
    ]
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
    features: ["Private boat cruise", "Riverside dinners", "Night safari", "Guided birdwatching"],
    itinerary: [
      { day: "Day 1", title: "Boarding & sunset cruise", description: "Embark at the river gateway and enjoy an intimate sunset cruise to your riverside lodge." },
      { day: "Day 2", title: "Hidden creeks", description: "Explore narrow creeks and discover secluded sandbanks and birdlife." },
      { day: "Day 3", title: "Village visit", description: "Visit a riverside village to learn about local life and traditional fishing." },
      { day: "Day 4", title: "Night safari", description: "A guided nocturnal cruise to spot wildlife and listen to the sounds of the mangrove night." },
      { day: "Day 5", title: "Departure", description: "Return to the gateway town after a final morning cruise and breakfast." }
    ]
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
    features: ["Extended river safaris", "Guided mangrove treks", "Local wildlife spotting", "Village interactions"],
    itinerary: [
      { day: "Day 1", title: "Gateway arrival", description: "Arrive at the river gateway and board your expedition boat for an evening briefing." },
      { day: "Day 2", title: "Full-day safari", description: "A long-day cruise into deeper creeks with multiple wildlife viewing stops." },
      { day: "Day 3", title: "Mangrove trek", description: "Guided on-foot exploration of safe mangrove trails and learning about the ecosystem." },
      { day: "Day 4", title: "Community visit", description: "Spend time with a local fishing community and learn traditional techniques." },
      { day: "Day 5", title: "Birding focus", description: "Dedicated birdwatching day with a specialist naturalist." },
      { day: "Day 6", title: "Relaxed cruise", description: "A gentler cruise with time for photography and a sunset farewell." },
      { day: "Day 7", title: "Departure", description: "Return to the gateway town for onward travel after breakfast." }
    ]
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
    features: ["Private wellness coach", "Chef-curated dining", "Luxury spa access", "Garden villa", "Morning breathwork"],
    itinerary: [
      { day: "Day 1", title: "Arrival & reset", description: "Check into your private villa and enjoy a guided breathing and stretch session." },
      { day: "Day 2", title: "Sound bath evening", description: "A restorative evening centered on sound healing and meditation in the jungle." },
      { day: "Day 3", title: "Organic farming day", description: "Visit a local farm and learn how Sundarban’s freshest ingredients shape its cuisine." },
      { day: "Day 4", title: "Spa journey", description: "Indulge in a signature body ritual and take time to unwind by the pool." },
      { day: "Day 5", title: "Mindful movement", description: "Join a sunrise flow and a journaling workshop guided by a wellness expert." },
      { day: "Day 6", title: "Free day", description: "Choose your pace with optional massage, cooking class, or villa downtime." },
      { day: "Day 7", title: "Departure", description: "A final breakfast and a calm transfer to the airport." }
    ]
  }
];

export function getPackageBySlug(slug: string) {
  return packages.find((item) => item.slug === slug);
}
