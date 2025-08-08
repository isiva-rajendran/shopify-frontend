// components/cart/LinkCustomerToCart.tsx
'use client';

import { useState } from 'react';

export function LinkCustomerToCart({ cartId }: { cartId: string }) {
  const [loading, setLoading] = useState(false);

  const handleLinkCustomer = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cart/link-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartId }),
      });

      const result = await response.json();
      if (result.userErrors?.length) {
        throw new Error(result.userErrors[0].message);
      }
      window.location.href = result.cart.checkoutUrl;
    } catch (error) {
      console.error('Failed to link customer:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleLinkCustomer}
      disabled={loading}
      className="bg-black text-white px-4 py-2 rounded"
    >
      {loading ? 'Processing...' : 'Proceed to Checkout'}
    </button>
  );
}