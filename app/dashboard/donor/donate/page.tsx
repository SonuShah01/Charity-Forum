"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Heart, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const CATEGORIES = [
  "Clothing",
  "Electronics",
  "Furniture",
  "Books & Education",
  "Medical Supplies",
  "Food & Groceries",
  "Household Items",
  "Toys & Games",
  "Sports Equipment",
  "Other",
]

const conditions = [
  { value: "new", label: "New", description: "Never used, still in original packaging" },
  { value: "like-new", label: "Like New", description: "Used once or twice, excellent condition" },
  { value: "good", label: "Good", description: "Gently used, fully functional" },
  { value: "fair", label: "Fair", description: "Shows wear but still usable" },
]

export default function CreateDonationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    condition: "good" as "new" | "like-new" | "good" | "fair",
    quantity: 1,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("You must be logged in to submit a donation")
      }

      const { error: insertError } = await supabase
        .from('donations')
        .insert({
          donor_id: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          condition: formData.condition,
          quantity: formData.quantity,
          status: 'pending'
        })

      if (insertError) {
        throw insertError
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Failed to submit donation")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex flex-col">
        <header className="p-6">
          <Link
            href="/dashboard/donor"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </header>
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-md text-center border-border/50">
            <CardContent className="pt-10 pb-10">
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">Donation Submitted!</h2>
              <p className="text-muted-foreground mb-8">
                Thank you for your generosity. Our team will review your donation and match it with someone in need.
              </p>
              <div className="flex flex-col gap-3">
                <Link href="/dashboard/donor">
                  <Button className="w-full">View My Donations</Button>
                </Link>
                <Button
                  variant="outline"
                  className="bg-transparent"
                  onClick={() => {
                    setSuccess(false)
                    setFormData({ title: "", description: "", category: "", condition: "good", quantity: 1 })
                  }}
                >
                  Create Another Donation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <header className="p-6">
        <Link
          href="/dashboard/donor"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-2xl">
        <div className="text-center mb-10">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Heart className="h-7 w-7 text-primary fill-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Create a Donation</h1>
          <p className="text-muted-foreground">Share details about the items you'd like to donate.</p>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Donation Details</CardTitle>
            <CardDescription>
              Provide accurate information to help us match your donation with those in need.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Donation Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Winter Clothing Collection"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the items you're donating, including sizes, brands, or any other relevant details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) || 1 })}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-3">
                <Label>Condition</Label>
                <RadioGroup
                  value={formData.condition}
                  onValueChange={(value) => setFormData({ ...formData, condition: value as typeof formData.condition })}
                  className="grid gap-3"
                >
                  {conditions.map((condition) => (
                    <div key={condition.value}>
                      <RadioGroupItem value={condition.value} id={condition.value} className="peer sr-only" />
                      <Label
                        htmlFor={condition.value}
                        className="flex items-start gap-4 rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent/50 hover:border-primary/30 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                      >
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary flex items-center justify-center shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold">{condition.label}</div>
                          <div className="text-sm text-muted-foreground">{condition.description}</div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</div>}

              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Donation"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
