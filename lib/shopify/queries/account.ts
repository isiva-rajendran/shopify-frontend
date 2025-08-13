'use server';
import { shopifyFetch } from '..';
import { cookies } from 'next/headers';
import { AddressInput } from '../types';

// Types for customerAddressUpdate
interface CustomerAddressUpdateVariables {
  customerAccessToken: string;
  id: string;
  address: AddressInput;
}

interface CustomerAddressUpdateResponse {
  customerAddressUpdate?: {
    customerAddress?: {
      id: string;
      address1: string;
      address2: string | null;
      city: string;
      company: string | null;
      country: string;
      firstName: string | null;
      lastName: string | null;
      phone: string | null;
      province: string;
      zip: string;
    };
    customerUserErrors: Array<{
      code: string;
      field: string[];
      message: string;
    }>;
  };
}

export async function updateCustomerAddress(
  addressId: string,
  address: AddressInput
): Promise<{ success: boolean; errors?: { code: string; field: string; message: string }[] }> {
  const customerAccessToken = (await cookies()).get('shopify_access_token')?.value;

  if (!customerAccessToken || !addressId) {
    return {
      success: false,
      errors: [{ code: 'MISSING_INPUT', field: '', message: 'Missing customer access token or address ID' }],
    };
  }

  const res = await shopifyFetch<{
    variables: CustomerAddressUpdateVariables;
    data: CustomerAddressUpdateResponse;
  }>({
    query: `
      mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
        customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
          customerAddress {
            id
            address1
            address2
            city
            company
            country
            firstName
            lastName
            phone
            province
            zip
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `,
    variables: {
      customerAccessToken,
      id: addressId,
      address,
    },
  });

  const result = res.body.data?.customerAddressUpdate;

  if (!result) {
    return { success: false, errors: [{ code: 'NO_RESULT', field: '', message: 'Mutation returned no result' }] };
  }

  if (result.customerUserErrors.length > 0) {
    console.error('Customer user errors:', result.customerUserErrors);
    return {
      success: false,
      errors: result.customerUserErrors.map(error => ({
        code: error.code,
        field: error.field.join('.'),
        message: error.message,
      })),
    };
  }

  if (!result.customerAddress) {
    return { success: false, errors: [{ code: 'UNKNOWN', field: '', message: 'Failed to update address' }] };
  }

  return { success: true };
}