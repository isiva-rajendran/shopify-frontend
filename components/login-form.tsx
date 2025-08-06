"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from 'lucide-react'
import { loginCustomer } from "@/app/actions/auth"

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
        // Redirect to dashboard or home page after successful login
        router.push("/dashboard")
      } else {
        setError(result.error || "Failed to sign in")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="loginEmail">Email</Label>
        <Input
          id="loginEmail"
          name="email"
          type="email"
          required
          placeholder="john@example.com"
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="loginPassword">Password</Label>
        <Input
          id="loginPassword"
          name="password"
          type="password"
          required
          placeholder="••••••••"
          disabled={isLoading}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing In...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
      
      <div className="text-center">
        <Button variant="link" className="text-sm">
          Forgot your password?
        </Button>
      </div>
    </form>
  )
}
