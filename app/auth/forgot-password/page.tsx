import ForgotPasswordForm from "@/components/ForgotPasswordForm"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function AuthPage() {
  const token = (await cookies()).get("shopify_access_token")?.value

  if (token) {
    redirect("/")
  }

  return <ForgotPasswordForm />
}
