import { shopifyFetch } from '@/lib/shopify';
import { CART_BUYER_IDENTITY_UPDATE_MUTATION } from '@/lib/shopify/queries/cart';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { cartId } = await request.json();
  const customerAccessToken = (await cookies()).get('shopify_access_token')?.value;

  if (!customerAccessToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const res = await shopifyFetch({
    query: CART_BUYER_IDENTITY_UPDATE_MUTATION,
    variables: {
      cartId,
      customerAccessToken
    }
  });

  return Response.json(res.body.data.cartBuyerIdentityUpdate);
}