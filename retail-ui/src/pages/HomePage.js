import { Link } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';
import ProductCard from '../components/ProductCard';
import { getSponsoredProducts, PRODUCTS } from '../data/products';

export default function HomePage() {
  const { tenant } = useTenant();
  const sponsored = getSponsoredProducts(tenant.id).slice(0, 4);
  const featured = PRODUCTS.filter(p => !p.sponsored).slice(0, 8);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>

      {/* Hero Banner */}
      <div style={{ background: `linear-gradient(135deg, ${tenant.bg}, #1a1a2e)`, borderRadius: 14, padding: '40px 48px', marginBottom: 36, color: '#fff' }}>
        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 8 }}>AdTech Demo Platform</div>
        <h1 style={{ fontSize: 36, fontWeight: 700, margin: '0 0 12px' }}>Welcome to {tenant.label}</h1>
        <p style={{ fontSize: 16, opacity: 0.9, margin: '0 0 24px' }}>Millions of products. Real-time ad tracking.</p>
        <Link to="/products" style={{ background: '#ff9900', color: '#111', padding: '12px 28px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 15 }}>
          Shop Now
        </Link>
      </div>

      {/* Sponsored Products */}
      <section style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
            ⭐ Sponsored Products
            <span style={{ fontSize: 12, fontWeight: 400, color: '#888', marginLeft: 8 }}>Ad impressions firing now →</span>
          </h2>
          <Link to="/products" style={{ fontSize: 14, color: '#0066c0', textDecoration: 'none' }}>See all</Link>
        </div>
        <div style={grid}>
          {sponsored.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Regular Products */}
      <section>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Today's Deals</h2>
        <div style={grid}>
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
  gap: 18,
};
