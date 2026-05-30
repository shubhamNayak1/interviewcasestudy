// 30 products across 5 categories
// sponsored: true = shows "Sponsored" badge and fires AD_IMPRESSION/AD_CLICK
// campaignId is tenant-specific — set dynamically based on active tenant

export const CAMPAIGNS = {
  amazon:   ['camp-amz-001', 'camp-amz-002'],
  flipkart: ['camp-fk-001',  'camp-fk-002'],
  walmart:  ['camp-wm-001',  'camp-wm-002'],
};

export const PRODUCTS = [
  // Electronics
  { id: 'p001', name: 'Wireless Noise-Cancelling Headphones', category: 'Electronics', price: 299.99, rating: 4.5, reviews: 2341, sponsored: true,  adId: 'ad-001', image: '🎧' },
  { id: 'p002', name: 'Mechanical Gaming Keyboard', category: 'Electronics', price: 129.99, rating: 4.3, reviews: 1892, sponsored: false, adId: null,    image: '⌨️' },
  { id: 'p003', name: '4K Ultra HD Smart TV 55"', category: 'Electronics', price: 649.99, rating: 4.7, reviews: 3102, sponsored: true,  adId: 'ad-002', image: '📺' },
  { id: 'p004', name: 'Portable Bluetooth Speaker', category: 'Electronics', price: 79.99,  rating: 4.4, reviews: 987,  sponsored: false, adId: null,    image: '🔊' },
  { id: 'p005', name: 'Smartwatch Pro Series 5', category: 'Electronics', price: 249.99, rating: 4.6, reviews: 1543, sponsored: true,  adId: 'ad-003', image: '⌚' },
  { id: 'p006', name: 'Wireless Charging Pad', category: 'Electronics', price: 39.99,  rating: 4.2, reviews: 654,  sponsored: false, adId: null,    image: '🔋' },

  // Phones & Tablets
  { id: 'p007', name: 'Flagship Smartphone 256GB', category: 'Phones',       price: 999.99, rating: 4.8, reviews: 4231, sponsored: true,  adId: 'ad-004', image: '📱' },
  { id: 'p008', name: 'Budget Android Phone 64GB',  category: 'Phones',       price: 199.99, rating: 4.1, reviews: 876,  sponsored: false, adId: null,    image: '📲' },
  { id: 'p009', name: 'Pro Tablet 12.9" with Pen',  category: 'Phones',       price: 799.99, rating: 4.7, reviews: 2109, sponsored: true,  adId: 'ad-005', image: '📓' },
  { id: 'p010', name: 'Rugged Outdoor Smartphone',  category: 'Phones',       price: 349.99, rating: 4.3, reviews: 432,  sponsored: false, adId: null,    image: '📵' },

  // Laptops
  { id: 'p011', name: 'UltraBook 14" i7 16GB',      category: 'Laptops',      price: 1199.99, rating: 4.6, reviews: 1872, sponsored: true,  adId: 'ad-006', image: '💻' },
  { id: 'p012', name: 'Gaming Laptop RTX 4070',      category: 'Laptops',      price: 1499.99, rating: 4.5, reviews: 2341, sponsored: false, adId: null,    image: '🖥️' },
  { id: 'p013', name: 'MacBook-style Slim Laptop',   category: 'Laptops',      price: 899.99,  rating: 4.4, reviews: 987,  sponsored: false, adId: null,    image: '🖱️' },
  { id: 'p014', name: '2-in-1 Convertible Laptop',   category: 'Laptops',      price: 749.99,  rating: 4.3, reviews: 765,  sponsored: true,  adId: 'ad-007', image: '📒' },

  // Home & Kitchen
  { id: 'p015', name: 'Smart Air Purifier with HEPA', category: 'Home',        price: 189.99, rating: 4.5, reviews: 1234, sponsored: true,  adId: 'ad-008', image: '💨' },
  { id: 'p016', name: 'Robot Vacuum Cleaner',          category: 'Home',        price: 299.99, rating: 4.6, reviews: 2876, sponsored: false, adId: null,    image: '🤖' },
  { id: 'p017', name: 'Instant Pot 7-in-1 Cooker',    category: 'Home',        price: 99.99,  rating: 4.8, reviews: 5432, sponsored: false, adId: null,    image: '🍲' },
  { id: 'p018', name: 'Smart Home Security Camera',   category: 'Home',        price: 59.99,  rating: 4.3, reviews: 987,  sponsored: true,  adId: 'ad-009', image: '📷' },
  { id: 'p019', name: 'Espresso Coffee Machine',      category: 'Home',        price: 249.99, rating: 4.7, reviews: 1654, sponsored: false, adId: null,    image: '☕' },
  { id: 'p020', name: 'Air Fryer XL 6QT',             category: 'Home',        price: 89.99,  rating: 4.5, reviews: 3210, sponsored: false, adId: null,    image: '🍟' },

  // Fashion
  { id: 'p021', name: 'Premium Running Shoes',         category: 'Fashion',     price: 129.99, rating: 4.4, reviews: 2109, sponsored: true,  adId: 'ad-010', image: '👟' },
  { id: 'p022', name: 'Classic Leather Wallet',        category: 'Fashion',     price: 49.99,  rating: 4.3, reviews: 765,  sponsored: false, adId: null,    image: '👛' },
  { id: 'p023', name: 'Waterproof Hiking Backpack',    category: 'Fashion',     price: 79.99,  rating: 4.6, reviews: 1432, sponsored: false, adId: null,    image: '🎒' },
  { id: 'p024', name: 'Polarized Sunglasses',          category: 'Fashion',     price: 39.99,  rating: 4.2, reviews: 543,  sponsored: false, adId: null,    image: '🕶️' },
  { id: 'p025', name: 'Winter Parka Jacket',           category: 'Fashion',     price: 199.99, rating: 4.5, reviews: 876,  sponsored: true,  adId: 'ad-011', image: '🧥' },

  // Sports & Books
  { id: 'p026', name: 'Yoga Mat Premium Non-Slip',     category: 'Sports',      price: 49.99,  rating: 4.6, reviews: 2341, sponsored: false, adId: null,    image: '🧘' },
  { id: 'p027', name: 'Adjustable Dumbbell Set 20kg',  category: 'Sports',      price: 149.99, rating: 4.5, reviews: 987,  sponsored: true,  adId: 'ad-012', image: '🏋️' },
  { id: 'p028', name: 'Smart Water Bottle 32oz',       category: 'Sports',      price: 34.99,  rating: 4.4, reviews: 654,  sponsored: false, adId: null,    image: '💧' },
  { id: 'p029', name: 'System Design Interview Book',  category: 'Books',       price: 44.99,  rating: 4.9, reviews: 6543, sponsored: false, adId: null,    image: '📚' },
  { id: 'p030', name: 'Clean Code: Best Practices',    category: 'Books',       price: 34.99,  rating: 4.8, reviews: 4321, sponsored: false, adId: null,    image: '📖' },
];

export const SPONSORED_PRODUCTS = PRODUCTS.filter(p => p.sponsored);

export function getSponsoredProducts(tenant) {
  const campaigns = CAMPAIGNS[tenant] || CAMPAIGNS.amazon;
  return SPONSORED_PRODUCTS.map((p, i) => ({
    ...p,
    campaignId: campaigns[i % campaigns.length],
  }));
}

export function getProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}
