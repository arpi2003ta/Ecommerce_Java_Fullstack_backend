export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  createdAt: number;
};

const img = (seed: string) =>
  `https://picsum.photos/seed/${seed}/600/600`;

export const CATEGORIES = [
  "Audio",
  "Wearables",
  "Cameras",
  "Home",
  "Accessories",
  "Gaming",
] as const;

const names: Record<string, string[]> = {
  Audio: ["Aero Wireless Headphones", "Pulse Earbuds Pro", "Studio Monitor Speaker", "Nomad Bluetooth Speaker"],
  Wearables: ["Chrono Smartwatch", "Fit Band Ultra", "Pulse Ring", "Aero Sport Watch"],
  Cameras: ["Lumen Mirrorless X1", "Prime 50mm Lens", "PocketCam 4K", "Drone Vision Pro"],
  Home: ["Ambient Smart Lamp", "Aroma Diffuser", "Ceramic Kettle", "Linen Throw Blanket"],
  Accessories: ["Leather Cardholder", "Canvas Backpack", "Aviator Sunglasses", "Woven Tote"],
  Gaming: ["Vortex Mechanical Keyboard", "Glide Gaming Mouse", "Arc Controller", "Halo Headset"],
};

const descriptions = [
  "Crafted with premium materials and a minimalist finish.",
  "Designed for everyday performance and long-lasting comfort.",
  "A modern classic — refined details, effortless style.",
  "Engineered for precision. Built to last a lifetime.",
];

let idCounter = 1;
export const PRODUCTS: Product[] = Object.entries(names).flatMap(([category, list]) =>
  list.flatMap((base, i) =>
    Array.from({ length: 3 }, (_, k) => {
      const id = idCounter++;
      return {
        id,
        name: k === 0 ? base : `${base} ${["Mk II", "Edition", "Limited"][k - 1] ?? ""}`.trim(),
        category,
        price: Math.round((40 + ((id * 37) % 460)) * 100) / 100,
        rating: Math.round(((id % 20) / 4 + 3) * 10) / 10,
        image: img(`${category}-${id}`),
        description: descriptions[id % descriptions.length],
        createdAt: Date.now() - id * 86400000,
      };
    }),
  ),
);

export const CAROUSEL_SLIDES = [
  {
    id: 1,
    eyebrow: "New Season",
    title: "Sound, Refined.",
    subtitle: "Immersive audio built for everyday moments.",
    image: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=1600&q=80&auto=format&fit=crop",
    tint: "#0f172a",
  },
  {
    id: 2,
    eyebrow: "Editor's Pick",
    title: "Everyday Essentials",
    subtitle: "Timeless accessories, thoughtfully designed.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80&auto=format&fit=crop",
    tint: "#1a1a1a",
  },
  {
    id: 3,
    eyebrow: "Limited Drop",
    title: "Precision Tools",
    subtitle: "Cameras and gear for the moments that matter.",
    image: "https://images.unsplash.com/photo-1519183071298-a2962be96f83?w=1600&q=80&auto=format&fit=crop",
    tint: "#111827",
  },
];