// app/auth/page.tsx  (Server Component)
import AuthPageClient from "@/components/auth/client/auth-page-client"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function AuthPage() {
  const token = (await cookies()).get("shopify_access_token")?.value

  if (token) {
    redirect("/")
  }

  return <AuthPageClient />
}
