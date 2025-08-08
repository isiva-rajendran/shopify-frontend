// lib/shopify/queries/customer.ts
export const getCustomerQuery = /* GraphQL */ `
  query GetCustomerDetails($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      acceptsMarketing
      defaultAddress {
        id
        address1
        city
        province
        country
        zip
      }
    }
  }
`;