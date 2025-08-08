"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { loginCustomer } from "@/app/actions/auth"
import Link from "next/link"
import { motion } from "framer-motion" // Added for button animation

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError("")
    
    try {
      const result = await loginCustomer(formData)
      
      if (result.success) {
        router.push("/")
      } else {
        setError(result.error || "Failed to sign in")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
      router.refresh()
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="rounded-lg">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-3">
        <Label htmlFor="loginEmail" className="text-sm font-medium text-gray-700">
          Email
        </Label>
        <Input
          id="loginEmail"
          name="email"
          type="email"
          required
          placeholder="john@example.com"
          disabled={isLoading}
          className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="loginPassword" className="text-sm font-medium text-gray-700">
          Password
        </Label>
        <Input
          id="loginPassword"
          name="password"
          type="password"
          required
          placeholder="••••••••"
          disabled={isLoading}
          className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          type="submit"
          className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </motion.div>
      
      <div className="text-center">
        <Link href="/auth/forgot-password">
          <Button variant="link" className="text-sm text-blue-600 hover:text-blue-800">
            Forgot your password?
          </Button>
        </Link>
      </div>
    </form>
  )
}