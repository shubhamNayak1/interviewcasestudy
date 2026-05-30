import { Link } from 'react-router-dom';
import { useTenant, TENANTS } from '../context/TenantContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { tenant, setTenant } = useTenant();
  const { totalItems } = useCart();

  return (
    <nav style={{ background: tenant.bg, padding: '0 24px', display: 'flex', alignItems: 'center', height: 60, gap: 24 }}>
      <Link to="/" style={{ color: '#fff', fontWeight: 700, fontSize: 22, textDecoration: 'none', marginRight: 8 }}>
        🛒 {tenant.label}
      </Link>

      <Link to="/products" style={navLink}>All Products</Link>
      <Link to="/products?cat=Electronics" style={navLink}>Electronics</Link>
      <Link to="/products?cat=Fashion" style={navLink}>Fashion</Link>
      <Link to="/products?cat=Home" style={navLink}>Home</Link>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Tenant switcher — key for multi-tenancy demo */}
        <select
          value={tenant.id}
          onChange={e => setTenant(TENANTS.find(t => t.id === e.target.value))}
          style={{ padding: '6px 10px', borderRadius: 6, border: 'none', fontWeight: 600, cursor: 'pointer' }}
        >
          {TENANTS.map(t => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>

        <Link to="/cart" style={{ ...navLink, position: 'relative' }}>
          🛒 Cart
          {totalItems > 0 && (
            <span style={cartBadge}>{totalItems}</span>
          )}
        </Link>
      </div>
    </nav>
  );
}

const navLink = {
  color: '#fff',
  textDecoration: 'none',
  fontSize: 14,
  fontWeight: 500,
  opacity: 0.9,
};

const cartBadge = {
  position: 'absolute',
  top: -8,
  right: -10,
  background: '#e53935',
  color: '#fff',
  borderRadius: '50%',
  width: 18,
  height: 18,
  fontSize: 11,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
};
