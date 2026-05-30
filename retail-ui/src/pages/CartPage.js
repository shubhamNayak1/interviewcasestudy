import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const { items, removeFromCart, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 600, margin: '60px auto', textAlign: 'center', padding: '0 16px' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
        <h2>Your cart is empty</h2>
        <Link to="/products" style={{ color: '#0066c0', fontSize: 16 }}>Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '32px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Shopping Cart ({totalItems} items)</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        {/* Cart Items */}
        <div>
          {items.map(item => (
            <div key={item.id} style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 10, padding: 20, marginBottom: 12, display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ fontSize: 48 }}>{item.image}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.name}</div>
                {item.campaignId && (
                  <div style={{ fontSize: 11, color: '#856404', background: '#fff3cd', display: 'inline-block', padding: '1px 6px', borderRadius: 3, marginBottom: 4 }}>
                    Sponsored · {item.campaignId}
                  </div>
                )}
                <div style={{ fontSize: 13, color: '#888' }}>Qty: {item.qty}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: 18 }}>${(item.price * item.qty).toFixed(2)}</div>
                <button onClick={() => removeFromCart(item.id)} style={{ marginTop: 8, color: '#c00', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 10, padding: 24, height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 18 }}>Order Summary</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>Subtotal ({totalItems} items)</span>
            <strong>${totalPrice.toFixed(2)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, color: '#2e7d32' }}>
            <span>Shipping</span>
            <strong>FREE</strong>
          </div>
          <div style={{ borderTop: '1px solid #eee', paddingTop: 16, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18, marginBottom: 20 }}>
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <button style={{ width: '100%', background: '#ff9900', border: 'none', borderRadius: 8, padding: '14px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
