import { useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../data/products';
import { useTenant } from '../context/TenantContext';
import { useCart } from '../context/CartContext';
import { trackProductView, trackAdImpression, trackAddToCart } from '../sdk/tracker';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { tenant } = useTenant();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const campaignId = searchParams.get('cid');
  const product = getProductById(id);

  useEffect(() => {
    if (!product) return;
    trackProductView(tenant.id, product.id);
    if (product.sponsored && campaignId) {
      trackAdImpression(tenant.id, campaignId, product.adId, product.id);
    }
  }, [id, tenant.id]);

  if (!product) return <div style={{ padding: 40, textAlign: 'center' }}>Product not found.</div>;

  function handleAddToCart() {
    addToCart({ ...product, campaignId });
    trackAddToCart(tenant.id, product.id, campaignId);
    navigate('/cart');
  }

  return (
    <div style={{ maxWidth: 900, margin: '32px auto', padding: '0 16px' }}>
      <button onClick={() => navigate(-1)} style={backBtn}>← Back</button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 20 }}>
        {/* Image panel */}
        <div style={{ background: '#f8f9fa', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 120, minHeight: 320 }}>
          {product.image}
          {product.sponsored && <span style={sponsoredBadge}>Sponsored</span>}
        </div>

        {/* Info panel */}
        <div>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>{product.category}</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 12px', lineHeight: 1.3 }}>{product.name}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ color: '#f5a623', fontSize: 18 }}>{'★'.repeat(Math.round(product.rating))}</span>
            <span style={{ color: '#0066c0', fontSize: 14 }}>{product.rating} ({product.reviews.toLocaleString()} reviews)</span>
          </div>

          <div style={{ fontSize: 34, fontWeight: 700, color: '#111', marginBottom: 6 }}>${product.price}</div>
          <div style={{ color: '#2e7d32', fontSize: 14, marginBottom: 20 }}>✓ In Stock — Ships in 1-2 days</div>

          {campaignId && (
            <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 6, padding: '8px 12px', marginBottom: 16, fontSize: 12, color: '#856404' }}>
              🎯 Sponsored by campaign: <strong>{campaignId}</strong>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            style={{ background: '#ff9900', border: 'none', borderRadius: 8, padding: '14px 32px', fontSize: 16, fontWeight: 700, cursor: 'pointer', width: '100%', marginBottom: 10 }}
          >
            🛒 Add to Cart
          </button>
          <button
            style={{ background: '#f0c040', border: 'none', borderRadius: 8, padding: '12px 32px', fontSize: 15, fontWeight: 600, cursor: 'pointer', width: '100%' }}
          >
            ⚡ Buy Now
          </button>

          <div style={{ marginTop: 20, padding: 16, background: '#f8f9fa', borderRadius: 8, fontSize: 13, color: '#555' }}>
            <div>Tenant: <strong>{tenant.label}</strong></div>
            {campaignId && <div>Campaign: <strong>{campaignId}</strong></div>}
            <div>Product ID: <code>{product.id}</code></div>
          </div>
        </div>
      </div>
    </div>
  );
}

const backBtn = { background: 'none', border: '1px solid #ddd', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: 14 };
const sponsoredBadge = { position: 'absolute', top: 10, left: 10, background: '#fff3cd', color: '#856404', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, border: '1px solid #ffc107' };
