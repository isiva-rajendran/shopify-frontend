'use server';

import { associateCustomerWithCart } from '@/lib/shopify/queries/cart';
import { TAGS } from 'lib/constants';
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart
} from 'lib/shopify';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function addItem(
  prevState: any,
  selectedVariantId: string | undefined
) {
  if (!selectedVariantId) {
    return 'Error adding item to cart';
  }

  try {
    await addToCart([{ merchandiseId: selectedVariantId, quantity: 1 }]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error adding item to cart';
  }
}

export async function removeItem(prevState: any, merchandiseId: string) {
  try {
    const cart = await getCart();

    if (!cart) {
      return 'Error fetching cart';
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      await removeFromCart([lineItem.id]);
      revalidateTag(TAGS.cart);
    } else {
      return 'Item not found in cart';
    }
  } catch (e) {
    return 'Error removing item from cart';
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
  }
) {
  const { merchandiseId, quantity } = payload;

  try {
    const cart = await getCart();

    if (!cart) {
      return 'Error fetching cart';
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await removeFromCart([lineItem.id]);
      } else {
        await updateCart([
          {
            id: lineItem.id,
            merchandiseId,
            quantity
          }
        ]);
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      await addToCart([{ merchandiseId, quantity }]);
    }

    revalidateTag(TAGS.cart);
  } catch (e) {
    console.error(e);
    return 'Error updating item quantity';
  }
}

export async function redirectToCheckout() {
  try {
    // 1. Get current cart
    const cart = await getCart();
    if (!cart) throw new Error("No cart found");

    // 2. Get customer token if logged in
    const customerAccessToken = (await cookies()).get('shopify_access_token')?.value;

    // 3. Associate customer if logged in
    let checkoutUrl = cart.checkoutUrl;
    if (customerAccessToken && cart.id) {
      const updatedCart = await associateCustomerWithCart(cart.id, customerAccessToken);
      checkoutUrl = updatedCart.checkoutUrl;
    }

    // 4. Add return_to parameter to redirect to localhost:3000 after checkout
    const returnUrl = "https://www.youtube.com/success?order_id={checkout_order_id}";
    const checkoutUrlWithRedirect = `${checkoutUrl}?return_to=${encodeURIComponent(returnUrl)}`;

    // 5. Redirect to checkout with return parameter
    redirect(checkoutUrlWithRedirect);
    
  } catch (error) {
    console.error("Checkout redirect failed:", error);
    throw error;
  }
}

export async function createCartAndSetCookie() {
  let cart = await createCart();
  (await cookies()).set('cartId', cart.id!);
}
