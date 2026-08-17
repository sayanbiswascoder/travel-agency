type Package = {
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
  itinerary: { day: string; title: string; description: string }[];
};

export default Package;