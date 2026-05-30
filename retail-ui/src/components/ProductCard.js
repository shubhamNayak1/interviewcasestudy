import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTenant } from '../context/TenantContext';
import { useCart } from '../context/CartContext';
import { trackAdImpression, trackAdClick, trackAddToCart, trackProductClick } from '../sdk/tracker';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { tenant } = useTenant();
  const { addToCart } = useCart();

  // Fire AD_IMPRESSION when sponsored card mounts
  useEffect(() => {
    if (product.sponsored && product.campaignId) {
      trackAdImpression(tenant.id, product.campaignId, product.adId, product.id);
    }
  }, [product.id, product.campaignId, tenant.id]);

  function handleCardClick() {
    if (product.sponsored && product.campaignId) {
      trackAdClick(tenant.id, product.campaignId, product.adId, product.id);
    } else {
      trackProductClick(tenant.id, product.id);
    }
    navigate(`/product/${product.id}${product.campaignId ? `?cid=${product.campaignId}` : ''}`);
  }

  function handleAddToCart(e) {
    e.stopPropagation();
    addToCart(product);
    trackAddToCart(tenant.id, product.id, product.campaignId || null);
  }

  return (
    <div style={cardStyle} onClick={handleCardClick}>
      {product.sponsored && (
        <span style={sponsoredBadge}>Sponsored</span>
      )}
      <div style={imageBox}>{product.image}</div>
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>{product.category}</div>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, lineHeight: 1.4 }}>{product.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <span style={{ color: '#f5a623', fontWeight: 700 }}>{'★'.repeat(Math.round(product.rating))}</span>
          <span style={{ fontSize: 12, color: '#888' }}>({product.reviews.toLocaleString()})</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#111' }}>${product.price}</span>
          <button style={addBtn} onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: '#fff',
  borderRadius: 10,
  border: '1px solid #e8e8e8',
  cursor: 'pointer',
  position: 'relative',
  transition: 'box-shadow 0.2s, transform 0.15s',
  overflow: 'hidden',
};

const sponsoredBadge = {
  position: 'absolute',
  top: 10,
  left: 10,
  background: '#fff3cd',
  color: '#856404',
  fontSize: 11,
  fontWeight: 600,
  padding: '2px 8px',
  borderRadius: 4,
  border: '1px solid #ffc107',
  zIndex: 1,
};

const imageBox = {
  background: '#f8f9fa',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 72,
  height: 160,
};

const addBtn = {
  background: '#ff9900',
  color: '#111',
  border: 'none',
  borderRadius: 6,
  padding: '7px 14px',
  fontWeight: 600,
  fontSize: 13,
  cursor: 'pointer',
};
