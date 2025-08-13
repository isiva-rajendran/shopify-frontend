"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import ForgotPasswordForm from "@/components/ForgotPasswordForm"

export default function ForgotPasswordPage() {
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("/api/auth/status")
      const data = await res.json()
      if (data.loggedIn) {
        router.replace("/")
      }
    }
    checkAuth()
  }, [router])

  return <ForgotPasswordForm />
}
