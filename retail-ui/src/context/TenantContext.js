import { createContext, useContext, useState } from 'react';

const TenantContext = createContext(null);

export const TENANTS = [
  { id: 'amazon',   label: 'Amazon',   color: '#FF9900', bg: '#232F3E' },
  { id: 'flipkart', label: 'Flipkart', color: '#2874F0', bg: '#2874F0' },
  { id: 'walmart',  label: 'Walmart',  color: '#0071CE', bg: '#0071CE' },
];

export function TenantProvider({ children }) {
  const [tenant, setTenant] = useState(TENANTS[0]);
  return (
    <TenantContext.Provider value={{ tenant, setTenant, tenants: TENANTS }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  return useContext(TenantContext);
}
