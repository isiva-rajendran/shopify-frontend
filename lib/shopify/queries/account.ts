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
  console.log("🚀 ~ updateCustomerAddress ~ addressId:", addressId)
  console.log("🚀 ~ updateCustomerAddress ~ address:", address)
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


interface CustomerProfileDetails {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  acceptsMarketing?: boolean;
}

interface CustomerProfileUpdateResponse {
  customerUpdate?: {
    customer?: CustomerProfileDetails;
    customerUserErrors: Array<{
      code: string;
      field: string[];
      message: string;
    }>;
  };
}

interface CustomerProfileUpdateVariables {
  customerAccessToken: string;
  customer: CustomerProfileDetails;
}

export async function updateCustomerProfile(
  customerProfileDetails: CustomerProfileDetails
): Promise<{ success: boolean; errors?: { code: string; field: string; message: string }[] }> {
  const customerAccessToken = (await cookies()).get('shopify_access_token')?.value;

  if (!customerAccessToken || !customerProfileDetails) {
    return {
      success: false,
      errors: [{ code: 'MISSING_INPUT', field: '', message: 'Missing customer access token or profile details' }],
    };
  }

  const res = await shopifyFetch<{
    variables: CustomerProfileUpdateVariables;
    data: CustomerProfileUpdateResponse;
  }>({
    query: `
      mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
        customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
          customer {
            id
            firstName
            lastName
            email
            phone
            acceptsMarketing
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
      customer: customerProfileDetails, // Renamed to match mutation argument
    },
  });

  const result = res.body.data?.customerUpdate;

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

  if (!result.customer) {
    return { success: false, errors: [{ code: 'UNKNOWN', field: '', message: 'Failed to update customer profile' }] };
  }

  return { success: true };
}

interface CustomerDefaultAddressVariables {
  customerAccessToken: string;
  addressId: string;
}

interface CustomerDefaultAddressUpdateResponse {
  customerDefaultAddressUpdate?: {
    customer?: {
      id: string;
    };
    customerUserErrors: Array<{
      code: string;
      field: string[];
      message: string;
    }>;
  };
}

export async function setCustomerDefaultAddress(
  addressId: string
): Promise<{ success: boolean; errors?: { code: string; field: string; message: string }[] }> {
  const customerAccessToken = (await cookies()).get('shopify_access_token')?.value;

  if (!customerAccessToken || !addressId) {
    return {
      success: false,
      errors: [{ code: 'MISSING_INPUT', field: '', message: 'Missing customer access token or profile details' }],
    };
  }

  const res = await shopifyFetch<{
    variables: CustomerDefaultAddressVariables;
    data: CustomerDefaultAddressUpdateResponse;
  }>({
    query: `
      mutation customerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
        customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
          customer {
            id
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
      addressId: addressId, // Renamed to match mutation argument
    },
  });

  const result = res.body.data?.customerDefaultAddressUpdate;

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

  if (!result.customer) {
    return { success: false, errors: [{ code: 'UNKNOWN', field: '', message: 'Failed to update address' }] };
  }

  return { success: true };
}