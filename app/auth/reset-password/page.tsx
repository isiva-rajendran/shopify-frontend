"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { resetPassword } from "@/app/actions/auth"
import { motion } from "framer-motion" // Added for animations

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [token, setToken] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const resetToken = searchParams.get("token")
    if (resetToken) {
      setToken(resetToken)
    } else {
      setError("Invalid or missing reset token")
    }
  }, [searchParams])

  async function handleSubmit(formData: FormData) {
    if (!token) {
      setError("Invalid reset token")
      return
    }

    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setIsLoading(true)
    setError("")
    
    try {
      const result = await resetPassword(token, password)
      
      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/auth")
        }, 3000)
      } else {
        setError(result.error || "Failed to reset password")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (!token && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-3 text-base text-gray-500">
            Enter your new password below
          </p>
        </div>
        
        <Card className="w-full shadow-lg rounded-xl border border-gray-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">New Password</CardTitle>
            <CardDescription className="text-gray-500">
              Choose a strong password for your account
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {success ? (
              <div className="space-y-4 text-center">
                <div className="flex justify-center">
                  <div className="rounded-full bg-green-100 p-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <Alert className="border-green-300 bg-green-50 rounded-lg">
                  <AlertDescription className="text-green-800">
                    Password reset successfully! Redirecting to login...
                  </AlertDescription>
                </Alert>
              </div>
            ) : error && !token ? (
              <div className="space-y-4 text-center">
                <div className="flex justify-center">
                  <div className="rounded-full bg-red-100 p-3">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                </div>
                <Alert variant="destructive" className="rounded-lg">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    onClick={() => router.push("/auth")}
                    className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Back to Login
                  </Button>
                </motion.div>
              </div>
            ) : (
              <form action={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="rounded-lg">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    New Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Enter new password"
                    disabled={isLoading}
                    minLength={6}
                    className="h-11 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    placeholder="Confirm new password"
                    disabled={isLoading}
                    minLength={6}
                    className="h-11 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="text-xs text-gray-600">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Password must be at least 6 characters long</li>
                    <li>Use a combination of letters, numbers, and symbols</li>
                  </ul>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting Password...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </motion.div>
                
                <div className="text-center">
                  <Button 
                    variant="link" 
                    onClick={() => router.push("/auth")}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Back to Login
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}