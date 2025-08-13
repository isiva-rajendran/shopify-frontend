// app/api/auth/status/route.ts
import { cookies } from "next/headers"

export async function GET() {
  const token = (await cookies()).get("shopify_access_token")?.value
  return new Response(
    JSON.stringify({ loggedIn: Boolean(token) }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  )
}
