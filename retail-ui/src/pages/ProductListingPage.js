import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { PRODUCTS, getSponsoredProducts } from '../data/products';
import { useTenant } from '../context/TenantContext';

const CATEGORIES = ['All', 'Electronics', 'Phones', 'Laptops', 'Home', 'Fashion', 'Sports', 'Books'];

export default function ProductListingPage() {
  const { tenant } = useTenant();
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('cat') || 'All');
  const [search, setSearch] = useState('');

  const sponsored = getSponsoredProducts(tenant.id);

  const allProducts = PRODUCTS.map(p => {
    const sp = sponsored.find(s => s.id === p.id);
    return sp || p;
  });

  const filtered = allProducts.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {/* Search */}
        <input
          placeholder="🔍  Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '10px 16px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14 }}
        />
      </div>

      {/* Category pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '6px 16px', borderRadius: 20, border: '1px solid #ddd',
              background: activeCategory === cat ? tenant.bg : '#fff',
              color: activeCategory === cat ? '#fff' : '#333',
              fontWeight: activeCategory === cat ? 600 : 400,
              cursor: 'pointer', fontSize: 13,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 12, color: '#666', fontSize: 13 }}>
        {filtered.length} results
        {filtered.filter(p => p.sponsored).length > 0 && (
          <span style={{ marginLeft: 8, color: '#856404' }}>
            · {filtered.filter(p => p.sponsored).length} sponsored
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 18 }}>
        {filtered.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
