"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { signupCustomer } from "@/app/actions/auth"
import { motion } from "framer-motion"

interface SingUpFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  acceptsMarketing: boolean
}

export function SignupForm({ onSignupSuccess }: { onSignupSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<SingUpFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      acceptsMarketing: false
    }
  })

  const onSubmit = async (data: SingUpFormData) => {
    setIsLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("email", data.email)
      formData.append("password", data.password)
      formData.append("firstName", data.firstName)
      formData.append("lastName", data.lastName)
      formData.append("acceptsMarketing", data.acceptsMarketing ? "on" : "off")
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            type="text"
            placeholder="John"
            className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
            {...register("firstName", {
              required: "First name is required",
              maxLength: {
                value: 50,
                message: "First name cannot exceed 50 characters"
              },
            })}
          />
          {errors.firstName && (
            <p className="text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>
        <div className="space-y-3">
          <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
            Last Name
          </Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Doe"
            className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
            {...register("lastName", {
              required: "Last name is required",
              maxLength: {
                value: 50,
                message: "Last name cannot exceed 50 characters"
              },
            })}
          />
          {errors.lastName && (
            <p className="text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>
      </div>
      <div className="space-y-3">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </Label>
        <Input
          id="email"
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
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </Label>
        <Input
          id="password"
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

      <div className="flex items-center space-x-2">
        <Checkbox id="acceptsMarketing" {...register("acceptsMarketing")} />
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