"use client"

import { useState } from "react"
import { SignupForm } from "@/components/signup-form"
import { LoginForm } from "@/components/login-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion" // Added for animations

export default function AuthPageClient() {
  const [activeTab, setActiveTab] = useState("login")

  // Callback to switch to login tab
  const handleSignupSuccess = () => {
    setActiveTab("login")
  }

  return (
    <div className="min-h-screen flex  justify-center bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900">
            Welcome to Our Store
          </h2>
          <p className="mt-3 text-base text-gray-500">
            Sign in to your account or create a new one to start shopping
          </p>
        </div>

        <Card className="w-full shadow-lg rounded-xl border border-gray-200">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 h-14 rounded-t-xl">
              <TabsTrigger
                value="login"
                className="py-3 text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="py-3 text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="p-6">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-semibold">Sign In</CardTitle>
              </CardHeader>
              <CardContent>
                <LoginForm />
              </CardContent>
            </TabsContent>

            <TabsContent value="signup" className="p-6">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-semibold">Create Account</CardTitle>
              </CardHeader>
              <CardContent>
                <SignupForm onSignupSuccess={handleSignupSuccess} />
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  )
}