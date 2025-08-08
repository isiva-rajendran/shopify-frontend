import { shopifyFetch } from '..';
import cartFragment from '../fragments/cart';

export const getCartQuery = /* GraphQL */ `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ...cart
    }
  }
  ${cartFragment}
`;

interface CartBuyerIdentityUpdateVariables {
  cartId: string;
  customerAccessToken: string;
}

interface CartBuyerIdentityUpdateResponse {
  cartBuyerIdentityUpdate?: {
    cart?: {
      id: string;
      checkoutUrl: string;
      buyerIdentity?: {
        customer?: {
          id: string;
          email: string;
        };
      };
    };
    userErrors?: Array<{
      field: string[];
      message: string;
    }>;
  };
}

export async function associateCustomerWithCart(
  cartId: string,
  customerAccessToken: string
) {
  const res = await shopifyFetch<{
    variables: CartBuyerIdentityUpdateVariables;
    data: CartBuyerIdentityUpdateResponse;
  }>({
    query: `
      mutation CartBuyerIdentityUpdate($cartId: ID!, $customerAccessToken: String!) {
        cartBuyerIdentityUpdate(
          cartId: $cartId
          buyerIdentity: { customerAccessToken: $customerAccessToken }
        ) {
          cart {
            id
            checkoutUrl
            buyerIdentity {
              customer {
                id
                email
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    variables: {
      cartId,
      customerAccessToken
    },
  });

  const result = res.body.data?.cartBuyerIdentityUpdate;
  console.log("🚀 ~ associateCustomerWithCart ~ result:", result)
  
  const succeeded = 
    !result?.userErrors?.length || 
    (result.cart?.buyerIdentity?.customer && 
     result.userErrors.some(e => e.message.includes("cart does not exist")));

  if (!succeeded || !result?.cart) {
    throw new Error(result?.userErrors?.[0]?.message || "Failed to associate customer");
  }

  return result.cart;
}