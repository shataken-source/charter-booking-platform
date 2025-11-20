import { MarineProduct } from '@/types/marineProduct';

export const marineProducts: MarineProduct[] = [
  {
    id: '1',
    name: 'Life Jacket Type III PFD',
    description: 'USCG approved life jacket with adjustable straps',
    price: 49.99,
    originalPrice: 69.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    category: 'safety',
    retailer: 'amazon',
    affiliateLink: 'https://amazon.com/dp/EXAMPLE?tag=youraffid-20',
    rating: 4.5,
    reviewCount: 234,
    inStock: true,
    featured: true
  },
  {
    id: '2',
    name: 'Marine GPS Navigator',
    description: 'Waterproof GPS with chartplotter and fish finder',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1551817958-20e39ce1d3f8?w=400',
    category: 'navigation',
    retailer: 'boatus',
    affiliateLink: 'https://boatus.com/product/EXAMPLE?affiliate=yourid',
    rating: 4.8,
    reviewCount: 156,
    inStock: true,
    featured: true
  },
  {
    id: '3',
    name: 'Fishing Rod & Reel Combo',
    description: 'Professional saltwater fishing combo',
    price: 159.99,
    originalPrice: 199.99,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
    category: 'fishing',
    retailer: 'walmart',
    affiliateLink: 'https://walmart.com/product/EXAMPLE?affid=yourid',
    rating: 4.6,
    reviewCount: 89,
    inStock: true
  },
  {
    id: '4',
    name: 'Marine First Aid Kit',
    description: 'Complete waterproof first aid kit',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400',
    category: 'safety',
    retailer: 'amazon',
    affiliateLink: 'https://amazon.com/dp/EXAMPLE2?tag=youraffid-20',
    rating: 4.7,
    reviewCount: 312,
    inStock: true
  },
  {
    id: '5',
    name: 'Boat Anchor Kit',
    description: 'Heavy duty anchor with rope and chain',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
    category: 'accessories',
    retailer: 'boatus',
    affiliateLink: 'https://boatus.com/product/EXAMPLE2?affiliate=yourid',
    rating: 4.4,
    reviewCount: 67,
    inStock: true
  },
  {
    id: '6',
    name: 'Cooler 50 Quart',
    description: 'Insulated marine cooler',
    price: 129.99,
    originalPrice: 159.99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    category: 'accessories',
    retailer: 'walmart',
    affiliateLink: 'https://walmart.com/product/EXAMPLE2?affid=yourid',
    rating: 4.5,
    reviewCount: 201,
    inStock: true,
    featured: true
  }
];
