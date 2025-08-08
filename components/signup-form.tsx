"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { signupCustomer } from "@/app/actions/auth"
import { motion } from "framer-motion" // Added for animations

export function SignupForm({ onSignupSuccess }: { onSignupSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError("")
    
    try {
      const result = await signupCustomer(formData)
      
      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          onSignupSuccess()
        }, 2000)
      } else {
        setError(result.error || "Failed to create account")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Alert className="border-green-300 bg-green-50 rounded-lg">
        <AlertDescription className="text-green-800 text-center">
          Account created successfully! Redirecting to login...
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="rounded-lg">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
            First Name
          </Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            required
            placeholder="John"
            disabled={isLoading}
            className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
            Last Name
          </Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            required
            placeholder="Doe"
            disabled={isLoading}
            className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="john@example.com"
          disabled={isLoading}
          className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          placeholder="••••••••"
          disabled={isLoading}
          className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox id="acceptsMarketing" name="acceptsMarketing" />
        <Label htmlFor="acceptsMarketing" className="text-sm text-gray-600">
          I want to receive marketing emails and updates
        </Label>
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
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </motion.div>
    </form>
  )
}