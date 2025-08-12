"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, CheckCircle, Mail } from "lucide-react"
import { forgotPassword } from "@/app/actions/auth"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"

type FormValues = {
  email: string
}

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormValues>()

  async function onSubmit(data: FormValues) {
    setIsLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("email", data.email)

      const result = await forgotPassword(formData)

      if (result.success) {
        setSuccess(true)
        setEmail(data.email)
        reset()
      } else {
        setError(result.error || "Failed to send reset email")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <Mail className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900">
            Forgot Password?
          </h2>
          <p className="mt-3 text-base text-gray-500">
            No worries, we'll send you reset instructions
          </p>
        </div>

        <Card className="w-full shadow-lg rounded-xl border border-gray-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">Reset Your Password</CardTitle>
            <CardDescription className="text-gray-500">
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {success ? (
              <div className="space-y-6 text-center">
                <div className="flex justify-center">
                  <div className="rounded-full bg-green-100 p-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-900">Check your email</h3>
                  <p className="text-sm text-gray-600">We sent a password reset link to</p>
                  <p className="text-sm font-medium text-gray-900">{email}</p>
                </div>

                <Alert className="border-green-300 bg-green-50 rounded-lg">
                  <AlertDescription className="text-green-800">
                    <strong>Didn't receive the email?</strong>
                    <br />
                    Check your spam folder or try again with a different email address.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => {
                        setSuccess(false)
                        setEmail("")
                        setError("")
                      }}
                      variant="outline"
                      className="w-full rounded-lg border-gray-300 hover:bg-gray-100"
                    >
                      Try another email
                    </Button>
                  </motion.div>

                  <Link href="/auth" className="block">
                    <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-800">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <Link
                  href="/auth"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <ArrowLeft className="mr-1 h-3 w-3" />
                  Back to Login
                </Link>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {error && (
                    <Alert variant="destructive" className="rounded-lg">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      disabled={isLoading}
                      className="h-11 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Please enter a valid email address"
                        }
                      })}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending Reset Link...
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </motion.div>
                </form>

                <div className="text-center text-sm text-gray-600">
                  <p>
                    Remember your password?{" "}
                    <Link
                      href="/auth"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
