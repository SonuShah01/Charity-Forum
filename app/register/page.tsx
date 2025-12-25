"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Heart, ArrowLeft, Loader2, HandHeart, Building2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get("role") as "donor" | "beneficiary" | null

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: defaultRole || ("donor" as "donor" | "beneficiary"),
    organization: "",
    phone: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // ...
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // 1. Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            role: formData.role,
          },
        },
      })

      if (authError) throw authError

      if (authData.user) {
        // 2. Insert into profiles table
        // Note: If you have a trigger on auth.users for profile creation, this might be redundant or fail.
        // However, based on our schema we plan to insert manually or update if trigger exists.
        // Our schema has RLS allowing insert if auth.uid() = id.

        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          email: formData.email,
          name: formData.name,
          role: formData.role,
          organization: formData.role === 'beneficiary' ? formData.organization : null,
          phone: formData.phone || null
        })

        if (profileError) {
          // If trigger created it, maybe update? Or ignore if duplicate key.
          // For simplicity, let's assume we need to insert it.
          console.error("Profile creation error:", profileError)
          // If error is duplicate key, it means trigger handled it, so we update fields
          if (profileError.code === '23505') {
            await supabase.from("profiles").update({
              name: formData.name,
              role: formData.role,
              organization: formData.role === 'beneficiary' ? formData.organization : null,
              phone: formData.phone || null
            }).eq('id', authData.user.id)
          } else {
            throw profileError
          }
        }

        router.refresh()
        // Redirect based on role
        if (formData.role === "donor") {
          router.push("/dashboard/donor")
        } else {
          router.push("/dashboard/beneficiary")
        }
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex flex-col">
      <header className="p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-6 py-8">
        <Card className="w-full max-w-md border-border/50">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Heart className="h-7 w-7 text-primary fill-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
            <CardDescription>Join GiveHope and start making a difference</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selection */}
              <div className="space-y-3">
                <Label>I want to</Label>
                <RadioGroup
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as "donor" | "beneficiary" })}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem value="donor" id="donor" className="peer sr-only" />
                    <Label
                      htmlFor="donor"
                      className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-5 hover:bg-accent/50 hover:border-primary/30 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                    >
                      <HandHeart className="h-7 w-7 mb-2 text-primary" />
                      <span className="font-semibold">Donate Items</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="beneficiary" id="beneficiary" className="peer sr-only" />
                    <Label
                      htmlFor="beneficiary"
                      className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-5 hover:bg-accent/50 hover:border-primary/30 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                    >
                      <Building2 className="h-7 w-7 mb-2 text-primary" />
                      <span className="font-semibold">Request Help</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">
                  {formData.role === "beneficiary" ? "Full Name / Organization Contact" : "Full Name"}
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-11"
                />
              </div>

              {formData.role === "beneficiary" && (
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization Name (if applicable)</Label>
                  <Input
                    id="organization"
                    placeholder="e.g., Hope Foundation NGO"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="h-11"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  className="h-11"
                />
              </div>

              {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</div>}

              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
