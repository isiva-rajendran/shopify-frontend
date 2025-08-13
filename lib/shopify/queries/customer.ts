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
        address2
        city
        province
        country
        company
        phone
        firstName
        lastName
        zip
      }
    }
  }
`;