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

// export const getCartQuery = /* GraphQL */ `
//   query getCart($cartId: ID!, $customerAccessToken: String) {
//     cart(id: $cartId) {
//       ...cart
//     }
//     customer(customerAccessToken: $customerAccessToken) {
//       id
//       firstName
//       lastName
//       email
//       defaultAddress {
//         id
//         address1
//         city
//         province
//         country
//         zip
//       }
//     }
//   }
//   ${cartFragment}
// `;

export const CART_BUYER_IDENTITY_UPDATE_MUTATION = /* GraphQL */ `
  mutation CartBuyerIdentityUpdate(
    $cartId: ID!
    $customerAccessToken: String!
  ) {
    cartBuyerIdentityUpdate(
      cartId: $cartId
      buyerIdentity: {
        customerAccessToken: $customerAccessToken
      }
    ) {
      cart {
        id
        checkoutUrl
        buyerIdentity {
          email
          customer {
            id
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
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