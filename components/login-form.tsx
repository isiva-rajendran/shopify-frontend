"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { loginCustomer } from "@/app/actions/auth"
import Link from "next/link"
import { motion } from "framer-motion"

interface LoginFormData {
  email: string
  password: string
}

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError("")
    
    try {
      const formData = new FormData()
      formData.append("email", data.email)
      formData.append("password", data.password)
      
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          type="email"
          placeholder="john@example.com"
          disabled={isLoading}
          className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Please enter a valid email address"
            }
          })}
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="loginPassword" className="text-sm font-medium text-gray-700">
          Password
        </Label>
        <Input
          id="loginPassword"
          type="password"
          placeholder="••••••••"
          disabled={isLoading}
          className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long"
            }
          })}
        />
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
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