"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const SHOPIFY_STOREFRONT_URL = "https://store-front-test-shop.myshopify.com/api/2025-07/graphql.json"
const SHOPIFY_ACCESS_TOKEN = "450948518abe57f296160df3df45a4d1"

interface ShopifyResponse {
  data?: any
  errors?: Array<{ message: string }>
}

interface CustomerUserError {
  field: string[]
  message: string
  code: string
}

async function makeShopifyRequest(query: string, variables: any = {}) {
  const myHeaders = new Headers()
  myHeaders.append("X-Shopify-Storefront-Access-Token", SHOPIFY_ACCESS_TOKEN)
  myHeaders.append("Content-Type", "application/json")

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      query,
      variables
    })
  }

  try {
    const response = await fetch(SHOPIFY_STOREFRONT_URL, requestOptions)
    const result: ShopifyResponse = await response.json()
    return result
  } catch (error) {
    console.error("Shopify API Error:", error)
    throw new Error("Failed to connect to Shopify")
  }
}

export async function signupCustomer(formData: FormData) {
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const acceptsMarketing = formData.get("acceptsMarketing") === "on"

  const mutation = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          firstName
          lastName
          email
          phone
          acceptsMarketing
        }
        customerUserErrors {
          field
          message
          code
        }
      }
    }
  `

  const variables = {
    input: {
      firstName,
      lastName,
      email,
      password,
      acceptsMarketing
    }
  }

  try {
    const result = await makeShopifyRequest(mutation, variables)

    if (result.errors) {
      return {
        success: false,
        // error: result.errors[0].message
      }
    }

    const { customerCreate } = result.data
    
    if (customerCreate.customerUserErrors.length > 0) {
      const error = customerCreate.customerUserErrors[0]
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      customer: customerCreate.customer
    }
  } catch (error) {
    return {
      success: false,
      error: "Failed to create account. Please try again."
    }
  }
}

export async function loginCustomer(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const mutation = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          field
          message
          code
        }
      }
    }
  `

  const variables = {
    input: {
      email,
      password
    }
  }

  try {
    const result = await makeShopifyRequest(mutation, variables)

    if (result.errors) {
      return {
        success: false,
        // error: result.errors[0].message
      }
    }

    const { customerAccessTokenCreate } = result.data
    
    if (customerAccessTokenCreate.customerUserErrors.length > 0) {
      const error = customerAccessTokenCreate.customerUserErrors[0]
      return {
        success: false,
        error: error.message || "Invalid email or password"
      }
    }

    const { accessToken, expiresAt } = customerAccessTokenCreate.customerAccessToken

    // Store the access token in cookies
    const cookieStore = await cookies()
    cookieStore.set("shopify_access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(expiresAt)
    })

    return {
      success: true,
      accessToken
    }
  } catch (error) {
    return {
      success: false,
      error: "Failed to sign in. Please try again."
    }
  }
}

export async function logoutCustomer() {
  const cookieStore = await cookies()
  cookieStore.delete("shopify_access_token")
  return {
      success: true,
    }
}
